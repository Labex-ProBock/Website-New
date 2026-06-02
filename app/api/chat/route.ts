import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with Anthropic API call — model: claude-sonnet-4-20250514
// Install @anthropic-ai/sdk, add ANTHROPIC_API_KEY to .env
// Wire to a system prompt trained on Labex product catalogue and FAQ

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Stubbed response logic
  let reply = "Thanks for your message. For detailed assistance, our team is available at sales@labex.co.za or (011) 728 1338.";

  if (/quote|pricing|price|cost/i.test(message)) {
    reply = "I'd be happy to help with a quote. Please visit /quote or share your requirements and I'll make sure the team follows up.";
  } else if (/order|shipment|delivery|track/i.test(message)) {
    reply = "For order tracking, please use our shipment status checker or email sales@labex.co.za with your order reference.";
  } else if (/brand|product|equipment|instrument/i.test(message)) {
    reply = "We distribute Heidolph, Sartorius, IKA, Cole-Parmer, DWK Life Sciences, Thermo Scientific, 3M, LLG Labware, BRAND, and Isotherm — plus many more. Which application are you working on?";
  }

  return NextResponse.json({ reply, timestamp: new Date().toISOString() });
}
