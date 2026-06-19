// PART A — Build the product image library from Images/.
//
// - Ingests every image under Images/ (code = filename stem, brand = subfolder).
// - Optimises to max 600px, compressed, into Images/_optimized/ (originals
//   untouched).
// - Matches each code (exact, case-insensitive) against the real product-code
//   universe (website catalogue + full price-list export).
// - Copies MATCHED optimised images, keyed by their canonical real code, into
//   BOTH app public dirs.
// - Writes the master manifest image-library-manifest.json and the per-app
//   lookup files.
// - Flags duplicate codes and non-clean filenames for review — never guesses.
//
// Run from the Labex root (has sharp):  node scripts/build-image-library.mjs
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const IMAGES = path.join(ROOT, 'Images');
const OPT_DIR = path.join(IMAGES, '_optimized');
const WEB_PUBLIC = path.join(ROOT, 'public', 'images', 'products');
const CRM_PUBLIC = path.join(ROOT, 'Labex_CRM', 'apps', 'web', 'public', 'products');
const CRM_LOOKUP = path.join(ROOT, 'Labex_CRM', 'apps', 'web', 'src', 'lib', 'pdf', 'product-images.json');
const MASTER_MANIFEST = path.join(ROOT, 'image-library-manifest.json');

const MAX_DIM = 600;
const IMG_RE = /\.(jpe?g|png)$/i;

// ── 1. Walk Images/ (skip the _optimized output dir) ──
function walk(dir, brand = null) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (dir === IMAGES && name === '_optimized') continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) out.push(...walk(full, brand ?? name));
    else if (IMG_RE.test(name)) {
      const ext = name.match(IMG_RE)[1].toLowerCase();
      out.push({
        full,
        brand: brand ?? 'ROOT',
        stem: name.replace(IMG_RE, '').trim(),
        srcExt: ext,
      });
    }
  }
  return out;
}
const imgs = walk(IMAGES);
console.log(`Image files ingested: ${imgs.length}`);

// A "clean" code is a normal product code: no embedded image extension, non-empty.
const NONCLEAN_RE = /(jpe?g|png)$/i;
function cleanedVariant(stem) {
  // "C5020TJPG" -> "C5020T" (an image extension fused onto the code)
  return stem.replace(NONCLEAN_RE, '').trim();
}

// ── 2. Real product-code universe ──
function codesFromCsv(file) {
  const m = new Map(); // lowercased -> canonical
  const lines = fs.readFileSync(path.join(ROOT, file), 'utf8').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split(',')[0].trim();
    if (c) m.set(c.toLowerCase(), c);
  }
  return m;
}
const catMap = codesFromCsv('labex-real-catalogue.csv');     // website catalogue
const plMap = codesFromCsv('ItemExport.csv');                // full price-list export
const realAny = new Map([...plMap, ...catMap]);              // canonical for any real code
console.log(`Real codes — catalogue: ${catMap.size}, price-list: ${plMap.size}`);

function sanitizeFile(code, ext) {
  return code.replace(/[^A-Za-z0-9._-]+/g, '_') + '.' + (ext === 'jpeg' ? 'jpg' : ext);
}

// ── 3. Classify every image (match + canonical real code) in a pre-pass ──
// matchKey = the real code (case-insensitive) this image resolves to, if any.
for (const im of imgs) {
  const key = im.stem.toLowerCase();
  im.isNonClean = NONCLEAN_RE.test(im.stem) || im.stem === '';
  let matchKey = key;
  let canonical = realAny.get(key) ?? null;
  if (!canonical && im.isNonClean) {
    const cv = cleanedVariant(im.stem).toLowerCase();
    if (realAny.has(cv)) { canonical = realAny.get(cv); matchKey = cv; }
  }
  im.matchKey = canonical ? matchKey : null;
  im.canonical = canonical;
  im.inCatalogue = canonical ? catMap.has(matchKey) : false;
  im.inPriceList = canonical ? (plMap.has(matchKey) || im.inCatalogue) : false;
}

// Block codes claimed by >1 file — both raw-stem duplicates AND two different
// files resolving to the same real code. A wrong image on a customer quote is a
// real error, so these are listed for review and NEVER auto-wired.
function tally(keyFn) {
  const m = new Map();
  for (const im of imgs) { const k = keyFn(im); if (!k) continue; (m.get(k) ?? m.set(k, []).get(k)).push(im); }
  return m;
}
const stemGroups = tally((im) => im.stem.toLowerCase());
const matchGroups = tally((im) => im.matchKey);
const blockedStems = new Set([...stemGroups].filter(([, v]) => v.length > 1).map(([k]) => k));
const blockedMatch = new Set([...matchGroups].filter(([, v]) => v.length > 1).map(([k]) => k));

