# Build Contract — Skill Matcher V1

## 1. Scope + non-goals

V1 accepts a developer’s natural-language goal, discovers eligible public GitHub skills, and returns exactly three explainable recommendations only when at least three candidates are eligible. A selected recommendation provides safe, copyable Claude Code or Codex guidance and a starter prompt.

- The implementation MUST preserve the frozen Signal Garden UX, its states, keyboard behavior, responsive behavior, and hierarchy.
- The implementation MUST use public GitHub evidence only; it MUST NOT use a curated or product-owned catalog.
- The implementation MUST NOT recommend closed-source or non-GitHub skills, return more than three recommendations, install a skill, modify a user repository, execute a command, require user authentication, or act for the user.
- The implementation MUST NOT add a database, persistent user storage, queue, external cache, model service, microservice split, or setup-template repository.

## 2. Traceability

| Requirement / behavior | UX state or interaction | Architecture / API contract | Verification evidence required |
|---|---|---|---|
| Exact goal is retained | Goal entry, matching, results, detail, recovery | `MatchRequest`, `RecoveryState`, `MatchResult` | Automated request/response and UI-state checks |
| Exactly three ranked results | Results rail | `matchGoal`, `MatchResult`, `Recommendation` | Ranking fixture with exactly three eligible candidates |
| Honest recovery instead of partial results | Vague, no-match, error states | `RecoveryState`; 400/422/502 responses | Fewer-than-three and external-failure tests |
| Explainable rank and evidence | Results and detail | `ScoreBreakdown`, `GitHubEvidence` | Known-score and missing-evidence fixtures |
| Safe Agent Dock handoff | Claude Code / Codex tabs | `getGuidance`, `SetupGuidance` | Command-safety and insufficient-setup tests |
| No persistent infrastructure | All states | Frozen architecture and Container view | Dependency/configuration inspection |

## 3. Product invariants

- The implementation MUST preserve the exact submitted User Goal for the active flow; it MUST NOT trim, rewrite, summarize, or replace the displayed value.
- A successful match response MUST contain exactly three recommendations, ranked 1 through 3.
- If fewer than three candidates are eligible, the application MUST return the approved no-match recovery state; it MUST NOT return one or two recommendations or manufacture a fourth candidate.
- The application MUST NOT invent GitHub evidence, freshness, a repository, a candidate, an eligibility pass, a score factor, a setup command, or a rank reason.
- Missing optional evidence MUST remain visibly missing; it MUST NOT be represented as zero, verified, recent, or otherwise present.
- V1 matching MUST be lexical and deterministic; it MUST NOT claim semantic, model, or AI understanding.
- Every explanation MUST be reconstructable from the current User Goal, retrieved evidence, and deterministic scoring/ranking inputs.
- The implementation MUST preserve the frozen UX states: initial, matching, results, vague goal, no match, external error/recovery, detail, Agent Dock, and copy feedback.

## 4. Discovery contract

- The application MUST retain the original User Goal unchanged and derive a separate deterministic search-term list.
- It MUST lowercase the goal for matching, retain distinct tokens of three or more characters, exclude a fixed stop-word set, preserve first-occurrence order, and retain at most the first three terms.
- It MUST issue at most three server-side GitHub Code Search queries, one per retained term, using `<term> path:/(^|\/)SKILL\.md$/`.
- It MUST request at most 10 code-search results per query, union the results, sort canonical identities lexically, and fetch at most 30 unique candidates for evaluation.
- A candidate’s canonical identity MUST be `owner/repository:path-to-SKILL.md`.
- The application MUST deduplicate by canonical identity before eligibility or scoring.
- Discovery MUST consider public GitHub repositories only, using server-side GitHub access; any credential MUST remain server-side and MUST NOT represent user authentication.
- Discovery MUST NOT use a curated catalog or an unbounded search/query fan-out.

### Lexical tokenization policy

