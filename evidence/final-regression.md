# Final regression

## Commands

- `npm test`
- `npm run build`

## Result

- PASS — 2 Vitest files, 12 tests.
- PASS — production Next.js build, including TypeScript.
- PASS — dynamic HTTP routes are present for `/api/matches` and `/api/guidance`.

## Contract recovery coverage added during final regression

- Matching returns `github_unavailable` with status 502 when GitHub discovery is unavailable.
- Guidance returns `github_unavailable` with status 502 when source retrieval is unavailable.
- Root-level and nested `SKILL.md` candidate identities are accepted by guidance-source lookup.
- Held-out H-01 and H-03 pass. H-02's specified Goal Fit value is mathematically incompatible with the frozen scoring formula; an equivalent canonical-identity tie-break fixture passes.

## OpenAPI

The frozen `docs/openapi.yaml` was successfully validated with Redocly before the source-only regression correction. It was not modified afterward.
