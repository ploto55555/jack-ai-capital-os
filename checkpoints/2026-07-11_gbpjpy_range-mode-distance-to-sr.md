# GBPJPY Range Mode — Distance to Support/Resistance

Date: 2026-07-11
Status: `[CORE_RULE] [GBPJPY_ONLY]`

## Principle

Range Mode must calculate the current-price distance in pips to nearby support and resistance before any trade is considered.

The system must include:

1. Previous-day high and low.
2. Day-before-yesterday high and low as secondary context.
3. Current H1/H4 structural support and resistance.
4. Daily and weekly major support and resistance.
5. 00 / 25 / 50 / 75 quarter levels.
6. H1/H4 20MA and 200MA when they overlap price structure.
7. Valid pre-entry Fibonacci 38.2%, 50%, and 61.8% levels.

## Pip-distance calculation

For GBPJPY:

- one pip = 0.01;
- distance in pips = absolute(level - current price) / 0.01.

Directional distances must also be stored:

- distance to nearest resistance above;
- distance to nearest support below;
- distance to the intended target;
- distance to invalidation/stop;
- available reward-to-risk after spread and estimated slippage.

## Level hierarchy

### Tier A — Major higher-timeframe levels

- Weekly swing high/low;
- Daily swing high/low;
- H4 confirmed structural high/low;
- Daily/H4 200MA overlap;
- multiple confluence levels within a defined zone.

### Tier B — Active directional levels

- Previous-day high/low;
- H1 confirmed structural high/low;
- H1 20MA/200MA overlap;
- valid H1 Fibonacci retracement;
- session high/low.

### Tier C — Execution levels

- 00 / 50 major quarter levels;
- 25 / 75 minor quarter levels;
- M15 range high/low;
- M1 sweep/reclaim and break/retest structure.

## Range Mode trade-space rule

A Range trade is not allowed merely because price reacts at a support or resistance.

Before entry, calculate:

- current price to nearest opposing level;
- entry to target distance;
- entry to stop distance;
- net available pips after spread/slippage;
- reward-to-risk ratio;
- whether the target collides with a major higher-timeframe level.

Example:

- current price: 216.62;
- nearest resistance: 216.75 = 13 pips;
- nearest major resistance: 217.00 = 38 pips;
- nearest support: 216.50 = 12 pips.

A long trade from 216.62 toward 216.75 has insufficient space unless the stop is exceptionally small and the setup has strong confirmation. A short trade toward 216.50 may also be poor because only 12 pips are available before support.

In this condition the correct state may be `WAIT`, not Range Buy or Range Sell.

## Proposed first research thresholds

These are test values, not final live rules:

- less than 10 net pips to next opposing level: no trade;
- 10-20 net pips: only highest-quality Range reversal with reduced risk;
- 20-35 net pips: normal Range opportunity;
- more than 35 pips: potential expansion opportunity, subject to regime confirmation;
- minimum net reward-to-risk: test 1.5R, 2R, and 2.5R.

## Confluence-zone handling

Nearby levels must be grouped into zones rather than treated as separate exact lines.

Initial GBPJPY grouping tolerance to test:

- major levels: within 5-8 pips;
- minor levels: within 3-5 pips;
- volatility-adjusted alternative: 0.10-0.20 of M15 ATR.

A zone receives more weight when multiple items overlap, for example:

- 216.50 quarter level;
- previous-day low;
- H1 Fibonacci 61.8%;
- H1 200MA;
- M15 lower Bollinger Band.

## Range Mode decision output

The engine must display:

- current regime;
- nearest support and distance in pips;
- nearest resistance and distance in pips;
- next major support and resistance;
- position within the active range as a percentile;
- free space in the intended direction;
- stop distance;
- net target distance;
- reward-to-risk;
- decision: Buy Edge / Sell Edge / Middle / Wait / Expansion Watch.

## Important distinction

`Previous day` and `day before yesterday` must be stored separately:

- PDH / PDL = previous trading day high/low;
- D2H / D2L = day-before-yesterday high/low.

PDH/PDL have first priority for current-day intraday reactions. D2H/D2L are secondary levels unless they overlap higher-timeframe structure.

## Research requirement

Backtest separately:

1. Range entries near PDH/PDL.
2. Range entries near D2H/D2L.
3. Entries near H1/H4 major structure.
4. Entries with quarter-level overlap.
5. Entries with Fibonacci/MA/Bollinger confluence.
6. Middle-of-range entries versus edge entries.
7. Performance by available-space bucket.

The objective is to determine whether pip-space to the next support/resistance meaningfully predicts expectancy, MFE, MAE, false-break rate, and opportunity extraction.
