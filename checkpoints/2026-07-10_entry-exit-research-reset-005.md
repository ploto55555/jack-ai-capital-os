# Entry / Exit Research Reset 005

Date: 2026-07-10

## User correction

The prior Regime V9.3 / V9.4 work had already produced a 2024 capital path from USD 500 to USD 100,000 with sufficient trade frequency. The unresolved problem is not a lack of trade opportunities. The unresolved problem is whether the entries and exits are realistic, non-overlapping, reproducible, and robust.

## Corrected research direction

Primary line remains Swing Trade, but it must be built from the prior regime/setup engine instead of replacing it with a new ultra-low-frequency system.

Target structure:

- approximately 40+ independent trade campaigns per year;
- retain the existing regime/setup opportunity engine as the baseline;
- separate a trade campaign from repeated entries inside the same move;
- study entry and exit independently before changing the regime filter;
- preserve the USD 500 to USD 100,000 rolling-12-month target as a stress objective;
- do not claim success until entries, exits, spread, overlapping positions, and out-of-sample years are validated.

## Problems visible in the prior trade logs

- Multiple same-direction entries can occur within the same day and same market move.
- Raw trade count may therefore include repeated entries rather than independent setups.
- Existing exits include fixed stops, small locked-profit exits, and time exits; these may fail to capture full MFE.
- The trade logs already contain MFE and MAE, so entry and exit quality can be reconstructed without inventing a new signal family.

## Next research stage

`REGIME_V9_ENTRY_EXIT_RESEARCH_V0.1`

### Entry study

1. Freeze the original regime direction and setup timestamps.
2. Group repeated signals into one independent trade campaign.
3. Compare:
   - first valid signal;
   - breakout close;
   - first retest;
   - M15 pullback confirmation;
   - H1 close confirmation;
   - limited add-on only after the first position is protected.
4. Measure MAE before MFE, initial adverse excursion, missed-move rate, and stop efficiency.

### Exit study

1. Compare structure stop versus fixed-pip and ATR stop.
2. At +1R, test break-even, +0.25R, and +0.5R protection.
3. Test partial profit at +1R / +2R while keeping a runner.
4. Test H1 swing, H4 swing, ATR, and trendline-style trailing exits.
5. Replace unconditional time exit with a no-progress exit where appropriate.
6. Measure MFE capture ratio and pips left on the table.

## Promotion gate

A candidate cannot be accepted merely because one 2024 equity curve reaches USD 100,000. It must also pass:

- no look-ahead;
- realistic spread and slippage;
- no hidden overlapping-risk inflation;
- fixed rules across multiple years;
- rolling 12-month analysis;
- independent setup count around the intended annual frequency;
- stable entry and exit behavior outside the optimization year.
