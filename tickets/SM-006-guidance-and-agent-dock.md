# SM-006 — Safe guidance API and Agent Dock

## Outcome

Implement source-backed `getGuidance` and connect the frozen Claude Code/Codex Agent Dock to safe, copyable Add → Invoke → Apply guidance.

## Requirements traced from Build Contract

Sections 3, 8, 9, 11, 12, 13, and 14.

## Relevant OpenAPI

`getGuidance`; `GuidanceRequest`, `SetupGuidance`, and `RecoveryState`.

## UX states touched

Recommendation detail, Claude Code/Codex tabs, Add → Invoke → Apply, copy feedback, insufficient setup, external error, and mobile Agent Dock.

## Architecture constraints

- Guidance sources are retrieved public `SKILL.md`, README, and repository documentation only.
- Only the canonical display-only clone command may be derived; other command text must be source-linked and safe.
- No commands execute; no agent CLI syntax, installation paths, package commands, or scripts are invented.

## Acceptance criteria

- Successful response conforms to `SetupGuidance` and is visibly agent-selected without unsupported agent-specific claims.
- Insufficient source information returns 422 `insufficient_setup`; external retrieval failure returns 502 `github_unavailable`.
- Copy actions are explicit, keyboard-accessible, and do not execute content.

## Required proof/tests

P-22 through P-27 and P-30.

## Dependencies

SM-004 and SM-005.

## Explicit out-of-scope

Executing installation, editing user repositories, persistence of selected skills, or agent integrations.
