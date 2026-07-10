# MASTER SETUP V0.4 — Combined Source Research

Date: 2026-07-10
Mode: personal research support only
Pair: GBPJPY
Precise execution sample: 2022-07 to 2026-07 (M15 coverage)

## Goal

Combine the previously supplied source families without assuming that every source module should become a mandatory filter:

- Naked price action and Fibonacci/SR pullback;
- Ketty trend / range logic, MA direction, Bollinger expansion and middle-band reclaim;
- Abu compression / new-space / small-stop concepts;
- SRDC previous-day support/resistance and box context;
- structural profit protection and runner management.

## Search method

A controlled Boolean feature library was applied to the existing causal PA-B Fib/SR signal stream. Combinations of up to three filters were tested with 3R, 5R, 8R and 10R fixed targets. The leading entry definitions were then tested with structural runner exits.

The research included spread, one open campaign at a time, 48-hour cooldown, conservative same-bar stop priority and chronological split checks.

## Best provisional setup

ID: `MASTER_S_FIB_SR_KETTY_RUNNER_V0.4`

### Entry

1. H1 breaks a prior 40-bar structure and produces an impulse.
2. The first qualifying pullback arrives within 16 completed H1 bars.
3. Retracement is in the shallow Fibonacci area: approximately 50% to 61.8%.
4. The confirming H1 candle body is at least 0.25 of the reference range.
5. H1 ATR percentile is between 20% and 80%.
6. There is at least 2R structural room.
7. Ketty balanced trend condition passes:
   - price is on the correct side of H1 MA50; and
   - either D1 Bollinger width is expanding or H1 reclaims the Bollinger middle line.
8. Enter at the next M15 open.
9. Stop uses the pre-defined M15 structural swing stop; accepted risk range is 8–80 pips.

### Exit

1. Initial stop remains at the structural invalidation level.
2. At +2R, move the stop to +0.5R.
3. At +5R, activate a trailing stop based on the previous completed six-H1-bar structure.
4. No fixed full take-profit.
5. Maximum research hold: 40 days.

## Result

- Signals before overlap control: 15
- Executed campaigns: 13
- Positive campaigns: 69.23%
- Profit Factor: 11.56
- Expectancy: +3.25R per campaign
- Total: +42.26R
- Net pips: +1,628.84
- Observed maximum drawdown: 3R
- Long / short concentration warning: the sample is dominated by long trades.

### Calendar years

- 2022: +5.32R / +348.9 pips
- 2023: +8.49R / +112.6 pips
- 2024: +13.55R / +763.5 pips
- 2025: +10.97R / +291.3 pips
- 2026 partial: +3.92R / +112.5 pips

## Secondary A setup

ID: `MASTER_A_FIB_SR_BODY_RUNNER_V0.4`

Difference from S:

- Requires shallow Fib 50–61.8 and strong confirmation body;
- does not require the full Ketty balanced filter;
- at +1.5R locks to +0.25R;
- at +5R starts six-H1-bar structural trailing.

Result:

- 21 campaigns
- Positive campaigns: 52.38%
- PF: 4.64
- Expectancy: +1.73R
- Net pips: +1,421.02
- Maximum drawdown: 4R

## Modules that did not qualify as mandatory filters

- Abu recent compression breakout: useful conceptually, but only five S-candidate signals matched the strict 48-hour flag. Sample too small.
- SRDC prior-day breakout: eight S-candidate signals matched. It did not improve the main result enough to justify becoming mandatory.
- MA200 proximity: only two S-candidate signals. Keep as confluence score, not a hard rule.
- SRDC box: too few matching signals.

These modules remain optional score bonuses and separate setup families.

## Old SRDC + Ketty literal reconstruction check

The previously saved high-performance summary could not be reproduced from the literal written rules. A causal reconstruction using:

- yesterday high/low ±2 pips;
- D1 EMA50 direction;
- D1 Bollinger expansion;
- H1 Ketty trend mod;
- London session;
- 15-pip initial stop;
- +15 trigger / +10 lock;
- 120-pip target;
- 2-pip cost;

produced:

- 195 campaigns
- 46.67% positive
- PF 0.824
- -323.4 pips

Therefore the old summary remains an unverified historical reference, not valid evidence for production.

## Formal status

- `[RESEARCH_CANDIDATE]`
- `[PROMISING_SMALL_SAMPLE]`
- `[NOT APPROVED FOR CAPITAL OS]`

The S setup is currently the best combination of campaign win rate and net pips in the fresh reproducible research, but only 13 executed campaigns exist. It must be frozen and independently validated on other pairs or longer precise M15 data before further parameter changes.
