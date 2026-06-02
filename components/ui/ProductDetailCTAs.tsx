"use client";

import { Phone } from "lucide-react";
import AddToQuoteButton from "@/components/ui/AddToQuoteButton";
import type { CartItem } from "@/lib/quote-cart-store";

interface ProductDetailCTAsProps {
  product: CartItem;
  isTierA: boolean;
}

export default function ProductDetailCTAs({ product, isTierA }: ProductDetailCTAsProps) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <AddToQuoteButton product={product} />

        <a
          href="tel:0117281338"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-colors border hover:text-white hover:[border-color:white]"
          style={{
            backgroundColor: "var(--color-surface-2)",
            borderColor: "var(--color-border)",
            color: "var(--color-muted)",
          }}
        >
          <Phone className="w-4 h-4" />
          (011) 728 1338
        </a>
      </div>

      {isTierA && (
        <p className="text-xs mt-4 text-center" style={{ color: "var(--color-muted)" }}>
          Free delivery on premium instruments within Gauteng.
          Technical commissioning available.
        </p>
      )}
    </>
  );
}
