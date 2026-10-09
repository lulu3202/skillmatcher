# Implementation Plan — Skill Matcher V1

## Delivery approach

Build seven vertical slices in order. Each slice leaves the approved HTTP boundary, frozen UX, and deterministic rules intact. Do not introduce runtime infrastructure beyond the approved single Next.js application, server-side GitHub access, and its in-process 30-minute evidence cache.

| Order | Ticket | End-to-end outcome | Depends on |
|---:|---|---|---|
| 1 | [SM-001](../tickets/SM-001-application-shell.md) | Frozen UI is reachable with typed OpenAPI boundary stubs and all named UI states. | None |
| 2 | [SM-002](../tickets/SM-002-discovery-and-canonicalization.md) | A goal deterministically becomes bounded public-GitHub candidate identities. | SM-001 |
| 3 | [SM-003](../tickets/SM-003-evidence-cache-and-eligibility.md) | Candidates gain authoritative evidence, cache freshness, and deterministic eligibility. | SM-002 |
| 4 | [SM-004](../tickets/SM-004-ranking-and-match-api.md) | `matchGoal` returns an explainable ranked Top 3 or a compliant recovery state. | SM-003 |
| 5 | [SM-005](../tickets/SM-005-results-detail-and-recovery-ui.md) | Browser results, detail, and recovery states use the real match contract. | SM-004 |
| 6 | [SM-006](../tickets/SM-006-guidance-and-agent-dock.md) | `getGuidance` and the Agent Dock provide safe, source-backed handoff. | SM-004, SM-005 |
| 7 | [SM-007](../tickets/SM-007-integration-and-product-assurance.md) | Contract, deterministic, UI, and end-to-end evidence prove the frozen product. | SM-001–SM-006 |

## Planning rules

- A ticket is complete only when its acceptance criteria and named proof cases pass and its evidence is recorded under `evidence/`.
- OpenAPI is the browser/server contract. Tickets may implement it but must not alter it.
- Use deterministic fixtures for all discovery, evidence, ranking, and guidance tests. Live GitHub calls are integration evidence, not the source of deterministic expected values.
- A ticket must not absorb a later vertical slice merely because the implementation is convenient.
- Product, architecture, design, and Build Contract changes require a new approval; this plan does not authorize them.

## Completion gates

1. **Contract gate:** `matchGoal` and `getGuidance` conform to OpenAPI and all recovery responses retain the exact goal.
2. **Determinism gate:** discovery, eligibility, scoring, rank, and explanation fixtures produce the expected results repeatedly.
3. **Safety gate:** GitHub content never executes; only permitted display commands appear.
4. **Experience gate:** frozen desktop/mobile, keyboard, focus, loading, recovery, detail, Agent Dock, and copy-feedback states pass.
5. **Product assurance gate:** the Top 3 is exactly three or the experience recovers honestly; no unsupported infrastructure appears.
