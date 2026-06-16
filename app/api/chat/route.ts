import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Munene AI, a business advisor for Kenyan small business owners. Users will send you their daily sales in Swahili or English. Extract the sales data, calculate total revenue, and give them a short friendly summary with one piece of business advice. Always respond in the same language the user wrote in. Be encouraging and practical. Keep responses under 100 words.`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = body?.message;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid message" },
        { status: 400 }
      );
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message.trim() },
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error("Groq error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 502 }
      );
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}