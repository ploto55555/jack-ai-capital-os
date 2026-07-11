# GBPJPY 2025 April — Lower-Timeframe Small-Stop + Fixed-TP Scan

## Objective

Test the user's proposed structure:

1. Use H4/H1/M15 only for directional confirmation.
2. Use M5 rejection and M1 micro-break for entry timing.
3. Keep stops small using recent M1 swing highs.
4. Use fixed TP multiples to maximize pip extraction.
5. Deduct 3 pips round-trip cost per trade.

## Causal signal stack

- H4 close below H4 SMA200 and H4 EMA20
- H1 close below H1 EMA20
- M15 close below the lower 1-standard-deviation band
- M5 pullback/rejection setup
- M1 close breaks the prior short micro-swing low
- Entry at the next available M1 open
- Stop above the recent completed M1 swing high plus 1–2 pips
- Only stops inside the tested 6–25 pip range were accepted
- One position at a time with a causal cooldown after exit

## Scan dimensions

- M1 micro-break lookback: 2, 3, 5 bars
- M1 stop swing lookback: 5, 8, 12 bars
- Minimum stop: 6 or 8 pips
- Maximum stop: 15, 20, or 25 pips
- Entry confirmation window: 5, 10, or 15 minutes
- Cooldown after exit: 30, 60, or 120 minutes
- TP structures:
  - full exit at 3R
  - full exit at 5R
  - full exit at 8R
  - 50% at 3R / 50% at 6R
  - 30% at 3R / 30% at 6R / 40% at 10R
  - 30% at 2R / 30% at 5R / 40% at 10R

## Best tested April result

Best candidate:

- M1 micro-break: prior 2 bars
- Stop swing lookback: prior 12 M1 bars
- Stop range: 6–15 pips
- Stop buffer: 1 pip
- Entry confirmation window: 10 minutes
- Cooldown: 60 minutes
- Exit: full position at 3R
- Executed trades: 12
- Net pips: **+142.7**
- Maximum closed-trade drawdown: **-41.9 pips**
- Profit factor: **3.11**

## TP comparison

Best result observed within each TP family:

| TP structure | Best April net pips |
|---|---:|
| Full exit at 3R | **+142.7** |
| Full exit at 8R | +69.6 |
| Full exit at 5R | +55.4 |
| 50% at 3R / 50% at 6R | +30.0 |
| 30% at 3R / 30% at 6R / 40% at 10R | +15.04 |
| 30% at 2R / 30% at 5R / 40% at 10R | +0.52 |

## Interpretation

The proposed lower-timeframe entry idea works better than most prior April experiments:

- Small M1 stops materially improve reward-to-risk geometry.
- The best tested exit was not a long runner ladder; it was a clean full exit at 3R.
- Higher TP multiples reduced realized pips because too many trades reversed before reaching 5R–10R.
- The best result, +142.7 pips, slightly exceeds the prior V2 full-April result of +136.0 pips and does so with a larger sample of 12 trades.

## Important limitation

This was an exploratory parameter scan on April only. The best combination cannot yet be treated as a verified production rule because it was selected from many tested variants. Median parameter results were negative, which indicates strong sensitivity and overfitting risk.

## Decision

- Promote the concept, not the exact parameters.
- Next test should freeze a simple, defensible version:
  - H4/H1/M15 bearish confirmation
  - M5 pullback/rejection
  - M1 break of prior 2-bar low
  - 12-bar M1 swing stop
  - accept only 6–15 pip stops
  - 60-minute cooldown
  - full exit at 3R
  - 3-pip cost
- Run the frozen model on all 2025 months and report month-by-month stability before considering it part of the 5000-pip program.
