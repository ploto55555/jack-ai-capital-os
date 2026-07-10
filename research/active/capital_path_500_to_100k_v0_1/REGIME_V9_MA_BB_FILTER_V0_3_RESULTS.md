# Regime V9 Naked Entry — MA50 / MA200 / Bollinger Filter V0.3

Date: 2026-07-10

Status:

- `[RESEARCH_CANDIDATE]`
- `[FILTERS_IMPROVED_ENTRY_QUALITY]`
- `[NOT APPROVED FOR CAPITAL OS]`

## Research Objective

Keep the existing PA-B Fib/SR entry and the three V0.2 filters unchanged:

1. retracement within 16 H1 bars;
2. H1 volatility percentile between 20% and 80%;
3. at least 2R structural room.

Then test whether MA50, MA200, and Ketty-style Bollinger logic improve trade selection.

## Ketty Interpretation Used

Ketty trend logic was translated into testable components:

- price relative to MA / Bollinger middle line;
- MA direction;
- Bollinger expansion versus contraction;
- pullback and reclaim around the middle line / dynamic support-resistance.

No broker connection or execution integration was used.

## Baseline

The V0.2 baseline had 61 eligible signals.

### 5R

- 51 trades
- win rate 31.37%
- PF 2.2857
- expectancy +0.8824R
- total +45R
- pips +1,799.71

### 10R

- 49 trades
- win rate 22.45%
- PF 2.5868
- expectancy +1.2305R
- total +60.2968R
- pips +2,822.05

## MA50 Findings

A simple H1 MA50 directional filter retained most trades and slightly improved the 10R result.

Rule:

- long: H1 signal close above SMA50;
- short: H1 signal close below SMA50.

### 10R result

- 47 trades
- PF 2.7305
- expectancy +1.3255R
- total +62.2968R
- pips +2,874.23

Conclusion:

- MA50 is useful as a directional / dynamic support-resistance filter.
- It should remain a simple filter; requiring extra MA50 slope conditions reduced performance.

## MA200 Findings

Hard MA200 filters reduced quality.

### H1 close on correct side of MA200, 10R

- 37 trades
- PF 1.8606
- expectancy +0.7210R
- total +26.6774R

### H1 MA50 / MA200 ordered trend filter, 10R

- 30 trades
- PF 1.5385
- expectancy +0.4667R
- total +14R

Conclusion:

- MA200 must not be a mandatory directional filter for this Fib/SR setup.
- It works better as an optional confluence zone.
- Signals touching or occurring near MA200 looked promising, but the sample was too small for promotion.

## Bollinger Findings

The strongest BB use was not a hard H1 middle-line filter. The useful role was:

1. D1 Bollinger width expansion as trend-regime confirmation;
2. H1 Bollinger middle-line reclaim as local pullback confirmation.

### D1 BB width expanding versus two completed D1 bars earlier, 10R

- 30 trades
- PF 2.9595
- expectancy +1.5023R
- total +45.0693R
- pips +2,102.57

It improved trade quality but reduced frequency.

## Balanced Candidate

Strategy ID:

`PA_B_FIB_SR_MA50_BB_BALANCED_V0.3`

Additional filter:

- H1 signal close must be on the correct side of SMA50;
- and at least one of the following must be true:
  - D1 Bollinger width is greater than two completed D1 bars earlier;
  - the H1 signal candle touches / crosses the BB middle line and closes back on the directional side.

MA200 is recorded as a confluence tag, not a mandatory condition.

### 5R result

- 42 eligible signals
- 37 executed trades
- win rate 35.14%
- PF 2.7083
- expectancy +1.1081R
- total +41R
- pips +1,773.47
- observed max drawdown 3R

### 10R result

- 42 eligible signals
- 36 executed trades
- win rate 27.78%
- PF 3.3960
- expectancy +1.7305R
- total +62.2968R
- pips +2,807.19
- observed max drawdown 5R

Split results for 10R:

- 2022-2023: 11 trades, +2.0000R expectancy, +22R;
- 2024: 10 trades, +1.8539R expectancy, +18.5390R;
- 2025-2026: 15 trades, +1.4505R expectancy, +21.7579R.

## A+ Confluence Tag

A trade is tagged A+ when the balanced filter passes and either:

- the H1 signal candle touches MA50; or
- the signal is within 0.75 H1 ATR of MA200.

10R research result:

- 19 trades
- win rate 36.84%
- PF 4.9703
- expectancy +2.5075R
- total +47.6430R
- pips +2,197.94
- observed max drawdown 4R

This is promising but too small to treat as a separate approved setup.

## Capital Path Check

For the balanced 10R candidate, rolling 12-month tests still did not reach USD 100,000 from USD 500.

At 5% fixed fractional risk:

- best rolling 12-month final equity approximately USD 1,514;
- median approximately USD 871;
- worst observed rolling drawdown approximately 22.62%;
- windows reaching USD 100,000: 0.

## Formal Decision

1. Keep MA50 as a hard directional filter.
2. Use BB in two roles: D1 expansion and H1 middle-line reclaim.
3. Do not use MA200 as a hard trend filter.
4. Keep MA200 as an A+ confluence / dynamic support-resistance tag.
5. Lock the balanced V0.3 entry filters before runner-exit research.
6. Do not continue micro-optimizing MA and BB parameters on the same sample.

## Next Research Step

`PA_B_FIB_SR_MA50_BB_RUNNER_EXIT_V0.4`

Fixed entry candidate:

`PA_B_FIB_SR_MA50_BB_BALANCED_V0.3`

Test only exit management:

- delayed break-even;
- structure-based profit lock;
- partial exit versus no partial exit;
- H1-to-H4 swing trailing;
- runner capture ratio;
- maximum pips and R;
- annual and rolling 12-month stability.
