# Latest Handover

## Date
2026-07-11

## Read First
1. `docs/00_PROJECT_MEMORY_MASTER.md`
2. `docs/00_PROJECT_MASTER.md`
3. `docs/04_DECISION_LOG.md`
4. `docs/05_CURRENT_STATUS.md`
5. `docs/06_NO_DETAIL_LOSS_PROTOCOL.md`
6. this file
7. newest checkpoint under `checkpoints/`
8. newest result under `research/active/capital_path_500_to_100k_v0_1/`

## Project Architecture
1. **Jack AI Capital OS** — production decision support using only explicitly approved setup versions.
2. **Jack Strategy Research Lab** — reconstruction, causal backtesting, robustness testing, rejection, validation, and promotion review.

No setup enters production without exact version documentation and explicit user approval.

## Repository Mapping
- Local folder: `C:\Users\sneak\jack-capital-os-source`
- Code repository: `ploto55555/jack-quantdinger-lab`
- Working branch: `jack-personal-os-v1`
- Documentation repository: `ploto55555/jack-ai-capital-os`
- Documentation branch: `main`

GitHub is the continuity source of truth. Never commit credentials, API keys, broker passwords, or private tokens.

## User Operating Rules
- Reply in Chinese unless the user explicitly asks otherwise.
- Explain technical steps for a beginner.
- Do not modify code/GitHub/deployment unless the user says `执行`.
- Personal research support only; no automatic order execution in the current phase.
- Do not call conceptual analysis a completed backtest.
- Label every setup honestly: proxy, candidate, rejected, or approved.

## Data Status
GBPJPY data audited:
- D1/H4/H1: 2010-06-24 to 2026-07-08
- M30: 2018-06-29 to 2026-07-08
- M15: 2022-07-04 to 2026-07-08
- M5: 2025-03-06 to 2026-07-08
- M1: 2026-04-01 to 2026-07-08

True schema:
`Time, Open, High, Low, Close, TickVolume, SpreadPoints`

## Capital Path Objective
- Start: USD 500
- Target: USD 100,000
- Window: rolling 12 months

This is an extreme research target, not a promise. It cannot be accepted if achieved through duplicate entries, look-ahead, unrealistic costs, or ruin-level risk.

## Current Research Priority
1. Swing Trade now
2. Day Trade later

Preferred Swing logic:
- Weekly/Daily/H4 structure
- Fibonacci
- Support/Resistance
- Price Action confirmation
- first clean pullback or breakout/retest
- structural invalidation Stop
- available-space / risk-value calculation
- profit protection followed by Runner management

The user expects real Swing winners of 50 pips minimum, with strong waves reaching several hundred pips. Stop placement must be based on value and market invalidation, not artificially tightened to manufacture high R.

## Historical V8 / V9 Evidence
Important historical files:
- `regime_v9_4_100k_trade_by_trade_all_models.csv`
- `regime_v8_fib_sr_best_trades.csv`
- `regime_v8_1_no_green_best_trades.csv`
- `regime_v8_fib_sr_setup_summary.csv`
- `old chat full.html`

V8 summary:
- red pullback Fib/SR: 251 trades, +768.0 pips, 45.82% win rate
- blue pullback Fib/SR: 98 trades, +162.9 pips, 36.73% win rate
- green range sweep/SR: 25 trades, -26.6 pips, 44.00% win rate

V9.4 contains repeated same-direction entries in the same market move. These must be merged into independent Campaigns before compounding is accepted.

The exact original V8/V9 generator has not been recovered in the canonical code repository.

## Completed Evidence
### SRDC Episode I
Rejected standalone:
- 995 trades
- PF 0.9568
- expectancy -0.0157R

### SRDC Episode III
Weak watchlist only:
- 734 trades
- PF 1.0238
- expectancy +0.0083R

### Ketty Candidate
`KETTY_GBPJPY_TREND_BREAKOUT_V0.1`
- 1,246 trades
- PF 1.1385
- expectancy +0.1089R
- research only

### Abu Candidate
`ABU_GBPJPY_H4_COMPRESSION_NEW_SPACE_V0.1`
- 34 trades
- PF 1.80
- expectancy +0.5882R
- +20R
- promising but statistically too small after 4,032 combinations

