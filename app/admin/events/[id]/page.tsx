import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth";
import { getEventWithDetails } from "@/lib/data";
import { EventEditorCard } from "@/components/admin/event-editor-card";
import { QuestionManager } from "@/components/admin/question-manager";

export default async function AdminEventDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email || !isAdminEmail(email)) {
    redirect("/login");
  }

  const event = await getEventWithDetails(params.id);

  if (!event) {
    redirect("/admin/events");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
          <p className="mt-2 text-slate-600">Configura domande, opzioni e helper contestuali per la colletta PayPal.</p>
        </div>
        <Link href={`/admin/events/${event.id}/registrations`} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100">Vedi iscritti</Link>
      </div>
      <EventEditorCard mode="edit" event={event} />
      <QuestionManager event={event} />
    </div>
  );
}
