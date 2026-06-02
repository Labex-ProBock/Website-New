"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { sendAgentMessage, type AgentMessage } from "@/lib/agent-client";
import type { CartItem, DrawerInitContext } from "@/lib/quote-cart-store";

interface AgentThreadProps {
  cartItems?: CartItem[];
  initContext?: DrawerInitContext | null;
}

function buildOpener(cartItems: CartItem[], initContext: DrawerInitContext | null): string {
  if (initContext?.trigger === "product-detail" && initContext.productNames?.length) {
    const name = initContext.productNames[0];
    return `Hi! I see you're looking at the ${name}. What application or experiment is this for?`;
  }

  if (initContext?.trigger === "category-browse" && initContext.categoryName) {
    return `Hi! Browsing ${initContext.categoryName}? Tell me what you're trying to measure or process and I'll point you to the right equipment.`;
  }

  if (cartItems.length > 0) {
    const names = cartItems.map((i) => i.name).slice(0, 3).join(", ");
    const more = cartItems.length > 3 ? ` and ${cartItems.length - 3} more` : "";
    return `Hi! I can see you're interested in ${names}${more}. Tell me about your application and I'll help with configuration and pricing.`;
  }

  return "Hi! Tell me about your application — what are you trying to measure or process?";
}

function buildApiContext(cartItems: CartItem[]): string | undefined {
  if (!cartItems.length) return undefined;
  const lines = cartItems.map((i) => {
    const price = i.priceIncl ? `R ${i.priceIncl.toLocaleString("en-ZA")}` : "price on request";
    return `- ${i.name} (${i.brand ?? "unbranded"}, ${price}, code: ${i.code})`;
  });
  return `The customer is interested in the following products:\n${lines.join("\n")}`;
}

export default function AgentThread({ cartItems = [], initContext = null }: AgentThreadProps) {
  const opener = useMemo(
    () => buildOpener(cartItems, initContext),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const apiContext = useMemo(
    () => buildApiContext(cartItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [messages, setMessages] = useState<AgentMessage[]>([
    { role: "assistant", content: opener },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || done) return;

    const userMsg: AgentMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await sendAgentMessage(
        next.filter((m) => m.role !== "assistant" || m.content !== opener),
        { context: apiContext }
      );
      setMessages([...next, { role: "assistant", content: res.message }]);
      if (res.done) setDone(true);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Something went wrong — please try again or call (011) 728 1338.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user" ? "text-white rounded-br-sm" : "rounded-bl-sm"
              }`}
              style={{
                backgroundColor:
                  m.role === "user"
                    ? "var(--color-orange)"
                    : "var(--color-surface-2)",
                color: m.role === "user" ? "#fff" : "var(--color-white)",
                border:
                  m.role === "assistant"
                    ? "1px solid var(--color-border)"
                    : "none",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1"
              style={{
                backgroundColor: "var(--color-surface-2)",
                border: "1px solid var(--color-border)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: "var(--color-muted)",
                    animation: "bounce 0.8s ease-in-out infinite",
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!done ? (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 pt-4 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your application…"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-colors"
            style={{
              backgroundColor: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              color: "var(--color-white)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--color-orange)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-40 cursor-pointer"
            style={{ backgroundColor: "var(--color-orange)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-orange-deep)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-orange)";
            }}
          >
            Send
          </button>
        </form>
      ) : (
        <div
          className="pt-4 border-t text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Your requirements have been captured.{" "}
            <a
              href="mailto:sales@labex.co.za"
              className="underline"
              style={{ color: "var(--color-orange)" }}
            >
              Email sales@labex.co.za
            </a>{" "}
            or call{" "}
            <a
              href="tel:0117281338"
              className="underline"
              style={{ color: "var(--color-orange)" }}
            >
              (011) 728 1338
            </a>{" "}
            for a full proposal.
          </p>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
