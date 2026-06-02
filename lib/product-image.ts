import manifestData from "@/data/image-manifest.json";

export type ImageSize = "thumbnail" | "card" | "hero";

export interface ResolvedImage {
  src: string;
  alt: string;
  isFallback: boolean;
  isSvg: boolean;
}

// Extend the base manifest entry type to include the imagePaths block present on verified entries
interface ManifestEntryWithImages {
  code: string;
  imageStatus: string;
  localPath: string | null;
  motif?: string;
  imagePaths?: {
    thumbnail?: string;
    card?: string;
    hero?: string;
  };
}

const MANIFEST = (manifestData as { products: ManifestEntryWithImages[] }).products;

export function resolveProductImage(
  product: {
    code: string;
    category: string | null | undefined;
    tier: string;
    name?: string | null;
    subcategory?: string | null;
  },
  size: ImageSize = "card"
): ResolvedImage {
  const entry = MANIFEST.find((p) => p.code === product.code);

  // 1. Manifest entry with imagePaths block.
  if ((entry?.imageStatus === "verified" || entry?.imageStatus === "auto-fetched") && entry.imagePaths) {
    const src = entry.imagePaths[size] ?? entry.imagePaths.card ?? entry.imagePaths.hero ?? null;
    if (src) {
      return { src, alt: product.code, isFallback: false, isSvg: src.endsWith(".svg") };
    }
  }

  // 2. Tier C → motif placeholder SVG
  if (product.tier === "C") {
    const motifSlug = entry?.motif ?? "schematic";
    return {
      src: `/images/placeholders/tier-c/${motifSlug}.svg`,
      alt: "Specialist product — quote required",
      isFallback: true,
      isSvg: true,
    };
  }

  // 3. Product-photo fallback for pending catalogue items.
  const fallbackPhoto = fallbackPhotoForProduct(product);
  if (fallbackPhoto) {
    return {
      src: fallbackPhoto,
      alt: product.name ? `${product.name} product photo` : `${product.category ?? "Product"} product photo`,
      isFallback: true,
      isSvg: false,
    };
  }

  // 4. Category SVG fallback if a category has no photographic match.
  const slug = slugifyCategory(product.category);
  return {
    src: `/images/categories/${slug}.svg`,
    alt: `${product.category ?? "Product"} — category placeholder`,
    isFallback: true,
    isSvg: true,
  };
}

// Exported so it can be unit-tested independently
export function slugifyCategory(name: string | null | undefined): string {
  if (!name) return "uncategorised";
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ProductImageInput = {
  code: string;
  category: string | null | undefined;
  name?: string | null;
  subcategory?: string | null;
};

const PHOTO = {
  labBench: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80",
  glassware: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80",
  glasswareAlt: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80",
  analysis: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80",
  equipment: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=900&q=80",
  instrument: "https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=900&q=80",
  liquidHandling: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80",
  consumables: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
  industrial: "https://images.unsplash.com/photo-1581093057519-e3a28e02ccc3?auto=format&fit=crop&w=900&q=80",
  safety: "https://images.unsplash.com/photo-1581093057519-e3a28e02ccc3?auto=format&fit=crop&w=900&q=80",
} as const;

const CATEGORY_PHOTOS: Record<string, string[]> = {
  "glassware-plasticware": [PHOTO.glassware, PHOTO.glasswareAlt, PHOTO.labBench],
  "measurement-analysis": [PHOTO.analysis, PHOTO.instrument, PHOTO.labBench],
  "temperature-control": [PHOTO.equipment, PHOTO.industrial, PHOTO.labBench],
  "mixing-stirring": [PHOTO.instrument, PHOTO.equipment, PHOTO.industrial],
  "sample-prep": [PHOTO.labBench, PHOTO.instrument, PHOTO.equipment],
  "liquid-handling": [PHOTO.liquidHandling, PHOTO.labBench, PHOTO.glasswareAlt],
  "consumables-reagents": [PHOTO.consumables, PHOTO.labBench, PHOTO.glassware],
  "balances-weighing": [PHOTO.instrument, PHOTO.equipment, PHOTO.labBench],
  "evaporation-distillation": [PHOTO.glasswareAlt, PHOTO.equipment, PHOTO.industrial],
  centrifugation: [PHOTO.equipment, PHOTO.instrument, PHOTO.labBench],
  "safety-cleanroom": [PHOTO.safety, PHOTO.industrial, PHOTO.labBench],
};

const GLASSWARE_SUBCATEGORY_PHOTOS: Array<{ tokens: string[]; photos: string[] }> = [
  { tokens: ["beaker", "cylinder", "flask", "bottle", "container"], photos: [PHOTO.glassware, PHOTO.glasswareAlt] },
  { tokens: ["tube", "vial", "capillary"], photos: [PHOTO.glasswareAlt, PHOTO.labBench] },
  { tokens: ["funnel", "buchner", "filter"], photos: [PHOTO.labBench, PHOTO.glassware] },
  { tokens: ["dish", "plate"], photos: [PHOTO.glassware, PHOTO.consumables] },
  { tokens: ["cap", "stopper"], photos: [PHOTO.consumables, PHOTO.glassware] },
];

function fallbackPhotoForProduct(product: ProductImageInput): string | null {
  const category = slugifyCategory(product.category);
  const haystack = `${product.subcategory ?? ""} ${product.name ?? ""}`.toLowerCase();

  if (category === "glassware-plasticware") {
    const match = GLASSWARE_SUBCATEGORY_PHOTOS.find(({ tokens }) =>
      tokens.some((token) => haystack.includes(token))
    );
    if (match) return pickStable(match.photos, product.code);
  }

  const photos = CATEGORY_PHOTOS[category];
  if (!photos?.length) return null;
  return pickStable(photos, product.code);
}

function pickStable<T>(items: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return items[hash % items.length];
}
