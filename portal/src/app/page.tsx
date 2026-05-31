import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export default async function Home() {
  const locale = await getLocale();
  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl primary-gradient mb-6 shadow-lg">
          <span className="text-4xl">🚀</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[color:var(--color-ink)] mb-4">
          {t(locale, "brand.name")}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {t(locale, "brand.tagline")}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/login" className="btn-primary text-base">
            {t(locale, "login.submit")}
          </Link>
          <Link
            href="/preview"
            className="text-base font-semibold px-8 py-[14px] rounded-full border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white transition"
          >
            Preview (no login)
          </Link>
        </div>
      </div>
    </main>
  );
}
