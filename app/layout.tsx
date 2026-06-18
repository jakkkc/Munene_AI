import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Munene AI — Simamia Biashara Yako Kwa Akili",
  description: "The AI business advisor in your WhatsApp. Built for Kenyan small business owners.",
  applicationName: "Munene AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>{children}</body>
    </html>
  );
}