- The application MUST retain the original User Goal separately and use only a derived normalized value for discovery and lexical scoring.
- It MUST Unicode-lowercase the derived value and split it at every character that is not a Unicode letter or decimal digit; punctuation is a boundary, not a retained token.
- It MUST remove empty tokens, retain only tokens with length at least three Unicode code points, then remove duplicates while preserving first-occurrence order.
- It MUST exclude only this fixed stop-word list: `a`, `an`, `the`, `and`, `or`, `but`, `for`, `to`, `of`, `in`, `on`, `at`, `with`, `from`, `by`, `into`, `about`, `as`, `is`, `are`, `be`, `build`, `create`, `make`, `help`, `need`, `want`, `please`, `me`, `my`, `we`, `our`, `your`, `develop`, `implement`, `add`, `use`.
- It MUST retain no more than the first three remaining terms.
- It MUST NOT stem, lemmatize, expand synonyms, use an LLM, or otherwise apply semantic rewriting.

| Exact User Goal | Retained terms, in query order |
|---|---|
| `Build an accessible React dashboard` | `accessible`, `react`, `dashboard` |
| `Create a Python API for PDF extraction` | `python`, `api`, `pdf` |
| `Help me make a Next.js authentication flow` | `next`, `authentication`, `flow` |

## 5. Evidence + eligibility contract

- A candidate MUST be ineligible unless its repository is public, accessible, non-archived, has canonical repository identity and URL metadata, and has a retrievable matched `SKILL.md`.
- Required identity metadata failure MUST make the candidate ineligible for that request.
- Stars, forks, owner/stewardship signals, pushed/update time, README, and other approved credibility or maintenance evidence are optional.
- A candidate MAY be scored with missing optional evidence only when all required eligibility fields are available.
- Popularity evidence MUST inform credibility only; it MUST NOT be an eligibility gate.
- Optional evidence that is unavailable MUST remain absent with retrieval/freshness context; it MUST NOT be coerced to zero.
- GitHub retrieval failure MUST produce the external-dependency recovery behavior; it MUST NOT be presented as insufficient setup documentation.

## 6. Scoring + ranking contract

- The application MUST calculate a 0–100 total from Goal Fit (40), Task Coverage (30), GitHub Credibility (20), and Maintenance (10).
- Goal Fit MUST use case-insensitive lexical whole-token matching between retained goal terms and the retrieved candidate corpus: repository name, description, topics, `SKILL.md`, and README when available.
- Goal Fit MUST equal `round(40 × matched distinct retained terms in the candidate corpus / retained term count)`.
- Task Coverage MUST use the same whole-token rule against `SKILL.md` content only.
- Task Coverage MUST equal `round(30 × matched distinct retained terms in SKILL.md / retained term count)`.
- A candidate MUST have at least one Goal Fit match to be eligible.
- Ties MUST resolve in this order: Goal Fit, GitHub Credibility, then lexical canonical candidate identity.
- The application MUST expose matched and unmatched retained terms wherever needed to reconstruct the user-facing match explanation.
- The application MUST NOT use model-selected weights, hidden subjective judgment, or undisclosed ranking factors.

### GitHub Credibility formula — 0 to 20

The score is the sum of three independently visible signals. A missing signal receives its stated neutral allocation for ranking only and MUST remain labelled missing in evidence; neutral allocation is not a measured GitHub value.

| Signal | Measured value → points | Missing optional evidence → points |
|---|---|---|
| Stars, 0–10 | `>= 10,000` → 10; `>= 1,000` → 8; `>= 100` → 5; `>= 10` → 2; `< 10` → 0 | 5 neutral points |
| Forks, 0–6 | `>= 1,000` → 6; `>= 100` → 5; `>= 10` → 3; `>= 1` → 1; `0` → 0 | 3 neutral points |
| GitHub owner type, 0–4 | `Organization` → 4; `User` → 2 | 2 neutral points |

The application MUST calculate GitHub Credibility as the integer sum of these bands. For example, a repository with 1,500 stars, 220 forks, and an `Organization` owner scores `8 + 5 + 4 = 17/20`. A repository with unavailable stars and forks but a `User` owner scores `5 + 3 + 2 = 10/20`; stars and forks still display as missing.

### Maintenance formula — 0 to 10

