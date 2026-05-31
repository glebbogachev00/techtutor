import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_emoji, role")
    .eq("id", user.id)
    .maybeSingle();

  const locale = await getLocale();
  const displayName = profile?.full_name ?? user.email ?? "Student";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="teal-gradient">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 text-white">
            <span className="text-2xl">{profile?.avatar_emoji ?? "🚀"}</span>
            <span className="font-extrabold text-lg">
              {t(locale, "brand.name")}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LangToggle current={locale} />
            <span className="hidden sm:inline text-sm text-white/90">
              {displayName}
            </span>
            <form action="/auth/signout" method="post">
              <button className="bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
                {t(locale, "nav.logout")}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
