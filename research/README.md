# Strategy Research Lab

This directory contains experimental strategy work only.

## Planned Structure

```text
research/
├── active/
├── backtests/
├── datasets/
├── rejected/
└── promoted/
```

## Rules

- Every strategy receives a unique ID and version.
- Assumptions must be distinguished from confirmed rules.
- Backtests must be reproducible and preserve configuration, code version, trade output, and limitations.
- Failed and rejected tests remain archived.
- Nothing in this directory is automatically approved for production.
- Sensitive research must not be committed while the repository is public.