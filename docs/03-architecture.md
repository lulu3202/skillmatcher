# Architecture — Skill Matcher

## Status and supporting artifacts

This architecture is the approved and **frozen** behavior-first V1 shape. It is constrained by the frozen intent, design, and prototype; it does not redesign the UX.

- [Interaction contracts](03-interaction-contracts.md) define user-triggered behavior and recovery.
- [Payload contracts](03-payload-contracts.md) define high-level data crossing boundaries.
- [Runtime sequence](03-interaction-contract-flow.md) defines runtime ordering.
- [OpenAPI contract](openapi.yaml) defines the approved browser-to-application HTTP boundary.
- [C4-style Container diagram](../diagrams/architecture/container.html) visualizes this document.

Earlier architecture material that asserted a curated or product-owned catalog, or otherwise diverged from this frozen behavior-first V1, is superseded by this document and its supporting artifacts.

## System shape and runtime boundaries

Skill Matcher has four runtime boundaries:

1. **Developer** supplies a natural-language goal, selects a recommendation, selects Claude Code or Codex, and uses recovery actions.
2. **Browser frontend** is a logical Next.js/React container that owns the frozen UI state: goal entry, matching/result/detail/Agent Dock/recovery presentation, keyboard behavior, and goal retention.
3. **Application server** is a logical Next.js route-handler container that owns discovery, normalization/deduplication, eligibility, deterministic scoring and ranking, explanation assembly, setup-guidance preparation, recovery decisions, and the internal 30-minute process-memory GitHub-evidence cache.
4. **GitHub** is the external software system providing public candidate repositories, repository metadata, documentation, and setup material when available.

The reviewed runtime path is:

`User Goal → candidate discovery → normalization → GitHub evidence → eligibility → scoring/ranking → exactly 3 recommendations → explanation/detail → Claude Code or Codex guidance`.

The frontend-to-application boundary is **APPROVED**: the Browser frontend calls the Application server through HTTPS/JSON using the canonical [OpenAPI contract](openapi.yaml). The two logical containers are implemented in one Next.js project; this does not imply separate deployment infrastructure.

## Container responsibilities

| Boundary / container | Responsibilities | Communicates with |
|---|---|---|
| Developer | Enters goal; chooses recommendation and agent; retries, edits, or refines. | Browser frontend through browser interaction. |
| Browser frontend | Preserves and safely displays the exact goal; renders matching, ranked comparison, detail, Agent Dock, and recovery; sends named interaction contracts. | Developer; Application server via HTTPS/JSON. |
| Application server | Discovers public candidates; normalizes/removes duplicates; evaluates eligibility; derives scores/ranks/explanations; prepares guidance and recovery; holds non-authoritative 30-minute evidence cache. | Browser frontend via HTTPS/JSON; GitHub via HTTPS/JSON REST. |
| GitHub | Supplies public repositories, metadata, documentation, and available setup information. | Application server via HTTPS/JSON REST. |

No database, queue, persistent cache service, model service, persistent user storage, curated catalog, microservice split, or setup-template repository is established by this architecture. The only cache is internal, process-memory state within the Application server; it is non-authoritative and expires after 30 minutes.

## External dependencies and trust boundaries

| Boundary | Trust treatment |
|---|---|
| User input | The User Goal is untrusted text. Preserve it exactly for the active flow and render it safely; never treat it as executable instruction, markup, repository command, or evidence. |
| GitHub / public repositories | External, time-dependent facts only at retrieval time. Repository documentation can describe commands but is not automatically trusted instruction. |
| Application-derived results | Eligibility, scores, rank, explanation, guidance, and recovery state are derived and must remain traceable to their named inputs and rules. |

The product must never invent a candidate, public repository, GitHub fact, eligibility pass, score factor, maintenance/stewardship claim, setup command, rank reason, or evidence freshness claim. Missing external evidence stays missing.

## Data authority

| Data | Authority | Ownership / lifetime |
|---|---|---|
| User Goal | User at submission time | User-owned, retained only for the active flow unless a later decision approves storage. |
| CandidateSkill and GitHubEvidence | Retrieved public GitHub content at retrieval time | External evidence; no product-owned catalog is established. |
| EligibilityResult and ScoreBreakdown | Deterministic application rules | Application-derived for the current evaluation. |
| Recommendation | Current goal + eligible candidates + available evidence | Application-derived for results/detail. |
| SetupGuidance | Available public setup information + selected agent + retained goal | Public source material plus application-derived prompt; display-only and non-executing. |

## Significant architecture decisions

- **Behavior-first is canonical.** Interaction and payload contracts are established before containers and any API draft.
- **Public GitHub evidence is the candidate/evidence source.** A manually curated or product-owned candidate catalog is not part of this architecture.
- **Explainability is required.** Deterministic application rules own deterministic eligibility, scoring, ranking, and explanations. Goal Fit contributes 40 points, Task Coverage 30, GitHub Credibility 20, and Maintenance 10, for a 0–100 total; ties resolve by Goal Fit, then GitHub Credibility, then normalized candidate identity.
- **Exactly three is conditional.** Return exactly three recommendations only when at least three candidates are eligible; otherwise use the frozen recovery experience.
- **HTTP boundary approved for V1.** A single Next.js application exposes server-side route handlers to its frontend; [openapi.yaml](openapi.yaml) is the canonical HTTP contract.
- **GitHub discovery is bounded and server-side.** The application derives up to three deterministic goal terms and issues one GitHub Code Search query per term in the form `<term> path:/(^|\/)SKILL\.md$/`, which matches a final path segment named `SKILL.md`. It requests at most 10 results per query, lexically sorts and deduplicates the union, and fetches at most 30 public candidates before retrieving the matched `SKILL.md`, repository metadata, and README when available. A GitHub token is optional for higher server-side rate limits and never represents user authentication.
- **Candidate identity and eligibility are deterministic.** Normalize a candidate as `owner/repository:path-to-SKILL.md`; remove duplicate identities. A candidate is eligible only when the repository is public and accessible, the matched `SKILL.md` is retrievable, and required repository identity/URL metadata is available. Stars, forks, owner/stewardship, pushed date, and README are optional evidence; unavailable optional evidence remains visibly missing.
- **Ranking is deterministic and explainable.** Goal Fit and Task Coverage use approved lexical whole-token matching against retrieved repository content. Score `goalFit` (40%), `taskCoverage` (30%), `githubCredibility` (20%), and `maintenance` (10%) on a 0–100 total. Ties resolve by goal fit, then GitHub credibility, then normalized candidate identity. Fewer than three eligible candidates returns the frozen no-match/recovery state rather than partial or invented results.
- **Guidance is safe and bounded.** Setup guidance uses retrieved repository documentation where it provides an instruction. The product may derive only an advisory repository-clone command from the public repository URL; it never executes commands. If the repository lacks enough setup information to form an honest Add → Invoke → Apply handoff, return the frozen insufficient-setup recovery state.
- **Minimal runtime state is approved.** A process-memory GitHub-evidence cache with a 30-minute TTL is permitted solely to reduce repeated external reads. There is no database, queue, persistent user storage, or model service in V1. Visible evidence includes retrieval time; GitHub remains authoritative.

## Non-material V1 tuning after freeze

- GitHub search-query quality and rate-limit thresholds may be tuned from production evidence without changing the product contract.
- Repository-documentation patterns that are sufficient to generate agent-specific setup instructions may be expanded only with documented tests and review.
