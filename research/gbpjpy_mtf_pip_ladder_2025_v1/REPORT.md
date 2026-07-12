# GBPJPY Multi-Timeframe Pip Ladder — 2025 Pilot V1

Date: 2026-07-11

Status: `[EXPLORATORY_IN_SAMPLE_2025] [PERSONAL_RESEARCH_ONLY]`

## Research purpose

Test the user-defined idea:

- small timeframes seek smaller pips and higher trading-day coverage;
- larger timeframes identify and hold larger moves;
- H4/H1 Double Bollinger Bands determine higher-timeframe direction;
- M15 Bollinger Band width classifies Range / Transition / Trend;
- 00/25/50/75, Fibonacci, prior-day levels and 200MA provide location context;
- M1 supplies causal execution;
- different regimes use different stops, exits and risk.

## Data

- Pair: GBPJPY only.
- Source file: `HISTDATA_COM_MT_GBPJPY_M12025.zip`.
- SHA-256: `458c7c4a540d63b81f09da4359811fe7bf99c4b72017510dd1f60d433472e933`.
- M1 rows: 371,016.
- Source coverage: 2025-01-01 17:05 to 2025-12-31 16:57.
- FX trading day rolls at 17:00 source time.
- Fixed spread assumption: 2 pips.
- Evaluation starts 2025-03-01 because H4 SMA200 needs warmup.
- Evaluation days: 222.

## Frozen V1 engines

### MICRO

- Governing timeframe: M5; execution: M1.
- M15 must be Range.
- Previous day must be wide enough: at least 60 pips and at least 60% of ADR20.
- M1 sweep/reclaim must occur near prior-day, prior-two-day, Fib, 200MA or quarter-level confluence.
- Stop 8 pips.
- 70% exit at 10 pips; remainder at 16 pips.
- Maximum hold 90 minutes.
- Research risk 0.25%.

### INTRADAY

- Governing timeframe: M15; execution: M1.
- H4 and H1 Double-BB direction must agree.
- M15 must be Transition or Trend in the same direction.
- M1 must break its prior 12-minute structure near a confluence or quarter level.
- Stop 12 pips.
- 50% exit at 18 pips; remainder at 45 pips.
- Maximum hold 480 minutes.
- Research risk 0.50%.

### MACRO

- Governing timeframe: H1/H4; execution: M1.
- Strong H4/H1 Double-BB agreement.
- M15 Trend in the same direction.
- M5 pullback toward EMA20 / BB middle, followed by M1 directional break.
- Stop 18 pips.
- 35% exit at 30 pips; remainder seeks 120 pips with a causal trailing rule after 50 pips MFE.
- Maximum hold 72 hours.
- Research risk 1.00%.

## Results

| Engine | Trades | Trading-day coverage | Win rate | PF | Expectancy | Total R | Total pips | Average pips | Max DD R |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| MICRO | 86 | 37.84% | 24.42% | 0.411 | -0.444R | -38.20R | -305.6 | -3.55 | 40.52 |
| INTRADAY | 144 | 53.15% | 29.17% | 0.694 | -0.216R | -31.17R | -374.0 | -2.60 | 43.50 |
| MACRO | 31 | 13.96% | 32.26% | 0.651 | -0.237R | -7.34R | -132.1 | -4.26 | 7.99 |
| COMBINED | 261 | 71.62% | 27.97% | 0.592 | -0.294R | -76.70R | -811.7 | -3.11 | 77.98 |

## Capital path

Using the predefined regime risks:

- Start: USD 500.00.
- Final: USD 359.29.
- Return: -28.14%.
- Maximum drawdown: 28.77%.

## Monthly combined results

- March: -2.02R.
- April: -8.89R.
- May: +12.19R.
- June: -11.55R.
- July: -2.77R.
- August: -17.69R.
- September: -14.34R.
- October: -11.28R.
- November: -17.22R.
- December: -3.14R.

## Decision

`REJECTED_AS_A_TRADING_EDGE`

The pilot achieved high activity coverage but failed the positive-expectancy requirement. This is important evidence: the multi-timeframe concept is not enough by itself. Generic M1 sweep/break rules create too many low-quality entries when the goal is to trade most days.

## What remains valid

1. Separate small-pip and large-pip engines.
2. Assign a governing timeframe to every position.
3. Use M1 only for execution, not as the main directional authority.
4. Measure daily coverage together with PF and expectancy.
5. Do not allow lower-timeframe frequency goals to override higher-timeframe location and acceptance.

## Required next research

1. Build a descriptive 2025 opportunity map before changing entry parameters.
2. Measure post-signal MFE/MAE by regime and timeframe.
3. Identify which days truly offered 10 / 20 / 50 / 100-pip causal opportunities.
4. Replace generic M1 breaks with explicit acceptance, first-retest and failed-break state machines.
5. Separate Range, Transition and Trend event studies before combining them.
6. Avoid tuning repeatedly on 2025; use another period for rule development and reserve a later period for validation.

This result does not authorize live trading, leverage changes, broker connection or automatic order placement.
