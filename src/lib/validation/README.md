# Server Validation

This directory owns Zod schemas for untrusted request boundaries. Phase 7 introduced the bounded administrator login shape. Phase 8 adds strict page-view/link-click payloads with UUIDs, enum-like categories, short public paths, bounded referrers/destinations, normalization, and exact destination allowlisting. Phase 10 adds sanitized inquiry fields, contact/date/guest/consent rules, fill-time bounds, and payment-card-pattern rejection.

Inquiry responses may return short field-specific correction messages to the submitting guest, but never echo values or database details. Raw payloads and validation errors are never logged.
