# Inquiry Workflow

This directory owns the public inquiry request boundary and administrator read helpers. Public submission is disabled unless `CONTACT_INQUIRY_ENABLED` is exactly `true`; changing the flag changes both form rendering and endpoint availability.

The JSON request boundary accepts at most 8 KiB and requires same-origin browser requests. Shared Zod validation sanitizes bounded text, requires a name/message/consent and at least one contact method, accepts either two valid preferred dates or neither, bounds guests to 1–20, rejects past/over-two-year dates, and rejects Luhn-valid payment-card patterns in messages. A hidden honeypot, two-second fill-time minimum, one-day form lifetime, per-session three-per-hour limit, and global 60-per-minute limit provide layered abuse resistance without storing raw IP addresses.

Only validated values reach the isolated service-role insert in `src/app/api/contact/route.ts`. Storage absence/failure returns a real unavailable response; it is never presented as a successful inquiry. Logs contain fixed reason labels only, never names, contact values, messages, identifiers, or database errors.

Administrator inquiry reads and status updates use the authenticated request-scoped client and remain subject to RLS. Keep public writes separate from admin reads. Do not add public database policies, payment fields, email delivery, automatic booking acceptance, or production data fixtures here.

