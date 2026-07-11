# FIB + S/R + PRICE ACTION VALUE STOP V1

## Objective
Search for a GBPJPY swing setup that can:
- produce at least 40 independent campaigns per year,
- generate stable winners of at least 50 pips,
- remain profitable across years,
- and compound USD 500 to USD 100,000 within rolling 12 months.

## Search
672 controlled combinations were tested using:
- existing Fib/SR and trend opportunity stream,
- structure-stop multipliers: 0.8, 1.0, 1.2, 1.5,
- minimum available room: 2R, 3R, 5R, 8R,
- fixed exits: 50, 75, 100, 150, 200, 300 pips,
- structure runners beginning at 2R, 3R, or 5R,
- 24/48/96 M15-bar structural trails,
- optional break-even/profit locks,
- one open campaign at a time,
- conservative stop-first intrabar assumption.

## Best stable candidate
Configuration: `run5_b48_lock(2, 0)_sm0.8_room2`

Interpretation:
- initial structure stop kept at 80% of the prior candidate distance,
- minimum room 2R,
- no partial profit,
- once price reaches 2R, stop is moved to break-even,
- once price reaches 5R, a 48-bar M15 structure trail manages the position.

Results:
- campaigns: 129
- campaigns/year: 32.29
- profitable campaigns: 17.83%
- profit factor: 1.559
- expectancy: 0.329R
- total: 42.50R
- net pips: 1,626.14
- average winning campaign: 221.73 pips
- median winning campaign: 187.30 pips
- largest winner: 592.00 pips

## Decision
`REJECTED` for the stated target.

Reasons:
1. Frequency is about 32.3/year, below the required 40/year.
2. Win rate is 17.8%, far below 60%.
3. Although every calendar year was non-negative in this sample, the edge is carried by a small number of large runners.
4. No tested fixed-risk level from 1% to 20% reached USD 100,000 in any rolling 12-month window.
5. At 20% risk, the best rolling 12-month result was only about USD 2,421.85, with drawdown approaching 94.4%.

## Conclusion
This round improved total pips and winner size, but it did not find the required USD 500 to USD 100,000 one-year setup. The current GBPJPY dataset does not support claiming that such a setup has been found.
