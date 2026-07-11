# Jack AI Capital OS — Project Memory Master

## Purpose
This file is the first continuity document for every new Chat. It summarizes the user rules, repositories, system architecture, active research objective, completed evidence, rejected paths, and current next step.

## User Working Rules
- Reply in Chinese unless the user explicitly asks for another language.
- The user is a technical beginner; explain execution steps plainly.
- Do not modify GitHub, code, deployment, or production files unless the user explicitly says `执行`.
- Personal research support only. No automatic order execution in the current phase.
- Do not mix unrelated businesses or projects unless the user asks to combine them.
- Backtest results must be labeled honestly: proxy reconstruction, research candidate, rejected, or approved.
- Do not present conceptual analysis as if it were a completed backtest.
- Never claim that USD 500 to USD 100,000 has been validated unless the exact causal trade stream, costs, campaign deduplication, and rolling 12-month capital path all pass.

## Canonical Repositories
- Documentation: `ploto55555/jack-ai-capital-os`, branch `main`
- Code: `ploto55555/jack-quantdinger-lab`, branch `jack-personal-os-v1`
- Local Windows folder: `C:\Users\sneak\jack-capital-os-source`
- GitHub is the continuity source of truth.
- Never commit API keys, broker credentials, account passwords, or private tokens.

## System Architecture
### Jack AI Capital OS
Production decision-support layer. Only explicitly approved setup versions may enter this layer.

### Jack Strategy Research Lab
Research layer for reconstruction, causal backtesting, robustness tests, rejection, scoring, campaign analysis, and promotion review.

### Main Modules
- Market Data
- Abu Setup Engine
- Capital Mathematics
- AI Analyst
- AI Risk Checker
- Trade Journal
- Learning / Snowball Engine
- Capital Path Tracker

The first version is not an auto-trading system. AI researches, calculates, reviews, warns, and records; the user decides execution.

## Core Capital Objective
- Starting capital: USD 500
- Research target: USD 100,000
- Window: rolling 12 months
- This is an extreme stress target, not a promise.
- Every test must include spread/cost assumptions, causal signals, realistic stops, independent Campaigns, and drawdown.

## Current Research Priority
1. Swing Trade first
2. Day Trade later

The user wants Swing trades that can capture large market waves, with many winners at least 50 pips and major winners reaching several hundred pips. Stop placement must be based on:
- objective structure invalidation;
- Fibonacci and support/resistance location;
- Price Action confirmation;
- available target space;
- reward relative to actual structural risk.

Do not create a tight stop merely to manufacture a high R multiple.

## Preferred Trading Language
- Weekly / Daily / H4 market structure
- Support and Resistance
- Fibonacci 38.2 / 50 / 61.8 / 78.6
- Breakout and first retest
- Sweep and reclaim at major levels
- Price Action confirmation
- Structural Stop with volatility/cost buffer
- Profit protection followed by Runner management
- MA50, MA200 and Bollinger Bands are supporting evidence only when tests show value

## Available GBPJPY Data
Audited MT5 exports:
- D1: 2010-06-24 to 2026-07-08
- H4: 2010-06-24 to 2026-07-08
- H1: 2010-06-24 to 2026-07-08
- M30: 2018-06-29 to 2026-07-08
- M15: 2022-07-04 to 2026-07-08
- M5: 2025-03-06 to 2026-07-08
- M1: 2026-04-01 to 2026-07-08

True CSV schema:
`Time, Open, High, Low, Close, TickVolume, SpreadPoints`

No malformed rows, duplicate timestamps, OHLC violations, or time reversals were found in the audited files.

## Historical V8 / V9 Evidence
Important files referenced in File Library or prior uploads:
- `regime_v9_4_100k_trade_by_trade_all_models.csv`
- `regime_v8_fib_sr_best_trades.csv`
- `regime_v8_1_no_green_best_trades.csv`
- `regime_v8_fib_sr_setup_summary.csv`
- `old chat full.html`

V8 summary:
- red pullback Fib/SR: 251 trades, +768.0 pips, 45.82% win rate
- blue pullback Fib/SR: 98 trades, +162.9 pips, 36.73% win rate
- green range sweep/SR: 25 trades, -26.6 pips, 44.00% win rate

V9.4 contains many repeated same-direction entries during the same market move. These must be merged into independent Trade Campaigns before capital compounding is accepted.

The exact V8/V9 signal-generator code has not been recovered in the canonical code repository. Therefore, proxy reconstructions must never be called exact V9 backtests.

## Major Research Results
### SRDC Episode I
Previous-day high/low breakout standalone test: rejected.
- 995 trades
- PF 0.9568
- expectancy -0.0157R

