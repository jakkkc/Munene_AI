import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userMessage = formData.get("Body") as string;
    const userPhone = formData.get("From") as string;

    if (!userMessage) {
      return new NextResponse("", { status: 200 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const aiResponse = await fetch(`${appUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        phone: userPhone,
      }),
    });

    const aiData = await aiResponse.json();
    const reply = aiData.reply || "Samahani, jaribu tena. 🙏";

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply}</Message>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Samahani, hitilafu imetokea. Jaribu tena. 🙏</Message>
</Response>`;
    return new NextResponse(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
}