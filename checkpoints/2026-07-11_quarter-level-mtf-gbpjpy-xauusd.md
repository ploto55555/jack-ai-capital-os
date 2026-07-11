# Checkpoint — Quarter-Level MTF GBPJPY + XAUUSD Focus

Date: 2026-07-11
Status: ACTIVE RESEARCH MEMORY / NEW-CHAT HANDOVER

## Primary instruments

This FX research will focus mainly on two instruments:

1. GBPJPY
2. XAUUSD

These two are the main profit engines. Other symbols may be used only for comparison or robustness checks, not as equal-priority development targets.

## Core objective

Develop a causal multi-timeframe day-trading framework that captures repeated intraday pips while filtering false breakouts.

Capital-path research remains separate from live execution approval. Personal research support only; no automatic order placement.

## New system concept

Working name: Quarter-Level MTF System.

Multi-timeframe workflow:

- H4: primary market direction and macro structure
- H1: trend condition, pullback or reversal context
- M15: setup confirmation and market-regime classification
- M1: precise entry and reduced stop distance

The four charts represent the same market time and should be analysed as one campaign, not as unrelated signals.

## Core tools

- 200 MA
- 20 MA
- Bollinger Bands 20,2
- Double Bollinger Bands 20,1 and 20,2
- Bollinger Bounce
- Bollinger Squeeze / BB Width
- 00 / 25 / 50 / 75 quarter-price levels
- Fibonacci 38.2%, 50%, 61.8%
- prior highs/lows and structural support/resistance
- M1 sweep, reclaim, structure break and retest

## Quarter-level logic

For GBPJPY, prices such as 216.00, 216.25, 216.50 and 216.75 are treated as zones, not exact lines.

- 00 and 50: major 50-pip support/resistance structure
- 25 and 75: minor 25-pip structure
- repeated tests, false breaks and acceptance outside the zone must be measured separately

Equivalent gold interval definitions must be derived from XAUUSD volatility rather than copied directly from GBPJPY.

## Three BB market modes

1. Range: Bollinger Bounce / mean reversion
2. Transition: Bollinger Squeeze breakout or fake breakout reclaim
3. Trend: Double-BB band walk and pullback continuation

The research must calculate actual Range / Transition / Trend percentages from data instead of assuming the popular 70/30 claim.

## Main setup families

1. Trend pullback continuation at quarter level + Fib + MA/BB confluence
2. Quarter-level false breakout / sweep and reclaim
3. Genuine squeeze breakout and retest continuation
4. Double-BB trend-zone pullback

## Hard testing rules

- H4/H1 direction must use completed bars
- M15 confirms setup
- M1 entry must be executable after confirmation
- no look-ahead
- conservative stop-first handling for ambiguous bars
- spread/slippage included
- one market campaign must not be counted as many independent M1 opportunities
- GBPJPY and XAUUSD results must be reported separately before combining
- trend-following and countertrend results must be separated
- all major research stages must create one checkpoint/handover file for new-chat continuation

## Uploaded XAUUSD data received

- XAUUSD M1: 2026-03-30 to 2026-07-10, 100,000 rows
- XAUUSD M5: 2025-02-11 to 2026-07-10, 100,000 rows
- XAUUSD M15: 2022-04-19 to 2026-07-10, 100,000 rows
- XAUUSD M30: 2018-01-24 to 2026-07-10, 100,000 rows
- XAUUSD H1: 2009-10-26 to 2026-07-10, 100,000 rows
- XAUUSD H4: 2009-10-06 to 2026-07-10, 26,832 rows
- XAUUSD D1: 2009-10-06 to 2026-07-10, 5,215 rows

Files are tab-separated without a header row and parse as:

Time, Open, High, Low, Close, Volume

## Next research order

1. Audit XAUUSD multi-timeframe consistency and timezone assumptions
2. Define XAUUSD quarter/round-number interval sizes from volatility and market convention
3. Calculate Range / Transition / Trend occupancy for GBPJPY and XAUUSD
4. Measure reaction probabilities around round/quarter levels
5. Add Double BB, Bounce, Squeeze, Fib and 200MA confluence
6. Test H4/H1 direction + M15 confirmation + M1 execution
7. Produce separate GBPJPY and XAUUSD causal backtests

This checkpoint is the official starting memory for the new GBPJPY + XAUUSD Quarter-Level MTF research.
