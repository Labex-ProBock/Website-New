import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import SiteFooter from "@/components/sections/SiteFooter";
import ProductGroupDetail from "@/components/ui/ProductGroupDetail";
import { products as allProducts } from "@/data/products.generated";
import { categoryBySlug } from "@/data/categories";
import { resolveProductImage } from "@/lib/product-image";
import { groupProducts } from "@/lib/variant-grouper";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}

// Pre-render one page per product group
export async function generateStaticParams() {
  const active = allProducts.filter((p) => p.tier !== "C" && p.active).map((p) => ({
    ...p,
    avgCost: null as null,
    lastCost: null as null,
  }));
  const groups = groupProducts(active);
  return groups.map((g) => ({ category: g.category, slug: g.groupId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const active = allProducts
    .filter((p) => p.category === category && p.active)
    .map((p) => ({ ...p, avgCost: null as null, lastCost: null as null }));
  const groups = groupProducts(active);
  const group = groups.find((g) => g.groupId === slug);
  if (!group) return {};

  const rep = group.variants.find((v) => v.code === group.representativeSku) ?? group.variants[0];
  const categoryMeta = categoryBySlug[category];
  const title = group.brand
    ? `${group.baseName} — ${group.brand} | Labex`
    : `${group.baseName} | Labex`;
  const priceStr = rep.priceIncl
    ? ` Priced from R ${rep.priceIncl.toLocaleString("en-ZA")}.`
    : "";

  return {
    title,
    description: `${group.baseName} from Labex, South Africa's laboratory equipment specialists.${priceStr} ${categoryMeta?.description ?? ""}`,
    openGraph: { title, type: "website" },
  };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { category, slug } = await params;
  const { variant: variantParam } = await searchParams;

  if (category === "quote-required") {
    redirect("/products/quote-required");
  }

  const active = allProducts
    .filter((p) => p.category === category && p.active)
    .map((p) => ({ ...p, avgCost: null as null, lastCost: null as null }));

  const groups = groupProducts(active);

  // Find group by groupId (new URL scheme)
  const group = groups.find((g) => g.groupId === slug);

  // Backwards compat: if slug matches an individual variant, redirect to its group
  if (!group) {
    const ownerGroup = groups.find((g) => g.variants.some((v) => v.slug === slug));
    if (ownerGroup) {
      const variantCode = ownerGroup.variants.find((v) => v.slug === slug)?.code;
      const target = `/products/${category}/${ownerGroup.groupId}${variantCode ? `?variant=${variantCode}` : ""}`;
      redirect(target);
    }
    notFound();
  }

  const categoryMeta = categoryBySlug[category];
  const isTierA = group.tier === "A";
  const rep = group.variants.find((v) => v.code === group.representativeSku) ?? group.variants[0];

  const { src: imgSrc, alt: imgAlt, isSvg } = resolveProductImage({
    code: rep.code,
    category: group.category,
    tier: group.tier,
    name: group.baseName,
    subcategory: group.subcategory,
  }, "hero");

  // Description from the representative product
  const repProduct = active.find((p) => p.code === rep.code);
  const rawDescription = (repProduct?.rawDescription ?? "").trim();
  const showDescription = rawDescription.length > 30 && rawDescription !== group.baseName;

  // Related: up to 4 other groups from same category, non-C tier
  const relatedGroups = groups
    .filter((g) => g.groupId !== group.groupId && g.tier !== "C")
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: group.baseName,
    sku: rep.code,
    ...(group.brand && { brand: { "@type": "Brand", name: group.brand } }),
    ...(group.subcategory && { category: group.subcategory }),
    offers: group.priceMin
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "ZAR",
          lowPrice: String(group.priceMin),
          ...(group.priceMax && { highPrice: String(group.priceMax) }),
          offerCount: group.variants.length,
          seller: { "@type": "Organization", name: "Labex Pty Ltd" },
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        style={{
          backgroundColor: "var(--color-black-warm)",
          paddingTop: "7rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs mb-10" style={{ color: "var(--color-muted)" }}>
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/products/${category}`} className="hover:text-white transition-colors">
              {categoryMeta?.name ?? category}
            </Link>
            <span>/</span>
            <span className="text-white">{group.baseName}</span>
          </nav>

          {/* Main 2-col grid: image left, sticky aside right */}
          <div
            className={`grid gap-12 ${isTierA ? "lg:grid-cols-[1fr_440px]" : "lg:grid-cols-[1fr_400px]"}`}
            style={{ alignItems: "start" }}
          >
            {/* Left: image */}
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{
                aspectRatio: "1/1",
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid var(--color-border)",
              }}
            >
              {isSvg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imgSrc}
                  alt={imgAlt}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", padding: "3rem" }}
                />
              ) : (
                <Image
                  src={imgSrc}
                  alt={imgAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-contain p-12"
                  placeholder="empty"
                />
              )}
            </div>

            {/* Right: sticky aside */}
            <aside style={{ position: "sticky", top: "6.5rem" }} className="self-start">
              {isTierA && (
                <span
                  className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ backgroundColor: "var(--color-orange)", color: "white" }}
                >
                  Premium
                </span>
              )}

              {group.brand && (
                <p
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-orange)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {group.brand}
                </p>
              )}

              <h1
                className="font-display font-black text-white"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.05, marginBottom: "0.75rem" }}
              >
                {group.baseName}
              </h1>

              {group.subcategory && (
                <Link
                  href={`/products/${category}`}
                  className="inline-flex items-center gap-1.5 text-xs mb-6 transition-opacity hover:opacity-70"
                  style={{ color: "var(--color-muted)" }}
                >
                  <ArrowLeft className="w-3 h-3" />
                  {group.subcategory}
                </Link>
              )}

              {/* Variant selector + price block + CTAs + trust (client) */}
              <ProductGroupDetail
                group={group}
                initialSku={variantParam ?? group.representativeSku}
              />
            </aside>
          </div>

          {/* Below fold */}
          <div style={{ paddingTop: "4rem", paddingBottom: "5rem", display: "flex", flexDirection: "column", gap: "3.5rem" }}>

            {/* Description */}
            {showDescription && (
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "3rem" }}>
                <h2
                  className="font-display font-bold text-white"
                  style={{ fontSize: "1.25rem", marginBottom: "1rem" }}
                >
                  About this product
                </h2>
                <p style={{ color: "var(--color-muted)", lineHeight: 1.8, maxWidth: "48rem" }}>
                  {rawDescription}
                </p>
              </div>
            )}

            {/* Related products */}
            {relatedGroups.length > 0 && (
              <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "3rem" }}>
                <h2
                  className="font-display font-bold text-white"
                  style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}
                >
                  More from {categoryMeta?.name ?? category}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedGroups.map((g) => {
                    const rHref = `/products/${g.category}/${g.groupId}`;
                    const rRep = g.variants.find((v) => v.code === g.representativeSku) ?? g.variants[0];
                    const { src: rSrc, alt: rAlt, isSvg: rIsSvg } = resolveProductImage({
                      code: rRep.code,
                      category: g.category,
                      tier: g.tier,
                      name: g.baseName,
                      subcategory: g.subcategory,
                    }, "card");
                    return (
                      <Link
                        key={g.groupId}
                        href={rHref}
                        className="rounded-xl overflow-hidden border transition-all hover:-translate-y-0.5 hover:border-[rgba(255,106,26,0.4)]"
                        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
                      >
                        <div className="relative aspect-square" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                          {rIsSvg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={rSrc} alt={rAlt} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "1rem" }} />
                          ) : (
                            <Image src={rSrc} alt={rAlt} fill sizes="200px" className="object-contain p-4" placeholder="empty" />
                          )}
                        </div>
                        <div style={{ padding: "0.75rem" }}>
                          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {g.baseName}
                          </p>
                          <p style={{ fontSize: "0.68rem", color: "var(--color-muted)", marginTop: "0.2rem" }}>
                            {g.priceMin ? `From R ${g.priceMin.toLocaleString("en-ZA")}` : "Contact for pricing"}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/products/${category}`}
                  className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition-colors hover:text-white"
                  style={{ color: "var(--color-orange)" }}
                >
                  View all {categoryMeta?.name} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Specialist CTA */}
            <div
              className="rounded-2xl border"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface)",
                padding: "2rem",
              }}
            >
              <p className="font-display font-bold text-white" style={{ fontSize: "1.25rem", marginBottom: "0.625rem" }}>
                Need help choosing?
              </p>
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1.25rem", maxWidth: "40rem" }}>
                Our specialist team is available to advise on the right product for your application.
                Call us directly or send an enquiry.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:0117281338"
                  className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "var(--color-orange)", color: "white", padding: "0.625rem 1.25rem" }}
                >
                  <Phone className="w-4 h-4" />
                  (011) 728 1338
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold border transition-colors hover:border-white/40 hover:text-white"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-muted)", padding: "0.625rem 1.25rem" }}
                >
                  Send an enquiry
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      <SiteFooter />
    </>
  );
}
