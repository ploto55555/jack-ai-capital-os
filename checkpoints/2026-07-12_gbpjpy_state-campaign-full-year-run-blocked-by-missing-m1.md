# GBPJPY 2025 State + Campaign Full-Year Run — Execution Blocker

Date: 2026-07-12

## Requested execution

Run the full 2025 State + Campaign Engine across GBPJPY M1 data with:

- State Engine
- Campaign Engine
- CORE / ADD_ON / RUNNER
- no daily trade-count cap
- structural stops and risk-based sizing
- 2-pip cost
- causal completed-bar execution

## Active-runtime inventory checked

Present:

- 2025 candidate event dataset (`candidate_events.csv`, 25,795 rows).
- V3 selected trade ledgers and parameter grids.
- 2025 daily movement summaries and 15/30/60-pip hindsight segment maps.
- Entry/extraction laboratory outputs.
- Full-year engine specification.

Missing from the active runtime:

- Original `HISTDATA_COM_MT_GBPJPY_M12025.zip`.
- Normalized 2025 M1 OHLC CSV/GZIP equivalent.

Known source identity from previous audit:

- File: `HISTDATA_COM_MT_GBPJPY_M12025.zip`
- SHA-256: `458c7c4a540d63b81f09da4359811fe7bf99c4b72017510dd1f60d433472e933`
- Clean source rows: 371,076
- 2025 analysis rows: 371,016

## Why execution cannot be completed from summary files

The candidate-event and historical-segment datasets do not contain the complete minute-by-minute OHLC path. Without the M1 path, the engine cannot causally determine:

1. Exact next-bar fills.
2. Whether structural stop or target was reached first.
3. Same-minute stop/target ambiguity.
4. MFE and MAE.
5. Open-equity drawdown.
6. M1 sweep/reclaim execution.
7. M5 retest structure and stop placement.
8. H1/H4 runner exit timing.
9. Concurrent Campaign risk.

Using hindsight 15/30/60-pip segments as a substitute would leak future direction and would not be a valid backtest.

## Current status

`BLOCKED_PENDING_2025_M1_OHLC_SOURCE`

No new annual pip result has been produced. The last completed causal candidate remains V3 at +1,069.6 net pips.

## Resume condition

Resume immediately when either of these is mounted in the active runtime:

- `HISTDATA_COM_MT_GBPJPY_M12025.zip`
- a normalized file with columns `timestamp,open,high,low,close[,volume]` whose source checksum reconciles to the known audit

No strategy redesign is required before resuming. The full-year specification is already frozen in:

`research/gbpjpy_state_campaign_engine_v1/SPEC.md`
