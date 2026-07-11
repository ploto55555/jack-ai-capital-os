# GBPJPY Range-to-Expansion V1 — Results

Date: 2026-07-11

## Execution status

- Workflow run `29143017156` completed successfully.
- Artifact: `gbpjpy-range-expansion-v1-results` (`8245784756`).
- Scope: causal M15 backtest only; M1 precision entry not yet tested.
- GBPJPY only. XAUUSD remains frozen.

## Compression evidence

- Previous-day absolute range <= 50 pips: 38 observations; median next-day range 73 pips; median expansion beyond the prior range 34.8 pips.
- Previous-day range <= 50% of ADR20: 136 observations; median next-day range 121.5 pips; median expansion 52.05 pips.
- The relative ADR20 compression condition was materially more informative than the fixed 50-pip threshold.

## Selected breakout candidate

- Compression: previous-day range <= 60 pips OR <= 60% ADR20.
- 4-pip breakout buffer, 0.4 ATR candle body, H1+H4 direction, retest entry.
- 8R target; lock after +1.5R to +0.5R; 64 M15-bar maximum hold.
- DEV: 25 trades, PF 2.767, expectancy +0.948R.
- VAL: 10 trades, PF 5.333, expectancy +1.453R.
- ALL: 35 trades, PF 3.280, expectancy +1.092R.
- Important limitation: no breakout trades in OOS because the downloaded data only produced breakout trades through 2021-12-29; this candidate is not accepted as validated.

## Selected range candidate

- Non-compressed days; sweep/reclaim at range edge; 2R target.
- ALL: 245 trades, PF 0.878, expectancy -0.054R, total -13.26R.
- Decision: reject this V1 range-attacking rule.

## Combined result

- ALL: 280 trades, PF 1.199, expectancy +0.089R, total +24.97R.
- Range losses diluted the breakout edge.
- 101 rolling 12-month windows: zero USD 500 to USD 100,000 hits.
- Best combined 12-month final balance: USD 2,729 at 20% risk, with 97.395% worst drawdown.
- Regime-risk model median final: USD 517.59; best USD 600.63; worst drawdown 4.543%.

## Decision

`NOT_YET_AT_500_TO_100K_TARGET`

Key research conclusion:

1. Do not use the tested V1 range sweep/reclaim rule.
2. Relative compression versus ADR20 is more useful than a fixed 50-pip threshold alone.
3. Breakout-after-compression is promising but too infrequent and lacks valid OOS evidence.
4. Next stage must extend recent data, isolate breakout-only performance, improve event frequency without adding noise, and only then add M1 precision entry.
