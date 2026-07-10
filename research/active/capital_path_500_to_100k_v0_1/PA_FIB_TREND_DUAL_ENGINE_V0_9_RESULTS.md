# PA_FIB_TREND_DUAL_ENGINE_V0.9

## Status

- `[RESEARCH_CANDIDATE]`
- `[BEST_CURRENT_MULTI_TRADE_SWING_ENGINE]`
- `[NOT APPROVED FOR LIVE CAPITAL]`

## Research objective

Find a GBPJPY swing engine that simultaneously improves:

1. independent campaign frequency;
2. profitable-campaign rate;
3. net pips;
4. out-of-sample stability;
5. realistic entry, spread, stop and runner execution.

## Data and selection discipline

### Exact M15 execution test

- H1 setup generation;
- M15 entry and trade management;
- data: 2022-07-04 to 2026-07-08;
- development / selection period: 2022-07 to 2024-12;
- untouched OOS report: 2025-01 to 2026-07.

### Longer-history proxy

- H1 setup generation;
- M30 entry and execution proxy;
- data: 2018-06-29 to 2026-07-08;
- used to check whether the same frozen logic survives more history;
- this is a proxy, not a substitute for genuine longer M15 history.

## Controlled search

The test retained the previously frozen price-action families and tested a controlled set of entry modes, structure stops, Ketty MA50/BB/ATR filters, room filters, fixed exits, and partial-plus-runner exits. The final exit pair was selected on 2022-2024 only. The 2025-2026 result was then reported without changing the parameters.

# Frozen candidate rules

## Engine A — Fib/SR first pullback

1. H1 closes beyond the previous 40-H1 structure.
2. Breakout body is at least 0.25 of the recent median H1 range.
3. Use the first pullback within 8 completed H1 bars.
4. Pullback enters Fibonacci 50%-61.8% and the broken support/resistance area.
5. Confirmation body is at least 0.15 of the recent median H1 range.
6. H1 price is on the correct side of MA50.
7. D1 BB is expanding or H1 reclaims the BB middle band.
8. H1 ATR is within its 10%-90% normal regime.
9. Structural room to the nearest opposing HTF level is at least 2R.
10. Enter at the next M15 open after the completed H1 confirmation.
11. Initial stop is beyond the H1 signal structure plus 0.08 H1 ATR.

### Fib exit

- close 50% at +1R;
- after +1R, raise stop to +0.10R;
- keep the remaining 50% as runner;
- from +2.5R, trail behind the previous six completed H1 bars with a 0.05 H1 ATR buffer;
- maximum hold: approximately 40 days.

## Engine B — Trend breakout

1. H1 closes beyond the previous 60-H1 extreme.
2. H1 body is at least 0.30 H1 ATR.
3. Bollinger expansion / breakout condition is present.
4. H1 price is on the correct side of MA50.
5. D1 BB is expanding or H1 reclaims the BB middle band.
6. H1 ATR is within its 10%-90% normal regime.
7. Structural room is at least 2R.
8. Enter at the next M15 open after the completed H1 signal.
9. Initial stop is beyond the prior eight M15 bars plus 0.08 H1 ATR.

### Trend exit

- close 50% at +1R;
- after +1R, raise stop to +0.10R;
- keep the remaining 50% as runner;
- from +3R, trail behind the previous 12 completed H1 bars with a 0.05 H1 ATR buffer;
- maximum hold: approximately 40 days.

## Shared execution controls

- recorded spread included;
- same-bar stop wins before a favorable event;
- one open position at a time;
- same-direction signals within 12 hours are one campaign;
- 24-hour cooldown after a campaign closes;
- repeated entries are not counted as independent compounding events.

# Exact M15 results

## Development: 2022-07 to 2024-12

- campaigns: 90;
- frequency: about 36.0 per year;
- profitable campaigns: 52.22%;
- Profit Factor: 1.2508;
- expectancy: +0.1198R;
- total: +10.786R;
- net pips: +590.92;
- max drawdown: 5.35R.

## OOS: 2025-01 to 2026-07

- campaigns: 48;
- frequency: about 31.6 per year;
- profitable campaigns: 62.50%;
- Profit Factor: 1.3834;
- expectancy: +0.1438R;
- total: +6.901R;
- net pips: +437.61;
- max drawdown: 6.25R.

