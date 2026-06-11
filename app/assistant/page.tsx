import type { Metadata } from "next";
import AssistantRedirect from "./AssistantRedirect";

export const metadata: Metadata = {
  title: "Assistant",
  description:
    "Chat with the Labex assistant — get product guidance and request a quote in minutes.",
  robots: { index: false, follow: false },
};

// The assistant is no longer a standalone page — it lives in a single persistent
// panel mounted once in the root layout (so the cross-origin chat is never wiped
// by navigation). This route is kept only as a shim for old/bookmarked links:
// it opens that one panel (expanded), optionally carrying a ?q= seed, then sends
// the user home. No second iframe is ever created.
interface AssistantPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AssistantPage({ searchParams }: AssistantPageProps) {
  const { q } = await searchParams;
  const seed = typeof q === "string" && q.trim() ? q.trim().slice(0, 500) : undefined;
  return <AssistantRedirect seed={seed} />;
}
