# Skill Matcher — Intent / Spec

## Problem
Developers discover useful open-source coding-agent skills on GitHub, but often do not know:

- which repositories are trustworthy and actively used
- which skills best fit their current development goal
- why one skill is a better match than another
- how to set up and use the selected skill with Claude Code and Codex

## User
Developer or technical PM using Claude Code or Codex who wants to find reliable, relevant skills for a development task.

## V1 Outcome
Given a natural-language development goal, Skill Matcher discovers eligible public GitHub skill repositories and returns exactly the top 3 matches.

Each recommendation must include:

- repository / skill name
- match score
- why it matches the user's goal
- why it received that score
- relevant GitHub popularity / credibility signals
- setup instructions for Claude Code
- setup instructions for Codex
- a starter prompt for using the skill

## Requirements

REQ-01 — Goal Input  
User can describe a development goal in natural language.

REQ-02 — GitHub-Only Skill Sources  
Skill Matcher recommends only eligible open-source skills hosted in public GitHub repositories.

Eligible repositories must meet the credibility and popularity criteria defined for V1. The exact measurable criteria will be specified in the Architecture and Proof stages.

REQ-03 — Top 3 Ranking  
Skill Matcher returns exactly the three highest-ranked eligible skills for the user's goal.

REQ-04 — Transparent Score  
Every recommendation receives a visible score.

REQ-05 — Full Recommendation Explanation  
Every recommended skill must explain:

- why it matches the user's goal
- which factors contributed to its score
- why it ranked where it did relative to the other recommendations

REQ-06 — GitHub Evidence  
Every recommendation displays the GitHub evidence used to establish its credibility and popularity.

REQ-07 — Claude Code Setup  
Every selected skill includes instructions for setting it up and using it with Claude Code.

REQ-08 — Codex Setup  
Every selected skill includes instructions for setting it up and using it with Codex.

REQ-09 — Starter Prompt  
Every selected skill includes a copyable starter prompt for applying it to the user's repository.

## Non-goals

V1 will not:

- recommend closed-source or non-GitHub skills
- return more than three recommendations
- automatically install a skill
- modify the user's repository
- require authentication
- execute the recommended skill on the user's behalf
