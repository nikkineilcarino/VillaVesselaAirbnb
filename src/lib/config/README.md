# Validated Public Configuration

`publicDestinations.ts` is the single boundary between public destination environment values and rendered/tracked links. It accepts only complete HTTPS URLs without embedded credentials, bounded email addresses, and international phone-number digits. Telephone, email, and WhatsApp inputs are converted to canonical `tel:`, `mailto:`, and `https://wa.me/` destinations.

The analytics endpoint compares the submitted destination and type with this exact normalized configuration. Blank or malformed values stay `null` and render as inactive controls. `other` has no approved destination in the current environment.

All values use `NEXT_PUBLIC_` names and must be assumed browser-visible. Never add a service key, password, private caretaker contact, or unapproved destination here.

`features.ts` owns exact server/build feature-switch parsing. `CONTACT_INQUIRY_ENABLED` is disabled unless its trimmed, case-insensitive value is exactly `true`; it must never be renamed with a `NEXT_PUBLIC_` prefix.
