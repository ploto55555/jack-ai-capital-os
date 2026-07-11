# FX Research Priority Checkpoint — GBPJPY First, XAUUSD Frozen

Date: 2026-07-11
Status: `[PRIORITY_LOCKED] [GBPJPY_ONLY] [XAUUSD_FROZEN]`

## User decision

The research order is now fixed:

1. Research GBPJPY only.
2. Do not begin XAUUSD strategy research yet.
3. XAUUSD starts only after GBPJPY completes the target.

## Target definition

The GBPJPY phase is not considered complete until a causal, reproducible setup satisfies the active Capital Path research goal:

- starting capital: USD 500;
- target capital: USD 100,000;
- measured over rolling 12-month windows;
- no look-ahead bias;
- completed-bar signals;
- executable entry rules;
- spread and conservative same-bar handling included;
- development, validation and out-of-sample checks required.

A single favourable historical window is not enough. The setup must show stable evidence rather than selected-outcome reconstruction.

## Active GBPJPY research framework

Primary structure:

- H4: main direction and market regime;
- H1: trend, pullback, support/resistance and Fibonacci context;
- M15: setup confirmation and range/transition/trend classification;
- M1: execution timing and stop reduction.

Core tools under study:

- 200MA;
- 20MA;
- Double Bollinger Bands 20/1 and 20/2;
- Bollinger Band width and squeeze;
- Bollinger bounce and band-walk continuation;
- price quarter levels 00 / 25 / 50 / 75;
- 50-pip major ranges and 25-pip minor ranges;
- Fibonacci 38.2%, 50%, 61.8%;
- support/resistance;
- breakout, fake breakout, sweep, reclaim and retest;
- range, transition and trend percentage analysis.

## XAUUSD status

The uploaded XAUUSD M1, M5, M15, M30, H1, H4 and D1 data are retained for later use.

No XAUUSD setup optimization, backtest selection or capital-path promotion is allowed before the GBPJPY phase reaches its target.

## Research workflow rule

Every major completed research stage must create a new checkpoint containing:

- what was tested;
- exact data and parameters;
- actual backtest results;
- pass/reject decision;
- reason for the decision;
- GitHub commit;
- next research action.

This checkpoint is the handover memory for future chats.