Maintenance uses the repository `pushed_at` timestamp relative to `retrievedAt`, rounded down to whole UTC days. `0–30 days` scores 10; `31–90` scores 8; `91–180` scores 5; `181–365` scores 2; and `more than 365` scores 0. If `pushed_at` is unavailable, Maintenance receives 5 neutral points for ranking only and the evidence MUST display as missing.

For example, evidence retrieved on 2026-10-09 for a repository pushed on 2026-08-25 is 45 days old and scores `8/10`. If `pushed_at` is absent, it scores `5/10` with a visible missing-maintenance signal.

## 7. Recommendation + explanation contract

- Each recommendation MUST conform to the required `Recommendation`, `ScoreBreakdown`, and `GitHubEvidence` fields in [openapi.yaml](openapi.yaml).
- Each recommendation MUST show rank, total score, match reason, comparative reason, score breakdown, GitHub evidence, and missing-evidence treatment.
- Comparative rationale MUST explain the ranking relative to the other returned recommendations using deterministic factor values and tie-breaks where applicable.
- The frontend MUST communicate rank and score with ordinal/numeric text and shared comparison structure; it MUST NOT rely on color or bar length alone.

## 8. Setup guidance + command safety

- The authoritative source for setup guidance MUST be the retrieved repository `SKILL.md`, README, or repository documentation where it explicitly supports the instruction.
- The application MAY derive only this display-only command itself: `git clone https://github.com/<owner>/<repo>.git`.
- A repository-sourced command MAY be displayed only when it is source-linked and satisfies the approved safe-command policy: canonical-repository `git clone` or a relative `cd` action without variables, substitutions, redirects, pipelines, or scripts.
- Commands MUST be advisory and copyable; they MUST NOT execute automatically.
- The application MUST NOT invent Claude Code CLI syntax, Codex CLI syntax, skill installation paths, package-manager commands, `curl`/`wget`, shell pipelines, redirects, scripts, environment exports, permission-changing commands, or unsupported installation claims.
- Claude Code and Codex guidance MUST differ only when the authoritative source explicitly supports an agent-specific instruction; otherwise selected-agent wording and the retained-goal starter prompt are the only permitted variation.
- Setup guidance MUST contain Add, Invoke, Apply, a `setupCommand`, and a starter prompt as required by `SetupGuidance`.
- A directory action MUST be expressed in `addInstruction`; it MUST NOT cause the API schema to drift from the required `setupCommand` field.
- Missing, inaccessible, invalid, or ambiguous authoritative setup information MUST return `insufficient_setup`; it MUST NOT be filled with invented guidance.

## 9. API contract

[openapi.yaml](openapi.yaml) is authoritative for the approved same-origin HTTPS/JSON frontend-to-application boundary.

- The implementation MUST conform to `matchGoal` and `getGuidance`, including their request, success, and recovery responses.
- Frontend/backend field names, required/optional semantics, and enum values MUST NOT drift from OpenAPI.
- `matchGoal` MUST return `MatchResult` on 200 and `RecoveryState` on 400, 422, or 502; `getGuidance` MUST return `SetupGuidance` on 200 and `RecoveryState` on 400, 422, or 502.
- Contract tests MUST validate implementation behavior against OpenAPI; the Build Contract MUST NOT duplicate the full schemas.

## 10. Runtime / cache / storage rules

- The application MUST keep GitHub evidence only in a non-authoritative in-process memory cache with a 30-minute TTL.
- Cached evidence MUST retain retrieval/freshness context, and GitHub MUST remain authoritative.
- The cache MUST NOT become a persistent store, cross-process service, or source of invented evidence.
- The implementation MUST NOT introduce a persistent database, persistent user storage, queue, external cache service, or model service.
- Any additional infrastructure MUST require a new approved architecture decision.

## 11. Error → UI recovery contract

