# GBPJPY High Trading-Day Coverage Objective

Date: 2026-07-11

## Objective

The GBPJPY research target is not only to find rare perfect setups. The system should maximize the percentage of trading days with at least one valid, causal, cost-adjusted opportunity.

## Important distinction

- Goal: trade on as many days as possible.
- Not allowed: force a trade every day regardless of regime, space, or setup quality.

## Design implication

The system should support multiple regime-specific playbooks:

1. Range-edge opportunity when the range is wide enough and there is sufficient room to the opposite level.
2. Compression breakout when the prior day or multi-day structure is compressed.
3. Trend continuation through the first retest, second compression, or pullback to BB/Fib/20MA/quarter levels.
4. Failed-break reversal only after confirmed acceptance back into the range.

## Risk implication

- Range: small risk.
- Transition: probe risk.
- Trend: larger risk only after acceptance and protection of the first position.
- All entries in the same directional move belong to one Daily Campaign.

## Research metrics

- Trading Day Coverage Rate.
- Daily Opportunity Rate.
- Missed Trend Rate.
- False Break Participation Rate.
- Opportunity Extraction Rate.
- Profit factor and expectancy by regime.
- Rolling 12-month capital outcome.

The system should optimize coverage subject to positive expectancy and controlled drawdown, rather than maximize raw trade count.
