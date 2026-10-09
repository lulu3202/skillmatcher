# Clean repository manifest

This manifest is the explicit allowlist for the final Skill Matcher repository. It is prepared before staging; no broad staging command is permitted.

## A. Final — will be pushed

- `.env.example`, `.github/workflows/ci.yml`, `.gitignore`, `eslint.config.mjs`, `next.config.ts`, `next-env.d.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, and `vitest.config.ts`
- `README.md` and `AGENTS.md`
- `src/` and `tests/`
- `docs/01-intent.md`, `docs/02-design.md`, `docs/03-interaction-contracts.md`, `docs/03-payload-contracts.md`, `docs/03-interaction-contract-flow.md`, `docs/03-architecture.md`, `docs/openapi.yaml`, `docs/04-build-contract.md`, `docs/05-plan.md`, and `docs/06-proof.md`
- `diagrams/architecture/container.html`, `diagrams/architecture/container.json`, and `diagrams/architecture/README.md`
- `tickets/SM-001-application-shell.md` through `tickets/SM-007-integration-and-product-assurance.md`
- `evidence/final-build-report.md`, `evidence/final-regression.md`, `evidence/wave-1-summary.md`, `evidence/wave-2-summary.md`, and `evidence/delivery/`

## B. Historical / superseded — retained locally, excluded

- `experiments/`
- `.agents/` project skills
- `prototype/` disposable frozen prototype
- `docs/03-design.md`, `docs/07-evidence.md`, and `docs/08-learnings.md`
- All non-container files under `diagrams/architecture/`, the rendered `diagrams/interaction-contract-flow.*`, and `diagrams/publication/`

## C. Generated / temporary — excluded

- `.next/`, `node_modules/`, `.tools/`, `.codex/`, `.impeccable/`
- Local screenshots, generated visual checks, old logs, route captures, and per-ticket evidence under `evidence/SM-*/`

## D. Secret / local — never push

- `.env`, `.env.*`, credentials, tokens, private keys, and certificate files
- `GITHUB_TOKEN` is server-only and is not represented by any checked-in value.
