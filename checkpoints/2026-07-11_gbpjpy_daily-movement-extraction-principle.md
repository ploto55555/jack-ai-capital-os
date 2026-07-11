# GBPJPY Daily Movement Extraction Principle

Date: 2026-07-11
Status: `[RESEARCH_PRINCIPLE] [GBPJPY_ONLY]`

## Core observation

GBPJPY commonly produces substantial intraday movement. The research objective is not to prove that price moves, but to identify which part of that movement can be detected and executed without future information.

## Important distinction

Daily high-low range is not equal to tradable profit.

A valid setup must show that:

- the entry signal existed before the move;
- the stop could be placed at a realistic distance;
- spread and slippage were included;
- false breaks were filtered without using future candles;
- the exit rule captured a meaningful part of the move;
- the result survives DEV, VAL, OOS and rolling 12-month testing.

## Research target

Measure how much of the daily GBPJPY movement can be captured by the Quarter-Level MTF System using:

- H4/H1 direction and regime;
- 200MA and 20MA;
- Double Bollinger Bands;
- BB Bounce, Squeeze and Band Walk;
- 00 / 25 / 50 / 75 price levels;
- Fibonacci and support/resistance confluence;
- M15 setup confirmation;
- M1 execution.

## Required daily metrics

For every trading day record:

1. total daily high-low range;
2. London-session range;
3. New York-session range;
4. largest upward excursion;
5. largest downward excursion;
6. number of false breaks of 00/25/50/75;
7. first accepted breakout direction;
8. maximum favourable excursion after each valid signal;
9. maximum adverse excursion after each valid signal;
10. captured pips and captured percentage of available movement;
11. market regime: Range, Transition or Trend;
12. whether the clean movement was identifiable without future data.

## Main research question

The question is not whether GBPJPY offers movement every day.

The question is:

> Can a causal rule set consistently isolate the correct opportunity and extract a repeatable middle section of the daily move while avoiding most false breaks?

## Current priority

GBPJPY remains the only active research instrument. XAUUSD stays frozen until the GBPJPY target is reached.
