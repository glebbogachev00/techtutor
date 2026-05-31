import { cookies } from "next/headers";
import { defaultLocale, type Locale, locales } from "./i18n";

const COOKIE = "tt-portal-lang";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const val = store.get(COOKIE)?.value as Locale | undefined;
  return val && locales.includes(val) ? val : defaultLocale;
}

export async function setLocale(locale: Locale): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
