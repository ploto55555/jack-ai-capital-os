# ChatGPT Export Archive — 2026-07-11

## What was uploaded in Chat
The user uploaded a ChatGPT data export containing:
- `chat.html` — about 66 MB
- `conversations-000.json` to `conversations-008.json`
- total materialized size in the active environment: about 152 MB

## Why the raw export is not committed here
The raw export is not suitable for normal GitHub continuity because:
- it contains hundreds of unrelated conversations;
- it may contain private attachments, image references, contact details, and account history;
- large HTML/JSON files are slow to search and inefficient for every new Chat;
- GitHub should remain the curated source of truth, not a dump of the full ChatGPT account archive.

## What was committed instead
The useful information was converted into:
- `docs/00_PROJECT_MEMORY_MASTER.md` — consolidated project memory and active research truth;
- `docs/99_LATEST_HANDOVER.md` — latest operational handover;
- `archive/chatgpt_export_2026-07-11/RELEVANT_CONVERSATION_INDEX.md` — index of older conversations relevant to trading, Jack AI Capital OS, development, and current business projects.

## Raw-file retention
Keep the original ZIP and extracted files in private storage outside the public repository. Recommended locations:
- a private Google Drive folder;
- OneDrive / Dropbox;
- an encrypted external drive;
- a private GitHub Release only if the repository and access controls are appropriate.

Do not commit the full export to a public repository.

## New Chat instruction
At the start of a new Chat, ask the assistant to read:
1. `docs/00_PROJECT_MEMORY_MASTER.md`
2. `docs/99_LATEST_HANDOVER.md`
3. the newest checkpoint and research result

This is faster and safer than reading the raw ChatGPT export.
