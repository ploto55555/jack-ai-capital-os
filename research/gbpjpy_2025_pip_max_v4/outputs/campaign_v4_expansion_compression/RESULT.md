# GBPJPY 2025 April — Expansion Age + Compression Release V4

## Objective

Test whether an early-expansion filter can isolate the April 4 winner and suppress later weak Bear-State re-entries.

## Causal conditions tested

- H4 close below H4 SMA200 and H4 EMA20
- H1 close below H1 EMA20
- H4 bear-state age limited to recent bars
- A recent H1 Bollinger-width compression based only on prior completed H1 bars
- H1 ATR14 expanding versus three completed H1 bars earlier
- First M15 close below the M15 lower 1-standard-deviation band
- M5 pullback touch followed by bearish rejection
- Anti-chase distance from M15 EMA20
- One Core per compression-release event
- At most one Add-on, only after the Core reached +1R protection
- 3-pip modeled round-trip cost per leg
- 2R tactical exit and H1 EMA20 runner exit

## Tested variants

The exploratory scan varied:

- H1 compression percentile: 20%, 30%, 40%
- Recent compression lookback: 6, 12, 18 H1 bars
- Maximum H4 bear-state age: 2, 4, 6, 10 H4 bars
- Release-to-entry window: 4, 8, 12 hours
- Maximum M15 EMA distance: 1.0 or 1.5 ATR

## Best tested result

The least-negative candidate used:

- Compression percentile: 20%
- Compression lookback: 6 H1 bars
- H4 bear-state age: maximum 2 H4 bars
- Entry window after release: 4 hours
- Maximum distance: 1.0 M15 ATR

Result:

- Compression-release events: 5
- Campaigns: 3
- Executed legs: 3
- Net result: **-93.0 pips**
- Maximum closed-trade drawdown: **-93.0 pips**

Selected comparison results:

| Compression | Lookback | H4 age | Window | Distance | Net pips | Drawdown |
|---:|---:|---:|---:|---:|---:|---:|
| 20% | 6h | 2 bars | 4h | 1.0 ATR | -93.0 | -93.0 |
| 30% | 6h | 4 bars | 4h | 1.5 ATR | -177.3 | -177.3 |
| 40% | 12h | 4 bars | 8h | 1.0 ATR | -205.3 | -205.3 |
| 30% | 12h | 4 bars | 8h | 1.5 ATR | -233.3 | -233.3 |
| 30% | 18h | 6 bars | 12h | 1.5 ATR | -261.3 | -261.3 |
| 30% | 12h | 10 bars | 8h | 1.5 ATR | -327.1 | -327.1 |

## Conclusion

The Expansion Age + Compression Release hypothesis did not improve the April result. The tested causal definitions either removed the profitable April 4 sequence or still admitted losing release events.

This means the current indicator definition of compression and expansion is too generic. Bollinger-width compression plus rising H1 ATR is not enough to identify the specific price structure that produced the strong April 4 continuation.

## Decision

- Reject V4 as currently defined.
- Do not optimize these thresholds further on April; that would become parameter overfitting.
- Preserve V2's +136 pips as the best verified April result so far.

## Next research direction

Stop treating the April opportunity as a generic indicator state. Build a structural event model around:

1. H4 break and close below the 200MA.
2. Size and persistence of the initial displacement leg.
3. First H1/M15 corrective retracement after displacement.
4. Failure of that retracement to reclaim the broken H4 level.
5. Continuation entry only after structural rejection.
6. No repeated Core entries until a new H4 structural break occurs.

The next model should be **H4 Break–Retest–Continuation V5**, using price levels and displacement/retracement geometry rather than another Bollinger/ATR threshold scan.
