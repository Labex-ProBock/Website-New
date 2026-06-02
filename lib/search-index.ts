import MiniSearch from 'minisearch';
import { searchDocs } from '@/data/products.search.generated';
import type { SearchDoc } from '@/data/products.search.generated';
import { computeGroupId } from '@/lib/variant-grouper';

export type { SearchDoc };

export interface SearchResult extends SearchDoc {
  score: number;
  groupId: string;
}

let _index: MiniSearch | null = null;

function buildIndex(): MiniSearch {
  const idx = new MiniSearch({
    idField: 'id',
    fields: ['name', 'brand', 'code', 'subcategory'],
    storeFields: ['id', 'code', 'slug', 'name', 'brand', 'category', 'subcategory', 'tier', 'priceIncl'],
  });
  idx.addAll(searchDocs);
  return idx;
}

export function searchProducts(query: string, limit = 20): SearchResult[] {
  if (!_index) _index = buildIndex();

  const raw = _index.search(query, {
    boost: { brand: 3, name: 2, code: 1.5 },
    fuzzy: 0.2,
    prefix: true,
  });

  // Deduplicate by groupId — keep highest-scoring result per group
  const seen = new Map<string, SearchResult>();

  for (const r of raw) {
    const doc: SearchResult = {
      id: r.id as string,
      code: r.code as string,
      slug: r.slug as string,
      name: r.name as string,
      brand: r.brand as string,
      category: r.category as string,
      subcategory: r.subcategory as string,
      tier: r.tier as string,
      priceIncl: r.priceIncl as number | null,
      score: r.score,
      groupId: computeGroupId(r.slug as string, r.name as string, r.brand as string || null, r.category as string),
    };

    const existing = seen.get(doc.groupId);
    if (!existing || doc.score > existing.score) {
      seen.set(doc.groupId, doc);
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function groupResultsByCategory(
  results: SearchResult[],
  maxPerGroup: number,
  maxGroups: number
): Map<string, SearchResult[]> {
  const groups = new Map<string, SearchResult[]>();

  for (const r of results) {
    const existing = groups.get(r.category) ?? [];
    if (existing.length < maxPerGroup) {
      existing.push(r);
      groups.set(r.category, existing);
    }
    if (groups.size >= maxGroups) break;
  }

  return groups;
}
