export type GalleryPreviewItem = {
  alt: string;
  category: string;
  height: number;
  src: string;
  width: number;
};

export const galleryPreviewItems = [
  {
    alt: "Illustrated placeholder for the Villa Vessela exterior; official property photo pending",
    category: "Exterior",
    height: 700,
    src: "/images/placeholders/exterior-placeholder.svg",
    width: 900,
  },
  {
    alt: "Illustrated placeholder for a Villa Vessela bedroom; official property photo pending",
    category: "Bedrooms",
    height: 700,
    src: "/images/placeholders/bedroom-placeholder.svg",
    width: 900,
  },
  {
    alt: "Illustrated placeholder for the Villa Vessela tropical garden; official property photo pending",
    category: "Garden",
    height: 700,
    src: "/images/placeholders/garden-placeholder.svg",
    width: 900,
  },
  {
    alt: "Illustrated placeholder for nearby Tondol Beach; official location photo pending",
    category: "Beach",
    height: 700,
    src: "/images/placeholders/beach-placeholder.svg",
    width: 900,
  },
] as const satisfies readonly GalleryPreviewItem[];

export type GalleryItem = GalleryPreviewItem & {
  id: string;
};

const genericPlaceholder = "/images/placeholders/gallery-generic-placeholder.svg";

export const galleryItems = [
  {
    alt: "Illustrated placeholder for the Villa Vessela exterior; official property photograph pending",
    category: "Exterior",
    height: 700,
    id: "exterior",
    src: "/images/placeholders/exterior-placeholder.svg",
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for a full Villa Vessela photograph; official property photograph pending",
    category: "Villa",
    height: 700,
    id: "villa",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Illustrated placeholder for a Villa Vessela bedroom; official property photograph pending",
    category: "Bedrooms",
    height: 700,
    id: "bedrooms",
    src: "/images/placeholders/bedroom-placeholder.svg",
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for the Villa Vessela living room; official property photograph pending",
    category: "Living room",
    height: 700,
    id: "living-room",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for the Villa Vessela dining area; official property photograph pending",
    category: "Dining area",
    height: 700,
    id: "dining-area",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for the Villa Vessela kitchen; official property photograph pending",
    category: "Kitchen",
    height: 700,
    id: "kitchen",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for the Villa Vessela bathroom; official property photograph pending",
    category: "Bathroom",
    height: 700,
    id: "bathroom",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for the Villa Vessela balconies; official property photograph pending",
    category: "Balconies",
    height: 700,
    id: "balconies",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Illustrated placeholder for the Villa Vessela tropical garden; official property photograph pending",
    category: "Garden",
    height: 700,
    id: "garden",
    src: "/images/placeholders/garden-placeholder.svg",
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for the Blue Kubo; official property photograph and inclusion status pending",
    category: "Blue Kubo",
    height: 700,
    id: "blue-kubo",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for the Green Kubo; official property photograph and inclusion status pending",
    category: "Green Kubo",
    height: 700,
    id: "green-kubo",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Illustrated placeholder for nearby Tondol Beach; official location photograph pending",
    category: "Beach",
    height: 700,
    id: "beach",
    src: "/images/placeholders/beach-placeholder.svg",
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for Villa Vessela parking; official property photograph pending",
    category: "Parking",
    height: 700,
    id: "parking",
    src: genericPlaceholder,
    width: 900,
  },
  {
    alt: "Generic illustrated placeholder for nearby attractions; approved location photography pending",
    category: "Nearby attractions",
    height: 700,
    id: "nearby-attractions",
    src: genericPlaceholder,
    width: 900,
  },
] as const satisfies readonly GalleryItem[];
