import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth";
import { getAllEvents } from "@/lib/data";

export default async function AdminDashboardPage() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email || !isAdminEmail(email)) {
    redirect("/login");
  }

  const events = await getAllEvents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard admin</h1>
          <p className="mt-2 text-slate-600">Gestisci eventi, domande e registrazioni della community.</p>
        </div>
        <Link href="/admin/events/new" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Nuovo evento</Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Eventi totali</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{events.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Pubblicati</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{events.filter((event) => event.status === "PUBLISHED").length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Registrazioni aperte</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{events.filter((event) => event.registrationsOpen).length}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-semibold text-slate-900">Eventi recenti</h2>
        <div className="mt-4 space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
              <div>
                <p className="font-semibold text-slate-900">{event.title}</p>
                <p className="text-sm text-slate-500">{event.status.toLowerCase()} · {event.slug}</p>
              </div>
              <Link href={`/admin/events/${event.id}`} className="text-sm font-semibold text-brand-600">Modifica</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
