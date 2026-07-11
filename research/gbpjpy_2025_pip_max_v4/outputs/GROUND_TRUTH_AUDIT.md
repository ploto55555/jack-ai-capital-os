# GBPJPY 2025 Ground Truth Audit

Execution date: 2026-07-11

Source archive: `HISTDATA_COM_MT_GBPJPY_M12025(1).zip`
Source CSV: `DAT_MT_GBPJPY_M1_2025.csv`

## Raw-data audit

- Raw rows in archive: 371,076
- Unique M1 timestamps after cleaning: 371,016
- Duplicate timestamp rows found: 120
- Exact duplicate rows removed: 60
- Conflicting duplicate timestamp groups: 0
- Duplicate timestamps remaining after cleaning: 0
- Missing OHLC rows: 0
- First timestamp: 2025-01-01 17:05:00
- Last timestamp: 2025-12-31 16:57:00

The 60 duplicates are exact copies, not conflicting prices. They occur in the raw archive and must be removed before resampling or backtesting. The previous script incorrectly failed on any duplicate timestamp; the corrected builder now rejects conflicting duplicates but safely removes exact duplicates while recording the audit counts.

## Generated datasets

| Dataset | Rows | First timestamp | Last timestamp |
|---|---:|---|---|
| M5 | 74,480 | 2025-01-01 17:05 | 2025-12-31 17:00 |
| M15 | 24,851 | 2025-01-01 17:15 | 2025-12-31 17:00 |
| H1 | 6,219 | 2025-01-01 18:00 | 2025-12-31 17:00 |
| H4 | 1,605 | 2025-01-01 20:00 | 2025-12-31 20:00 |
| Apr 3-9 M1 focus set | 7,091 | 2025-04-03 00:00 | 2025-04-09 23:59 |

## Research status

Ground Truth Phase 1 is now executed successfully.

No strategy-profit claim is made by this audit. The next executable step is to define and freeze the causal H4/H1 State rules, M15 Acceptance rule, M5/M1 execution rule, campaign risk budget, transaction-cost model, and Core/Add-on/Runner exit logic before running the April 3-9 backtest.
