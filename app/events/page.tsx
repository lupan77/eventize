import Link from "next/link";
import { getPublishedEvents } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Eventi</h1>
        <p className="mt-2 text-slate-600">Elenco completo degli eventi community attualmente pubblicati.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-brand-700">{formatDateTime(event.startsAt)}</div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{event.title}</h2>
            <p className="mt-3 text-slate-600">{event.summary}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <span>{event.locationName || "Da definire"}</span>
              <Link href={`/events/${event.slug}`} className="font-semibold text-brand-600">Apri evento</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
