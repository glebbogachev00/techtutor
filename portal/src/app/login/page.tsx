import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale } from "@/lib/locale";
import LoginForm from "./LoginForm";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Sign in — TechBash" };

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "teacher" || profile?.role === "admin") {
      redirect("/teacher");
    }
    redirect("/dashboard");
  }

  const locale = await getLocale();
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[#FAFAFA]">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex justify-center mb-8">
          <Logo href="/" size="md" suffix="Portal" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/characters/captain-pixel.png"
              alt=""
              className="h-12 w-12 rounded-full object-cover shadow-[0_2px_10px_rgba(15,23,42,0.08)]"
            />
            <div>
              <h1 className="text-lg font-bold text-[#0F172A] leading-tight">
                Welcome to TechBash
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pick how you want to sign in.
              </p>
            </div>
          </div>
          <LoginForm locale={locale} />
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          Trouble signing in?{" "}
          <Link href="/" className="underline hover:text-[#0F172A]">
            Back to TechBash
          </Link>
        </p>
      </div>
    </main>
  );
}
