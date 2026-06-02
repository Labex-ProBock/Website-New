// Lab glassware outlines — erlenmeyer flask, beaker, test tube

export function EducationMotif() {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes em-breathe { 0%,100% { transform:scale(1);   opacity:1;   }
                                 50%      { transform:scale(1.03); opacity:0.7; } }
        @keyframes em-wobble  { 0%,100% { transform:rotate(0deg);  }
                                 30%      { transform:rotate(1.5deg); }
                                 70%      { transform:rotate(-1deg); } }
        .em-flask { transform-box:fill-box; transform-origin:center bottom;
                    animation:em-breathe 7s ease-in-out infinite; }
        .em-beaker { transform-box:fill-box; transform-origin:center bottom;
                     animation:em-breathe 9s ease-in-out infinite 1s; }
        .em-tube  { transform-box:fill-box; transform-origin:center top;
                    animation:em-wobble 6s ease-in-out infinite; }
      `}</style>

      {/* ── Erlenmeyer flask (centre) ──────────────────────────── */}
      <g className="em-flask">
        {/* Body */}
        <path
          d="M 530,580 C 400,580 350,440 390,320 L 490,180 L 510,180 L 510,220 L 490,220 L 570,340 C 610,440 660,580 530,580 Z"
          stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)"
        />
        {/* Neck */}
        <rect x="490" y="140" width="40" height="90"
          stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
        {/* Lip */}
        <rect x="480" y="130" width="60" height="18"
          stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none" />

        {/* Liquid level line inside flask */}
        <line x1="390" y1="460" x2="640" y2="460"
          stroke="rgba(255,106,26,0.18)" strokeWidth="1" />
      </g>

      {/* ── Beaker (left) ─────────────────────────────────────── */}
      <g className="em-beaker" transform="translate(-260, 40)">
        {/* Body (slight trapezoid) */}
        <path
          d="M 390,570 L 390,300 L 660,300 L 660,570 C 660,580 650,590 640,590 L 410,590 C 400,590 390,580 390,570 Z"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="rgba(255,255,255,0.015)"
        />
        {/* Lip / spout */}
        <path d="M 630,300 Q 680,300 685,280" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
        {/* Scale lines */}
        {[360, 420, 480, 540].map((y) => (
          <line key={y} x1="640" y1={y} x2="660" y2={y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
      </g>

      {/* ── Test tube (right) ─────────────────────────────────── */}
      <g className="em-tube" transform="translate(320, -60)">
        <rect x="550" y="180" width="50" height="280" rx="25"
          stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="rgba(255,255,255,0.015)" />
        {/* Rim */}
        <rect x="540" y="170" width="70" height="22"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}
