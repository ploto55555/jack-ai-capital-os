# GBPJPY 2025 State + Campaign Engine V1 — Full-Year Diagnostic

Date: 2026-07-12

Status: `REJECTED_DIAGNOSTIC_ITERATION`

## Data and causality

- Source: HISTDATA_COM_MT_GBPJPY_M12025(1).zip
- M1 rows: 371,076
- Sequential completed-bar simulation
- Entry after signal availability
- 2-pip round-trip cost
- Same-bar stop/target ambiguity resolved stop-first
- No daily trade-count cap
- No hindsight ZigZag direction used for entry selection

## First implementation tested

This first full-year implementation isolated the cleanest causal continuation setup available in the frozen event set:

- M15 state = TREND
- H4/H1 direction agrees with the trade
- M1 Sweep + Reclaim execution
- minimum four-hour spacing between same-direction structures
- 25-pip stop
- 240-pip target
- after +30 pips MFE, stop locks +2 pips
- maximum hold 72 hours

The search compared causal event families, quality thresholds, H4/H1 filters, M15 states, stop sizes, targets and spacing. This is still an in-sample 2025 development scan.

## Best full-year result

- Trades: 49
- Net pips: +195.1
- Profit factor: 1.259
- Win rate: 40.82%
- Maximum closed-equity pip drawdown: 258.0 pips
- Positive months: 6
- Negative months: 5
- April: +34.0 pips
- September: +2.0 pips

## Monthly results

| Month | Trades | Net pips |
|---|---:|---:|
| 2025-02 | 4 | -50.0 |
| 2025-03 | 6 | -102.0 |
| 2025-04 | 12 | +34.0 |
| 2025-05 | 9 | +112.0 |
| 2025-06 | 2 | -52.0 |
| 2025-07 | 3 | -20.4 |
| 2025-08 | 3 | +55.4 |
| 2025-09 | 2 | +2.0 |
| 2025-10 | 1 | -26.0 |
| 2025-11 | 3 | +54.1 |
| 2025-12 | 4 | +188.0 |

## Decision

This version is rejected as the new baseline.

It did not exceed the V3 baseline of +1,069.6 pips and did not approach the +2,000-pip stage target. The result confirms that simply filtering Sweep + Reclaim entries with TREND plus H4/H1 agreement is too selective and does not implement the intended Campaign architecture strongly enough.

## What failed

1. State filter was too strict, reducing the system to only 49 trades.
2. Core entries were not linked to persistent campaign IDs.
3. Add-ons were not activated from protected Core positions.
4. Runner exits remained fixed-target/time based rather than H1/H4 state exits.
5. April 3-9 was not captured as one continuous Bear Expansion campaign.
6. The engine treated continuation structures independently instead of managing shared campaign exposure.

## Required V2 change

The next version must be a true stateful campaign simulator:

- M15 Acceptance creates a persistent Campaign ID.
- First M5 Retest or Sweep/Reclaim creates Core.
- State remains active across calendar days.
- Protected Core permits Re-compression Add-ons.
- Each position unit has independent stop, but shared Campaign risk.
- H1/H4 state controls Runner exit.
- Failed execution does not close the State.
- Opposite accepted transition or H1/H4 invalidation closes the Campaign.

Current validated baseline remains V3 at +1,069.6 net pips.
