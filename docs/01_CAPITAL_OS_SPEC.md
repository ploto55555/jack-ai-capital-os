# Jack AI Capital OS — Production Specification

## Role

The Capital OS is the production decision-support system. It must only use setups whose status is `[APPROVED]`.

## Production Responsibilities

- store approved setup specifications and versions
- scan supported markets for approved conditions
- produce explainable signal candidates
- calculate entry, stop, target, R multiple, position size, and risk mode
- classify setup quality and confidence
- record signal outcomes and live performance
- compare live performance with backtest expectations
- capture mistakes, invalidations, and regime observations
- feed evidence back into the Research Lab

## Forbidden Production Behavior

- using experimental or unapproved rules
- changing setup rules without a version change and user approval
- hiding uncertainty or rule conflicts
- mixing backtest results from different setup versions
- treating AI suggestions as approved rules
- executing trades automatically in the current version

## Required Setup Statuses

- `[APPROVED]`
- `[LIVE_MONITORING]`
- `[RETIRED]`

Only `[APPROVED]` and explicitly enabled `[LIVE_MONITORING]` versions may produce production signals.

## Signal Traceability

Every signal must be traceable to:

- setup ID and version
- market and timeframe
- timestamp and timezone
- input data version
- regime classification
- rule checks that passed or failed
- risk model version
- generated decision and explanation

## Production Conflict Rule

If two official files disagree about a production rule, signal generation for the affected setup must stop until the conflict is resolved and recorded in the Decision Log.