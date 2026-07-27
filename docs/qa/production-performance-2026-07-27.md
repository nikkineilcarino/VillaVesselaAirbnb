# Production performance revalidation — 2026-07-27

## Scope and method

The canonical production homepage at `https://villa-vessela-airbnb.vercel.app` was revalidated after the reviewed production and development dependency updates. The audit used Lighthouse 12.8.2, the newest Lighthouse version compatible with the project's pinned Node 22.18 runtime, and Playwright's Chromium 151.0.7922.34 binary.

Two default mobile runs and two `--preset=desktop` runs were executed against the live HTTPS alias. Each used a fresh headless Lighthouse session and the performance, accessibility, best-practices, and SEO categories. The results below are synthetic lab observations from this workstation and network path. They are not field telemetry, a service-level objective, or a guarantee for every visitor.

## Results

| Form factor | Run | Performance | Accessibility | Best practices | SEO | FCP | LCP | Speed Index | TBT | CLS | Transfer bytes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 1 | 99 | 100 | 100 | 100 | 983 ms | 2,034 ms | 1,248 ms | 54 ms | 0 | 247,273 |
| Mobile | 2 | 99 | 100 | 100 | 100 | 972 ms | 2,218 ms | 1,705 ms | 47 ms | 0 | 247,339 |
| Desktop | 1 | 100 | 100 | 100 | 100 | 292 ms | 501 ms | 624 ms | 0 ms | 0 | 247,295 |
| Desktop | 2 | 100 | 100 | 100 | 100 | 291 ms | 499 ms | 417 ms | 0 ms | 0 | 247,352 |

## Disposition

- All four runs completed successfully against the canonical production deployment.
- Accessibility, best-practices, and SEO scores were 100 in every run.
- Performance was 99 in both mobile runs and 100 in both desktop runs.
- Cumulative Layout Shift was 0 in every run; no runtime change is justified by these measurements.
- The existing recommendation for a higher-resolution front-of-villa hero remains a future media-quality improvement, not a current performance blocker.

No Lighthouse package was added to the project. It was invoked ephemerally at an exact compatible version, so the application lockfile and deployment dependency graph remain unchanged.
