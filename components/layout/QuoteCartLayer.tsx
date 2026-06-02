"use client";

import { useQuoteCart } from "@/lib/quote-cart-store";
import QuoteDrawer from "@/components/ui/QuoteDrawer";

export default function QuoteCartLayer() {
  const { isDrawerOpen, closeDrawer } = useQuoteCart();
  return <QuoteDrawer open={isDrawerOpen} onClose={closeDrawer} />;
}
