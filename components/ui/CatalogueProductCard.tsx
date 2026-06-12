"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Layers } from "lucide-react";
import type { ProductTier, ImageStatus } from "@/lib/catalogue-types";
import type { ProductGroup } from "@/lib/variant-grouper";
import { resolveProductImage } from "@/lib/product-image";
import { useAssistant } from "@/lib/assistant-store";

// Legacy single-product shape (kept for any call-sites that haven't migrated)
export type CardProduct = {
  code: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  subcategory: string | null;
  tier: ProductTier;
  priceIncl: number | null;
  active: boolean;
  imageStatus: ImageStatus;
};

function TierBadge({ tier }: { tier: ProductTier }) {
  if (tier === "A") {
    return (
      <span
        className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider z-10"
        style={{ backgroundColor: "var(--color-orange)", color: "white" }}
      >
        Premium
      </span>
    );
  }
  if (tier === "C") {
    return (
      <span
        className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider z-10"
        style={{
          backgroundColor: "var(--color-surface-2)",
          color: "var(--color-muted)",
          border: "1px solid var(--color-border)",
        }}
      >
        Quote
      </span>
    );
  }
  return null;
}

export default function CatalogueProductCard({ group }: { group: ProductGroup }) {
  const openAssistant = useAssistant((s) => s.open);
  const repVariant = group.variants.find((v) => v.code === group.representativeSku) ?? group.variants[0];
  const isMultiVariant = group.variants.length > 1;

  const href =
    group.tier === "C"
      ? `/products/quote-required`
      : `/products/${group.category}/${group.groupId}`;

  // Seed for the embedded assistant — opens with a pre-filled quote request.
  // SKU omitted gracefully if absent. Only prepend the brand when the name
  // doesn't already contain it (avoids doubled brand, e.g. "Eppendorf … Eppendorf").
  const productLabel =
    group.brand && !group.baseName.toLowerCase().includes(group.brand.toLowerCase())
      ? `${group.brand} ${group.baseName}`
      : group.baseName;
  const quoteSeed = `I'd like a quote for ${productLabel}${repVariant.code ? ` (SKU ${repVariant.code})` : ""}`;
  const openQuote = () => openAssistant({ seed: quoteSeed, label: productLabel });

  const { src: imgSrc, alt: imgAlt, isSvg } = resolveProductImage({
    code: repVariant.code,
    category: group.category,
    tier: group.tier,
    name: group.baseName,
    subcategory: group.subcategory,
  }, "card");

  // Shared style for the muted outline CTA buttons/links
  const outlineCta = {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    color: "var(--color-muted)",
    padding: "0.65rem 0",
  } as const;
  const onCtaEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "var(--color-orange)";
    e.currentTarget.style.color = "white";
  };
  const onCtaLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "var(--color-border)";
    e.currentTarget.style.color = "var(--color-muted)";
  };

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-[0_0_28px_4px_rgba(255,106,26,0.18)]"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Image area */}
      <Link href={href} className="block relative aspect-[4/3] overflow-hidden flex-shrink-0">
        {isSvg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={imgAlt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        ) : (
          <Image src={imgSrc} alt={imgAlt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" placeholder="empty" />
        )}
        <TierBadge tier={group.tier} />
        {group.imageStatus === "auto-fetched" && (
          <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
            Representative image
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1" style={{ padding: "1.5rem", textAlign: "center" }}>
        {group.brand && (
          <p className="text-xs mb-2" style={{ color: "var(--color-orange)", textAlign: "center", letterSpacing: "0.04em" }}>
            {group.brand}
          </p>
        )}

        <Link href={href} className="flex-1 group/title">
          <h3
            className="font-display font-bold text-white leading-snug line-clamp-2 group-hover/title:text-[var(--color-orange)] transition-colors"
            style={{ textAlign: "center", fontSize: "0.9rem", marginBottom: "0.5rem" }}
          >
            {group.baseName}
          </h3>
        </Link>

        {isMultiVariant && (
          <p className="text-xs mb-2 flex items-center justify-center gap-1" style={{ color: "var(--color-muted)" }}>
            <Layers className="w-3 h-3 shrink-0" />
            Available in {group.variants.length} sizes
          </p>
        )}

        {!isMultiVariant && group.subcategory && (
          <p className="text-xs mb-3" style={{ color: "var(--color-muted)", textAlign: "center" }}>
            {group.subcategory}
          </p>
        )}

        <p
          className="font-semibold mb-4"
          style={{ color: "var(--color-muted)", textAlign: "center", fontSize: "0.875rem" }}
        >
          Price on request
        </p>

        {/* CTA */}
        {group.tier === "C" ? (
          <button
            type="button"
            onClick={openQuote}
            className="flex items-center justify-center gap-2 w-full rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            style={outlineCta}
            onMouseEnter={onCtaEnter}
            onMouseLeave={onCtaLeave}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Request Quote
          </button>
        ) : isMultiVariant ? (
          <Link
            href={href}
            className="flex items-center justify-center gap-2 w-full rounded-xl text-xs font-semibold transition-colors"
            style={outlineCta}
            onMouseEnter={onCtaEnter}
            onMouseLeave={onCtaLeave}
          >
            <Layers className="w-3.5 h-3.5" />
            Select size
          </Link>
        ) : (
          <button
            type="button"
            onClick={openQuote}
            className="flex items-center justify-center gap-2 w-full rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            style={outlineCta}
            onMouseEnter={onCtaEnter}
            onMouseLeave={onCtaLeave}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Get a quote
          </button>
        )}
      </div>
    </div>
  );
}
