"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useQuoteCart, type CartItem } from "@/lib/quote-cart-store";

interface AddToQuoteButtonProps {
  product: CartItem;
}

export default function AddToQuoteButton({ product }: AddToQuoteButtonProps) {
  const { hasItem, addItem, openDrawer } = useQuoteCart();
  const inCart = hasItem(product.code);

  function handleClick() {
    if (inCart) {
      openDrawer();
    } else {
      addItem(product);
    }
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer"
      style={{
        backgroundColor: inCart ? "transparent" : "var(--color-orange)",
        border: `2px solid ${inCart ? "var(--color-orange)" : "var(--color-orange)"}`,
        color: inCart ? "var(--color-orange)" : "white",
      }}
      onMouseEnter={(e) => {
        if (inCart) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-orange)";
          (e.currentTarget as HTMLButtonElement).style.color = "white";
        } else {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-orange-deep)";
        }
      }}
      onMouseLeave={(e) => {
        if (inCart) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--color-orange)";
        } else {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-orange)";
        }
      }}
    >
      {inCart ? (
        <>
          <Check className="w-4 h-4" />
          In Quote Cart — View Cart
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          Add to Quote Cart
        </>
      )}
    </button>
  );
}
