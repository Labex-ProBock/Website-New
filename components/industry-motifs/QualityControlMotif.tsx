// Measurement grid of dots + sweeping gauge needle

export function QualityControlMotif() {
  // Gauge parameters
  const gx = 780;
  const gy = 430;
  const gr = 200;

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <defs>
        <pattern id="qc-dots" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
          <circle cx="22" cy="22" r="1.5" fill="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>

      <style>{`
        @keyframes qc-sweep {
          0%   { transform: rotate(-135deg); }
          40%  { transform: rotate(20deg);  }
          70%  { transform: rotate(80deg);  }
          85%  { transform: rotate(55deg);  }
          100% { transform: rotate(-135deg);}
        }
        @keyframes qc-blink { 0%,80%,100% { opacity:1; } 82%,98% { opacity:0; } }
        .qc-needle { transform-box:fill-box; transform-origin:${gx}px ${gy}px; animation:qc-sweep 6s ease-in-out infinite; }
        .qc-blink  { animation:qc-blink 6s ease-in-out infinite; }
      `}</style>

      {/* Dot grid */}
      <rect width="1200" height="800" fill="url(#qc-dots)" />

      {/* Gauge arc (180° semicircle, rotated to face up) */}
      <path
        d={`M ${gx - gr},${gy} A ${gr},${gr} 0 0 1 ${gx + gr},${gy}`}
        stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" fill="none"
        transform={`rotate(-180,${gx},${gy})`}
      />

      {/* Tick marks */}
      {Array.from({ length: 11 }, (_, i) => {
        const angleDeg = -135 + i * 27;
        const rad = (angleDeg * Math.PI) / 180;
        const x1 = gx + (gr - 0) * Math.cos(rad);
        const y1 = gy + (gr - 0) * Math.sin(rad);
        const x2 = gx + (gr - (i % 5 === 0 ? 20 : 10)) * Math.cos(rad);
        const y2 = gy + (gr - (i % 5 === 0 ? 20 : 10)) * Math.sin(rad);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={`rgba(255,255,255,${i % 5 === 0 ? 0.1 : 0.05})`} strokeWidth="1" />
        );
      })}

      {/* Orange "perfect" tick at 55° (in gauge space) */}
      {(() => {
        const angleDeg = -135 + 8 * 27; // tick index 8 ≈ "good zone"
        const rad = (angleDeg * Math.PI) / 180;
        return (
          <line
            x1={gx + gr * Math.cos(rad)} y1={gy + gr * Math.sin(rad)}
            x2={gx + (gr - 22) * Math.cos(rad)} y2={gy + (gr - 22) * Math.sin(rad)}
            stroke="rgba(255,106,26,0.5)" strokeWidth="2"
          />
        );
      })()}

      {/* Needle */}
      <g className="qc-needle">
        <line
          x1={gx} y1={gy}
          x2={gx + (gr - 30) * Math.cos(((-135) * Math.PI) / 180)}
          y2={gy + (gr - 30) * Math.sin(((-135) * Math.PI) / 180)}
          stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"
        />
      </g>

      {/* Center hub */}
      <circle cx={gx} cy={gy} r="8" fill="rgba(255,255,255,0.12)" />
      <circle cx={gx} cy={gy} r="3" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}
