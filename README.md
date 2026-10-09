# Skill Matcher

Skill Matcher accepts a development goal and returns exactly three ranked public-GitHub skill recommendations. Each recommendation includes a deterministic score, a readable explanation, and available GitHub evidence. A selected skill can be handed off to Claude Code or Codex with safe, display-only setup guidance and a starter prompt.

## V1 scope

- Public GitHub discovery of `SKILL.md` files.
- Deterministic lexical matching, eligibility, scoring, ranking, and recovery states.
- GitHub evidence is retrieved server-side and cached only in process memory for 30 minutes.
- No authentication, database, persistent storage, queue, model service, curated catalog, or command execution.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

`GITHUB_TOKEN` (optional) — server-side GitHub token for higher Code Search capacity. Do not expose it to the browser or commit it.

## Verify

```bash
npm run typecheck
npm run lint
npm test
npm run validate:openapi
npm run build
```

## Project navigation

- [Intent](docs/01-intent.md) and [design](docs/02-design.md)
- [Interaction contracts](docs/03-interaction-contracts.md), [payload contracts](docs/03-payload-contracts.md), and [runtime sequence](docs/03-interaction-contract-flow.md)
- [Architecture](docs/03-architecture.md), [C4 Container view](diagrams/architecture/container.html), and [OpenAPI](docs/openapi.yaml)
- [Build Contract](docs/04-build-contract.md), [plan](docs/05-plan.md), and [proof plan](docs/06-proof.md)

## CI

GitHub Actions runs dependency installation, type checking, linting, tests, OpenAPI validation, and the production build on pushes and pull requests targeting the primary branch.
