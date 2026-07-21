import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";
import { RegistrationForm } from "@/components/registration-form";

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">Evento gratuito</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">{event.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{event.summary}</p>
          <dl className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900">Data e ora</dt>
              <dd>{formatDateTime(event.startsAt)}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">Luogo</dt>
              <dd>{event.locationName || event.onlineUrl || "Da definire"}</dd>
            </div>
          </dl>
          <div className="prose mt-6 max-w-none text-slate-700">
            <p>{event.description}</p>
          </div>
        </div>
      </div>
      <div>
        <RegistrationForm event={event} />
      </div>
    </div>
  );
}
