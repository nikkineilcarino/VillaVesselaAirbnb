# Public Forms

## Purpose

This directory contains the feature-flagged public inquiry form and its disabled fallback.

## Current component

`ContactInquiryForm.tsx` is a Server Component switch. The disabled component preserves a no-action, disabled fieldset. The enabled Client Component submits bounded JSON to `/api/contact`, renders field-level/server/success states accessibly, retains entries after failure, and resets only after a stored or honeypot-decoy success response.

## Interactions and configuration

The Contact route evaluates the server-only `CONTACT_INQUIRY_ENABLED` switch and passes a boolean. A random form-session UUID is stored in `sessionStorage` when available for privacy-safe rate limiting; it is never derived from device characteristics. Form data is never placed in local storage.

## Activation requirements

Enable submission only after the owner approves inquiries, the database migrations are applied, the service key is configured server-side, and the live insertion/retention/administrator workflow has been verified.

## Security and privacy

Never log field values, add payment fields, embed production records in fixtures, or expose server credentials. At least one contact method and explicit privacy consent are required. Dates are optional as a pair, and the guest count is an inquiry-validation bound rather than a capacity promise.

## Testing and files requiring careful review

Tests cover disabled rendering, enabled validation/success/failure behavior, server insertion/failure responses, honeypot/timing/rate paths, and absence of payment inputs. The enabled form, request schema, and endpoint are security/privacy-sensitive and require the full suite after every change.
