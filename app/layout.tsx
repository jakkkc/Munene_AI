import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Munene AI — Simamia Biashara Yako Kwa Akili",
  description:
    "The AI business advisor in your WhatsApp. Built for Kenyan small business owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sw">
      <body>{children}</body>
    </html>
  );
}
