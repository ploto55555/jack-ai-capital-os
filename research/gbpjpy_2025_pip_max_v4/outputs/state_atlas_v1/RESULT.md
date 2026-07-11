# GBPJPY 2025 State Atlas V1

## Scope

This phase builds a causal market-state map for the 260 full GBPJPY trading days in 2025. It does not calculate strategy profit.

## Causal labeling rule

Each trading day is labeled at its first M1 timestamp using only the latest completed H4 bar available at that time.

The H4 state engine uses:

- H4 EMA20
- H4 SMA200
- H4 ATR14
- H4 Bollinger width
- H4 EMA20 slope over six completed H4 bars
- Rolling 20th-percentile compression threshold calculated from prior completed H4 bars

States:

- COMPRESSION
- TRANSITION_UP
- TRANSITION_DOWN
- BULL_EXPANSION
- BEAR_EXPANSION
- BULL_PULLBACK
- BEAR_PULLBACK
- NEUTRAL

The daily file also includes dominant and closing H4 states observed as the day unfolded. Those fields describe the intraday path; they are not assumed known at the start of the day.

## 2025 day-open state distribution

| State | Trading days | Average segment days | Average daily range | Average absolute net move |
|---|---:|---:|---:|---:|
| NEUTRAL | 176 | 3.52 | 154.88 pips | 73.59 pips |
| COMPRESSION | 30 | 1.36 | 129.52 pips | 62.00 pips |
| BULL_EXPANSION | 24 | 1.20 | 140.57 pips | 65.96 pips |
| BULL_PULLBACK | 15 | 1.00 | 147.26 pips | 78.25 pips |
| TRANSITION_DOWN | 6 | 1.00 | 145.15 pips | 78.60 pips |
| BEAR_EXPANSION | 4 | 1.00 | 172.22 pips | 63.87 pips |
| BEAR_PULLBACK | 3 | 1.00 | 246.17 pips | 133.67 pips |
| TRANSITION_UP | 2 | 1.00 | 128.10 pips | 40.75 pips |

## April 3–9 observation

The day-open label alone is not sufficient for campaign trading because important transitions can happen during the day.

Examples from the April focus window:

- April 3 opened in COMPRESSION and later transitioned intraday.
- April 4 opened NEUTRAL and later developed BEAR_EXPANSION.
- April 7 opened in BEAR_EXPANSION.
- April 8 and April 9 opened NEUTRAL, while April 9 later printed an intraday BEAR_EXPANSION state.

This confirms that the campaign engine must listen to completed H4 state changes intraday rather than assign one fixed state to the entire calendar day.

## Research implication

The atlas is a state map, not a trading system. The next stage should use the H4 event stream directly:

1. Detect causal state transition time.
2. Create or update one Campaign ID.
3. Determine phase: early, middle or late.
4. Route only the matching Step36.1 execution setup.
5. Record Core, Add-on, Runner and missed-pip attribution.

## Decision

- State Atlas V1 is accepted as a data/research foundation.
- Daily labels must not be used as if they were known for the full day.
- Profit claims require the next causal Campaign Router backtest.
