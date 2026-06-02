/**
 * audit-images.ts
 *
 * Reports the current state of the image manifest.
 * Use this to see which products still need images.
 *
 * Usage: npm run images:audit
 */

import path from 'path';
import fs from 'fs';
import type { ImageManifest } from '../lib/catalogue-types';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'image-manifest.json');

function main() {
  const manifest: ImageManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

  const counts: Record<string, number> = {};
  for (const p of manifest.products) {
    counts[p.imageStatus] = (counts[p.imageStatus] ?? 0) + 1;
  }

  console.log(`\n=== Image Manifest Audit — ${manifest.generated} ===`);
  console.log(`Total products: ${manifest.total}`);
  console.log('');
  console.log('By imageStatus:');
  for (const [status, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / manifest.total) * 100).toFixed(1);
    console.log(`  ${status.padEnd(20)} ${count.toString().padStart(4)}  (${pct}%)`);
  }

  const needsReview = manifest.products.filter(p => p.imageStatus === 'needs-review');
  if (needsReview.length) {
    console.log(`\nProducts needing review (${needsReview.length}):`);
    for (const p of needsReview.slice(0, 20)) {
      console.log(`  ${p.code} — ${p.slug}`);
    }
    if (needsReview.length > 20) {
      console.log(`  ... and ${needsReview.length - 20} more`);
    }
  }

  const reviewStatus: Record<string, number> = {};
  for (const p of manifest.products) {
    reviewStatus[p.reviewStatus] = (reviewStatus[p.reviewStatus] ?? 0) + 1;
  }
  console.log('\nBy reviewStatus:');
  for (const [status, count] of Object.entries(reviewStatus)) {
    console.log(`  ${status.padEnd(20)} ${count}`);
  }
}

main();
