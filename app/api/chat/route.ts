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
  const users = await supabaseFetch(`users?phone=eq.${phone}&limit=1`);
  if (users.length > 0) return users[0];
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

    await getOrCreateUser(phone);
    const salesHistory = await getSalesHistory(phone);

    const historyContext = salesHistory.length > 0
      ? `Hii ni historia ya mauzo ya mtumiaji huyu (kutoka ya hivi karibuni):
${salesHistory.map((s: { created_at: string; raw_message: string; total_revenue: number }) =>
  `- ${new Date(s.created_at).toLocaleDateString('en-KE')}: ${s.raw_message} (Mapato: KSh ${s.total_revenue})`
).join('\n')}`
      : "Mtumiaji mpya — bado hana historia ya mauzo.";

    const systemPrompt = `Wewe ni Munene AI, mshauri wa biashara wa akili kwa wafanyabiashara wadogo wa Kenya (wamiliki wa duka, kioski, na wauza bidhaa).

${historyContext}

SHERIA ZAKO:

1. RIPOTI YA MAUZO: Mtumiaji anapotuma mauzo yake, fanya hivi:
   - Orodhesha kila bidhaa, idadi na bei
   - Hesabu jumla ya mapato
   - Linganisha na siku zilizopita kutoka historia iliyo juu
   - Uliza bei ya ununuzi (cost price) ikiwa haujui ili kuhesabu faida halisi
   - Mpe tip moja maalum kulingana na data yake halisi

2. FAIDA HALISI: Faida = Bei ya kuuza - Bei ya kununua. Jaribu kupata bei za ununuzi. Ukizipata, hesabu na onyesha faida kwa kila bidhaa.

3. MASWALI: Mtumiaji akiuliza swali, jibu kutumia DATA yake halisi kutoka historia. Toa nambari maalum, si maoni ya jumla.

4. BIDHAA BORA/MBAYA: Tambua bidhaa zinazoleta mapato zaidi na ushauri mtumiaji kuzingatia zaidi.

5. LUGHA: Jibu kwa lugha ile ile aliyoandika — Kiswahili, Kiingereza, au mchanganyiko kama Wakenya wanavyozungumza kawaida.

6. USHAURI MAALUM: Kamwe usitoe ushauri wa jumla. Rejelea nambari zake halisi kila wakati.

7. UREFU: Jibu kwa maneno chini ya 150. Kuwa wazi na wa moja kwa moja.

8. MTINDO: Rafiki, wa kuhamasisha, kama rafiki mwerevu anayeelewa biashara ya Kenya.

MFANO WA JIBU ZURI kwa ripoti ya mauzo:
"Leo umefanya vizuri! 💪
- Unga 5kg × KSh 200 = KSh 1,000
- Sukari 3kg × KSh 150 = KSh 450
- Mafuta 2L × KSh 300 = KSh 600
━━━━━━━━━━━━
Jumla ya leo: KSh 2,050

Ikilinganishwa na jana (KSh 1,350), umepanda KSh 700 — hongera! 🎉

Unga ndiyo bidhaa yako bora. Unainunua kwa bei gani? Nijulishe tuhesabu faida yako halisi."`;

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

    const revenueMatch = reply.match(/KSh\s*([\d,]+)/);
    const revenue = revenueMatch
      ? parseFloat(revenueMatch[1].replace(",", ""))
      : 0;

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