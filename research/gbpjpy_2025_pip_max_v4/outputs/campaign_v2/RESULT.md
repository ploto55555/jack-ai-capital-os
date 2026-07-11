# GBPJPY 2025-04-03 to 2025-04-09 Bear Expansion Campaign V2

## Status

Research candidate only. Do not promote to the annual production baseline yet.

## Frozen causal rules

- H4 close below H4 SMA200 and EMA20.
- H1 close below H1 EMA20.
- Latest completed M15 close below its lower 1-standard-deviation Bollinger band.
- M5 pullback touches the lower 1-standard-deviation band, followed by a completed bearish rejection bar closing below the prior M5 low.
- Reject entries more than 1.5 M15 ATR below M15 EMA20.
- Entry occurs at the next available M1 open after the completed M5 signal.
- Maximum two Core attempts in the test window.
- Add-ons require the latest Core to have reached +1R and moved to break-even.
- Maximum two add-ons; entries must be at least one hour apart.
- Initial stop is the larger of 1.5 M5 ATR or prior six-bar M5 swing high plus 5 pips, bounded to 25-80 pips.
- At +1R, stop moves to break-even.
- 50% tactical allocation exits at 2R; 50% runner exits when a completed H1 closes above EMA20.
- Three pips round-trip cost is deducted from every leg.

## Verified output

| Metric | Result |
|---|---:|
| Legs | 5 |
| Core legs | 2 |
| Add-on legs | 3 |
| Weighted gross pips | +151.0 |
| Costs | -15.0 |
| Net pips | **+136.0** |
| Maximum closed-trade pips drawdown | **-9.0** |

## Trade attribution

- Four legs reached +1R, moved to break-even, and finished at 0 gross / -3 net after cost.
- The productive leg was the 2025-04-04 03:00 add-on:
  - entry 190.629
  - initial risk 53.2 pips
  - tactical 2R result +106.4 pips
  - runner exit 2025-04-07 09:00 at 188.673 for +195.6 pips
  - 50/50 weighted gross +151.0 pips
  - net after cost +148.0 pips

## Comparison with V1

- V1: -494.72 net pips; 11 legs; maximum closed-trade drawdown -548.68 pips.
- V2: +136.0 net pips; 5 legs; maximum closed-trade drawdown -9.0 pips.
- Improvement versus V1: +630.72 net pips in this window.

## Interpretation

V2 validates the direction of the redesign: pullback rejection, anti-chase control, break-even protection and restricted scaling are materially better than repeated M15 breakdown chasing. However, the result is concentrated in one leg and has only five observations. It is not yet robust enough to adopt or extrapolate to 5,000 annual pips.

## Next required test

V3 should preserve the frozen V2 entry logic and test only one isolated change at a time:

1. Campaign identity and Core/Add-on naming must persist correctly after a break-even Core.
2. Compare break-even activation at 1R versus a structure trail after 1R.
3. Test the same frozen rules on the full April 2025 month before any annual expansion.
4. Report trade count, net pips, closed-trade drawdown and concentration by top trade.
