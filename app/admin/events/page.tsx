import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth";
import { getAllEvents } from "@/lib/data";

export default async function AdminEventsPage() {
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
          <h1 className="text-3xl font-bold text-slate-900">Gestione eventi</h1>
          <p className="mt-2 text-slate-600">Crea, modifica e controlla lo stato dei tuoi eventi.</p>
        </div>
        <Link href="/admin/events/new" className="rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">Crea evento</Link>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Titolo</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Stato</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Registrazioni</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-4 py-3 text-slate-900">{event.title}</td>
                <td className="px-4 py-3 text-slate-600">{event.status.toLowerCase()}</td>
                <td className="px-4 py-3 text-slate-600">{event.registrationsOpen ? "aperte" : "chiuse"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/events/${event.id}`} className="font-semibold text-brand-600">Apri</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
