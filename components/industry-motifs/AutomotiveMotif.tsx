// Slowly rotating cog rings — automotive / mechanical motif

function Cog({ cx, cy, r, teeth, cls }: { cx: number; cy: number; r: number; teeth: number; cls: string }) {
  const spokes = Array.from({ length: teeth }, (_, i) => {
    const a = (i / teeth) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a) * (r + 22);
    const y2 = cy + Math.sin(a) * (r + 22);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.07)" strokeWidth="2" />;
  });
  return (
    <g className={cls} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth="2" fill="none" />
      <circle cx={cx} cy={cy} r={r * 0.55} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />
      {spokes}
    </g>
  );
}

export function AutomotiveMotif() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes am-spin     { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes am-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        .am-cog-a { animation: am-spin 60s linear infinite; }
        .am-cog-b { animation: am-spin-rev 42s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .am-cog-a, .am-cog-b { animation: none; } }
      `}</style>
      <Cog cx={930} cy={250} r={150} teeth={18} cls="am-cog-a" />
      <Cog cx={1080} cy={470} r={95} teeth={14} cls="am-cog-b" />
      {/* Orange hairline accent */}
      <line x1="0" y1="560" x2="560" y2="560" stroke="rgba(255,106,26,0.07)" strokeWidth="1" />
    </svg>
  );
}
