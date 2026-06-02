/**
 * generate-placeholders.ts
 *
 * Generates Tier B category SVGs and Tier C abstract motif SVGs.
 * Output:
 *   /public/images/categories/[category-slug].svg    (one per category)
 *   /public/images/placeholders/tier-c/[motif].svg  (5 abstract motifs)
 *
 * Usage: pnpm run images:placeholders
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// ─── Silhouette paths — large, centred, ~300px tall on 800×600 canvas ────────
const SILHOUETTES: Record<string, string> = {
  'balances-weighing':
    // Balance scale: post, beam, two hanging pans, base
    'M395 120 L395 270 L405 270 L405 120 Z M370 112 L430 112 L430 120 L370 120 Z M230 260 L570 260 L570 272 L230 272 Z M230 266 L195 360 L265 360 Z M570 266 L535 360 L605 360 Z M175 360 L285 360 L285 388 L175 388 Z M515 360 L625 360 L625 388 L515 388 Z M370 388 L430 388 L430 420 L370 420 Z',

  'centrifugation':
    // Rotor: outer ring + inner ring + hub + 6 spokes
    'M400 110 m-150 0 a150 150 0 1 0 300 0 a150 150 0 1 0-300 0 M400 110 m-90 0 a90 90 0 1 0 180 0 a90 90 0 1 0-180 0 M400 110 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0-44 0 M400 110 L400 -40 M400 110 L530 43 M400 110 L530 177 M400 110 L400 260 M400 110 L270 177 M400 110 L270 43',

  'consumables-reagents':
    // Reagent bottle: rectangular body with neck and stopper
    'M320 110 L320 375 Q320 408 352 408 L448 408 Q480 408 480 375 L480 110 Z M320 175 L285 175 L285 215 L320 215 M480 175 L515 175 L515 215 L480 215 M332 110 L468 110 L462 82 L338 82 Z M355 82 L355 44 L445 44 L445 82 Z',

  'evaporation-distillation':
    // Round-bottom flask with side arm
    'M370 80 L370 240 Q310 265 280 310 Q255 350 255 390 Q255 435 290 435 Q310 450 400 450 Q490 450 510 435 Q545 435 545 390 Q545 350 520 310 Q490 265 430 240 L430 80 Z M375 80 L425 80 L425 68 L375 68 Z M430 180 L510 140 L530 155',

  'glassware-plasticware':
    // Erlenmeyer flask: straight neck → sloped shoulders → wide base
    'M355 68 L355 230 Q290 268 265 330 L265 398 Q265 418 292 418 L508 418 Q535 418 535 398 L535 330 Q510 268 445 230 L445 68 Z M360 68 L440 68 L440 56 L360 56 Z',

  'liquid-handling':
    // Pipette: long barrel with graduation marks and tip
    'M385 45 L385 395 Q385 420 400 420 Q415 420 415 395 L415 45 Z M380 80 L358 80 L358 108 L380 108 M380 136 L348 136 L348 172 L380 172 M380 220 L330 220 L330 270 L380 270 M420 80 L442 80 L442 52 L420 52',

  'measurement-analysis':
    // Circular gauge with concentric rings and needle
    'M400 110 m-190 0 a190 190 0 1 0 380 0 a190 190 0 1 0-380 0 M400 110 m-120 0 a120 120 0 1 0 240 0 a120 120 0 1 0-240 0 M400 110 L452 28 M400 110 L348 145 M400 110 m-14 0 a14 14 0 0 0 28 0 a14 14 0 0 0-28 0',

  'mixing-stirring':
    // Stirrer: shaft + impeller blades + swirl
    'M395 60 L395 380 L405 380 L405 60 Z M320 260 Q290 230 298 198 Q306 166 330 175 Q355 184 360 210 M480 260 Q510 230 502 198 Q494 166 470 175 Q445 184 440 210 M370 395 Q386 378 400 395 Q414 378 430 395 L430 415 L370 415 Z',

  'safety-cleanroom':
    // Shield outline with person silhouette inside
    'M400 52 L210 148 L210 358 L400 440 L590 358 L590 148 Z M360 440 L360 295 Q360 268 378 268 L422 268 Q440 268 440 295 L440 440 M400 190 m-38 0 a38 38 0 0 0 76 0 a38 38 0 0 0-76 0',

  'sample-prep':
    // Two test tubes side by side
    'M300 155 L300 370 Q300 405 325 405 L375 405 Q400 405 400 370 L400 155 Q400 128 375 122 L325 122 Q300 128 300 155 Z M315 122 L315 85 L385 85 L385 122 M345 85 L345 52 L355 52 L355 85 M440 155 L440 370 Q440 405 465 405 L515 405 Q540 405 540 370 L540 155 Q540 128 515 122 L465 122 Q440 128 440 155 Z M455 122 L455 85 L525 85 L525 122 M485 85 L485 52 L495 52 L495 85',

  'temperature-control':
    // Thermometer: long bulb tube with scale marks
    'M382 380 L382 148 Q382 122 400 122 Q418 122 418 148 L418 380 Q440 392 440 380 M382 380 Q360 392 360 380 M392 340 Q400 368 408 340 L408 148 L392 148 Z M340 265 L382 265 M340 305 L382 305 M340 225 L382 225 M340 185 L382 185 M400 122 m-32 0 a32 32 0 0 0 64 0 a32 32 0 0 0-64 0',

  'quote-required':
    // Large question mark
    'M400 80 m-100 0 a100 100 0 1 0 200 0 a100 100 0 1 0-200 0 M400 80 m-55 0 a55 55 0 1 0 110 0 a55 55 0 1 0-110 0 M395 248 L405 248 L405 310 L395 310 Z M392 325 L408 325 L408 348 L392 348 Z',
};

// ─── Abstract motifs for Tier C ───────────────────────────────────────────────
const TIER_C_MOTIFS: Record<string, string> = {
  waveform:
    'M60 300 Q120 210 180 300 Q240 390 300 300 Q360 210 420 300 Q480 390 540 300 Q600 210 660 300 Q720 390 740 300',
  molecular:
    'M300 300 m-38 0 a38 38 0 0 0 76 0 a38 38 0 0 0-76 0 M338 300 L400 248 M400 248 m-26 0 a26 26 0 0 0 52 0 a26 26 0 0 0-52 0 M426 248 L488 300 M488 300 m-26 0 a26 26 0 0 0 52 0 a26 26 0 0 0-52 0 M488 300 L462 362 M462 362 m-26 0 a26 26 0 0 0 52 0 a26 26 0 0 0-52 0 M376 300 L338 362 M338 362 m-26 0 a26 26 0 0 0 52 0 a26 26 0 0 0-52 0',
  circuit:
    'M130 180 L260 180 L260 158 L380 158 L380 180 L540 180 M540 180 L540 300 M540 300 L680 300 M260 180 L260 300 L380 300 L380 420 M420 240 m-24 0 a24 24 0 0 0 48 0 a24 24 0 0 0-48 0 M130 360 L200 360 L200 300 L320 300',
  orbital:
    'M400 300 m-140 0 a140 140 0 0 0 280 0 a140 140 0 0 0-280 0 M400 300 m-85 0 a85 85 0 0 0 170 0 a85 85 0 0 0-170 0 M400 300 m-28 0 a28 28 0 0 0 56 0 a28 28 0 0 0-56 0 M260 300 L540 300 M400 160 L400 440',
  schematic:
    'M120 180 L680 180 M120 240 L360 240 M480 240 L680 240 M360 240 L360 360 L480 360 L480 240 M120 300 L310 300 M530 300 L680 300 M120 420 L680 420',
};

// ─── Generators ──────────────────────────────────────────────────────────────

function generateCategorySVG(categorySlug: string, categoryName: string): string {
  const silhouette = SILHOUETTES[categorySlug] ?? SILHOUETTES['quote-required'];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A2A30"/>
      <stop offset="100%" stop-color="#1F1F25"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#FF6A1A" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FF6A1A" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background — noticeably lighter than card surface #141416 -->
  <rect width="800" height="600" fill="url(#bg)"/>

  <!-- Orange corner glow -->
  <rect width="800" height="600" fill="url(#glow)"/>

  <!-- Large centred silhouette -->
  <path d="${silhouette}" fill="#FFFFFF" opacity="0.22"/>

  <!-- Category name — dominant element -->
  <text x="400" y="468" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="42" font-weight="700" fill="#FFFFFF" opacity="0.95" text-anchor="middle">${categoryName}</text>

  <!-- Orange divider under name -->
  <line x1="340" y1="484" x2="460" y2="484" stroke="#FF6A1A" stroke-width="2" opacity="0.70"/>

  <!-- Bottom tag -->
  <text x="400" y="554" font-family="monospace, 'Courier New'" font-size="11" letter-spacing="2" fill="#FFFFFF" opacity="0.50" text-anchor="middle">Product photography in progress</text>
</svg>`;
}

function generateTierCSVG(motifSlug: string): string {
  const motif = TIER_C_MOTIFS[motifSlug] ?? TIER_C_MOTIFS['waveform'];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2A2A30"/>
      <stop offset="100%" stop-color="#1F1F25"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#FF6A1A" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#FF6A1A" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#bg)"/>

  <!-- Orange corner glow -->
  <rect width="800" height="600" fill="url(#glow)"/>

  <!-- Abstract motif — prominent orange -->
  <path d="${motif}" fill="none" stroke="#FF6A1A" stroke-width="3" opacity="0.28" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Quote required heading -->
  <text x="400" y="448" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-size="38" font-weight="600" fill="#FFFFFF" opacity="0.95" text-anchor="middle">Quote required</text>

  <!-- Orange divider -->
  <line x1="340" y1="464" x2="460" y2="464" stroke="#FF6A1A" stroke-width="2" opacity="0.70"/>

  <!-- Subtitle -->
  <text x="400" y="496" font-family="monospace, 'Courier New'" font-size="12" letter-spacing="1" fill="#FFFFFF" opacity="0.50" text-anchor="middle">Custom build · 24-hour response</text>
</svg>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // --- Tier B: category SVGs ---
  const categoriesDir = path.join(ROOT, 'public', 'images', 'categories');
  fs.mkdirSync(categoriesDir, { recursive: true });

  const CATEGORIES = [
    { slug: 'balances-weighing', name: 'Balances & Weighing' },
    { slug: 'centrifugation', name: 'Centrifugation' },
    { slug: 'consumables-reagents', name: 'Consumables & Reagents' },
    { slug: 'evaporation-distillation', name: 'Evaporation & Distillation' },
    { slug: 'glassware-plasticware', name: 'Glassware & Plasticware' },
    { slug: 'liquid-handling', name: 'Liquid Handling' },
    { slug: 'measurement-analysis', name: 'Measurement & Analysis' },
    { slug: 'mixing-stirring', name: 'Mixing & Stirring' },
    { slug: 'safety-cleanroom', name: 'Safety & Cleanroom' },
    { slug: 'sample-prep', name: 'Sample Preparation' },
    { slug: 'temperature-control', name: 'Temperature Control' },
    { slug: 'quote-required', name: 'Quote Required' },
  ];

  for (const cat of CATEGORIES) {
    const svg = generateCategorySVG(cat.slug, cat.name);
    const outPath = path.join(categoriesDir, `${cat.slug}.svg`);
    fs.writeFileSync(outPath, svg, 'utf8');
    console.log(`  ✓ ${cat.slug}.svg`);
  }

  // --- Tier C: abstract motif SVGs ---
  const tierCDir = path.join(ROOT, 'public', 'images', 'placeholders', 'tier-c');
  fs.mkdirSync(tierCDir, { recursive: true });

  for (const motif of Object.keys(TIER_C_MOTIFS)) {
    const svg = generateTierCSVG(motif);
    const outPath = path.join(tierCDir, `${motif}.svg`);
    fs.writeFileSync(outPath, svg, 'utf8');
    console.log(`  ✓ tier-c/${motif}.svg`);
  }

  console.log('\n✓ Placeholder generation complete.');
  console.log(`  ${CATEGORIES.length} category SVGs → public/images/categories/`);
  console.log(`  ${Object.keys(TIER_C_MOTIFS).length} Tier C motifs → public/images/placeholders/tier-c/`);
}

main().catch(console.error);
