import { NextRequest, NextResponse } from "next/server";

// TODO: Add subscriber to email marketing provider
// Options: Mailchimp (MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID) or
//          Brevo / Sendinblue (BREVO_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
  }

  console.log("[Newsletter subscribe]", { email, timestamp: new Date().toISOString() });

  return NextResponse.json({ success: true, message: "Subscribed" });
}
