// Geological strata lines + faceted crystal — mining / metallurgy motif

export function MiningMotif() {
  // diagonal strata bands across the right side
  const strata = [340, 410, 480, 550, 620, 690];
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes mn-shimmer { 0%,100% { opacity: 0.06; } 50% { opacity: 0.13; } }
        .mn-crystal { animation: mn-shimmer 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .mn-crystal { animation: none; } }
      `}</style>

      {/* Strata */}
      {strata.map((y, i) => (
        <line
          key={i}
          x1={620 + i * 18}
          y1={y}
          x2={1200}
          y2={y - 70}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1.5"
        />
      ))}

      {/* Faceted crystal */}
      <g className="mn-crystal">
        <polygon points="930,150 1000,210 980,330 900,360 850,260 880,180"
          fill="rgba(255,106,26,0.05)" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
        <line x1="930" y1="150" x2="940" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="850" y1="260" x2="940" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <line x1="1000" y1="210" x2="940" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </g>

      {/* Orange hairline accent */}
      <line x1="0" y1="560" x2="560" y2="560" stroke="rgba(255,106,26,0.07)" strokeWidth="1" />
    </svg>
  );
}
