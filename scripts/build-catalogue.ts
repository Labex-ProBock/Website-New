import path from 'path';
import fs from 'fs';
import { parseCatalogueCSV } from '../lib/csv-parser';
import { normalizeDescription } from '../lib/description-normalizer';
import { extractBrand } from '../lib/brand-extractor';
import { classifySubcategory } from '../lib/subcategory-classifier';
import { classifyTier } from '../lib/tier-classifier';
import { CATEGORY_MAP } from '../lib/catalogue-types';
import type { CatalogueProduct, ImageManifest, ImageManifestEntry } from '../lib/catalogue-types';

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, 'labex-real-catalogue.csv');
const REMOVAL_PATH = path.join(ROOT, 'labex-removal-list.csv');
const OUTPUT_TS = path.join(ROOT, 'data', 'products.generated.ts');
const OUTPUT_SEARCH = path.join(ROOT, 'data', 'products.search.generated.ts');
const OUTPUT_MANIFEST = path.join(ROOT, 'data', 'image-manifest.json');

// Brands Labex no longer stocks — every product carrying one of these in its
// name/description is dropped, even if its Code isn't in the removal list (e.g.
// "Washer (Miele)"). These whole brands also come off the site branding.
const DROPPED_BRANDS_RE = /\b(ohaus|miele|salvis)\b/i;

function codeToSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// The image-manifest accumulates working review states (e.g. "needs-mandy-review")
// that aren't part of the public ReviewStatus union. Coerce anything unknown to
// 'pending' so the generated, type-checked output always stays valid. The raw
// value is preserved in image-manifest.json for internal tooling.
const VALID_REVIEW_STATUSES = new Set(['pending', 'approved', 'hide']);
function coerceReviewStatus(value: string | undefined): 'pending' | 'approved' | 'hide' {
  return value && VALID_REVIEW_STATUSES.has(value) ? (value as 'pending' | 'approved' | 'hide') : 'pending';
}

/**
 * Load the discontinued-product Codes from labex-removal-list.csv (Code in the
 * first column; the rest of the row is ignored). Keeps Part A durable: every
 * rebuild re-reads this list and excludes the matching products. Returns an
 * empty set (with a warning) if the file is absent so a fresh checkout can still
 * build.
 */
function loadRemovalCodes(): Set<string> {
  if (!fs.existsSync(REMOVAL_PATH)) {
    process.stderr.write(`[build-catalogue] WARNING: ${path.basename(REMOVAL_PATH)} not found — no products will be excluded.\n`);
    return new Set();
  }
  const set = new Set<string>();
  const lines = fs.readFileSync(REMOVAL_PATH, 'utf8').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {        // skip header
    const line = lines[i].trim();
    if (!line) continue;
    const code = line.split(',')[0].trim();        // Codes never contain commas
    if (code) set.add(code);
  }
  return set;
}

