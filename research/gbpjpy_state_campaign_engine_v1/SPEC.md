# GBPJPY 2025 State + Campaign Engine V1

Date: 2026-07-12

Status: IN PROGRESS

## Objective

Increase the causal, cost-adjusted GBPJPY 2025 result from the existing V3 baseline of +1,069.6 net pips to at least +2,000 net pips before attempting the longer-term +5,000-pip objective.

Only 2025 is used in this development stage. No other year is used for validation yet.

## Non-negotiable accounting rules

- Completed bars only.
- Entry occurs after signal availability.
- Include 2 pips round-trip cost per entry unit unless the data model provides bid/ask.
- Same-bar SL/TP ambiguity is resolved stop-first.
- No daily trade-count cap.
- Every new entry requires a new causal structure.
- No averaging down.
- Position size is determined by stop distance and risk budget.
- Overlapping entries in the same directional move belong to one Campaign for risk accounting.
- Do not use hindsight trend labels, daily highs/lows, or final ZigZag direction to select trades.

## Architecture

### State Engine

States:

1. COMPRESSION
2. TRANSITION
3. EXPANSION
4. PULLBACK
5. WEAKENING
6. FAILED_BREAK

State inputs:

- H4/H1 Double Bollinger Band location and slope.
- H4 and H1 20MA slope.
- H4 200MA side, crossing, acceptance and distance.
- M15 BB Width percentile and expansion/contraction.
- M15 directional acceptance.
- Causal swing structure.

The H4 200MA is a state filter, not a standalone entry signal.

### Campaign Engine

A campaign has:

- CORE
- ADD_ON
- RUNNER

Rules:

- CORE starts only after State and M15 direction are causally confirmed.
- ADD_ON requires a new M5/M15 continuation structure and the existing campaign to be protected or within the campaign risk budget.
- RUNNER is governed by H1/H4 state, not M1 noise.
- A failed execution does not automatically invalidate the State.
- A State invalidation closes or downgrades the Campaign.

### Execution Engine

Primary execution hierarchy:

1. M15 Acceptance establishes candidate direction.
2. First M5 Retest.
3. M1 Sweep + Reclaim at the retest/location zone.
4. M5 Re-compression continuation.

Ordinary M1 BOS alone is not a primary entry.

### Risk Engine

- Risk is set by setup class and stop distance.
- Structural stop plus buffer.
- No fixed lot.
- No daily trade-count restriction.
- Total open Campaign risk is capped.
- Add-ons may only increase exposure when the campaign remains valid.

## April 2025 first experiment

The first isolated experiment covers April 2025, with special attention to the April 3-9 Bear Expansion after the H4 200MA break.

Required output:

1. State timeline and every State transition.
2. Every CORE entry and exit.
3. Every ADD_ON entry and exit.
4. Every RUNNER entry/upgrade and exit.
5. April total net pips.
6. April maximum pip drawdown.
7. April 3-9 campaign net pips.
8. Entry delay, MFE, MAE and exit reason for every position unit.
9. Comparison with the V3 April baseline of +66.0 pips.
10. Missed-pip attribution: late direction, missed retest, stop-out then run, early exit, failed upgrade, or state misclassification.

## Advancement test

The April engine advances to the full 2025 test only if:

- April remains net positive.
- It materially exceeds the +66.0-pip V3 baseline.
- The April 3-9 expansion is captured without hindsight direction selection.
- Profit is not created by unlimited stop width or duplicate counting.
- Core/Add-on/Runner records reconcile exactly to campaign and portfolio totals.

## Current known resources

Available local research outputs include:

- V3 portfolio trade ledger and parameter grids.
- 2025 candidate-event dataset.
- 2025 daily and 15/30/60-pip historical segment maps.
- Entry/exit opportunity laboratory outputs.

The full M1 event-driven simulation must use the original 2025 M1 source or a normalized equivalent. Historical movement segments may be used only for evaluation and missed-opportunity attribution.
