import { NextRequest, NextResponse } from "next/server";

// TODO:
// 1. Create deal in BlueWave CRM (BLUEWAVE_API_KEY)
// 2. Send notification email to sales@labex.co.za
// 3. Send confirmation email to customer
// Email copy template:
//   Subject: "Your Labex quote request has been received"
//   Body: "Hi [name], thank you for your enquiry. A member of our team will respond within 1 business day..."

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("[Quote request]", {
    timestamp: new Date().toISOString(),
    referenceId: `LBX-${Date.now()}`,
    ...body,
  });

  return NextResponse.json({
    success: true,
    referenceId: `LBX-${Date.now()}`,
    message: "Quote request received",
  });
}
