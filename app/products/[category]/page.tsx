import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteFooter from "@/components/sections/SiteFooter";
import CategoryGrid from "@/components/catalogue/CategoryGrid";
import { categories, categoryBySlug } from "@/data/categories";
import { products as allProducts } from "@/data/products.generated";
import { groupProducts } from "@/lib/variant-grouper";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = categoryBySlug[slug];
  if (!cat) return {};
  return {
    title: `${cat.name} | Labex`,
    description: cat.description,
  };
}

const STAT_LABEL: React.CSSProperties = {
  fontFamily: "monospace",
  fontSize: "0.625rem",
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  color: "var(--color-muted)",
  marginBottom: "0.375rem",
};

const STAT_VALUE: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: "2.25rem",
  lineHeight: 1,
  color: "#fff",
};

export default async function ProductCategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const cat = categoryBySlug[slug];
  if (!cat) notFound();

  const isQuoteRequired = slug === "quote-required";

  // Strip cost fields and group variants
  const catProducts = allProducts
    .filter((p) => p.category === slug && p.active)
    .map((p) => ({ ...p, avgCost: null as null, lastCost: null as null }));

  const catGroups = groupProducts(catProducts);

  // Derived stats for the hero panel
  const totalCount  = catGroups.length;
  const brandCount  = new Set(catGroups.map((g) => g.brand).filter((b) => b && b.trim())).size;
  const inStockCount = catGroups.filter((g) => g.variants.some((v) => v.qtyOnHand > 0)).length;

  // Category index for section annotation
  const mainCats = categories.filter((c) => c.slug !== "quote-required");
  const catIndex = mainCats.findIndex((c) => c.slug === slug) + 1;

  return (
    <>
      {/* ── Editorial hero ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-black-warm)",
          paddingTop: "8rem",
          paddingBottom: "4.5rem",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Orange radial bloom — top-right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 10%, rgba(255,106,26,0.13) 0%, transparent 70%)",
          }}
        />

        <div
          className="relative"
          style={{ maxWidth: "72rem", margin: "0 auto", paddingLeft: "2rem", paddingRight: "2rem" }}
        >
          {/* Back link */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm mb-10 transition-opacity hover:opacity-70"
            style={{ color: "var(--color-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            All products
          </Link>

          {/* Section annotation */}
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.6875rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--color-muted)",
              marginBottom: "1rem",
            }}
          >
            {isQuoteRequired ? "02 / Catalogue · Specialist" : `02 / Catalogue · ${catIndex} of ${mainCats.length}`}
          </p>

          {/* Title + stats row */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">

            {/* Left: title + description */}
            <div>
              <h1
                className="font-display font-black text-white"
                style={{
                  fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  marginBottom: "1.25rem",
                }}
              >
                {cat.name}
              </h1>
              <p
                style={{
                  color: "var(--color-muted)",
                  fontSize: "1.0625rem",
                  lineHeight: 1.75,
                  maxWidth: "36rem",
                }}
              >
                {isQuoteRequired
                  ? "Specialised and custom items available on request. Our team will advise on specifications and pricing tailored to your application."
                  : cat.description}
              </p>
            </div>

            {/* Right: stats panel — hidden for quote-required */}
            {!isQuoteRequired && (
              <dl
                className="grid grid-cols-3 gap-x-10 lg:border-l lg:pl-12"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div>
                  <dt style={STAT_LABEL}>Products</dt>
                  <dd className="tabular-nums" style={STAT_VALUE}>{totalCount}</dd>
                </div>
                <div>
                  <dt style={STAT_LABEL}>Brands</dt>
                  <dd className="tabular-nums" style={STAT_VALUE}>
                    {brandCount > 0 ? brandCount : "—"}
                  </dd>
                </div>
                <div>
                  <dt style={STAT_LABEL}>In stock</dt>
                  <dd className="tabular-nums" style={STAT_VALUE}>{inStockCount}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </section>

      {/* ── Filter + grid ─────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "var(--color-black-warm)",
          paddingBottom: "8rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <CategoryGrid groups={catGroups} />
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
