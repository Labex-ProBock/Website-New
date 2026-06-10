// Shared helpers for rendering brand logos on the dark "brand wall".
// Logos are white-background PNGs that have been keyed to transparency and
// trimmed (see scripts/_logokey.cjs) into /public/brands/transparent/.

export type LogoTreatment = "normal" | "chip" | "lift";

// Dark-ink logos that vanish on a dark tile → need a soft light chip behind them.
const CHIP = new Set(["optika", "scientific", "scotsman"]);
// Muted / low-contrast logos → a subtle backing + slight brightness lift.
const LIFT = new Set(["interscience", "primelab", "wiggens", "bioer", "poleko"]);

function base(logo: string): string {
  return (logo.split("/").pop() || "").replace(/\.png$/i, "");
}

/** Path to the transparent, trimmed version of a logo. */
export function transparentLogo(logo: string): string {
  return "/brands/transparent/" + (logo.split("/").pop() || "");
}

export function logoTreatment(logo: string): LogoTreatment {
  const b = base(logo);
  if (CHIP.has(b)) return "chip";
  if (LIFT.has(b)) return "lift";
  return "normal";
}
