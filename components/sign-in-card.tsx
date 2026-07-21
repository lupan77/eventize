"use client";

import { signIn } from "next-auth/react";

const providers = [
  { id: "google", label: "Continua con Google" },
  { id: "github", label: "Continua con GitHub" },
  { id: "microsoft-entra-id", label: "Continua con Microsoft" }
];

export function SignInCard() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-3xl font-bold text-slate-900">Accedi a Eventize</h1>
      <p className="mt-3 text-slate-600">
        Usa uno dei provider configurati per iscriverti agli eventi della community e gestire le tue registrazioni.
      </p>
      <div className="mt-8 space-y-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => signIn(provider.id, { callbackUrl: "/my/registrations" })}
            className="flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            {provider.label}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-slate-500">Se un pulsante non funziona, verifica che il provider OAuth sia configurato nelle variabili ambiente.</p>
    </div>
  );
}
