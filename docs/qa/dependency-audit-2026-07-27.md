# Dependency security re-audit — 2026-08-08

## Outcome

- Production dependencies: **0 vulnerabilities**.
- Complete installed dependency tree: **0 vulnerabilities**.
- Dependency tree: valid.
- The modern `brace-expansion` branch is pinned to 5.0.9, the legacy branch resolved to 1.1.18, `js-yaml` resolved to 4.3.1, and PostCSS resolved to 8.5.26 with `nanoid` 3.3.18.

## Change rationale

New compatible patched releases became available after the 2026-07-27 audit. The dependency refresh therefore removes the previous development-only findings without a forced major upgrade:

- `brace-expansion` 5.0.9 addresses the bypass affecting the modern branch.
- `brace-expansion` 1.1.18 addresses the legacy branch while retaining the callable API expected by `minimatch` 3.
- `js-yaml` 4.3.1 addresses the reported quadratic CPU-consumption issue.
- PostCSS 8.5.26 resolves to `nanoid` 3.3.18, removing the production advisory raised against the prior transitive version.

No `npm audit --force` operation was used.

## Evidence

The following checks were run against the updated lockfile:

```powershell
npm audit --omit=dev
npm audit
npm ls brace-expansion minimatch js-yaml nanoid postcss --all
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

The audit commands and dependency-tree inspection passed with zero vulnerabilities. The application checks are recorded in the current release verification after the contact-selection change.

## Follow-up

- Keep both the production and complete dependency audits in release verification.
- Recheck advisories whenever dependencies or the lockfile change.
- Continue using exact dependency versions and scoped overrides so dependency behavior remains reproducible.
