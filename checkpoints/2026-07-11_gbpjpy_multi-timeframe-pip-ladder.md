# GBPJPY Multi-Timeframe Pip Ladder

Date: 2026-07-11

## Core idea

Use small timeframes to capture smaller intraday movements and larger timeframes to identify and hold larger directional moves.

## Timeframe roles

- M1: execution, micro structure, sweep/reclaim, retest, very short holding decisions.
- M5: small intraday legs and confirmation after M1 noise.
- M15: intraday regime and campaign management.
- H1: broader session direction and medium-size trend legs.
- H4: major trend context and large expansion potential.
- D1: multi-day structure, compression, and large directional targets.

## Initial research target bands

These are hypotheses to test, not fixed promises:

- M1/M5 opportunity: roughly 5-20 pips.
- M15 opportunity: roughly 15-50 pips.
- H1 opportunity: roughly 30-100 pips.
- H4/D1 opportunity: roughly 80-300+ pips.

Targets and stops must be based on structure and ATR, not on arbitrary fixed pip values alone.

## Critical rules

1. A small-timeframe signal must not automatically close a large-timeframe campaign.
2. Each trade must be tagged with its governing timeframe, thesis, invalidation, target horizon, and expected holding period.
3. Entries from multiple timeframes inside the same directional move belong to one Daily Campaign for risk accounting.
4. Small timeframe can provide frequent small-pip participation; confirmed higher-timeframe trend can convert part of the position into a runner.
5. Risk increases because the regime and setup quality are confirmed, not merely because the timeframe is larger.
6. Backtest separately by timeframe and then test the combined portfolio without double-counting overlapping moves.

## Research metrics

- Trades and trading-day coverage by governing timeframe.
- Average pips, R, MFE, MAE, and holding time by timeframe.
- Missed trend rate.
- Premature exit rate caused by lower-timeframe noise.
- Opportunity extraction rate by timeframe.
- Campaign-level drawdown and capital path.
