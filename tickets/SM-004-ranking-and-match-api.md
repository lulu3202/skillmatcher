# SM-004 — Deterministic ranking and match API

## Outcome

Produce an OpenAPI-conformant `matchGoal` result with explainable scores and exactly three recommendations, or an honest recovery state.

## Requirements traced from Build Contract

Sections 3, 6, 7, 9, 11, and 14.

## Relevant OpenAPI

`matchGoal`; `MatchRequest`, `MatchResult`, `Recommendation`, `ScoreBreakdown`, `GitHubEvidence`, and `RecoveryState`.

## UX states touched

Matching, Top 3 results, vague goal, no match, and external error.

## Architecture constraints

- Apply only approved lexical whole-token scoring and numeric bands.
- Explanation is derived from inputs; no LLM, hidden factor, or fabricated evidence.
- Success is exactly three ranks; fewer candidates recover rather than return partial results.

## Acceptance criteria

- Goal Fit, Task Coverage, Credibility, Maintenance, total, and tie-break fixtures exactly match the Proof Plan.
- The response carries required fields and missing-evidence context.
- 400/422/502 outcomes conform to OpenAPI and preserve the exact goal.

## Required proof/tests

P-08 through P-21 and P-26; run H-01 through H-03 only after these pass.

## Dependencies

SM-003.

## Explicit out-of-scope

Browser rendering beyond the shell, recommendation drill-in, and setup guidance.
