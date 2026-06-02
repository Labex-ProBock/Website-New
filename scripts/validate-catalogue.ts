/**
 * validate-catalogue.ts
 *
 * Validates the generated catalogue data for common issues.
 * Run before deploying to catch data quality problems.
 *
 * Usage: npm run catalogue:validate
 */

import path from 'path';
import { parseCatalogueCSV } from '../lib/csv-parser';
import { products } from '../data/products.generated';

const ROOT = process.cwd();
const CSV_PATH = path.join(ROOT, 'labex-real-catalogue.csv');

function main() {
  const rows = parseCatalogueCSV(CSV_PATH);
  const issues: string[] = [];
  let warnings = 0;

  // 1. Count check
  if (products.length !== rows.length) {
    issues.push(`Row count mismatch: CSV has ${rows.length}, generated has ${products.length}`);
  }

  // 2. Slug uniqueness
  const slugs = new Map<string, string>();
  for (const p of products) {
    if (slugs.has(p.slug)) {
      issues.push(`Duplicate slug "${p.slug}": codes ${slugs.get(p.slug)} and ${p.code}`);
    }
    slugs.set(p.slug, p.code);
  }

  // 3. Code uniqueness
  const codes = new Set<string>();
  for (const p of products) {
    if (codes.has(p.code)) {
      issues.push(`Duplicate code: ${p.code}`);
    }
    codes.add(p.code);
  }

  // 4. Category validity
  const validCategories = new Set([
    'balances-weighing', 'centrifugation', 'consumables-reagents',
    'evaporation-distillation', 'glassware-plasticware', 'liquid-handling',
    'measurement-analysis', 'mixing-stirring', 'safety-cleanroom',
    'sample-prep', 'temperature-control', 'quote-required',
  ]);
  for (const p of products) {
    if (!validCategories.has(p.category)) {
      issues.push(`Unknown category "${p.category}" on product ${p.code}`);
    }
  }

  // 5. Tier check: no Tier C in non-quote-required category
  for (const p of products) {
    if (p.tier === 'C' && p.category !== 'quote-required') {
      warnings++;
    }
  }

  // 6. Tier A price sanity
  const tierA = products.filter(p => p.tier === 'A');
  const tierANoPrice = tierA.filter(p => !p.priceIncl);
  if (tierANoPrice.length) {
    process.stdout.write(`Warning: ${tierANoPrice.length} Tier A products have no price\n`);
    warnings++;
  }

  // Report
  console.log('\n=== Catalogue Validation ===');
  console.log(`Products: ${products.length}`);
  console.log(`Unique slugs: ${slugs.size}`);
  console.log(`Tier A: ${tierA.length}, Tier B: ${products.filter(p => p.tier === 'B').length}, Tier C: ${products.filter(p => p.tier === 'C').length}`);

  if (issues.length === 0 && warnings === 0) {
    console.log('\n✓ No issues found');
  } else {
    if (warnings > 0) console.log(`\n${warnings} warning(s)`);
    if (issues.length > 0) {
      console.log(`\n${issues.length} error(s):`);
      issues.forEach(i => console.log(`  ✗ ${i}`));
      process.exit(1);
    }
  }
}

main();
