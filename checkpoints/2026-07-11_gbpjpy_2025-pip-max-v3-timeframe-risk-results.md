# GBPJPY 2025 Pip Maximization V3 — Timeframe Risk Results

Date: 2026-07-11

## Corrected rule

- No fixed daily trade-count limit.
- Frequency is determined by distinct timeframe-qualified setups and open-risk capacity.
- One active slot for MICRO, INTRADAY and MACRO.
- No averaging down.
- Position size is determined by stop distance.
- MICRO risk 0.25%, INTRADAY 0.50%, MACRO 1.00%; total open risk cap 1.50%.

## Result

- Trades: 249.
- Trading days: 163 / 260 (62.7%).
- Net pips: 1,069.6.
- PF: 1.324.
- Maximum pip drawdown: 295.0.
- Positive months: 8 / 12.
- Normalized USD 500 equity: USD 661.78.
- 5,000-pip objective: not achieved.

## Engine contribution

- MICRO: +120.9 pips, 99 trades, PF 1.156.
- INTRADAY: +618.7 pips, 111 trades, PF 1.374.
- MACRO: +330.0 pips, 39 trades, PF 1.379.

## Decision

The daily-count limit was not the principal bottleneck. The next version must increase extraction per directional campaign through protected add-ons, legitimate re-entry and improved runner exits, while keeping the no-daily-limit rule.

## Repository

- Branch: `research/gbpjpy-2025-pip-max-v3-timeframe-risk`
- Report commit: `541e28204c3cb4568943332c71bab4fe61159146`
