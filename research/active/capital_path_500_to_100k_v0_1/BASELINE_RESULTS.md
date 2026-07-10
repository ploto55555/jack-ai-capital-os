# Capital Path Research — $500 to $100,000 in 12 Months

Date: 2026-07-10
Status: `[BASELINE COMPLETED]` / `[NOT VALIDATED]`

## Research objective

Test whether any rule-based GBPJPY strategy can produce a repeatable path from $500 to $100,000 inside a rolling 12-month period.

This is a 200x target. The required net compound growth is approximately:

- 55.5079% per month;
- 10.7263% per week;
- 2.1248% per trading day across 252 trading days.

The target is treated as a research scenario, not an expected or guaranteed outcome.

## Data used

- GBPJPY D1: 5,016 bars, 2010-06-24 to 2026-07-08.
- GBPJPY M15: 100,000 bars, 2022-07-04 to 2026-07-08.
- Prices treated provisionally as Bid OHLC.
- Seventh CSV value treated provisionally as spread points.
- GBPJPY pip size: 0.01.
- GBPJPY point size: 0.001.

## Execution assumptions

- Spread is included from the seventh CSV value.
- Same-bar TP/SL ambiguity is resolved conservatively as SL first.
- A day with both breakout directions triggered inside one unresolved bar is excluded.
- Open trades are closed at the defined end-of-day or time exit.
- SRDC III was tested with server GMT offsets +2 and +3 because exact broker server timezone is not confirmed.
- No broker execution, slippage model, commission, swap, margin call, or minimum-lot constraint is included yet.

## Baseline 1 — SRDC Episode I

Definition tested: previous-day high/low breakout.

Parameter grid:

- 3 entry modes: immediate, next-open, close-confirm;
- 3 breakout buffers: 0, 1, 2 pips;
- 5 targets: 5, 10, 20, 40, 80 pips;
- 6 stops: 10, 20, 30, 40, 50, 80 pips.

Total combinations: 270.

Best result in this first grid:

- entry mode: immediate;
- buffer: 0 pips;
- target: 80 pips;
- stop: 80 pips;
- trades: 995;
- win rate: 49.246%;
- total: -1,249.4 pips;
- average: -1.2557 pips per trade;
- average expectancy: -0.01570R per trade;
- profit factor: 0.9568.

Conclusion: every tested SRDC I baseline variation had negative expectancy after spread. SRDC I by itself is rejected as a candidate for the $500-to-$100,000 path at this stage.

Status: `[REJECTED AS STANDALONE BASELINE]`

## Baseline 2 — SRDC Episode III

Definition tested: 00:00–08:00 GMT box breakout, executed on M15.

Focused first-pass grid:

- server GMT offsets: +2 and +3;
- entry modes: immediate, next-open, full-M15-candle confirmation;
- targets: 20, 40, 80 pips;
- fixed stops: 20, 50, 80 pips.

Best result in this first grid:

- server GMT offset: +3;
- entry mode: full M15 candle outside box, entry next open;
- target: 80 pips;
- stop: 50 pips;
- trades: 734;
- win rate: 47.139%;
- total: +305.2 pips;
- average: +0.4158 pips per trade;
- average expectancy: +0.008316R per trade;
- profit factor: 1.0238;
- TP exits: 87;
- SL exits: 196;
- timed exits: 451.

Interpretation: this is only a near-flat result. The edge is too small to survive reasonable uncertainty about timezone, spread, slippage, or parameter selection.

Status: `[WATCHLIST ONLY]` / `[NOT PROMOTABLE]`

## Capital compounding test on the best SRDC III baseline

Full available M15 sample:

| Risk per trade | Final equity | Max drawdown | Target hit |
|---:|---:|---:|:---:|
| 0.5% | $512.01 | 8.69% | No |
| 1% | $517.24 | 17.27% | No |
| 2% | $506.96 | 33.66% | No |
| 3% | $470.95 | 48.42% | No |
| 5% | $346.51 | 71.56% | No |
| 10% | $64.11 | 96.24% | No |

Rolling 12-month evaluation:

- 37 monthly-start rolling one-year windows were tested.
- No window reached $100,000 at risk levels from 1% through 40% per trade.
- At 10% risk, the best one-year final equity was approximately $1,960.96.
- At 10% risk, 3 of 37 windows fell below $100 and the worst maximum drawdown was approximately 88.56%.
- Increasing risk further reduced survival instead of creating a repeatable target path.

Conclusion: leverage and position sizing cannot rescue a strategy whose edge is near zero. The research must first find a stronger and stable setup.

## Existing M1 v1 engine decision

The existing `scalping_m1_backtest_v1.py` is retained as an early prototype, but it is not accepted as formal validation evidence because it currently:

- defaults to $500 and 5% risk;
- does not model the uploaded spread column;
- does not model slippage, commission, swap, margin, or minimum lot;
- evaluates many candidate rows with overlapping future windows;
- can count multiple overlapping setups during the same market movement;
- updates its risk base only when a daily pip target is reached;
- uses only the available M1 history, which currently covers about three months.

A new research engine must prevent overlapping trades, record assumptions explicitly, support rolling 12-month tests, and separate setup expectancy from the capital-risk overlay.

## Next research sequence

1. Build an objective Ketty regime classifier: trend / range / unclear.
2. Retest SRDC breakouts only inside the matching regime and direction.
3. Define an objective Abu compression-breakout prototype using D1/H4/H1 context and M15 execution.
4. Compare all strategies by yearly expectancy, profit factor, maximum drawdown, parameter stability, and rolling 12-month target probability.
5. Only after a stable positive edge exists, test Attack / Normal / Defense risk modes.

## Current conclusion

No tested baseline currently supports a repeatable $500-to-$100,000 path in one year. The first useful discovery is that simple daily breakout and London-box breakout rules are insufficient alone. The next phase must focus on market-regime filtering and higher-quality setup selection rather than higher risk.