# Analytics Components

`AnalyticsProvider` receives the shared server-evaluated feature flag and combines it with the visitor's explicit first-party preference. Tracking remains off while the choice is unknown or declined. The non-modal `AnalyticsConsent` panel accurately describes optional page-view and approved external-link click analytics, offers **Allow analytics** and **Decline**, then leaves an **Analytics settings** control so the choice can be changed later. The preference is stored separately as `vv_analytics_preference`; storage failure fails closed and is reported truthfully in the panel. If a failed Decline leaves a stale stored Allow, the stale value is removed so a full reload returns to undecided rather than silently resuming tracking.

`PageViewTracker` mounts only in the public route-group layout. After consent, it records one best-effort event when the pathname changes, ignores rerenders of the same pathname, sends no query/hash, and returns no UI. Disabling or declining resets its last-path guard so a later Allow records the current route once.

`TrackedExternalLink` preserves native anchor navigation. It dispatches an allowlisted link type/destination with `sendBeacon` or keepalive fetch and never waits, calls `preventDefault`, or exposes delivery failure to the visitor.

Both tracking components create only random first-party identifiers and coarse categories. They must not collect names, raw IP addresses, exact location, fingerprint attributes, full referrer paths, or admin activity. Decline expires `vv_visitor_id`, removes `vv_analytics_session`, clears in-memory fallbacks, and prevents identity creation and request dispatch even if browser preference storage fails.
