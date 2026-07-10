# Ketty FX Source Batch 01

Date: 2026-07-10
Status: SOURCE REVIEW COMPLETE

## Author identity correction

- `ケッティー` is the author's / instructor's name.
- Romanized working name: `Ketty`.
- This source family must be called the `Ketty FX material` or `Ketty FX framework`.
- It must not be described only as a generic Japanese FX system.
- This batch remains separate from the Abu corpus and SRDC corpus.

## Sources received

1. `【20150121】みんなのFX1月セミナー（最終版）.pdf`
2. `shiwakeshiryo.pdf`
3. `gyakubari.pdf`
4. `jyunbari2.pdf`
5. `429 Chart2.JPG`
6. `143.jpg`
7. `ffff.JPG`
8. `fttt.JPG`
9. `tgg.JPG`

## Source family classification

The Ketty FX material focuses on:

- market regime classification: trend / range / unclear;
- trend-following entries;
- range mean-reversion entries;
- moving-average and Bollinger Band context;
- multi-timeframe support/resistance;
- breakout and reversal confirmation sequences;
- general risk, leverage, market-session, and Dow-theory education.

## File summaries

### General seminar

`【20150121】みんなのFX1月セミナー（最終版）.pdf`

A broad introductory seminar rather than a single executable strategy. Topics include stock/yen relationships, MACD, Bollinger Bands, Ichimoku, leverage, margin, position sizing, order-book supply/demand, market sessions, Dow theory, and stop-loss psychology. It contains dated market examples and should be treated as background education, not as a formal strategy specification.

### Regime classification

`shiwakeshiryo.pdf`

Defines three practical market states:

- Uptrend: higher highs/lows, candles above the Bollinger middle line, cloud below price, rising MA with slope.
- Downtrend: lower highs/lows, candles below the middle line, cloud above price, falling MA with slope.
- Range: highs/lows oscillate inside a fixed band, MA is flat or wavy.

Source parameters shown include Bollinger Bands around SMA20, Ichimoku cloud, and SMA14. Trend termination is described as a full candle-body cross to the opposite side of the MA or middle line. Range termination is described as a full candle-body breakout beyond the defined breakout level.

### Mean-reversion module

`gyakubari.pdf`

Focuses on countertrend entries only in a suitable range environment. Main logic:

- identify a broad range using higher-timeframe support/resistance;
- wait for price near a range edge and around the outer Bollinger Band;
- detect short-term trend exhaustion or failure to make a new high/low;
- enter near the reversal point;
- stop beyond the nearby local extreme;
- take profit at the MA/BB middle line, opposite Bollinger Band, or opposite range edge.

The source mentions a large range as roughly 100 pips or more, but this is a source example and not a validated universal threshold.

### Trend-following module

`jyunbari2.pdf`

Defines trend continuation using MA slope, Bollinger expansion, price position relative to the MA/middle line, and Ichimoku cloud position. Two entry families are shown:

1. Pullback/retracement entry near ±1σ, MA, or BB middle line, preferably with support/resistance confluence.
2. Breakout entry through a recent high/low when pullback entry was missed.

Timing methods include a small trendline break and a touch-and-go reaction from MA/middle line or candle-direction change. The file also defines an unclear regime and recommends no trade when neither trend nor range is well defined. It warns against entries immediately around major economic releases.

### Granville image

`143.jpg`

Visual summary of Granville-style moving-average rules: four buy concepts and four sell concepts, covering MA cross, pullback/retest, continuation without crossing, and extreme deviation/mean-reversion. This is conceptual context, not yet a complete strategy because MA period, timeframe, confirmation, stop, and exit are unspecified.

### Intraday support/resistance map

`429 Chart2.JPG`

EURUSD intraday chart using multiple horizontal levels, including pivot-style levels and many numbered bounce/break examples. Green arrows indicate bullish reactions, red arrows bearish reactions, and yellow marks ambiguous/caution areas. The image is useful as a support/resistance reaction map, but the numbered legend and exact rules are missing.

### Multi-timeframe scenario diagrams

`ffff.JPG`, `fttt.JPG`, `tgg.JPG`

These images appear to teach multi-timeframe support/resistance, trendline break, range compression, and staged confirmation. Common structure:

- higher-timeframe support/resistance defines the outer decision area;
- H1/H4 define direction and major return zones;
- M15 defines the local box or trigger;
- scenarios A/B/C represent alternative paths such as failed breakout, retest, reversal, or continuation.

The diagrams are valuable for building a scenario engine, but they do not include enough textual legend to convert every A/B/C label into a formal rule without interpretation.

## Current research interpretation

The Ketty FX material can be decomposed into five independent modules:

1. `REGIME_CLASSIFIER`: trend / range / unclear.
2. `TREND_PULLBACK`: trend-following on retracement.
3. `TREND_BREAKOUT`: recent high/low continuation.
4. `RANGE_MEAN_REVERSION`: range-edge reversal.
5. `MTF_SR_SCENARIO`: higher-timeframe level plus lower-timeframe trigger.

These modules must remain separate during research. They should not be merged into Abu or SRDC until each is independently defined and tested.

## Missing information before formal strategy definition

- Original explanations or legends for `429 Chart2.JPG`, `ffff.JPG`, `fttt.JPG`, and `tgg.JPG`.
- Exact timeframe and pair assumptions for the Ketty material.
- Whether source indicator settings are fixed or illustrative.
- Exact candle-close, wick-touch, and intrabar execution rules.
- Stop, target, and re-entry rules for the image-only examples.

## Status tags

- Source corpus for this batch: `[RECEIVED]`
- Author identity: `[CONFIRMED: Ketty / ケッティー]`
- Source review: `[COMPLETED]`
- Strategy definition: `[NOT STARTED]`
- Backtest readiness: `[NOT READY]`
