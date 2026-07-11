# GBPJPY 2025-04-03 to 2025-04-09 Bear Expansion Campaign V1

## Status

Rejected. This is a real causal backtest result, not a concept estimate.

## Frozen V1 rules

- H4 close below H4 SMA200 and H4 EMA20.
- H1 close below H1 EMA20.
- M15 requires two consecutive closes below the lower 1-sigma Bollinger band and EMA20.
- M15 close must also break the prior completed 20-bar low.
- Entry occurs at the next available M1 open represented by the completed M15 timestamp.
- Short stop uses the larger of 1.5 x completed M5 ATR14 or prior completed M5 five-bar high plus 5 pips.
- Stop is floored at 25 pips and capped at 80 pips.
- Tactical portion is 70% and exits at 2R or stop.
- Runner portion is 30% and exits on stop or a completed H1 close above EMA20.
- Add-ons require at least 60 minutes from the previous accepted signal and at least 0.5 Core-R of favorable movement.
- Maximum three add-ons per active campaign.
- Conservative same-bar handling: stop is assumed first when stop and target are both touched.
- Fixed round-trip execution cost: 3.0 pips per leg.

## Result

| Metric | Result |
|---|---:|
| Campaigns | 7 |
| Total legs | 11 |
| Core legs | 7 |
| Add-on legs | 4 |
| Weighted gross pips | -461.72 |
| Costs | -33.00 |
| Net pips | **-494.72** |
| Maximum closed-leg drawdown | **-548.68 pips** |

## Important finding

The V1 model correctly found one strong Core trade on 2025-04-04 03:45. That leg produced +131.96 net weighted pips. However, the model repeatedly re-entered after downside extensions and added into poor locations. Ten of eleven legs lost money.

This shows that the main problem is not a lack of bearish direction detection. The failure is caused by campaign segmentation and execution geometry:

1. A stopped Core was immediately treated as permission to create a new campaign while the same higher-timeframe state remained active.
2. Add-ons were triggered by fresh downside breaks rather than pullback-and-rejection structures, causing late entries.
3. Every add-on used an independent full stop, allowing multiple correlated losses inside the same market move.
4. The model did not preserve a single campaign identity across temporary tactical stop-outs.
5. A completed H1 EMA20 exit is too slow for some runners, but the much larger damage came from poor entries and repeated campaign resets.

## Decision

Do not expand V1 to the full month or full year. The result is rejected.

## Required V2 changes

- One persistent campaign per H4 State episode; do not reset solely because all legs stopped.
- Core entry only after initial M15 acceptance followed by a causal M5 pullback/rejection, not every renewed 20-bar-low break.
- Add-ons only after an existing campaign has protected risk and a completed M5 pullback rejects EMA20 or a broken structural level.
- Enforce one total campaign risk budget rather than independent full-risk legs.
- Add a cooldown after stop-outs and prohibit immediate re-entry below an extended M15 band.
- Separate Early Expansion from Middle/Late Expansion to prevent chasing.

The V2 objective is first to make 2025-04-03 through 2025-04-09 positive after costs with materially lower drawdown. No annual extrapolation is allowed until that is achieved.
