import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1/waitlist', '');
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supabaseFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_KEY!,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });
  return response.json();
}

async function getOrCreateUser(phone: string) {
  // Check if user exists
  const users = await supabaseFetch(`users?phone=eq.${phone}&limit=1`);
  if (users.length > 0) return users[0];

  // Create new user
  const newUsers = await supabaseFetch("users", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
  return newUsers[0];
}

async function saveSale(phone: string, message: string, summary: string, revenue: number) {
  await supabaseFetch("sales", {
    method: "POST",
    body: JSON.stringify({
      phone,
      raw_message: message,
      ai_summary: summary,
      total_revenue: revenue,
    }),
  });
}

async function getSalesHistory(phone: string) {
  const sales = await supabaseFetch(
    `sales?phone=eq.${phone}&order=created_at.desc&limit=30`
  );
  return sales;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const body = await request.json();
    const message = body?.message;
    const phone = body?.phone || "web-user";

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Missing or invalid message" }, { status: 400 });
    }

    // Get user and sales history
    await getOrCreateUser(phone);
    const salesHistory = await getSalesHistory(phone);

    // Build history context
    const historyContext = salesHistory.length > 0
      ? `Here is this user's sales history (most recent first):
${salesHistory.map((s: {created_at: string, raw_message: string, total_revenue: number}) => 
  `- ${new Date(s.created_at).toLocaleDateString('en-KE')}: ${s.raw_message} (Revenue: KSh ${s.total_revenue})`
).join('\n')}`
      : "This is a new user with no sales history yet.";

    const systemPrompt = `You are Munene AI, a smart business advisor for Kenyan small business owners (duka owners, kiosk owners, traders).

${historyContext}

Your job:
1. If the user is reporting sales, extract each item, quantity and price, calculate total revenue, save it mentally and confirm with a summary
2. If the user is asking a question, answer based on their actual sales history above
3. Give specific, data-driven advice based on their real numbers
4. Compare this week vs last week when you have enough data
5. Identify their best and worst performing products
6. Always respond in the same language the user wrote in (Swahili or English)
7. Be encouraging, practical and specific — never give generic advice
8. Keep responses under 150 words
9. End every sales report response with one specific actionable tip based on their data

Format sales summaries clearly with:
- Each item sold
- Total revenue for the day
- Comparison to previous days if available
- One specific tip`;

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
            { role: "system", content: systemPrompt },
            { role: "user", content: message.trim() },
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      return NextResponse.json({ error: "Failed to get AI response" }, { status: 502 });
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json({ error: "No response from AI" }, { status: 502 });
    }

    // Extract revenue from message and save to database
    const revenueMatch = reply.match(/KSh\s*([\d,]+)/);
    const revenue = revenueMatch
      ? parseFloat(revenueMatch[1].replace(",", ""))
      : 0;

    // Only save if message looks like a sales report
    const isSalesReport = /niliuza|niliweka|sold|unga|sukari|mafuta|bidhaa|\d+\s*@\s*\d+/i.test(message);
    if (isSalesReport) {
      await saveSale(phone, message, reply, revenue);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}