# Checkpoint — Capital Path Baseline 001

Date: 2026-07-10

## Stage objective

Begin a reproducible research program for the scenario of growing $500 to $100,000 within 12 months using GBPJPY rule-based strategies.

## Data available

- D1, H4, H1, M30, M15, M5, M1 GBPJPY CSV files.
- D1 covers 2010-06-24 to 2026-07-08.
- M15 covers 2022-07-04 to 2026-07-08.
- M5 covers about 16 months.
- M1 covers about three months.

## Confirmed decisions

- Do not force the backtest to reach the target by increasing risk.
- First validate strategy expectancy; only then test capital compounding.
- Keep Abu, SRDC, and Ketty strategies separate during initial testing.
- Use spread-aware and conservative execution assumptions.
- Evaluate rolling 12-month windows, not one selected calendar year.
- Treat $500 to $100,000 as a 200x research target, not a promise.

## Tests completed

### SRDC Episode I

- 270 combinations tested.
- All tested combinations had negative expectancy after spread.
- Best tested combination: PF 0.9568, average -0.01570R.
- Status: `[REJECTED AS STANDALONE BASELINE]`.

### SRDC Episode III

- Focused first-pass variations tested across GMT offsets +2/+3, three entry styles, three targets, and three fixed stops.
- Best tested combination: full M15 candle confirmation, offset +3, TP 80, SL 50.
- Result: 734 trades, PF 1.0238, average +0.008316R.
- Status: `[WATCHLIST ONLY]`; edge too weak for promotion.

### Capital overlay

- Risk levels from 0.5% to 20% were tested on the best SRDC III baseline.
- No tested full-sample path reached $100,000.
- 37 rolling 12-month windows were evaluated.
- No rolling window reached $100,000, including extreme-risk tests.
- Higher risk materially increased drawdown and practical ruin without creating a repeatable path.

## Existing code issue

The current `scalping_m1_backtest_v1.py` remains an early prototype. It is not formal evidence because of overlapping candidate windows, missing spread/slippage handling, unusual risk-base updates, and only about three months of M1 data.

## Current conclusion

Simple SRDC daily breakout and London box breakout rules do not provide enough edge for the capital target. The next research priority is not higher risk; it is better setup selection through market-regime filtering.

## Next action

Build Ketty Regime Classifier V0.1 and use it to filter SRDC I and III. After that, construct Abu Compression Breakout V0.1 using D1/H4/H1 context and M15 execution.

## Related file

- `research/active/capital_path_500_to_100k_v0_1/BASELINE_RESULTS.md`

## Git reference

- Baseline results commit: `b38dea8dba6228eae9a203a736ae2b8d6813111e`