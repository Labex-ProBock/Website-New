export const KNOWN_BRANDS: string[] = [
  'Labconco',
  'Atago',
  'Snijders',
  'Huxley',
  'Memmert',
  'Elma',
  'IKA',
  'Heidolph',
  'Grant',
  'Eppendorf',
  'Thermo Scientific',
  'Thermo Fisher',
  'Thermo',
  'Cole-Parmer',
  'Beoco',
  'Biochrom',
  'Stuart',
  'Benchmark Scientific',
  'Benchmark',
  'Starlab',
  'Isolab',
  'Witeg',
  'Borosil',
  'VELP',
  'Hirschmann',
  'Kartell',
  'Duran',
  'Schott',
  'Polax',
];

export interface BrandExtraction {
  brand: string | null;
  model: string | null;
}

export function extractBrand(description: string): BrandExtraction {
  // Check for brand explicitly in parentheses: "Glove Box (Labconco)"
  const parenMatch = description.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inner = parenMatch[1].trim();
    for (const brand of KNOWN_BRANDS) {
      if (inner.toLowerCase() === brand.toLowerCase()) {
        return { brand, model: null };
      }
    }
  }

  // Check if description contains a known brand (longest match first to avoid 'Thermo' shadowing 'Thermo Scientific')
  const sorted = [...KNOWN_BRANDS].sort((a, b) => b.length - a.length);
  for (const brand of sorted) {
    const escaped = brand.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    if (new RegExp(`\\b${escaped}\\b`, 'i').test(description)) {
      return { brand, model: null };
    }
  }

  return { brand: null, model: null };
}
