// Expanding ripple rings + a falling droplet — water / environmental motif

export function WaterEnvironmentalMotif() {
  const rings = [
    { cx: 950, cy: 330, delay: "0s" },
    { cx: 950, cy: 330, delay: "-2.6s" },
    { cx: 950, cy: 330, delay: "-5.2s" },
  ];
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes we-ripple {
          0%   { r: 12px;  opacity: 0.18; }
          100% { r: 230px; opacity: 0; }
        }
        @keyframes we-drop {
          0%   { transform: translateY(-40px); opacity: 0; }
          25%  { opacity: 0.5; }
          55%  { transform: translateY(110px); opacity: 0.5; }
          70%  { opacity: 0; }
          100% { opacity: 0; }
        }
        .we-ring { animation: we-ripple 7.8s ease-out infinite; }
        .we-droplet { animation: we-drop 7.8s ease-in infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .we-ring, .we-droplet { animation: none; } }
      `}</style>

      {rings.map((r, i) => (
        <circle
          key={i}
          className="we-ring"
          cx={r.cx}
          cy={r.cy}
          r={12}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="1.5"
          style={{ animationDelay: r.delay }}
        />
      ))}

      {/* Falling droplet above the ripple origin */}
      <path
        className="we-droplet"
        d="M950 250 C 962 272 970 286 970 298 a 20 20 0 1 1 -40 0 c 0 -12 8 -26 20 -48 Z"
        fill="rgba(255,106,26,0.10)"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />

      {/* Orange hairline accent */}
      <line x1="0" y1="600" x2="540" y2="600" stroke="rgba(255,106,26,0.07)" strokeWidth="1" />
    </svg>
  );
}
