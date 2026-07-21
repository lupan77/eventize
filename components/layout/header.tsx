"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">Eventize</Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/events">Eventi</Link>
          <Link href="/my/registrations">Le mie iscrizioni</Link>
          <Link href="/admin">Admin</Link>
          {session?.user ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50">
              Esci
            </button>
          ) : (
            <Link href="/login" className="rounded-lg bg-brand-600 px-3 py-2 text-white hover:bg-brand-700">Accedi</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