### Generic Naked Reconstruction
`REGIME_V9_NAKED_ENTRY_EXIT_V0.1`
Status: rejected as generic proxy reconstruction.
- PA-A first retest: PF 0.8462
- PA-B Fib/SR: PF 0.8487
- PA-C sweep/reclaim: PF 0.6902
- exit optimization did not repair negative entry expectancy

### Dual Engine V0.9
Fib/SR + trend-breakout:
- 138 independent M15 Campaigns
- about 34/year
- 55.80% profitable Campaigns
- PF 1.290
- +1,028.53 pips
- positive OOS but weak in some years
- did not achieve USD 500 to USD 100,000

### Fib/SR Big Swing
- 30 Campaigns
- 30% win rate
- PF 2.03
- +1,136.94 pips
- low frequency and profits concentrated in few large winners

### Fixed 50–150 Pip Portfolio
- 152 Campaigns
- about 37.9/year
- profitable Campaigns 30.92%
- PF 1.266
- +1,157.10 pips
- did not meet win-rate or capital objective

## Latest Completed Test
Research version:
`FIB_SR_PA_VALUE_STOP_V1`

Formal status:
`[REJECTED FOR THE STATED TARGET]`

Search:
- 672 controlled Stop/Exit combinations
- structural Stop multipliers: 0.8 / 1.0 / 1.2 / 1.5
- available room: 2R / 3R / 5R / 8R
- fixed exits: 50 / 75 / 100 / 150 / 200 / 300 pips
- Runner start: 2R / 3R / 5R
- M15 structural trails: 24 / 48 / 96 bars
- optional break-even or profit lock
- one open Campaign at a time
- conservative stop-first intrabar assumption

Best stable candidate:
`run5_b48_lock(2, 0)_sm0.8_room2`

Results:
- 129 independent Campaigns
- 32.29/year
- win rate 17.83%
- PF 1.559
- expectancy +0.329R
- total +42.50R
- net +1,626.14 pips
- average winner +221.73 pips
- median winner +187.30 pips
- largest winner +592 pips

Capital result:
- no fixed risk between 1% and 20% reached USD 100,000 in any rolling 12-month window
- 20% risk best rolling 12-month capital: about USD 2,421.85
- drawdown near 94.4%

Conclusion:
The setup can capture 200–600 pip Swing waves, but frequency, win rate, capital growth, and drawdown fail the user's target.

Key result file:
- `research/active/capital_path_500_to_100k_v0_1/FIB_SR_PA_VALUE_STOP_V1_RESULTS.md`

## Current Truth
No tested setup has yet passed all of these requirements:
- at least 40 independent Campaigns/year
- consistently high win rate
- several thousand net pips/year
- USD 500 to USD 100,000 in rolling 12 months
- acceptable drawdown

Do not claim success or silently lower the target.

## Active Next Stage
`REGIME_V9_EXACT_CAMPAIGN_RECONSTRUCTION_V0.2`

Required files in the active compute session:
- `regime_v9_4_100k_trade_by_trade_all_models.csv`
- `regime_v8_1_no_green_best_trades.csv` or `regime_v8_fib_sr_best_trades.csv`
- original V8/V9 generator if available

Required sequence:
1. Remove duplicate risk-model copies.
2. Assign one `campaign_id` per distinct market move.
3. Preserve original Regime opportunity timing.
4. Compare first signal, first clean pullback, Fib/SR reclaim, M15 confirmation, and H1 confirmation on the same Campaigns.
5. Freeze the entry stream.
6. Test structural Stop value alternatives.
7. Test lock-and-Runner exits.
8. Recalculate rolling 12-month capital using realistic independent Campaigns.

## ChatGPT Export Continuity
On 2026-07-11 the user uploaded a ChatGPT export containing about 800 parsed conversations plus a large `chat.html`.

The raw export was not committed because it is large and may contain private attachments. Curated continuity files were created instead:
- `docs/00_PROJECT_MEMORY_MASTER.md`
- `archive/chatgpt_export_2026-07-11/README.md`
- `archive/chatgpt_export_2026-07-11/RELEVANT_CONVERSATION_INDEX.md`

## New-Chat Startup Response
After reading the required files, the assistant must report:
- active research version;
- latest rejected/accepted evidence;
- exact missing raw inputs;
- duplicate-Campaign rule;
- next computation step;
- whether the user has said `执行`.
