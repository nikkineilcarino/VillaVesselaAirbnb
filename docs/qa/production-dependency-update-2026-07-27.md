# Production dependency update — 2026-07-27

## Scope

Dependabot pull request #1 updates only the production packages and lockfile:

- `next`: 16.2.11 → 16.2.12
- `lucide-react`: 1.25.0 → 1.27.0
- `recharts`: 3.10.0 → 3.10.1

The official [Next.js 16.2.12](https://github.com/vercel/next.js/releases/tag/v16.2.12), [Lucide 1.27.0](https://github.com/lucide-icons/lucide/releases/tag/1.27.0), and [Recharts 3.10.1](https://github.com/recharts/recharts/releases/tag/v3.10.1) release notes were reviewed before merging. The Lucide icons changed in 1.27.0 are not imported by this application. The Recharts pie, bar, and tooltip changes intersect existing dashboard components and therefore remain covered by the dashboard component test and production-build gates.

## Verification

- Dependabot pull-request Quality run `30240233481`: passed on Linux.
- Locked Windows install with lifecycle scripts disabled: passed (456 packages).
- Production dependency audit: 0 vulnerabilities.
- Full audit: unchanged at 9 high, 0 critical development-only entries covered by Decision 027.
- Dependency tree resolution: passed; the exact production versions above are installed.
- ESLint: passed.
- Strict TypeScript check: passed.
- Vitest: 67 passed across 9 files, including the dashboard chart component.
- Next.js production build: passed with the Windows x64 SWC binary; all expected routes were generated.
- Playwright Chromium: 47 passed, 2 credential-dependent live administrator checks skipped as designed.
