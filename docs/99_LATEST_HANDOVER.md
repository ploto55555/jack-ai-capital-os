# Latest Handover

## Date

2026-07-10

## Project Architecture

1. **Jack AI Capital OS** — production decision support using only explicitly approved setups.
2. **Jack Strategy Research Lab** — reconstruction, backtesting, robustness testing, rejection, and validation.

No setup enters production without a documented promotion review and explicit approval of the exact version.

## Repository Mapping

- Local folder: `C:\Users\sneak\jack-capital-os-source`
- Code repository: `ploto55555/jack-quantdinger-lab`
- Working branch: `jack-personal-os-v1`
- Documentation repository: `ploto55555/jack-ai-capital-os`
- Documentation branch: `main`

GitHub is the continuity source of truth. Do not commit credentials, tokens, API keys, or broker logins.

## Completed Corpora and Data

- Abu six-file corpus reviewed.
- SRDC Episodes I–III reviewed.
- Ketty FX corpus reviewed.
- GBPJPY D1/H4/H1/M30/M15/M5/M1 data audited.
- Spread-point field identified and used in current research.

Data coverage:

- D1/H4/H1: 2010-06-24 to 2026-07-08
- M30: 2018-06-29 to 2026-07-08
- M15: 2022-07-04 to 2026-07-08
- M5: 2025-03-06 to 2026-07-08
- M1: 2026-04-01 to 2026-07-08

## Capital Path Goal

- Start: USD 500
- Target: USD 100,000
- Window: rolling 12 months

This is a research stress target. It must not be achieved by unrealistic duplicate entries, execution assumptions, or forced risk.

## Research Direction Override

The user established two lines:

1. **Swing Trade — current priority**
2. **Day Trade — later**

The main Swing task is not to replace Regime V8/V9 with a new low-frequency strategy. Historical V8/V9 outputs already showed sufficient apparent opportunity frequency and a historical USD 500 to USD 100,000 path. The unresolved issue is finding a realistic entry and exit.

The preferred entry language is naked price action:

- market structure;
- support/resistance;
- objective Fibonacci pullback;
- breakout/retest;
- sweep/reclaim;
- structural invalidation;
- profit lock followed by runner management.

## Important Historical Evidence

File Library contains:

- `regime_v9_4_100k_trade_by_trade_all_models.csv`
- `regime_v8_fib_sr_best_trades.csv`
- `regime_v8_1_no_green_best_trades.csv`
- `regime_v8_fib_sr_setup_summary.csv`
- `old chat full.html`

Historical V8 summary:

- red pullback Fib/SR: 251 trades, +768.0 net pips, 45.82% win rate;
- blue pullback Fib/SR: 98 trades, +162.9 net pips, 36.73% win rate;
- green range sweep/SR: 25 trades, -26.6 net pips, 44.00% win rate.

The V9.4 output contains many repeated same-direction entries during the same market move. These repeated entries must not automatically count as separate campaigns or independent compounding events.

The exact V8/V9 Python generator was not found in the canonical GitHub branch.

## Latest Completed Test

Research version:

`REGIME_V9_NAKED_ENTRY_EXIT_V0.1`

Formal status:

`[REJECTED AS GENERIC RECONSTRUCTION]`

Because the exact V8/V9 generator was missing, the test used a causal H4 price-action direction proxy, H1 naked signals, and M15 execution.

### Generic entry results

PA-A first breakout retest:

- 100 campaigns;
- about 25/year;
- PF 0.8462;
- expectancy -0.1200R;
- total -12R.

PA-B Fibonacci + support/resistance reclaim:

- 195 campaigns;
- about 48.75/year;
- PF 0.8487;
- expectancy -0.1179R;
- total -23R.

PA-C liquidity sweep + reclaim:

- 185 campaigns;
- PF 0.6902;
- expectancy -0.2696R;
- total -49.88R.

### Generic exit result

Best tested runner exit:

- PA-A entry;
- lock +0.5R after +0.75R;
- 25% partial at +2R;
- H1 12-bar structural trail after +2R;
- 101 campaigns;
- PF 0.6849;
- expectancy -0.1716R;
- validation and OOS negative.

Conclusion:

- naked price action itself is not rejected;
- generic Fib/SR is insufficient;
- generic sweep/reclaim is rejected;
- exit optimization cannot repair a negative entry edge;
- the old V8/V9 advantage depended on exact regime state, scoring, timing, session logic, entry qualification, and/or repeated-entry handling.

## Previous Research Candidates Still on Record

### Ketty

`KETTY_GBPJPY_TREND_BREAKOUT_V0.1`

- 1,246 trades
- PF 1.1385
- expectancy +0.1089R
- research-only

### Abu

`ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`

- 34 trades
- PF 1.80
- expectancy +0.5882R
- +20R
- promising but too small after 4,032 tested combinations

### Swing preliminary

`SWING_GBPJPY_COMPRESSION_RETEST_RUNNER_V0.1`

- 163 trades
- win rate 52.15%
- PF 1.408
- expectancy +0.193R
- +1,320.55 pips
- best trade +1,073.93 pips

These remain research evidence but are not the active priority.

## Active Next Stage

`REGIME_V9_EXACT_CAMPAIGN_RECONSTRUCTION_V0.2`

Required sequence:

1. Obtain complete raw bytes of the V9.4 and V8 output CSVs, or recover the original generator.
2. Assign a `campaign_id` to each distinct market move.
3. Merge repeated same-direction entries.
4. Preserve original regime and opportunity timing.
5. Compare entry choices on the same opportunities:
   - first signal;
   - first clean pullback;
   - objective Fib/SR reclaim;
   - M15 confirmation;
   - H1 confirmation.
6. Fix the entry stream before testing exits again.
7. Test lock-and-runner exits only after entry validation.
8. Recalculate the USD 500 to USD 100,000 path using realistic independent campaigns.

## Required Files in the Active Compute Session

The File Library allows reading and citation, but the current compute environment may not expose complete CSV bytes. For exact computation, re-upload only these files into the active chat when needed:

- `regime_v9_4_100k_trade_by_trade_all_models.csv`
- `regime_v8_1_no_green_best_trades.csv` or `regime_v8_fib_sr_best_trades.csv`
- the original V8/V9 Python generator, when available

Other source documents do not need to be re-uploaded.

## Key Latest Files

- `research/active/capital_path_500_to_100k_v0_1/REGIME_V9_NAKED_ENTRY_EXIT_V0_1_RESULTS.md`
- `checkpoints/2026-07-10_naked-entry-exit-v0-1-007.md`
- `docs/05_CURRENT_STATUS.md`

## New-Chat Startup

Read in order:

1. `docs/00_PROJECT_MASTER.md`
2. `docs/04_DECISION_LOG.md`
3. `docs/05_CURRENT_STATUS.md`
4. `docs/06_NO_DETAIL_LOSS_PROTOCOL.md`
5. `docs/99_LATEST_HANDOVER.md`
6. `checkpoints/2026-07-10_naked-entry-exit-v0-1-007.md`
7. `research/active/capital_path_500_to_100k_v0_1/REGIME_V9_NAKED_ENTRY_EXIT_V0_1_RESULTS.md`
8. canonical code branch `jack-personal-os-v1`

Then report the active research version, exact missing raw inputs, duplicate-campaign rule, latest evidence, and next computation step.
