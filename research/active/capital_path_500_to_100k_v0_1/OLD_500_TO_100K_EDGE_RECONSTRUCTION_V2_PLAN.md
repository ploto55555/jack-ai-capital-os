# Old 500 to 100k Edge Reconstruction V2

Status: `[ACTIVE_BACKTEST] [TARGET_UNCHANGED]`

This branch runs a causal dual-pair M15 research engine using GBPJPY and XAUUSD.

Hard controls:

- signal data must be complete before entry;
- entry occurs at the next M15 open;
- conservative same-bar stop priority;
- fixed transaction-cost assumptions;
- one open campaign per pair and combined global overlap control;
- development: 2012-2018;
- validation: 2019-2021;
- out-of-sample: 2022 onward;
- all monthly rolling 12-month windows are reported;
- USD 500 to USD 100,000 remains the pass condition.

Tested setup families:

1. Asian-range expansion followed by the first executable retest.
2. Previous-day high/low expansion followed by the first executable retest.
3. H4 directional alignment, with optional D1 confirmation.
4. M15 impulse size, price-action retest and structural invalidation.
5. 6R/7R full targets with early profit protection.

The workflow downloads public historical M15 data, runs the frozen script and saves all grids, selected trades, combined trades, rolling capital results and the final report as a GitHub Actions artifact.

Personal research support only. No broker connection and no order placement.
