# Typed Public Data

## Purpose

This directory is the single editable source for public navigation and verified or explicitly qualified property content. Homepage and public information routes consume these records instead of independently deciding business information.

## Current files and responsibilities

- `navigation.ts` defines every required public navigation label, intended path, availability status, and the validated/configurable primary booking action.
- `site.ts` defines the public identity, address, hero copy, validated external destination states, schedule, and trust indicators.
- `accommodation.ts` defines standard statistics, preview features, grouped room/facility content, capacity/bathroom qualifications, and inclusion notes.
- `amenities.ts` defines preview cards, grouped amenity records, supplied/confirm statuses, optional-service names, and mobile-network guidance.
- `gallery.ts` defines fourteen local placeholder-image categories, explicit provisional status, and accurate alternative text.
- `reviews.ts` defines the supplied Airbnb rating summary, category scores, three attributed excerpts, and three content-free Messenger publication reservations.
- `location.ts` defines the confirmed address/directions and inactive map configuration.
- `contact.ts` defines six null-configured public contact channels; inquiry activation is owned by the server configuration boundary rather than public data.
- `attractions.ts` defines homepage previews and the full condition-qualified attraction/activity/food collection without prices or guarantees.
- `guestGuide.ts` defines arrival times, packing groups, self-catering, shopping, water, and internet guidance.
- `houseRules.ts` defines grouped public house rules without private operational contacts.
- `fees.ts` centralizes every requested fee key and source-draft value while marking all public amounts owner-confirmation-required.
- `faqs.ts` composes the public questions and imports existing canonical qualifications where practical.

## Interactions

Header, mobile navigation, and footer read the same navigation collection. Homepage, information, discovery, and contact routes consume focused property modules. Later pages should reuse or extend these modules rather than copy facts into component-local constants.

## Adding functionality safely

Represent unknown values explicitly with `null`, a disabled state, or an `upcoming` status. Activate routes only after their implementation and QA. Keep types beside small focused datasets unless a shared domain type has multiple real consumers.

## Restrictions

- Do not invent URLs, prices, capacities, inclusions, reviews, or contact permissions.
- Do not copy caretaker phone numbers into public data.
- Do not duplicate canonical facts across data files.
- Do not put secrets or server-only credentials here; this directory can enter browser bundles.

## Environment variables

Data modules do not read environment variables directly. `src/lib/config/publicDestinations.ts` normalizes the eight public destination variables and supplies typed `null` fallback states.

## Testing

Test navigation availability against implemented routes, validate configured destinations before activation, and audit rendered copy against the source package and `CONTENT_TODO.md`.

## Security and privacy

Assume all exports are publicly readable. Include only approved public facts and privacy-safe excerpts. Private operational information belongs in protected systems, not this directory.

## Files requiring careful review

`site.ts`, `fees.ts`, review attributions, and any file controlling link activation, public certainty, or contact visibility require owner-confirmed values and targeted tests.
