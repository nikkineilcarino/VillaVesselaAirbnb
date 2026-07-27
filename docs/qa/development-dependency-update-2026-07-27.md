# Development dependency update — 2026-07-27

## Scope

Dependabot pull request #2 updates only development packages, the PostCSS override, and the lockfile:

- `@playwright/test`: 1.61.1 → 1.62.0
- `eslint-config-next`: 16.2.11 → 16.2.12
- `postcss`: 8.5.22 → 8.5.23
- `overrides.postcss`: 8.5.22 → 8.5.23

The official [Playwright 1.62.0](https://github.com/microsoft/playwright/releases/tag/v1.62.0), [Next.js 16.2.12](https://github.com/vercel/next.js/releases/tag/v16.2.12), and [PostCSS 8.5.23](https://github.com/postcss/postcss/releases/tag/8.5.23) releases were reviewed before merging. Playwright's Debian 11 support removal does not affect the project's Windows workstation, GitHub Actions Ubuntu runner, or Vercel build. PostCSS 8.5.23 prevents loading a source-map file when `opts.from` is absent. The Next.js ESLint configuration now exactly matches the installed Next.js patch.

## Verification

- Dependabot pull-request Quality run `30240258178`: passed on Linux.
- Locked Windows install with lifecycle scripts disabled: passed (456 packages). npm reported a non-fatal cleanup warning for an unused optional WASI folder; the resulting dependency tree and all gates validated.
- Resolved versions: Playwright 1.62.0, eslint-config-next 16.2.12, and overridden PostCSS 8.5.23.
- Production dependency audit: 0 vulnerabilities.
- Full audit: unchanged at 9 high, 0 critical development-only entries covered by Decision 027.
- ESLint: passed with the matching Next.js configuration.
- Strict TypeScript check: passed.
- Vitest: 67 passed across 9 files.
- Next.js production build: passed with all expected routes generated.
- Playwright browser install: Chromium 151.0.7922.34 downloaded successfully.
- Playwright Chromium: 47 passed, 2 credential-dependent live administrator checks skipped as designed.
