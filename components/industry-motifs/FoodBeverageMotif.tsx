// Flowing sine waves + floating droplets

export function FoodBeverageMotif() {
  const waves = [
    { amplitude: 55, frequency: 0.003, yBase: 260, speed: "18s", delay: "0s",  op: 0.08 },
    { amplitude: 40, frequency: 0.004, yBase: 400, speed: "24s", delay: "-6s", op: 0.06 },
    { amplitude: 65, frequency: 0.002, yBase: 560, speed: "30s", delay: "-12s",op: 0.05 },
  ];

  // Build a wave SVG path from bezier control points
  function wavePath(amp: number, freq: number, yBase: number, xOffset = 0) {
    const pts: [number, number][] = [];
    for (let x = -200; x <= 1400; x += 40) {
      pts.push([x, yBase + amp * Math.sin((x + xOffset) * freq)]);
    }
    const d = pts
      .map((p, i) => {
        if (i === 0) return `M ${p[0].toFixed(0)},${p[1].toFixed(1)}`;
        const prev = pts[i - 1];
        const cpx = (prev[0] + p[0]) / 2;
        return `C ${cpx.toFixed(0)},${prev[1].toFixed(1)} ${cpx.toFixed(0)},${p[1].toFixed(1)} ${p[0].toFixed(0)},${p[1].toFixed(1)}`;
      })
      .join(" ");
    return d;
  }

  const droplets = [
    { cx: 200, cy: 200, r: 28, dur: "10s", delay: "0s"  },
    { cx: 950, cy: 160, r: 18, dur: "13s", delay: "-4s" },
    { cx: 350, cy: 640, r: 22, dur: "11s", delay: "-7s" },
    { cx: 900, cy: 600, r: 14, dur: "15s", delay: "-2s" },
    { cx: 650, cy: 100, r: 10, dur: "9s",  delay: "-9s" },
  ];

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <style>{`
        @keyframes fb-flow-a { from { transform:translateX(0);    } to { transform:translateX(-200px); } }
        @keyframes fb-flow-b { from { transform:translateX(-100px);} to { transform:translateX(100px); } }
        @keyframes fb-float  { 0%,100% { transform:translateY(0);  } 50% { transform:translateY(-18px); } }
        .fb-w0 { animation:fb-flow-a 18s linear infinite; }
        .fb-w1 { animation:fb-flow-b 24s linear infinite; }
        .fb-w2 { animation:fb-flow-a 30s linear infinite; }
      `}</style>

      {/* Waves */}
      {waves.map((w, i) => (
        <path
          key={i}
          className={`fb-w${i}`}
          d={wavePath(w.amplitude, w.frequency, w.yBase)}
          stroke={`rgba(255,255,255,${w.op})`}
          strokeWidth="1.5"
          fill="none"
        />
      ))}

      {/* Droplets */}
      {droplets.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="rgba(255,255,255,0.03)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; 0,-${d.r * 0.6}; 0,0`}
            dur={d.dur}
            begin={d.delay}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Orange hairline accent — a single horizontal rule */}
      <line x1="0" y1="400" x2="600" y2="400"
        stroke="rgba(255,106,26,0.07)" strokeWidth="1" />
    </svg>
  );
}
