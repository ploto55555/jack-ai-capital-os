# No Detail Loss Protocol

## Purpose

This project is highly detail-sensitive. A missed parameter, timezone, data assumption, version, or rule can invalidate a backtest or corrupt production signals. Therefore memory is treated as untrusted unless it is recorded and traceable.

## Core Rule

The assistant must not rely on phrases such as “I remember.” It must rely on the current GitHub files, exact setup version, dataset reference, and recorded decisions.

## Mandatory Preservation Layers

1. **Raw evidence** — exported chat, uploaded source document, original dataset, or original screenshot reference.
2. **Structured checkpoint** — what was discussed, tested, changed, rejected, and left unresolved.
3. **Formal specifications** — strategy rules, backtest config, setup spec, architecture, and risk rules.
4. **Version history** — Git commit, setup version, decision ID, and replacement relationship.
5. **Latest handover** — a concise restart point for the next chat.

## Mandatory Status Tags

Use these labels where applicable:

- `[IDEA]`
- `[ASSUMPTION]`
- `[CONFIRMED]`
- `[DEFINED]`
- `[CODED]`
- `[BACKTESTED]`
- `[ROBUSTNESS_TESTED]`
- `[VALIDATED]`
- `[APPROVED]`
- `[LIVE_MONITORING]`
- `[REJECTED]`
- `[SUPERSEDED]`
- `[RETIRED]`
- `[TODO]`
- `[BLOCKED]`

## Backtest Detail Checklist

Every formal backtest must record:

- strategy ID and version
- instrument and timeframe
- data filename, period, source, timezone, and preprocessing
- entry timing and fill model
- spread, commission, slippage, and swap assumptions
- stop and target rules
- same-bar stop/target handling
- missing-bar and duplicate-bar handling
- session and daylight-saving handling
- risk and compounding model
- code version and Git commit
- sample size and excluded trades
- metrics and trade-level output
- known limitations and unresolved assumptions

## Checkpoint Trigger

Create or update a checkpoint when any of the following occurs:

- an important rule is confirmed or changed
- a backtest is completed
- a setup is rejected, validated, promoted, demoted, or retired
- a new dataset or implementation is introduced
- a conflict is discovered
- a project stage changes
- the conversation has accumulated enough complexity that context loss becomes plausible
- before recommending a new chat

## Proactive Chat Rotation

The assistant must recommend a new chat before the current chat becomes fragile. Before rotation it must:

1. update the Decision Log
2. update Current Status
3. save active strategy rules and test results
4. update Latest Handover
5. report unresolved conflicts and assumptions
6. verify the relevant GitHub writes succeeded
7. provide one restart message for the new chat

## Conflict Handling

When two formal records disagree:

- do not guess
- do not silently choose the newest-looking value
- identify both records and versions
- mark the affected function or setup as blocked
- request or record an explicit resolution
- add a new decision that supersedes the old rule

## Production Protection

Experimental rules never overwrite production rules. Only an explicitly approved, versioned setup may enter the Capital OS. AI suggestions remain proposals until user approval is recorded.

## Repository Privacy

While the repository is public, only non-sensitive architecture and process documentation may be committed. Secrets must never be committed, even after the repository becomes private.