export type CsvCell = boolean | null | number | string | undefined;

function protectSpreadsheetFormula(value: string) {
  return /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
}

export function escapeCsvCell(value: CsvCell) {
  const text = protectSpreadsheetFormula(value == null ? "" : String(value));
  return `"${text.replaceAll('"', '""')}"`;
}

export function createCsv(headers: string[], rows: CsvCell[][]) {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      headers.map((_, index) => escapeCsvCell(row[index])).join(","),
    ),
  ];

  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

