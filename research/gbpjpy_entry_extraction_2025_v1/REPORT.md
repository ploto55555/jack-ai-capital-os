# GBPJPY 2025 Entry & Extraction Laboratory V1

Date: 2026-07-11

Status: `[DESCRIPTIVE_EVENT_STUDY] [NOT_A_TRADING_STRATEGY]`

## Purpose

Study the observation that GBPJPY supplied substantial movement on most 2025 trading days. The research question is no longer whether pips existed, but:

1. How early a causal signal could identify the active direction.
2. How many pips remained after confirmation.
3. How much adverse movement occurred before the move continued.
4. Which governing timeframe retained the most pips.

## Data and labels

- Source: `HISTDATA_COM_MT_GBPJPY_M12025.zip`.
- M1 rows: 371,016.
- Complete hindsight 60-pip ZigZag segments: 790.
- Daily main segments: 260.
- Spread assumption: 2 pips.
- Signals use completed-bar information only.
- Entries occur at the first M1 open at or after signal availability.

The 60-pip segments are hindsight labels used to evaluate signal timing. Results that select the signal matching the known segment direction are conditional opportunity measurements, not tradable backtest results.

## Candidate causal events

- M1 structure break.
- Sweep, reclaim and micro confirmation.
- M5 acceptance.
- M15 acceptance.
- M5 re-compression breakout.
- First retest after M5 acceptance.
- First retest after M15 acceptance.

H4/H1 Double BB state, M15 regime, Fib, prior-day levels, 200MA and quarter-level context contribute to a fixed quality score.

## Direction selection on the 260 daily main moves

| Rule | Coverage | First signal correct | Median delay | Median remaining when correct |
|---|---:|---:|---:|---:|
| First event of any type | 100.0% | 36.2% | 1 min | 89.0 pips |
| First score >= 5 | 98.1% | 51.0% | 39 min | 81.6 pips |
| First score >= 7 | 94.2% | 73.1% | 163 min | 58.3 pips |
| First M15 acceptance | 97.3% | 75.5% | 125 min | 70.3 pips |
| HTF + M15 confirmed | 40.0% | 78.8% | 300 min | 55.4 pips |

### Interpretation

- Very early signals preserve the most pips but select the correct direction poorly.
- Strong confirmation improves direction accuracy but enters later and loses opportunity coverage.
- Among the tested single event families, M15 acceptance gave the best balance: 97.3% availability, 75.5% first-direction accuracy and about 70 pips median remaining when correct.
- Adding strict H4/H1 and M15 agreement improved accuracy only modestly while reducing coverage to 40% and delaying entry to five hours.

## Conditional entry-timing study

This section chooses the first same-direction signal after the hindsight segment begins. It measures entry geometry, not real-time direction selection.

### Daily main moves

- High-quality same-direction entry found: 250 / 260 days (96.2%).
- Median delay from segment start: 130 minutes / 47.6 pips.
- Median net movement remaining: 79.75 pips.
- Median remaining share: 61.1%.
- +20 pips reached after entry: 95.6%.
- +50 pips reached after entry: 74.8%.
- Median MAE to segment end: -14.7 pips.

A+ same-direction entry:

- Found on 224 / 260 days (86.2%).
- Median delay: 228 minutes / 62.7 pips.
- Median net movement remaining: 58.55 pips.
- Median remaining share: 48.1%.

This shows that waiting for maximum confirmation does not automatically improve extraction. It often sacrifices too much of the move.

## Stop geometry before continuation

For high-quality same-direction entries that later reached +20 pips:

- Median adverse movement before +20: 13.5 pips.
- 75th percentile: 21.9 pips.
- 90th percentile: 34.6 pips.

Share surviving the adverse movement before +20:

| Stop | Survival |
|---|---:|
| 8 pips | 27.6% |
| 12 pips | 45.2% |
| 15 pips | 56.1% |
| 20 pips | 71.5% |
| 25 pips | 79.9% |

Median stop required before +20 by entry family:

| Event | Median stop |
|---|---:|
| Sweep + reclaim | 11.45 pips |
| First M5 retest | 12.70 pips |
| M5 acceptance | 12.90 pips |
| First M15 retest | 14.30 pips |
| M5 re-compression | 15.60 pips |
| M15 acceptance | 15.70 pips |
| M1 BOS | 27.10 pips |

The generic M1 BOS entry was the least efficient. Sweep/reclaim and the first M5 retest produced better entry geometry.

## Conditional exit laboratory

These results begin with the first high-quality signal already known to match the hindsight daily main direction. They isolate exit behavior and must not be interpreted as live strategy performance.

| Exit model | Average pips | PF | Median hold | >=50 pips |
|---|---:|---:|---:|---:|
| M1 trail | 1.48 | 1.27 | 27 min | 2.4% |
| M5 EMA20 | 7.07 | 2.35 | 48 min | 6.4% |
| M15 BB middle | 14.93 | 3.53 | 109 min | 14.4% |
| H1 EMA20 | 27.25 | 5.35 | 427 min | 20.0% |
| Adaptive upgrade | 9.36 | 2.77 | 61 min | 9.6% |

The small-timeframe trail captured little of the available movement. H1 management retained the most pips, supporting the principle:

`M1 enters; M15/H1 decides how long to hold.`

However, many trades still exited near breakeven, so the current protection and upgrade logic is not yet efficient.

## Main findings

1. The opportunity supply is not the bottleneck.
2. The earliest available signal is usually too ambiguous.
3. M15 acceptance currently gives the strongest direction/remaining-pips balance.
4. Sweep/reclaim and first M5 retest give the best stop geometry.
5. An 8-pip universal stop is too tight for most broad 2025 entries.
6. Requiring every higher timeframe to align sacrifices too much coverage and enters too late.
7. M1 exits destroy much of the large move; H1 management extracts more.
8. The next system should separate:
   - direction trigger: M15 acceptance;
   - execution trigger: M1 sweep/reclaim or first M5 retest;
   - holding upgrade: M15 then H1;
   - re-entry after the first failed attempt.

## Next frozen research hypothesis

For the next causal strategy test:

1. Use M15 acceptance to nominate the direction.
2. Do not enter immediately.
3. Enter on the first M1 sweep/reclaim or first M5 retest in that direction.
4. Use structure-based stop research centered around 12-20 pips, not one universal 8-pip stop.
5. Begin as an intraday position.
6. Upgrade the runner only when M15 trend persists and H1/H4 conditions support continuation.
7. Allow one controlled re-entry because the first accepted direction was still wrong on roughly one quarter of daily main moves.

No live-capital approval follows from this descriptive study.
