# Setup Promotion Rules

## Promotion Path

`IDEA → DEFINED → CODED → BACKTESTED → ROBUSTNESS_TESTED → VALIDATED → APPROVED → LIVE_MONITORING`

A setup may be rejected at any stage. Rejected versions remain archived.

## Promotion Gate

Before a setup may enter the Capital OS, the promotion report must document:

- exact entry, stop, exit, and invalidation rules
- supported instruments, timeframes, sessions, and timezone
- data period, source, quality, and preprocessing
- spread, commission, slippage, and execution assumptions
- sample size and trade distribution
- win rate, expectancy, average R, profit factor, drawdown, and losing streak
- in-sample and out-of-sample separation
- regime and robustness tests
- parameter sensitivity
- look-ahead and leakage checks
- known failure conditions
- operational and risk constraints
- setup ID and immutable version

## Approval Rule

Validation is technical evidence. Approval is a separate explicit user decision.

No setup becomes `[APPROVED]` until the user approves the exact version. Approval must be recorded in `docs/04_DECISION_LOG.md`.

## Versioning

- small parameter or implementation correction: patch/minor version
- material logic change: new major version
- old versions are never overwritten or deleted
- results from different versions must remain separated

## Demotion and Retirement

A production setup may return to the Research Lab when live evidence shows degradation, unexpected behavior, or a regime mismatch. Retirement does not erase history.