### SRDC Episode III
London box standalone: weak watchlist only.
- 734 trades
- PF 1.0238
- expectancy +0.0083R

### Ketty Candidate
`KETTY_GBPJPY_TREND_BREAKOUT_V0.1`
- 1,246 trades
- PF 1.1385
- expectancy +0.1089R
- OOS PF 1.0677
- research only

### Abu Candidate
`ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`
- 34 trades
- PF 1.80
- expectancy +0.5882R
- +20R
- promising but too small after 4,032 combinations

### Generic Naked Entry Reconstruction
`REGIME_V9_NAKED_ENTRY_EXIT_V0.1`
Formal status: rejected as generic proxy reconstruction.
- PA-A first retest: PF 0.8462, -0.120R/trade
- PA-B Fib/SR: PF 0.8487, -0.1179R/trade
- PA-C sweep/reclaim: PF 0.6902, -0.2696R/trade
- Exit optimization could not repair the negative entry edge

### MASTER Setup V0.4
A highly filtered combined setup produced strong-looking results but only a very small number of Campaigns. It remains research evidence, not approved production logic.

### Dual Engine V0.9
Fib/SR plus trend-breakout engine:
- M15: 138 independent Campaigns
- about 34/year
- profitable Campaigns 55.80%
- PF 1.290
- +1,028.53 pips
- OOS positive but weak in some years
- USD 500 to USD 100,000 not achieved
- research candidate only

### Fib/SR Big Swing
High-R, low-frequency setup:
- 30 Campaigns
- 30% win rate
- PF 2.03
- +1,136.94 pips
- large profits concentrated in a few winners
- USD 500 to USD 100,000 not achieved

### Fixed 50–150 Pip Portfolio
Fib/SR plus breakout-retest:
- 152 Campaigns
- about 37.9/year
- profitable Campaigns 30.92%
- PF 1.266
- +1,157.10 pips
- yearly pips non-negative in the tested sample, but 2023 nearly flat
- did not meet win-rate or capital objective

### Latest Value Stop Research
`FIB_SR_PA_VALUE_STOP_V1`
Status: rejected for the stated target.
- 672 controlled Stop/Exit combinations
- best stable candidate: 129 Campaigns
- about 32.29/year
- win rate 17.83%
- PF 1.559
- expectancy +0.329R
- +1,626.14 pips
- average winning Campaign +221.73 pips
- largest winner +592 pips
- no fixed risk from 1% to 20% reached USD 100,000 in any rolling 12-month window
- at 20% risk, best rolling 12-month capital was about USD 2,421.85 with drawdown near 94.4%

## Current Truth
No tested setup has yet achieved all of the following under realistic assumptions:
- at least 40 independent Campaigns per year;
- consistently high win rate;
- several thousand net pips per year;
- USD 500 to USD 100,000 in a rolling 12-month window;
- acceptable drawdown and non-ruin execution.

Do not lower the target silently and do not claim success. Continue research, reject failed versions clearly, and preserve every result.

## Active Next Step
The highest-value next step is exact Campaign reconstruction from the historical V8/V9 raw outputs, not another generic proxy.

Required active inputs:
- complete `regime_v9_4_100k_trade_by_trade_all_models.csv`
- complete `regime_v8_1_no_green_best_trades.csv` or `regime_v8_fib_sr_best_trades.csv`
- original V8/V9 generator if found

Required sequence:
1. Remove duplicate risk-model copies.
2. Assign an independent `campaign_id` to each market move.
3. Compare first signal, first clean pullback, Fib/SR reclaim, M15 confirmation, and H1 confirmation on the same opportunities.
4. Freeze the entry stream.
5. Test structural Stop alternatives based on value and invalidation.
6. Test profit lock and H1/H4 Runner exits.
7. Recalculate rolling 12-month capital using realistic Campaigns.

## New Chat Startup Protocol
Read in this order:
1. `docs/00_PROJECT_MEMORY_MASTER.md`
2. `docs/00_PROJECT_MASTER.md`
3. `docs/04_DECISION_LOG.md`
4. `docs/05_CURRENT_STATUS.md`
5. `docs/06_NO_DETAIL_LOSS_PROTOCOL.md`
6. `docs/99_LATEST_HANDOVER.md`
7. latest checkpoint under `checkpoints/`
8. latest result under `research/active/capital_path_500_to_100k_v0_1/`

Then report:
- active research version;
- latest accepted/rejected evidence;
- exact missing inputs;
- next computation step;
- whether the user has said `执行`.
