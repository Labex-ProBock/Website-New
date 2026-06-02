import { NextRequest, NextResponse } from "next/server";

// TODO: POST lead to BlueWave CRM
// BlueWave API docs needed — add BLUEWAVE_API_KEY + BLUEWAVE_BASE_URL to .env
// Also send confirmation email via /api/send-email (to be built)

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Log to console in development
  console.log("[Lead capture]", {
    timestamp: new Date().toISOString(),
    ...body,
  });

  return NextResponse.json({ success: true, message: "Lead received" });
}
