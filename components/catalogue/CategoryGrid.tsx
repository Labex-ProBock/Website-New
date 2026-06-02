"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import CatalogueProductCard from "@/components/ui/CatalogueProductCard";
import type { ProductGroup } from "@/lib/variant-grouper";

interface CategoryGridProps {
  groups: ProductGroup[];
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center px-5 py-2 rounded-full text-xs font-medium leading-none transition-all cursor-pointer border whitespace-nowrap"
      style={{
        backgroundColor: isActive ? "var(--color-orange)" : "rgba(255,255,255,0.04)",
        borderColor: isActive ? "var(--color-orange)" : "var(--color-border)",
        color: isActive ? "white" : "var(--color-muted)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.backgroundColor = "rgba(255,255,255,0.08)";
          el.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.backgroundColor = "rgba(255,255,255,0.04)";
          el.style.color = "var(--color-muted)";
        }
      }}
    >
      {label}
    </button>
  );
}

function RowLabel({ children }: { children: string }) {
  return (
    <p
      className="text-[10px] font-mono uppercase tracking-[0.2em]"
      style={{ color: "var(--color-muted)" }}
    >
      {children}
    </p>
  );
}

const TIER_CHIPS = [
  { tier: "A", label: "Premium" },
  { tier: "B", label: "Standard" },
  { tier: "C", label: "Quote only" },
] as const;

export default function CategoryGrid({ groups }: CategoryGridProps) {
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<string | null>(null);
  const [withPriceOnly, setWithPriceOnly] = useState(false);
  const [withInStockOnly, setWithInStockOnly] = useState(false);

  const subcategories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const g of groups) {
      if (g.subcategory && !seen.has(g.subcategory)) {
        seen.add(g.subcategory);
        result.push(g.subcategory);
      }
    }
    return result.sort();
  }, [groups]);

  const filtered = useMemo(() => {
    return groups.filter((g) => {
      if (activeSubcat && g.subcategory !== activeSubcat) return false;
      if (activeTier && g.tier !== activeTier) return false;
      if (withPriceOnly && !g.priceMin) return false;
      if (withInStockOnly && !g.variants.some((v) => v.qtyOnHand > 0)) return false;
      return true;
    });
  }, [groups, activeSubcat, activeTier, withPriceOnly, withInStockOnly]);

  const hasFilters = activeSubcat !== null || activeTier !== null || withPriceOnly || withInStockOnly;

  function clearAll() {
    setActiveSubcat(null);
    setActiveTier(null);
    setWithPriceOnly(false);
    setWithInStockOnly(false);
  }

  return (
    <div style={{ paddingTop: "1.5rem" }}>

      {/* Filter block */}
      <div className="space-y-6 mb-10">

        {/* Subcategory group — only when 2+ subcategories exist */}
        {subcategories.length >= 2 && (
          <div className="space-y-2.5">
            <RowLabel>Subcategory</RowLabel>
            <div className="flex flex-wrap gap-2.5">
              {subcategories.map((sub) => (
                <FilterChip
                  key={sub}
                  label={sub}
                  isActive={activeSubcat === sub}
                  onClick={() => setActiveSubcat(activeSubcat === sub ? null : sub)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tier + availability group */}
        <div className="space-y-2.5">
          <RowLabel>Show</RowLabel>
          <div className="flex flex-wrap gap-2.5">
            {TIER_CHIPS.map(({ tier, label }) => (
              <FilterChip
                key={tier}
                label={label}
                isActive={activeTier === tier}
                onClick={() => setActiveTier(activeTier === tier ? null : tier)}
              />
            ))}
            <FilterChip
              label="Priced items only"
              isActive={withPriceOnly}
              onClick={() => setWithPriceOnly(!withPriceOnly)}
            />
            <FilterChip
              label="In stock"
              isActive={withInStockOnly}
              onClick={() => setWithInStockOnly(!withInStockOnly)}
            />
          </div>
        </div>
      </div>

      {/* Count bar */}
      <div
        className="flex items-center justify-between pt-5 mb-8"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <p className="text-xs font-mono whitespace-nowrap" style={{ color: "var(--color-muted)" }}>
          <span className="text-white font-semibold tabular-nums">{filtered.length}</span>
          <span className="ml-1.5">
            {filtered.length === 1 ? "product" : "products"}
            {hasFilters && (
              <span className="ml-1.5 opacity-60">of {groups.length}</span>
            )}
          </span>
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
            style={{ color: "var(--color-muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "white")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--color-muted)")}
          >
            <X className="w-3 h-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            No products match the selected filters.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 text-sm underline transition-opacity hover:opacity-70 cursor-pointer"
            style={{ color: "var(--color-orange)" }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ gridAutoRows: "1fr" }}
        >
          {filtered.map((group) => (
            <CatalogueProductCard key={group.groupId} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
