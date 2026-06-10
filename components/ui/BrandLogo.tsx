import Image from "next/image";
import { transparentLogo, logoTreatment } from "@/lib/brand-logo";

/**
 * Renders a brand logo for the dark "brand wall" — full colour on transparent,
 * with per-logo treatment: a soft chip behind dark-ink logos and a subtle
 * backing + brightness lift behind faint ones. Sits inside a .brand-tile.
 */
export default function BrandLogo({
  logo,
  name,
  boxW = "74%",
  boxH = "62%",
  sizes = "180px",
}: {
  logo: string;
  name: string;
  boxW?: string;
  boxH?: string;
  sizes?: string;
}) {
  const treatment = logoTreatment(logo);
  const src = transparentLogo(logo);

  const cls =
    treatment === "chip"
      ? "brand-logo brand-logo--chip"
      : treatment === "lift"
        ? "brand-logo brand-logo--lift"
        : "brand-logo";

  return (
    <span className={cls} style={{ width: boxW, height: boxH }}>
      <span style={{ position: "relative", display: "block", width: "100%", height: "100%" }}>
        <Image src={src} alt={`${name} logo`} fill sizes={sizes} className="object-contain" />
      </span>
    </span>
  );
}
