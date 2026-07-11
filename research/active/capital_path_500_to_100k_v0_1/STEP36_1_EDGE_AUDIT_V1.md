# Step 36.1 Capital Path Edge Audit V1

Date: 2026-07-11  
Project: Jack Personal AI Capital OS — Capital Path $500 to $100k Research  
Status: `[AUDITED] [UNVERIFIED_EDGE] [CONTINUE_RESEARCH]`

Personal research support only. This work does not connect to a broker or place orders.

## Objective

Audit the earlier Step 36.1 workbook that recorded a path from USD 500 to USD 100,000, identify which trades created the result, and determine whether the path can be treated as evidence of a reproducible FX setup.

The target remains unchanged:

- Start: USD 500
- Target: USD 100,000
- Measurement: rolling 12 months
- No lowering of the target

## Source path reconstructed

Window:

- 2025-04-01 to 2026-04-01
- 41 trades
- 27 GBPJPY
- 14 XAUUSD
- Safe / Main / Attack risk: 3% / 5% / 8%

Recorded outcome distribution:

- 17 full-target trades
- 18 locked-profit trades
- 2 end-of-day locked trades
- 4 full-stop trades

Recorded capital result:

- Start equity: USD 500
- First target hit: trade 35, 2026-02-04
- Equity at first hit: about USD 108,516
- Final equity: about USD 348,061
- Recorded maximum drawdown: 12.6%

The arithmetic of the recorded sequence is reproducible.

## Critical execution anomaly

Eight XAUUSD full-target trades are recorded with the same entry and exit timestamp:

| Trade | Date | Pair | Recorded R | Risk |
|---:|---|---|---:|---:|
| 4 | 2025-04-16 | XAUUSD | +6R | 3% |
| 5 | 2025-04-21 | XAUUSD | +6R | 8% |
| 6 | 2025-04-22 | XAUUSD | +6R | 8% |
| 32 | 2026-01-21 | XAUUSD | +6R | 8% |
| 33 | 2026-01-26 | XAUUSD | +6R | 8% |
| 34 | 2026-01-28 | XAUUSD | +6R | 8% |
| 40 | 2026-03-19 | XAUUSD | +6R | 8% |
| 41 | 2026-03-23 | XAUUSD | +6R | 8% |

These eight trades account for 8 of the 17 full-target winners and occur at the most important compounding stages.

A zero-duration result is not automatically impossible because a target may be reached inside the entry bar. However, OHLC data alone cannot establish the intrabar path. The raw lower-timeframe bars must prove:

1. the entry was available before the target move;
2. the stop and target were not both touched ambiguously;
3. stop-first handling was applied where the order is unknown;
4. the timestamp is not produced by an indexing or look-ahead error;
5. spread and slippage were deducted consistently.

Until that verification is complete, these trades cannot be counted as validated setup evidence.

## Stress test

The recorded fixed-fraction sequence was replayed under four treatments.

| Scenario | Final equity | Hit USD 100k? | Max drawdown |
|---|---:|---|---:|
| Recorded workbook | USD 348,061.26 | Yes | 12.60% |
| Remove eight zero-duration TPs | USD 18,964.51 | No | 12.60% |
| Replace them with +0.4286R locks | USD 24,320.96 | No | 12.60% |
| Replace them with -1R stops | USD 10,261.91 | No | 28.24% |

Conclusion from the stress test:

- The path is mathematically correct for the supplied outcome sequence.
- The USD 100k result depends materially on the eight ambiguous XAUUSD outcomes.
- The non-ambiguous subset does not reach the target.
- Therefore Step 36.1 is not yet a validated setup.

## Rolling-window stability

The workbook contains 38 monthly-start Extreme rolling 12-month windows.

- Windows reaching USD 100k: 7
- Windows failing to reach USD 100k: 31
- Hit rate: about 18.4%

This means the old candidate was strongly regime-dependent even before the ambiguous-trade adjustment. It demonstrated that a favourable sequence can create the required capital path, but it did not demonstrate long-term stable achievement across starting dates.

## Comparison with fresh causal reconstruction

The literal written SRDC + Ketty rules were later rebuilt using causal data and produced:

- 195 campaigns
- 46.67% positive
- Profit Factor 0.824
- Net -323.4 pips

The written rules therefore do not reproduce the selected 167-candidate list. A missing selection rule, implementation difference, or outcome leakage remains unresolved.

## Decision

`STEP36_1_OLD_PATH = UNVERIFIED`

Do not reject the USD 500 to USD 100k research objective.

Do reject the assumption that the old workbook has already proven a tradable setup.

The old path remains useful as a forensic target because it shows the required payoff structure:

- many small locked profits;
- few full losses;
- repeated 6R to 7R expansion winners;
- risk concentrated only in high-grade conditions.

## Next research checkpoint

Proceed with `OLD_500_TO_100K_EDGE_RECONSTRUCTION_V2` under these hard rules:

1. Generate signals only from information completed before entry.
2. Use next-bar executable entries or explicit stop-order activation.
3. For every same-bar stop/target conflict, use stop-first.
4. Save MFE, MAE, entry bar, exit bar and exact reason for every campaign.
5. Separate GBPJPY and XAUUSD engines.
6. Freeze development parameters before OOS testing.
7. Report all monthly rolling 12-month starts.
8. Keep USD 500 to USD 100k as the pass requirement.
9. Do not optimize the risk model until the fixed-risk setup has positive causal expectancy.
10. Do not promote a result that relies on unverified zero-duration outcomes.

## Research direction

The next setup family will preserve the professional day-trader structure seen in the old path but rebuild it causally:

- GBPJPY London expansion / first pullback;
- XAUUSD London expansion / first executable retest;
- D1 and H4 direction;
- H1 compression or structural break;
- M15 confirmation;
- small structural invalidation;
- early profit protection;
- 6R-plus target only when genuine room exists.

The next checkpoint must contain actual generated trades and stress-tested results, not a theoretical setup description.
