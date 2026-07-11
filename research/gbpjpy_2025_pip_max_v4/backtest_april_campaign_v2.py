from __future__ import annotations

import argparse
import zipfile
from dataclasses import asdict, dataclass
from pathlib import Path

import pandas as pd

COLUMNS = ["date", "time", "open", "high", "low", "close", "volume"]
PIP = 0.01
ROUND_TRIP_COST_PIPS = 3.0


def load_m1(zip_path: Path) -> pd.DataFrame:
    with zipfile.ZipFile(zip_path) as archive:
        csv_names = [n for n in archive.namelist() if n.lower().endswith(".csv")]
        if len(csv_names) != 1:
            raise ValueError(f"Expected one CSV, found {csv_names}")
        with archive.open(csv_names[0]) as handle:
            frame = pd.read_csv(handle, header=None, names=COLUMNS)

    frame["timestamp"] = pd.to_datetime(
        frame["date"] + " " + frame["time"], format="%Y.%m.%d %H:%M", errors="raise"
    )
    frame = frame.sort_values("timestamp")
    duplicate_groups = frame[frame.duplicated("timestamp", keep=False)]
    if not duplicate_groups.empty:
        conflicts = duplicate_groups.groupby("timestamp")[["open", "high", "low", "close"]].nunique()
        if (conflicts > 1).any(axis=None):
            raise ValueError("Conflicting OHLC values found at duplicate timestamps")
        frame = frame.drop_duplicates("timestamp", keep="first")
    return frame.set_index("timestamp")[["open", "high", "low", "close", "volume"]]


def make_bars(frame: pd.DataFrame, rule: str) -> pd.DataFrame:
    return frame.resample(
        rule, label="right", closed="left", origin="start_day"
    ).agg(
        open=("open", "first"),
        high=("high", "max"),
        low=("low", "min"),
        close=("close", "last"),
        volume=("volume", "sum"),
    ).dropna()


