# Local CI validation

The following CI command set was run locally on 2026-10-09 before the clean repository commit.

| Command | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 2 files, 12 tests |
| `npm run validate:openapi` | PASS — Redocly validated `docs/openapi.yaml` |
| `npm run build` | PASS — Next.js production build |

The CI workflow runs this same command sequence after `npm ci`.
