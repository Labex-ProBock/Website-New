// Rotating DNA double-helix — life sciences motif

export function LifeSciencesMotif() {
  const cx = 950;
  const top = 90;
  const bottom = 710;
  const steps = 22;
  const amp = 90;
  const period = 260; // vertical wavelength

  const rungs = [];
  const strandA: [number, number][] = [];
  const strandB: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const y = top + (i / steps) * (bottom - top);
    const phase = (y / period) * Math.PI * 2;
    const xA = cx + Math.sin(phase) * amp;
    const xB = cx - Math.sin(phase) * amp;
    strandA.push([xA, y]);
    strandB.push([xB, y]);
    if (i % 2 === 0) {
      const depth = Math.cos(phase); // -1..1, fade rungs at crossover
      rungs.push(
        <line key={i} x1={xA} y1={y} x2={xB} y2={y}
          stroke={`rgba(255,255,255,${0.03 + Math.abs(depth) * 0.05})`} strokeWidth="1.5" />
      );
    }
  }
  const toPath = (pts: [number, number][]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes ls-sway { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-16px); } }
        .ls-helix { animation: ls-sway 9s ease-in-out infinite; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .ls-helix { animation: none; } }
      `}</style>
      <g className="ls-helix">
        {rungs}
        <path d={toPath(strandA)} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="2" />
        <path d={toPath(strandB)} fill="none" stroke="rgba(255,106,26,0.10)" strokeWidth="2" />
      </g>
      {/* Orange hairline accent */}
      <line x1="0" y1="600" x2="540" y2="600" stroke="rgba(255,106,26,0.07)" strokeWidth="1" />
    </svg>
  );
}