def add_indicators(frame: pd.DataFrame) -> pd.DataFrame:
    result = frame.copy()
    result["sma200"] = result["close"].rolling(200, min_periods=200).mean()
    result["ema20"] = result["close"].ewm(span=20, adjust=False).mean()
    result["std20"] = result["close"].rolling(20, min_periods=20).std(ddof=0)
    result["bb1l"] = result["ema20"] - result["std20"]
    result["bb2l"] = result["ema20"] - 2 * result["std20"]
    previous_close = result["close"].shift()
    tr = pd.concat(
        [
            result["high"] - result["low"],
            (result["high"] - previous_close).abs(),
            (result["low"] - previous_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    result["atr14"] = tr.rolling(14, min_periods=14).mean()
    result["prior6high"] = result["high"].shift(1).rolling(6, min_periods=6).max()
    return result


def build_signals(m5: pd.DataFrame, m15: pd.DataFrame, h1: pd.DataFrame, h4: pd.DataFrame) -> pd.DataFrame:
    context = pd.DataFrame(index=m5.index)
    for prefix, source, columns in [
        ("h4", h4, ["close", "sma200", "ema20"]),
        ("h1", h1, ["close", "ema20"]),
        ("m15", m15, ["close", "ema20", "bb1l", "atr14"]),
    ]:
        for column in columns:
            context[f"{prefix}_{column}"] = source[column].reindex(context.index, method="ffill")
    context = context.join(m5.add_prefix("m5_"))

    context["bear_state"] = (
        (context["h4_close"] < context["h4_sma200"])
        & (context["h4_close"] < context["h4_ema20"])
        & (context["h1_close"] < context["h1_ema20"])
    )
    context["m15_acceptance"] = context["m15_close"] < context["m15_bb1l"]
    context["pullback_touch"] = (
        context["m5_high"].shift(1) >= context["m5_bb1l"].shift(1)
    )
    context["bear_rejection"] = (
        (context["m5_close"] < context["m5_open"])
        & (context["m5_close"] < context["m5_low"].shift(1))
        & (context["m5_close"] < context["m5_bb1l"])
    )
    distance_atr = (context["m15_ema20"] - context["m5_close"]) / context["m15_atr14"]
    context["not_chasing"] = distance_atr <= 1.5
    context["entry_signal"] = (
        context["bear_state"]
        & context["m15_acceptance"]
        & context["pullback_touch"]
        & context["bear_rejection"]
        & context["not_chasing"]
    )
    return context


@dataclass
class Leg:
    leg: str
    signal_time: pd.Timestamp
    entry_time: pd.Timestamp
    entry: float
    initial_stop: float
    current_stop: float
    initial_risk_pips: float
    tactical_exit_time: pd.Timestamp | None = None
    tactical_exit: float | None = None
    tactical_reason: str = ""
    runner_exit_time: pd.Timestamp | None = None
    runner_exit: float | None = None
    runner_reason: str = ""
    protected: bool = False


def run_backtest(m1: pd.DataFrame) -> pd.DataFrame:
    m5 = add_indicators(make_bars(m1, "5min"))
    m15 = add_indicators(make_bars(m1, "15min"))
    h1 = add_indicators(make_bars(m1, "1h"))
    h4 = add_indicators(make_bars(m1, "4h"))
    context = build_signals(m5, m15, h1, h4)

    focus = m1.loc["2025-04-03":"2025-04-09 23:59:59"]
    focus_context = context.loc["2025-04-03":"2025-04-09 23:59:59"]
    signal_times = set(focus_context.index[focus_context["entry_signal"]])

    open_legs: list[Leg] = []
    all_legs: list[Leg] = []
    core_attempts = 0
    add_count = 0
    cooldown_until = pd.Timestamp.min
    last_entry_time: pd.Timestamp | None = None

    for timestamp, bar in focus.iterrows():
        for leg in list(open_legs):
            if not leg.protected and bar["low"] <= leg.entry - leg.initial_risk_pips * PIP:
                leg.current_stop = min(leg.current_stop, leg.entry)
                leg.protected = True

            if leg.tactical_exit_time is None:
                target = leg.entry - 2 * leg.initial_risk_pips * PIP
                if bar["high"] >= leg.current_stop:
                    leg.tactical_exit_time = timestamp
                    leg.tactical_exit = leg.current_stop
                    leg.tactical_reason = "STOP_OR_BE"
                elif bar["low"] <= target:
                    leg.tactical_exit_time = timestamp
                    leg.tactical_exit = target
                    leg.tactical_reason = "2R_TARGET"

            if leg.runner_exit_time is None:
                if bar["high"] >= leg.current_stop:
                    leg.runner_exit_time = timestamp
                    leg.runner_exit = leg.current_stop
                    leg.runner_reason = "STOP_OR_BE"
                elif timestamp.minute == 0:
                    h1_row = h1.loc[:timestamp].iloc[-1]
                    if h1_row["close"] > h1_row["ema20"]:
                        leg.runner_exit_time = timestamp
                        leg.runner_exit = float(bar["open"])
                        leg.runner_reason = "H1_EMA20_EXIT"

            if leg.tactical_exit_time is not None and leg.runner_exit_time is not None:
                open_legs.remove(leg)
                if leg.leg == "CORE" and not leg.protected:
                    cooldown_until = timestamp + pd.Timedelta(hours=6)

        if timestamp not in signal_times or timestamp < cooldown_until:
            continue

        cores = [leg for leg in all_legs if leg.leg == "CORE"]
        latest_core = cores[-1] if cores else None
        can_add = (
            latest_core is not None
            and latest_core.protected
            and add_count < 2
            and (last_entry_time is None or timestamp - last_entry_time >= pd.Timedelta(hours=1))
        )

        if latest_core is None or (
            latest_core.runner_exit_time is not None
            and latest_core.runner_reason == "STOP_OR_BE"
            and core_attempts < 2
        ):
            leg_name = "CORE"
            core_attempts += 1
            add_count = 0
        elif can_add:
            add_count += 1
            leg_name = f"ADD{add_count}"
        else:
            continue

        m5_row = m5.loc[:timestamp].iloc[-1]
        structural_pips = (float(m5_row["prior6high"]) - float(bar["open"])) / PIP + 5.0
        atr_pips = 1.5 * float(m5_row["atr14"]) / PIP
        stop_distance = max(25.0, min(80.0, max(structural_pips, atr_pips)))
        stop = float(bar["open"] + stop_distance * PIP)

        leg = Leg(
            leg=leg_name,
            signal_time=timestamp,
            entry_time=timestamp,
            entry=float(bar["open"]),
            initial_stop=stop,
            current_stop=stop,
            initial_risk_pips=stop_distance,
        )
        open_legs.append(leg)
        all_legs.append(leg)
        last_entry_time = timestamp

    final_time = focus.index[-1]
    final_close = float(focus.iloc[-1]["close"])
    for leg in open_legs:
        if leg.tactical_exit_time is None:
            leg.tactical_exit_time = final_time
            leg.tactical_exit = final_close
            leg.tactical_reason = "WINDOW_END"
        if leg.runner_exit_time is None:
            leg.runner_exit_time = final_time
            leg.runner_exit = final_close
            leg.runner_reason = "WINDOW_END"

    records = []
    for leg in all_legs:
        tactical_gross = (leg.entry - float(leg.tactical_exit)) / PIP
        runner_gross = (leg.entry - float(leg.runner_exit)) / PIP
        weighted_gross = 0.5 * tactical_gross + 0.5 * runner_gross
        record = asdict(leg)
        record.update(
            tactical_gross_pips=tactical_gross,
            runner_gross_pips=runner_gross,
            weighted_gross_pips=weighted_gross,
            cost_pips=ROUND_TRIP_COST_PIPS,
            net_pips=weighted_gross - ROUND_TRIP_COST_PIPS,
        )
        records.append(record)
    return pd.DataFrame(records)


def max_closed_trade_drawdown(net_pips: pd.Series) -> float:
    equity = net_pips.cumsum()
    peak = equity.cummax().clip(lower=0)
    return float((equity - peak).min())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("--output", type=Path, default=Path("outputs/campaign_v2"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    trades = run_backtest(load_m1(args.zip_path))
    trades.to_csv(args.output / "april_03_09_trades.csv", index=False)
    summary = pd.DataFrame([
        {
            "model": "Bear Expansion Campaign V2",
            "window": "2025-04-03 through 2025-04-09",
            "legs": len(trades),
            "core_legs": int((trades["leg"] == "CORE").sum()) if len(trades) else 0,
            "add_on_legs": int(trades["leg"].str.startswith("ADD").sum()) if len(trades) else 0,
            "weighted_gross_pips": float(trades["weighted_gross_pips"].sum()),
            "cost_pips": float(trades["cost_pips"].sum()),
            "net_pips": float(trades["net_pips"].sum()),
            "max_closed_trade_drawdown_pips": max_closed_trade_drawdown(trades["net_pips"]) if len(trades) else 0.0,
        }
    ])
    summary.to_csv(args.output / "summary.csv", index=False)
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
