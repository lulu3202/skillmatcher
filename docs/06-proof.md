# Proof Plan — Skill Matcher V1

## Evidence standard

Every case below is PASS only when the stated output is produced by automated tests or an equivalent reproducible check. Capture resulting test output, screenshots, and any controlled live-GitHub evidence under `evidence/`. A live GitHub response alone is never proof of deterministic behavior.

## Shared deterministic fixture corpus

Use `retrievedAt = 2026-10-09T00:00:00Z` for score fixtures.

| Fixture | Canonical identity | Candidate corpus / `SKILL.md` | Evidence | Expected eligibility |
|---|---|---|---|---|
| Alpha | `acme/alpha:SKILL.md` | Corpus: `accessible react dashboard`; `SKILL.md`: `accessible react` | 1,500 stars; 220 forks; Organization; `pushed_at` 2026-08-25 | Eligible |
| Beta | `acme/beta:SKILL.md` | Corpus: `accessible dashboard`; `SKILL.md`: `dashboard` | stars/forks missing; User; `pushed_at` missing | Eligible |
| Gamma | `acme/gamma:SKILL.md` | Corpus: `react dashboard`; `SKILL.md`: `react dashboard` | 12 stars; 1 fork; User; `pushed_at` 2025-07-01 | Eligible |
| Required-failure | `acme/missing:SKILL.md` | No retrievable `SKILL.md` | Any optional evidence | Ineligible |

For the `accessible`, `react`, `dashboard` goal, Alpha scores Goal Fit `40`, Task Coverage `20`, GitHub Credibility `17`, Maintenance `8`, Total `85`. Beta scores `27 + 10 + 10 + 5 = 52`. Gamma scores `27 + 20 + 5 + 0 = 52`.

## Required proof and evaluation cases

