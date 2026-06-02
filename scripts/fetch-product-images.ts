/**
 * fetch-product-images.ts
 *
 * Fetches manufacturer product images for Tier A products.
 * Run pilot first (PILOT_MODE=true), then full run on "go".
 *
 * Rules (non-negotiable):
 *   - Never invent a URL
 *   - Never use AI imagery
 *   - Never scrape a competitor site
 *   - Respect robots.txt
 *   - Rate limit: 1 req / 2s per domain, max 3 domains concurrent
 *   - User-Agent: Labex Catalogue Build
 *
 * Usage:
 *   npm run images:fetch               → full run
 *   PILOT=true npm run images:fetch    → pilot 10 only
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { parseCatalogueCSV } from '../lib/csv-parser';
import { inferBrand } from '../lib/brand-inferrer';
import { getBrandSource } from '../data/brand-sources';
import { classifyTier } from '../lib/tier-classifier';
import type { ImageManifest, ImageManifestEntry } from '../lib/catalogue-types';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'image-manifest.json');
const FAILURES_LOG = path.join(ROOT, 'image-fetch-failures.log');
const UNBRANDED_LOG = path.join(ROOT, 'unbranded-products.log');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'products');
const CSV_PATH = path.join(ROOT, 'labex-real-catalogue.csv');
const USER_AGENT = 'Labex Catalogue Build (sales@labex.co.za)';
const REQUEST_TIMEOUT_MS = 15000;
const RATE_LIMIT_MS = 2000;
const MAX_DOMAIN_CONCURRENCY = 3;
const DOMAIN_FAIL_PAUSE_COUNT = 5;
const DOMAIN_FAIL_PAUSE_MS = 10 * 60 * 1000; // 10 min

const PILOT_SKUS = new Set([
  '50600.02', '3251', '8005100', 'HL-350', 'AP100',
  'DF8154', 'UDF-025/340-CO2', 'FSIE-RH40', 'SF/MF450', '5223',
]);

// ─── Per-domain rate limiting ────────────────────────────────────────────────
const domainLastRequest = new Map<string, number>();
const domainFailCounts = new Map<string, number>();
const domainPausedUntil = new Map<string, number>();

async function rateLimitedFetch(url: string): Promise<string> {
  const domain = new URL(url).hostname;
  const now = Date.now();

  // Check if domain is paused
  const pausedUntil = domainPausedUntil.get(domain) ?? 0;
  if (now < pausedUntil) {
    throw new Error(`Domain ${domain} paused until ${new Date(pausedUntil).toISOString()}`);
  }

  // Rate limit
  const lastReq = domainLastRequest.get(domain) ?? 0;
  const wait = RATE_LIMIT_MS - (now - lastReq);
  if (wait > 0) {
    await new Promise(r => setTimeout(r, wait));
  }
  domainLastRequest.set(domain, Date.now());

  return fetchUrl(url);
}

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const lib = isHttps ? https : http;

    const timeout = setTimeout(() => {
      req.destroy();
      reject(new Error(`Timeout after ${REQUEST_TIMEOUT_MS}ms`));
    }, REQUEST_TIMEOUT_MS);

    const req = lib.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en',
      },
    }, (res) => {
      clearTimeout(timeout);

      // Follow redirects — resolve relative redirect URLs against base
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const location = res.headers.location;
        const resolved = location.startsWith('http') ? location : new URL(location, url).href;
        resolve(fetchUrl(resolved));
        return;
      }

      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function downloadBinary(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const lib = isHttps ? https : http;
    const file = fs.createWriteStream(dest);

    const timeout = setTimeout(() => {
      file.close();
      fs.unlink(dest, () => {});
      reject(new Error(`Download timeout`));
    }, REQUEST_TIMEOUT_MS);

    lib.get(url, {
      headers: { 'User-Agent': USER_AGENT },
    }, (res) => {
      clearTimeout(timeout);

      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        resolve(downloadBinary(res.headers.location, dest));
        return;
      }

      const contentType = res.headers['content-type'] ?? '';
      if (!contentType.startsWith('image/')) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Not an image: ${contentType}`));
        return;
      }

      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      clearTimeout(timeout);
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// ─── Minimal robots.txt check ────────────────────────────────────────────────
const robotsCache = new Map<string, boolean>(); // domain → allowed

async function isAllowedByRobots(url: string): Promise<boolean> {
  const { hostname, protocol } = new URL(url);
  if (robotsCache.has(hostname)) return robotsCache.get(hostname)!;

  try {
    const robotsUrl = `${protocol}//${hostname}/robots.txt`;
    const text = await fetchUrl(robotsUrl);

    // Only check the User-agent: * section (not other bots' sections)
    // Split on User-agent: lines, find the one for *
    const sections = text.split(/\n(?=User-agent:)/i);
    const starSection = sections.find(s => /^User-agent:\s*\*/i.test(s));

    if (starSection) {
      // Block only if there is a blanket "Disallow: /" with nothing else after the slash
      const blocked = /^Disallow:\s*\/\s*$/im.test(starSection);
      robotsCache.set(hostname, !blocked);
      return !blocked;
    }

    robotsCache.set(hostname, true);
    return true;
  } catch {
    robotsCache.set(hostname, true);
    return true;
  }
}

