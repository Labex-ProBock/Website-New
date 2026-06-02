"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export default function ProductCategories() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-black)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        paddingTop: "7rem",
        paddingBottom: "7rem",
      }}
      className="relative px-6"
    >
      {/* Subtle orange glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "1px",
          background: "linear-gradient(to right, transparent, var(--color-orange), transparent)",
        }}
      />

      <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
        <RevealOnScroll from="bottom">
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--color-orange)", letterSpacing: "0.25em", marginBottom: "1.25rem" }}
          >
            Product Range
          </p>

          <h2
            className="font-display font-black text-white"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.05, marginBottom: "1.25rem" }}
          >
            Equipment for every application
          </h2>

          <p
            style={{ color: "var(--color-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2.5rem" }}
          >
            From precision balances to rotary evaporators — we distribute a comprehensive range of laboratory instruments across South Africa.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-semibold transition-all duration-200 hover:gap-3"
            style={{
              backgroundColor: "var(--color-orange)",
              color: "#fff",
              padding: "0.8rem 2rem",
              borderRadius: "999px",
              fontSize: "0.95rem",
            }}
          >
            Browse our product range
            <ArrowRight className="w-4 h-4" />
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
