"use client";

import Link from "next/link";
import Image from "next/image";
import { brands } from "@/content/brands";

/* Duplicate list for seamless loop */
const ITEMS = [...brands, ...brands];

export default function BrandWall() {
  return (
    <section
      style={{ backgroundColor: "#0E0E10", paddingTop: "8rem", paddingBottom: "6rem" }}
      className="relative overflow-hidden"
    >
      {/* Section label */}
      <p
        className="text-center text-xs uppercase tracking-widest"
        style={{ color: "var(--color-muted)", letterSpacing: "0.25em", marginBottom: "3rem" }}
      >
        Brands we distribute
      </p>

      {/* Marquee track — scrolls, pauses on hover */}
      <div
        className="relative overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-12 whitespace-nowrap brand-marquee"
          style={{ width: "max-content", paddingLeft: "3rem" }}
        >
          {ITEMS.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              href={`/brands/${brand.slug}`}
              className="inline-flex items-center justify-center shrink-0 group cursor-pointer transition-all duration-300"
              style={{
                width: "168px",
                height: "72px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "0.9rem 1.25rem",
                opacity: 0.85,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  sizes="168px"
                  className="object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Explore link */}
      <div className="flex justify-center" style={{ marginTop: "3rem" }}>
        <Link
          href="/brands"
          className="text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--color-orange)" }}
        >
          All brands →
        </Link>
      </div>

      <style>{`
        .brand-marquee {
          animation: brand-scroll 50s linear infinite;
        }
        .brand-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes brand-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .brand-marquee { animation: none; }
        }
      `}</style>
    </section>
  );
}
