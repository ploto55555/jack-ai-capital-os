from __future__ import annotations

import argparse
import zipfile
from dataclasses import dataclass
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

    frame = frame.set_index("timestamp")
    return frame[["open", "high", "low", "close", "volume"]]


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
    tr = pd.concat(
        [
            result["high"] - result["low"],
            (result["high"] - result["close"].shift()).abs(),
            (result["low"] - result["close"].shift()).abs(),
        ],
        axis=1,
    ).max(axis=1)
    result["atr14"] = tr.rolling(14, min_periods=14).mean()
    result["prior20low"] = result["low"].shift(1).rolling(20, min_periods=20).min()
    result["prior5high"] = result["high"].shift(1).rolling(5, min_periods=5).max()
    return result


@dataclass
class Leg:
    campaign: int
    leg_type: str
    signal_time: pd.Timestamp
    entry_time: pd.Timestamp
    entry: float
    stop: float
    r_pips: float
    tactical_exit_time: pd.Timestamp | None = None
    tactical_exit: float | None = None
    tactical_reason: str = ""
    runner_exit_time: pd.Timestamp | None = None
    runner_exit: float | None = None
    runner_reason: str = ""


def latest_row(frame: pd.DataFrame, timestamp: pd.Timestamp) -> pd.Series:
    return frame.loc[:timestamp].iloc[-1]


def build_signals(m15: pd.DataFrame, h1: pd.DataFrame, h4: pd.DataFrame) -> pd.DataFrame:
    context = pd.DataFrame(index=m15.index)
    for prefix, source, columns in [
        ("h4", h4, ["close", "sma200", "ema20"]),
        ("h1", h1, ["close", "ema20"]),
    ]:
        for column in columns:
            context[f"{prefix}_{column}"] = source[column].reindex(
                context.index, method="ffill"
            )

    context = context.join(m15.add_prefix("m15_"))
    context["bear_state"] = (
        (context["h4_close"] < context["h4_sma200"])
        & (context["h4_close"] < context["h4_ema20"])
        & (context["h1_close"] < context["h1_ema20"])
    )
    context["acceptance_bar"] = (
        (context["m15_close"] < context["m15_bb1l"])
        & (context["m15_close"] < context["m15_ema20"])
    )
    context["two_bar_acceptance"] = (
        context["acceptance_bar"]
        & context["acceptance_bar"].shift(1).fillna(False).astype(bool)
    )
    context["break_prior20_low"] = (
        context["m15_close"] < context["m15_prior20low"]
    )
    raw = (
        context["bear_state"]
        & context["two_bar_acceptance"]
        & context["break_prior20_low"]
    )
    context["entry_signal"] = raw & ~raw.shift(1).fillna(False).astype(bool)
    return context


