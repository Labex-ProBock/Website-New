// Molecular hexagonal lattice — slow rotation + node pulse

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as [number, number];
  });
}

function Hex({ cx, cy, r, opacity }: { cx: number; cy: number; r: number; opacity: number }) {
  const pts = hexPoints(cx, cy, r);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";
  return (
    <>
      <path d={d} stroke={`rgba(255,255,255,${opacity})`} strokeWidth="1" fill="none" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={`rgba(255,255,255,${opacity * 1.5})`} />
      ))}
    </>
  );
}

export function ChemicalMotif() {
  const R = 80;
  const cx = 600;
  const cy = 400;
  // 6 surrounding centers at distance R*sqrt(3)
  const neighbors = hexPoints(cx, cy, R * Math.sqrt(3));

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes cm-spin  { from { transform: rotate(0deg);   } to { transform: rotate(360deg); } }
        @keyframes cm-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .cm-group { transform-box:fill-box; transform-origin:center; animation:cm-spin 60s linear infinite; }
        .cm-accent { animation:cm-pulse 5s ease-in-out infinite; }
      `}</style>

      <g className="cm-group">
        {/* Central hex */}
        <Hex cx={cx} cy={cy} r={R} opacity={0.1} />

        {/* 6 surrounding hexes */}
        {neighbors.map(([nx, ny], i) => (
          <Hex key={i} cx={nx} cy={ny} r={R} opacity={0.06} />
        ))}

        {/* Connecting lines from center to neighbors */}
        {neighbors.map(([nx, ny], i) => (
          <line key={i}
            x1={cx} y1={cy} x2={nx} y2={ny}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"
          />
        ))}
      </g>

      {/* Orange node accent at center */}
      <circle cx={cx} cy={cy} r="5" fill="rgba(255,106,26,0.45)" className="cm-accent" />
      <circle cx={cx} cy={cy} r="18" fill="rgba(255,106,26,0.06)" className="cm-accent" />
    </svg>
  );
}
