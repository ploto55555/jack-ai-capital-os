# ABU Compression / New Space / Small Stop V0.1 Results

Date: 2026-07-10
Status: RESEARCH CANDIDATE ONLY

## Purpose

This research converts subjective Abu source language into an explicit and reproducible first-pass model. It does not claim to reproduce the original discretionary method exactly.

Source concepts reconstructed:

- H4 compression before breakout;
- breakout into larger-structure new space;
- optional D1 directional filter;
- M15 or M5 execution only after the H4 breakout bar is complete;
- objective structural stop using the H4 breakout candle open or a recent lower-timeframe swing;
- high-R targets;
- one open position at a time;
- spread included;
- pessimistic same-bar handling, with stop assumed before target when both are touched.

## Data

- GBPJPY D1 and H4 context: 2010-06-24 to 2026-07-08.
- GBPJPY M15 execution sample: 2022-07-04 to 2026-07-08.
- GBPJPY M5 validation sample: 2025-03-06 to 2026-07-08.

Formal M15 split:

- IS: 2022-07 through 2023-12.
- Validation: calendar year 2024.
- OOS: 2025 through 2026-07.

## Search Scope

Two-stage parameter research:

- Stage 1 combinations: 1,728.
- Stage 2 combinations: 2,304.
- Total examined: 4,032.
- Positive-expectancy candidates in all three splits with minimum trade-count rules: 21.

Signal parameters tested included:

- compression windows of 6, 12, and 24 H4 bars;
- compression range thresholds normalized by H4 ATR;
- H4 ATR14 / ATR50 contraction filters;
- no new-space filter, 30-H4-bar new space, and 60-H4-bar new space;
- breakout body-size filters;
- no D1 bias versus D1 directional alignment.

Execution parameters tested included:

- next lower-timeframe open versus a second break of the H4 signal extreme;
- H4-open stop versus M15 swing stops;
- 3R, 5R, 8R, 10R, 15R, and 20R targets;
- 24-hour and 96-hour maximum holds;
- maximum accepted stop sizes of 30, 50, and 80 pips.

## Best Robust Candidate Found

Identifier:

`ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`

Objective rules:

1. Compression is the previous 6 completed H4 candles.
2. Compression high-low range must be no more than 3.0 times the prior H4 ATR14.
3. Prior H4 ATR14 must be no more than H4 ATR50.
4. The H4 breakout close must exceed the prior 30-H4-bar high for long, or fall below the prior 30-H4-bar low for short.
5. The breakout candle must move in the breakout direction and have an absolute body of at least 0.3 H4 ATR14.
6. No D1 directional filter was used in this selected version.
7. Entry is the next M15 open after the completed H4 breakout candle.
8. Long entry includes the recorded spread; short entry uses the bid-side open.
9. Stop is the H4 breakout candle open.
10. Trades with stop distance below 3 pips or above 30 pips are rejected.
11. Target is 5R.
12. Maximum holding period is 384 M15 bars, approximately 96 clock hours before weekend gaps are considered.
13. Only one position may be open at a time.

This closely matches the source example that describes new space, M5 execution, and the H4 opening price as the stop, but remains an objective reconstruction rather than an authenticated exact rule set.

## M15 Results

| Segment | Trades | Win rate | Profit Factor | Expectancy | Sum R | Max DD |
|---|---:|---:|---:|---:|---:|---:|
| IS | 8 | 25.00% | 1.6667 | +0.5000R | +4R | 3R |
| Validation 2024 | 11 | 27.27% | 1.8750 | +0.6364R | +7R | 6R |
| OOS 2025-2026 | 15 | 26.67% | 1.8182 | +0.6000R | +9R | 6R |
| Full M15 sample | 34 | 26.47% | 1.8000 | +0.5882R | +20R | 7R |

The 34 trades contain 9 target winners and 25 stop losses.

## Calendar-Year Results

| Year | Trades | Sum R |
|---|---:|---:|
| 2022 | 2 | +4R |
| 2023 | 6 | 0R |
| 2024 | 11 | +7R |
| 2025 | 7 | -1R |
| 2026 partial | 8 | +10R |

The negative 2025 result shows that the candidate is not uniformly profitable by calendar year.

## M5 Validation

The same signals and exact rule were rerun using M5 data from 2025-03-06 onward, with the maximum hold converted to 1,152 M5 bars.

M5 result:

- 14 trades;
- win rate 28.57%;
- Profit Factor 2.00;
- expectancy +0.7143R;
- sum +10R;
- max drawdown 5R.

The M15 result restricted to the same dates was exactly the same: 14 trades and +10R. This confirms that the selected trades are not an artifact of M15 intrabar ordering within the available M5 sample.

## Statistical Uncertainty

The result is promising but not yet statistically strong because the selected sample has only 34 trades after testing 4,032 parameter combinations.

- Observed win rate: 26.47%.
- Break-even win rate for a pure 5R / -1R model: 16.67% before residual time exits.
- Wilson 95% interval for win rate: approximately 14.60% to 43.12%.
- Jeffreys 95% interval: approximately 13.98% to 42.78%.
- Bootstrap 95% interval for expectancy: approximately -0.294R to +1.471R.
- Bootstrap probability that expectancy is positive: approximately 91.9% under resampling of these 34 trades.
- Random-order Monte Carlo median max drawdown: 8R.
- Random-order 95th-percentile max drawdown: 13R.
- Random-order 99th-percentile max drawdown: 16R.

Because the confidence interval still includes negative expectancy, this candidate cannot be treated as proven.

## USD 500 Capital Test

Full available M15 history using fixed fractional risk:

| Risk per trade | Final equity | Max drawdown | Reached USD 100,000 |
|---:|---:|---:|:---:|
| 0.5% | USD 550.89 | 3.45% | No |
| 1% | USD 603.33 | 6.79% | No |
| 2% | USD 711.47 | 13.19% | No |
| 3% | USD 821.38 | 19.20% | No |
| 5% | USD 1,033.36 | 30.17% | No |
| 10% | USD 1,379.92 | 52.17% | No |

Rolling 12-month tests:

- 41 eligible rolling windows per risk level.
- No tested window reached USD 100,000.
- At 10% risk per trade, the best rolling year ended near USD 1,494.68, the median near USD 664.30, and the worst near USD 239.15.

## Interpretation

This is the strongest candidate found so far in the project, materially better than standalone SRDC and stronger per trade than the retained Ketty trend-breakout candidate.

However:

- only 34 selected trades exist in the M15 sample;
- 4,032 combinations were examined;
- the statistical interval still includes no edge;
- one full calendar year was negative;
- no rolling 12-month window came remotely close to USD 100,000 from USD 500;
- M15 history begins only in July 2022;
- M5 history begins only in March 2025.

## Formal Status

- `[RESEARCH_CANDIDATE]`
- `[PROMISING_BUT_SMALL_SAMPLE]`
- `[NOT APPROVED FOR CAPITAL OS]`
- `[DO NOT INCREASE RISK BASED ON THIS RESULT]`

## Required Next Test

Next version should not optimize more values around this same sample. It should seek independent evidence through one or more of:

1. longer GBPJPY M15/M5 history from another data export;
2. the same exact locked rules on USDJPY, XAUUSD, GBPUSD, and EURUSD;
3. a long-history H1 proxy using the same compression/new-space logic;
4. walk-forward testing with parameters locked before each future segment;
5. manual chart review of all 34 trades to verify that the objective signals resemble the source examples.
