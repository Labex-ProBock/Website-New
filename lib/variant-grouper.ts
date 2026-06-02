import type { CatalogueProduct, ImageStatus, ReviewStatus, ProductTier } from "@/lib/catalogue-types";

export interface ProductVariant {
  code: string;
  slug: string;
  name: string;
  sizeLabel: string;
  priceIncl: number | null;
  priceExcl: number | null;
  qtyOnHand: number;
  tier: ProductTier;
  imageStatus: ImageStatus;
}

export interface ProductGroup {
  groupId: string;
  baseName: string;
  brand: string | null;
  category: string;
  subcategory: string | null;
  tier: ProductTier;
  imageStatus: ImageStatus;
  reviewStatus: ReviewStatus;
  variants: ProductVariant[];
  representativeSku: string;
  priceMin: number | null;
  priceMax: number | null;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Compound variant patterns — extract a SECONDARY spec as the variant token,
// leaving the primary dimension intact in the base name.
// Order matters: try more specific patterns first.
// ---------------------------------------------------------------------------

// 1. Micron-unit measurements: "38mi", "180um", "250 micron", "850 microns"
//    These are ALWAYS a mesh/variant spec, never the primary dimension.
const MICRON_SPEC = /\b\d+(?:\.\d+)?\s*(?:µm|um|mi|micron|microns?)\b/i;

// 2. Slash or × separator followed by a measurement: "/1.0mm", "× 2.00mm", "/5.6mm Mesh"
//    The separator + everything after is the variant; the part before (primary dim) stays.
const SEP_SPEC = /\s*[\/×]\s*\d+(?:\.\d+)?\s*(?:mm|µm|um|mi|micron|microns?|ml|nm)\b(?:\s*(?:mesh|grade|pore))?\s*/i;

// 3. Space + "x"/"X" separator followed by a measurement: " x 850 micron", " x 2.8mm"
//    Require surrounding spaces so we don't fire on "7x25" embedded tokens.
const SEP_X_SPEC = /\s+[xX]\s+\d+(?:\.\d+)?\s*(?:mm|µm|um|mi|micron|microns?|ml|nm)\b(?:\s*(?:mesh|grade|pore))?\s*/i;

// 5. Voltage: "120V", "230V", "100-240V" (range), "230V/50-60Hz"
const VOLTAGE_SPEC = /\b\d+(?:-\d+)?\s*[Vv](?:olt)?(?:\/[\d\-\.]+\s*[Hh][Zz])?\b/;

// 6. Wattage: "500W", "1000W"
const WATT_SPEC = /\b\d+\s*[Ww](?:att)?\b/;

// ---------------------------------------------------------------------------
// Primary size patterns — used for simple "[Name] [Size]" products like Beakers.
// These stay as the variant token when no compound spec is found.
// ---------------------------------------------------------------------------
const PRIMARY_SIZE_PATTERNS: RegExp[] = [
  /\b\d+(?:[.,]\d+)?\s*(?:ml|l|litr(?:e|es)?)\b/i,
  /\b\d+(?:[.,]\d+)?\s*(?:µl|ul|microl(?:itre|iter)s?)\b/i,
  /\b\d+(?:[.,]\d+)?\s*(?:mg|g|kg)\b/i,
  /\b\d+(?:[.,]\d+)?\s*(?:mm|cm)\b/i,
  /\b\d+(?:[.,]\d+)?\s*(?:kn|n)\b/i,
  /\b\d+(?:[.,]\d+)?\s*(?:w|kw)\b/i,
  /\b\d+(?:[.,]\d+)?\s*(?:rpm)\b/i,
  /\b\d+\s*(?:pack|pk|pc|pcs|x)\b/i,
];

// Tokens that distinguish genuinely different products (not just sizes).
const MATERIAL_TOKENS: string[] = [
  "glass", "plastic", "pp", "pe", "ptfe", "stainless", "steel",
  "borosilicate", "amber", "clear", "brown",
  "sterile", "non-sterile",
  "with tap", "without tap",
  "narrow mouth", "wide mouth",
  "screw cap", "cork",
  "graduated", "ungraduated",
  "hdpe", "ldpe",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "misc";
}

function normaliseVariantLabel(raw: string): string {
  return raw
    .replace(/^[\s\/×xX]+/, "")                     // strip leading separator
    .replace(/(\d)\s*mi\b/gi, "$1µm")               // "38mi" → "38µm"
    .replace(/(\d)\s*um\b/gi, "$1µm")               // "180um" → "180µm"
    .replace(/(\d)\s*microns?\b/gi, "$1µm")         // "850 microns" → "850µm"
    .replace(/(\d)\s+(mm|µm|nm|cm)\b/gi, "$1$2")   // "1.0 mm" → "1.0mm"
    .replace(/\s*(?:mesh|grade|pore)\s*$/i, "")     // strip trailing "Mesh" label
    .replace(/\s*\/.*$/, "")                         // strip "/50-60Hz" from voltage
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Move a leading "NNNmm" prefix to after the product name for consistent grouping.
 *  e.g. "200mm Test Sieve" → "Test Sieve 200mm" */
function canonicaliseBase(base: string): string {
  const m = base.match(/^(\d+\s*mm)\s+(.+)$/i);
  if (m) return `${m[2].trim()} ${m[1].trim()}`;
  return base;
}

function cleanDanglingPunct(s: string): string {
  return s
    .replace(/\s*[\/×]\s*(?=[a-z0-9])/gi, " ")  // "/ 200mm" → " 200mm" (orphaned leading sep)
    .replace(/\s+[xX]\s*$/, "")                  // trailing " x" or " X"
    .replace(/\s*[\/×]\s*$/, "")                 // trailing "/"
    .replace(/^[\s\/×]+/, "")                    // leading "/"
    .replace(/\s{2,}/g, " ")
    .replace(/[,\-–:]+$/, "")
    .trim();
}

// ---------------------------------------------------------------------------
// Core extraction: find the variant token and derive the base name
// ---------------------------------------------------------------------------

function extractVariantAndBase(name: string): { variantLabel: string; baseName: string } {
  let working = name;
  let rawVariant: string | null = null;

  // Pass 1 — compound/secondary specs (try in specificity order).
  // GRADE_SPEC intentionally excluded: grade belongs in base name (e.g. "Filter Paper Grade 642")
  // and the size variant is caught by PRIMARY_SIZE_PATTERNS in pass 2.
  const pass1: RegExp[] = [MICRON_SPEC, SEP_SPEC, SEP_X_SPEC, VOLTAGE_SPEC, WATT_SPEC];
  for (const pat of pass1) {
    const m = working.match(pat);
    if (m) {
      rawVariant = m[0];
      working = working.replace(m[0], " ").replace(/\s{2,}/g, " ").trim();
      working = cleanDanglingPunct(working);
      const label = normaliseVariantLabel(rawVariant);
      const base = canonicaliseBase(working);
      return { variantLabel: label, baseName: base };
    }
  }

  // Pass 1.5 — two mm values with no separator: larger is the primary diameter,
  // smaller is the mesh/variant. Only fires when the ratio is ≥ 5× to avoid
  // treating two equal dimensions (width × height) as a primary+variant pair.
  const mmMatches = [...working.matchAll(/\b(\d+(?:[.,]\d+)?)\s*mm\b/gi)];
  if (mmMatches.length >= 2) {
    const mms = mmMatches.map((m) => ({ full: m[0], value: parseFloat(m[1].replace(",", ".")) }));
    mms.sort((a, b) => b.value - a.value);
    const primary = mms[0];
    const secondary = mms[mms.length - 1];
    if (primary.value / secondary.value >= 5) {
      working = working.replace(secondary.full, " ").replace(/\s{2,}/g, " ").trim();
      working = cleanDanglingPunct(working);
      const label = normaliseVariantLabel(secondary.full);
      const base = canonicaliseBase(working);
      return { variantLabel: label, baseName: base };
    }
  }

  // Pass 2 — simple primary size token (Beaker 100ml, Pipette 50µl, etc.)
  for (const pat of PRIMARY_SIZE_PATTERNS) {
    const m = working.match(pat);
    if (m) {
      rawVariant = m[0];
      working = working.replace(m[0], " ").replace(/\s{2,}/g, " ").trim();
      working = cleanDanglingPunct(working);
      const label = normaliseVariantLabel(rawVariant);
      return { variantLabel: label, baseName: working };
    }
  }

  return { variantLabel: name, baseName: name };
}

function extractMaterialKey(name: string): string {
  const n = normalise(name);
  return MATERIAL_TOKENS.filter((t) => n.includes(t)).sort().join("|");
}

function groupKey(p: CatalogueProduct): string {
  const { variantLabel, baseName } = extractVariantAndBase(p.name);
  // Products with no extractable variant stay as their own group
  if (variantLabel === p.name) return p.slug;

  const mat = extractMaterialKey(p.name);
  const brand = p.brand ?? "no-brand";

  const cleanBase = baseName
    .toLowerCase()
    .replace(/(\d)\s+(mm|cm|ml|µl|ul|g|kg|mg)\b/g, "$1$2")  // "200 mm" → "200mm"
    .replace(/\s+/g, " ")
    .replace(/[,;]/g, "")
    .trim();

  return slugify(`${cleanBase}-${brand}-${p.category}${mat ? `-${mat}` : ""}`);
}

// ---------------------------------------------------------------------------
// Numeric sort value for variants
// ---------------------------------------------------------------------------

function variantSortValue(label: string): number {
  // Normalise to a canonical µm value for micron-based labels
  const micronMatch = label.match(/(\d+(?:\.\d+)?)\s*µm/i);
  if (micronMatch) return parseFloat(micronMatch[1]);
  // mm → convert to µm equivalent (×1000) so they sort after micron values
  const mmMatch = label.match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (mmMatch) return parseFloat(mmMatch[1]) * 1000;
  // Fallback — extract first number
  const num = label.match(/(\d+(?:\.\d+)?)/);
  return num ? parseFloat(num[1]) : 0;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Public helper — computes the groupId for a single product.
 * Matches the logic inside groupProducts so search results can be deduplicated.
 */
export function computeGroupId(
  slug: string,
  name: string,
  brand: string | null,
  category: string
): string {
  const { variantLabel, baseName } = extractVariantAndBase(name);
  if (variantLabel === name) return slug;

  const mat = extractMaterialKey(name);
  const cleanBase = baseName
    .toLowerCase()
    .replace(/(\d)\s+(mm|cm|ml|µl|ul|g|kg|mg)\b/g, "$1$2")
    .replace(/\s+/g, " ")
    .replace(/[,;]/g, "")
    .trim();
  return slugify(`${cleanBase}-${brand ?? "no-brand"}-${category}${mat ? `-${mat}` : ""}`);
}

export function groupProducts(products: CatalogueProduct[]): ProductGroup[] {
  const buckets = new Map<string, CatalogueProduct[]>();

  for (const p of products) {
    const key = groupKey(p);
    const bucket = buckets.get(key) ?? [];
    bucket.push(p);
    buckets.set(key, bucket);
  }

  const groups: ProductGroup[] = [];

  for (const [key, members] of buckets) {
    // Sort variants by their numeric/unit value (ascending)
    const sorted = [...members].sort((a, b) => {
      const { variantLabel: la } = extractVariantAndBase(a.name);
      const { variantLabel: lb } = extractVariantAndBase(b.name);
      return variantSortValue(la) - variantSortValue(lb);
    });

    const variants: ProductVariant[] = sorted.map((p) => {
      const { variantLabel } = extractVariantAndBase(p.name);
      return {
        code: p.code,
        slug: p.slug,
        name: p.name,
        sizeLabel: variantLabel,
        priceIncl: p.priceIncl,
        priceExcl: p.priceExcl,
        qtyOnHand: p.qtyOnHand,
        tier: p.tier,
        imageStatus: p.imageStatus,
      };
    });

    // Representative SKU: prefer in-stock middle variant
    const inStock = sorted.filter((p) => p.qtyOnHand > 0);
    const rep =
      inStock.length > 0
        ? inStock[Math.floor(inStock.length / 2)]
        : sorted[Math.floor(sorted.length / 2)];

    const prices = variants.map((v) => v.priceIncl).filter((x): x is number => x !== null);
    const priceMin = prices.length > 0 ? Math.min(...prices) : null;
    const priceMax = prices.length > 0 ? Math.max(...prices) : null;

    // For single-variant groups, keep the original slug (backwards compat)
    const groupId = members.length === 1 ? members[0].slug : key;

    const tierOrder: Record<ProductTier, number> = { A: 0, B: 1, C: 2 };
    const bestTier = sorted.reduce<ProductTier>(
      (best, p) => (tierOrder[p.tier] < tierOrder[best] ? p.tier : best),
      sorted[0].tier
    );

    const imageOrder = ["verified", "auto-fetched", "needs-review", "fallback", "quote-on-request", "category-shared", "pending"];
    const bestImage = (imageOrder.find((s) =>
      sorted.some((p) => p.imageStatus === s)
    ) ?? sorted[0].imageStatus) as ImageStatus;

    const first = members[0];
    const { baseName: repBase } = extractVariantAndBase(rep.name);

    groups.push({
      groupId,
      baseName: members.length === 1 ? first.name : repBase || first.name,
      brand: first.brand,
      category: first.category,
      subcategory: first.subcategory,
      tier: bestTier,
      imageStatus: bestImage,
      reviewStatus: rep.reviewStatus,
      variants,
      representativeSku: rep.code,
      priceMin,
      priceMax,
      active: members.some((p) => p.active),
    });
  }

  return groups;
}

// ---------------------------------------------------------------------------
// Variant axis label for the detail page selector
// ---------------------------------------------------------------------------

export function detectVariantAxis(group: ProductGroup): string {
  const labels = group.variants.map((v) => v.sizeLabel.toLowerCase());
  if (labels.some((l) => /µm|micron|mi\b|mesh|grade/.test(l))) return "Mesh / Grade";
  if (labels.some((l) => /\dv(?:olt)?\b/.test(l))) return "Voltage";
  if (labels.some((l) => /\dw(?:att)?\b/.test(l))) return "Power";
  if (labels.some((l) => /°c|temp/.test(l))) return "Temperature";
  if (labels.some((l) => /channel/.test(l))) return "Channels";
  if (labels.some((l) => /pack of|pk\//.test(l))) return "Pack size";
  return "Size";
}
