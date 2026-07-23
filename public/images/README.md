# Public Images

## Purpose

This directory contains public, replaceable website imagery. Files here are served directly and must be safe for unrestricted access.

## Current placeholders

`placeholders/` contains six subject-specific repository-native SVG illustrations for the hero, exterior, bedroom, garden, beach, and location/map positions, plus one generic gallery illustration. They are layout substitutes only. Visible labels and accessible copy identify them as placeholders; they do not depict Villa Vessela or provide navigation. The generic illustration may reserve multiple category positions only while each position remains explicitly provisional.

## Replacing a placeholder safely

1. Obtain owner approval and publication permission for the exact photograph.
2. Confirm what the image actually shows and write concise, accurate alternative text in the relevant `src/data/` module or component.
3. Add an optimized image with stable dimensions and a descriptive lowercase filename; preserve the existing responsive container and `next/image` sizing unless the design is deliberately re-tested.
4. Remove placeholder wording only for the replaced asset. Do not remove warnings from unrelated placeholder or map positions.
5. Run image loading, responsive crop, accessibility, production-build, and visual-regression checks.

## Restrictions

- Do not use unrelated stock media as if it shows the property, beach, rooms, amenities, or attractions.
- Do not publish images containing private phone numbers, booking records, guest documents, faces without permission, exact security details, or other personal information.
- Do not add remote scripts, tracking pixels, external SVG references, or executable SVG content.
- Do not silently replace the location illustration with an unverified map or coordinates.

## Performance and security

Prefer appropriately sized AVIF/WebP/JPEG photography and keep original masters outside the web bundle when they are not needed at runtime. SVG files require XML parsing and active-content/reference scans. All image changes require a browser load check and dependency-independent fallback review.
