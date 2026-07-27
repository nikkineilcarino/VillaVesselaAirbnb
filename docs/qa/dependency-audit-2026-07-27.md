# Dependency security re-audit — 2026-07-27

## Outcome

- Production dependencies: **0 vulnerabilities**.
- Complete installed tree: **9 high-severity package entries**, all tracing to one development-only advisory, CVE-2026-14257 / [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg).
- Dependency tree: valid (`npm ls --all --silent`).
- Lockfile reproducibility simulation: valid (`npm ci --ignore-scripts --dry-run --silent`).
- Compatible package change: the modern `minimatch` 10 branch is constrained to patched `brace-expansion` 5.0.8 with a version-scoped override.
- Remaining legacy branch: `minimatch` 3 still requires the incompatible callable API from `brace-expansion` 1.x, so the available forced remedies are not safe.

## Evidence

The following commands were run with Node.js 22.18.0 against the committed lockfile:

```powershell
npm audit --omit=dev --json
npm audit --json
npm ls --all --silent
npm ci --ignore-scripts --dry-run --silent
npm explain brace-expansion
npm explain minimatch
npm ls brace-expansion minimatch --all --silent
```

The complete audit expands the same root finding across `brace-expansion`, `minimatch`, ESLint, two ESLint configuration packages, three Next-bundled lint plugins, and `eslint-config-next`. This is one dependency chain, not nine unrelated vulnerabilities. The installed tree confirms that the modern `minimatch` 10 copy now resolves to patched `brace-expansion` 5.0.8; the remaining report traces through legacy `minimatch` 3 to `brace-expansion` 1.1.16.

The advisory describes an out-of-memory denial of service when an attacker-controlled brace pattern is expanded. It affects `brace-expansion` through 5.0.7 and identifies 5.0.8 as the patched release. The installed dependency is used only by ESLint tooling. The repository scripts pass the fixed local path `.` to ESLint, and `eslint.config.mjs` contains only repository-owned fixed ignore patterns.

## Why no forced fix was applied

`npm audit` proposes two breaking remedies:

1. Upgrade ESLint 9.39.5 to 10.8.0. Several lint plugins bundled by `eslint-config-next` 16.2.11 still declare peer support through ESLint 9, so this would produce an unsupported plugin combination and would not remove the legacy `minimatch` copies inside those plugins.
2. Downgrade `eslint-config-next` 16.2.11 to an older framework major. npm produced different old-major suggestions across audit modes; neither matches the current Next.js 16 framework line, so this is not a valid compatibility fix.

A global `brace-expansion` 5.0.8 override was rejected after API inspection. Installed `minimatch` 3 expects `require("brace-expansion")` itself to be callable. Version 5.0.8 instead exposes a named `expand` function, so a global override would break the linter at runtime. The applied `brace-expansion@^5.0.5` override deliberately matches only the modern branch, where that named API is expected.

## Post-change verification

- `npm audit --omit=dev`: 0 vulnerabilities.
- Complete `npm audit`: 9 high-severity propagated development entries; the only vulnerable `brace-expansion` node is the legacy 1.1.16 copy.
- `npm ls --all --silent`: passed.
- `npm ci --ignore-scripts --dry-run --silent`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: 9 files and 67 tests passed.
- `npm run build`: passed; all 14 static outputs generated.

## Temporary controls and follow-up

- No affected package is part of the production dependency set or deployed visitor request path.
- Run ESLint only with the committed script/configuration; do not pass untrusted glob or brace patterns to the tooling.
- Keep `npm audit --omit=dev` as a blocking production check.
- Review the full development audit separately and do not suppress or mislabel it.
- Recheck after new ESLint, `eslint-config-next`, `eslint-plugin-*`, `minimatch`, or compatible legacy `brace-expansion` releases.
- Accept an upstream fix only after `npm ls`, lockfile simulation, lint, type checking, unit tests, browser tests, and production build all pass.
