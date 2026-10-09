# SM-003 — GitHub evidence, cache, and eligibility

## Outcome

Retrieve authoritative public repository evidence, preserve missing optional facts, apply eligibility, and use the approved internal TTL cache.

## Requirements traced from Build Contract

Sections 3, 5, 10, 11, 12, and 13.

## Relevant OpenAPI

Internal inputs for `matchGoal`; `GitHubEvidence`, `RecoveryState`.

## UX states touched

Matching, no-match, and GitHub-unavailable recovery.

## Architecture constraints

- Cache is in-process, non-authoritative, 30 minutes, and retains retrieval context.
- Required evidence is public/accessibility/archive/identity/URL/`SKILL.md`; optional evidence stays missing.
- No external cache, persistence, user auth, or client-side GitHub access.

## Acceptance criteria

- Required evidence failures are ineligible with a deterministic reason.
- Optional evidence does not gate eligibility or become zero/verified when unavailable.
- External retrieval failure maps to `github_unavailable`, not `insufficient_setup`.
- Cache reuse and expiry preserve evidence freshness semantics.

## Required proof/tests

P-06, P-07, P-20, P-21, and cache/freshness assertions captured with those cases.

## Dependencies

SM-002.

## Explicit out-of-scope

Scoring/ranking, recommendation explanation, Agent Dock guidance, and frontend result rendering.