def run_backtest(m1: pd.DataFrame) -> pd.DataFrame:
    m5 = add_indicators(make_bars(m1, "5min"))
    m15 = add_indicators(make_bars(m1, "15min"))
    h1 = add_indicators(make_bars(m1, "1h"))
    h4 = add_indicators(make_bars(m1, "4h"))
    signals = build_signals(m15, h1, h4)

    focus = m1.loc["2025-04-03":"2025-04-09 23:59:59"]
    focus_signals = signals.loc["2025-04-03":"2025-04-09 23:59:59"]
    signal_times = set(focus_signals.index[focus_signals["entry_signal"]])

    active = False
    campaign_id = 0
    add_count = 0
    core_entry = None
    core_r = None
    last_signal = None
    open_legs: list[Leg] = []
    all_legs: list[Leg] = []

    for timestamp, bar in focus.iterrows():
        for leg in list(open_legs):
            if leg.tactical_exit_time is None:
                target = leg.entry - 2 * leg.r_pips * PIP
                if bar["high"] >= leg.stop:
                    leg.tactical_exit_time = timestamp
                    leg.tactical_exit = leg.stop
                    leg.tactical_reason = "STOP"
                elif bar["low"] <= target:
                    leg.tactical_exit_time = timestamp
                    leg.tactical_exit = target
                    leg.tactical_reason = "2R_TARGET"

            if leg.runner_exit_time is None:
                if bar["high"] >= leg.stop:
                    leg.runner_exit_time = timestamp
                    leg.runner_exit = leg.stop
                    leg.runner_reason = "STOP"
                elif timestamp.minute == 0:
                    h1_row = latest_row(h1, timestamp)
                    if h1_row["close"] > h1_row["ema20"]:
                        leg.runner_exit_time = timestamp
                        leg.runner_exit = float(bar["open"])
                        leg.runner_reason = "H1_EMA20_EXIT"

            if leg.tactical_exit_time is not None and leg.runner_exit_time is not None:
                open_legs.remove(leg)

        if active and not open_legs:
            active = False
            add_count = 0
            core_entry = None
            core_r = None

        if timestamp not in signal_times:
            continue

        if not active:
            campaign_id += 1
            active = True
            leg_type = "CORE"
            add_count = 0
        else:
            sufficiently_spaced = (
                last_signal is None
                or timestamp - last_signal >= pd.Timedelta(minutes=60)
            )
            sufficiently_profitable = (
                core_entry is not None
                and core_r is not None
                and bar["open"] <= core_entry - 0.5 * core_r * PIP
            )
            if add_count >= 3 or not sufficiently_spaced or not sufficiently_profitable:
                last_signal = timestamp
                continue
            add_count += 1
            leg_type = f"ADD{add_count}"

        m5_row = latest_row(m5, timestamp)
        atr_pips = float(m5_row["atr14"] / PIP)
        structural_pips = float(m5_row["prior5high"] - bar["open"]) / PIP + 5.0
        stop_distance = max(25.0, min(80.0, max(1.5 * atr_pips, structural_pips)))
        stop = float(bar["open"] + stop_distance * PIP)

        leg = Leg(
            campaign=campaign_id,
            leg_type=leg_type,
            signal_time=timestamp,
            entry_time=timestamp,
            entry=float(bar["open"]),
            stop=stop,
            r_pips=stop_distance,
        )
        open_legs.append(leg)
        all_legs.append(leg)

        if leg_type == "CORE":
            core_entry = leg.entry
            core_r = leg.r_pips
        last_signal = timestamp

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
        weighted_gross = 0.70 * tactical_gross + 0.30 * runner_gross
        net = weighted_gross - ROUND_TRIP_COST_PIPS
        records.append(
            {
                "campaign": leg.campaign,
                "leg": leg.leg_type,
                "signal_time": leg.signal_time,
                "entry_time": leg.entry_time,
                "entry": leg.entry,
                "stop": leg.stop,
                "initial_risk_pips": leg.r_pips,
                "tactical_exit_time": leg.tactical_exit_time,
                "tactical_exit": leg.tactical_exit,
                "tactical_reason": leg.tactical_reason,
                "tactical_gross_pips": tactical_gross,
                "runner_exit_time": leg.runner_exit_time,
                "runner_exit": leg.runner_exit,
                "runner_reason": leg.runner_reason,
                "runner_gross_pips": runner_gross,
                "weighted_gross_pips": weighted_gross,
                "cost_pips": ROUND_TRIP_COST_PIPS,
                "net_pips": net,
            }
        )

    return pd.DataFrame(records)


def max_closed_trade_drawdown(net_pips: pd.Series) -> float:
    equity = net_pips.cumsum()
    peak = equity.cummax().clip(lower=0)
    return float((equity - peak).min())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("--output", type=Path, default=Path("outputs/campaign_v1"))
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    m1 = load_m1(args.zip_path)
    trades = run_backtest(m1)
    trades.to_csv(args.output / "april_03_09_trades.csv", index=False)

    summary = pd.DataFrame(
        [
            {
                "model": "Bear Expansion Campaign V1",
                "window": "2025-04-03 through 2025-04-09",
                "legs": len(trades),
                "campaigns": int(trades["campaign"].nunique()) if len(trades) else 0,
                "core_legs": int((trades["leg"] == "CORE").sum()) if len(trades) else 0,
                "add_on_legs": int(trades["leg"].str.startswith("ADD").sum()) if len(trades) else 0,
                "weighted_gross_pips": float(trades["weighted_gross_pips"].sum()),
                "cost_pips": float(trades["cost_pips"].sum()),
                "net_pips": float(trades["net_pips"].sum()),
                "max_closed_trade_drawdown_pips": max_closed_trade_drawdown(trades["net_pips"]) if len(trades) else 0.0,
            }
        ]
    )
    summary.to_csv(args.output / "summary.csv", index=False)
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
