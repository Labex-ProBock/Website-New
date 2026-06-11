"use client";

import { create } from "zustand";

// The assistant is hosted externally by ProBokTech (n8n backend handles email +
// CRM lead creation). The ?client=labex param is ESSENTIAL — it loads Labex
// branding and lead routing. Never drop it. The website only embeds the agent.
const ASSISTANT_BASE = "https://agent-1-website.vercel.app/?client=labex";

// The chat lives inside the agent's cross-origin iframe — we CANNOT read or
// inject into it. A seed only takes effect via ?q= at load time, so we may seed
// only the FIRST load (or on an explicit New Chat / "new quote" reload).
function buildSrc(seed: string | null): string {
  const s = (seed ?? "").trim().slice(0, 500);
  return s ? `${ASSISTANT_BASE}&q=${encodeURIComponent(s)}` : ASSISTANT_BASE;
}

interface OpenOptions {
  /** Raw (un-encoded) opening message to seed the chat with. */
  seed?: string;
  /** Human label for the product/topic, shown in the "new quote" header action. */
  label?: string;
  /** Open straight into full-screen (used by the /assistant redirect route). */
  expand?: boolean;
}

interface AssistantStore {
  /** Panel visibility. Closing only HIDES — the iframe never unmounts. */
  isOpen: boolean;
  /** Drawer (false) vs full-screen overlay (true) — same iframe, resized. */
  isExpanded: boolean;
  /**
   * The single iframe src. `null` until the very first open, then NEVER null
   * again so the iframe element stays mounted for the whole session. Only
   * changes on first load, New Chat, or an accepted "new quote" — never on
   * close, navigation, or reopen.
   */
  src: string | null;
  /**
   * Bumped ONLY by New Chat and an accepted "new quote" — used as the iframe's
   * React key so those are the only actions that remount (reset) it, and so a
   * reset fires even when the new src string is identical to the old one. Never
   * changed by open/close/expand/navigation.
   */
  reloadNonce: number;
  /** Seed backing the currently-loaded conversation (for de-duping triggers). */
  currentSeed: string | null;
  /** A newer seed offered while a chat is already live — applied only on click. */
  pendingSeed: string | null;
  pendingLabel: string | null;

  open: (opts?: OpenOptions) => void;
  close: () => void;
  toggleExpand: () => void;
  newChat: () => void;
  applyPending: () => void;
  dismissPending: () => void;
}

export const useAssistant = create<AssistantStore>((set, get) => ({
  isOpen: false,
  isExpanded: false,
  src: null,
  reloadNonce: 0,
  currentSeed: null,
  pendingSeed: null,
  pendingLabel: null,

  open: ({ seed, label, expand } = {}) => {
    const state = get();
    const cleanSeed = seed && seed.trim() ? seed.trim() : null;

    // First ever open — this is the ONLY automatic place a seed reaches the
    // iframe. Load it seeded (or plain) and remember it.
    if (state.src === null) {
      set({
        isOpen: true,
        isExpanded: expand ?? state.isExpanded,
        src: buildSrc(cleanSeed),
        currentSeed: cleanSeed,
        pendingSeed: null,
        pendingLabel: null,
      });
      return;
    }

    // Iframe already loaded — NEVER reload here (would wipe the conversation).
    // Just reveal it. If a different seed was requested, surface it as a header
    // action the user can choose to apply.
    const offerPending = cleanSeed !== null && cleanSeed !== state.currentSeed;
    set({
      isOpen: true,
      isExpanded: expand ?? state.isExpanded,
      ...(offerPending ? { pendingSeed: cleanSeed, pendingLabel: label ?? null } : {}),
    });
  },

  // Hide only — no unmount, no reload. Reopening shows the same conversation.
  close: () => set({ isOpen: false }),

  toggleExpand: () => set((s) => ({ isExpanded: !s.isExpanded })),

  // Explicit reset — reload the iframe fresh (no seed). Nonce bump forces the
  // remount even though the src may be identical to the current one.
  newChat: () =>
    set((s) => ({
      src: buildSrc(null),
      reloadNonce: s.reloadNonce + 1,
      currentSeed: null,
      pendingSeed: null,
      pendingLabel: null,
    })),

  // User chose to swap to the newly-offered seed — intentional reload.
  applyPending: () => {
    const { pendingSeed, reloadNonce } = get();
    set({
      src: buildSrc(pendingSeed),
      reloadNonce: reloadNonce + 1,
      currentSeed: pendingSeed,
      pendingSeed: null,
      pendingLabel: null,
    });
  },

  dismissPending: () => set({ pendingSeed: null, pendingLabel: null }),
}));
