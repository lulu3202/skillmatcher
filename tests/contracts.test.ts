import { describe, expect, it, vi } from "vitest";
import { discoverCandidates } from "../src/lib/github";
import { POST as matchPost } from "../src/app/api/matches/route";
import { POST as guidancePost } from "../src/app/api/guidance/route";

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });
const encoded = (value: string) => Buffer.from(value).toString("base64");

describe("contract and recovery behavior", () => {
  it("returns vague-goal recovery without calling GitHub", async () => {
    const response = await matchPost(new Request("http://local/api/matches", { method: "POST", body: JSON.stringify({ userGoal: "Help me" }) }));
    expect(response.status).toBe(400); expect(await response.json()).toMatchObject({ retainedUserGoal: "Help me", condition: "vague_goal" });
  });
  it("returns invalid guidance recovery without calling GitHub", async () => {
    const response = await guidancePost(new Request("http://local/api/guidance", { method: "POST", body: JSON.stringify({ selectedSkillId: "bad", selectedAgent: "Codex", retainedUserGoal: "Keep this exact goal" }) }));
    expect(response.status).toBe(422); expect(await response.json()).toMatchObject({ retainedUserGoal: "Keep this exact goal", condition: "insufficient_setup" });
  });
  it("uses three bounded path-qualified searches and deduplicates canonical candidates", async () => {
    const original = global.fetch; const calls: string[] = [];
    global.fetch = vi.fn(async (input: string | URL | Request) => { const url = String(input); calls.push(url); if (url.includes("/search/code")) return json({ items: [{ repository: { full_name: "Acme/One" }, path: "SKILL.md" }, { repository: { full_name: "acme/one" }, path: "SKILL.md" }, { repository: { full_name: "acme/two" }, path: "nested/SKILL.md" }] }); if (url.includes("/repos/Acme/One") || url.includes("/repos/acme/one")) { if (url.includes("/contents/")) return json({ name: "SKILL.md", content: encoded("accessible react dashboard") }); if (url.endsWith("/readme")) return json({ content: encoded("readme") }); return json({ full_name: "acme/one", html_url: "https://github.com/acme/one", stargazers_count: 100, forks_count: 10, pushed_at: "2026-10-01T00:00:00Z", owner: { login: "acme", type: "Organization" } }); } if (url.includes("/repos/acme/two")) { if (url.includes("/contents/")) return json({ name: "SKILL.md", content: encoded("accessible react dashboard") }); if (url.endsWith("/readme")) return json({ content: encoded("readme") }); return json({ full_name: "acme/two", html_url: "https://github.com/acme/two", archived: true, owner: { login: "acme", type: "Organization" } }); } return json({}, 404); }) as typeof fetch;
    const found = await discoverCandidates("Build an accessible React dashboard"); global.fetch = original;
    expect(calls.filter((url) => url.includes("/search/code"))).toHaveLength(3); expect(calls.filter((url) => url.includes("/search/code")).every((url) => url.includes("path%3A%2F(%5E%7C%5C%2F)SKILL%5C.md%24%2F") && url.includes("per_page=10"))).toBe(true); expect(found.map((item) => item.id)).toEqual(["acme/one:SKILL.md"]);
  });
  it("maps an unavailable GitHub dependency to the approved matching recovery", async () => {
    const original = global.fetch;
    global.fetch = vi.fn(async () => json({ message: "unavailable" }, 503)) as typeof fetch;
    try {
      const response = await matchPost(new Request("http://local/api/matches", { method: "POST", body: JSON.stringify({ userGoal: "Build an unusual observability console" }) }));
      expect(response.status).toBe(502);
      expect(await response.json()).toMatchObject({ condition: "github_unavailable", retainedUserGoal: "Build an unusual observability console" });
    } finally { global.fetch = original; }
  });
  it("maps an unavailable guidance source to the approved external-dependency recovery", async () => {
    const original = global.fetch;
    global.fetch = vi.fn(async () => json({ message: "unavailable" }, 503)) as typeof fetch;
    try {
      const response = await guidancePost(new Request("http://local/api/guidance", { method: "POST", body: JSON.stringify({ selectedSkillId: "acme/skill:SKILL.md", selectedAgent: "Codex", retainedUserGoal: "Build a dashboard" }) }));
      expect(response.status).toBe(502);
      expect(await response.json()).toMatchObject({ condition: "github_unavailable", retainedUserGoal: "Build a dashboard" });
    } finally { global.fetch = original; }
  });
});
