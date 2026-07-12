# GBPJPY 2025 Market Context / Campaign V2 — Run 1

Date: 2026-07-12

## Scope

Full-year 2025 GBPJPY M1 replay using completed bars, next-bar execution, 2-pip cost, stop-first ambiguity handling, and campaign-based same-direction entries.

## Best standalone configuration

- Campaign trigger: M15 Acceptance, quality >= 5.
- H4/H1 direction aligned.
- Execution: Sweep + Reclaim, quality >= 5.
- Minimum 120 minutes between new entries in the same campaign.
- Maximum 3 entries per campaign: Core + up to 2 Add-ons.
- Stop: 25 pips.
- After +50 pips MFE, lock +2 pips.
- Exit: M15 EMA20 trail.

## Result

- Standalone net pips: +489.4.
- Trades: 39.
- Profit factor: 1.824.
- Maximum closed-equity pip drawdown: 108.0 pips.

Monthly standalone pips:

- February: +151.8
- March: -11.5
- April: +11.0
- May: +167.4
- July: -54.0
- August: +61.0
- October: +38.2
- November: +125.4

## Decision

`DIAGNOSTIC_NOT_ACCEPTED`

The run improved on State Campaign V1 (+195.1 pips), but it did not reach the 3,000-pip objective and remains too selective.

The +489.4 pips cannot be added directly to V3 +1,069.6 because some trades may overlap and capture the same move. A reconciled portfolio replay is required before reporting a combined total.

## Main bottleneck

The current engine still gives Core, Add-ons and Runner the same exit logic. The next iteration must:

1. Keep same-direction campaign state alive across repeated M15 acceptances.
2. Add First M5 Retest and M5 Re-compression only after Core protection.
3. Split exits by role: Core M15, Add-on M15/H1, Runner H1/H4.
4. Reconcile exact overlap with V3 and portfolio risk.
5. Report contribution by campaign role and state.

No 3,000-pip claim is supported by this run.
