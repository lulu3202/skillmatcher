# Interaction contracts

## Scope

This is the canonical behavior-level bridge between the frozen Skill Matcher UX and architecture. It is derived from approved intent, frozen design, and the frozen prototype. It does not define implementation architecture, API endpoints, or production integrations.

The detailed object definitions live in [03-payload-contracts.md](03-payload-contracts.md). The runtime ordering lives in [03-interaction-contract-flow.md](03-interaction-contract-flow.md). Those artifacts complement this document; they do not introduce new product scope.

Approved V1 decisions in the frozen architecture and OpenAPI are implementation requirements. No open human decision is carried by this behavior-level contract.

## Contract 1: Match a development goal

| Field | Contract |
|---|---|
| Trigger | User enters a development goal and activates “Find skills,” including Cmd/Ctrl + Enter. |
| Input | `MatchRequest` containing the exact `User Goal`. |
| Processing | Preserve the goal; assess specificity; discover and normalize `Candidate Skill` candidates; retrieve available `GitHub Evidence`; produce `Eligibility Result` and `Score Breakdown`; rank eligible candidates; prepare recommendations. |
| External dependency | Public GitHub Code Search and REST evidence for public repositories only. Discovery is server-side, bounded, deterministic, and issues `<term> path:/(^|\/)SKILL\.md$/` queries for files named `SKILL.md`; no curated catalog is used. |
| Output | Matching state, then exactly three `Recommendation` objects only when at least three candidates are eligible; otherwise `RecoveryState`. |

## Contract 2: View ranked results

| Field | Contract |
|---|---|
| Trigger | Matching completes with at least three eligible candidates. |
| Input | `Recommendation[]`, each supported by `Score Breakdown` and available `GitHub Evidence`. |
| Processing | Display the shared ranked comparison, visible score, match reason, comparative rationale, and evidence without filling gaps. |
| External dependency | None at display time. |
| Output | Top 3 recommendation state with the exact submitted goal retained. |

## Contract 3: Open a recommendation

| Field | Contract |
|---|---|
| Trigger | User activates a recommendation row or “Open recommendation.” |
| Input | `SelectionContext` containing `Selected Skill` and retained `User Goal`. |
| Processing | Retain selected recommendation context and make its rank rationale, score breakdown, and evidence available to the detail view. |
| External dependency | None. Detail uses the recommendation context already returned by matching; it does not require an evidence refresh. |
| Output | Detail context containing `Recommendation`, `Score Breakdown`, and `GitHub Evidence`. |

## Contract 4: Choose agent guidance

| Field | Contract |
|---|---|
| Trigger | User selects Claude Code or Codex in the Agent Dock. |
| Input | `GuidanceRequest` containing `Selected Skill`, selected agent, and retained `User Goal`. |
| Processing | Prepare the selected agent’s Add → Invoke → Apply handoff. |
| External dependency | Retrieved public `SKILL.md`, README, and repository documentation only when needed. Guidance is advisory, follows the approved command-safety policy, and never executes a command. |
| Output | `SetupGuidance` with instructions, a command or directory action, and starter prompt; otherwise `RecoveryState`. |

## Contract 5: Recover, retry, or edit

| Field | Contract |
|---|---|
| Trigger | Input is vague; no eligible match or fewer than three exist; required evidence is unavailable; or setup information is insufficient. The user may Retry, Edit goal, or Refine goal. |
| Input | Retained `User Goal` and the recovery condition. |
| Processing | Preserve the goal, present a plain-language explanation and allowed action, then either return focus to goal entry or repeat matching. No recommendation or evidence is fabricated. |
| External dependency | Public GitHub evidence only when retrying matching; otherwise None. |
| Output | `RecoveryState`, or a return to goal entry/matching. |

## Contract rules

- The active flow preserves the user’s goal exactly.
- Exactly three recommendations are returned only when at least three candidates are eligible.
- Missing GitHub evidence remains visibly missing; it is never fabricated, silently substituted, or presented as verified.
- Candidate discovery, external facts, eligibility, score/rank, explanation, and setup guidance remain traceable to their stated authorities.

## Resolved V1 decisions

The canonical architecture approves server-side GitHub Code Search and REST discovery of public `SKILL.md` sources, deterministic canonicalization, eligibility, scoring, ranking, and goal-preserving recovery for fewer-than-three and external failure. Guidance is advisory-only; the browser-to-application HTTP boundary and a 30-minute process-memory evidence cache are approved. See [03-architecture.md](03-architecture.md) and [openapi.yaml](openapi.yaml).

Remaining V1 tuning is limited to non-contractual search-query/rate-limit thresholds and source-reviewed setup-documentation patterns; it must not change the frozen behavior or contract semantics.
