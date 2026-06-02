import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/sections/SiteFooter";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import { industries } from "@/content/industries";
import { ArrowRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const C = "center" as const;

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} | Labex`,
    description: industry.description,
  };
}

export default async function IndustryPage({ params }: PageProps) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);

  if (!industry) notFound();

  const others = industries.filter((i) => i.slug !== slug).slice(0, 4);
  const hasDescriptions = industry.equipment?.some((e) => e.description);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative w-full overflow-hidden" style={{ height: 600 }}>
        <Image
          src={industry.image}
          alt={industry.name}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 50%, rgba(10,10,10,0.2) 100%)",
          }}
        />
        {/* Orange left strip */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: "var(--color-orange)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6">
          <RevealOnScroll className="text-center" from="fade">
            <p
              style={{
                textAlign: C,
                color: "var(--color-orange)",
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Industries we serve
            </p>
            <h1
              style={{
                textAlign: C,
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "#fff",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1.05,
                marginBottom: "1rem",
              }}
            >
              {industry.name}
            </h1>
            <p
              style={{
                textAlign: C,
                color: "rgba(255,255,255,0.72)",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                maxWidth: "38rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {industry.headline}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Intro ── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
          <RevealOnScroll className="text-center">
            <p
              style={{
                textAlign: C,
                color: "var(--color-muted)",
                fontSize: "1.05rem",
                lineHeight: 1.85,
              }}
            >
              {industry.intro ?? industry.description}
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Equipment grid ── */}
      {industry.equipment && industry.equipment.length > 0 && (
        <section
          style={{
            backgroundColor: "var(--color-black-warm)",
            paddingTop: "5rem",
            paddingBottom: "5rem",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <RevealOnScroll className="text-center">
              <h2
                style={{
                  textAlign: C,
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  color: "#fff",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  marginBottom: "3rem",
                }}
              >
                Equipment we supply
              </h2>
            </RevealOnScroll>

            <div
              className={`grid gap-5 ${hasDescriptions ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}
            >
              {industry.equipment.map((item, i) => (
                <RevealOnScroll key={item.name} delay={Math.min(i * 0.04, 0.4)} className="h-full">
                  <div
                    className="border border-[var(--color-border)] rounded-2xl h-full"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      padding: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "2rem",
                        height: "4px",
                        backgroundColor: "var(--color-orange)",
                        borderRadius: "999px",
                        marginBottom: "1rem",
                      }}
                    />
                    <h3
                      style={{
                        textAlign: C,
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: hasDescriptions ? "1rem" : "0.9rem",
                        marginBottom: item.description ? "0.6rem" : 0,
                      }}
                    >
                      {item.name}
                    </h3>
                    {item.description && (
                      <p
                        style={{
                          textAlign: C,
                          color: "var(--color-muted)",
                          fontSize: "0.82rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        style={{
          backgroundColor: "var(--color-black)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
          {industry.closing && (
            <RevealOnScroll className="text-center">
              <p
                style={{
                  textAlign: C,
                  color: "var(--color-muted)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  marginBottom: "2.5rem",
                }}
              >
                {industry.closing}
              </p>
            </RevealOnScroll>
          )}
          <RevealOnScroll className="text-center">
            <h2
              style={{
                textAlign: C,
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "#fff",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                marginBottom: "0.75rem",
              }}
            >
              Ready to equip your {industry.shortName} lab?
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1} className="text-center">
            <p
              style={{
                textAlign: C,
                color: "var(--color-muted)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              Tell us what you need — we&apos;ll have a quote to you within 1 business day.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2} className="text-center">
            <div style={{ textAlign: C }}>
              <Link
                href="/quote"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "var(--color-orange)",
                  color: "#fff",
                  padding: "0.875rem 2rem",
                  borderRadius: "0.75rem",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                Request a quote
                <ArrowRight size={16} />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Other industries ── */}
      <section
        style={{
          backgroundColor: "var(--color-black-warm)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "5rem",
          paddingBottom: "5rem",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <RevealOnScroll className="text-center">
            <h2
              style={{
                textAlign: C,
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "#fff",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                marginBottom: "2.5rem",
              }}
            >
              Other industries
            </h2>
          </RevealOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((other, i) => (
              <RevealOnScroll key={other.slug} delay={i * 0.08}>
                <Link
                  href={`/industries/${other.slug}`}
                  className="group block relative overflow-hidden rounded-2xl"
                  style={{
                    aspectRatio: "4/3",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Image
                    src={other.image}
                    alt={other.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.2) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <p
                      style={{
                        color: "var(--color-orange)",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {other.shortName}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.9rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {other.name}
                    </h3>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll delay={0.3} className="text-center">
            <div style={{ textAlign: C, marginTop: "2rem" }}>
              <Link
                href="/industries"
                style={{
                  color: "var(--color-orange)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                View all industries
                <ArrowRight size={14} />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
