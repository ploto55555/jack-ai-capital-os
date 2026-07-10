# Latest Handover

## Date

2026-07-10

## Project Architecture

The project remains divided into:

1. **Jack AI Capital OS** — production decision support using only approved setups.
2. **Jack Strategy Research Lab** — strategy definition, backtesting, robustness testing, rejection, and validation.

No setup may enter Capital OS without documented promotion review and explicit approval of the exact version.

## Repository Mapping

- Local Windows folder: `C:\Users\sneak\jack-capital-os-source`
- Canonical code repository: `ploto55555/jack-quantdinger-lab`
- Canonical working branch: `jack-personal-os-v1`
- Documentation and continuity repository: `ploto55555/jack-ai-capital-os`, branch `main`

Project rules, parameters, results, and checkpoints may be stored in the repositories. Passwords, API keys, tokens, and broker-login credentials must not be committed.

## Source Corpora Completed

### Abu

Six source files received and reviewed, covering:

- market region / migration concepts;
- positive-feedback-cycle examples;
- objective small-stop examples;
- trend-line management;
- broad Abu trading philosophy and planning.

### SRDC

Episode I, II, and III received and reviewed.

### Ketty FX

Ketty trend/range classification, trend-following, range mean-reversion, and supporting Japanese FX materials received and reviewed.

## Data Status

GBPJPY data audited:

- D1: 2010-06-24 to 2026-07-08
- H4: 2010-06-24 to 2026-07-08
- H1: 2010-06-24 to 2026-07-08
- M30: 2018-06-29 to 2026-07-08
- M15: 2022-07-04 to 2026-07-08
- M5: 2025-03-06 to 2026-07-08
- M1: 2026-04-01 to 2026-07-08

The supplied spread-point column must be used in research.

## Capital Path Target

- Start: USD 500
- Target: USD 100,000
- Window: rolling 12 months

No strategy tested so far has reached the target in any rolling 12-month window.

## SRDC Findings

- Episode I standalone previous-day high/low breakout: rejected.
- Episode III London-box breakout: weak watchlist result only; not promotable.

## Ketty Regime Classifier V0.1

Retained research candidate:

`KETTY_GBPJPY_TREND_BREAKOUT_V0.1`

Full-history result:

- 1,246 trades
- Win rate: 21.27%
- Profit Factor: 1.1385
- Expectancy: +0.1089R
- Out-of-sample Profit Factor: 1.0677

No tested rolling 12-month window reached USD 100,000 from USD 500. The candidate remains research-only.

## Abu Compression / New Space / Small Stop V0.1

Completed:

- 1,728 stage-one combinations;
- 2,304 stage-two combinations;
- M15 IS / validation / OOS testing;
- calendar-year testing;
- fixed-fraction and rolling 12-month testing;
- M5 validation;
- confidence interval, bootstrap, and randomized-sequence drawdown checks.

Retained research candidate:

`ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`

Locked objective rules:

1. Previous 6 H4 candles form compression.
2. Compression range <= 3.0 H4 ATR14.
3. H4 ATR14 <= H4 ATR50.
4. Breakout close exceeds the prior 30-H4-bar high or low.
5. Breakout body >= 0.3 H4 ATR14.
6. No D1 directional filter.
7. Enter at the next M15 open after the completed H4 breakout candle.
8. Stop at the H4 breakout candle open.
9. Reject stops below 3 pips or above 30 pips.
10. Target 5R.
11. Maximum hold 384 M15 bars.
12. One open position at a time.
13. Recorded spread included.
14. Stop wins same-bar stop/target ties.

M15 full-sample result:

- 34 trades;
- 9 winners and 25 losses;
- win rate 26.47%;
- Profit Factor 1.80;
- expectancy +0.5882R;
- total +20R;
- observed max drawdown 7R.

Split results:

- IS: 8 trades, +4R.
- 2024 validation: 11 trades, +7R.
- 2025-2026 OOS: 15 trades, +9R.

M5 validation from 2025-03-06:

- 14 trades;
- +10R;
- Profit Factor 2.00;
- exactly matched M15 results over the same dates.

Statistical warning:

- only 34 selected trades after 4,032 combinations;
- Wilson 95% win-rate interval approximately 14.60% to 43.12%;
- bootstrap 95% expectancy interval approximately -0.294R to +1.471R;
- the interval includes no edge;
- 2025 was a negative calendar year;
- no rolling 12-month window reached USD 100,000 from USD 500.

Formal status:

- `[RESEARCH_CANDIDATE]`
- `[PROMISING_BUT_SMALL_SAMPLE]`
- `[NOT APPROVED FOR CAPITAL OS]`

## Key Files

Documentation repository:

- `research/active/capital_path_500_to_100k_v0_1/BASELINE_RESULTS.md`
- `research/active/capital_path_500_to_100k_v0_1/KETTY_REGIME_V0_1_RESULTS.md`
- `research/active/capital_path_500_to_100k_v0_1/ABU_COMPRESSION_V0_1_RESULTS.md`
- `checkpoints/2026-07-10_capital-path-baseline-001.md`
- `checkpoints/2026-07-10_ketty-regime-002.md`
- `checkpoints/2026-07-10_abu-compression-003.md`

Canonical code repository already contains:

- `backend_api_python/scripts/scalping_m1_backtest_v1.py`
- `backend_api_python/scripts/ketty_regime_backtest_v0_1.py`

The Abu V0.1 runnable research script currently exists in the active working artifacts and should be committed to the canonical code branch before the next chat rotation.

## Active Research Stage

Next stage:

`ABU_V0.1_INDEPENDENT_VALIDATION`

Do not micro-optimize the same GBPJPY M15 sample further.

Priority options:

1. Run a long-history H1 proxy using the locked compression/new-space logic.
2. Obtain longer GBPJPY M15/M5 history.
3. Test the exact locked rule on other pairs without changing parameters.
4. Manually inspect all 34 trades against the Abu source examples.
5. Run walk-forward validation.

## Next Chat Startup Procedure

Read in this order:

1. `docs/00_PROJECT_MASTER.md`
2. `docs/04_DECISION_LOG.md`
3. `docs/05_CURRENT_STATUS.md`
4. `docs/06_NO_DETAIL_LOSS_PROTOCOL.md`
5. `docs/99_LATEST_HANDOVER.md`
6. `checkpoints/2026-07-10_abu-compression-003.md`
7. `research/active/capital_path_500_to_100k_v0_1/ABU_COMPRESSION_V0_1_RESULTS.md`
8. the canonical code branch `ploto55555/jack-quantdinger-lab` / `jack-personal-os-v1`

Then report:

- active research version;
- locked Abu V0.1 rules;
- sample-size and data limitations;
- latest evidence;
- exact next independent-validation action.
