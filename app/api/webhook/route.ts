import { NextRequest, NextResponse } from "next/server";

// Meta webhook verification
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

// Receive incoming WhatsApp messages
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("Incoming WhatsApp message:", JSON.stringify(body, null, 2));
  return NextResponse.json({ status: "ok" });
}