| Condition | Backend / API outcome | Retained data | UI state | Allowed user action |
|---|---|---|---|---|
| Vague goal | 400 `RecoveryState` with `vague_goal` | Exact User Goal | Vague-input guidance | Edit, refine, resubmit |
| GitHub unavailable during match or guidance | 502 `RecoveryState` with `github_unavailable` | Exact User Goal | Plain-language external error | Retry, edit goal |
| Required evidence unavailable | 422 `RecoveryState` with `no_match` when a candidate is ineligible; 502 `github_unavailable` when retrieval fails externally | Exact User Goal | No-match or external error | Edit/refine or retry |
| No eligible candidates | 422 `RecoveryState` with `no_match` | Exact User Goal | No-match guidance | Edit, refine, resubmit |
| Fewer than three eligible candidates | 422 `RecoveryState` with `no_match` | Exact User Goal | No-match guidance | Edit, refine, resubmit |
| Setup information insufficient after successful repository access | 422 `RecoveryState` with `insufficient_setup` | Exact User Goal and selected agent context | Agent Dock recovery | Back, choose another skill, edit/refine goal |
| Invalid or stale selected skill | 422 `RecoveryState` with `github_unavailable` when its canonical public GitHub resource cannot be retrieved | Exact User Goal and selected agent context | Agent Dock recovery | Retry, back, choose another skill |

The frontend MUST preserve the exact User Goal for every recovery state and MUST render an explanation plus only the allowed recovery actions.

## 12. Security / trust rules

- The User Goal MUST be treated as untrusted text and rendered safely; it MUST NOT be interpreted as markup, executable instruction, repository command, or evidence.
- GitHub repository content and documentation MUST be treated as external, untrusted evidence.
- Retrieved documentation MUST remain reference material; it MUST NOT silently override product rules or cause command execution.
- GitHub credentials MUST remain server-side and MUST NOT be sent to the frontend, logged as evidence, or exposed in errors.
- Repository content MUST NOT trigger automatic command execution, script evaluation, redirects, or permission changes.
- The application MUST NOT expose raw dependency errors to the user.

## 13. Implementation boundaries

- The browser frontend MUST own frozen UI presentation, focus/keyboard behavior, goal retention, and rendering of contracts returned by the application.
- The application server MUST own discovery, canonicalization/deduplication, evidence retrieval/cache use, eligibility, scoring/ranking, explanation assembly, guidance preparation, and recovery decisions.
- GitHub access MUST remain behind the application server boundary.
- The in-process cache MUST remain internal to the application server; it MUST NOT be modeled or implemented as a separate service.
- The implementation MAY use modules inside the approved frontend or application-server containers, but it MUST NOT create a new runtime boundary without approval.

## 14. Verification contract

- Contract tests MUST validate `docs/openapi.yaml`, both operation request/response behavior, and recovery schemas.
- Discovery tests MUST prove bounded query construction, the three-term limit, public-only selection, canonical identity formation, lexical sort, and deterministic deduplication.
- Eligibility tests MUST prove each required-field failure is ineligible and optional evidence does not become an eligibility gate.
- Scoring tests MUST prove Goal Fit and Task Coverage against known corpora and expected numeric values.
- Ranking tests MUST prove the tie-break order and exactly-three success behavior.
- Recovery tests MUST prove fewer-than-three, no-match, vague goal, required-evidence failure, and GitHub-unavailable behavior with the exact goal retained.
- Missing-evidence tests MUST prove absent optional fields stay absent and visibly identified as missing.
- Command-safety tests MUST prove only the derived canonical clone command and source-backed safe commands can be displayed, and that no command executes.
- Guidance tests MUST prove successful Add → Invoke → Apply output, agent-source limits, and insufficient-setup recovery.
- UI checks MUST prove the frozen initial, matching, results, detail, Agent Dock, vague, no-match, and external-error states; keyboard submission; visible focus; copy feedback; and responsive behavior.
- Verification evidence MUST be recorded under `evidence/` before implementation is considered complete.

## 15. Definition of Done

Skill Matcher V1 is not done until:

- OpenAPI contract validation and contract tests pass.
- Required automated behavior tests pass.
- Deterministic ranking rules pass approved known examples.
- Recovery, missing-evidence, and command-safety tests pass.
- Frozen UX state checks pass.
- No product invariant is violated.
- No unsupported infrastructure or architecture has been introduced.
- Reproducible verification evidence is recorded under `evidence/`.
- The deterministic lexical and evidence-band rules in this contract have passing fixture tests.
