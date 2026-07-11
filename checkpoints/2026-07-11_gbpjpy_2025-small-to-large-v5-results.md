# GBPJPY 2025 Small-to-Large V5 Results

Date: 2026-07-11

## Result

- No daily trade-count limit.
- One unprotected position per timeframe module.
- Later add-ons allowed only after the previous ticket is protected or closed.
- Total unprotected risk cap: 1.50%.
- 2-pip cost; stop-first same-bar handling.

Selected timeframe ladder:

- M1 sweep: 15-pip stop, 20-pip target, breakeven after +10.
- M5 retest: 15-pip stop, 30-pip target.
- M5 acceptance: 15-pip stop, 80-pip target.
- M15 acceptance: 25-pip stop, 200-pip target.
- M15 retest: 25-pip stop, 120-pip target.

Combined 2025 result:

- 498 tickets.
- 220 / 260 trading days (84.62%).
- +1,470.5 position-summed net pips.
- PF 1.163.
- +68.55R.
- Maximum pip drawdown 795 pips.
- Positive months 7 / 12.
- USD 500 normalized final capital approximately USD 643.15.
- 5,000-pip target not reached.

Compared with V3 (+1,069.6 pips), V5 improved by +400.9 pips (+37.5%). This supports the small-to-large timeframe hypothesis, but the current implementation remains far below the 5,000-pip target.

A separate single-position dynamic M5 -> M15 -> H1 upgrade model was negative under the tested causal EMA exit rules. The better current result comes from separate timeframe tickets with their own stop and target, not from forcing every small entry to become one runner.

Major bottleneck: repeated M15 direction signals and losing clusters. April and September combined lost 845.7 pips.

## Repository

- Branch: `research/gbpjpy-2025-small-to-large-v5`
- Report: `research/gbpjpy_2025_small_to_large_v5/REPORT.md`
- Report commit: `eba30e20cc0f86f27ab5683704d20b56d81d1df9`
