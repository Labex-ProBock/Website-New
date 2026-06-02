export function ResearchMotif() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes rm-orbit-a { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes rm-orbit-b { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes rm-orbit-c { from { transform: rotate(60deg); } to { transform: rotate(420deg); } }
        @keyframes rm-pulse   { 0%,100% { opacity:.5; } 50% { opacity:.9; } }
        .rm-a { transform-box:fill-box; transform-origin:center; animation:rm-orbit-a 22s linear infinite; }
        .rm-b { transform-box:fill-box; transform-origin:center; animation:rm-orbit-b 34s linear infinite; }
        .rm-c { transform-box:fill-box; transform-origin:center; animation:rm-orbit-c 16s linear infinite; }
        .rm-glow { animation:rm-pulse 4s ease-in-out infinite; }
      `}</style>

      {/* Outer ellipse */}
      <ellipse className="rm-a" cx="600" cy="400" rx="380" ry="105"
        stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />

      {/* Mid ellipse — different plane */}
      <ellipse className="rm-b" cx="600" cy="400" rx="260" ry="78"
        stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none"
        style={{ transform: "rotate(-55deg)", transformBox: "fill-box", transformOrigin: "center" }} />

      {/* Inner ellipse */}
      <ellipse className="rm-c" cx="600" cy="400" rx="155" ry="52"
        stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" fill="none" />

      {/* Orange hairline nucleus */}
      <circle cx="600" cy="400" r="32" fill="rgba(255,106,26,0.06)" className="rm-glow" />
      <circle cx="600" cy="400" r="5"  fill="rgba(255,106,26,0.55)" />

      {/* Electron dots on outer ring */}
      <circle cx="980" cy="400" r="4" fill="rgba(255,255,255,0.18)" />
      <circle cx="220" cy="400" r="3" fill="rgba(255,255,255,0.12)" />

      {/* Faint star-field background dots */}
      {[
        [120,80],[980,650],[300,700],[900,120],[700,50],[150,500],
      ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,0.08)" />
      ))}
    </svg>
  );
}
