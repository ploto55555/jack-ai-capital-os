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

## Capital Path Baseline

Research target:

- Start: USD 500
- Target: USD 100,000
- Window: rolling 12 months

### SRDC findings

- Episode I standalone previous-day high/low breakout: rejected.
- Episode III London-box breakout: weak watchlist result only; not promotable.

## Ketty Regime Classifier V0.1

Completed:

- 300 trend-pullback combinations;
- 144 initial trend-breakout combinations;
- 72 range mean-reversion combinations;
- 576 trend-breakout combinations across six H4 regime variants;
- in-sample, validation, and out-of-sample testing;
- calendar-year and rolling 12-month capital testing.

### Rejected

- Ketty trend pullback V0.1
- Ketty range mean reversion V0.1

### Retained research candidate

`KETTY_GBPJPY_TREND_BREAKOUT_V0.1`

Rules:

- H4 trend: close relative to SMA20, normalized SMA14 slope, and price relative to the shifted Ichimoku cloud.
- H1 breakout: previous 40-bar high/low with candle body at least 0.3 ATR.
- Entry: next H1 open.
- Stop: 1.5 ATR.
- Target: 5R.
- Maximum hold: 96 H1 bars.
- One open position at a time.
- Spread included.

Full-history result:

- 1,246 trades
- Win rate: 21.27%
- Profit Factor: 1.1385
- Expectancy: +0.1089R
- Out-of-sample Profit Factor: 1.0677

No tested rolling 12-month window reached USD 100,000 from USD 500. The candidate remains research-only and cannot enter production.

## Key Files

Documentation repository:

- `research/active/capital_path_500_to_100k_v0_1/BASELINE_RESULTS.md`
- `research/active/capital_path_500_to_100k_v0_1/KETTY_REGIME_V0_1_RESULTS.md`
- `research/active/capital_path_500_to_100k_v0_1/results/ketty_top_robust_candidates.csv`
- `research/active/capital_path_500_to_100k_v0_1/results/ketty_best_candidate_risk_summary.csv`
- `checkpoints/2026-07-10_capital-path-baseline-001.md`
- `checkpoints/2026-07-10_ketty-regime-002.md`

Canonical code repository:

- `backend_api_python/scripts/scalping_m1_backtest_v1.py`
- `backend_api_python/scripts/ketty_regime_backtest_v0_1.py`

## Active Research Stage

Next stage:

`ABU_COMPRESSION_NEW_SPACE_SMALL_STOP_V0.1`

Required reconstruction layers:

1. D1/H4 direction and market-space context.
2. H4/H1 compression definition.
3. Breakout confirmation.
4. M15/M5 objective-small-stop entry.
5. High-R target and trend-line holding rules.
6. Independent testing before any Ketty or SRDC filter is added.

## Next Chat Startup Procedure

Read in this order:

1. `docs/00_PROJECT_MASTER.md`
2. `docs/04_DECISION_LOG.md`
3. `docs/05_CURRENT_STATUS.md`
4. `docs/06_NO_DETAIL_LOSS_PROTOCOL.md`
5. `docs/99_LATEST_HANDOVER.md`
6. `checkpoints/2026-07-10_ketty-regime-002.md`
7. the canonical code branch `ploto55555/jack-quantdinger-lab` / `jack-personal-os-v1`
8. Abu source-batch summaries and the active Abu strategy-definition files

Then report:

- current research version;
- confirmed rules;
- unresolved subjective terms;
- data coverage limitations;
- latest evidence;
- exact next backtest action.
