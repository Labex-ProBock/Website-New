"use client";

import type { CSSProperties, ReactNode } from "react";
import { useAssistant } from "@/lib/assistant-store";

/**
 * Client button that opens the persistent AssistantPanel with an optional seed.
 * Lets server components (e.g. the product detail page) trigger the panel
 * without ever rendering a second iframe.
 */
export default function AssistantTriggerButton({
  seed,
  label,
  expand,
  className,
  style,
  children,
  "aria-label": ariaLabel,
}: {
  seed?: string;
  label?: string;
  expand?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const open = useAssistant((s) => s.open);
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-label={ariaLabel}
      onClick={() => open({ seed, label, expand })}
    >
      {children}
    </button>
  );
}
