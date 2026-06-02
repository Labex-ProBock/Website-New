// TODO: Wire to Sage Online API via /api/shipment-status

"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShipmentResult {
  status: "In Transit" | "Delivered" | "Not Found";
  message: string;
  badgeColor: "orange" | "green" | "gray";
}

function getStubResult(ref: string): ShipmentResult {
  const upper = ref.trim().toUpperCase();
  if (upper.startsWith("LBX")) {
    return {
      status: "In Transit",
      message: "Your order is on its way. Expected delivery: 2–3 business days.",
      badgeColor: "orange",
    };
  }
  if (upper.startsWith("DEL")) {
    return {
      status: "Delivered",
      message: "Delivered successfully.",
      badgeColor: "green",
    };
  }
  return {
    status: "Not Found",
    message:
      "Order reference not found. Please check the number or contact us at sales@labex.co.za",
    badgeColor: "gray",
  };
}

const badgeStyles: Record<ShipmentResult["badgeColor"], string> = {
  orange: "bg-[var(--color-orange)]/15 text-[var(--color-orange)]",
  green: "bg-green-500/15 text-green-400",
  gray: "bg-[var(--color-surface-2)] text-[var(--color-muted)]",
};

interface ShipmentCheckerProps {
  className?: string;
}

export default function ShipmentChecker({ className }: ShipmentCheckerProps) {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShipmentResult | null>(null);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = ref.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);

    try {
      await fetch(`/api/shipment-status?ref=${encodeURIComponent(trimmed)}`);
    } catch {
      // Silently continue to stubbed result
    }

    setResult(getStubResult(trimmed));
    setLoading(false);
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Centred, constrained pill */}
      <form
        onSubmit={handleCheck}
        style={{ maxWidth: "460px", margin: "0 auto" }}
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="Order reference number"
            className="flex-1 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] focus:border-[var(--color-orange)] text-white placeholder-[var(--color-muted)] outline-none text-sm transition-colors"
            style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem", paddingLeft: "1.5rem", paddingRight: "1rem" }}
          />
          <button
            type="submit"
            disabled={!ref.trim() || loading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-orange)] hover:bg-[var(--color-orange-deep)] disabled:opacity-50 text-white text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Check
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.25)",
            fontSize: "0.72rem",
            marginTop: "0.5rem",
            letterSpacing: "0.04em",
          }}
        >
          e.g. LBX-2026-04812
        </p>
      </form>

      {result && (
        <div
          style={{ maxWidth: "460px", margin: "1rem auto 0" }}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-semibold",
                badgeStyles[result.badgeColor]
              )}
            >
              {result.status}
            </span>
          </div>
          <p className="text-sm text-[var(--color-muted)]">{result.message}</p>
        </div>
      )}
    </div>
  );
}
