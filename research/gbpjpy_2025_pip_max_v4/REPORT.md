# GBPJPY 2025 Pip Maximization V4

## Objective

Build a fully causal, cost-adjusted, reproducible GBPJPY 2025 research pipeline targeting at least 5,000 net pips without treating conceptual analysis as backtest output.

## Raw data verified

Source archive: `HISTDATA_COM_MT_GBPJPY_M12025(1).zip`

Contained file: `DAT_MT_GBPJPY_M1_2025.csv`

Verified rows: **371,076 M1 bars**

Verified range: **2025-01-01 17:05 to 2025-12-31 16:57**

Columns: date, time, open, high, low, close, volume

No missing OHLC rows were found during the initial load.

## Locked research rules

1. 2025 only.
2. Signals use completed bars only.
3. Entry occurs no earlier than the next M1 open after signal confirmation.
4. No future swing, future high/low, centered indicator or hindsight ZigZag may be used for entry.
5. GBPJPY pip size is 0.01.
6. Every trade must record spread/slippage assumptions and net pips.
7. Core, Add-on and Runner must be reported separately.
8. A model is not accepted until every trade can be reproduced from the raw M1 file.

## Pipeline

Raw M1 -> M5/M15/H1/H4 completed bars -> State Engine -> M15 Acceptance -> M5/M1 execution -> Core/Add-on/Runner -> Campaign ledger -> monthly and annual attribution.

## Current execution stage

Phase 1 has started: raw-data validation and deterministic multi-timeframe reconstruction.

The first controlled experiment is the 2025-04-03 to 2025-04-09 Bear Expansion study. The first required output is a complete ledger containing signal time, next-M1 entry, role, stop, exit, gross pips, costs and net pips.

## Baseline

Historical V3 reference remains **+1,069.6 net pips** for the year and **+66 net pips** for April. These numbers are references only until reproduced from code in this branch.

## Acceptance criteria for V4 candidate

- Completely causal
- Cost adjusted
- Reproducible from raw M1
- April trade ledger included
- April total net pips included
- April maximum pip drawdown included
- April 3-9 actual extracted pips included
- Full-year test required before promotion
