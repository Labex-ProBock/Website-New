export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AgentResponse {
  message: string;
  done: boolean;
}

export async function sendAgentMessage(
  messages: AgentMessage[],
  options?: { context?: string; signal?: AbortSignal }
): Promise<AgentResponse> {
  const res = await fetch("/api/quote-from-agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, context: options?.context }),
    signal: options?.signal,
  });

  if (!res.ok) {
    throw new Error(`Agent error: ${res.status}`);
  }

  return res.json();
}
