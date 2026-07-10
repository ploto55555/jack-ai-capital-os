# Ketty Regime Classifier V0.1 — Results

Date: 2026-07-10
Status: `[RESEARCH_CANDIDATE]`
Production status: `[NOT APPROVED]`

## Purpose

Test whether the Ketty trend/range/unclear framework can improve GBPJPY strategy quality and contribute to the research target of growing USD 500 toward USD 100,000 within a rolling 12-month period.

The target is a research objective only. Results must not be forced by increasing risk or selecting a single lucky period.

## Data

- GBPJPY H1: 2010-06-24 to 2026-07-08
- GBPJPY H4: 2010-06-24 to 2026-07-08
- Source format: MT5-style OHLC with tick volume and spread points
- Spread: included using the supplied spread-point column
- One position at a time
- Entry occurs at the next H1 open after a completed signal bar
- When stop and target are touched in the same bar, stop is assumed first
- No broker connection and no automatic execution

## Source-derived modules tested

1. Trend pullback around SMA / Bollinger context.
2. Trend breakout through recent highs or lows.
3. Range-edge mean reversion after an outer Bollinger Band rejection.
4. Multiple H4 regime-classifier definitions based on Ketty concepts:
   - moving-average direction and slope;
   - price relative to the Bollinger middle line;
   - price relative to the Ichimoku cloud;
   - higher-high / higher-low or lower-high / lower-low structure;
   - Bollinger expansion or compression;
   - an unclear state that produces no trade.

## Test design

### Initial module grid

- Trend pullback combinations: 300
- Trend breakout combinations: 144
- Range mean-reversion combinations: 72

### Regime-classifier variant grid

- Classifier variants: strict, score3, score4, simple_cloud, ma_bb, score3_bb
- Trend-breakout combinations across classifier variants: 576

### Evaluation periods

- In-sample: 2010-07-01 to 2018-12-31
- Validation: 2019-01-01 to 2022-12-31
- Out-of-sample: 2023-01-01 to 2026-07-08

A candidate is considered structurally promising only when expectancy remains positive in all three periods and the result is supported by nearby parameter combinations.

## Module conclusions

### Range mean reversion

Result: `[REJECTED V0.1]`

All tested source-inspired range-edge versions were negative in the full history. The best in-sample version still had Profit Factor below 1. This module must not be promoted in its current form.

### Trend pullback

Result: `[REJECTED V0.1]`

Some combinations were positive in the early sample but failed validation or out-of-sample testing. No pullback combination remained positive in all three evaluation periods.

### Trend breakout

Result: `[RESEARCH_CANDIDATE]`

The strict first classifier was too restrictive and unstable. Broader source-consistent classifier variants produced a small cluster of positive candidates rather than one isolated best result.

Sixteen combinations had positive expectancy in in-sample, validation, and out-of-sample periods with adequate trade counts.

## Selected research candidate

Name: `KETTY_GBPJPY_TREND_BREAKOUT_V0.1`

### H4 regime

`UPTREND` when all are true:

- H4 close is above SMA20;
- normalized SMA14 slope is greater than +0.03;
- H4 close is above the correctly shifted Ichimoku cloud.

`DOWNTREND` uses the inverse rules.

All other states are RANGE or UNCLEAR and do not generate this setup.

### H1 entry

Long:

- H4 regime is UPTREND;
- completed H1 close is above the highest high of the previous 40 H1 bars;
- H1 candle body is at least 0.3 ATR14;
- enter at the next H1 open.

Short uses the inverse rules.

### Risk and exit

- Stop: 1.5 ATR14
- Target: 5R
- Maximum holding period: 96 H1 bars
- One open position at a time
- Spread included

## Selected candidate results

| Period | Trades | Win rate | Profit Factor | Expectancy | Total R | Max drawdown R |
|---|---:|---:|---:|---:|---:|---:|
| 2010-2018 in-sample | 644 | 21.27% | 1.1224 | +0.0962R | +61.95R | 27.26R |
| 2019-2022 validation | 328 | 21.95% | 1.2304 | +0.1798R | +58.98R | 37.01R |
| 2023-2026 out-of-sample | 274 | 20.44% | 1.0677 | +0.0539R | +14.76R | 25.00R |
| Full sample | 1,246 | 21.27% | 1.1385 | +0.1089R | +135.69R | 37.01R |

## Parameter-neighbourhood evidence

The result is not supported by only one exact parameter set. Positive three-period candidates also appeared around:

- classifier: `simple_cloud` and stricter `score4`;
- breakout lookback: 20 and 40 H1 bars;
- body threshold: 0 and 0.3 ATR;
- stop: 1.5 ATR;
- target: 5R;
- maximum hold: 48 and 96 H1 bars.

The strongest neighbourhood is the family using a 1.5 ATR stop and 5R target. This is evidence of some parameter stability, but it is not enough for production approval.

## Annual stability

- Calendar years tested: 17
- Positive years: 11
- Negative years: 6
- Positive-year rate: 64.71%
- Best year: 2022, +35.33R
- Worst year: 2020, -26.12R

The strategy can experience long weak periods and is not a smooth compounding engine.

## Rolling 12-month capital test from USD 500

| Risk per trade | Profitable windows | Median final equity | Best final equity | Worst final equity | Median max DD | Worst max DD | Reached USD 100k |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.5% | 122 / 190 | $513.17 | $694.04 | $437.27 | 7.91% | 14.65% | 0 |
| 1% | 113 / 190 | $521.67 | $947.48 | $379.85 | 15.48% | 27.54% | 0 |
| 2% | 104 / 190 | $524.68 | $1,684.26 | $281.14 | 29.07% | 48.59% | 0 |
| 3% | 98 / 190 | $509.71 | $2,822.56 | $203.02 | 40.42% | 64.25% | 0 |
| 5% | 77 / 190 | $438.75 | $6,753.97 | $98.84 | 58.19% | 83.65% | 0 |
| 10% | 45 / 190 | $203.13 | $27,226.35 | $11.42 | 85.80% | 98.28% | 0 |

Even extreme risk did not produce a single rolling 12-month path from USD 500 to USD 100,000. Higher risk mainly increased the chance of severe drawdown.

## Formal conclusion

Ketty Regime Classifier V0.1 adds useful information. A source-consistent H4 trend filter improved the stability of H1 breakout trades and produced a modest positive research candidate across all three time segments.

However:

- the edge remains too small for the USD 500 to USD 100,000 one-year objective;
- six of seventeen calendar years were negative;
- out-of-sample Profit Factor is only 1.0677;
- no rolling 12-month window reached the target at any tested risk level;
- this setup must not enter Capital OS production.

## Decision

- Keep `KETTY_GBPJPY_TREND_BREAKOUT_V0.1` as a research component and possible market-regime filter.
- Reject Ketty range mean reversion V0.1.
- Reject Ketty trend pullback V0.1.
- Do not increase risk to compensate for insufficient expectancy.
- Proceed to Abu compression / new-space / small-stop high-R reconstruction and test it independently.
- Only after independent testing may Ketty regime classification be evaluated as an Abu strategy filter.
