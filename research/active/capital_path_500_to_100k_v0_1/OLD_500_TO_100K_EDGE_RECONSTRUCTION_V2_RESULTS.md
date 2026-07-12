# OLD 500 TO 100K EDGE RECONSTRUCTION V2 — RESULTS

Date: 2026-07-11  
Status: `[CAUSAL_BACKTEST] [REJECTED] [CONTINUE_RESEARCH]`

Personal research support only. No broker connection and no order placement.

## Target

- Starting capital: USD 500
- Target capital: USD 100,000
- Measurement: every monthly-start rolling 12-month window
- Target unchanged

## Execution controls

- GBPJPY and XAUUSD M15 historical data;
- completed-bar setup information only;
- next-M15-open entries;
- conservative stop-first same-bar handling;
- transaction costs included;
- H4 and D1 context formed only after the higher-timeframe candle became available;
- development 2012-2018;
- validation 2019-2021;
- out-of-sample 2022 partial;
- global overlap control for the combined portfolio.

## Selected GBPJPY candidate

Setup:

- previous-day high/low expansion;
- session 08:00-11:00 in source-data time;
- H4 and D1 directional alignment;
- impulse body at least 0.60 M15 ATR;
- first qualifying retest within eight M15 bars;
- target 6R;
- at +1R, protect to +0.5R on the following bar;
- maximum hold 64 M15 bars.

Results:

| Split | Trades | Trades/year | Positive | Full 6R TP | PF | Expectancy | Sum R |
|---|---:|---:|---:|---:|---:|---:|---:|
| Development | 32 | 5.95 | 65.62% | 12.50% | 2.700 | +0.642R | +20.53R |
| Validation | 14 | 5.38 | 71.43% | 0.00% | 1.153 | +0.048R | +0.67R |
| OOS partial | 3 | 12.00 | 100.00% | 0.00% | infinite | +1.163R | +3.49R |
| Full | 49 | 5.48 | 69.39% | 8.16% | 2.501 | +0.504R | +24.69R |

Decision:

- The entry has positive full-sample expectancy.
- Validation expectancy is almost flat.
- Frequency is far below the required capital-path hurdle.
- Full-target capture is too low.

## Selected XAUUSD candidate

Setup:

- Asian-range expansion;
- session 08:00-11:00 in source-data time;
- H4 and D1 directional alignment;
- impulse body at least 0.60 M15 ATR;
- first qualifying retest within four M15 bars;
- target 6R;
- at +1R, protect to +0.5R on the following bar;
- maximum hold 64 M15 bars.

Results:

| Split | Trades | Trades/year | Positive | Full 6R TP | PF | Expectancy | Sum R |
|---|---:|---:|---:|---:|---:|---:|---:|
| Development | 31 | 5.06 | 41.94% | 6.45% | 1.140 | +0.091R | +2.82R |
| Validation | 21 | 7.60 | 61.90% | 4.76% | 1.795 | +0.324R | +6.79R |
| OOS partial | 2 | 8.00 | 50.00% | 0.00% | 0.290 | -0.429R | -0.86R |
| Full | 54 | 5.82 | 50.00% | 5.56% | 1.292 | +0.162R | +8.75R |

Decision:

- Development and validation were positive.
- OOS partial was negative, although the sample was only two trades.
- Frequency and full-target rate are insufficient.

## Combined portfolio

| Split | Campaigns | Campaigns/year | Positive | Full 6R TP | PF | Expectancy | Sum R | Max DD |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Development | 63 | 10.28 | 53.97% | 9.52% | 1.724 | +0.371R | +23.34R | 7.86R |
| Validation | 35 | 12.67 | 65.71% | 2.86% | 1.578 | +0.213R | +7.46R | 5.99R |
| OOS partial | 4 | 16.00 | 75.00% | 0.00% | 2.872 | +0.565R | +2.26R | 1.21R |
| Full | 102 | 11.00 | 58.82% | 6.86% | 1.713 | +0.324R | +33.07R | 7.86R |

## Rolling 12-month capital results

One hundred monthly-start rolling windows were tested.

| Risk model | Target hits | Median final equity | Best final equity | Worst DD |
|---|---:|---:|---:|---:|
| Adaptive 3% / 5% / 8% | 0 / 100 | USD 556.51 | USD 1,295.59 | 27.05% |
| Fixed 1% | 0 / 100 | USD 515.35 | USD 588.33 | 5.89% |
| Fixed 3% | 0 / 100 | USD 541.71 | USD 795.99 | 16.84% |
| Fixed 5% | 0 / 100 | USD 562.42 | USD 1,048.76 | 26.77% |
| Fixed 8% | 0 / 100 | USD 583.37 | USD 1,521.99 | 39.91% |
| Fixed 10% | 0 / 100 | USD 590.94 | USD 1,905.97 | 47.68% |
| Fixed 15% | 0 / 100 | USD 614.37 | USD 3,129.44 | 63.79% |
| Fixed 20% | 0 / 100 | USD 590.33 | USD 4,754.68 | 75.78% |

## Decision

`REJECTED_FOR_500_TO_100K_TARGET`

V2 improved causal reliability compared with the old Step 36.1 selected-outcome workbook, but it did not reproduce the required capital growth.

The precise failure is:

1. combined frequency was only about 11 campaigns per year;
2. only 6.86% of campaigns reached the full 6R target;
3. the old capital-path hurdle requires roughly 40 campaigns and around thirteen genuine 6R-class winners under the 8% stress model;
4. raising risk did not solve the missing setup edge and instead produced extreme drawdown.

## Next action — V3

V3 must not continue tightening the same retest filter.

It will test higher-frequency executable day-trade families:

- direct London/European-session opening-range breakout;
- previous-day high/low direct expansion;
- Asian-range liquidity sweep and reclaim;
- pre-session compression breakout;
- fixed 17-pip GBPJPY and 35-pip XAUUSD invalidation variants alongside structural stops;
- 4R, 5R, 6R and 7R targets;
- early protection after momentum confirmation;
- two-stage selection so development frequency and validation expectancy are both mandatory.

The USD 500 to USD 100,000 rolling-12-month target remains unchanged.
