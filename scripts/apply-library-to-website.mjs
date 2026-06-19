// PART C — point the website catalogue at the real library images.
// Updates data/image-manifest.json entries for every code that gained a real
// image in public/images/products, then you re-run `npm run build:catalogue`
// (which merges this manifest, preserving the image fields).
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PRODUCTS_DIR = path.join(ROOT, 'public', 'images', 'products');
const MANIFEST = path.join(ROOT, 'data', 'image-manifest.json');
const today = new Date().toISOString().split('T')[0];

const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const byCode = new Map(manifest.products.map((p) => [p.code, p]));

let updated = 0;
const missing = [];
for (const file of files) {
  const code = file.replace(/\.(jpe?g|png)$/i, '');
  const entry = byCode.get(code);
  if (!entry) { missing.push(code); continue; }
  const url = `/images/products/${file}`;
  entry.imageStatus = 'verified';
  entry.imageUrl = url;
  entry.localPath = url;
  entry.imageSource = 'labex-image-library';
  entry.sourceUrl = null;
  entry.reviewStatus = 'approved';
  entry.lastChecked = today;
  entry.imagePaths = { thumbnail: url, card: url, hero: url };
  entry.reviewNote = 'Real product image from the Labex image library (filename = code).';
  updated += 1;
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
console.log(`Website manifest: ${updated} entries set to verified with library images.`);
if (missing.length) console.log(`  No manifest entry for: ${missing.join(', ')}`);
