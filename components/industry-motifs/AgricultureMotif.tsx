// Gently swaying stems with leaves — agriculture motif

function Sprig({ x, h, delay, flip }: { x: number; h: number; delay: string; flip: boolean }) {
  const baseY = 720;
  const topY = baseY - h;
  const dir = flip ? -1 : 1;
  const leaf = (y: number, len: number) =>
    `M ${x} ${y} q ${dir * len} ${-len * 0.5} ${dir * len * 1.4} ${-len * 0.1} q ${-dir * len * 0.4} ${len * 0.45} ${-dir * len * 1.4} ${len * 0.1} Z`;
  return (
    <g className="ag-sprig" style={{ transformOrigin: `${x}px ${baseY}px`, animationDelay: delay }}>
      <path d={`M ${x} ${baseY} C ${x + dir * 18} ${baseY - h * 0.5}, ${x - dir * 14} ${topY + h * 0.3}, ${x} ${topY}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <path d={leaf(baseY - h * 0.45, 46)} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <path d={leaf(baseY - h * 0.7, 38)} fill="rgba(255,106,26,0.05)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <circle cx={x} cy={topY} r="5" fill="rgba(255,106,26,0.12)" />
    </g>
  );
}

export function AgricultureMotif() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes ag-sway { 0%,100% { transform: rotate(-2.5deg); } 50% { transform: rotate(2.5deg); } }
        .ag-sprig { animation: ag-sway 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ag-sprig { animation: none; } }
      `}</style>
      <Sprig x={860} h={300} delay="0s" flip={false} />
      <Sprig x={970} h={380} delay="-1.6s" flip />
      <Sprig x={1080} h={260} delay="-3.2s" flip={false} />
      {/* Orange hairline accent (ground line) */}
      <line x1="0" y1="560" x2="560" y2="560" stroke="rgba(255,106,26,0.07)" strokeWidth="1" />
    </svg>
  );
}
