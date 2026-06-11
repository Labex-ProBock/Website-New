"use client";

import { useState } from "react";
import { Phone, Check, MessageSquare } from "lucide-react";
import Link from "next/link";
import type { ProductGroup, ProductVariant } from "@/lib/variant-grouper";
import { detectVariantAxis } from "@/lib/variant-grouper";
import { useAssistant } from "@/lib/assistant-store";

interface ProductGroupDetailProps {
  group: ProductGroup;
  initialSku?: string;
}

function formatPrice(priceIncl: number | null): string {
  if (!priceIncl) return "Contact for pricing";
  return `R ${priceIncl.toLocaleString("en-ZA")}`;
}

const TRUST = [
  "VAT-registered South African supplier",
  "Expert technical support available",
  "Ships from Edenvale, Johannesburg",
];

export default function ProductGroupDetail({ group, initialSku }: ProductGroupDetailProps) {
  const initial =
    group.variants.find((v) => v.code === (initialSku ?? group.representativeSku)) ??
    group.variants[0];

  const [selected, setSelected] = useState<ProductVariant>(initial);
  const isMulti = group.variants.length > 1;
  const openAssistant = useAssistant((s) => s.open);

  // Seed for the embedded assistant — tracks the selected variant's SKU. Missing
  // fields drop out gracefully. Only prepend the brand when the name doesn't
  // already contain it (avoids doubled brand, e.g. "Eppendorf … Eppendorf").
  const productLabel =
    group.brand && !group.baseName.toLowerCase().includes(group.brand.toLowerCase())
      ? `${group.brand} ${group.baseName}`
      : group.baseName;
  const quoteSeed = `I'd like a quote for ${productLabel}${selected.code ? ` (SKU ${selected.code})` : ""}`;
  const openQuote = () => openAssistant({ seed: quoteSeed, label: productLabel });

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Variant selector */}
        {isMulti && (
          <div>
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              {detectVariantAxis(group)}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.variants.map((v) => {
                const isActive = v.code === selected.code;
                return (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => setSelected(v)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    style={{
                      backgroundColor: isActive ? "transparent" : "var(--color-surface-2)",
                      border: `2px solid ${isActive ? "var(--color-orange)" : "var(--color-border)"}`,
                      color: isActive ? "white" : "var(--color-muted)",
                    }}
                  >
                    {v.sizeLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price block — border-y visual anchor */}
        <div style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
          <p style={{ fontSize: "0.7rem", color: "var(--color-muted)", marginBottom: "0.375rem" }}>
            Price (incl. VAT)
          </p>
          {selected.priceIncl ? (
            <p className="font-black text-white" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.05 }}>
              {formatPrice(selected.priceIncl)}
            </p>
          ) : (
            <p className="font-medium" style={{ color: "var(--color-muted)", fontSize: "1.125rem" }}>
              Contact for pricing
            </p>
          )}

          {/* Stock dot + SKU row */}
          <div className="flex items-center justify-between mt-3">
            {selected.qtyOnHand > 0 ? (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#4ade80" }}>
                <span className="inline-block rounded-full flex-shrink-0" style={{ width: "6px", height: "6px", backgroundColor: "#4ade80" }} />
                In stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-muted)" }}>
                <span className="inline-block rounded-full flex-shrink-0" style={{ width: "6px", height: "6px", backgroundColor: "currentColor" }} />
                Check availability
              </span>
            )}
            <span className="tabular-nums" style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "var(--color-muted)" }}>
              {selected.code}
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {/* Primary → opens the persistent assistant panel */}
          <button
            type="button"
            onClick={openQuote}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            style={{ backgroundColor: "var(--color-orange)", color: "white", border: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-orange-deep)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-orange)"; }}
          >
            <MessageSquare className="w-4 h-4" />
            Get a quote
          </button>

          {/* 2-col secondary */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:0117281338"
              className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold border transition-colors"
              style={{
                padding: "0.75rem 0",
                backgroundColor: "var(--color-surface-2)",
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(255,255,255,0.4)";
                el.style.color = "white";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--color-border)";
                el.style.color = "var(--color-muted)";
              }}
            >
              <Phone className="w-3 h-3 flex-shrink-0" />
              Call us
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center rounded-xl text-xs font-semibold border transition-colors"
              style={{
                padding: "0.75rem 0",
                backgroundColor: "var(--color-surface-2)",
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(255,255,255,0.4)";
                el.style.color = "white";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--color-border)";
                el.style.color = "var(--color-muted)";
              }}
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {TRUST.map((label) => (
            <div key={label} className="flex items-center gap-2.5">
              <span
                className="flex-shrink-0 flex items-center justify-center rounded-full"
                style={{ width: "18px", height: "18px", backgroundColor: "rgba(74,222,128,0.12)" }}
              >
                <Check style={{ width: "10px", height: "10px", color: "#4ade80" }} />
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA — hidden on md+ */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-40"
        style={{
          backgroundColor: "var(--color-black-warm)",
          borderTop: "1px solid var(--color-border)",
          padding: "0.875rem 1.25rem calc(0.875rem + env(safe-area-inset-bottom))",
        }}
      >
        <button
          type="button"
          onClick={openQuote}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          style={{ backgroundColor: "var(--color-orange)", color: "white", border: "none" }}
        >
          <MessageSquare className="w-4 h-4" />
          Get a quote
        </button>
      </div>
    </>
  );
}
