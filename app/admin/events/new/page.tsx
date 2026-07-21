import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth";
import { EventEditorCard } from "@/components/admin/event-editor-card";

export default async function NewAdminEventPage() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email || !isAdminEmail(email)) {
    redirect("/login");
  }

  return <EventEditorCard mode="create" />;
}
