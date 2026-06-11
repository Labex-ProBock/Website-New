"use client";

import { useEffect } from "react";
import { X, Maximize2, Minimize2, MessageSquarePlus, ArrowRight } from "lucide-react";
import { useAssistant } from "@/lib/assistant-store";

/**
 * The ONE persistent assistant surface for the whole site. Rendered once in the
 * root layout and never unmounted. The cross-origin chat only survives because
 * this iframe element stays mounted — closing the panel HIDES it (transform),
 * it is never removed or reloaded. The src changes only on first load, New Chat,
 * or an accepted "new quote" — see lib/assistant-store.ts.
 */
export default function AssistantPanel() {
  const {
    isOpen,
    isExpanded,
    src,
    reloadNonce,
    pendingLabel,
    pendingSeed,
    close,
    toggleExpand,
    newChat,
    applyPending,
    dismissPending,
  } = useAssistant();

  // Esc closes the panel (hide only).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const iconBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    backgroundColor: "transparent",
    border: "1px solid var(--color-border)",
    color: "var(--color-muted)",
    cursor: "pointer",
    transition: "color 160ms, border-color 160ms, background 160ms",
    flexShrink: 0,
  };
  const onIconEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = "white";
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
  };
  const onIconLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = "var(--color-muted)";
    e.currentTarget.style.borderColor = "var(--color-border)";
  };

  return (
    <>
      {/* Backdrop — visible only when open, click to close. */}
      <div
        aria-hidden
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
      />

      {/* Drawer — slides in from the right; grows to full-screen when expanded.
          Transform (not display:none) keeps the iframe mounted when hidden. */}
      <aside
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Labex assistant"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 61,
          width: isExpanded ? "100%" : "min(480px, 100vw)",
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0A0A0A",
          borderLeft: isExpanded ? "none" : "1px solid var(--color-border)",
          boxShadow: isOpen ? "-24px 0 70px -24px rgba(0,0,0,0.8)" : "none",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition:
            "transform 360ms cubic-bezier(0.16,1,0.3,1), width 300ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between shrink-0"
          style={{
            padding: "0.75rem 0.875rem 0.75rem 1.125rem",
            borderBottom: "1px solid var(--color-border)",
            gap: "0.5rem",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="font-display font-black tracking-tight text-white"
              style={{ fontSize: "1.05rem" }}
            >
              LABEX<span style={{ color: "var(--color-orange)" }}>.</span>
            </span>
            <span
              className="truncate"
              style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}
            >
              Assistant
            </span>
          </div>

          <div className="flex items-center" style={{ gap: "0.4rem" }}>
            <button
              type="button"
              onClick={newChat}
              aria-label="Start a new chat"
              title="New chat"
              style={iconBtn}
              onMouseEnter={onIconEnter}
              onMouseLeave={onIconLeave}
            >
              <MessageSquarePlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={toggleExpand}
              aria-label={isExpanded ? "Shrink to drawer" : "Expand to full screen"}
              title={isExpanded ? "Exit full screen" : "Full screen"}
              style={iconBtn}
              onMouseEnter={onIconEnter}
              onMouseLeave={onIconLeave}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={close}
              aria-label="Close assistant"
              title="Close"
              style={iconBtn}
              onMouseEnter={onIconEnter}
              onMouseLeave={onIconLeave}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* "New quote" offer — a different seed was requested while a chat is
            already live. Applying it intentionally reloads (wipes) the chat. */}
        {pendingSeed && (
          <div
            className="flex items-center justify-between shrink-0"
            style={{
              padding: "0.5rem 0.75rem 0.5rem 1.125rem",
              gap: "0.5rem",
              borderBottom: "1px solid var(--color-border)",
              backgroundColor: "rgba(255,106,26,0.06)",
            }}
          >
            <button
              type="button"
              onClick={applyPending}
              className="flex items-center gap-1.5 min-w-0 cursor-pointer"
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--color-orange)",
                background: "none",
                border: "none",
                padding: 0,
                textAlign: "left",
              }}
            >
              <span className="truncate">
                New quote for {pendingLabel ?? "this item"}
              </span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
            <button
              type="button"
              onClick={dismissPending}
              aria-label="Dismiss"
              className="cursor-pointer shrink-0"
              style={{
                color: "var(--color-muted)",
                background: "none",
                border: "none",
                padding: "0.15rem",
                display: "flex",
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* The single, persistent iframe. Rendered once src is set, then stays
            mounted for the whole session — closing the panel only hides it. */}
        {src !== null && (
          <iframe
            key={reloadNonce}
            src={src}
            title="Labex Assistant"
            allow="clipboard-write"
            style={{ flex: 1, width: "100%", border: "none", display: "block" }}
          />
        )}
      </aside>
    </>
  );
}
