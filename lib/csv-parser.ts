import { readFileSync } from 'fs';

export interface RawRow {
  code: string;
  description: string;
  priceExcl: number | null;
  priceIncl: number | null;
  avgCost: number | null;
  lastCost: number | null;
  qtyOnHand: number;
  active: boolean;
  inferredCategory: string;
}

function parsePrice(s: string): number | null {
  const n = parseFloat(s.trim());
  return isNaN(n) || n === 0 ? null : n;
}

function parseRow(line: string, lineNum: number): RawRow | null {
  const fields = line.split(',');
  const n = fields.length;

  // Header is 10 fields; every data row should also be 10 (no embedded commas confirmed)
  if (n < 9) {
    process.stderr.write(`[csv-parser] skipping line ${lineNum}: only ${n} fields\n`);
    return null;
  }

  const code = fields[0].trim();
  if (!code) return null;

  // Trailing fixed columns (8 after description's slot)
  // Layout: Code | Description | Category(empty) | PriceExcl | PriceIncl | AvgCost | LastCost | QtyOnHand | Active | InferredCategory
  const inferredCategory = fields[n - 1].trim();
  const active = fields[n - 2].trim().toLowerCase() === 'yes';
  const qtyOnHand = parseFloat(fields[n - 3]) || 0;
  const lastCost = parsePrice(fields[n - 4]);
  const avgCost = parsePrice(fields[n - 5]);
  const priceIncl = parsePrice(fields[n - 6]);
  const priceExcl = parsePrice(fields[n - 7]);
  // fields[n-8] = Category (always empty — skip)

  // Description = everything between Code and the 8 trailing fixed columns
  const description = fields.slice(1, n - 8).join(',').trim();

  return {
    code,
    description,
    priceExcl,
    priceIncl,
    avgCost,
    lastCost,
    qtyOnHand,
    active,
    inferredCategory,
  };
}

export function parseCatalogueCSV(filePath: string): RawRow[] {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const rows: RawRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const row = parseRow(line, i + 1);
    if (row) rows.push(row);
  }

  return rows;
}
