import type { GitHubEvidence, Recommendation, ScoreBreakdown } from "./contracts";

export type OwnerType = "Organization" | "User";
export type Candidate = { id: string; name: string; repository: string; repositoryUrl: string; skillPath: string; skillText: string; readmeText: string; description?: string; topics?: string[]; stars?: number; forks?: number; pushedAt?: string; owner?: string; ownerType?: OwnerType; retrievedAt: string };
export const STOP_WORDS = new Set(["a", "an", "the", "and", "or", "but", "for", "to", "of", "in", "on", "at", "with", "from", "by", "into", "about", "as", "is", "are", "be", "build", "create", "make", "help", "need", "want", "please", "me", "my", "we", "our", "your", "develop", "implement", "add", "use"]);
const tokens = (text: string) => text.toLocaleLowerCase().match(/[\p{L}\p{Nd}]+/gu) ?? [];

export function goalTerms(goal: string): string[] {
  const seen = new Set<string>(); const output: string[] = [];
  for (const token of tokens(goal)) { if ([...token].length < 3 || STOP_WORDS.has(token) || seen.has(token)) continue; seen.add(token); output.push(token); if (output.length === 3) break; }
  return output;
}
export const codeSearchQuery = (term: string) => `${term} path:/(^|\\/)SKILL\\.md$/`;
export const canonicalCandidateId = (repository: string, path: string) => `${repository.toLowerCase()}:${path}`;
const wholeMatches = (terms: string[], text: string) => { const source = new Set(tokens(text)); return terms.filter((term) => source.has(term)); };
const credibility = (c: Candidate) => (c.stars === undefined ? 5 : c.stars >= 10_000 ? 10 : c.stars >= 1_000 ? 8 : c.stars >= 100 ? 5 : c.stars >= 10 ? 2 : 0) + (c.forks === undefined ? 3 : c.forks >= 1_000 ? 6 : c.forks >= 100 ? 5 : c.forks >= 10 ? 3 : c.forks >= 1 ? 1 : 0) + (c.ownerType === "Organization" ? 4 : 2);
const maintenance = (c: Candidate) => { if (!c.pushedAt) return 5; const days = Math.max(0, Math.floor((Date.parse(c.retrievedAt) - Date.parse(c.pushedAt)) / 86_400_000)); return days <= 30 ? 10 : days <= 90 ? 8 : days <= 180 ? 5 : days <= 365 ? 2 : 0; };
function toEvidence(c: Candidate): GitHubEvidence { const missingFields = [c.stars === undefined && "stars", c.forks === undefined && "forks", c.ownerType === undefined && "stewardship", c.pushedAt === undefined && "pushed_at"].filter(Boolean) as string[]; return { repository: c.repository, community: c.stars === undefined && c.forks === undefined ? undefined : `${c.stars === undefined ? "Stars missing" : `${c.stars.toLocaleString()} stars`} · ${c.forks === undefined ? "Forks missing" : `${c.forks.toLocaleString()} forks`}`, maintenance: c.pushedAt ? `Pushed ${c.pushedAt}` : undefined, stewardship: c.ownerType ? `${c.ownerType}: ${c.owner ?? "owner"}` : undefined, retrievedAt: c.retrievedAt, missingFields }; }

export function rankCandidates(goal: string, candidates: Candidate[]): Recommendation[] {
  const terms = goalTerms(goal); if (!terms.length) return [];
  const ranked = candidates.flatMap((candidate) => { const matched = wholeMatches(terms, [candidate.name, candidate.description ?? "", ...(candidate.topics ?? []), candidate.skillText, candidate.readmeText].join(" ")); if (!matched.length) return []; const skillMatched = wholeMatches(terms, candidate.skillText); const scoreBreakdown: ScoreBreakdown = { goalFit: Math.round(40 * matched.length / terms.length), taskCoverage: Math.round(30 * skillMatched.length / terms.length), githubCredibility: credibility(candidate), maintenance: maintenance(candidate), totalScore: 0 }; scoreBreakdown.totalScore = scoreBreakdown.goalFit + scoreBreakdown.taskCoverage + scoreBreakdown.githubCredibility + scoreBreakdown.maintenance; return [{ candidate, scoreBreakdown, matched, unmatched: terms.filter((term) => !matched.includes(term)) }]; }).sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore || b.scoreBreakdown.goalFit - a.scoreBreakdown.goalFit || b.scoreBreakdown.githubCredibility - a.scoreBreakdown.githubCredibility || a.candidate.id.localeCompare(b.candidate.id));
  return ranked.slice(0, 3).map((item, index) => ({ selectedSkillId: item.candidate.id, rank: (index + 1) as 1 | 2 | 3, skillName: item.candidate.name, repositoryUrl: item.candidate.repositoryUrl, totalScore: item.scoreBreakdown.totalScore, matchReason: `Matched terms: ${item.matched.join(", ")}. Unmatched terms: ${item.unmatched.length ? item.unmatched.join(", ") : "none"}.`, comparativeReason: index === 0 ? (ranked[1] ? `${item.scoreBreakdown.totalScore - ranked[1].scoreBreakdown.totalScore} points above #2.` : "Highest eligible score.") : `${ranked[0].scoreBreakdown.totalScore - item.scoreBreakdown.totalScore} points behind #1.`, githubEvidence: toEvidence(item.candidate), scoreBreakdown: item.scoreBreakdown }));
}
