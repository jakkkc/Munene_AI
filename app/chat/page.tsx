"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Habari! Mimi ni Munene AI, msaidizi wako wa biashara. Niambie mauzo yako ya leo na nitakusaidia kufuatilia faida yako. Mfano: Leo niliuza unga 5 @ 200, sukari 3 @ 150",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply || "Samahani, jaribu tena." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Hitilafu imetokea. Jaribu tena." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link href="/" style={styles.backBtn}>
          ← Rudi
        </Link>
        <div style={styles.headerInfo}>
          <div style={styles.avatar}>M</div>
          <div>
            <div style={styles.headerName}>Munene AI</div>
            <div style={styles.headerStatus}>Msaidizi wa Biashara</div>
          </div>
        </div>
      </div>

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.role === "user" ? "#25D366" : "#fff",
                color: msg.role === "user" ? "#fff" : "#111",
                borderRadius:
                  msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
            <div style={{ ...styles.bubble, backgroundColor: "#fff", color: "#888" }}>
              Munene AI inaandika...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          type="text"
          placeholder="Andika mauzo yako hapa..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: loading || !input.trim() ? 0.6 : 1,
          }}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#ECE5DD",
    fontFamily: "sans-serif",
    maxWidth: "640px",
    margin: "0 auto",
  },
  header: {
    backgroundColor: "#075E54",
    color: "#fff",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  backBtn: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    marginRight: "4px",
  },
  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#25D366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "18px",
  },
  headerName: {
    fontWeight: "bold",
    fontSize: "16px",
  },
  headerStatus: {
    fontSize: "12px",
    opacity: 0.8,
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  bubble: {
    maxWidth: "75%",
    padding: "10px 14px",
    fontSize: "15px",
    lineHeight: "1.5",
    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
  },
  inputArea: {
    display: "flex",
    padding: "10px 12px",
    backgroundColor: "#F0F0F0",
    gap: "8px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: "none",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fff",
  },
  sendBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#25D366",
    color: "#fff",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};