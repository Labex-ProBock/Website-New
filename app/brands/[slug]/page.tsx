import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/sections/SiteFooter";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import LeadForm from "@/components/ui/LeadForm";
import { brands } from "@/content/brands";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return {};
  return {
    title: `${brand.name} | Labex`,
    description: brand.description,
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) notFound();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--color-black-warm)" }}
        className="py-32 text-center px-6"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Logo on a white tile so the brand mark reads on the dark hero */}
          <div
            className="flex items-center justify-center mb-8"
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "1.25rem 1.75rem",
              width: "200px",
              height: "96px",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                fill
                sizes="200px"
                className="object-contain"
              />
            </div>
          </div>
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--color-orange)" }}
          >
            Brand
          </p>
          <h1
            className="font-display font-black text-white leading-tight"
            style={{ fontSize: "var(--text-h1)" }}
          >
            {brand.name}
          </h1>
          <p
            className="mt-4"
            style={{
              color: "var(--color-muted)",
              fontSize: "var(--text-large)",
            }}
          >
            {brand.tagline}
          </p>
        </div>
      </section>

      {/* ── Details section ───────────────────────────────────────────── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "var(--section-gap)",
          paddingBottom: "var(--section-gap)",
        }}
        className="px-6"
      >
        <div className="max-w-4xl mx-auto">

          {/* Description */}
          <RevealOnScroll>
            <p
              className="leading-relaxed mb-10"
              style={{
                color: "var(--color-muted)",
                fontSize: "var(--text-large)",
              }}
            >
              {brand.description}
            </p>
          </RevealOnScroll>

          {/* Category badges */}
          <RevealOnScroll delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-10">
              {brand.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: "var(--color-surface-2)",
                    color: "var(--color-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </RevealOnScroll>

          {/* Products link */}
          <RevealOnScroll delay={0.15}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-semibold text-sm transition-colors"
              style={{ color: "var(--color-orange)" }}
            >
              View products in this category
              <ArrowRight size={16} />
            </Link>
          </RevealOnScroll>

          {/* Divider */}
          <div
            className="my-16"
            style={{
              borderTop: "1px solid var(--color-border)",
            }}
          />

          {/* Lead form */}
          <RevealOnScroll delay={0.1}>
            <div
              className="rounded-3xl p-8"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h2
                className="font-display font-bold text-white mb-2"
                style={{ fontSize: "var(--text-h2)" }}
              >
                Enquire about {brand.name} products
              </h2>
              <p
                className="text-sm mb-8"
                style={{ color: "var(--color-muted)" }}
              >
                Our team knows every product in the {brand.name} range. Ask us
                anything — we&apos;ll get back to you within 1 business day.
              </p>
              <LeadForm />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
