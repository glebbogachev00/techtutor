import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale";
import MissionWorkspace from "./MissionWorkspace";

export default async function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: mission } = await supabase
    .from("missions")
    .select("*, tracks(slug, title_en, title_vn)")
    .eq("id", id)
    .maybeSingle();

  if (!mission) notFound();

  // Get the most recent attempt to restore code
  const { data: lastSubmission } = await supabase
    .from("submissions")
    .select("code, ai_feedback, status, created_at")
    .eq("user_id", user.id)
    .eq("mission_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: progressRow } = await supabase
    .from("progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("mission_id", id)
    .maybeSingle();

  const locale = await getLocale();

  return (
    <MissionWorkspace
      locale={locale}
      mission={mission}
      initialCode={lastSubmission?.code ?? mission.starter_code}
      initialFeedback={lastSubmission?.ai_feedback ?? null}
      initialStatus={lastSubmission?.status ?? null}
      alreadyCompleted={Boolean(progressRow)}
    />
  );
}
