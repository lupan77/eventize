import Link from "next/link";
import { getPublishedEvents } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function HomePage() {
  const events = await getPublishedEvents();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-brand-700 to-brand-500 p-8 text-white shadow-lg">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium">Community events gratuiti</span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Organizza iscrizioni chiare e moderne per la tua community.</h1>
          <p className="text-lg text-brand-50">
            Eventize ti aiuta a pubblicare eventi gratuiti, raccogliere registrazioni e mostrare collette PayPal contestuali in modo trasparente.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/events" className="rounded-xl bg-white px-5 py-3 font-semibold text-brand-700 shadow hover:bg-brand-50">Esplora eventi</Link>
            <Link href="/login" className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10">Accedi</Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Eventi pubblicati</h2>
            <p className="text-slate-600">Gli eventi restano sempre gratuiti; eventuali collette sono solo informative.</p>
          </div>
          <Link href="/events" className="text-sm font-medium">Vedi tutti</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
                {formatDateTime(event.startsAt)}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{event.summary}</p>
              <div className="mt-4 text-sm text-slate-500">{event.locationName || "Evento online o sede da definire"}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
