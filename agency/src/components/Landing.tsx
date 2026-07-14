import Link from "next/link";
import Image from "next/image";
import { COPY, type Locale } from "@/lib/copy";
import ProductMockup from "@/components/ProductMockup";
import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";
import SavingsCalculator from "@/components/SavingsCalculator";

export default function Landing({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const home = locale === "en" ? "/" : "/vn";

  return (
    <div className="hero-glow min-h-screen">
      {/* ── Nav ── */}
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href={home} className="font-bold tracking-tight text-[15px]">
          gurren<span className="text-[#666]">grow</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[#a1a1a1]">
          <a href="#work" className="hover:text-white transition hidden sm:block">{t.nav.work}</a>
          <a href="#services" className="hover:text-white transition hidden sm:block">{t.nav.services}</a>
          <a href="#contact" className="hover:text-white transition hidden sm:block">{t.nav.contact}</a>
          <Link
            href={t.langSwitch.href}
            className="eyebrow hairline rounded-full px-3 py-1.5 hover:border-white/30 transition"
          >
            {t.langSwitch.label}
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <p className="eyebrow fade-up mb-6">{t.hero.eyebrow}</p>
        <h1 className="fade-up fade-up-1 text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          {t.hero.title}
          <br />
          <span className="text-[#a1a1a1]">{t.hero.titleAccent}</span>
        </h1>
        <p className="fade-up fade-up-2 max-w-xl mx-auto mt-6 text-[#a1a1a1] text-base sm:text-lg leading-relaxed">
          {t.hero.sub}
        </p>
        <div className="fade-up fade-up-3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#contact" className="btn-white">
            {t.hero.ctaPrimary} <span aria-hidden>→</span>
          </a>
          <a href="#work" className="btn-ghost">{t.hero.ctaSecondary}</a>
        </div>
      </section>

      {/* ── Proof / Work ── */}
      <section id="work" className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="eyebrow mb-4">{t.proof.eyebrow}</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl">
            {t.proof.title}
          </h2>
          <p className="mt-5 max-w-2xl text-[#a1a1a1] leading-relaxed">{t.proof.body}</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.proof.products.map((p) => (
              <div key={p.key} className="panel p-4 flex flex-col">
                <ProductMockup kind={p.key} />
                <div className="pt-4 px-1 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="font-semibold text-[15px]">{p.name}</h3>
                    <span className="eyebrow !text-[9px] shrink-0">{p.tag}</span>
                  </div>
                  <p className="text-sm text-[#a1a1a1] leading-relaxed flex-1">{p.body}</p>
                  <p
                    className="mt-3 text-[11px] text-[#666]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {p.stat}
                  </p>
                  <a
                    href={p.link}
                    {...(p.link.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white transition"
                  >
                    {p.linkLabel} <span aria-hidden>{p.link.startsWith("http") ? "↗" : "→"}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <p className="text-sm text-[#666]">{t.proof.note}</p>
            <a
              href="https://techtutor.academy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#a1a1a1] hover:text-white transition"
            >
              {t.proof.link} <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="eyebrow mb-4">{t.beforeAfter.eyebrow}</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl mb-14">
            {t.beforeAfter.title}
          </h2>

          <div className="space-y-20">
            {t.beforeAfter.rows.map((row) => (
              <div key={row.key} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                {/* Before */}
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="eyebrow !text-[10px] px-2.5 py-1 rounded-full border border-red-400/25 !text-red-300/80 bg-red-500/[0.06]">
                      {t.beforeAfter.beforeLabel}
                    </span>
                    <h3 className="font-semibold text-[15px]">{row.beforeTitle}</h3>
                  </div>
                  <BeforeAfterShowcase kind={row.key} side="before" />
                  <ul className="mt-5 space-y-1.5">
                    {row.before.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-[#a1a1a1]">
                        <span className="text-red-300/60 shrink-0">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* After */}
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="eyebrow !text-[10px] px-2.5 py-1 rounded-full border border-emerald-400/25 !text-emerald-300/80 bg-emerald-500/[0.06]">
                      {t.beforeAfter.afterLabel}
                    </span>
                    <h3 className="font-semibold text-[15px]">{row.afterName}</h3>
                  </div>
                  <BeforeAfterShowcase kind={row.key} side="after" />
                  <p className="mt-5 text-sm text-[#a1a1a1] leading-relaxed flex gap-2">
                    <span className="text-emerald-300/70 shrink-0">✓</span>
                    {row.after}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-16 text-center text-[#a1a1a1]">{t.beforeAfter.footer}</p>
        </div>
      </section>

      {/* ── Founder ── */}
      <section className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="eyebrow mb-4">{t.founder.eyebrow}</p>
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-12 items-start">
            <Image
              src="/gleb.jpg"
              alt={t.founder.name}
              width={440}
              height={440}
              className="w-full max-w-[220px] aspect-square object-cover rounded-2xl border border-white/10"
            />
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t.founder.name}</h2>
              <p
                className="mt-1 text-sm text-[#a1a1a1]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {t.founder.role}
              </p>
              <p className="mt-5 text-[#a1a1a1] leading-relaxed max-w-2xl">{t.founder.body}</p>
              <blockquote className="mt-6 border-l-2 border-white/15 pl-4 max-w-2xl">
                <p className="text-sm text-[#ccc] leading-relaxed italic">{t.founder.quote}</p>
                <footer className="mt-2 text-xs text-[#666]">{t.founder.quoteBy}</footer>
              </blockquote>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                {t.founder.stats.map((s) => (
                  <div key={s.label} className="panel p-4">
                    <p className="text-xl font-bold tracking-tight">{s.n}</p>
                    <p className="mt-0.5 text-xs text-[#a1a1a1]">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#666]">{t.founder.statsNote}</p>
              <a
                href={t.founder.fbHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-[#a1a1a1] hover:text-white transition"
              >
                {t.founder.fbLabel} <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="eyebrow mb-4">{t.problem.eyebrow}</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl mb-12">
            {t.problem.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.problem.points.map((p) => (
              <div key={p.title} className="panel p-6">
                <h3 className="font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-[#a1a1a1] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Savings calculator ── */}
      <section id="calculator" className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="eyebrow mb-4">{t.calculator.eyebrow}</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl">
            {t.calculator.title}
          </h2>
          <p className="mt-5 mb-12 max-w-2xl text-[#a1a1a1] leading-relaxed">{t.calculator.sub}</p>
          <SavingsCalculator t={t.calculator} />
        </div>
      </section>

      {/* ── Services / Pricing ── */}
      <section id="services" className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="eyebrow mb-4">{t.services.eyebrow}</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl mb-12">
            {t.services.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.services.items.map((item) => (
              <div key={item.step} className="panel p-7 flex flex-col">
                <p className="eyebrow mb-6">{item.step}</p>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm font-medium text-white/90 mb-4" style={{ fontFamily: "var(--font-mono)" }}>
                  {item.price}
                </p>
                <p className="text-sm text-[#a1a1a1] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <p className="eyebrow mb-4">{t.process.eyebrow}</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight max-w-2xl mb-12">
            {t.process.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.process.steps.map((s) => (
              <div
                key={s.n}
                className={`panel p-6 ${s.highlight ? "!border-white/25 bg-white/[0.04]" : ""}`}
              >
                <p
                  className="text-sm text-[#666] mb-4"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.n} —
                </p>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[#a1a1a1] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-[#a1a1a1] max-w-2xl">{t.process.note}</p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-28 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">{t.cta.title}</h2>
          <p className="max-w-lg mx-auto mt-5 text-[#a1a1a1] leading-relaxed">{t.cta.sub}</p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <a href={`mailto:${t.cta.email}`} className="btn-white">
              {t.cta.button} <span aria-hidden>→</span>
            </a>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a
                href={`mailto:${t.cta.email}`}
                className="text-sm text-[#666] hover:text-white transition"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {t.cta.email}
              </a>
              {t.cta.channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#666] hover:text-white transition"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {c.label}: {c.display}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="hairline-t">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666]">
          <p>{t.footer.line}</p>
          <p>
            {t.footer.builtBy}{" "}
            <a
              href="https://techtutor.academy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a1a1a1] hover:text-white transition"
            >
              TechTutor Academy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
