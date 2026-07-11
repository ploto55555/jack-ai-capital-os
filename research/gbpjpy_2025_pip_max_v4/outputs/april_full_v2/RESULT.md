# GBPJPY 2025 April Full-Month Test — Campaign V2 Frozen Rules

## Result

- Window: 2025-04-01 through 2025-04-30
- Raw qualifying entry signals: 50
- Executed legs: 5
- Core legs: 2
- Add-on legs: 3
- Weighted gross pips: +151.0
- Costs: -15.0 pips
- Net pips: **+136.0**
- Win rate: 20.0%
- Profit factor: 12.33
- Expectancy: +27.2 pips per executed leg
- Maximum closed-trade drawdown: -9.0 pips

## Attribution

- Core net contribution: -6.0 pips
- Add-on net contribution: +142.0 pips
- Tactical half contribution: +53.2 gross pips
- Runner half contribution: +97.8 gross pips
- Total costs: -15.0 pips

## Concentration

One Add-on produced +148.0 net pips. The other four legs each lost only the 3-pip modeled round-trip cost after reaching protection and exiting at breakeven. Therefore essentially all April profit came from one position.

## Important limitation discovered

The rules were intentionally frozen exactly as V2. V2 permits at most two Core attempts for the entire test window. Extending the window from April 3–9 to the whole month therefore did not create later April campaigns. The engine found 50 raw qualifying signals during April but executed only five legs, all entered on April 3–4.

This means +136.0 is a valid full-window execution of the frozen V2 code, but it is not a satisfactory full-month campaign architecture. It under-trades the remainder of April because campaign identity and Core-attempt limits are global rather than reset by a new H4 state/campaign.

## Decision

- Do not promote V2 directly to annual validation.
- Preserve the entry quality evidence.
- Build V3 with explicit H4 campaign start/end logic and a per-campaign risk/attempt reset.
- Keep pullback rejection, anti-chase, protection-before-add and cost assumptions unchanged so the effect of campaign lifecycle can be isolated.
