# Design — Signal Garden

## Status and boundary

Signal Garden is the approved visual direction for Skill Matcher’s disposable prototype. It defines the experience before architecture and production implementation. It does not select a technology stack or authorize backend code, real GitHub integration, authentication, persistence, or other production logic.

## Product posture

Skill Matcher is an evidence-forward scorecard for developers and technical PMs choosing among exactly three credible, public GitHub coding-agent skills.

The system is playful, smart, modern, and softly cute without becoming childish. Warm, rounded surfaces make the product approachable; bold hierarchy makes rank and evidence decisive. Its priority order is:

1. Compare the top three skills confidently.
2. Understand why each ranked where it did.
3. Take the selected skill into Claude Code or Codex.

## Visual personality

Signal Garden combines soft, friendly developer-product polish with editorial rank treatment. The warm neutral canvas is calm. Pink and purple are branded energy at moments of choice. Dark ink gives evidence and technical content authority.

Softness belongs to containers, spacing, and feedback. Boldness belongs to rank, score, and type hierarchy. Green is reserved exclusively for semantic verified or successful states.

Avoid generic equal-weight SaaS cards, broad rainbow palettes, acid green, novelty type, excessive chips, nested cards, and decorative gradients that obscure evidence.

## Color system

| Role | Value | Use |
|---|---|---|
| Canvas | #FBF8FC | Primary warm off-white page background |
| Quiet background | #F5F0F7 | Grouped regions and inactive controls |
| Surface | #FFFDFE | Cards, forms, and panels |
| Selected surface | #FAF5FF | Selected or #1 recommendation |
| Dark ink | #241B2B | Primary text, dark controls, code-shell contrast |
| Muted ink | #756B7C | Secondary copy and explanatory labels |
| Brand pink | #E65A9B | Primary branded emphasis and actions |
| Brand purple | #7456E8 | Branded emphasis, selected tabs, score comparison |
| Brand gradient | #F5A7CF to #A78BFA | Selective #1 rank and feature emphasis |
| Verified / success | #287764 | Confirmed GitHub evidence and successful actions only |
| Verified soft | #E9F5EF | Low-emphasis verified-state background |
| Border | #E8DDEA | Dividers and surface boundaries |
| Focus ring | #7456E8 | Keyboard focus, paired with a non-color outline |

Pink and purple are the only expressive brand colors. Use the gradient only for the #1 rank medallion, selected-score treatment, and at most one page-level emphasis area. Never use green to convey rank, score, or primary action meaning. Every color signal also needs text, iconography, position, or a label.

## Typography

| Role | Family | Use |
|---|---|---|
| UI and display | Geist | All interface copy, headings, explanatory text, and controls |
| Technical mono | IBM Plex Mono | Repository names, evidence values, scores, commands, and technical metadata |

No additional display family is part of this system without a future explicit decision.

Use Geist with confident but readable display scale for the goal statement and selected-skill title. Use IBM Plex Mono wherever the content should feel inspectable and measured. Headings must progress sequentially, preserve a line-height of at least 1.1, and avoid extreme negative tracking.

## Spacing and density

Signal Garden uses medium density: enough air to make evidence scannable without becoming an empty marketing page.

- Base unit: 4px; common steps: 8, 12, 16, 24, 32, 48, and 64px.
- Card and panel radius: 16px; input/control radius: 12px; pills only for compact status tags.
- Card padding: 20–24px desktop and 16–20px mobile.
- Use borders, aligned grids, and whitespace for grouping. Tinted shadows are restrained and never the main hierarchy signal.

## Layout principles

The product is an Operate surface: scanability and decision confidence outrank decoration.

- Keep the exact entered goal visible after submission; it is the context for every recommendation.
- Use a shared vertical ranking rail, not three visually equal cards.
- Give #1 a distinct selected treatment without removing the ability to compare all three.
- Make rank and score visible before explanatory text.
- Use editorial asymmetry only where it makes the top recommendation or selected detail clearer.
- On the detail view, show ranking rationale and score evidence before setup guidance.

## Goal entry

The initial screen has one persistent, labelled natural-language goal field, concise help text, and an explicit primary action such as “Find skills.”

- Do not use placeholder text as the label.
- Retain a visible focus ring: purple outer ring plus a high-contrast border/outline.
- Support keyboard submission. For a multi-line field, show the hint “Cmd/Ctrl + Enter to search” and retain normal Enter newline behaviour.
- Provide visible hover, pressed, disabled, and loading states for the submit action.

## Recommendation rail and cards

### Shared comparison treatment

Each of the exactly three recommendation rows contains:

- ordinal rank and skill name;
- score plus the text “match score out of 100”;
- an aligned score bar on a shared 0–100 scale;
- a textual comparison such as “8 points above #2,” where applicable;
- concise match reason;
- structured GitHub evidence strip;
- a clear select/open affordance.

The shared baseline, numeric score, ordinal rank, and comparative text make ranking understandable without relying on color or bar length.

### Recommendation #1

The top match receives:

- a larger pink-to-purple gradient rank medallion;
- a softly tinted selected surface;
- explicit “Top match” text;
- an editorial score block with numerator, denominator, and comparative lead;
- a more prominent open action and whole-row activation.

