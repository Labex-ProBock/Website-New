export type ProductTier = 'A' | 'B' | 'C';

export type ImageStatus =
  | 'verified'
  | 'auto-fetched'
  | 'fallback'
  | 'category-shared'
  | 'quote-on-request'
  | 'pending'
  | 'needs-review';

export type ReviewStatus = 'pending' | 'approved' | 'hide';

export interface CatalogueProduct {
  code: string;
  slug: string;
  name: string;
  rawDescription: string;
  brand: string | null;
  model: string | null;
  category: string;
  subcategory: string | null;
  tier: ProductTier;
  priceExcl: number | null;
  priceIncl: number | null;
  avgCost: number | null;
  lastCost: number | null;
  qtyOnHand: number;
  active: boolean;
  imageStatus: ImageStatus;
  reviewStatus: ReviewStatus;
  searchTerms: string[];
}

export interface ImageManifestEntry {
  code: string;
  slug: string;
  imageStatus: ImageStatus;
  imageUrl: string | null;
  localPath: string | null;
  imageSource?: string | null;
  sourceUrl?: string | null;
  queryUsed?: string | null;
  imagePaths?: {
    thumbnail?: string;
    card?: string;
    hero?: string;
  };
  reviewStatus: ReviewStatus;
  lastChecked: string | null;
}

export interface ImageManifest {
  generated: string;
  total: number;
  products: ImageManifestEntry[];
}

export interface AgentInitContext {
  trigger: 'quote-cart' | 'product-detail' | 'category-browse';
  productCodes?: string[];
  categorySlug?: string;
  preMessage?: string;
}

export const CATEGORY_MAP: Record<string, string> = {
  'Balances & Weighing': 'balances-weighing',
  'Centrifugation': 'centrifugation',
  'Consumables & Reagents': 'consumables-reagents',
  'Evaporation & Distillation': 'evaporation-distillation',
  'Glassware & Plasticware': 'glassware-plasticware',
  'Liquid Handling': 'liquid-handling',
  'Measurement & Analysis': 'measurement-analysis',
  'Mixing & Stirring': 'mixing-stirring',
  'Safety & Cleanroom': 'safety-cleanroom',
  'Sample Prep': 'sample-prep',
  'Temperature Control': 'temperature-control',
  'UNCATEGORISED': 'quote-required',
};
