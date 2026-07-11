# GBPJPY 2025 — Frozen Lower-Timeframe Small-Stop 3R Backtest

## Frozen causal rules

- H4 close below H4 SMA200 and H4 EMA20
- H1 close below H1 EMA20
- M15 close below lower 1-standard-deviation band
- M5 prior-bar pullback touch followed by bearish rejection
- Within 10 minutes, a completed M1 bar closes below the prior 2 M1 lows
- Entry at the next available M1 open
- Stop above the prior 12 completed M1 highs plus 1 pip
- Accept only 6–15 pip initial stops
- Full exit at 3R
- One open trade at a time
- 60-minute cooldown after exit
- Conservative same-bar ordering: stop before target
- 3 pips round-trip cost per trade

## Full-year result

- Trades: 54
- Wins: 13
- Losses: 41
- Win rate: 24.07%
- Gross pips before modeled costs: -35.4
- Costs: -162.0 pips
- Net pips: **-197.4**
- Average trade: -3.66 pips
- Average winner: +27.78 pips
- Average loser: -13.62 pips
- Profit factor: 0.65
- Maximum closed-trade drawdown: -218.7 pips
- Largest winner: +41.1 pips
- Largest loser: -17.5 pips

## Monthly result

| Month | Trades | Net pips | Win rate | Profit factor |
|---|---:|---:|---:|---:|
| 2025-02 | 15 | -75.1 | 20.0% | 0.52 |
| 2025-03 | 3 | -43.1 | 0.0% | 0.00 |
| 2025-04 | 9 | +10.3 | 33.3% | 1.12 |
| 2025-05 | 1 | -15.8 | 0.0% | 0.00 |
| 2025-07 | 3 | -47.9 | 0.0% | 0.00 |
| 2025-08 | 8 | +4.4 | 37.5% | 1.07 |
| 2025-09 | 2 | -25.9 | 0.0% | 0.00 |
| 2025-10 | 8 | +3.0 | 37.5% | 1.04 |
| 2025-11 | 5 | -7.3 | 20.0% | 0.85 |

No trades occurred in January, June or December under the frozen confirmation stack.

## Critical reproducibility finding

The earlier April exploratory scan reported +142.7 pips for a selected parameter combination. That number did not reproduce under the fully specified frozen causal implementation above. The exact frozen implementation produced only +10.3 pips in April and -197.4 pips for the year.

The discrepancy shows that the exploratory result depended on implementation or parameter-selection details that were not sufficiently frozen. Therefore +142.7 must not be treated as a verified benchmark.

## Decision

- Reject this exact 3R frozen model.
- Do not optimize only TP or stop size next.
- Preserve the multi-timeframe concept, but redesign the entry event and long/short symmetry before any new annual claim.
- Future tests must publish exact bar timing, next-bar entry, same-bar stop/TP priority and all filters before results are accepted.
