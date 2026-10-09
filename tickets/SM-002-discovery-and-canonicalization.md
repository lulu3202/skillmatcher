# SM-002 — Deterministic discovery and canonicalization

## Outcome

Convert an exact User Goal into bounded path-qualified GitHub Code Search requests and deterministic candidate identities.

## Requirements traced from Build Contract

Sections 3, 4, 12, and 13.

## Relevant OpenAPI

`matchGoal` / `MatchRequest`; this ticket produces internal candidates only.

## UX states touched

Matching and vague-goal recovery.

## Architecture constraints

- Server-side GitHub access only; no curated catalog.
- Use `<term> path:/(^|\/)SKILL\.md$/`, up to three queries, 10 results/query, and 30 unique candidates.
- Canonical identity is `owner/repository:path-to-SKILL.md`; deduplicate before later processing.

## Acceptance criteria

- Exact raw goal is separate from deterministic normalized terms.
- Fixed tokenization, stop words, first-occurrence order, and first-three limit match the Build Contract fixtures.
- Vague input creates recovery without issuing discovery.
- Search results normalize, deduplicate, and lexical-sort identically across runs.

## Required proof/tests

P-01 through P-05 and P-19.

## Dependencies

SM-001.

## Explicit out-of-scope

Repository metadata, caching, eligibility, scoring, response assembly, and UI result/detail rendering.
