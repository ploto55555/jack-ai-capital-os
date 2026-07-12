# GBPJPY 2025 State + Campaign Engine V1

Date: 2026-07-12

Status: IN PROGRESS

## Objective

Run the State + Campaign Engine across the entire 2025 GBPJPY dataset and increase the causal, cost-adjusted result from the existing V3 baseline of +1,069.6 net pips to at least +2,000 net pips before attempting the longer-term +5,000-pip objective.

Only 2025 is used in this development stage. No other year is used for validation yet.

The engine is not allowed to optimize April first and then conditionally proceed. April is retained only as a diagnostic month because it contains the April 3-9 Bear Expansion.

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

## Full-year 2025 experiment

The engine must process every available 2025 GBPJPY M1 bar sequentially from January through December.

The engine may create any number of trades in a day when new causal structures appear and Campaign risk permits. Trading frequency must emerge from State, timeframe, stop distance and risk management rather than from a date-based trade limit.

### Required full-year output

1. Every State transition with timestamp, previous state, new state and causal reason.
2. Every Campaign with campaign ID, direction, start/end time and dominant timeframe.
3. Every CORE entry and exit.
4. Every ADD_ON entry and exit.
5. Every RUNNER upgrade and exit.
6. Entry, stop, exit, gross pips, costs and net pips for every position unit.
7. MFE, MAE, hold time, exit reason and governing timeframe.
8. Monthly net-pip table for all twelve months.
9. 2025 total net pips.
10. Profit factor, win rate, average pips and expectancy.
11. Maximum closed-equity pip drawdown and open-equity pip drawdown.
12. Trading-day coverage and number of Campaigns.
13. Pip contribution from CORE, ADD_ON and RUNNER separately.
14. Pip contribution from COMPRESSION, TRANSITION, EXPANSION, PULLBACK, WEAKENING and FAILED_BREAK states.
15. Comparison with V3 full-year baseline of +1,069.6 pips.
16. Comparison with the first-stage target of +2,000 net pips and final target of +5,000 net pips.
17. Missed-pip attribution: late direction, missed retest, stop-out then run, early exit, failed upgrade, state misclassification or risk-cap rejection.

### Diagnostic periods

The full-year engine must additionally isolate and report:

- April 2025 total versus the V3 April baseline of +66.0 pips.
- April 3-9 Bear Expansion Campaign extraction.
- September 2025 loss attribution.
- The five largest profitable Campaigns.
- The five largest losing Campaigns.

These periods are diagnostics only and may not be used with hindsight to change live decisions inside the same run.

## Advancement test

The engine is accepted as the new 2025 research baseline only if:

- Full-year net pips materially exceed +1,069.6.
- The full-year result reaches or moves meaningfully toward +2,000 net pips.
- Improvement is not produced by unlimited stop width, duplicate counting or hidden hindsight.
- Core/Add-on/Runner records reconcile exactly to Campaign and portfolio totals.
- Profit is not dependent on only one isolated historical Campaign.
- Costs, losses and failed Campaigns are fully included.

A result below +2,000 is not to be described as successful. It is a diagnostic iteration and must identify precisely where the missing pips were lost.

## Current known resources

Available research outputs include:

- V3 portfolio trade ledger and parameter grids.
- 2025 candidate-event dataset.
- 2025 daily and 15/30/60-pip historical segment maps.
- Entry/exit opportunity laboratory outputs.

The full M1 event-driven simulation must use the original 2025 M1 source or a normalized equivalent. Historical movement segments may be used only for evaluation and missed-opportunity attribution.