// ─── Image extraction from HTML ──────────────────────────────────────────────
function extractImageUrl(html: string, baseUrl: string, cssSelector: string): string | null {
  const $ = cheerio.load(html);

  // 1. og:image
  const ogImage = $('meta[property="og:image"]').attr('content') ?? $('meta[name="og:image"]').attr('content');
  if (ogImage) return resolveUrl(ogImage, baseUrl);

  // 2. twitter:image
  const twImage = $('meta[name="twitter:image"]').attr('content');
  if (twImage) return resolveUrl(twImage, baseUrl);

  // 3. Custom selector from brand source
  const selectors = cssSelector.split(',').map(s => s.trim());
  for (const sel of selectors) {
    const src = $(sel).first().attr('src') ?? $(sel).first().attr('data-src');
    if (src) return resolveUrl(src, baseUrl);
  }

  // 4. itemprop="image"
  const itempropImg = $('[itemprop="image"]').first().attr('src') ?? $('[itemprop="image"]').first().attr('content');
  if (itempropImg) return resolveUrl(itempropImg, baseUrl);

  // 5. Largest img by width attribute
  let bestSrc: string | null = null;
  let bestWidth = 0;
  $('img').each((_, el) => {
    const w = parseInt($(el).attr('width') ?? '0', 10);
    const src = $(el).attr('src') ?? $(el).attr('data-src');
    if (w > bestWidth && src && !src.includes('logo') && !src.includes('icon')) {
      bestWidth = w;
      bestSrc = src;
    }
  });
  if (bestSrc) return resolveUrl(bestSrc, baseUrl);

  return null;
}

function resolveUrl(src: string, base: string): string {
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  if (src.startsWith('//')) return `https:${src}`;
  if (src.startsWith('/')) {
    const { protocol, hostname } = new URL(base);
    return `${protocol}//${hostname}${src}`;
  }
  return new URL(src, base).href;
}

