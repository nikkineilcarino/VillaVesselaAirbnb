# Validated Public Configuration

`publicDestinations.ts` is the single boundary between public destination environment values and rendered/tracked links. It accepts only complete HTTPS URLs without embedded credentials, bounded email addresses, and international phone-number digits. Telephone, email, and WhatsApp inputs are converted to canonical `tel:`, `mailto:`, and `https://wa.me/` destinations. Google Maps and Waze links/embeds additionally require their exact approved host and path shapes before they can enter an anchor or iframe.

The analytics endpoint compares the submitted destination and type with this exact normalized configuration. Multiple owner-approved telephone destinations are allowlisted independently under the shared `phone` analytics type. Blank or malformed values stay `null` and render as inactive controls. `other` has no approved destination in the current environment.

All values use `NEXT_PUBLIC_` names and must be assumed browser-visible. Never add a service key, password, unapproved contact, or unapproved destination here. Approved contact values belong in environment configuration, not source files.

`features.ts` owns exact server/build feature-switch parsing. `CONTACT_INQUIRY_VISIBLE` keeps unfinished guest and administrator inquiry surfaces absent unless its trimmed, case-insensitive value is exactly `true`. `CONTACT_INQUIRY_ENABLED` separately controls storage and is disabled unless exactly `true`; enabled collection always implies visibility so data cannot be collected through a hidden feature. Neither value may use a `NEXT_PUBLIC_` prefix.
