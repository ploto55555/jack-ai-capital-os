from __future__ import annotations

import argparse
from dataclasses import asdict
from pathlib import Path

import pandas as pd

from backtest_april_campaign_v2 import (
    Leg,
    PIP,
    ROUND_TRIP_COST_PIPS,
    add_indicators,
    build_signals,
    load_m1,
    make_bars,
    max_closed_trade_drawdown,
)

START = "2025-04-01"
END = "2025-04-30 23:59:59"


def run_full_april(m1: pd.DataFrame) -> tuple[pd.DataFrame, int]:
    m5 = add_indicators(make_bars(m1, "5min"))
    m15 = add_indicators(make_bars(m1, "15min"))
    h1 = add_indicators(make_bars(m1, "1h"))
    h4 = add_indicators(make_bars(m1, "4h"))
    context = build_signals(m5, m15, h1, h4)

    focus = m1.loc[START:END]
    focus_context = context.loc[START:END]
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

    return pd.DataFrame(records), int(focus_context["entry_signal"].sum())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("--output", type=Path, default=Path("outputs/april_full_v2"))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    trades, raw_signal_count = run_full_april(load_m1(args.zip_path))
    trades.to_csv(args.output / "april_2025_trades.csv", index=False)

    wins = trades.loc[trades["net_pips"] > 0, "net_pips"]
    losses = trades.loc[trades["net_pips"] < 0, "net_pips"]
    summary = pd.DataFrame([{
        "model": "Bear Expansion Campaign V2 frozen rules",
        "window": "2025-04-01 through 2025-04-30",
        "raw_entry_signals": raw_signal_count,
        "legs": len(trades),
        "core_legs": int((trades["leg"] == "CORE").sum()),
        "add_on_legs": int(trades["leg"].str.startswith("ADD").sum()),
        "weighted_gross_pips": float(trades["weighted_gross_pips"].sum()),
        "cost_pips": float(trades["cost_pips"].sum()),
        "net_pips": float(trades["net_pips"].sum()),
        "win_rate": float((trades["net_pips"] > 0).mean()),
        "profit_factor": float(wins.sum() / abs(losses.sum())),
        "expectancy_pips_per_leg": float(trades["net_pips"].mean()),
        "max_closed_trade_drawdown_pips": max_closed_trade_drawdown(trades["net_pips"]),
    }])
    summary.to_csv(args.output / "summary.csv", index=False)
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
