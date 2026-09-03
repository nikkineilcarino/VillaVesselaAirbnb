# Public Forms

## Purpose

This directory contains the feature-flagged public inquiry form and its disabled fallback.

## Current component

`ContactInquiryForm.tsx` is a Server Component switch. The disabled component preserves a no-action, disabled fieldset and links to the current Privacy notice without implying that preview entries are submitted. The enabled Client Component submits bounded JSON to `/api/contact`, renders field-level/server/success states accessibly, retains entries after failure, and resets only when a `200`, `201`, or `202` response also contains the fixed `received` status. Those accepted cases represent an identical retry, a newly stored inquiry, or the intentional honeypot decoy respectively; another success-looking body is not enough.

## Interactions and configuration

The Contact route first evaluates server-only `CONTACT_INQUIRY_VISIBLE`; when false and collection is disabled, no inquiry section or disabled preview is rendered. A published visible state then evaluates `CONTACT_INQUIRY_ENABLED` and passes a boolean plus the reviewed privacy-notice version. A random form-session UUID is stored in `sessionStorage` when available for privacy-safe rate limiting; it is never derived from device characteristics. A separate random UUID v4 remains in component memory across validation, rate, network, and storage retries, and rotates only after an accepted status plus the fixed `received` body. The form sends its rendered notice version only as a freshness assertion; the server requires the current value and still chooses the trusted constant stored with the inquiry. Form answers are never placed in local or session storage.

## Activation requirements

Enable submission only after the owner approves inquiries, migration `009` is applied, the service key is configured server-side, and the live insertion/retention/administrator workflow has been verified. The application may be deployed dormant with both inquiry flags false/absent while migration `009` remains unapplied remotely.

## Security and privacy

Never log field values, add payment fields, embed production records in fixtures, or expose server credentials. At least one contact method and explicit just-in-time privacy consent are required. The consent copy links to the dynamic Privacy notice and describes intake-only purpose, 365-day active-table retention, exact early-deletion requests, administrator access, providers, and separate copies without claiming legal compliance. Dates are optional as a pair, and the guest count is an inquiry-validation bound rather than a capacity promise.

## Testing and files requiring careful review

Tests cover disabled rendering, enabled validation/success/failure behavior, UUID-v4 retry-ID reuse and rotation, privacy-version freshness, identical-retry and changed-payload conflict handling, dynamic Privacy wording, server insertion/failure responses, honeypot/timing/rate paths, and absence of payment inputs. A `409` conflict must preserve the visitor's entries and direct them to refresh or use an approved contact channel. The enabled form, request schema, and endpoint are security/privacy-sensitive and require both feature modes plus the full suite after every change.
