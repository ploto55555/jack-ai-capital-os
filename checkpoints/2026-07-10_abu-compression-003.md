# Checkpoint — Abu Compression V0.1

Date: 2026-07-10
Checkpoint ID: ABU-003

## Completed

- Converted Abu compression / new-space / small-stop ideas into explicit testable rules.
- Ran 1,728 first-stage combinations.
- Ran 2,304 second-stage execution and risk combinations.
- Included recorded spread.
- Enforced one open position at a time.
- Used pessimistic same-bar handling.
- Split M15 evidence into IS, validation, and OOS periods.
- Ran calendar-year, fixed-fraction, and rolling 12-month tests.
- Revalidated the selected rule on M5 for the available 2025-2026 period.
- Calculated confidence intervals, bootstrap expectancy uncertainty, and randomized-sequence drawdown estimates.

## Selected Research Candidate

`ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`

Locked research rules:

- previous 6 H4 bars form the compression;
- compression range no more than 3.0 H4 ATR14;
- H4 ATR14 no greater than H4 ATR50;
- breakout closes beyond the previous 30-H4-bar extreme;
- breakout body at least 0.3 H4 ATR14;
- no D1 filter;
- enter at next M15 open after completed H4 breakout;
- stop at the H4 breakout candle open;
- reject stops below 3 pips or above 30 pips;
- target 5R;
- maximum hold 384 M15 bars;
- one position at a time;
- spread included.

## Evidence

Full M15 sample:

- 34 trades;
- 9 wins and 25 losses;
- win rate 26.47%;
- Profit Factor 1.80;
- expectancy +0.5882R;
- total +20R;
- observed max drawdown 7R.

Split results:

- IS: 8 trades, +4R, +0.5000R expectancy.
- 2024 validation: 11 trades, +7R, +0.6364R expectancy.
- 2025-2026 OOS: 15 trades, +9R, +0.6000R expectancy.

M5 validation from 2025-03-06:

- 14 trades;
- +10R;
- Profit Factor 2.00;
- exactly matched M15 results over the same dates.

## Important Limitation

The selected sample contains only 34 trades after 4,032 combinations were examined. The bootstrap 95% expectancy interval includes a negative value. The candidate is promising but not proven.

## Capital Path Result

No tested fixed-fraction path or rolling 12-month window reached USD 100,000 from USD 500.

At 10% risk per trade:

- full available sample ended near USD 1,379.92;
- max drawdown was about 52.17%;
- best rolling 12 months ended near USD 1,494.68;
- worst rolling 12 months ended near USD 239.15.

## Formal Status

- `[RESEARCH_CANDIDATE]`
- `[PROMISING_BUT_SMALL_SAMPLE]`
- `[NOT APPROVED FOR CAPITAL OS]`

## Next Action

Do not continue micro-optimizing this same GBPJPY M15 sample. Lock the selected rule and seek independent evidence using longer history, other pairs, a long-history H1 proxy, or walk-forward validation. Also manually inspect all 34 selected chart examples against the Abu source examples.
