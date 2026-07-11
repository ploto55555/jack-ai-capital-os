# GBPJPY 2025 April — Campaign V3 Lifecycle / Entry Filter Scan

## Objective

Test whether resetting Core/Add-on budgets by a new H4 bear-state campaign can recover the 45 raw April signals that V2 ignored, while keeping the V2 entry, protection, cost and exit logic unchanged.

## Lifecycle scan

Variables tested:

- H4 bear-state reset gap: 1h, 4h, 8h, 12h, 24h
- Maximum Core attempts per campaign: 1 or 2
- Maximum Add-ons per campaign: 0, 1 or 2
- Round-trip cost: 3 pips per leg
- Entry logic: unchanged V2 pullback-touch + bearish rejection + anti-chase
- Tactical exit: 2R
- Runner exit: H1 close above H1 EMA20

### Best lifecycle-only result

- Reset gap: 24h
- Maximum Core attempts: 2
- Maximum Add-ons: 1
- Campaigns: 3
- Executed legs: 9
- Net result: **-3.9 pips**
- Maximum closed-trade drawdown: **-142.9 pips**
- Largest winner: +148.0 pips

Other lifecycle settings were worse. Examples:

- 4h reset, 2 Core, 1 Add-on: -39.7 pips, -256.1 pips drawdown
- 4h reset, 2 Core, 2 Add-ons: -61.8 pips, -256.1 pips drawdown
- 8h reset, 1 Core, no Add-on: -57.0 pips, -84.0 pips drawdown

## Entry-quality scan

A second scan kept lifecycle resetting and tested simple causal filters:

- Session windows: all, Asia, London, New York, 00:00–16:00
- M5 bearish-body strength: 0, 0.25, 0.50, 0.75 ATR
- Maximum distance from M15 EMA20: 0.75, 1.00, 1.25, 1.50 ATR

### Best tested filtered result

- Session: New York
- Minimum bearish body: 0.25 ATR
- Maximum distance: 1.50 ATR
- Raw signals: 20
- Executed legs: 8
- Net result: **+29.2 pips**
- Maximum closed-trade drawdown: **-59.0 pips**

Other positive combinations were small and unstable. The strongest all-session candidate produced +26.1 pips with -203.4 pips drawdown. No tested filter approached the April research threshold of +400 net pips.

## Main conclusion

The missing April profit is not solved by simply resetting Campaign IDs. Once later-April signals are allowed, the same V2 pullback/rejection pattern produces many weak re-entries and gives back the April 4 winner.

V2's +136 pips was therefore heavily dependent on one early-April trend leg and on the global two-Core limit suppressing later losing trades.

## Decision

- Reject lifecycle reset alone as V3.
- Do not promote session/body/distance combinations; they are exploratory April-only filters and would be overfit if adopted now.
- Preserve the April 4 winner as evidence that a strong expansion continuation exists.
- Next research should distinguish **Early Expansion** from **Late/Choppy Bear State** before allowing a Core.

## Next hypothesis to test

A new Core should require all of the following causal conditions:

1. H4 bear state has started recently, rather than being an old state.
2. H4/H1 volatility is expanding, not contracting.
3. The first M15 downside acceptance after a compression is used; repeated late acceptances are blocked.
4. Re-entry is permitted only after a meaningful H1 reset/compression, not every brief EMA-state flip.
5. Add-ons remain conditional on protected open profit.

The next model should therefore be an **Expansion Age + Compression Release V4**, not another parameter adjustment to V2.