| ID | Invariant / fixture | PASS criteria | FAIL criteria |
|---|---|---|---|
| P-01 | Tokenization fixture A | `Build an accessible React dashboard` retains `accessible`, `react`, `dashboard`. | Any build/article term, altered raw goal, or different order remains. |
| P-02 | Tokenization fixture B | `Create a Python API for PDF extraction` retains `python`, `api`, `pdf`. | `create`, `for`, or a fourth term is retained. |
| P-03 | Tokenization fixture C | `Help me make a Next.js authentication flow` retains `next`, `authentication`, `flow`. | `js`, generic request terms, stems, or synonyms appear. |
| P-04 | Query construction and bounds | Each retained term produces `<term> path:/(^|\/)SKILL\.md$/`; at most 3 searches, 10 results/search, 30 fetched candidates. | `filename:`, an unbounded query, or wrong path qualifier appears. |
| P-05 | Canonicalization/deduplication | Equivalent search hits collapse to one `owner/repository:path-to-SKILL.md`, then identities sort lexically. | Duplicate candidate reaches eligibility or order changes between runs. |
| P-06 | Required eligibility | A private, archived, inaccessible, identity-incomplete, or no-`SKILL.md` candidate is ineligible with a reason. | Any required-field failure is scored/ranked. |
| P-07 | Optional evidence | Missing stars/forks/README/pushed time does not make an otherwise valid candidate ineligible. | Optional evidence is an eligibility gate. |
| P-08 | Goal Fit | Alpha produces `40/40`; Beta and Gamma each produce `27/40`. | Corpus matching, rounding, or factor maximum differs. |
| P-09 | Task Coverage | Alpha produces `20/30`; Beta `10/30`; Gamma `20/30`. | README/repository text is counted as Task Coverage. |
| P-10 | GitHub Credibility measured bands | Alpha produces `17/20` from `8 + 5 + 4`; Gamma produces `5/20` from `2 + 1 + 2`. | A band boundary or owner type maps differently. |
| P-11 | GitHub Credibility missing bands | Beta produces `10/20` from neutral `5 + 3` plus User `2`, with stars/forks visibly missing. | Missing evidence displays as zero or as measured evidence. |
| P-12 | Maintenance measured band | Alpha is 45 UTC days old and produces `8/10`; Gamma produces `0/10`. | Age boundary or UTC-day calculation differs. |
| P-13 | Maintenance missing band | Beta produces neutral `5/10` and missing maintenance evidence. | Missing timestamp becomes measured 0 or is hidden. |
| P-14 | Total score | Alpha, Beta, Gamma totals are 85, 52, 52 respectively. | A total is not the sum of four factors. |
| P-15 | Tie-break: Goal Fit | Equal-total candidates rank higher Goal Fit first. | Lower Goal Fit wins due to identity or evidence. |
| P-16 | Tie-break: credibility then identity | With equal totals and Goal Fit, higher credibility wins; if still tied, lexical canonical identity wins. | Tie resolution depends on input order. |
| P-17 | Exactly-three success | Exactly three eligible fixtures return HTTP 200 and three ranks 1–3. | Fewer/more results, duplicate rank, or wrong response shape. |
| P-18 | Fewer-than-three recovery | Two eligible fixtures return 422 `no_match`, retain exact goal, and return no partial recommendations. | One/two recommendations are returned. |
| P-19 | Vague-goal recovery | A goal with no retained terms returns 400 `vague_goal`, exact goal, explanation, and refine/edit action. | Query is issued or goal changes. |
| P-20 | Match GitHub outage | Discovery/evidence retrieval failure returns 502 `github_unavailable` and retains the exact goal. | 422 `insufficient_setup`, raw dependency error, or changed goal. |
| P-21 | Missing-evidence response | `GitHubEvidence.missingFields` and UI labels identify unavailable optional fields plus `retrievedAt`. | Missing fields are omitted, zeroed, or marked verified. |
| P-22 | Derived command safety | Public `owner/repo` can yield only `git clone https://github.com/owner/repo.git` as a derived command. | Any package-manager, agent-CLI, curl/wget, or executable derived command appears. |
| P-23 | Source-backed command safety | Only source-linked canonical clone or safe relative `cd` is displayed; unsafe command text is rejected from guidance. | Pipelines, redirects, variables, scripts, exports, or permission changes are displayed. |
| P-24 | Insufficient setup | Successful repository access with no valid source-backed Add → Invoke → Apply evidence returns 422 `insufficient_setup`. | Guidance is invented or outage semantics are used. |
| P-25 | Guidance GitHub outage | Guidance-time external retrieval failure returns 502 `github_unavailable`. | It is conflated with insufficient setup. |
| P-26 | `matchGoal` OpenAPI behavior | Valid success/recovery payloads conform to `MatchRequest`, `MatchResult`, and `RecoveryState`. | Extra/missing fields, wrong status, or contract drift. |
| P-27 | `getGuidance` OpenAPI behavior | Guidance and all 400/422/502 recovery payloads conform to OpenAPI. | Missing `setupCommand`, wrong enum, or unsupported response. |
| P-28 | Frozen initial/matching UX | Labelled goal field, Cmd/Ctrl+Enter, visible focus, exact-goal matching rail, and live announcement work. | Placeholder-only label, keyboard regression, or isolated spinner. |
| P-29 | Results/detail UX | Shared score comparison, #1 treatment, evidence strips, detail rationale, and exact goal survive navigation. | Equal SaaS cards, lost goal, color-only score, or hidden evidence. |
| P-30 | Recovery/Agent Dock/mobile UX | Vague/no-match/error recovery, accessible agent tabs, copy feedback, focus return, and mobile stack match frozen design. | Inaccessible tabs, missing recovery action, absent copy feedback, or mobile regression. |

## Held-out evaluation set

Do not use these cases to shape the initial implementation fixtures. Run them only after P-01 through P-30 pass.

| ID | Input / fixture | PASS criteria |
|---|---|---|
| H-01 | `Design a secure TypeScript webhook handler` with corpus matches `typescript`, `webhook`, `handler` and a 31-day `pushed_at`. | Exact first-three term order, correct path queries, and Maintenance `8/10`. |
| H-02 | Equal-total candidates: `beta/skill:SKILL.md` and `alpha/skill:SKILL.md`, both Goal Fit 30 and Credibility 15. | `alpha/skill:SKILL.md` ranks first by canonical identity. |
| H-03 | Valid candidate with stars, forks, and `pushed_at` unavailable but a retrievable `SKILL.md`. | Candidate remains eligible; neutral factor allocations are visible as missing, not measured. |

## Evidence packaging

- Save automated test output with case IDs under `evidence/`.
- Save API contract-validation output under `evidence/`.
- Save desktop and mobile screenshots for P-28 through P-30 under `evidence/`.
- Record any live GitHub check separately with retrieval time and do not use it to change expected fixture outputs.
