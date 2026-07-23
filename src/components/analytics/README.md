# Analytics Components

`AnalyticsProvider` receives only the server-evaluated feature flag. When false, neither page nor link components create identifiers or dispatch requests.

`PageViewTracker` mounts only in the public route-group layout. It records one best-effort event when the pathname changes, ignores rerenders of the same pathname, sends no query/hash, and returns no UI.

`TrackedExternalLink` preserves native anchor navigation. It dispatches an allowlisted link type/destination with `sendBeacon` or keepalive fetch and never waits, calls `preventDefault`, or exposes delivery failure to the visitor.

Both components create only random first-party identifiers and coarse categories. They must not collect names, raw IP addresses, exact location, fingerprint attributes, full referrer paths, or admin activity.
