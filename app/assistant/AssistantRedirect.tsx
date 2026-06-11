"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssistant } from "@/lib/assistant-store";

/**
 * The /assistant route is no longer a standalone surface — the assistant lives
 * in a single persistent panel mounted in the root layout. This shim exists only
 * for old/bookmarked links: it opens that one panel (expanded) and replaces the
 * URL with home, so a second iframe instance is never created.
 */
export default function AssistantRedirect({ seed }: { seed?: string }) {
  const router = useRouter();
  const open = useAssistant((s) => s.open);

  useEffect(() => {
    open({ seed, expand: true });
    router.replace("/");
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The expanded panel covers the viewport; keep the underlay dark to avoid a flash.
  return <div style={{ position: "fixed", inset: 0, backgroundColor: "#0A0A0A", zIndex: 59 }} />;
}
