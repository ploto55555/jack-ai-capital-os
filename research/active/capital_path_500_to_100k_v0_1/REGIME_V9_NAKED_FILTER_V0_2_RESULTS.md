# Regime V9 Naked Entry Filter V0.2 Results

Date: 2026-07-10

## Purpose

Test whether objective filters can improve the previously weak PA-B Fibonacci + support/resistance reclaim entry without changing the underlying signal family.

## Base Entry Held Constant

- Family: PA-B Fibonacci + S/R reclaim
- H4 bias: aligned or neutral
- Entry: next M15 open after completed H1 reclaim signal
- Stop: previous 8 M15 swing structure plus buffer
- Spread: included
- Cooldown: 48 hours
- One open position at a time
- Initial comparison target: fixed 3R

Base result:

- 195 trades
- about 49 trades per year over supplied M15 coverage
- win rate 22.05%
- Profit Factor 0.8487
- expectancy -0.1179R
- total -23R

## Filters Tested

1. H4 strict direction alignment
2. D1 direction alignment or neutral
3. first retracement within 12, 16, 20, or 24 H1 bars after breakout
4. H1 ATR percentile filter
5. distance to nearest completed H4/D1 opposing swing, measured in initial risk units
6. confirmation candle strength
7. breakout impulse strength
8. shallow versus deep Fibonacci retracement
9. initial stop-distance range
10. controlled combinations of the above

## Main Finding

The most promising controlled combination was:

- first Fibonacci/SR reclaim within 16 H1 bars after breakout;
- H1 ATR14 percentile between 20% and 80% of the rolling 240-H1-bar distribution;
- at least 2R of open space to the nearest completed H4 or D1 opposing swing level.

This produced:

- 51 trades
- about 12.75 trades per year
- win rate 35.29%
- Profit Factor 1.6364 at 3R
- expectancy +0.4118R
- total +21R
- observed max drawdown 4R

Split results at 3R:

- 2022-2023 IS: 19 trades, +0.2632R expectancy
- 2024 validation: 12 trades, +0.3333R expectancy
- 2025-2026 OOS: 20 trades, +0.6000R expectancy

## Target Robustness Check

Using the same filtered entries:

| Fixed Target | Trades | Win Rate | Profit Factor | Expectancy | Total R | Total Pips | Max DD |
|---|---:|---:|---:|---:|---:|---:|---:|
| 2R | 51 | 41.18% | 1.4000 | +0.2353R | +12R | +592.72 | 4R |
| 3R | 51 | 35.29% | 1.6364 | +0.4118R | +21R | +960.33 | 4R |
| 5R | 51 | 31.37% | 2.2857 | +0.8824R | +45R | +1,799.71 | 4R |
| 8R | 50 | 24.00% | 2.5124 | +1.1494R | +57.47R | +2,751.29 | 7R |
| 10R | 49 | 22.45% | 2.5868 | +1.2305R | +60.30R | +2,822.05 | 7R |

The result supports the user's idea that correct location and open space may matter more than adding more indicators, and that a valid swing entry may need room for large winners rather than a small fixed target.

## Frequency Trade-off

Filters clearly improved quality but reduced frequency:

- base PA-B: about 49 trades/year, negative expectancy;
- first 16 H1 bars only: about 33 trades/year, near-flat expectancy;
- first 16 bars + normal volatility: about 24 trades/year, small positive expectancy but IS slightly negative;
- first 16 bars + normal volatility + minimum 2R space: about 12.75 trades/year, strongest result.

Therefore this filtered entry is an A+ candidate, not a complete 40-trade annual system by itself.

## Important Limitations

- The supplied M15 history begins in 2022, so the sample contains only four years.
- Filter thresholds were explored on the same broad history; the split results are encouraging but not a fully independent test.
- The exact prior Regime V8/V9 signal engine and original trade files are still required for true campaign reconstruction.
- Session, news, rollover, swap, and gap filters were not applied.
- No claim is made that this can turn USD 500 into USD 100,000 in one year.
- No rolling 12-month test of this filtered candidate reached USD 100,000 from USD 500.

## Formal Status

- `[RESEARCH_CANDIDATE]`
- `[FILTERS_IMPROVED_ENTRY_QUALITY]`
- `[PROMISING_BUT_NOT_INDEPENDENTLY_VALIDATED]`
- `[NOT APPROVED FOR CAPITAL OS]`

## Next Action

1. Lock these three filters temporarily; do not micro-optimize them further on the same sample.
2. Reconstruct exact Regime V8/V9 campaigns from the original trade files.
3. Apply the locked filters to those exact campaigns.
4. Validate on another pair or longer M15 history.
5. Only after entry validation, test structure-based profit locking and runner exits.