function serializeProduct(p: CatalogueProduct): string {
  const str = (v: string | null) => v === null ? 'null' : `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  const terms = p.searchTerms.map(t => `"${t}"`).join(', ');

  return `  {
    code: ${str(p.code)},
    slug: ${str(p.slug)},
    name: ${str(p.name)},
    rawDescription: ${str(p.rawDescription)},
    brand: ${str(p.brand)},
    model: ${str(p.model)},
    category: ${str(p.category)},
    subcategory: ${str(p.subcategory)},
    tier: "${p.tier}",
    priceExcl: null,
    priceIncl: null,
    avgCost: null,
    lastCost: null,
    qtyOnHand: ${p.qtyOnHand > 0 ? 1 : 0},
    active: ${p.active},
    imageStatus: "${p.imageStatus}",
    reviewStatus: "${p.reviewStatus}",
    searchTerms: [${terms}],
  }`;
}

function buildSearchTerms(name: string, brand: string | null, subcategory: string | null): string[] {
  const terms: string[] = [];
  if (brand) terms.push(brand);
  if (subcategory) terms.push(subcategory);
  return terms;
}

function main() {
  console.log('Reading CSV…');
  const rows = parseCatalogueCSV(CSV_PATH);
  console.log(`  Parsed ${rows.length} rows`);

  // Part A — load discontinued Codes and exclude them (durable across rebuilds).
  const removalCodes = loadRemovalCodes();
  console.log(`  Loaded ${removalCodes.size} removal-list codes`);
  const excludeStats = { byCode: 0, byBrand: 0 };
  const keptRows = rows.filter((row) => {
    if (removalCodes.has(row.code)) { excludeStats.byCode++; return false; }
    if (DROPPED_BRANDS_RE.test(normalizeDescription(row.description))) { excludeStats.byBrand++; return false; }
    return true;
  });
  console.log(`  Excluded ${excludeStats.byCode} by removal Code + ${excludeStats.byBrand} by dropped brand → ${keptRows.length} products remain`);

  // Load existing manifest for merging (preserves manually-set imageStatus/reviewStatus)
  let existingManifestMap: Map<string, ImageManifestEntry> = new Map();
  if (fs.existsSync(OUTPUT_MANIFEST)) {
    const existing: ImageManifest = JSON.parse(fs.readFileSync(OUTPUT_MANIFEST, 'utf8'));
    for (const entry of existing.products) {
      existingManifestMap.set(entry.code, entry);
    }
    console.log(`  Loaded ${existingManifestMap.size} existing manifest entries`);
  }

  const products: CatalogueProduct[] = [];
  const manifestEntries: ImageManifestEntry[] = [];

  const stats = { tierA: 0, tierB: 0, tierC: 0, withBrand: 0, withSubcat: 0, noPrice: 0 };

  for (const row of keptRows) {
    const name = normalizeDescription(row.description);
    const rawDescription = row.description;
    const slug = codeToSlug(row.code);
    const { brand, model } = extractBrand(name);
    const categorySlug = CATEGORY_MAP[row.inferredCategory] ?? 'quote-required';
    const subcategory = classifySubcategory(categorySlug, name);
    const tier = classifyTier(row.priceIncl, row.inferredCategory);
    const searchTerms = buildSearchTerms(name, brand, subcategory);

    const imageStatusDefault = tier === 'C' ? 'quote-on-request' : 'pending';
    const existing = existingManifestMap.get(row.code);

    const product: CatalogueProduct = {
      code: row.code,
      slug,
      name,
      rawDescription,
      brand,
      model,
      category: categorySlug,
      subcategory,
      tier,
      priceExcl: row.priceExcl,
      priceIncl: row.priceIncl,
      avgCost: row.avgCost,
      lastCost: row.lastCost,
      qtyOnHand: row.qtyOnHand,
      active: row.active,
      imageStatus: existing?.imageStatus ?? imageStatusDefault,
      reviewStatus: coerceReviewStatus(existing?.reviewStatus),
      searchTerms,
    };

    products.push(product);

    manifestEntries.push({
      ...existing,
      code: row.code,
      slug,
      imageStatus: existing?.imageStatus ?? imageStatusDefault,
      imageUrl: existing?.imageUrl ?? null,
      localPath: existing?.localPath ?? null,
      reviewStatus: existing?.reviewStatus ?? 'pending',
      lastChecked: existing?.lastChecked ?? null,
    });

    if (tier === 'A') stats.tierA++;
    else if (tier === 'B') stats.tierB++;
    else stats.tierC++;
    if (brand) stats.withBrand++;
    if (subcategory) stats.withSubcat++;
    if (!row.priceIncl) stats.noPrice++;
  }

  // Write products.generated.ts (sanitised — public fields only).
  // priceExcl/priceIncl/avgCost/lastCost are all forced to null and qtyOnHand
  // collapsed to a 0/1 flag at serialisation time, so no price, supplier cost,
  // or exact stock level can ever be committed or shipped, even though the
  // source CSV still holds them. The site is quote-only.
  const tsContent = `// AUTO-GENERATED — do not edit manually. Run: npm run build:catalogue
// Generated: ${new Date().toISOString()}
// Sanitised: all price/cost fields are null; qtyOnHand is a 0/1 in-stock flag.
// Quote-only site — no price, supplier cost, margin, or stock quantity here.
import type { CatalogueProduct } from '@/lib/catalogue-types';

export const products: CatalogueProduct[] = [
${products.map(serializeProduct).join(',\n')}
];
`;

  fs.writeFileSync(OUTPUT_TS, tsContent, 'utf8');
  console.log(`  Wrote ${products.length} products → data/products.generated.ts`);

  // Write products.search.generated.ts (slim client-safe — search index only)
  const serializeSearchDoc = (p: CatalogueProduct) =>
    `  { id:${JSON.stringify(p.code)}, code:${JSON.stringify(p.code)}, slug:${JSON.stringify(p.slug)}, name:${JSON.stringify(p.name)}, brand:${JSON.stringify(p.brand ?? '')}, category:${JSON.stringify(p.category)}, subcategory:${JSON.stringify(p.subcategory ?? '')}, tier:${JSON.stringify(p.tier)}, priceIncl:null }`;

  const searchContent = `// AUTO-GENERATED — do not edit manually. Run: npm run build:catalogue
// Generated: ${new Date().toISOString()}
// Client-safe: no cost fields. Import this for search/command-palette.

export interface SearchDoc {
  id: string;
  code: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  tier: string;
  priceIncl: number | null;
}

export const searchDocs: SearchDoc[] = [
${products.map(serializeSearchDoc).join(',\n')},
];
`;

  fs.writeFileSync(OUTPUT_SEARCH, searchContent, 'utf8');
  console.log(`  Wrote ${products.length} docs → data/products.search.generated.ts`);

  // Write image-manifest.json
  const manifest: ImageManifest = {
    generated: new Date().toISOString().split('T')[0],
    total: manifestEntries.length,
    products: manifestEntries,
  };

  fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`  Wrote ${manifestEntries.length} entries → data/image-manifest.json`);

  // Stats report
  console.log('\n=== Catalogue Stats ===');
  console.log(`Total products : ${products.length}`);
  console.log(`Tier A (≥R20k) : ${stats.tierA}`);
  console.log(`Tier B (categ) : ${stats.tierB}`);
  console.log(`Tier C (uncat) : ${stats.tierC}`);
  console.log(`With brand     : ${stats.withBrand}`);
  console.log(`With subcateg  : ${stats.withSubcat}`);
  console.log(`No price       : ${stats.noPrice}`);

  // Category breakdown
  const catCounts: Record<string, number> = {};
  for (const p of products) {
    catCounts[p.category] = (catCounts[p.category] ?? 0) + 1;
  }
  console.log('\n=== By Category ===');
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(28)} ${count}`);
  }
}

main();
