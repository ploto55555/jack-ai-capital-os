# Step 36.1 Capital Hurdle V1

Date: 2026-07-11  
Status: `[RESEARCH_GATE] [TARGET_UNCHANGED]`

Personal research support only. No broker connection and no order placement.

## Purpose

Quantify the exact performance hurdle that a causal replacement for the old Step 36.1 path must clear.

Target remains:

- start equity: USD 500;
- target equity: USD 100,000;
- required multiple: 200x;
- measurement: rolling 12 months.

## Recorded 41-trade path sensitivity

The reconstructed Step 36.1 sequence was replayed with the same R outcomes under different risk treatments.

| Treatment | Final equity | Hit USD 100k? | Max drawdown |
|---|---:|---|---:|
| Recorded 3% / 5% / 8% assignments | USD 348,061.26 | Yes | 12.60% |
| Cap every assigned risk at 5% | USD 66,415.16 | No | 9.75% |
| Cap every assigned risk at 3% | USD 12,322.03 | No | 5.91% |
| Fixed 5% on every trade | USD 80,610.18 | No | 9.75% |
| Fixed 8% on every trade | USD 1,001,655.31 | Yes | 15.36% |

Finding:

- The recorded path did not reach the target when Attack risk was removed.
- The target was achieved only because large outcomes and 8% Attack exposure occurred together.
- Risk amplification cannot replace setup validation; the fixed-risk setup must first produce a causal high-R distribution.

## Pair attribution

Using the original assigned risk percentages but isolating each pair:

| Pair subset | Trades | Sum R | Final equity from USD 500 |
|---|---:|---:|---:|
| GBPJPY only | 27 | +44.6592R | USD 5,210.09 |
| XAUUSD only, recorded | 14 | +71.4286R | USD 33,402.62 |
| XAUUSD after removing eight zero-duration TPs | 6 | +23.4286R | USD 1,819.98 |
| All non-ambiguous trades | 33 | — | USD 18,964.51 |

Finding:

- Neither pair independently reached the target.
- The recorded result depended on combining both pairs and compounding after large XAUUSD outcomes.
- Once the eight ambiguous XAUUSD full targets are removed, the remaining path is far below USD 100,000.

## Required payoff mix

For a simplified 40-trade year with:

- full target: +6R;
- protected trade: +0.45R;
- full loss: -1R;
- full-loss rate: 10%;
- remaining trades split between full targets and protected trades;

The minimum full-target share required to compound 200x is approximately:

| Fixed risk | Required +6R full-target share | Approximate full targets in 40 trades |
|---:|---:|---:|
| 3% | 81.15% | 33 |
| 5% | 48.96% | 20 |
| 8% | 30.55% | 13 |

The old recorded path contained:

- 17 full targets out of 41 trades: 41.46%;
- after removing the eight ambiguous full targets: 9 full targets out of 33 remaining trades: 27.27%.

The non-ambiguous subset therefore falls below the approximate 8%-risk hurdle before accounting for dynamic reductions to 3% and 5%.

## Missing edge required

Starting from the non-ambiguous path final equity of USD 18,964.51, the additional validated +6R winners required to exceed USD 100,000 are approximately:

| Risk on each additional +6R winner | Additional validated winners needed |
|---:|---:|
| 3% | 11 |
| 5% | 7 |
| 8% | 5 |

This becomes the next setup-development requirement:

> Find at least five additional genuinely executable 6R-class Attack campaigns per rolling year, or produce an equivalent improvement through higher frequency, larger validated R capture, or fewer full losses.

## Research gate for V2

A V2 setup is rejected unless its causal backtest demonstrates all of the following:

1. At least 40 independent campaigns per rolling year, or a lower frequency with sufficient verified geometric growth.
2. Full losses near or below 10%-15% of campaigns.
3. At least about 13 genuine +6R-class outcomes per 40 campaigns when using an 8% research stress model.
4. No full target credited from an unresolved same-bar sequence.
5. Positive expectancy under fixed 1% risk before dynamic risk is applied.
6. Spread included and same-bar stop priority.
7. Monthly rolling 12-month reporting, not one selected favourable window.
8. USD 500 to USD 100,000 remains the pass condition.

## Decision

The next research should not spend time tuning small improvements around PF 1.2-1.6.

It must search specifically for a causal setup family capable of producing repeated 6R-class London expansion campaigns while protecting failed expansions quickly.

Primary V2 families:

- GBPJPY London expansion plus first executable pullback;
- XAUUSD London expansion plus first executable retest;
- higher-timeframe directional alignment;
- completed-bar signal generation;
- next-bar entry;
- structural invalidation;
- early lock after momentum confirmation;
- full 6R-plus target only when pre-entry room exists.