// ─── Sharp processing ─────────────────────────────────────────────────────────
async function processImage(inputPath: string, brandSlug: string, skuSlug: string): Promise<Record<string, string>> {
  const brandDir = path.join(IMAGES_DIR, brandSlug);
  fs.mkdirSync(brandDir, { recursive: true });

  const sizes = { thumbnail: 400, card: 800, hero: 1600 };
  const paths: Record<string, string> = {};

  for (const [size, width] of Object.entries(sizes)) {
    const outFile = `${skuSlug}-${size}.webp`;
    const outPath = path.join(brandDir, outFile);
    await sharp(inputPath).resize(width, undefined, { withoutEnlargement: true }).webp({ quality: 85 }).toFile(outPath);
    paths[size] = `/images/products/${brandSlug}/${outFile}`;
  }

  return paths;
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ─── Main fetch logic per product ────────────────────────────────────────────
interface FetchResult {
  code: string;
  brand: string | null;
  imageUrl: string | null;
  localPaths: Record<string, string> | null;
  status: 'verified' | 'needs-review' | 'skipped' | 'unbranded';
  note: string;
}

async function fetchForProduct(entry: ImageManifestEntry, description: string): Promise<FetchResult> {
  const code = entry.code;
  const inference = inferBrand(code, description);

  if (!inference.brand) {
    return { code, brand: null, imageUrl: null, localPaths: null, status: 'unbranded', note: 'No brand inferred' };
  }

  const brandSrc = getBrandSource(inference.brand);
  if (!brandSrc) {
    return { code, brand: inference.brand, imageUrl: null, localPaths: null, status: 'needs-review', note: `No source map entry for brand: ${inference.brand}` };
  }

  // Build search URL
  const query = encodeURIComponent(`${inference.brand} ${inference.model ?? code}`);
  const searchUrl = brandSrc.searchUrl
    ? brandSrc.searchUrl.replace('{query}', query)
    : brandSrc.productListUrl;

  // Check robots.txt
  const allowed = await isAllowedByRobots(searchUrl);
  if (!allowed) {
    return { code, brand: inference.brand, imageUrl: null, localPaths: null, status: 'needs-review', note: `robots.txt disallows ${brandSrc.domain}` };
  }

  // Fetch page HTML
  let html: string;
  try {
    html = await rateLimitedFetch(searchUrl);
  } catch (err) {
    const domain = brandSrc.domain;
    const fails = (domainFailCounts.get(domain) ?? 0) + 1;
    domainFailCounts.set(domain, fails);
    if (fails >= DOMAIN_FAIL_PAUSE_COUNT) {
      domainPausedUntil.set(domain, Date.now() + DOMAIN_FAIL_PAUSE_MS);
    }
    return { code, brand: inference.brand, imageUrl: null, localPaths: null, status: 'needs-review', note: `Fetch failed: ${(err as Error).message} (URL: ${searchUrl})` };
  }

  // Reset fail count on success
  domainFailCounts.set(brandSrc.domain, 0);

  // Extract image URL
  const imageUrl = extractImageUrl(html, searchUrl, brandSrc.imageSelector);
  if (!imageUrl) {
    return { code, brand: inference.brand, imageUrl: null, localPaths: null, status: 'needs-review', note: `No image found on page: ${searchUrl}` };
  }

  // Download image
  const brandSlug = toSlug(inference.brand);
  const skuSlug = toSlug(code);
  const brandDir = path.join(IMAGES_DIR, brandSlug);
  fs.mkdirSync(brandDir, { recursive: true });
  const tempPath = path.join(brandDir, `${skuSlug}-original`);

  try {
    await downloadBinary(imageUrl, tempPath);
  } catch (err) {
    return { code, brand: inference.brand, imageUrl, localPaths: null, status: 'needs-review', note: `Download failed: ${(err as Error).message}` };
  }

  // Process with Sharp
  let localPaths: Record<string, string>;
  try {
    localPaths = await processImage(tempPath, brandSlug, skuSlug);
    fs.unlink(tempPath, () => {}); // clean up original
  } catch (err) {
    fs.unlink(tempPath, () => {});
    return { code, brand: inference.brand, imageUrl, localPaths: null, status: 'needs-review', note: `Sharp processing failed: ${(err as Error).message}` };
  }

  return { code, brand: inference.brand, imageUrl, localPaths, status: 'verified', note: `Source: ${searchUrl}` };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const isPilot = process.env.PILOT === 'true';
  console.log(isPilot ? '\n=== PILOT RUN (10 products) ===' : '\n=== FULL RUN ===');

  // Load manifest and CSV
  const manifest: ImageManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const rows = parseCatalogueCSV(CSV_PATH);
  const descByCode = new Map(rows.map(r => [r.code, r.description]));

  // Build tier map from CSV (manifest entries may not have tier field)
  const tierByCode = new Map(rows.map(r => [r.code, classifyTier(r.priceIncl, r.inferredCategory)]));

  // Filter to Tier A products (or pilot SKUs) that need images
  const targets = manifest.products.filter(e => {
    if (e.imageStatus === 'verified') return false;
    if (isPilot) return PILOT_SKUS.has(e.code); // pilot: exact SKU list
    const tier = tierByCode.get(e.code);
    return tier === 'A'; // full run: Tier A only
  });

  console.log(`Target products: ${targets.length}`);

  const failures: string[] = [];
  const unbranded: string[] = [];
  let verified = 0;
  let needsReview = 0;

  // Process with limited concurrency (simple sequential for pilot; queue for full)
  for (const entry of targets) {
    const description = descByCode.get(entry.code) ?? '';
    process.stdout.write(`  ${entry.code}... `);

    const result = await fetchForProduct(entry, description);

    switch (result.status) {
      case 'verified':
        entry.imageStatus = 'verified';
        entry.imageUrl = result.imageUrl ?? null;
        entry.localPath = result.localPaths?.card ?? null;
        entry.lastChecked = new Date().toISOString().split('T')[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (result.localPaths) (entry as any).imagePaths = result.localPaths;
        console.log(`✓ ${result.imageUrl}`);
        verified++;
        break;

      case 'unbranded':
        entry.imageStatus = 'needs-review';
        console.log(`⚠ unbranded`);
        unbranded.push(`${entry.code}\t${description.substring(0, 60)}`);
        needsReview++;
        break;

      case 'needs-review':
      default:
        entry.imageStatus = 'needs-review';
        entry.lastChecked = new Date().toISOString().split('T')[0];
        console.log(`✗ ${result.note}`);
        failures.push(`${entry.code}: ${result.note}`);
        needsReview++;
        break;
    }
  }

  // Save manifest
  manifest.generated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  // Write logs
  if (failures.length) {
    fs.appendFileSync(FAILURES_LOG, `\n=== ${new Date().toISOString()} (${isPilot ? 'PILOT' : 'FULL'}) ===\n${failures.join('\n')}\n`);
  }
  if (unbranded.length) {
    fs.appendFileSync(UNBRANDED_LOG, `\n=== ${new Date().toISOString()} ===\n${unbranded.join('\n')}\n`);
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Verified: ${verified}  |  Needs review: ${needsReview}  |  Total: ${targets.length}`);
  if (failures.length) console.log(`Failures logged: image-fetch-failures.log`);
  if (unbranded.length) console.log(`Unbranded logged: unbranded-products.log`);
  if (isPilot) console.log('\n⏸  Pilot complete. Say "go" to run the full fetch.');
}

main().catch(console.error);
