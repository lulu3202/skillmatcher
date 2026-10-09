# Runtime interaction sequence

The payload fields for the named contracts below are canonical in [03-payload-contracts.md](03-payload-contracts.md). This sequence shows runtime ordering only, so that field definitions do not drift across two artifacts.

~~~mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Application as Skill Matcher Application
    participant GitHub as GitHub / External Evidence

    rect rgb(250,244,255)
        Note over User,Frontend: Match
        User->>Frontend: User Goal
        Frontend->>Application: MatchRequest
        Application->>GitHub: CandidateSkill discovery request
        GitHub-->>Application: CandidateSkill + GitHubEvidence
        Note over Application: Normalize, EligibilityResult, ScoreBreakdown, rank
        Application-->>Frontend: Recommendation[] (exactly 3)
        Frontend-->>User: Ranked results
    end

    rect rgb(255,248,245)
        Note over User,Frontend: Open recommendation
        User->>Frontend: SelectedSkill
        Frontend->>Application: SelectionContext
        Application-->>Frontend: Recommendation + ScoreBreakdown + GitHubEvidence
        Frontend-->>User: Skill detail
    end

    rect rgb(245,250,255)
        Note over User,Frontend: Claude Code / Codex guidance
        User->>Frontend: selectedAgent
        Frontend->>Application: GuidanceRequest
        Application->>GitHub: setup-information request when required
        GitHub-->>Application: available setup information
        Application-->>Frontend: SetupGuidance
        Frontend-->>User: Agent Dock
    end

    rect rgb(255,246,246)
        Note over User,Frontend: Recovery
        alt vague goal
            Application-->>Frontend: RecoveryState
        else no eligible match or fewer than 3
            Application-->>Frontend: RecoveryState
        else required GitHub evidence unavailable
            Application-->>Frontend: RecoveryState
        else setup information insufficient
            Application-->>Frontend: RecoveryState
        end
        Frontend-->>User: explanation + allowed action
        User->>Frontend: retry / edit / refine with retained User Goal
    end
~~~

## Approved V1 decisions

This sequence is governed by the frozen [architecture](03-architecture.md), [interaction contracts](03-interaction-contracts.md), [payload contracts](03-payload-contracts.md), and [OpenAPI contract](openapi.yaml). It does not carry open human-decision markers.