The gradient indicates selection, not correctness. Rank, score, and label carry the meaning independently.

### Recommendations #2 and #3

Use neutral surfaces and outlined rank markers while retaining the same score scale, evidence quality, and interaction access as #1. Lower rank never means hidden detail or reduced usability.

## Score explanation

Near results, show this concise explanation:

> Scores combine goal fit, task coverage, GitHub credibility, and maintenance signals. Each recommendation shows the evidence behind its score.

In detail, show each score factor with a label, numerator/denominator, proportional bar, and plain-language contribution. The system must explain why #1 outranks #2 and #3, not merely list the factors.

## GitHub evidence strip

GitHub signals are a structured evidence strip, never an ungrouped collection of chips.

| Group | Example | Purpose |
|---|---|---|
| Community | 18.4k stars, 1.9k forks | Public adoption |
| Maintenance | Updated 4 days ago | Recent activity |
| Stewardship | Maintained by Vercel | Ownership or authority |

Use IBM Plex Mono for values and Geist for labels. Keep these groups consistent across all recommendations. Show freshness/source context where possible, such as “GitHub signals checked recently.” A verified fact may use green beside the word “Verified”; ordinary evidence remains ink and neutral. State that credibility informs the score but does not alone determine relevance.

## Buttons, forms, and focus

- Primary actions use pink or purple fill with accessible contrast; secondary actions use outline or quiet-surface treatment.
- Do not duplicate CTA intent.
- Copy actions name their output: “Copy setup command” and “Copy starter prompt.”
- Every interactive control has visible keyboard focus, hover, pressed, disabled, and loading states.
- Inputs keep labels, high-contrast help text, associated error text, and a visible focus ring.
- All interactions work by keyboard. Touch targets are at least 44×44px where feasible.
- Announce matching, results, selection, tab changes, copy success, errors, and recovery using appropriate live regions.

## Agent Dock

The Agent Dock is the purposeful handoff from recommendation to action. It contains an accessible segmented control for Claude Code and Codex.

Each tab uses the same labelled three-step runbook:

1. **Add** — relevant setup command or directory action.
2. **Invoke** — example request that explicitly selects the skill.
3. **Apply** — a copyable starter prompt tailored to the exact entered goal.

The selected tab uses branded pink/purple treatment plus text and selected-state semantics; color is never the only cue. Steps are numbered and visually sequential. Commands and prompts are individually copyable. On success, feedback is explicit, for example “Setup command copied,” and may use semantic green.

## Code and command blocks

| Role | Value |
|---|---|
| Background | #251C31 |
| Text | #FBF5FF |
| Muted text | #CDBDDA |
| Border | #3A2C49 |

Code blocks use IBM Plex Mono, comfortable line-height, horizontal-overflow handling, a descriptive label, and a copy button. Commands never stand alone: surrounding Agent Dock steps explain intent.

## Required interaction states

### Initial

Show the labelled goal field, keyboard hint, and optional examples. Do not imply results before submission.

### Matching / analysis

Preserve the exact submitted goal. Show an honest prototype-safe status such as “Comparing eligible GitHub skills…” with a ranked-rail skeleton, not an isolated spinner. Announce that matching has begun.

### Results

Show exactly three ranked recommendations, preserve the submitted goal verbatim, explain score and credibility, and highlight the top match without hiding alternatives.

### Vague input

Keep the entered text intact. Explain what improves results: task, framework, constraint, or desired outcome. Offer optional examples and let the user edit or resubmit.

### No match

State that no eligible GitHub skills match the goal. Explain that the catalog is limited to credible public GitHub repositories. Offer actionable refinement choices: name a framework, generalize the task, or remove an uncommon constraint. Do not invent a fourth result.

### Error and recovery

Use plain language, preserve the goal, and offer Retry and Edit actions. Do not blame the user or expose raw errors. In the prototype this remains a static/mock state and does not imply a real network request.

### Detail and Agent Dock

Keep a clear back-to-results action. Announce selection and tab changes. Keep selected rank, score, and evidence visible before or alongside setup. Return focus predictably after back navigation.

## Responsive behaviour

### Desktop and tablet

Use the full rail: rank, identity/reason, evidence strip, and aligned score area. #1 may use a broader selected surface without breaking the shared score scale. The Agent Dock can sit beside rationale when space permits.

### Mobile

- Keep rank and numeric score at the leading edge of each row.
- Stack identity, reason, and evidence beneath; never hide score explanation.
- Use compact labelled evidence facts, not horizontally scrolling chip piles.
- Make detail a deliberate drill-in view with a persistent back action.
- Stack Agent Dock steps vertically; tabs remain keyboard accessible and touch-friendly.
- Avoid decorative detail headers that push rank evidence below the fold.

## Accessibility rules

- Meet WCAG 2.2 AA contrast for text, controls, focus indicators, help, and error content.
- Rank, score, verified, selected, and success states always use text or structure in addition to color.
- Respect reduced-motion preferences; matching animation is subtle and optional.
- Use semantic headings, labels, buttons, and live regions.
- Preserve logical focus order through goal entry, results, detail, Agent Dock, and copy actions.
- Avoid icon-only controls without accessible names.
- Keep the exact entered goal readable throughout results and detail.
