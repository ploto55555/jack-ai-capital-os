# Checkpoint — PA Fib / Trend Dual Engine V0.9

## Date

2026-07-10

## Active research version

`PA_FIB_TREND_DUAL_ENGINE_V0.9`

## Decision

Freeze the current GBPJPY V0.9 rules. Do not continue optimizing them on the same 2022-2026 M15 sample.

## Engine A

Fib/SR first shallow pullback:

- H1 40-bar breakout;
- first pullback within 8 H1 bars;
- Fib 50%-61.8% plus broken support/resistance;
- MA50 direction;
- D1 BB expansion or H1 BB middle-band reclaim;
- ATR 10%-90% regime;
- structural room >= 2R;
- next M15 open entry;
- H1 structural stop plus 0.08 H1 ATR;
- 50% at +1R;
- lock stop to +0.10R after +1R;
- H1 six-bar structural trail from +2.5R.

## Engine B

Trend breakout:

- H1 60-bar breakout;
- body >= 0.30 H1 ATR;
- BB breakout/expansion condition;
- MA50 direction;
- D1 BB expansion or H1 BB middle-band reclaim;
- ATR 10%-90% regime;
- structural room >= 2R;
- next M15 open entry;
- M15 eight-bar structural stop plus 0.08 H1 ATR;
- 50% at +1R;
- lock stop to +0.10R after +1R;
- H1 12-bar trail from +3R.

## Exact M15 result

Development 2022-2024:

- 90 campaigns;
- 52.22% profitable;
- PF 1.2508;
- expectancy +0.1198R;
- +590.92 pips.

OOS 2025-2026:

- 48 campaigns;
- 62.50% profitable;
- PF 1.3834;
- expectancy +0.1438R;
- +437.61 pips.

Full M15:

- 138 campaigns;
- 55.80% profitable;
- PF 1.2900;
- expectancy +0.1282R;
- +1,028.53 pips;
- observed max DD 6.25R.

## Longer M30 proxy

- 236 campaigns;
- 57.20% profitable;
- PF 1.4075;
- expectancy +0.1744R;
- +2,225.29 pips;
- max DD 8.21R.

## Warnings

- 2024 and 2025 M15 performance was only marginally positive.
- M30 proxy had negative R years in 2019 and 2020.
- M15 bootstrap 95% expectancy interval includes a negative value.
- No rolling 12-month period reached USD 100,000 from USD 500.
- Not approved for live capital or Capital OS production.

## Next action

Independent frozen-parameter validation on USDJPY, GBPUSD, EURUSD, XAUUSD, and/or longer GBPJPY M15 history. No further GBPJPY 2022-2026 tuning before that validation.
