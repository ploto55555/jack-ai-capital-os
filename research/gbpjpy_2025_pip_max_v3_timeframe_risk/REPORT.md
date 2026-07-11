# GBPJPY 2025 Pip Maximization V3 — Timeframe & Stop-Loss Money Management

Status: **2025 in-sample development**

## Corrected execution framework

- No fixed daily trade-count limit.
- No arbitrary daily cooldown.
- Trades occur whenever a new, distinct, causal setup appears and the corresponding timeframe engine is free.
- One active position slot for each engine: MICRO, INTRADAY, MACRO.
- No averaging down.
- Exact duplicate entry minute and direction is counted once.
- Spread/cost: 2 pips per completed trade.
- Same-bar stop/target ambiguity: stop first.

## Stop-loss money management

- MICRO risk: 0.25% of equity per trade.
- INTRADAY risk: 0.50%.
- MACRO risk: 1.00%.
- Maximum total open risk: 1.50%.
- Position size is calculated from stop distance, so wider stops receive smaller size.

## Selected engines

| Engine | Entry structure | Context | Stop | Exit | Trades | Net pips | PF | Max pip DD |
|---|---|---|---|---|---:|---:|---:|---:|
| MICRO | Sweep + first M5 retest | Range / HTF not opposed | STRUCT15 | TP20 | 99 | 120.9 | 1.156 | 134.7 |
| INTRADAY | M15 Acceptance → Sweep | M15 regime required | FIX18 | TP120 | 111 | 618.7 | 1.374 | 312.0 |
| MACRO | First M15 retest | M15 Trend / HTF aligned | FIX30 | TP120 | 39 | 330.0 | 1.379 | 210.0 |

## Combined portfolio result

- Trades: **249**
- Trading days: **163 / 260 (62.7%)**
- Net pips: **1,069.6**
- Profit factor: **1.324**
- Maximum pip drawdown: **295.0**
- Positive months: **8 / 12**
- Normalized USD 500 equity: **USD 500 → USD 661.78 (+32.36%)**
- 5,000-pip target: **NOT YET ACHIEVED**

## Monthly net pips

| Month | Trades | Net pips |
|---|---:|---:|
| 2025-01 | 28 | +313.7 |
| 2025-02 | 26 | +75.9 |
| 2025-03 | 26 | +32.4 |
| 2025-04 | 45 | +66.0 |
| 2025-05 | 21 | +446.9 |
| 2025-06 | 13 | -168.9 |
| 2025-07 | 15 | +65.5 |
| 2025-08 | 14 | +378.8 |
| 2025-09 | 11 | -58.2 |
| 2025-10 | 19 | -10.7 |
| 2025-11 | 15 | -74.8 |
| 2025-12 | 16 | +3.0 |

## Current conclusion

Removing the arbitrary daily limit improved the architecture, but the current three-engine version reaches only 1,069.6 net pips, not 5,000. The remaining bottleneck is not the number of allowed trades. It is the amount extracted per directional campaign and the absence of structured add-ons and re-entries inside large trends.

## Next 2025 iteration

1. Multiple entries inside one directional campaign when each new timeframe structure is confirmed.
2. Add-ons only after the original position is protected; never average down.
3. Re-entry after a stopped setup when M15 acceptance remains valid or a new acceptance forms.
4. Separate M5 scalp, M15 core and H1 runner accounting.
5. Replace fixed large targets with exit logic designed to preserve large winners.
