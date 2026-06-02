"use client";

import { useEffect, useRef } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import AgentThread from "@/components/ui/AgentThread";
import { useQuoteCart } from "@/lib/quote-cart-store";

interface QuoteDrawerProps {
  open: boolean;
  onClose: () => void;
}

function formatPrice(priceIncl: number | null): string {
  if (!priceIncl) return "Quote";
  return `R ${priceIncl.toLocaleString("en-ZA", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function QuoteDrawer({ open, onClose }: QuoteDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { items, removeItem, clearCart, initContext } = useQuoteCart();

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Trap focus */
  useEffect(() => {
    if (open) drawerRef.current?.focus();
  }, [open]);

  const hasItems = items.length > 0;
  const headerTitle = hasItems
    ? `Request Quote (${items.length} item${items.length !== 1 ? "s" : ""})`
    : "Specify your equipment";
  const headerSub = hasItems
    ? "We'll configure pricing for your selection."
    : "Tell us your application — we'll identify the right instrument.";

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 z-[35] transition-opacity duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={headerTitle}
        tabIndex={-1}
        className="fixed right-0 top-0 bottom-0 z-[40] flex flex-col outline-none"
        style={{
          width: "min(480px, 100vw)",
          backgroundColor: "var(--color-black-warm)",
          borderLeft: "1px solid var(--color-border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div>
            <p className="font-display font-bold text-white text-lg leading-tight">
              {headerTitle}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
              {headerSub}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-xl transition-colors cursor-pointer"
            style={{ color: "var(--color-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items summary */}
        {hasItems && (
          <div
            className="border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="max-h-[200px] overflow-y-auto px-6 py-3 space-y-2">
              {items.map((item) => (
                <div
                  key={item.code}
                  className="flex items-center gap-3 py-2"
                >
                  <ShoppingBag
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--color-orange)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {item.name}{item.sizeLabel ? ` · ${item.sizeLabel}` : ""}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                      {item.brand ? `${item.brand} · ` : ""}{formatPrice(item.priceIncl)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.code)}
                    aria-label={`Remove ${item.name}`}
                    className="p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                    style={{ color: "var(--color-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {items.length > 1 && (
              <div className="px-6 pb-3">
                <button
                  onClick={clearCart}
                  className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
                  style={{ color: "var(--color-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Agent thread */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          {open && (
            <AgentThread
              cartItems={items}
              initContext={initContext}
            />
          )}
        </div>
      </div>
    </>
  );
}
