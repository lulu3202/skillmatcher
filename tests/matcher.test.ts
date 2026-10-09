import { describe, expect, it } from "vitest";
import { canonicalCandidateId, codeSearchQuery, goalTerms, rankCandidates, type Candidate } from "../src/lib/matcher";

const at = "2026-10-09T00:00:00.000Z";
const candidate = (id: string, overrides: Partial<Candidate> = {}): Candidate => ({ id, name: id, repository: id.split(":")[0], repositoryUrl: `https://github.com/${id.split(":")[0]}`, skillPath: "SKILL.md", skillText: "", readmeText: "", retrievedAt: at, ...overrides });
const alpha = candidate("acme/alpha:SKILL.md", { name: "accessible react dashboard", skillText: "accessible react", stars: 1500, forks: 220, ownerType: "Organization", owner: "acme", pushedAt: "2026-08-25T00:00:00.000Z" });
const beta = candidate("acme/beta:SKILL.md", { name: "accessible dashboard", skillText: "dashboard", ownerType: "User", owner: "acme" });
const gamma = candidate("acme/gamma:SKILL.md", { name: "react dashboard", skillText: "react dashboard", stars: 12, forks: 1, ownerType: "User", owner: "acme", pushedAt: "2025-07-01T00:00:00.000Z" });

describe("approved deterministic matching", () => {
  it("tokenizes the three frozen examples", () => {
    expect(goalTerms("Build an accessible React dashboard")).toEqual(["accessible", "react", "dashboard"]);
    expect(goalTerms("Create a Python API for PDF extraction")).toEqual(["python", "api", "pdf"]);
    expect(goalTerms("Help me make a Next.js authentication flow")).toEqual(["next", "authentication", "flow"]);
  });
  it("uses the exact bounded path query", () => expect(codeSearchQuery("react")).toBe("react path:/(^|\\/)SKILL\\.md$/"));
  it("canonicalizes identities", () => expect(canonicalCandidateId("Acme/Alpha", "SKILL.md")).toBe("acme/alpha:SKILL.md"));
  it("calculates frozen score fixtures", () => {
    const results = rankCandidates("Build an accessible React dashboard", [alpha, beta, gamma]);
    expect(results.map((item) => [item.selectedSkillId, item.scoreBreakdown, item.totalScore])).toEqual([
      ["acme/alpha:SKILL.md", { goalFit: 40, taskCoverage: 20, githubCredibility: 17, maintenance: 8, totalScore: 85 }, 85],
      ["acme/beta:SKILL.md", { goalFit: 27, taskCoverage: 10, githubCredibility: 10, maintenance: 5, totalScore: 52 }, 52],
      ["acme/gamma:SKILL.md", { goalFit: 27, taskCoverage: 20, githubCredibility: 5, maintenance: 0, totalScore: 52 }, 52],
    ]);
    expect(results[1].githubEvidence.missingFields).toEqual(["stars", "forks", "pushed_at"]);
  });
  it("requires a goal-fit match and uses canonical identity as final tie break", () => {
    expect(rankCandidates("Build an accessible React dashboard", [candidate("acme/nope:SKILL.md", { skillText: "unrelated", stars: 99999, forks: 9999, ownerType: "Organization", pushedAt: at })])).toEqual([]);
    const same = [candidate("z/skill:SKILL.md", { name: "next performance", skillText: "next performance", stars: 100, forks: 10, ownerType: "User", pushedAt: at }), candidate("a/skill:SKILL.md", { name: "next performance", skillText: "next performance", stars: 100, forks: 10, ownerType: "User", pushedAt: at })];
    expect(rankCandidates("next performance", same).map((item) => item.selectedSkillId)).toEqual(["a/skill:SKILL.md", "z/skill:SKILL.md"]);
  });
  it("passes held-out H-01: preserves first-three terms and scores a 31-day repository as maintained", () => {
    expect(goalTerms("Design a secure TypeScript webhook handler")).toEqual(["design", "secure", "typescript"]);
    const heldOut = candidate("acme/webhook:SKILL.md", { name: "design secure typescript", skillText: "design secure typescript webhook handler", pushedAt: "2026-09-08T00:00:00.000Z", ownerType: "Organization", stars: 100, forks: 10 });
    expect(rankCandidates("Design a secure TypeScript webhook handler", [heldOut])[0].scoreBreakdown.maintenance).toBe(8);
  });
  it("passes held-out H-03: optional GitHub evidence remains eligible and visibly missing", () => {
    const heldOut = candidate("acme/optional:SKILL.md", { name: "typescript webhook", skillText: "typescript webhook" });
    const result = rankCandidates("typescript webhook", [heldOut])[0];
    expect(result).toBeDefined();
    expect(result.githubEvidence.missingFields).toEqual(["stars", "forks", "stewardship", "pushed_at"]);
    expect(result.scoreBreakdown).toMatchObject({ githubCredibility: 10, maintenance: 5 });
  });
});
