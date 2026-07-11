# GBPJPY 2025 Entry & Extraction Laboratory V1 — Results

Date: 2026-07-11

## Scope

- GBPJPY only; XAUUSD remains frozen.
- 371,016 M1 bars from 2025.
- 790 complete hindsight 60-pip movement segments.
- 260 daily main movement segments.
- Causal candidate events: M1 BOS, sweep/reclaim, M5 acceptance, M15 acceptance, M5 re-compression, first M5 retest, first M15 retest.
- H4/H1 Double BB, M15 regime, Fib, previous-day levels, 200MA and quarter levels used as context.

## Direction-selection result on daily main moves

- First event of any type: 100% coverage, 36.2% correct direction, 1-minute median delay.
- Score >= 5: 98.1% coverage, 51.0% correct direction, 39-minute median delay.
- Score >= 7: 94.2% coverage, 73.1% correct direction, 163-minute median delay.
- First M15 acceptance: 97.3% coverage, 75.5% correct direction, 125-minute median delay, 70.3 pips median remaining when correct.
- Strict HTF + M15 confirmation: 40.0% coverage, 78.8% correct direction, 300-minute median delay, 55.4 pips median remaining when correct.

## Conditional entry geometry

Selecting the first event already known to match the hindsight daily main direction:

- High-quality event found on 250 / 260 days (96.2%).
- Median delay: 130 minutes / 47.6 pips.
- Median remaining movement: 79.75 pips / 61.1% of the segment.
- +20 reached: 95.6%.
- +50 reached: 74.8%.
- Median MAE to segment end: -14.7 pips.

This is an opportunity measurement, not a tradable backtest, because direction is selected with hindsight labels.

## Stop geometry

Before later reaching +20 pips, median adverse movement was 13.5 pips; 75th percentile 21.9 pips; 90th percentile 34.6 pips.

- 8-pip stop survival: 27.6%.
- 12-pip: 45.2%.
- 15-pip: 56.1%.
- 20-pip: 71.5%.
- 25-pip: 79.9%.

Median stop needed before +20:

- Sweep/reclaim: 11.45 pips.
- First M5 retest: 12.70 pips.
- M5 acceptance: 12.90 pips.
- First M15 retest: 14.30 pips.
- M5 re-compression: 15.60 pips.
- M15 acceptance: 15.70 pips.
- M1 BOS: 27.10 pips.

## Conditional exit laboratory

Starting from a same-direction high-quality entry already selected with hindsight:

- M1 trail: average +1.48 pips.
- M5 EMA20: +7.07 pips.
- M15 BB middle: +14.93 pips.
- H1 EMA20: +27.25 pips.
- Adaptive upgrade: +9.36 pips.

This supports the architecture that M1 should execute while M15/H1 governs the hold. It is not live strategy performance.

## Frozen next hypothesis

1. M15 acceptance nominates direction.
2. First M1 sweep/reclaim or first M5 retest executes.
3. Structure-stop research should focus on approximately 12-20 pips rather than a universal 8-pip stop.
4. Position begins as intraday and upgrades only if M15 trend and H1/H4 continuation persist.
5. Allow one controlled re-entry because the first M15 direction was wrong on about one quarter of daily main moves.

## Repository

- Branch: `research/gbpjpy-entry-extraction-2025-v1`
- Report: `research/gbpjpy_entry_extraction_2025_v1/REPORT.md`
- Report commit: `c7a5d361140e8cff5676503403563ca8e29a2857`
