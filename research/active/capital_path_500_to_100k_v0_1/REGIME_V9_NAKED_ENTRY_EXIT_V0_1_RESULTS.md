# REGIME V9 NAKED ENTRY / EXIT V0.1 — Results

Date: 2026-07-10
Status: `[REJECTED AS GENERIC RECONSTRUCTION]`

## Research intent

Preserve the broader Regime V8/V9 direction concept while replacing the entry and exit layer with objective naked-price-action rules based on:

- support / resistance;
- breakout and first retest;
- Fibonacci pullback and reclaim;
- liquidity sweep and reclaim;
- structural stops;
- profit lock and H1 structure trailing.

This was not an exact rerun of the historical V8/V9 generator because the exact signal-generation source code was not found in the canonical GitHub branch. The available File Library items include trade outputs and setup summaries, but not the exact reproducible generator.

## Data and methodology

Pair: GBPJPY

Data used:

- H4 context: 2010-06-24 to 2026-07-08;
- H1 signal layer: 2010-06-24 to 2026-07-08;
- M15 execution layer: 2022-07-04 to 2026-07-08.

Research split:

- IS: 2022-07 through 2023-12;
- VAL: 2024;
- OOS: 2025 through 2026-07.

Execution rules:

- spread column included;
- one open campaign at a time;
- 48-hour cooldown after campaign exit;
- no repeated entries counted as separate simultaneous positions;
- structural stop restricted to 8–80 pips;
- conservative same-bar ordering: existing stop is checked before a new intrabar lock or trail activation.

## Entry families tested

### PA-A — first breakout retest

- H1 break of prior 40-bar support / resistance;
- H4 price-action direction filter;
- first retest within a fixed window;
- rejection wick and close back beyond the level;
- either next-M15 entry or M15 break of the trigger candle.

Best result:

- 100 campaigns;
- about 25 campaigns per year;
- win rate 22.00%;
- Profit Factor 0.8462;
- expectancy -0.1200R;
- total -12R;
- total -22.67 pips;
- IS -0.1724R/trade;
- VAL -0.0968R/trade;
- OOS -0.1000R/trade.

### PA-B — Fibonacci plus support / resistance reclaim

- H1 breakout impulse;
- objective impulse anchor from prior 20 H1 bars;
- retracement into 50%–78.6%;
- reclaim around 61.8%;
- rejection candle;
- H4 direction or neutral context.

Best result:

- 195 campaigns;
- about 48.75 campaigns per year;
- win rate 22.05%;
- Profit Factor 0.8487;
- expectancy -0.1179R;
- total -23R;
- total -304.06 pips;
- IS -0.0649R/trade;
- VAL -0.1489R/trade;
- OOS -0.1549R/trade.

Entry-quality observations:

- 59.49% reached at least +0.5R before exit;
- 42.56% reached at least +1R;
- 33.33% reached at least +1.5R;
- 28.21% reached at least +2R;
- 22.56% reached +3R;
- median MFE was about 0.72R.

This means many trades moved partly in the intended direction, but not often enough to overcome full -1R losses and costs.

### PA-C — liquidity sweep and reclaim

- sweep of prior 20-hour extreme;
- close back within the prior range;
- rejection wick;
- direction conditioned by H4 context.

Best result:

- 185 campaigns;
- about 46.25 campaigns per year;
- win rate 12.97%;
- Profit Factor 0.6902;
- expectancy -0.2696R;
- total -49.88R;
- total -1,170.43 pips.

This generic sweep version was the weakest family and is rejected.

## Exit research

The two least-bad entry families, PA-A and PA-B, were retested with runner-style management:

- lock trigger: +0.75R, +1R, or +1.5R;
- lock level: breakeven, +0.25R, or +0.5R;
- H1 structural trail after +1.5R, +2R, or +3R;
- H1 trail lookback: 3, 6, or 12 bars;
- optional 25% partial at +2R;
- no small fixed take-profit;
- maximum hold about 20 days.

Best exit combination:

- family: PA-A first retest;
- lock at +0.5R after price reaches +0.75R;
- trail after +2R;
- 12-H1-bar structural trail;
- 25% partial at +2R.

Result:

- 101 campaigns;
- win rate 45.54%;
- Profit Factor 0.6849;
- expectancy -0.1716R;
- total -17.33R;
- total -626.98 pips;
- maximum drawdown 22.11R;
- only 3 campaigns reached at least +3R;
- only 2 reached at least +5R;
- IS +0.0593R/trade;
- VAL -0.2969R/trade;
- OOS -0.2314R/trade.

Profit locking and structural trailing did not repair the weak generic entries.

## Comparison with old V8 evidence

The existing V8 setup summary reports:

- `red_pullback_fib_sr`: 251 trades, +768.0 net pips, 45.82% win rate;
- `blue_pullback_fib_sr`: 98 trades, +162.9 net pips, 36.73% win rate;
- `green_range_sweep_sr`: 25 trades, -26.6 net pips, 44.00% win rate.

The historical V9.4 trade output also contains repeated same-direction entries during the same market movement and cannot be treated as independent campaigns without reconstruction.

Therefore, the old V8/V9 advantage did not come from generic Fibonacci or generic support / resistance alone. It depended on exact regime state, scoring, timing, session logic, entry qualification, and/or duplicate-position treatment.

## Formal conclusion

1. Naked price action remains a valid research direction.
2. Generic Fibonacci + S/R is not sufficient.
3. Generic liquidity sweep is rejected.
4. Exit optimization cannot repair a negative entry edge.
5. The next test must use the exact historical V8/V9 signal stream or exact generator, then merge repeated entries into independent campaigns before comparing entries and exits.
6. No result from this version is approved for the Capital OS.

## Required next inputs for exact V9 research

The exact next stage requires the raw current-chat attachment or canonical code for at least:

- `regime_v9_4_100k_trade_by_trade_all_models.csv`;
- `regime_v8_1_no_green_best_trades.csv` or `regime_v8_fib_sr_best_trades.csv`;
- preferably the original V8/V9 Python generator, if it exists.

These outputs will be used to reconstruct campaign IDs, remove repeated same-move entries, and test alternative entry and runner exits against the same historical opportunities.