## Full M15 sample

- campaigns: 138;
- average frequency: about 34 campaigns per year;
- profitable campaigns: 55.80%;
- Profit Factor: 1.2900;
- expectancy: +0.1282R;
- total: +17.687R;
- net pips: +1,028.53;
- max drawdown: 6.25R.

## M15 calendar years

| Year | Campaigns | Win rate | PF | Expectancy | Net pips |
|---|---:|---:|---:|---:|---:|
| 2022 partial | 13 | 69.23% | 1.886 | +0.273R | +245.26 |
| 2023 | 36 | 52.78% | 1.313 | +0.148R | +127.36 |
| 2024 | 41 | 46.34% | 1.087 | +0.047R | +218.30 |
| 2025 | 31 | 54.84% | 1.051 | +0.023R | +117.99 |
| 2026 partial | 17 | 76.47% | 2.547 | +0.364R | +319.62 |

Important: 2024 and 2025 were only marginally positive.

# Longer-history M30 proxy

## 2018-2021 development proxy

- campaigns: 103;
- win rate: 53.40%;
- PF: 1.2330;
- expectancy: +0.1086R;
- net pips: +748.92.

## 2022-2024 validation proxy

- campaigns: 91;
- win rate: 58.24%;
- PF: 1.5610;
- expectancy: +0.2343R;
- net pips: +1,137.40.

## 2025-2026 OOS proxy

- campaigns: 42;
- win rate: 64.29%;
- PF: 1.5767;
- expectancy: +0.2060R;
- net pips: +338.97.

## Full M30 proxy

- campaigns: 236;
- win rate: 57.20%;
- PF: 1.4075;
- expectancy: +0.1744R;
- net pips: +2,225.29;
- max drawdown: 8.21R.

The proxy had negative R years in 2019 and 2020.

# Statistical uncertainty

## Exact M15

- 138 campaigns, 77 positive;
- Wilson 95% win-rate interval: 47.47%-63.81%;
- bootstrap 95% expectancy interval: approximately -0.068R to +0.334R;
- bootstrap probability of positive expectancy: 89.78%;
- randomized-order max-DD median: 9.34R;
- randomized-order max-DD 95th percentile: 15.03R.

The M15 expectancy confidence interval still includes a negative value.

## M30 proxy

- 236 campaigns, 135 positive;
- Wilson 95% win-rate interval: 50.83%-63.35%;
- bootstrap 95% expectancy interval: approximately +0.025R to +0.329R;
- bootstrap probability of positive expectancy: 98.86%.

# Capital-path stress test

Using the exact M15 chronological sequence:

| Risk per campaign | Final equity from $500 | Max drawdown |
|---:|---:|---:|
| 1% | $590.65 | 6.11% |
| 2% | $683.85 | 11.94% |
| 3% | $776.44 | 17.49% |
| 5% | $945.91 | 27.82% |
| 10% | $1,134.11 | 49.48% |

No tested rolling 12-month period reached $100,000. At 10% risk, the best rolling 12-month result was about $1,338.53 and drawdown approached 49.4%.

# Conclusion

This is the best current evidence for combining naked price action, Fibonacci/support-resistance pullback, Ketty MA50 and Bollinger regime logic, trend breakout, and mathematical partial-profit/runner management.

It currently delivers:

- around 30-36 campaigns per year;
- roughly 52%-63% profitable campaigns across development/OOS M15 splits;
- positive pips in both M15 splits;
- controlled observed drawdown;
- positive longer-history M30 proxy.

However, PF is still moderate, the exact M15 confidence interval includes negative expectancy, and the result requires frozen-parameter validation on other symbols or longer GBPJPY M15 history before any production promotion.

## Required next validation

1. Freeze V0.9 parameters.
2. Do not tune them further on GBPJPY 2022-2026.
3. Test the exact rules on USDJPY, GBPUSD, EURUSD and XAUUSD.
4. Obtain longer GBPJPY M15 history from another source/broker.
5. Manually inspect the largest winners and losses for rule fidelity.
6. Only after independent validation, test capital allocation and profit-only add-ons.
