# GBPJPY Regime Money Management — Abu Style

Date: 2026-07-11  
Status: `[CORE_PRINCIPLE] [GBPJPY_FIRST] [RESEARCH_ONLY]`

## Core idea

The system must not use the same risk percentage in every market condition.

GBPJPY moves through three operating states:

1. Range / compression
2. Transition / breakout validation
3. Trend / accepted expansion

The money-management model must change with the market state.

## Range mode

Characteristics:

- 20MA flat;
- Bollinger Band width compressed;
- price repeatedly crosses 20MA and 200MA;
- repeated reactions around 00 / 25 / 50 / 75;
- frequent false breaks on both sides.

Research risk treatment:

- smallest risk tier;
- one attempt per side or one daily range campaign;
- fast invalidation;
- no repeated re-entry after consecutive failed sweeps;
- do not use Attack mode;
- objective is capital preservation while waiting for expansion.

Initial research bands:

- Safe range risk: 0.25%-0.50% per attempt;
- maximum daily range risk: 0.75%-1.00%;
- after two failed attempts, stop range trading for that session.

These percentages are research variables, not live-trading approval.

## Transition mode

Characteristics:

- M15 candle closes outside the established range;
- Bollinger Band width begins expanding;
- 20MA slope changes;
- next candle does not immediately re-enter the range;
- M1 retest holds the breakout area;
- higher-low / lower-high plus break of structure appears.

Research risk treatment:

- still conservative before acceptance is proven;
- initial probe risk only;
- increase exposure only after the breakout survives the retest;
- stop adding if price returns inside the old range.

Initial research bands:

- Probe: 0.50%-0.75%;
- Confirmed transition: total campaign risk up to 1.00%-1.50%;
- no averaging down;
- any added position must be protected by structure or existing unrealized profit.

## Trend / accepted expansion mode

Characteristics:

- H4 and H1 direction aligned;
- price remains on the correct side of 200MA;
- M15 remains in the Double Bollinger Buy/Sell Zone;
- BB width continues expanding;
- pullbacks hold 20MA, 1-sigma band, Fibonacci or quarter levels;
- price does not return to the original range.

Research risk treatment:

- highest risk tier is allowed only after market acceptance;
- add only in profit;
- protect earlier entries before adding;
- use one total campaign-risk cap, not unlimited independent M1 trades;
- preserve a runner for 5R, 10R or larger expansion when structure remains valid.

Initial research bands:

- Base trend entry: 1.00%;
- confirmed continuation add: 0.50%-1.00%;
- total open campaign risk cap: 1.50%-2.00% in normal research mode;
- higher 3% / 5% / 8% capital-path stress tests are simulation only and require independent validation before any real use.

## Abu-style principles retained

- wait more than trade;
- accept small controlled -1R losses;
- do not increase risk after losses;
- increase only when the market proves the position correct;
- add only in profit;
- protect capital during compression;
- attack only after expansion is confirmed;
- hold the rare large winner instead of taking all profit too early.

## State transition logic

```text
RANGE
  -> small risk, fast exit, protect capital

TRANSITION
  -> probe only, wait for acceptance

TREND
  -> normal risk, add only in profit, hold runner

FAILED BREAKOUT
  -> reduce immediately back to Range / Wait mode
```

## Research requirement

The backtest must compare:

1. fixed risk across all states;
2. conservative Range + larger Trend risk;
3. probe-then-add model;
4. add-only-in-profit model;
5. daily campaign-risk cap;
6. effect on expectancy, geometric growth and drawdown;
7. rolling 12-month USD 500 to USD 100,000 target.

The strategy is rejected if higher returns come mainly from increasing risk during unconfirmed range conditions.

## Locked sequence

- Research GBPJPY first.
- Do not begin XAUUSD setup research until the GBPJPY target is completed.
