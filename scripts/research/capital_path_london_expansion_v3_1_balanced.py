#!/usr/bin/env python3
"""V3.1 family-balanced selector for the V3 causal research engine."""
from __future__ import annotations

import importlib.util
import itertools
from pathlib import Path

import pandas as pd

ENGINE_PATH = Path(__file__).with_name("capital_path_london_expansion_multi_engine_v3.py")
spec = importlib.util.spec_from_file_location("capital_path_v3_engine", ENGINE_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError(f"Unable to load V3 engine from {ENGINE_PATH}")
v3 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v3)


def balanced_research_symbol(x, sym, outdir):
    base_cfgs = list(
        itertools.product(
            ["ASIA_BREAK", "PD_BREAK", "COMP_BREAK", "ASIA_SWEEP", "MOMENTUM"],
            [6, 7, 8],
            ["h4_d1", "h4", "none"],
            [.25, .40, .60],
            ["fixed", "wide", "signal", "swing8"],
        )
    )
    stage = []
    entry_cache = {}
    for fam, ss, bias, imp, stop in base_cfgs:
        cfg = (fam, ss, bias, imp)
        entries = v3.entries(x, sym, cfg, stop)
        key = f"{fam}|{ss}|{bias}|{imp}|{stop}"
        entry_cache[key] = entries
        trades = v3.sim(entries, x, sym, 6.0, 1.0, 0.5, 64)
        stage.append(
            v3.row_metrics(
                dict(
                    engine_key=key,
                    family=fam,
                    session_start=ss,
                    bias=bias,
                    impulse=imp,
                    stop_mode=stop,
                    target_r=6.0,
                    lock_trigger=1.0,
                    lock_to=0.5,
                    hold=64,
                ),
                trades,
            )
        )

    stage1 = pd.DataFrame(stage)
    stage1["screen"] = stage1.apply(
        lambda r: min(r.DEV_exp, r.VAL_exp)
        + 0.012 * min(r.DEV_ppy, r.VAL_ppy)
        + 0.20 * min(r.DEV_tp, r.VAL_tp),
        axis=1,
    )

    # Critical V3.1 repair: send the best three candidates from every setup
    # family to exit optimisation. High-frequency Momentum can no longer crowd
    # out Compression, Asia Break, Previous-Day Break or Sweep/Reclaim.
    top = (
        stage1.sort_values("screen", ascending=False)
        .groupby("family", group_keys=False)
        .head(3)
        .sort_values("screen", ascending=False)
    )

    exits = list(
        itertools.product(
            [4.0, 5.0, 6.0, 7.0],
            [0.75, 1.0, 1.5],
            [0.25, 0.5],
            [32, 64],
        )
    )
    rows = []
    cache = {}
    for base in top.itertuples(index=False):
        entries = entry_cache[base.engine_key]
        for exit_cfg in exits:
            trades = v3.sim(entries, x, sym, *exit_cfg)
            key = (
                f"{base.engine_key}|{exit_cfg[0]}|{exit_cfg[1]}|"
                f"{exit_cfg[2]}|{exit_cfg[3]}"
            )
            cache[key] = trades
            meta = dict(
                engine_key=key,
                family=base.family,
                session_start=base.session_start,
                bias=base.bias,
                impulse=base.impulse,
                stop_mode=base.stop_mode,
                target_r=exit_cfg[0],
                lock_trigger=exit_cfg[1],
                lock_to=exit_cfg[2],
                hold=exit_cfg[3],
            )
            rows.append(v3.row_metrics(meta, trades))

    stage2 = pd.DataFrame(rows)
    selected, portfolio, passed = v3.select_engines(stage2, cache)
    stage1.to_csv(outdir / f"{sym}_stage1.csv", index=False)
    stage2.to_csv(outdir / f"{sym}_stage2.csv", index=False)
    pd.DataFrame([r._asdict() for r in selected]).to_csv(
        outdir / f"{sym}_selected_engines.csv", index=False
    )
    portfolio.to_csv(outdir / f"{sym}_portfolio_trades.csv", index=False)
    return selected, portfolio, passed


v3.research_symbol = balanced_research_symbol

if __name__ == "__main__":
    v3.main()
