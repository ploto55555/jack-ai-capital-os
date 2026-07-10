# Jack AI Capital OS — Project Master

## Project Purpose

This repository contains two strictly separated systems:

1. **Jack AI Capital OS** — the production system that stores approved setups, scans markets, produces decision-support signals, applies risk rules, records outcomes, and compounds learning over time.
2. **Jack Strategy Research Lab** — the research system used to define, backtest, challenge, reject, improve, and validate candidate setups before they are allowed into the production OS.

## Core Principle

Research Lab discovers and proves good setups. Capital OS uses only approved setups and learns from live outcomes.

## Snowball System

Every useful artifact becomes a reusable data asset:

- strategy definitions
- parameter versions
- datasets
- backtest results
- failed tests
- rejected ideas
- live signals
- executed trades
- mistakes
- regime observations
- approved rule changes

AI may propose changes, but it may not silently modify approved production rules. Every production rule change requires explicit user approval and a new version.

## Source of Truth

GitHub is the formal source of truth. Chat history is working context only. Any rule that affects signals, risk, setup promotion, or backtest results must be written to the repository before it is treated as official.

## Safety Boundaries

- No automatic trade execution in the current version.
- No unapproved research rule may enter production.
- No API keys, passwords, broker credentials, or secrets may be committed.
- If files conflict, production decisions pause until the conflict is resolved.

## Repository Status

This repository was still public when this document was created. Sensitive strategy logic, capital details, and private trading records must not be added until repository visibility is changed to private.