# Current Status

## Last Updated

2026-07-10

## Repository Map

### Canonical code

- Local folder: `C:\Users\sneak\jack-capital-os-source`
- Repository: `ploto55555/jack-quantdinger-lab`
- Working branch: `jack-personal-os-v1`

### Project memory and continuity

- Repository: `ploto55555/jack-ai-capital-os`
- Branch: `main`
- GitHub is the formal source of truth; chat is a temporary working space.
- Strategy rules, parameters, results, and capital-path analysis may be stored.
- Never commit passwords, API keys, access tokens, broker logins, or other authentication secrets.

## Architecture

The project remains separated into:

1. **Jack AI Capital OS** — production decision support using only explicitly approved setups.
2. **Jack Strategy Research Lab** — strategy reconstruction, backtesting, robustness testing, rejection, and validation.

No research candidate may enter the Capital OS without an exact-version promotion review and explicit user approval.

## Completed Source and Data Work

- `[DONE]` Abu source corpus reviewed.
- `[DONE]` SRDC Episodes I–III reviewed.
- `[DONE]` Ketty FX corpus reviewed.
- `[DONE]` GBPJPY D1/H4/H1/M30/M15/M5/M1 data audited.
- `[DONE]` Spread-point field identified and included in current research.

## Capital Path Target

- Start: USD 500
- Target: USD 100,000
- Evaluation window: rolling 12 months

This is a research stress target, not a reason to force leverage or accept invalid execution assumptions.

## Main Research Lines

1. **Swing Trade — current priority**
2. **Day Trade — later stage**

The current Swing objective is not to invent a new low-frequency system. Historical Regime V8/V9 outputs already showed enough apparent opportunity frequency. The unresolved work is to reconstruct a real, non-duplicated entry and exit engine.

## Previous Findings

### SRDC

- Episode I previous-day high/low breakout: rejected standalone.
- Episode III London-box breakout: weak watchlist only.

### Ketty V0.1

Retained research candidate: `KETTY_GBPJPY_TREND_BREAKOUT_V0.1`

- 1,246 trades
- PF 1.1385
- expectancy +0.1089R
- OOS PF 1.0677
- no rolling 12-month USD 500 to USD 100,000 result
- status: research-only

### Abu Compression V0.1

Retained small-sample candidate: `ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`

- 34 M15 trades
- win rate 26.47%
- PF 1.80
- expectancy +0.5882R
- total +20R
- observed max drawdown 7R
- M5 matched 14 trades and +10R over the same available dates
- warning: 4,032 combinations and only 34 selected trades; confidence interval includes negative expectancy
- status: promising but not approved

### Swing preliminary candidate

`SWING_GBPJPY_COMPRESSION_RETEST_RUNNER_V0.1`

- 163 trades
- win rate 52.15%
- PF 1.408
- expectancy +0.193R
- total +31.44R
- total +1,320.55 pips
- best trade +14.08R / +1,073.93 pips

This candidate remains background evidence only. User direction returned the main research focus to the historical V8/V9 opportunity stream and its entry/exit problem.

## Historical V8/V9 Evidence

Available File Library outputs include:

- `regime_v9_4_100k_trade_by_trade_all_models.csv`
- `regime_v8_fib_sr_best_trades.csv`
- `regime_v8_1_no_green_best_trades.csv`
- `regime_v8_fib_sr_setup_summary.csv`

Historical V8 summary:

- red pullback Fib/SR: 251 trades, +768.0 net pips, 45.82% win rate
- blue pullback Fib/SR: 98 trades, +162.9 net pips, 36.73% win rate
- green range sweep/SR: 25 trades, -26.6 net pips, 44.00% win rate

Important warning: V9.4 trade output contains repeated same-direction entries inside the same market movement. These cannot automatically be treated as independent trade campaigns or independent compounding events.

## Latest Research: Regime V9 Naked Entry / Exit V0.1

Status: `[REJECTED AS GENERIC RECONSTRUCTION]`

The exact V8/V9 signal generator was not found in the canonical GitHub branch. A generic objective reconstruction was therefore tested using H4 causal price-action direction, H1 naked signals, and M15 execution.

### Entry families tested

1. PA-A: first breakout retest
2. PA-B: Fibonacci plus support/resistance reclaim
3. PA-C: liquidity sweep and reclaim

### Best PA-A result

- 100 campaigns
- about 25 campaigns/year
- win rate 22.00%
- PF 0.8462
- expectancy -0.1200R
- total -12R

### Best PA-B result

- 195 campaigns
- about 48.75 campaigns/year
- win rate 22.05%
- PF 0.8487
- expectancy -0.1179R
- total -23R

Entry-quality observations for PA-B:

- 59.49% reached +0.5R
- 42.56% reached +1R
- 33.33% reached +1.5R
- 28.21% reached +2R
- 22.56% reached +3R

The entries frequently moved partly in the intended direction but did not create enough edge to overcome full losses and costs.

### Best PA-C result

- 185 campaigns
- win rate 12.97%
- PF 0.6902
- expectancy -0.2696R
- total -49.88R

Generic sweep/reclaim was rejected.

### Runner exit research

Profit locks, optional partial exits, and H1 structural trails were tested. Best result:

- PA-A entry
- lock +0.5R after reaching +0.75R
- 25% partial at +2R
- begin H1 12-bar structural trail at +2R
- 101 campaigns
- PF 0.6849
- expectancy -0.1716R
- total -17.33R
- validation and OOS both negative

Conclusion: exit optimization cannot repair a negative generic entry edge.

## Current Formal Conclusion

- Naked price action is not rejected.
- Generic Fibonacci and generic support/resistance are insufficient.
- Generic liquidity sweep is rejected.
- The old V8/V9 advantage depended on exact regime state, scoring, timing, session logic, entry qualification, and/or repeated-entry treatment.
- The next stage must use the exact historical V8/V9 opportunity stream or generator.

## Immediate Next Action

`REGIME_V9_EXACT_CAMPAIGN_RECONSTRUCTION_V0.2`

1. Recover the complete raw V9.4 and V8 trade outputs or the original generator.
2. Assign one `campaign_id` to each distinct market move.
3. Merge repeated same-direction entries instead of counting them as separate opportunities.
4. Preserve the original regime/opportunity timestamps.
5. Compare first signal, first pullback, Fib/SR reclaim, M15 confirmation, and H1 confirmation.
6. Fix the best entry before testing runner exits again.
7. Do not evaluate the USD 500 to USD 100,000 path until duplicate treatment and execution are realistic.

## Key Latest Files

- `research/active/capital_path_500_to_100k_v0_1/REGIME_V9_NAKED_ENTRY_EXIT_V0_1_RESULTS.md`
- `checkpoints/2026-07-10_naked-entry-exit-v0-1-007.md`
