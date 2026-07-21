import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserRegistrations } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function MyRegistrationsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const registrations = await getUserRegistrations(session.user.email);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Le mie iscrizioni</h1>
        <p className="mt-2 text-slate-600">Panoramica dei tuoi eventi registrati.</p>
      </div>
      <div className="space-y-4">
        {registrations.map((registration) => (
          <div key={registration.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-medium text-brand-700">{formatDateTime(registration.event.startsAt)}</div>
            <h2 className="mt-2 text-xl font-semibold">{registration.event.title}</h2>
            <p className="mt-1 text-sm text-slate-600">Stato registrazione: {registration.status.toLowerCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
