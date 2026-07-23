# Public Information Components

## Purpose

This directory contains shared presentation for standalone public information routes. It keeps page heroes, section headings, disclosures, and availability labels consistent without owning canonical property facts.

## Current files

- `PageHero.tsx` provides the responsive inner-page hero, visible breadcrumb, and matching verified-fact `BreadcrumbList` JSON-LD.
- `PageSectionHeading.tsx` provides consistent section hierarchy.
- `DisclosureNote.tsx` presents important qualifications in a semantic aside.
- `AvailabilityBadge.tsx` pairs text with an icon so amenity certainty is never communicated by color alone.

## Safe extension

Keep these components content-agnostic and server-rendered. Add variants only when multiple real routes need them. Property facts, rules, fees, destinations, and uncertainty statuses belong in typed `src/data/` modules.

## Restrictions

- Do not read environment variables or privileged data directly.
- Do not embed unverified URLs, prices, contacts, or service promises.
- Do not remove visible uncertainty wording merely to simplify a layout.
- Do not add client-side JavaScript for interactions native HTML already provides.

## Testing

Changes require lint, strict types, public-route browser checks, JSON-LD parsing, Axe, mobile overflow review, keyboard inspection, and the production build. Breadcrumbs and anchors must retain matching URLs/names, accurate accessible names, and visible focus.
