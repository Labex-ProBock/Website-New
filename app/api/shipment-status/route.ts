import { NextRequest, NextResponse } from "next/server";

// TODO: Query Sage Online API for real order status
// Add SAGE_API_KEY + SAGE_BASE_URL to .env
// Map Sage order statuses to user-friendly labels

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref") ?? "";

  // Stub responses
  let status: "in_transit" | "delivered" | "not_found" = "not_found";
  let message = "Order reference not found. Please check the number or contact sales@labex.co.za";

  if (ref.toUpperCase().startsWith("LBX")) {
    status = "in_transit";
    message = "Your order is on its way. Expected delivery: 2-3 business days.";
  } else if (ref.toUpperCase().startsWith("DEL")) {
    status = "delivered";
    message = "Order delivered successfully.";
  }

  return NextResponse.json({ ref, status, message, timestamp: new Date().toISOString() });
}
