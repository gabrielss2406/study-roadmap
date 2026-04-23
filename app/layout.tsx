// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Nav from "./Nav";

export const metadata: Metadata = {
  title: "Roadmap — Gabriel Siqueira",
  description: "Arquitetura de Software · 2025–2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
