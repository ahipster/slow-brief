# Codex Agent Instructions

This repository uses multiple coding assistants. Please follow the rules below when acting as Codex.

## General
- Follow the repo conventions in `README.md`, `SETUP.md`, `SPEC.md`, and `DEPLOY.md`.
- Keep changes minimal and focused on the requested task.
- Prefer TypeScript/React patterns already used in the codebase.
- If you are unsure about expected behavior, ask a clarifying question.

## Collaboration With Claude
- `CLAUDE.md` contains additional agent guidance specific to Claude. Align behavior with it when practical.
- Do not override or contradict existing instructions in `CLAUDE.md`.

## Code Style
- Match existing formatting and lint conventions.
- Avoid introducing new dependencies unless explicitly requested.

## Testing
- If you change behavior, suggest or run the most relevant test/lint commands used in this repo.
- Do not add heavy test suites without asking.

## Communication
- Summarize what changed and where.
- Call out any assumptions or follow-up questions.
