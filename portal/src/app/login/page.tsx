import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in — TechBash" };

export default async function LoginPage() {
  const locale = await getLocale();
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full card p-8">
        <div className="text-center mb-8">
          <div className="primary-gradient w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[color:var(--color-ink)]">
            {t(locale, "login.title")}
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            {t(locale, "login.subtitle")}
          </p>
        </div>
        <LoginForm locale={locale} />
      </div>
    </main>
  );
}
