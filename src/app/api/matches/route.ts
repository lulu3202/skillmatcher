import { discoverCandidates, GitHubUnavailableError } from "@/lib/github";
import { goalTerms, rankCandidates } from "@/lib/matcher";
import type { RecoveryState } from "@/lib/contracts";

const recovery = (retainedUserGoal: string, condition: RecoveryState["condition"], explanation: string, allowedActions: string[]) => ({ retainedUserGoal, condition, explanation, allowedActions });
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})); const userGoal = typeof body.userGoal === "string" ? body.userGoal : "";
  if (!goalTerms(userGoal).length) return Response.json(recovery(userGoal, "vague_goal", "Add a task, framework, constraint, or intended outcome so Skill Matcher can compare candidates honestly.", ["refine goal", "edit goal"]), { status: 400 });
  try { const recommendations = rankCandidates(userGoal, await discoverCandidates(userGoal)); if (recommendations.length < 3) return Response.json(recovery(userGoal, "no_match", "Fewer than three eligible public GitHub skills were available for this goal.", ["refine goal", "edit goal", "retry"]), { status: 422 }); return Response.json({ userGoal, recommendations }); }
  catch (error) { if (error instanceof GitHubUnavailableError) return Response.json(recovery(userGoal, "github_unavailable", "GitHub evidence could not be retrieved. Your goal is retained; retry or edit it.", ["retry", "edit goal"]), { status: 502 }); throw error; }
}
