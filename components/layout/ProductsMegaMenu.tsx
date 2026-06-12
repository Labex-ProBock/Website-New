"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, ChevronDown, X } from "lucide-react";
import { categories } from "@/data/categories";
import { industries } from "@/content/industries";
import { searchProducts } from "@/lib/search-index";
import { searchDocs } from "@/data/products.search.generated";
import type { SearchResult } from "@/lib/search-index";
import { resolveProductImage } from "@/lib/product-image";
import { computeGroupId } from "@/lib/variant-grouper";
import { useAssistant } from "@/lib/assistant-store";

// ─── Static pre-computed data ─────────────────────────────────────────────────

const MAIN_CATS = categories.filter((c) => c.slug !== "quote-required");

const CAT_COUNTS = Object.fromEntries(
  categories.map((c) => [c.slug, searchDocs.filter((d) => d.category === c.slug).length])
);

// Top 3 products per category — Tier A priced first, then any priced, then anything
const FEATURED = Object.fromEntries(
  MAIN_CATS.map((c) => {
    const pool = searchDocs.filter((d) => d.category === c.slug);
    const byPrice = (a: { priceIncl: number | null }, b: { priceIncl: number | null }) =>
      (b.priceIncl ?? 0) - (a.priceIncl ?? 0);

    const tierApriced  = pool.filter((d) => d.tier === "A" && d.priceIncl).sort(byPrice);
    const otherPriced  = pool.filter((d) => d.tier !== "A" && d.priceIncl).sort(byPrice);
    const unpriced     = pool.filter((d) => !d.priceIncl);

    const seen = new Set<string>();
    const picks: typeof pool = [];
    for (const d of [...tierApriced, ...otherPriced, ...unpriced]) {
      if (picks.length === 3) break;
      if (!seen.has(d.id)) { seen.add(d.id); picks.push(d); }
    }

    return [
      c.slug,
      picks.map((d) => ({
        ...d,
        groupId: computeGroupId(d.slug, d.name, d.brand || null, d.category),
      })),
    ];
  })
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Quote-only site — never render a price number.
const PRICE_LABEL = "Price on request";

function getHref(r: SearchResult) {
  return r.tier === "C" ? "/products/quote-required" : `/products/${r.category}/${r.groupId}`;
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface PanelProps {
  isOpen: boolean;
  activeCategory: string;
  setActiveCategory: (s: string) => void;
  query: string;
  setQuery: (s: string) => void;
  searchResults: SearchResult[];
  onClose: () => void;
  onPanelMouseEnter: () => void;
  onPanelMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function MegaPanel({
  isOpen, activeCategory, setActiveCategory,
  query, setQuery, searchResults, onClose,
  onPanelMouseEnter, onPanelMouseLeave,
}: PanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const featured = FEATURED[activeCategory] ?? [];
  const activeCatMeta = categories.find((c) => c.slug === activeCategory);
  const openAssistant = useAssistant((s) => s.open);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <>
      {/* Panel */}
      <div
        id="products-megamenu"
        role="menu"
        aria-label="Products navigation"
        onMouseEnter={onPanelMouseEnter}
        onMouseLeave={onPanelMouseLeave}
        style={{
          position: "fixed",
          top: "68px",
          left: "50%",
          width: "min(980px, calc(100vw - 2rem))",
          zIndex: 49,
          backgroundColor: "#0D0D0F",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "16px",
          boxShadow: "0 24px 80px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset",
          overflow: "hidden",
          opacity: isOpen ? 1 : 0,
          transform: `translateX(-50%) translateY(${isOpen ? "0" : "-10px"})`,
          pointerEvents: isOpen ? "auto" : "none",
          transition: `opacity ${isOpen ? "240ms" : "160ms"} cubic-bezier(0.16,1,0.3,1), transform ${isOpen ? "240ms" : "160ms"} cubic-bezier(0.16,1,0.3,1)`,
        }}
      >
        {/* Header row: annotation + search */}
        <div style={{ padding: "1rem 1.5rem 0.875rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
              marginBottom: "0.75rem",
            }}
          >
            00 / Catalogue
          </p>

          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <Search
              style={{
                position: "absolute",
                left: "0.875rem",
                top: "50%",
                transform: "translateY(-50%)",
                width: "14px",
                height: "14px",
                color: "rgba(255,255,255,0.28)",
                pointerEvents: "none",
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 1,191 products, brands, categories…"
              style={{
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "0.625rem 2.5rem 0.625rem 2.5rem",
                color: "#fff",
                fontSize: "0.82rem",
                outline: "none",
                transition: "border-color 160ms",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(255,106,26,0.45)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0,
                  display: "flex",
                }}
              >
                <X style={{ width: "13px", height: "13px" }} />
              </button>
            ) : (
              <kbd
                style={{
                  position: "absolute",
                  right: "0.875rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "monospace",
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.25)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                }}
              >
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Body: search results OR 3-column layout */}
        {query.length >= 2 ? (
          /* ── Search results ─────────────────────────────────── */
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {searchResults.length > 0 ? searchResults.map((r) => (
              <Link
                key={r.id}
                href={getHref(r)}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.7rem 1.5rem",
                  transition: "background 120ms",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,106,26,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
              >
                <div>
                  <p style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 500 }}>{r.name}</p>
                  {r.brand && (
                    <p style={{ color: "var(--color-orange)", fontSize: "0.68rem", marginTop: "0.1rem" }}>{r.brand}</p>
                  )}
                </div>
                <p style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", marginLeft: "1rem" }}>
                  {PRICE_LABEL}
                </p>
              </Link>
            )) : (
              <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>
                  No results for &ldquo;{query}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => { onClose(); openAssistant({ seed: query, label: query }); }}
                  className="cursor-pointer"
                  style={{ color: "var(--color-orange)", fontWeight: 600, background: "none", border: "none", padding: 0 }}
                >
                  Ask the assistant &rarr;
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── 3-column layout ─────────────────────────────────── */
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 200px" }}>

            {/* ─ Col 1: Categories ─────────────────────────────── */}
            <div
              role="group"
              aria-label="Product categories"
              style={{ borderRight: "1px solid rgba(255,255,255,0.05)", padding: "1.25rem 0" }}
            >
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                padding: "0 1.25rem",
                marginBottom: "0.5rem",
              }}>
                Categories
              </p>

              {MAIN_CATS.map((cat) => {
                const active = activeCategory === cat.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    role="menuitem"
                    onClick={onClose}
                    onMouseEnter={() => setActiveCategory(cat.slug)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.5rem 1.25rem",
                      borderLeft: `2px solid ${active ? "var(--color-orange)" : "transparent"}`,
                      backgroundColor: active ? "rgba(255,106,26,0.07)" : "transparent",
                      transition: "background 100ms, border-color 100ms",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      color: active ? "#fff" : "rgba(255,255,255,0.68)",
                      transition: "color 100ms",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {cat.name}
                    </span>
                    <span className="tabular-nums" style={{
                      fontFamily: "monospace",
                      fontSize: "0.62rem",
                      color: "rgba(255,255,255,0.25)",
                      flexShrink: 0,
                      marginLeft: "0.75rem",
                    }}>
                      {CAT_COUNTS[cat.slug] ?? 0}
                    </span>
                  </Link>
                );
              })}

              {/* Specialist items */}
              <div style={{ margin: "0.5rem 1.25rem 0", borderTop: "1px solid rgba(255,255,255,0.05)" }} />
              <Link
                href="/products/quote-required"
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 1.25rem",
                  marginTop: "0.25rem",
                  borderLeft: "2px solid transparent",
                  textDecoration: "none",
                  transition: "background 120ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
              >
                <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.38)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Specialist items
                </span>
                <span className="tabular-nums" style={{ fontFamily: "monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", flexShrink: 0, marginLeft: "0.75rem" }}>
                  {CAT_COUNTS["quote-required"] ?? 0}
                </span>
              </Link>
            </div>

            {/* ─ Col 2: Featured products ─────────────────────── */}
            <div
              role="group"
              aria-label="Featured products"
              style={{ borderRight: "1px solid rgba(255,255,255,0.05)", padding: "1.25rem 1.5rem" }}
            >
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "0.875rem",
              }}>
                Featured
              </p>

              {featured.length > 0 ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {featured.map((p) => (
                      <Link
                        key={p.id}
                        href={p.tier === "C" ? "/products/quote-required" : `/products/${p.category}/${p.groupId}`}
                        onClick={onClose}
                        aria-label={`View ${p.name} product page`}
                        style={{
                          display: "flex",
                          gap: "0.875rem",
                          alignItems: "center",
                          padding: "0.625rem",
                          borderRadius: "10px",
                          border: "1px solid rgba(255,255,255,0.05)",
                          backgroundColor: "rgba(255,255,255,0.015)",
                          textDecoration: "none",
                          transition: "border-color 160ms, background 160ms",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.borderColor = "rgba(255,106,26,0.3)";
                          el.style.backgroundColor = "rgba(255,106,26,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement;
                          el.style.borderColor = "rgba(255,255,255,0.05)";
                          el.style.backgroundColor = "rgba(255,255,255,0.015)";
                        }}
                      >
                        {/* Image */}
                        <div style={{
                          width: "80px",
                          height: "60px",
                          flexShrink: 0,
                          borderRadius: "7px",
                          overflow: "hidden",
                          backgroundColor: "rgba(255,255,255,0.04)",
                          position: "relative",
                        }}>
                          {(() => {
                            const { src, alt, isSvg } = resolveProductImage(p, "thumbnail");
                            return isSvg ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            ) : (
                              <Image src={src} alt={alt} fill sizes="80px" className="object-cover" placeholder="empty" />
                            );
                          })()}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          {p.brand && (
                            <p style={{ fontSize: "0.6rem", color: "var(--color-orange)", marginBottom: "0.2rem", letterSpacing: "0.04em" }}>
                              {p.brand}
                            </p>
                          )}
                          <p style={{
                            fontSize: "0.82rem",
                            fontWeight: 500,
                            color: "#fff",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                            {p.name}
                          </p>
                          <p style={{
                            fontFamily: "monospace",
                            fontSize: "0.65rem",
                            color: "rgba(255,255,255,0.32)",
                            marginTop: "0.2rem",
                          }}>
                            {PRICE_LABEL}
                          </p>
                        </div>

                        <ArrowRight style={{ width: "12px", height: "12px", flexShrink: 0, color: "rgba(255,106,26,0.4)" }} />
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/products/${activeCategory}`}
                    onClick={onClose}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      marginTop: "0.875rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--color-orange)",
                      textDecoration: "none",
                    }}
                  >
                    View all {activeCatMeta?.name} <ArrowRight style={{ width: "11px", height: "11px" }} />
                  </Link>
                </>
              ) : (
                /* Fallback: category description card */
                <Link
                  href={`/products/${activeCategory}`}
                  onClick={onClose}
                  style={{
                    display: "block",
                    padding: "1.25rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    textDecoration: "none",
                  }}
                >
                  <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "0.82rem", lineHeight: 1.65, marginBottom: "0.875rem" }}>
                    {activeCatMeta?.description}
                  </p>
                  <p style={{ color: "var(--color-orange)", fontSize: "0.75rem", fontWeight: 600 }}>
                    View all in this category →
                  </p>
                </Link>
              )}
            </div>

            {/* ─ Col 3: Browse by ──────────────────────────────── */}
            <div
              role="group"
              aria-label="Browse by industry"
              style={{ padding: "1.25rem 1.25rem" }}
            >
              <p style={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: "0.875rem",
              }}>
                Browse by
              </p>

              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", marginBottom: "0.35rem", fontWeight: 600, letterSpacing: "0.04em" }}>
                INDUSTRY
              </p>

              {industries.map((ind) => (
                <Link
                  key={ind.slug}
                  href={`/industries/${ind.slug}`}
                  onClick={onClose}
                  style={{
                    display: "block",
                    padding: "0.3rem 0",
                    fontSize: "0.82rem",
                    color: "rgba(255,255,255,0.58)",
                    textDecoration: "none",
                    transition: "color 120ms",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.58)"; }}
                >
                  {ind.shortName}
                </Link>
              ))}

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "1rem", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Link
                  href="/products"
                  onClick={onClose}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--color-orange)",
                    textDecoration: "none",
                  }}
                >
                  All products <ArrowRight style={{ width: "12px", height: "12px" }} />
                </Link>
                <Link
                  href="/products/quote-required"
                  onClick={onClose}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.38)",
                    textDecoration: "none",
                    transition: "color 120ms",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.38)"; }}
                >
                  Specialist quotes <ArrowRight style={{ width: "11px", height: "11px" }} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─ Footer band ───────────────────────────────────────── */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          backgroundImage: "linear-gradient(90deg, rgba(255,106,26,0.05) 0%, transparent 40%, transparent 60%, rgba(255,106,26,0.05) 100%)",
          padding: "0.875rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}>
          <Link
            href="/contact"
            onClick={onClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "var(--color-orange)",
              color: "#fff",
              padding: "0.5rem 1.125rem",
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Get a quote
          </Link>

          <p style={{
            fontFamily: "monospace",
            fontSize: "0.62rem",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.04em",
            textAlign: "center",
            flex: 1,
          }}>
            1,191 products · 10+ premium brands · ships from Edenvale, Johannesburg
          </p>

          <a
            href="tel:0117281338"
            style={{
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.38)",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "color 120ms",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.38)"; }}
          >
            (011) 728 1338
          </a>
        </div>
      </div>
    </>
  );
}

// ─── Main export — renders <li> trigger + portal panel ───────────────────────

export default function ProductsMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState(MAIN_CATS[0]?.slug ?? "");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Mount guard for portal
  useEffect(() => { setMounted(true); }, []);

  const clearTimer = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const openMenu = useCallback(() => { clearTimer(); setIsOpen(true); }, [clearTimer]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSearchResults([]);
  }, []);

  const scheduleClose = useCallback(() => {
    clearTimer();
    closeTimer.current = setTimeout(closeMenu, 200);
  }, [clearTimer, closeMenu]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (query) { setQuery(""); setSearchResults([]); }
        else { closeMenu(); triggerRef.current?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, query, closeMenu]);

  // Click outside closes menu
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const panel = document.getElementById("products-megamenu");
      const trigger = triggerRef.current;
      const target = e.target as Node;
      if (!panel?.contains(target) && !trigger?.contains(target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen, closeMenu]);

  // Live search
  useEffect(() => {
    if (query.length >= 2) {
      setSearchResults(searchProducts(query, 8));
    } else {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <>
      {/* Trigger <li> — lives in the nav <ul> */}
      <li onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
        <button
          ref={triggerRef}
          onClick={() => (isOpen ? closeMenu() : openMenu())}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls="products-megamenu"
          className="flex items-center gap-1 font-display text-sm font-semibold tracking-wide text-[var(--color-muted)] hover:text-white transition-colors cursor-pointer"
        >
          Products
          <ChevronDown
            className="w-3 h-3 transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </li>

      {/* Portal panel + backdrop — rendered at body level */}
      {mounted && createPortal(
        <>
          {/* Backdrop — visual only, pointer-events:none so z-index never steals events from the header */}
          <div
            aria-hidden
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 48,
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              opacity: isOpen ? 1 : 0,
              pointerEvents: "none",
              transition: "opacity 200ms",
            }}
          />
          {/* Handlers go directly on the panel element — no zero-height wrapper */}
          <MegaPanel
            isOpen={isOpen}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            query={query}
            setQuery={setQuery}
            searchResults={searchResults}
            onClose={closeMenu}
            onPanelMouseEnter={openMenu}
            onPanelMouseLeave={(e) => {
              if (e.clientY <= 72) return;
              scheduleClose();
            }}
          />
        </>,
        document.body
      )}
    </>
  );
}
