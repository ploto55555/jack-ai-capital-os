#!/usr/bin/env python3
"""Audit the Step 36.1 $500 -> $100k capital path.

Personal research support only. No broker connection and no order placement.

Input columns:
trade_no,date,pair,result,r,risk_pct,zero_duration

The audit reproduces the recorded fixed-fraction path and stresses full-target
trades whose entry and exit timestamps were equal in the source workbook.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

import pandas as pd


START_EQUITY = 500.0
TARGET_EQUITY = 100_000.0


@dataclass(frozen=True)
class PathResult:
    final_equity: float
    max_drawdown_pct: float
    hit_target: bool
    hit_trade_no: int | None
    hit_date: str | None


def run_path(trades: pd.DataFrame) -> PathResult:
    equity = START_EQUITY
    peak = START_EQUITY
    max_drawdown = 0.0
    hit_trade_no: int | None = None
    hit_date: str | None = None

    for row in trades.sort_values("trade_no").itertuples(index=False):
        equity *= 1.0 + float(row.risk_pct) * float(row.r)
        peak = max(peak, equity)
        if peak > 0:
            max_drawdown = max(max_drawdown, (peak - equity) / peak)
        if hit_trade_no is None and equity >= TARGET_EQUITY:
            hit_trade_no = int(row.trade_no)
            hit_date = str(row.date)

    return PathResult(
        final_equity=equity,
        max_drawdown_pct=100.0 * max_drawdown,
        hit_target=hit_trade_no is not None,
        hit_trade_no=hit_trade_no,
        hit_date=hit_date,
    )


def scenario(trades: pd.DataFrame, name: str) -> pd.DataFrame:
    out = trades.copy()
    ambiguous = (
        out["zero_duration"].astype(str).str.lower().eq("true")
        & out["result"].eq("tp")
    )

    if name == "recorded":
        return out
    if name == "drop_zero_duration_tp":
        return out.loc[~ambiguous].copy()
    if name == "zero_duration_tp_to_lock":
        out.loc[ambiguous, "result"] = "lock_stress"
        out.loc[ambiguous, "r"] = 0.4286
        return out
    if name == "zero_duration_tp_to_loss":
        out.loc[ambiguous, "result"] = "sl_stress"
        out.loc[ambiguous, "r"] = -1.0
        return out
    raise ValueError(f"Unknown scenario: {name}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--input",
        type=Path,
        default=Path(
            "research/active/capital_path_500_to_100k_v0_1/"
            "step36_1_window_2025_04_to_2026_04.csv"
        ),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path(
            "research/active/capital_path_500_to_100k_v0_1/"
            "step36_1_edge_audit_scenarios.csv"
        ),
    )
    args = parser.parse_args()

    trades = pd.read_csv(args.input)
    required = {
        "trade_no", "date", "pair", "result", "r", "risk_pct", "zero_duration"
    }
    missing = required - set(trades.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")

    scenario_names = [
        "recorded",
        "drop_zero_duration_tp",
        "zero_duration_tp_to_lock",
        "zero_duration_tp_to_loss",
    ]
    rows: list[dict[str, object]] = []
    for name in scenario_names:
        stressed = scenario(trades, name)
        result = run_path(stressed)
        ambiguous_count = int(
            (
                trades["zero_duration"].astype(str).str.lower().eq("true")
                & trades["result"].eq("tp")
            ).sum()
        )
        rows.append(
            {
                "scenario": name,
                "trades": len(stressed),
                "ambiguous_zero_duration_tp": ambiguous_count,
                "final_equity": round(result.final_equity, 2),
                "max_drawdown_pct": round(result.max_drawdown_pct, 4),
                "hit_100k": result.hit_target,
                "hit_trade_no": result.hit_trade_no,
                "hit_date": result.hit_date,
            }
        )

    report = pd.DataFrame(rows)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    report.to_csv(args.output, index=False)
    print(report.to_string(index=False))


if __name__ == "__main__":
    main()
