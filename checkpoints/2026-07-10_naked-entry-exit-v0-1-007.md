# Checkpoint — Naked Entry / Exit V0.1

Date: 2026-07-10

## User direction

- Keep two research lines: Swing Trade first, Day Trade later.
- Preserve the historical Regime V8/V9 opportunity engine.
- Main unresolved work is entry and exit.
- Prefer naked price action: Fibonacci, support / resistance, market structure, breakout / retest, and price-action confirmation.
- Target remains USD 500 to USD 100,000 in a rolling 12-month stress test.

## Work completed

A first objective naked-price-action reconstruction was tested on GBPJPY using H4 context, H1 signals, and M15 execution.

Entry families:

1. first breakout retest;
2. Fibonacci plus support / resistance reclaim;
3. liquidity sweep and reclaim.

Exit research included profit locks, partial exits, and H1 structural runner trails.

## Result

All generic reconstructions were negative across validation and out-of-sample periods.

Least-bad fixed-target entry:

- Fibonacci + S/R reclaim;
- 195 campaigns;
- about 48.75 campaigns/year;
- PF 0.8487;
- expectancy -0.1179R;
- total -23R.

Best runner exit:

- first breakout retest;
- lock +0.5R after +0.75R;
- 25% partial at +2R;
- H1 12-bar trail after +2R;
- 101 campaigns;
- PF 0.6849;
- expectancy -0.1716R.

## Decision

`[REJECTED AS GENERIC RECONSTRUCTION]`

Naked price action is not rejected, but generic Fib/SR/sweep definitions are rejected. Exit optimization cannot repair a negative entry edge.

## Critical finding

The old V8 trade summary was positive for red and blue pullback families, while the new generic reconstruction was negative. Therefore the old advantage depended on exact Regime V8/V9 state, scoring, timing, session rules, and/or repeated-entry treatment—not Fibonacci alone.

## Exact next action

Recover the original V8/V9 raw trade output or generator in the active chat, then:

1. assign a campaign ID to each distinct market move;
2. merge repeated same-direction entries;
3. retain the original opportunity/regime timestamps;
4. compare first signal, best pullback, Fib/SR reclaim, and M15/H1 confirmation;
5. test runner exits only after the entry stream is fixed.

Detailed report:

`research/active/capital_path_500_to_100k_v0_1/REGIME_V9_NAKED_ENTRY_EXIT_V0_1_RESULTS.md`
