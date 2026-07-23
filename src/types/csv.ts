export const csvExportTypes = [
  "page-views",
  "link-clicks",
  "inquiries",
] as const;

export type CsvExportType = (typeof csvExportTypes)[number];

