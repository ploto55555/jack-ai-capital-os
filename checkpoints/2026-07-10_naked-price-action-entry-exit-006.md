# Naked Price Action Entry/Exit Direction

Date: 2026-07-10
Status: ACTIVE RESEARCH DIRECTION

## Decision

Swing research remains the primary line. The prior Regime V9.x setup-generation framework is retained as the opportunity/context layer. Entry and exit research will now be rebuilt around naked price action rather than indicator-heavy logic.

## Core Principle

- Regime decides where and when to look.
- Price action decides whether to enter.
- Market structure defines invalidation and stop placement.
- Price structure and trailing logic decide exit.
- Fibonacci is a location/confluence tool, not a standalone signal.

## Naked Price Inputs

1. D1/H4 swing structure: HH/HL, LH/LL, range, break of structure.
2. Major horizontal levels: prior swing highs/lows, previous day/week highs/lows, breakout/retest zones.
3. Fibonacci retracement zones measured from objectively defined impulse legs.
4. Price-action confirmation on H1/M15: rejection, sweep-and-reclaim, engulfing, inside-bar break, micro-structure break.
5. Stop placement beyond objective invalidation, not arbitrary fixed pips.

## First Entry Models To Test Independently

### PA-A Breakout and First Retest
- Regime V9 direction must agree.
- Price breaks an objective H4/H1 resistance or support level.
- Only the first retest is eligible.
- Entry after reclaim/rejection and lower-timeframe structure confirmation.

### PA-B Fibonacci Pullback Continuation
- Define the impulse leg using confirmed swings.
- Pullback must enter a Fibonacci zone such as 50%-61.8% or 61.8%-78.6%.
- The Fibonacci zone must overlap horizontal support/resistance or a breakout-retest area.
- Entry requires price-action confirmation.

### PA-C Liquidity Sweep and Reclaim
- Price sweeps a prior swing high/low or previous day/week extreme.
- Candle closes back inside the prior structure.
- Entry requires confirmation through a micro-structure break.

## Exit Models To Test

1. No partial exit; structure trail only.
2. Move stop to breakeven after +1R or +1.5R.
3. Lock +0.25R or +0.5R only after new structure forms.
4. Partial profit at +2R, leave runner.
5. H1 swing trail until +3R, then H4 swing trail.
6. ATR trail as comparison only.
7. Fibonacci extensions such as 1.272 and 1.618 are decision zones, not automatic exits.

## Required Metrics

- unique trade campaigns per year;
- duplicate-signal reduction;
- entry MAE and MFE;
- win rate;
- expectancy in R;
- total and average pips;
- MFE capture ratio;
- runner contribution;
- maximum single-trade R and pips;
- rolling 12-month equity path from USD 500;
- drawdown and risk-of-ruin stress tests.

## Guardrails

- Do not claim that all professional traders use naked trading.
- Do not treat Fibonacci alone as predictive.
- Do not permit subjective swing selection in the backtest; anchor rules must be explicit.
- Do not count repeated entries inside one market move as separate independent setups.
- No setup enters Capital OS without out-of-sample and independent validation.
