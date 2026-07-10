# Abu Source Corpus — Complete

Date: 2026-07-10
Status: `[CONFIRMED]`

The user confirmed that the following six files are the complete available Abu source corpus for this project:

1. 外汇交易进阶.pdf
2. abu (1).doc
3. 正反馈循环博弈与策略下.doc
4. 正反馈循环趋势与区域反转突破交易实例.doc
5. 正反馈循环usdjpy客观微小止损交易实例.doc
6. 趋势线的知识 (1).doc

## Research Rule

Do not wait for additional Abu documents. Future work must reconstruct the strategy from this corpus only.

## Interpretation Rule

The corpus contains a mixture of theory, forum Q&A, examples, execution notes, and subjective language. Every extracted rule must be tagged as one of:

- `[DIRECT_SOURCE_RULE]`
- `[EXAMPLE_ONLY]`
- `[SUBJECTIVE_LANGUAGE]`
- `[INFERRED_RULE]`
- `[UNRESOLVED]`

No inferred or unresolved rule may enter backtesting or production logic without explicit review.

## Next Stage

Create `Strategy Definition V0.1` by separating:

- market-state rules
- timeframe hierarchy
- setup families
- entry triggers
- objective stop logic
- target and hold logic
- add-on logic
- exit logic
- month/regime behavior
- subjective terms requiring operational definitions

After V0.1, the next required inputs are market data, prior backtest outputs, and labeled trade examples—not additional Abu documents.
