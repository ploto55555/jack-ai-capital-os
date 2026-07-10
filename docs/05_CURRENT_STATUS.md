# Current Status

## Last Updated

2026-07-10

## Repository Map

### Canonical Existing Code

- Local folder: `C:\Users\sneak\jack-capital-os-source`
- GitHub repository: `ploto55555/jack-quantdinger-lab`
- Working branch: `jack-personal-os-v1`
- Role: Existing Capital OS application code, dashboard APIs, market-data support, MT5 read-only tick bridge, and research scripts.
- Visibility at last check: **public**

### Project Memory and Continuity

- GitHub repository: `ploto55555/jack-ai-capital-os`
- Default branch: `main`
- Role: Project master documents, decision log, current status, checkpoints, research governance, source summaries, backtest results, and chat handovers.
- Visibility at last check: **public**

## Active Storage Rule

- Project strategy rules, parameters, research results, checkpoints, and capital-path analysis may be stored in the repositories.
- Do not commit passwords, API keys, access tokens, broker login credentials, or other authentication secrets.
- GitHub remains the formal project source of truth; chat is a temporary working space.

## Architecture Status

- `[DONE]` Dual-system architecture defined.
- `[DONE]` Capital OS production boundary defined.
- `[DONE]` Strategy Research Lab boundary defined.
- `[DONE]` Setup promotion gate defined.
- `[DONE]` Decision logging initialized.
- `[DONE]` No-detail-loss and proactive chat-rotation protocol installed.
- `[DONE]` Canonical code repository and branch identified.
- `[DONE]` Abu source corpus received and reviewed.
- `[DONE]` SRDC Episode I, II, and III corpus received and reviewed.
- `[DONE]` Ketty FX source corpus received and reviewed.
- `[DONE]` GBPJPY D1/H4/H1/M30/M15/M5/M1 data audited.
- `[DONE]` Initial USD 500 to USD 100,000 baseline research completed.
- `[DONE]` Ketty Regime Classifier V0.1 research completed.
- `[DONE]` Abu compression / new-space / objective-small-stop V0.1 completed.
- `[IN PROGRESS]` Independent validation of the locked Abu V0.1 candidate.

## Verified Existing Code Areas

The canonical code branch has verified files and runtime evidence for:

- four-chart Jack Brain dashboard;
- live price and latest-candle endpoints;
- indicator overlay endpoints;
- trade-readiness analysis;
- dashboard memory snapshots;
- daily AI summary;
- MT5 read-only tick bridge support;
- FX historical-data download and inspection;
- M1 research backtest scripts;
- Ketty regime and trend-breakout backtest V0.1.

## Current Research Findings

### SRDC baseline

- SRDC Episode I previous-day high/low breakout: rejected as a standalone baseline.
- SRDC Episode III London-box breakout: very weak positive result only; watchlist status, not promotable.

### Ketty Regime Classifier V0.1

Retained research candidate:

`KETTY_GBPJPY_TREND_BREAKOUT_V0.1`

Full sample:

- 1,246 trades;
- Profit Factor 1.1385;
- expectancy +0.1089R;
- out-of-sample Profit Factor 1.0677;
- no rolling 12-month window reached USD 100,000 from USD 500.

Status:

- `[RESEARCH_CANDIDATE]`
- `[NOT APPROVED FOR PRODUCTION]`

Ketty range mean reversion V0.1 and trend pullback V0.1 were rejected.

### Abu Compression / New Space / Small Stop V0.1

Retained research candidate:

`ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`

Locked rule summary:

- previous 6 H4 bars form compression;
- compression range <= 3.0 H4 ATR14;
- H4 ATR14 <= H4 ATR50;
- breakout closes beyond prior 30-H4-bar extreme;
- breakout body >= 0.3 H4 ATR14;
- enter next M15 open;
- stop at H4 breakout candle open;
- accept only 3-30 pip stops;
- target 5R;
- maximum hold 384 M15 bars;
- one position at a time;
- spread included.

M15 result:

- 34 trades;
- win rate 26.47%;
- Profit Factor 1.80;
- expectancy +0.5882R;
- total +20R;
- observed max drawdown 7R;
- positive expectancy in IS, validation, and OOS splits.

M5 validation over available 2025-2026 data exactly matched the M15 result over the same dates: 14 trades and +10R.

Important limitation:

- 4,032 combinations were examined;
- selected sample has only 34 trades;
- bootstrap 95% expectancy interval includes a negative value;
- no rolling 12-month window reached USD 100,000 from USD 500.

Status:

- `[RESEARCH_CANDIDATE]`
- `[PROMISING_BUT_SMALL_SAMPLE]`
- `[NOT APPROVED FOR PRODUCTION]`

## Immediate Next Actions

1. Lock Abu V0.1 parameters; do not continue micro-optimizing the same GBPJPY M15 sample.
2. Seek independent evidence using longer GBPJPY M15/M5 history or other pairs.
3. Run a long-history H1 proxy with the same compression/new-space logic.
4. Manually inspect all 34 candidate trades against the Abu source examples.
5. Run walk-forward testing before any promotion review.
6. Keep Ketty or SRDC filters out of Abu testing until independent Abu validation is complete.
