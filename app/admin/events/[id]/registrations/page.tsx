import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth";
import { getEventRegistrations } from "@/lib/data";

export default async function AdminEventRegistrationsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email || !isAdminEmail(email)) {
    redirect("/login");
  }

  const registrations = await getEventRegistrations(params.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Iscritti evento</h1>
        <p className="mt-2 text-slate-600">Panoramica delle registrazioni e delle risposte raccolte.</p>
      </div>
      <div className="space-y-4">
        {registrations.map((registration) => (
          <div key={registration.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{registration.user.name || registration.user.email}</h2>
                <p className="text-sm text-slate-500">{registration.user.email}</p>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">{registration.status}</div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {registration.answers.map((answer) => (
                <div key={answer.id}>
                  <span className="font-semibold text-slate-800">{answer.question.label}: </span>
                  <span>{JSON.stringify(answer.valueJson)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
