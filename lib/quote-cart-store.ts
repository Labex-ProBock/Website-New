"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  code: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  priceIncl: number | null;
  tier: string;
  sizeLabel?: string;
}

export interface DrawerInitContext {
  trigger: "quote-cart" | "product-detail" | "category-browse";
  productNames?: string[];
  categoryName?: string;
}

interface QuoteCartState {
  // Persisted
  items: CartItem[];

  // Ephemeral (not persisted)
  isDrawerOpen: boolean;
  initContext: DrawerInitContext | null;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (code: string) => void;
  clearCart: () => void;
  hasItem: (code: string) => boolean;
  openDrawer: (ctx?: DrawerInitContext) => void;
  closeDrawer: () => void;
}

export const useQuoteCart = create<QuoteCartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      initContext: null,

      addItem: (item) =>
        set((s) => ({
          items: s.items.some((i) => i.code === item.code)
            ? s.items
            : [...s.items, item],
        })),

      removeItem: (code) =>
        set((s) => ({ items: s.items.filter((i) => i.code !== code) })),

      clearCart: () => set({ items: [] }),

      hasItem: (code) => get().items.some((i) => i.code === code),

      openDrawer: (ctx) =>
        set({
          isDrawerOpen: true,
          initContext: ctx ?? null,
        }),

      closeDrawer: () => set({ isDrawerOpen: false, initContext: null }),
    }),
    {
      name: "labex:quote-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
