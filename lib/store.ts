"use client";

import { create } from "zustand";

interface LabexStore {
  /* Preloader */
  isLoaded: boolean;
  setLoaded: (v: boolean) => void;

  /* Menu */
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  toggleMenu: () => void;

  /* Cursor */
  cursorVariant: "default" | "hover" | "drag" | "text";
  cursorLabel: string;
  setCursorVariant: (v: LabexStore["cursorVariant"]) => void;
  setCursorLabel: (v: string) => void;
}

export const useLabexStore = create<LabexStore>((set) => ({
  /* Preloader */
  isLoaded: false,
  setLoaded: (v) => set({ isLoaded: v }),

  /* Menu */
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  /* Cursor */
  cursorVariant: "default",
  cursorLabel: "",
  setCursorVariant: (v) => set({ cursorVariant: v }),
  setCursorLabel: (v) => set({ cursorLabel: v }),
}));
