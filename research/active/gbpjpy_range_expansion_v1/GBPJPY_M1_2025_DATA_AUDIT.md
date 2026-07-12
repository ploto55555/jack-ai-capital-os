# GBPJPY M1 2025 Data Audit

Status: `[DATA_ACCEPTED_WITH_CLEANING] [PERSONAL_RESEARCH_ONLY]`

## Source

- Archive: `HISTDATA_COM_MT_GBPJPY_M12025.zip`
- Main file: `DAT_MT_GBPJPY_M1_2025.csv`
- Provider status report: `DAT_MT_GBPJPY_M1_2025.txt`
- ZIP SHA-256: `458c7c4a540d63b81f09da4359811fe7bf99c4b72017510dd1f60d433472e933`

## Coverage

- Rows before cleaning: `371,076`
- First timestamp: `2025-01-01 17:05`
- Last timestamp: `2025-12-31 16:57`
- Columns: date, time, open, high, low, close, volume
- Price precision: three decimals
- GBPJPY pip size: `0.01`

## Quality checks

- Invalid timestamps: `0`
- Invalid OHLC relationships: `0`
- Non-positive prices: `0`
- Duplicate timestamps: `60`
- All duplicate rows are exact duplicates, not conflicting prices
- Cleaning rule: sort chronologically and keep one row per timestamp
- Volume is `0` on every row; volume must not be used as a feature

## Gap checks

Sequential gaps observed:

- greater than 1 minute: `538`
- greater than 5 minutes: `145`
- greater than 60 minutes: `55`

Many large gaps are expected weekend or market-maintenance gaps. Smaller intraday gaps remain flagged so entries cannot be generated across missing-data intervals without an explicit continuity check.

## Critical daily-candle issue

Naive calendar-day resampling is rejected.

The file shows seasonal changes around the daily maintenance/open-close area and contains a duplicate-time block around late October. Therefore:

1. previous-day high/low must be generated from a verified FX session boundary;
2. partial weekend and holiday sessions must be excluded from ADR and compression calculations;
3. a small partial session must never be mislabeled as a genuine 50-pip daily compression candle;
4. the daily boundary used for the backtest must be cross-checked against the existing GBPJPY D1/H1 files before the 50-pip rule is judged.

## Use in the project

This file expands precise M1 validation to the full 2025 calendar year. It is suitable for:

- M1 sweep/reclaim confirmation;
- M1 retest entry timing;
- stop-first intrabar sequencing;
- MFE/MAE measurement;
- testing whether M15 confirmation still leaves executable movement;
- checking the 2025 OOS behavior of the Range-to-Expansion rules.

It is not sufficient by itself for:

- long-history robustness;
- development and validation on independent multi-year samples;
- proving the USD 500 to USD 100,000 target;
- live-capital approval.

## Next processing order

1. Deduplicate exact duplicate minutes.
2. Reconcile timestamp/session boundaries with existing D1/H1/M15 data.
3. Remove partial weekend and holiday sessions from daily compression statistics.
4. Build verified PDH, PDL, previous daily range, ADR20 and compression ratio.
5. Aggregate clean M1 to M5/M15 and compare OHLC consistency.
6. Run frozen 2025 M1 validation for:
   - compressed-day breakout only;
   - non-compressed range-edge sweep/reclaim;
   - M15 acceptance followed by M1 retest;
   - range/transition/trend regime risk.

No broker connection, order placement or automatic trading is included.
