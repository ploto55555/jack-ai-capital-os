# GBPJPY 2025 Small-to-Large Timeframe Backtest V5

Date: 2026-07-11

Status: `[2025_IN_SAMPLE_DEVELOPMENT] [PERSONAL_RESEARCH_ONLY]`

## Objective

Test whether using smaller-timeframe entries for small targets and progressively larger-timeframe structures for larger targets can materially increase annual net pips.

The research target remains at least 5,000 net pips in 2025, but no result is accepted merely because it uses more tickets. Every ticket must be causal, cost-adjusted and constrained by stop-loss risk management.

## Architecture tested

- No daily trade-count limit.
- Exact same minute and direction is counted once.
- One unprotected position is allowed per timeframe module.
- A later add-on in the same module is allowed only after the earlier ticket is protected or closed.
- Total unprotected open-risk ceiling: 1.50%.
- Risk per ticket:
  - M1 sweep: 0.15%.
  - M5 retest: 0.25%.
  - M5 trend acceptance: 0.35%.
  - M15 acceptance / retest: 0.50%.
- Cost: 2 pips per completed ticket.
- Same-bar stop/target ambiguity: stop first.

## Selected timeframe ladder

| Module | Entry context | Stop | Target / management |
|---|---|---:|---:|
| M1 Sweep | Range + HTF aligned | 15 pips | 20 pips; breakeven after +10 |
| M5 Retest | Range + HTF aligned | 15 pips | 30 pips |
| M5 Acceptance | Trend + HTF aligned + 40-pip room | 15 pips | 80 pips |
| M15 Acceptance | Transition | 25 pips | 200 pips |
| M15 Retest | Trend + HTF aligned | 25 pips | 120 pips |

This is a timeframe-specific target ladder. Later structures may create separate protected add-on tickets inside the same broader directional campaign.

## Result

- Tickets: 498.
- Trading days: 220 / 260.
- Trading-day coverage: 84.62%.
- Position-summed net pips: +1,470.5.
- Average pips per ticket: +2.95.
- Win rate: 21.49%.
- Profit factor: 1.163.
- Maximum pip drawdown: 795 pips.
- Total result: +68.55R.
- Normalized USD 500 capital result: approximately USD 643.15.
- Positive months: 7 / 12.
- 5,000-pip target achieved: NO.

## Contribution by timeframe module

| Module | Tickets | Net pips | Net R |
|---|---:|---:|---:|
| M1 Sweep | 51 | +75.0 | +5.00R |
| M5 Retest | 24 | +90.0 | +6.00R |
| M5 Acceptance | 50 | +200.0 | +13.33R |
| M15 Acceptance | 331 | +995.5 | +39.82R |
| M15 Retest | 42 | +110.0 | +4.40R |

## Monthly net pips

- January: +325.0.
- February: +25.0.
- March: +175.0.
- April: -420.0.
- May: +635.0.
- June: +355.6.
- July: -37.4.
- August: +253.6.
- September: -425.7.
- October: +646.0.
- November: -25.0.
- December: -36.6.

## Comparison with V3

- Previous timeframe-risk portfolio: +1,069.6 pips.
- New small-to-large timeframe ladder: +1,470.5 pips.
- Improvement: +400.9 pips, or approximately +37.5%.

The user's hypothesis is directionally supported: using distinct small-to-large timeframe opportunities increased captured pips. However, the increase was not sufficient to reach 5,000 pips.

## Dynamic single-trade upgrade test

A separate model was tested in which one small-timeframe position dynamically changed its governing exit from M5 to M15 and then H1. Under the tested causal confirmation and EMA exit rules, the dynamic version was negative. The reason was not lack of market movement; it was that timeframe upgrades occurred late while EMA exits returned too much open profit or removed positions during normal pullbacks.

Therefore, the better result currently comes from separate timeframe tickets with independent stops and targets, rather than forcing every small entry to become one long runner.

## Main conclusion

The small-to-large framework improved 2025 extraction, but the present bottleneck remains M15 direction repetition and large losing clusters. April and September alone lost 845.7 pips. Simply opening more small-timeframe tickets will not reach 5,000 pips safely.

The next research stage should focus on campaign logic:

1. Detect and suppress repeated M15 acceptance signals that belong to the same failed direction.
2. Add only after the prior ticket is protected and a genuinely new M5/M15 structure forms.
3. Separate first-break, failed-break reversal and trend-continuation campaigns.
4. Improve runner exits without using late EMA-only liquidation.
5. Measure ticket-summed pips and unique campaign extraction separately.
