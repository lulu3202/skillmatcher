export type Agent = "Claude Code" | "Codex";

export type ScoreBreakdown = { goalFit: number; taskCoverage: number; githubCredibility: number; maintenance: number; totalScore: number };
export type GitHubEvidence = { repository: string; community?: string; maintenance?: string; stewardship?: string; retrievedAt: string; missingFields: string[] };
export type Recommendation = { selectedSkillId: string; rank: 1 | 2 | 3; skillName: string; repositoryUrl: string; totalScore: number; matchReason: string; comparativeReason: string; githubEvidence: GitHubEvidence; scoreBreakdown: ScoreBreakdown };
export type RecoveryState = { retainedUserGoal: string; condition: "vague_goal" | "no_match" | "github_unavailable" | "insufficient_setup"; explanation: string; allowedActions: string[] };
export type MatchResult = { userGoal: string; recommendations: Recommendation[] };
export type SetupGuidance = { agent: Agent; addInstruction: string; invokeInstruction: string; applyInstruction: string; setupCommand: string; starterPrompt: string };

export function isRecovery(value: unknown): value is RecoveryState {
  return Boolean(value && typeof value === "object" && "condition" in value);
}
