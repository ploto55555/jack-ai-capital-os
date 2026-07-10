# Decision Log

This file records formal project decisions. Decisions are append-only. A new decision may replace an older one, but the older record must remain.

## Status Labels

- `[CONFIRMED]`
- `[SUPERSEDED]`
- `[PENDING]`

## Decisions

### DEC-001 — Dual-System Architecture

- Date: 2026-07-10
- Status: `[CONFIRMED]`
- Decision: Separate the project into Jack AI Capital OS for approved production setups and Jack Strategy Research Lab for strategy discovery and backtesting.
- Reason: Experimental logic must not contaminate production signals.

### DEC-002 — GitHub Is the Formal Source of Truth

- Date: 2026-07-10
- Status: `[CONFIRMED]`
- Decision: Chat history is working context. Rules that affect backtests, signals, setup promotion, or risk are official only after they are written to GitHub.
- Reason: Long conversations can lag, become unavailable, or lose context.

### DEC-003 — Explicit Promotion Approval

- Date: 2026-07-10
- Status: `[CONFIRMED]`
- Decision: A validated setup cannot enter the production OS without explicit user approval of the exact version.
- Reason: AI may propose and test rules but cannot silently change production behavior.

### DEC-004 — Proactive Chat Rotation

- Date: 2026-07-10
- Status: `[CONFIRMED]`
- Decision: The assistant must proactively create a GitHub checkpoint and recommend opening a new chat before context becomes fragile or the chat becomes excessively long.
- Reason: The project is detail-sensitive and errors can propagate through the system.

### DEC-005 — Repository Privacy Requirement

- Date: 2026-07-10
- Status: `[CONFIRMED]`
- Decision: Sensitive strategy parameters, capital data, private trading records, credentials, and proprietary logic must not be committed while the repository is public.
- Reason: Confidentiality and security.

### DEC-006 — Canonical Code Repository and Branch

- Date: 2026-07-10
- Status: `[CONFIRMED]`
- Decision: The local folder `jack-capital-os-source` maps to GitHub repository `ploto55555/jack-quantdinger-lab`, branch `jack-personal-os-v1`. This repository and branch are the canonical source for existing Capital OS code.
- Reason: The local folder name is not the GitHub repository name. Future code audits must use the remote repository and exact branch rather than infer from the local folder name.

### DEC-007 — Documentation Repository Role

- Date: 2026-07-10
- Status: `[CONFIRMED]`
- Decision: `ploto55555/jack-ai-capital-os` is currently the project documentation, checkpoint, decision-log, and continuity repository. It is not the canonical existing application code repository.
- Reason: Separating code source from project memory avoids overwriting or misidentifying the existing implementation.
