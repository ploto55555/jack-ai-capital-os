# Jack Strategy Research Lab — Specification

## Role

The Research Lab is the experimental environment for strategy discovery, rule definition, backtesting, robustness testing, rejection, revision, and promotion.

## Research Responsibilities

- convert trading ideas into explicit, testable rules
- document assumptions separately from confirmed rules
- preserve raw data references and preprocessing steps
- run reproducible backtests
- test costs, slippage, spread, and execution assumptions
- test different years, instruments, sessions, and market regimes
- detect overfitting, leakage, look-ahead bias, and fragile parameters
- record failed and rejected experiments
- produce a promotion report for qualified setups

## Research Statuses

- `[IDEA]`
- `[DEFINED]`
- `[CODED]`
- `[BACKTESTED]`
- `[ROBUSTNESS_TESTED]`
- `[VALIDATED]`
- `[REJECTED]`

No research status automatically grants production approval.

## Minimum Reproducibility Package

Each serious candidate strategy must preserve:

- `STRATEGY_RULES.md`
- `BACKTEST_CONFIG.json`
- executable backtest code
- source data reference and checksum when practical
- trades output
- metrics output
- results summary
- version history
- known limitations

## Research Isolation Rule

Experimental logic must not alter approved production setup files. Improvements discovered from live performance return here for testing before a new production version can be proposed.