# GBPJPY Multi-Timeframe Data Audit

Date: 2026-07-10
Status: DATA RECEIVED / AUDIT COMPLETED / BACKTEST NOT STARTED

## Files received

- `GBPJPY_D1.csv`
- `GBPJPY_H4.csv`
- `GBPJPY_H1.csv`
- `GBPJPY_M30.csv`
- `GBPJPY_M15.csv`
- `GBPJPY_M5.csv`
- `GBPJPY_M1.csv`

## Important schema finding

All files declare six headers:

`Time, Open, High, Low, Close, Volume`

However, every data row contains seven fields. The working interpretation is:

`Time, Open, High, Low, Close, TickVolume, SpreadPoints`

The seventh field must not be silently discarded. Before formal backtesting, source metadata should confirm that it is spread measured in broker points.

## Coverage and row counts

| Timeframe | Rows | Start | End | Coverage note |
|---|---:|---|---|---|
| D1 | 5,016 | 2010-06-24 00:00 | 2026-07-08 00:00 | Broad history |
| H4 | 25,851 | 2010-06-24 00:00 | 2026-07-08 08:00 | Broad history |
| H1 | 100,000 | 2010-06-24 14:00 | 2026-07-08 11:00 | Exactly 100k rows; likely export cap |
| M30 | 100,000 | 2018-06-29 02:30 | 2026-07-08 11:30 | Exactly 100k rows; truncated history |
| M15 | 100,000 | 2022-07-04 11:00 | 2026-07-08 11:45 | Exactly 100k rows; truncated history |
| M5 | 100,000 | 2025-03-06 02:05 | 2026-07-08 11:55 | Exactly 100k rows; limited lower-TF history |
| M1 | 100,000 | 2026-04-01 16:27 | 2026-07-08 11:59 | Exactly 100k rows; about three months only |

## Structural validation

Across all seven files:

- malformed rows: 0;
- invalid OHLC relationships: 0;
- duplicate timestamps: 0;
- out-of-order timestamps: 0;
- timestamps misaligned with their declared timeframe: 0.

The larger time gaps are predominantly weekends, holidays, or no-tick periods. Lower-timeframe data contains occasional short gaps, which should be handled explicitly rather than automatically filled with invented prices.

## Cross-timeframe consistency

Aggregating lower-timeframe data and comparing with the supplied higher-timeframe bars produced the following OHLC agreement:

- M1 -> M5: 99.995%; the single mismatch is the first partial five-minute bucket because M1 history starts at 16:27.
- M5 -> M15: 99.997%; the single mismatch is the first partial fifteen-minute bucket because M5 history starts at 02:05.
- M15 -> H1: 100.000%.
- H1 -> H4: 99.996%; the single mismatch is the first partial H4 bucket because H1 history starts at 14:00.
- H4 -> D1: 100.000%.

Conclusion: the files are internally coherent and appear to come from the same price feed and timezone convention.

## Spread field observations

Assuming GBPJPY is quoted to three decimals and the seventh field is broker points:

- median spread is generally around 17-22 points, approximately 1.7-2.2 pips;
- extreme spread values occur and must not be ignored;
- D1 spread values are not suitable as direct transaction-cost assumptions because daily-bar spread snapshots can reflect rollover or illiquid moments;
- M1 or M5 spread data should be preferred for execution-cost modelling.

This interpretation remains `[ASSUMPTION]` until the data source confirms field meaning and point scale.

## Strategy readiness by source family

### SRDC

- Episode I: D1 history is sufficient for an initial long-horizon test.
- Episode III: H1 and M15 provide approximately four years of box-breakout testing from 2022-07-04.
- Episode II: D1/H1 are available, but CCI/channel implementation rules must be fixed before testing.

### Ketty FX

- D1/H4/H1/M15 are sufficient for an initial regime, trend-following, and range-reversal research pass.
- Indicator formulas, candle-close rules, and multi-timeframe execution rules still require formal definition.

### Abu

- D1/H4/H1 context coverage is strong.
- M15 covers about four years.
- M5 covers about sixteen months.
- M1 covers only about three months.
- Therefore, a long-history Abu lower-timeframe entry backtest is not yet possible with the current M1/M5 exports. Shorter pilot testing is possible.

## Unresolved metadata required before formal backtest

- data source/platform and broker;
- server timezone, including daylight-saving behaviour;
- whether OHLC bars are Bid, Ask, Mid, or another convention;
- confirmation that field 6 is tick volume and field 7 is spread points;
- whether the 100,000-row limit came from the export process;
- whether missing no-tick bars should remain absent or be reconstructed for specific calculations.

## Research decision

The data passes initial structural quality checks. It is accepted into the Research Lab as `[DATA_AUDITED]`, but formal strategy backtesting must wait until timezone, quote convention, and execution assumptions are recorded.
