export function PharmaceuticalMotif() {
  const pills = [
    { x: 200, y: 180, w: 110, h: 40, r: 20, angle: -15, dur: "9s",  delay: "0s",  dist: -28, op: 0.09 },
    { x: 900, y: 260, w:  80, h: 32, r: 16, angle:  30, dur: "12s", delay: "-3s", dist: -20, op: 0.07 },
    { x: 500, y: 120, w: 130, h: 46, r: 23, angle:   5, dur: "15s", delay: "-7s", dist: -35, op: 0.06 },
    { x: 750, y: 550, w:  90, h: 34, r: 17, angle: -40, dur: "10s", delay: "-4s", dist: -22, op: 0.08 },
    { x: 300, y: 490, w:  70, h: 28, r: 14, angle:  55, dur: "13s", delay: "-9s", dist: -18, op: 0.07 },
    { x: 1000,y: 450, w: 100, h: 38, r: 19, angle: -20, dur: "11s", delay: "-2s", dist: -26, op: 0.06 },
    { x: 150, y: 650, w:  60, h: 24, r: 12, angle:  10, dur: "14s", delay: "-6s", dist: -15, op: 0.05 },
    { x: 680, y: 680, w: 120, h: 44, r: 22, angle: -35, dur: "16s", delay: "-1s", dist: -32, op: 0.07 },
  ];

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    >
      {pills.map((p, i) => (
        <g key={i} transform={`rotate(${p.angle},${p.x},${p.y})`}>
          <rect
            x={p.x - p.w / 2}
            y={p.y - p.h / 2}
            width={p.w}
            height={p.h}
            rx={p.r}
            fill={`rgba(255,255,255,${p.op})`}
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; 0,${p.dist}; 0,0`}
              dur={p.dur}
              begin={p.delay}
              repeatCount="indefinite"
            />
          </rect>
          {/* Capsule dividing line */}
          <line
            x1={p.x}
            y1={p.y - p.h / 2}
            x2={p.x}
            y2={p.y + p.h / 2}
            stroke={`rgba(255,255,255,${p.op * 0.6})`}
            strokeWidth="1"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; 0,${p.dist}; 0,0`}
              dur={p.dur}
              begin={p.delay}
              repeatCount="indefinite"
            />
          </line>
        </g>
      ))}

      {/* Single orange hairline accent */}
      <line x1="0" y1="400" x2="1200" y2="400"
        stroke="rgba(255,106,26,0.06)" strokeWidth="1" />
    </svg>
  );
}
