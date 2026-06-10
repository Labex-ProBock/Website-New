"use client";

import Link from "next/link";
import { brands } from "@/content/brands";
import BrandLogo from "@/components/ui/BrandLogo";

/* Duplicate list for seamless loop */
const ITEMS = [...brands, ...brands];

export default function BrandWall() {
  return (
    <section
      style={{ backgroundColor: "#0E0E10", paddingTop: "9rem", paddingBottom: "7rem" }}
      className="relative"
    >
      {/* Section heading — kept clearly legible with breathing room */}
      <p
        className="text-center"
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.8rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.28em",
          marginBottom: "3.5rem",
        }}
      >
        Brands we distribute
      </p>

      {/* Marquee track — scrolls, pauses on hover. overflow-x clips the row,
          vertical padding gives the hover-lift room so it isn't cut off. */}
      <div
        className="relative overflow-hidden"
        style={{
          paddingTop: "1rem",
          paddingBottom: "1rem",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-8 whitespace-nowrap brand-marquee"
          style={{ width: "max-content", paddingLeft: "2rem" }}
        >
          {ITEMS.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              href={`/brands/${brand.slug}`}
              className="brand-tile shrink-0"
              style={{ width: "184px", height: "84px" }}
              aria-label={brand.name}
            >
              <BrandLogo logo={brand.logo} name={brand.name} boxW="78%" boxH="62%" sizes="184px" />
            </Link>
          ))}
        </div>
      </div>

      {/* Explore link */}
      <div className="flex justify-center" style={{ marginTop: "3.5rem" }}>
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
