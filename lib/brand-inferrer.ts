/**
 * brand-inferrer.ts
 *
 * Infers brand and model from product description + SKU code.
 * Extends the keyword list in brand-extractor.ts with SKU-prefix patterns.
 * Prefer false-negative (null) over false-positive — don't guess wildly.
 */

export type BrandSource = 'description' | 'sku-pattern' | 'inferred-uncertain';

export interface BrandInference {
  brand: string | null;
  brandSource: BrandSource | null;
  model: string | null;
}

// ─── Description keyword → brand name ───────────────────────────────────────
// Order matters: longer/more specific strings first to avoid partial matches
const DESCRIPTION_BRANDS: Array<[RegExp, string]> = [
  [/\bLabconco\b/i, 'Labconco'],
  [/\bHeidolph\b/i, 'Heidolph'],
  [/\bHei-VAP\b/i, 'Heidolph'],
  [/\bEppendorf\b/i, 'Eppendorf'],
  [/\bThermo\s*(Scientific|Fisher)?\b/i, 'Thermo Scientific'],
  [/\bSartorius\b/i, 'Sartorius'],
  [/\bCole.Parmer\b/i, 'Cole-Parmer'],
  [/\bBrand\s+GmbH\b/i, 'BRAND GmbH'],
  [/\bBüchner\b|\bBuchner\b/i, 'Hirschmann'],
  [/\bHirschmann\b/i, 'Hirschmann'],
  [/\bMemmert\b/i, 'Memmert'],
  [/\bBinder\b/i, 'Binder'],
  [/\bGerhardt\b/i, 'Gerhardt'],
  [/\bJulabo\b/i, 'Julabo'],
  [/\bLauda\b/i, 'Lauda'],
  [/\bHettich\b/i, 'Hettich'],
  [/\bHeraeus\b/i, 'Heraeus'],
  [/\bOhaus\b/i, 'Ohaus'],
  [/\bElma\b/i, 'Elma'],
  [/\bBuchi\b|\bBüchi\b/i, 'Buchi'],
  [/\bVELP\b/i, 'VELP'],
  [/\bVelp\b/i, 'VELP'],
  [/\bLLG\b/i, 'LLG Labware'],
  [/\bDWK\b/i, 'DWK Life Sciences'],
  [/\bDuran\b/i, 'Duran'],
  [/\bSchott\b/i, 'Schott'],
  [/\bWheaton\b/i, 'Wheaton'],
  [/\bKimble\b/i, 'Kimble'],
  [/\bIsolabor\b|\bIsolab\b/i, 'Isolab'],
  [/\bStarlab\b/i, 'Starlab'],
  [/\bBorosil\b/i, 'Borosil'],
  [/\bWiteg\b/i, 'Witeg'],
  [/\bKartell\b/i, 'Kartell'],
  [/\bPolax\b/i, 'Polax'],
  [/\bPolax\b/i, 'Atago'],      // POLAX-2L is an Atago product line
  [/\bAtago\b/i, 'Atago'],
  [/\bIKA\b/i, 'IKA'],
  [/\bSnijders\b/i, 'Snijders'],
  [/\bHuxley\b/i, 'Huxley'],
  [/\bGrant\b/i, 'Grant Instruments'],
  [/\bStuart\b/i, 'Stuart'],
  [/\bBenchmark\b/i, 'Benchmark Scientific'],
  [/\bBeoco\b/i, 'Beoco'],
  [/\bBiochrom\b/i, 'Biochrom'],
];

// ─── Description keyword → model extraction patterns ────────────────────────
const MODEL_PATTERNS: Array<[RegExp, number]> = [
  // IKA Ultra-Turrax
  [/\b(T\s*\d{2,3}(?:\s*basic)?|S\s*\d{2,3}\s*N)\b/i, 1],
  // Heidolph
  [/\b(Hei-VAP[\s\w-]*)\b/i, 1],
  // Atago polarimeter/refractometer
  [/\b(AP[\s-]?\d+|RX[\s-]?\d+)\b/i, 1],
  // Rotary evaporator R-xxx
  [/\b(R[\s-]?\d{3,4})\b/i, 1],
  // Autoclave HL-xxx
  [/\b(HL[\s-]\d+)\b/i, 1],
  // Labconco glove box 5xxxx
  [/\b(5\d{4,5}(?:\.\d{2})?)\b/, 1],
  // Generic model: letters + digits
  [/\b([A-Z]{2,6}[\s-]?\d{2,6}[A-Z0-9-]*)\b/, 1],
];

// ─── SKU prefix / pattern → brand ───────────────────────────────────────────
interface SkuRule {
  test: (code: string) => boolean;
  brand: string;
  source: BrandSource;
  modelExtract?: (code: string) => string | null;
}

const SKU_RULES: SkuRule[] = [
  {
    test: (c) => /^DF\d/i.test(c),
    brand: 'Snijders',
    source: 'sku-pattern',
    modelExtract: (c) => c,
  },
  {
    test: (c) => /^UDF/i.test(c),
    brand: 'Snijders',
    source: 'sku-pattern',
    modelExtract: (c) => c,
  },
  {
    test: (c) => /^HL-/i.test(c),
    brand: 'Huxley',
    source: 'sku-pattern',
    modelExtract: (c) => c,
  },
  {
    test: (c) => /^AP\d/i.test(c),
    brand: 'Atago',
    source: 'sku-pattern',
    modelExtract: (c) => c,
  },
  {
    test: (c) => /^RX-/i.test(c),
    brand: 'Atago',
    source: 'sku-pattern',
    modelExtract: (c) => c,
  },
  {
    test: (c) => /^5060|^5070|^5080/i.test(c),
    brand: 'Labconco',
    source: 'sku-pattern',
    modelExtract: (c) => c,
  },
  {
    test: (c) => /^800[35]\d{3}/i.test(c),
    brand: 'IKA',
    source: 'sku-pattern',
    modelExtract: () => null, // use description for model
  },
  {
    test: (c) => /^FSIE/i.test(c),
    brand: 'FSIE-unknown', // uncertain — flag for review
    source: 'inferred-uncertain',
  },
  {
    test: (c) => /^WS01/i.test(c),
    brand: 'WS01-local', // local brand — flag for review
    source: 'inferred-uncertain',
  },
];

// ─── Public API ──────────────────────────────────────────────────────────────

export function inferBrand(code: string, description: string): BrandInference {
  // 1. Try description keyword match
  for (const [regex, brand] of DESCRIPTION_BRANDS) {
    if (regex.test(description)) {
      const model = extractModel(description) ?? code;
      return { brand, brandSource: 'description', model };
    }
  }

  // 2. Try SKU prefix rules
  for (const rule of SKU_RULES) {
    if (rule.test(code)) {
      const model = rule.modelExtract ? rule.modelExtract(code) : null;
      return {
        brand: rule.brand,
        brandSource: rule.source,
        model: model ?? extractModel(description),
      };
    }
  }

  // 3. No match
  return { brand: null, brandSource: null, model: null };
}

function extractModel(description: string): string | null {
  for (const [regex, group] of MODEL_PATTERNS) {
    const match = description.match(regex);
    if (match?.[group]) return match[group].trim();
  }
  return null;
}
