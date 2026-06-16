"use client";

import { FormEvent, useState } from "react";

type MessageType = "success" | "error" | null;

export default function WaitlistForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const whatsapp = (form.elements.namedItem("whatsapp") as HTMLInputElement).value.trim();

    if (!name || !whatsapp) {
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setMessage("Hitilafu imetokea. Jaribu tena.");
      setMessageType("error");
      return;
    }

    setMessage("");
    setMessageType(null);
    setLoading(true);

    try {
      const response = await fetch(supabaseUrl, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ name, whatsapp }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setMessage("Asante! Tutakuwasiliana nawe hivi karibuni 🎉");
      setMessageType("success");
      form.reset();
    } catch {
      setMessage("Hitilafu imetokea. Jaribu tena.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  const messageClass =
    messageType === "success"
      ? "form-message form-message--success"
      : messageType === "error"
        ? "form-message form-message--error"
        : "form-message";

  return (
    <form id="waitlist-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">Jina Lako</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Mfano: Jane Wanjiku"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="whatsapp">Nambari ya WhatsApp</label>
        <input
          type="tel"
          id="whatsapp"
          name="whatsapp"
          placeholder="Mfano: 0712 345 678"
          required
        />
      </div>
      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? "Inasubiri..." : "Jiunge Sasa"}
      </button>
      {message && (
        <div className={messageClass} role="alert">
          {message}
        </div>
      )}
    </form>
  );
}
