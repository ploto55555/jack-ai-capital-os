# GBPJPY 2025 April — H4 Break–Retest–Continuation V5

## Objective

Replace generic Bollinger/ATR state filters with a structural event model:

1. H4 closes below H4 SMA200.
2. Price creates an initial downside displacement.
3. H1 retests toward the broken H4 200MA level without a clean reclaim.
4. M5 prints a bearish rejection after the retest.
5. Entry occurs causally after the completed M5 rejection.
6. Tactical half exits at 2R; runner half exits on H1 close above H1 EMA20.
7. 3 pips round-trip cost is deducted per leg.

## Structural scan

Exploratory variants tested:

- Minimum displacement: 0.50, 0.75, 1.00, 1.25 H4 ATR
- Retest proximity to the broken H4 level: 0.10, 0.25, 0.50 H4 ATR
- Maximum retracement of the displacement leg: 0.50, 0.75, 1.00
- Retest search window: 12 H1 bars
- Entry search window after retest: 4 hours

## Best tested result

The best candidate used:

- Minimum displacement: 0.75 H4 ATR
- Retest proximity: 0.25 H4 ATR
- Maximum retracement: 1.00 of the displacement leg

Result:

- Structural events traded: 3
- Net pips: **+21.92**

Trade attribution:

| H4 break | Net pips |
|---|---:|
| 2025-04-03 12:00 | +126.35 |
| 2025-04-29 12:00 | -46.66 |
| 2025-04-30 12:00 | -57.77 |

The April 3 structural break was correctly isolated and produced the only strong winner. Late-April repeated H4 200MA crosses created losing structural events and reduced the month to +21.92 pips.

## Comparison

- V2 frozen full-April: +136.0 pips
- V5 best structural scan: +21.92 pips

V5 improved interpretability but not profitability.

## Key finding

A simple H4 200MA cross is not equivalent to a new macro structural break. The late-April crosses occurred around a flatter 200MA and within repeated reclaim/failure behavior. They should not be treated the same as the April 3 decisive break.

## Decision

- Reject V5 as a complete monthly model.
- Preserve the structural event representation.
- Do not optimize more thresholds on April alone.

## Next model

Build **H4 Break Quality V6**. The event score should use only completed-bar information and distinguish decisive breaks from noisy recrosses using:

1. H4 SMA200 slope and separation.
2. Break-bar body and close location.
3. Number of recent SMA200 recrosses.
4. Distance travelled below the broken level before retest.
5. Whether the broken level was previously respected for several H4 bars.
6. One trade only for the first high-quality break; repeated recrosses blocked until a long neutral reset.

The next goal is not more entries. It is to preserve the April 3 winner while causally excluding the April 28–30 recross cluster.
