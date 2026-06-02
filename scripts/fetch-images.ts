/**
 * fetch-images.ts
 *
 * Fetches manufacturer product images for the Labex catalogue.
 *
 * IMPORTANT RULES:
 *   - Never invent a URL
 *   - Never use AI-generated imagery
 *   - Never scrape a competitor site
 *   - If no image can be confirmed: set imageStatus = 'needs-review' and log to failures file
 *
 * Manufacturer URL sources must be added manually to MANUFACTURER_SOURCES below
 * after verifying the URLs are real and the images are licensed for distribution.
 *
 * Usage: npm run images:fetch
 */

import path from 'path';
import fs from 'fs';
import https from 'https';
import type { ImageManifest, ImageManifestEntry } from '../lib/catalogue-types';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'image-manifest.json');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'products');
const FAILURES_LOG = path.join(ROOT, 'image-fetch-failures.log');

// Add manufacturer image URLs here after manual verification.
// Format: product code → confirmed image URL from manufacturer's website
// Source: direct inspection of manufacturer page on 2026-05-21
const MANUFACTURER_SOURCES: Record<string, string> = {
  // ─── Atago ───────────────────────────────────────────────────────────────
  // POLAX-2L polarimeter — confirmed on atago.net/en/products-polarimeter-top.php
  '5223': 'https://www.atago.net/images/products/img_m/polax-2l_m.jpg',
  // AP100 polarimeter — AP-100 discontinued; AP-300 is current replacement
  // FLAG: confirm with Mandy before using AP-300 image for AP-100 listing
  'AP100': 'https://www.atago.net/images/products/img_m/ap-300_m.jpg',
};

function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const manifest: ImageManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const failures: string[] = [];
  let fetched = 0;
  let skipped = 0;

  for (const entry of manifest.products) {
    const url = MANUFACTURER_SOURCES[entry.code];

    if (!url) {
      // No source configured — leave as-is
      skipped++;
      continue;
    }

    if (entry.imageStatus === 'verified') {
      skipped++;
      continue;
    }

    const ext = url.split('.').pop()?.split('?')[0] ?? 'jpg';
    const localPath = `/images/products/${entry.slug}.${ext}`;
    const localDiskPath = path.join(ROOT, 'public', localPath);

    try {
      await downloadImage(url, localDiskPath);
      entry.imageStatus = 'verified';
      entry.imageUrl = url;
      entry.localPath = localPath;
      entry.lastChecked = new Date().toISOString().split('T')[0];
      fetched++;
      console.log(`  ✓ ${entry.code} → ${localPath}`);
    } catch (err) {
      entry.imageStatus = 'needs-review';
      entry.lastChecked = new Date().toISOString().split('T')[0];
      const msg = `${entry.code}: ${url} — ${(err as Error).message}`;
      failures.push(msg);
      console.error(`  ✗ ${msg}`);
    }
  }

  // Save updated manifest
  manifest.generated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  // Write failures log
  if (failures.length) {
    fs.appendFileSync(FAILURES_LOG, `\n=== ${new Date().toISOString()} ===\n${failures.join('\n')}\n`);
  }

  console.log(`\nDone. Fetched: ${fetched}, Skipped: ${skipped}, Failed: ${failures.length}`);
  if (failures.length) {
    console.log(`Failures logged to: image-fetch-failures.log`);
  }
}

main().catch(console.error);
