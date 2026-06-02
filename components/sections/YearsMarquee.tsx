"use client";

import MarqueeKinetic from "@/components/motion/MarqueeKinetic";

export default function YearsMarquee() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0A0A0A", paddingBlock: "6rem" }}
    >
      {/* Warm orange glow centre */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(255,106,26,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Row 1 — scrolls left, orange tint */}
      <MarqueeKinetic
        text="45 YEARS · SINCE 1979 · LABEX ·"
        speed={55}
        direction="left"
        textClassName="font-display font-black text-[var(--color-orange)] opacity-20"
        style={{ fontSize: "clamp(5rem, 14vw, 12rem)", lineHeight: 1 } as React.CSSProperties}
      />

      {/* Row 2 — scrolls right, white tint */}
      <MarqueeKinetic
        text="SOUTH AFRICA · SCIENCE · PRECISION ·"
        speed={38}
        direction="right"
        className="mt-2"
        textClassName="font-display font-black text-white opacity-[0.05]"
        style={{ fontSize: "clamp(5rem, 14vw, 12rem)", lineHeight: 1 } as React.CSSProperties}
      />

      {/* Centre overlay — big "45" stat */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "clamp(9rem, 22vw, 18rem)",
            lineHeight: 1,
            color: "white",
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          45
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "0.3em",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            color: "var(--color-orange)",
            userSelect: "none",
            marginTop: "0.5rem",
          }}
        >
          Years of South African Science
        </span>
      </div>
    </section>
  );
}
