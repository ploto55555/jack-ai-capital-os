# GBPJPY Range-to-Expansion V1 — Backtest Started

Date: 2026-07-11

## Research priority

- GBPJPY only.
- XAUUSD remains frozen until GBPJPY reaches the research target.
- Hard target remains USD 500 to USD 100,000 in rolling 12 months.

## Core hypothesis

1. Previous completed daily candle <= approximately 50 pips, or materially below ADR20, means compression.
2. On compressed days, do not attack the internal range; use Breakout Only.
3. On non-compressed days, allow conservative range-edge sweep/reclaim research.
4. Range risk is small; accepted trend risk may be larger only after causal confirmation.
5. H4/H1 provide direction; M15 confirms regime and acceptance; M1 precision entry is a later validation layer.

## V1 tests

- previous-day range thresholds: 40 / 50 / 60 pips;
- ADR20 ratios: 40% / 50% / 60%;
- M15 Bollinger expansion and 20MA slope;
- H1 and H4 directional filters;
- accepted break versus accepted-break retest;
- range-edge sweep/reclaim only on non-compressed days;
- 00 / 25 / 50 / 75 distance logging;
- spread included;
- next-bar entries;
- stop-first same-bar handling;
- one open campaign at a time;
- fixed and regime-based rolling capital paths.

## GitHub execution

- Branch: `research/gbpjpy-range-expansion-v1`
- Pull request: `#2 Research: GBPJPY Range-to-Expansion V1`
- Script: `scripts/research/gbpjpy_range_to_expansion_v1.py`
- Workflow: `.github/workflows/gbpjpy-range-expansion-v1.yml`
- Workflow run: `29143017156`
- Status at checkpoint: running

## Important limitation

V1 uses long-history M15 data as the execution proxy. It does not claim that the proposed M1 entry timing has been validated. M1 will be added only after the compression/regime hypothesis is measured and frozen.
