import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Eventize",
  description: "Portale per iscrizioni a eventi community gratuiti"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <SessionProvider>
          <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
