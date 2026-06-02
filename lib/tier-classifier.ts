import type { ProductTier } from '@/lib/catalogue-types';

const TIER_A_PRICE_THRESHOLD = 20000;

export function classifyTier(priceIncl: number | null, inferredCategory: string): ProductTier {
  if (priceIncl !== null && priceIncl >= TIER_A_PRICE_THRESHOLD) return 'A';
  if (inferredCategory === 'UNCATEGORISED') return 'C';
  return 'B';
}
