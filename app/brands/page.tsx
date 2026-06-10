import type { Metadata } from "next";
import Link from "next/link";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SiteFooter from "@/components/sections/SiteFooter";
import BrandLogo from "@/components/ui/BrandLogo";
import { brands, featuredBrands } from "@/content/brands";

export const metadata: Metadata = {
  title: "Brands | Labex Laboratory Equipment",
  description:
    "Labex distributes world-leading laboratory brands including Heidolph, Sartorius, IKA, Cole-Parmer, DWK Life Sciences, and more. Full technical support and local stock.",
};

export default function BrandsPage() {
  const nonFeaturedBrands = brands.filter((b) => !b.featured);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--color-black-warm)" }}
        className="py-40 text-center px-6"
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-6"
            style={{ color: "var(--color-orange)" }}
          >
            Our portfolio
          </p>
          <h1 className="font-display font-black text-white leading-tight" style={{ fontSize: "var(--text-h1)" }}>
            Our brands
          </h1>
          <RevealOnScroll delay={0.3}>
            <p
              className="mt-6 max-w-2xl mx-auto leading-relaxed"
              style={{
                color: "var(--color-muted)",
                fontSize: "var(--text-large)",
              }}
            >
              We distribute the world&apos;s leading laboratory brands, with
              full technical support and local stock.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Featured brands ───────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "var(--section-gap)",
          paddingBottom: "var(--section-gap)",
        }}
        className="px-6"
      >
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <h2
              className="font-display font-bold text-white mb-12"
              style={{ fontSize: "var(--text-h2)", textAlign: "center" }}
            >
              Featured brands
            </h2>
          </RevealOnScroll>

          {/* Featured grid — flex-wrap + justify-center so a partial last
              row (e.g. the lone MRC Lab card) centres instead of hanging left.
              Responsive basis reproduces the old 2 / 3 / 5 column widths. */}
          <div className="flex flex-wrap justify-center gap-4">
            {featuredBrands.map((brand, i) => (
              <RevealOnScroll
                key={brand.slug}
                delay={i * 0.07}
                className="basis-[calc((100%-1rem)/2)] md:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-4rem)/5)]"
              >
                <Link
                  href={`/brands/${brand.slug}`}
                  className="brand-tile group aspect-square w-full flex flex-col items-center justify-center gap-5 cursor-pointer"
                  style={{ padding: "1.5rem" }}
                >
                  {/* Full-colour logo on the dark matte tile */}
                  <BrandLogo
                    logo={brand.logo}
                    name={brand.name}
                    boxW="84%"
                    boxH="72px"
                    sizes="220px"
                  />
                  <div style={{ textAlign: "center" }}>
                    <p className="font-semibold text-white text-sm">{brand.name}</p>
                    <p
                      className="text-xs mt-1 leading-tight"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {brand.tagline}
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>

          {/* All brands list */}
          {nonFeaturedBrands.length > 0 && (
            <div className="mt-16">
              <RevealOnScroll>
                <h2
                  className="font-display font-bold text-white mb-8"
                  style={{ fontSize: "var(--text-h2)", textAlign: "center" }}
                >
                  Also distributed
                </h2>
              </RevealOnScroll>
              {/* flex-wrap + justify-center centres a partial last row;
                  mx-auto centres the list so the title sits above its middle.
                  Each card keeps its logo-left + text-right layout. */}
              <ul className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {nonFeaturedBrands.map((brand, i) => (
                  <RevealOnScroll
                    key={brand.slug}
                    delay={i * 0.08}
                    className="basis-full sm:basis-[calc((100%-1rem)/2)]"
                  >
                    <li>
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="brand-tile flex items-center gap-4 group w-full"
                        style={{ padding: "1rem 1.25rem" }}
                      >
                        <div
                          className="shrink-0 flex items-center justify-center"
                          style={{ width: "72px", height: "44px" }}
                        >
                          <BrandLogo
                            logo={brand.logo}
                            name={brand.name}
                            boxW="100%"
                            boxH="100%"
                            sizes="72px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">
                            {brand.name}
                          </p>
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: "var(--color-muted)" }}
                          >
                            {brand.tagline}
                          </p>
                        </div>
                      </Link>
                    </li>
                  </RevealOnScroll>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
