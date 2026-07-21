interface AdminEvent {
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  locationName?: string | null;
  locationAddress?: string | null;
  onlineUrl?: string | null;
  registrationsOpen?: boolean;
  status?: string;
}

export function EventEditorCard({ mode, event }: { mode: "create" | "edit"; event?: AdminEvent }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-2xl font-bold text-slate-900">{mode === "create" ? "Crea un nuovo evento" : "Modifica evento"}</h2>
      <p className="mt-2 text-sm text-slate-600">
        MVP UI pronta per essere collegata alle server actions CRUD. Al momento serve come base visiva e documentata.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input defaultValue={event?.title} placeholder="Titolo evento" className="rounded-xl border border-slate-300 px-4 py-3" />
        <input defaultValue={event?.slug} placeholder="slug-evento" className="rounded-xl border border-slate-300 px-4 py-3" />
        <input defaultValue={event?.summary} placeholder="Riassunto breve" className="rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" />
        <textarea defaultValue={event?.description} placeholder="Descrizione completa" className="min-h-40 rounded-xl border border-slate-300 px-4 py-3 md:col-span-2" />
        <input defaultValue={event?.locationName || ""} placeholder="Luogo" className="rounded-xl border border-slate-300 px-4 py-3" />
        <input defaultValue={event?.onlineUrl || ""} placeholder="URL online (opzionale)" className="rounded-xl border border-slate-300 px-4 py-3" />
      </div>
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Nota MVP: il salvataggio admin completo lato server va esteso nel passo successivo, ma la struttura dati e le pagine sono già predisposte.
      </div>
    </div>
  );
}
