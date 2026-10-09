# SM-005 — Results, detail, and recovery UI integration

## Outcome

Connect the frozen browser UI to `matchGoal` so the user can compare results, open a recommendation, and recover without losing the exact goal.

## Requirements traced from Build Contract

Sections 2, 3, 7, 9, 11, 12, and 13.

## Relevant OpenAPI

Consumes `matchGoal`, `MatchResult`, `Recommendation`, `GitHubEvidence`, `ScoreBreakdown`, and `RecoveryState`.

## UX states touched

Goal entry, matching rail, Top 3 comparison, #1 feature treatment, detail, vague/no-match/external recovery, back/focus behavior, and mobile layouts.

## Architecture constraints

- Browser renders application contracts; it does not score, discover, or call GitHub.
- Preserve exact goal verbatim and distinguish visible missing evidence from zero.
- Maintain frozen accessibility semantics, live announcements, and score communication independent of color.

## Acceptance criteria

- Success displays exactly three recommendations on the shared ranking scale with evidence and comparative rationale.
- Detail preserves rank, score, evidence, and the exact goal; back navigation restores predictable focus.
- Each recovery response maps to the specified frozen UI action set without raw errors.

## Required proof/tests

P-17 through P-21 and P-28 through P-30.

## Dependencies

SM-004.

## Explicit out-of-scope

Guidance endpoint/Agent Dock data, scoring logic, or changes to visual design.
