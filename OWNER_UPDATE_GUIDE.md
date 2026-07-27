# Villa Vessela Owner Update Guide

This guide records the safe extension points left for information and photographs that are not available yet. Missing values stay disabled, omitted, or visibly reserved; they must never be guessed.

## Easiest update workflow

1. Put new photographs or a ZIP package in a local folder such as `Downloads`.
2. Tell Codex what each photograph shows and whether it may be published.
3. For a booking, map, social, phone, or email destination, provide the complete owner-approved value and explicitly confirm that it may be public.
4. Confirm any related booking rule, fee, or inclusion separately from the photograph.
5. Run the full privacy, image, responsive, accessibility, build, GitHub, and Vercel workflow before publication.

## Reserved photograph slots

The public gallery deliberately retains three replaceable placeholder records at the end of `src/data/gallery.ts`:

| Reserved slot | Suggested future filename | Information needed with the image |
| --- | --- | --- |
| Blue Kubo | `blue-kubo.jpg` | What it shows and whether it is included in a standard booking |
| Green Kubo | `green-kubo.jpg` | What it shows and whether it is included in a standard booking |
| Parking | `parking-area.jpg` | Whether it is the guest parking area and the current parking arrangement |

A higher-resolution front-of-villa photograph can later replace the current small hero source. A descriptive name such as `villa-front-high-resolution.jpg` is preferred.

New files belong under `public/images/villa-vessela/` in the appropriate category folder. Every published gallery record needs a unique ID, accurate alternative text, a qualified caption, real pixel dimensions, a local image path, and `status: "approved"`. Do not remove an existing placeholder until its exact replacement has passed review.

Additional approved photographs can be appended to `galleryItems` without changing the gallery components or lightbox behavior.

## Photograph acceptance checklist

- Prefer an original JPEG or WebP at least 1600 pixels wide for hero or large-display use.
- Supply individual photographs, not screenshots or source-collage sheets.
- Confirm publication permission and what the photograph truthfully depicts.
- Exclude or crop recognizable people, private phone numbers, vehicle or vessel identifiers, booking records, and security-sensitive details unless publication is explicitly approved.
- Remove GPS/EXIF metadata and check for duplicate or corrupted files.
- Keep nearby-attraction captions separate from property photographs.
- Keep food, pet, kubo, cottage, tour, and optional-service conditions visible.

## Future booking, map, and contact destinations

The website already has disabled configuration slots for future public destinations. Add approved values to the Vercel project environment, then redeploy:

| Purpose | Environment variable |
| --- | --- |
| Airbnb listing | `NEXT_PUBLIC_AIRBNB_URL` |
| Facebook page | `NEXT_PUBLIC_FACEBOOK_URL` |
| Messenger | `NEXT_PUBLIC_MESSENGER_URL` |
| Google Maps link | `NEXT_PUBLIC_GOOGLE_MAPS_URL` |
| Google Maps embed | `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` |
| WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Public email | `NEXT_PUBLIC_CONTACT_EMAIL` |
| Public telephone | `NEXT_PUBLIC_CONTACT_PHONE` |

These are intentionally public values. Never use private caretaker details, passwords, API keys, or incomplete links. HTTPS destinations, email syntax, and international phone digits are validated automatically; blank or malformed values remain inactive.

## Business facts to confirm later

`CONTENT_TODO.md` is the authoritative checklist for rates, fees, expanded capacity, kubo/cottage inclusion, bathroom details, washer availability, inquiry activation, retention, and other unresolved facts. Resolve an item there before changing its public copy in `src/data/`.

Inquiry submission and database-backed administration remain separate features. Do not activate them until the database, administrator identities, retention/deletion process, privacy channel, and production verification are complete.
