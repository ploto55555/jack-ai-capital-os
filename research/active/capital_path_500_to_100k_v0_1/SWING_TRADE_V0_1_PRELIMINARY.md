# Swing Trade Research V0.1 — Preliminary

Date: 2026-07-10
Status: `[RESEARCH_CANDIDATE]` / `[NOT APPROVED FOR PRODUCTION]`

## Research structure

The project now has two separate trading research tracks:

1. Swing Trade — primary current research track.
2. Day Trade — secondary track, to be researched after the swing framework is stable.

The stretch capital-path target remains USD 500 to USD 100,000 within a rolling 12-month window. This target must not be forced by increasing risk or selecting an overfit historical result.

## Swing design objective

The swing setup should:

- trade infrequently, approximately 5–20 trades per year per pair;
- prioritize high-quality entries rather than daily activity;
- use higher-timeframe direction and compression/new-space context;
- lock profit after a defined favorable move;
- then trail the stop so large trends can continue;
- maximize captured pips and R from rare large runners;
- remain positive across in-sample, validation, and out-of-sample periods;
- be evaluated by rolling 12-month performance and positive-year consistency, not only total historical return.

## V0.1 first-pass search

Data:

- GBPJPY D1, H4, H1
- 2010-06-24 to 2026-07-08
- supplied spread points included
- no swap/overnight financing model yet

Search:

- 48 signal configurations
- 1,728 signal-plus-exit configurations
- D1 strong-trend filter
- H4 compression and new-space breakout
- H1 retest entry
- structural stop
- profit-lock and trailing-stop combinations
- one open position at a time
- conservative stop handling

## Current pips-oriented candidate

Candidate label:

`SWING_GBPJPY_COMPRESSION_RETEST_RUNNER_V0.1`

Rules:

1. D1 strong directional bias:
   - long: close above EMA20 above EMA50, with positive normalized EMA20 slope;
   - short: inverse.
2. Prior 12 completed H4 bars form a compression region.
3. Compression range is no more than 4.0 times H4 ATR14.
4. H4 closes beyond the previous 30-H4-bar high or low, creating an objective new-space breakout.
5. Breakout candle body is at least 0.2 H4 ATR.
6. Wait up to 48 H1 bars for the first directional retest/reclaim of the breakout level.
7. Enter at the next H1 open after the retest confirmation.
8. Initial stop is beyond the previous 12-H1-bar swing plus a small ATR buffer.
9. When price reaches +1R, move stop to +0.25R from entry, effective from the next bar.
10. After profit is locked, trail using a 4.0-H4-ATR chandelier stop.
11. Maximum hold is 960 H1 bars, approximately 40 days.
12. One open position at a time.

## Preliminary results

Full sample:

- 163 trades
- approximately 10 trades per year
- profitable trade rate: 52.15%
- Profit Factor: 1.4080
- expectancy: +0.1929R per trade
- total: +31.44R
- total pips: +1,320.55
- average pips: +8.10 per trade
- median result: +0.25R
- maximum observed drawdown: 10.37R

Runner behavior:

- maximum winner: +14.08R
- maximum winner: +1,073.93 pips
- 15 trades reached at least +2R
- 9 trades reached at least +3R
- 7 trades reached at least +5R
- 2 trades reached at least +10R
- median holding time: 38 hours
- average holding time: 79.6 hours
- maximum observed holding time: 919 hours

Out-of-sample, 2023 onward:

- 39 trades
- profitable trade rate: 58.97%
- Profit Factor: 1.2667
- expectancy: +0.1097R
- total pips: +523.46

## Important weakness

This is not yet a production setup.

Calendar-year consistency is weak: large runners create most of the total profit, while several individual years remain negative. The rolling 12-month median result is close to flat at low and moderate fixed risk. No tested rolling 12-month window reached USD 100,000 from USD 500.

Fixed-risk full-history examples:

- 1% risk: final USD 662.69, max drawdown 9.97%
- 2% risk: final USD 827.63, max drawdown 19.17%
- 5% risk: final USD 1,203.07, max drawdown 42.49%
- 10% risk: final USD 1,055.21, max drawdown 69.18%

Increasing risk did not create a reliable 200x path and materially increased drawdown.

## V0.2 next research requirements

1. Separate breakout-body strength from retest tolerance; V0.1 uses a simplified shared parameter.
2. Add explicit H4 trend alignment and trend-strength thresholds.
3. Add weekly/D1 market-space and major-resistance filters.
4. Require the first clean retest only; reject repeated or deep failed retests.
5. Compare +1R lock to +0.25R/+0.5R and H4 swing versus 3.5–5.0 ATR trailing.
6. Rank candidates by:
   - positive calendar-year ratio;
   - rolling 12-month positive ratio;
   - out-of-sample pips;
   - Profit Factor and expectancy;
   - maximum drawdown;
   - parameter-neighborhood stability.
7. Hold GBPJPY parameters fixed and validate on other liquid FX pairs before promotion.
8. Add swap/overnight financing and gap stress tests before any live-use decision.

## Capital-path interpretation

A single GBPJPY swing setup producing roughly 10 trades per year is unlikely by itself to create a reliable USD 500 to USD 100,000 annual path. The long-term research path may require a portfolio of independently validated swing setups across several pairs, followed later by a separate day-trade engine. Correlated exposure must be controlled, and the target must not be pursued by forcing excessive per-trade risk.
