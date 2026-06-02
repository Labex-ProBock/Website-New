import { SAGE_ENCODING, TYPO_MAP, UNIT_MAP } from '@/data/abbreviation-map';

export function normalizeDescription(raw: string): string {
  let s = raw.trim();

  // 1. Decode Sage encoding artifacts
  for (const [from, to] of SAGE_ENCODING) {
    s = s.split(from).join(to);
  }

  // 2. Fix known typos and truncations
  for (const [from, to] of TYPO_MAP) {
    s = s.split(from).join(to);
  }

  // 3. Standardize units and abbreviations (regex-based)
  for (const [pattern, replacement] of UNIT_MAP) {
    s = s.replace(pattern, replacement);
  }

  // 4. Collapse multiple spaces
  s = s.replace(/\s{2,}/g, ' ').trim();

  return s;
}
