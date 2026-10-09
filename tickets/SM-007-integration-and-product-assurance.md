# SM-007 — Integration and product assurance

## Outcome

Prove the assembled product satisfies the frozen Build Contract without introducing architecture or UX drift.

## Requirements traced from Build Contract

All sections, especially 2, 3, 9, 10, 14, and 15.

## Relevant OpenAPI

Full validation of `matchGoal` and `getGuidance` success and recovery behavior.

## UX states touched

Every frozen state: initial, matching, results, detail, Agent Dock, vague input, no match, external error, insufficient setup, focus/copy feedback, and responsive mobile.

## Architecture constraints

- No new runtime component, persistence, infrastructure, or product behavior.
- Verification evidence belongs under `evidence/` and must be reproducible.

## Acceptance criteria

- All P cases pass; held-out cases run after primary fixtures and pass.
- OpenAPI validation passes and implementation contract tests are green.
- Desktop/mobile screenshots and keyboard/focus evidence demonstrate frozen UX behavior.
- Dependency/configuration inspection confirms no unsupported infrastructure.

## Required proof/tests

P-01 through P-30 and H-01 through H-03; capture the final evidence set.

## Dependencies

SM-001 through SM-006.

## Explicit out-of-scope

New features, product/design changes, performance optimization beyond correctness, deployment infrastructure, or article drafting.
