import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === "muneneai123") {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message || message.type !== "text") {
      return NextResponse.json({ status: "ok" });
    }

    const userText = message.text.body;
    const userPhone = message.from; // This is their real WhatsApp number
    const phoneNumberId = change.value.metadata.phone_number_id;

    // Get AI response — pass phone number so AI knows who is talking
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const aiResponse = await fetch(`${appUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: userText,
        phone: userPhone  // Each user gets their own history
      }),
    });

    const aiData = await aiResponse.json();
    const reply = aiData.reply || "Samahani, jaribu tena. 🙏";

    // Send reply back on WhatsApp
    await fetch(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: userPhone,
          type: "text",
          text: { body: reply },
        }),
      }
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "ok" });
  }
}