// ── 4. Optimise + classify + copy ──
fs.mkdirSync(OPT_DIR, { recursive: true });
fs.mkdirSync(WEB_PUBLIC, { recursive: true });
fs.mkdirSync(CRM_PUBLIC, { recursive: true });

const manifest = [];
const report = {
  total: imgs.length,
  matchedCatalogue: 0,
  matchedPriceList: 0,   // matched price-list (incl. catalogue, since catalogue ⊂ real)
  unmatched: 0,
  duplicates: [],
  nonClean: [],
  copiedWeb: 0,
  copiedCrm: 0,
};
const crmLookup = {};     // normKey -> "products/<file>"

async function optimise(srcPath, destPath, ext) {
  let pipe = sharp(srcPath).rotate().resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true });
  if (ext === 'png') pipe = pipe.png({ compressionLevel: 9, palette: true });
  else pipe = pipe.jpeg({ quality: 78, mozjpeg: true });
  await pipe.toFile(destPath);
}

for (const im of imgs) {
  const { isNonClean, matchKey, canonical, inCatalogue, inPriceList } = im;
  const isDup = blockedStems.has(im.stem.toLowerCase()) || (matchKey && blockedMatch.has(matchKey));

  // Optimised library file (always produced, keyed by sanitised stem/canonical).
  const libCode = canonical ?? im.stem;
  const libFile = sanitizeFile(libCode, im.srcExt);
  const optPath = path.join(OPT_DIR, libFile);
  try {
    await optimise(im.full, optPath, im.srcExt === 'jpeg' ? 'jpg' : im.srcExt);
  } catch (e) {
    console.warn(`  ! optimise failed: ${im.brand}/${im.stem} — ${e.message}`);
    continue;
  }

  const entry = {
    code: libCode,
    brand: im.brand,
    sourceFile: path.relative(ROOT, im.full).replace(/\\/g, '/'),
    optimized: path.relative(ROOT, optPath).replace(/\\/g, '/'),
    match: inCatalogue ? 'catalogue' : inPriceList ? 'price-list' : 'unmatched',
    duplicate: isDup,
    nonClean: isNonClean,
  };
  manifest.push(entry);

  if (isDup) report.duplicates.push(`${im.brand}/${im.stem}`);
  if (isNonClean) report.nonClean.push(`${im.brand}/${im.stem} (-> ${cleanedVariant(im.stem) || '∅'})`);

  // Wire ONLY clean, non-conflicting exact matches (never guess on a customer doc).
  const wireable = (inPriceList || inCatalogue) && !isDup;
  if (!wireable) {
    if (inCatalogue) report.matchedCatalogue++;     // count match even if held back
    if (inPriceList) report.matchedPriceList++;
    if (!inPriceList) report.unmatched++;
    continue;
  }

  const appFile = sanitizeFile(canonical, im.srcExt);
  // CRM: every real (price-list) match
  if (inPriceList) {
    fs.copyFileSync(optPath, path.join(CRM_PUBLIC, appFile));
    crmLookup[matchKey] = `products/${appFile}`;
    report.matchedPriceList++;
    report.copiedCrm++;
  }
  // Website: catalogue matches
  if (inCatalogue) {
    fs.copyFileSync(optPath, path.join(WEB_PUBLIC, appFile));
    report.matchedCatalogue++;
    report.copiedWeb++;
  }
  if (!inPriceList) report.unmatched++;
}

// ── 5. Write manifests ──
fs.writeFileSync(MASTER_MANIFEST, JSON.stringify({
  generated: new Date().toISOString(),
  total: manifest.length,
  matchedCatalogue: report.matchedCatalogue,
  matchedPriceList: report.matchedPriceList,
  unmatched: report.unmatched,
  products: manifest.sort((a, b) => a.code.localeCompare(b.code)),
}, null, 2));
fs.mkdirSync(path.dirname(CRM_LOOKUP), { recursive: true });
fs.writeFileSync(CRM_LOOKUP, JSON.stringify(crmLookup, null, 2));

// ── 6. Report ──
console.log('\n=== PART A — image library ===');
console.log(`Optimised images        : ${manifest.length}`);
console.log(`Matched to catalogue     : ${report.matchedCatalogue}  (copied to website: ${report.copiedWeb})`);
console.log(`Matched to price-list    : ${report.matchedPriceList}  (copied to CRM: ${report.copiedCrm})`);
console.log(`Unmatched                : ${report.unmatched}`);
console.log(`Duplicate-code files     : ${report.duplicates.length} (held back from wiring)`);
console.log(`Non-clean filenames      : ${report.nonClean.length}`);
console.log(`\nCRM lookup entries: ${Object.keys(crmLookup).length} -> ${path.relative(ROOT, CRM_LOOKUP)}`);

fs.writeFileSync(path.join(ROOT, '.image-library-report.json'), JSON.stringify(report, null, 2));
console.log('Full report -> .image-library-report.json');
