"use client";

/* A decorative section transition — orange liquid drip from top edge */
export default function LiquidDrip() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        lineHeight: 0,
        pointerEvents: "none",
        overflow: "hidden",
        height: 80,
        backgroundColor: "var(--color-black-warm)",
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        width="100%"
        height="80"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="drip-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A1A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF6A1A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Main wave */}
        <path
          d="M0,0 Q360,60 720,20 Q1080,-20 1440,40 L1440,0 Z"
          fill="url(#drip-grad)"
        />

        {/* Drip drops at low points of the wave */}
        <ellipse cx="680" cy="26" rx="6" ry="10" fill="#FF6A1A" opacity="0.5">
          <animate attributeName="cy" values="26;46;26" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="340" cy="52" rx="4" ry="7" fill="#FF6A1A" opacity="0.4">
          <animate attributeName="cy" values="52;72;52" dur="3.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="3.1s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="1050" cy="32" rx="5" ry="8" fill="#FF6A1A" opacity="0.35">
          <animate attributeName="cy" values="32;55;32" dur="2.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="2.7s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  );
}
