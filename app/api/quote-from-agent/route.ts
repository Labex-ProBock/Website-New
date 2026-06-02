import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Labex's equipment specification assistant. Labex is a South African lab equipment distributor established in 1979, specialising in analytical instruments, liquid handling, temperature control, mixing, and more from brands like Sartorius, Heidolph, IKA, BRAND, Eppendorf, and Waters.

Your job is to help customers specify the right equipment for their application. Ask short, focused questions one at a time:
1. What is the application or experiment?
2. What sample volumes or throughputs are needed?
3. Any specific accuracy, speed, or environmental requirements?
4. What is the budget range (entry, mid, or premium)?

After 3–4 questions, summarise the requirements and recommend 1–2 specific products from Labex's catalogue. Keep responses brief and conversational.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          message:
            "Thank you for your enquiry. Our team will review your requirements and get back to you within 24 hours. To speak to someone now, call (011) 728 1338.",
          done: true,
        },
        { status: 200 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: context
          ? `${SYSTEM_PROMPT}\n\nCustomer context: ${context}`
          : SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "I couldn't process that. Please try again.";
    const done =
      text.toLowerCase().includes("recommend") ||
      text.toLowerCase().includes("proposal") ||
      messages.length >= 8;

    return NextResponse.json({ message: text, done });
  } catch {
    return NextResponse.json(
      {
        message:
          "Something went wrong. Please call us directly at (011) 728 1338 or email sales@labex.co.za.",
        done: true,
      },
      { status: 200 }
    );
  }
}
