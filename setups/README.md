# Setup Registry

This directory stores versioned setup definitions by lifecycle state.

## Planned Structure

```text
setups/
├── experimental/
├── approved/
└── retired/
```

## Rules

- Approved setups must include a setup specification, validation report, version history, and approval record.
- Experimental setups cannot produce production signals.
- Retired setups remain preserved for audit and comparison.
- Different versions must never share mixed backtest or live-performance results.
- Sensitive setup logic must not be committed while the repository is public.