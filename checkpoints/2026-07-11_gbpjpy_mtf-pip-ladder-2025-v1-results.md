# GBPJPY Multi-Timeframe Pip Ladder — 2025 V1 Results

Date: 2026-07-11

## Scope

- GBPJPY only; XAUUSD remains frozen.
- M1 source data for calendar 2025.
- Evaluation from 2025-03-01 after H4 SMA200 warmup.
- 222 FX trading days.
- H4/H1 Double BB direction -> M15 Range/Transition/Trend -> quarter/Fib/200MA context -> M1 execution.
- Separate MICRO, INTRADAY and MACRO pip ladders.

## Result

- MICRO: 86 trades, 37.84% day coverage, PF 0.411, -38.20R, -305.6 pips.
- INTRADAY: 144 trades, 53.15% day coverage, PF 0.694, -31.17R, -374.0 pips.
- MACRO: 31 trades, 13.96% day coverage, PF 0.651, -7.34R, -132.1 pips.
- Combined: 261 trades, 71.62% trading-day coverage, PF 0.592, expectancy -0.294R, -76.70R, -811.7 pips.
- Capital path using 0.25% / 0.50% / 1.00% regime risks: USD 500 -> USD 359.29; max drawdown 28.77%.

## Decision

`REJECTED_AS_A_TRADING_EDGE`

The pilot met the high-activity objective but failed positive expectancy. The lesson is that "small timeframe for small pips and large timeframe for large pips" is a sound architecture, but generic lower-timeframe sweep/break entries are not enough. Trying to cover most days introduced excessive noise.

## Next required research

- Produce a descriptive 2025 opportunity map before changing rules.
- Measure causal 10/20/50/100-pip opportunities and post-confirmation MFE/MAE.
- Build explicit acceptance, first-retest and failed-break state machines.
- Keep engines separate until each regime has positive expectancy.
- Do not repeatedly tune on 2025 and then call the result validation.

## Repository

- Branch: `research/gbpjpy-mtf-pip-ladder-2025-v1`
- Report: `research/gbpjpy_mtf_pip_ladder_2025_v1/REPORT.md`
- Report commit: `815ec6a69dbfffe4a0e14689ee95ebd146ed1f5e`
