# SM-001 — Application shell and frozen UX wiring

## Outcome

Create the approved single Next.js/TypeScript application shell with the frozen Signal Garden experience, same-origin route placeholders, and no production behavior invented.

## Requirements traced from Build Contract

Sections 1, 2, 3, 9, 10, 12, and 13.

## Relevant OpenAPI

`matchGoal`, `getGuidance`, and their named schemas; this ticket does not implement GitHub behavior.

## UX states touched

Initial goal entry, matching, results placeholder, detail placeholder, Agent Dock placeholder, vague/no-match/error recovery, focus, keyboard submission, and responsive layout.

## Architecture constraints

- One Next.js application with logical browser and route-handler boundaries only.
- No database, authentication, queue, external cache, model service, or persistent storage.
- Do not modify the frozen prototype or design artifacts.

## Acceptance criteria

- The application starts and presents the frozen visual hierarchy and all required mockable states.
- The goal control has a real label, Cmd/Ctrl+Enter submission, visible focus, and preserves exact text in client state.
- A typed same-origin client boundary is shaped by OpenAPI without duplicating or changing it.
- No command executes and no GitHub credential reaches the browser.

## Required proof/tests

P-26, P-27, P-28, P-30; capture initial/mobile screenshots and keyboard/focus proof.

## Dependencies

None.

## Explicit out-of-scope

GitHub calls, discovery, scoring, real result rendering, guidance generation, and live recovery semantics.
