import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import SiteFooter from "@/components/sections/SiteFooter";
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
              style={{ fontSize: "var(--text-h2)" }}
            >
              Featured brands
            </h2>
          </RevealOnScroll>

          {/* Featured grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredBrands.map((brand, i) => (
              <RevealOnScroll key={brand.slug} delay={i * 0.07}>
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group aspect-square flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,106,26,0.5)]"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  {/* Logo on white tile so the brand mark reads on the dark card */}
                  <div
                    className="flex items-center justify-center w-full"
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      padding: "0.85rem 1rem",
                      height: "64px",
                      maxWidth: "150px",
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        sizes="150px"
                        className="object-contain"
                      />
                    </div>
                  </div>
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
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  Also distributed
                </h2>
              </RevealOnScroll>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
                {nonFeaturedBrands.map((brand, i) => (
                  <RevealOnScroll key={brand.slug} delay={i * 0.08}>
                    <li>
                      <Link
                        href={`/brands/${brand.slug}`}
                        className="flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 group"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                        }}
                      >
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 relative"
                          style={{ backgroundColor: "#fff", padding: "0.4rem" }}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={brand.logo}
                              alt={`${brand.name} logo`}
                              fill
                              sizes="56px"
                              className="object-contain"
                            />
                          </div>
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
