import { NextResponse } from "next/server";
import { setLocale } from "@/lib/locale";
import { locales, type Locale } from "@/lib/i18n";

export async function POST(request: Request) {
  const { locale } = await request.json();
  if (!locales.includes(locale as Locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  await setLocale(locale as Locale);
  return NextResponse.json({ ok: true });
}
