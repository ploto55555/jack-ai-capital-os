# Latest Handover

## Date

2026-07-10

## What Was Established

The project is now formally divided into two systems:

1. **Jack AI Capital OS** — production decision support using only approved setups.
2. **Jack Strategy Research Lab** — strategy discussion, rule definition, backtesting, robustness testing, rejection, and validation.

A setup can move from the Research Lab into the Capital OS only after a documented promotion review and explicit approval of the exact version.

## Memory and Continuity Rule

GitHub is the formal source of truth. Long ChatGPT conversations are temporary workspaces. The assistant must proactively create checkpoints and recommend a new chat before context becomes fragile.

## Files Added

- `docs/00_PROJECT_MASTER.md`
- `docs/01_CAPITAL_OS_SPEC.md`
- `docs/02_RESEARCH_LAB_SPEC.md`
- `docs/03_SETUP_PROMOTION_RULES.md`
- `docs/04_DECISION_LOG.md`
- `docs/05_CURRENT_STATUS.md`
- `docs/06_NO_DETAIL_LOSS_PROTOCOL.md`
- `docs/99_LATEST_HANDOVER.md`

## Important Blocker

The repository was still **public** at the latest check. Do not add proprietary strategy rules, account information, capital details, personal journals, credentials, or sensitive backtest research until it is changed to private.

## Next Chat Startup Procedure

At the start of a continuation chat, read in this order:

1. `docs/00_PROJECT_MASTER.md`
2. `docs/04_DECISION_LOG.md`
3. `docs/05_CURRENT_STATUS.md`
4. `docs/06_NO_DETAIL_LOSS_PROTOCOL.md`
5. `docs/99_LATEST_HANDOVER.md`
6. active strategy rules and latest result files, when they exist

Then report:

- current system version
- active research topic and version
- confirmed rules
- latest test evidence
- unresolved assumptions or conflicts
- next action

## Immediate Next Step

Change the repository to private, then import and audit the old Step 36.1 Interactive UI chat and create the first sensitive project checkpoint.