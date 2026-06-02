"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  FlaskConical, Activity, Thermometer, Shuffle, TestTube2,
  Droplets, Package, Scale, Flame, RefreshCw, Shield, MessageSquare,
} from "lucide-react";
import { categories } from "@/data/categories";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FlaskConical, Activity, Thermometer, Shuffle, TestTube2,
  Droplets, Package, Scale, Flame, RefreshCw, Shield, MessageSquare,
};

interface CategoryCount { total: number; tierA: number }

interface ProductsBrowseProps {
  countMap: Record<string, CategoryCount>;
}

export default function ProductsBrowse({ countMap }: ProductsBrowseProps) {
  const mainCats = categories.filter((c) => c.slug !== "quote-required");
  const quoteCat = categories.find((c) => c.slug === "quote-required");
  const totalProducts = Object.values(countMap).reduce((s, c) => s + c.total, 0);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          backgroundColor: "var(--color-black-warm)",
          paddingTop: "10rem",
          paddingBottom: "7rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              textAlign: "center",
              color: "var(--color-orange)",
              fontSize: "0.7rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              fontFamily: "monospace",
            }}
          >
            Catalogue
          </p>
          <h1
            style={{
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              color: "#fff",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              marginBottom: "1.25rem",
            }}
          >
            Product Range
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "var(--color-muted)",
              fontSize: "1rem",
              lineHeight: 1.8,
            }}
          >
            {totalProducts.toLocaleString()} products across {mainCats.length} categories — from precision balances to rotary evaporators.
          </p>
        </div>
      </section>

      {/* Category grid */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "7rem",
          paddingBottom: "8rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ gridAutoRows: "1fr" }}
          >
            {mainCats.map((cat) => {
              const counts = countMap[cat.slug] ?? { total: 0, tierA: 0 };
              const Icon = ICON_MAP[cat.iconName];

              return (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className="group flex flex-col rounded-2xl transition-all duration-300 h-full hover:-translate-y-1 hover:border-[rgba(255,106,26,0.5)] hover:shadow-[0_0_28px_4px_rgba(255,106,26,0.18)]"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    padding: "1.75rem",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0"
                    style={{ backgroundColor: "var(--color-surface-2)" }}
                  >
                    {Icon && (
                      <Icon
                        className="w-5 h-5"
                        style={{ color: "var(--color-orange)" } as React.CSSProperties}
                      />
                    )}
                  </div>

                  <h2
                    className="font-display font-bold text-white text-sm mb-1 group-hover:text-[var(--color-orange)] transition-colors"
                  >
                    {cat.name}
                  </h2>

                  <p
                    className="text-xs leading-relaxed mb-4 flex-1"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                      {counts.total} product{counts.total !== 1 ? "s" : ""}
                      {counts.tierA > 0 && (
                        <span style={{ color: "var(--color-orange)" }}>
                          {" · "}{counts.tierA} premium
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      style={{ color: "var(--color-orange)" }}
                    />
                  </div>
                </Link>
              );
            })}

            {/* Quote-required card */}
            {quoteCat && (
              <Link
                href="/products/quote-required"
                className="group flex flex-col rounded-2xl transition-all duration-300 h-full hover:-translate-y-1 hover:shadow-[0_0_28px_4px_rgba(255,255,255,0.04)]"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px dashed var(--color-border)",
                  padding: "1.75rem",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shrink-0"
                  style={{ backgroundColor: "var(--color-surface-2)" }}
                >
                  <MessageSquare className="w-5 h-5" style={{ color: "var(--color-muted)" }} />
                </div>

                <h2
                  className="font-display font-bold text-white text-sm mb-1 group-hover:opacity-70 transition-opacity"
                >
                  {quoteCat.name}
                </h2>

                <p
                  className="text-xs leading-relaxed mb-4 flex-1"
                  style={{ color: "var(--color-muted)" }}
                >
                  {quoteCat.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {countMap["quote-required"]?.total ?? 0} items
                  </span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    style={{ color: "var(--color-muted)" }}
                  />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
