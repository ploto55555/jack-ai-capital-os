# GBPJPY Narrow Daily Range -> Breakout-Only Rule

Date: 2026-07-11
Status: `[RESEARCH_RULE] [GBPJPY_ONLY]`

## Core idea

When the previous completed daily candle is unusually narrow, especially around 50 pips or less, do not spend risk trading inside that small range. Treat the day as a compression condition and wait for expansion beyond the prior daily high or low.

## Initial classification

Calculate:

- Previous Daily Range (PDR) = PDH - PDL, in pips
- ADR20 = average daily range over the previous 20 completed days
- Compression Ratio = PDR / ADR20

Initial research gate:

- Narrow day if PDR <= 50 pips, or
- Compression Ratio <= 0.45 to 0.55

The final threshold must be selected by causal backtest, not assumed.

## Trading behavior

When Narrow Daily Range = true:

1. Disable ordinary range-fade entries inside the prior-day box.
2. Do not trade the middle of the box.
3. Use PDH and PDL as breakout boundaries.
4. Wait for M15 acceptance outside the box.
5. Use M1 only for retest and execution after acceptance.
6. Do not increase risk on the first spike outside the box.

## Breakout acceptance candidate

A breakout is considered for research only when several of these conditions are present:

- M15 body closes outside PDH or PDL;
- close is at least 3-7 pips, or 0.15-0.30 M15 ATR, beyond the boundary;
- Bollinger Band Width is expanding;
- M15 20MA slope turns in the breakout direction;
- the next M15 candle does not fully close back inside the prior-day range;
- M1 retest holds outside the old box;
- M1 forms continuation structure before entry.

Same-bar ambiguity must use stop-first handling.

## Initial risk mode

- Inside narrow daily range: 0% risk / WAIT
- First breakout probe: 0.25%-0.50% research risk
- Confirmed acceptance: 0.75%-1.00%
- Established trend with protected open profit: total campaign risk up to 1.50%-2.00% for research

Higher 3%/5%/8% risk remains capital-path simulation only until the fixed-risk setup is validated.

## Targets

After confirmed breakout, calculate room to:

- next 00/25/50/75 quarter level;
- H1/H4 support or resistance;
- previous swing high/low;
- Fibonacci confluence;
- daily ADR expansion objective.

No trade if net room after spread/slippage is insufficient.

## Research comparisons

Backtest these variants separately:

1. Fixed 50-pip threshold.
2. PDR <= 0.45 ADR20.
3. PDR <= 0.50 ADR20.
4. PDR <= 0.55 ADR20.
5. Breakout-only versus boundary sweep/reclaim.
6. Direct breakout entry versus M1 retest entry.
7. London versus New York breakout timing.

## Decision principle

A small prior-day candle is not a profitable signal by itself. It is a regime filter indicating compression. The system must wait for causal proof that price is being accepted outside the box before treating the move as trend expansion.
