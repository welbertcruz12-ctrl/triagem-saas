import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TriagemAI - Triagem Inteligente de Currículos",
  description:
    "Automatize a triagem de currículos com Inteligência Artificial. Receba pelo WhatsApp ou Email e responda automaticamente.",
  keywords: [
    "triagem currículos",
    "RH",
    "recrutamento",
    "inteligência artificial",
    "automação",
    "whatsapp",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
