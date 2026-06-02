"use client";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace", backgroundColor: "#0a0a0a", color: "white", minHeight: "100vh" }}>
      <h1 style={{ color: "#FF6A1A", marginBottom: "1rem" }}>Client Error (paste this to Claude)</h1>
      <pre style={{ background: "#1a1a1a", padding: "1rem", borderRadius: "8px", overflowX: "auto", color: "#ff4444", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {error?.message}
        {"\n\n"}
        {error?.stack}
      </pre>
      <p style={{ color: "#888", marginTop: "1rem" }}>Digest: {error?.digest}</p>
    </div>
  );
}
