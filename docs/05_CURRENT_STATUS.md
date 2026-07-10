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
- `[IN PROGRESS]` Abu compression / new-space / objective-small-stop rule reconstruction.

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

## Immediate Next Actions

1. Reconstruct Abu compression, new-space, and objective-small-stop concepts into explicit testable rules.
2. Keep Abu testing independent from Ketty and SRDC during the first pass.
3. Build separate H4/H1 compression detection and M15/M5 entry models.
4. Test high-R targets, non-overlapping positions, spread, and conservative same-bar handling.
5. Compare in-sample, validation, out-of-sample, calendar-year, and rolling 12-month results.
6. Only after independent Abu testing, compare Ketty regime classification as an optional filter.
