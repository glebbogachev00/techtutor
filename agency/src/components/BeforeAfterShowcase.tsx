// Detailed before/after showcases.
// "Before": a cluttered collage of the real tools we used (Sheets, Canva,
// Zoho, chat threads, emailed slides). "After": one polished product frame.
// All pure CSS — rich detail, never stale.

/* ── shared window chrome ── */
function Win({
  title,
  tint,
  className = "",
  style,
  children,
}: {
  title: string;
  tint?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg overflow-hidden border border-white/10 bg-[#101010] shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${className}`}
      style={style}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-white/[0.06] bg-white/[0.03]">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: tint ?? "rgba(255,255,255,0.2)" }} />
        <span className="text-[8px] text-[#777] truncate" style={{ fontFamily: "var(--font-mono)" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ══════════════ BEFORE: running the school ══════════════ */
function BeforeAdmin() {
  return (
    <div className="relative h-[340px] sm:h-[380px] select-none" aria-hidden>
      {/* Spreadsheet CRM */}
      <Win
        title="students_FINAL_v3 — Google Sheets"
        tint="#34a853"
        className="absolute left-0 top-0 w-[62%] -rotate-[1.5deg]"
      >
        <div className="p-2">
          <div className="grid grid-cols-4 gap-px bg-white/[0.06] text-[7px]" style={{ fontFamily: "var(--font-mono)" }}>
            {["NAME", "PAID?", "CLASS", "NOTE"].map((h) => (
              <div key={h} className="bg-[#151515] px-1.5 py-1 text-[#888]">{h}</div>
            ))}
            {[
              ["Minh T.", "??", "Scratch B", "ask mom"],
              ["Linh N.", "YES", "Python A", ""],
              ["Duc P.", "cash?", "Web", "CHECK!!"],
              ["An V.", "", "Scratch B", "moved?"],
              ["Khoa L.", "YES", "??", ""],
            ].map((row, i) =>
              row.map((c, j) => (
                <div key={`${i}-${j}`} className={`px-1.5 py-1 truncate ${c.includes("?") || c.includes("!") ? "bg-[#2a1515] text-[#e8a0a0]" : "bg-[#131313] text-[#999]"}`}>
                  {c || "—"}
                </div>
              )),
            )}
          </div>
        </div>
      </Win>

      {/* Zoho invoice */}
      <Win
        title="Invoice INV-0042 — Zoho"
        tint="#e42527"
        className="absolute right-0 top-6 w-[42%] rotate-[2deg] z-10"
      >
        <div className="p-2.5 space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-12 rounded bg-white/20" />
            <span className="text-[7px] text-[#e8a0a0]" style={{ fontFamily: "var(--font-mono)" }}>OVERDUE</span>
          </div>
          <div className="h-1 w-full rounded bg-white/[0.07]" />
          <div className="h-1 w-4/5 rounded bg-white/[0.07]" />
          <div className="h-1 w-full rounded bg-white/[0.07]" />
          <div className="flex justify-between pt-1 border-t border-white/[0.06]">
            <div className="h-1.5 w-8 rounded bg-white/10" />
            <div className="h-1.5 w-10 rounded bg-white/25" />
          </div>
        </div>
      </Win>

      {/* Canva certificate */}
      <Win
        title="certificate_temp2 (1).png — Canva"
        tint="#8b3dff"
        className="absolute left-[8%] bottom-10 w-[44%] rotate-[1deg] z-20"
      >
        <div className="p-2.5">
          <div className="rounded border border-dashed border-white/15 p-2 text-center space-y-1.5">
            <div className="h-1 w-14 rounded bg-[#c9a86a]/50 mx-auto" />
            <div className="h-2 w-24 rounded bg-white/20 mx-auto" />
            <div className="h-1 w-16 rounded bg-white/[0.08] mx-auto" />
            <div className="flex justify-center gap-2 pt-1">
              <div className="h-3 w-3 rounded-full bg-[#c9a86a]/40" />
            </div>
          </div>
        </div>
      </Win>

      {/* Chat follow-ups */}
      <Win
        title="Zalo — 47 unread"
        tint="#0068ff"
        className="absolute right-[4%] bottom-0 w-[38%] -rotate-[2deg] z-30"
      >
        <div className="p-2 space-y-1.5">
          {[
            { w: "w-4/5", me: false },
            { w: "w-3/5", me: true },
            { w: "w-full", me: false },
            { w: "w-1/2", me: true },
          ].map((m, i) => (
            <div key={i} className={`flex ${m.me ? "justify-end" : ""}`}>
              <div className={`h-3 ${m.w} rounded-lg ${m.me ? "bg-[#0068ff]/30" : "bg-white/[0.08]"}`} />
            </div>
          ))}
          <p className="text-[7px] text-[#777] pt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
            typing invoice reminder #12 today…
          </p>
        </div>
      </Win>

      {/* Drive scatter */}
      <div className="absolute right-[28%] top-0 z-0 rotate-[4deg] rounded-md border border-white/10 bg-[#141414] px-2 py-1.5 text-[7px] text-[#888]" style={{ fontFamily: "var(--font-mono)" }}>
        📁 Drive / reports / FINAL / final2 /
      </div>
    </div>
  );
}

/* ══════════════ AFTER: Admin OS ══════════════ */
function AfterAdmin() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/12 bg-[#0d0d0d] select-none" aria-hidden>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]">
        <span className="flex gap-1.5">
          <i className="w-2 h-2 rounded-full bg-white/15" />
          <i className="w-2 h-2 rounded-full bg-white/15" />
          <i className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <span className="ml-1 text-[9px] text-[#666]" style={{ fontFamily: "var(--font-mono)" }}>
          admin.techtutor.academy
        </span>
      </div>
      <div className="flex h-[300px] sm:h-[340px]">
        {/* sidebar */}
        <div className="w-24 shrink-0 border-r border-white/[0.06] p-2.5 flex flex-col gap-1 text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
          <div className="h-4 w-4 rounded bg-gradient-to-br from-[#2C7A7B] to-[#4fd1c5] mb-2" />
          {["Dashboard", "Students", "Classes", "Invoices", "Certificates", "Reports"].map((item, i) => (
            <div key={item} className={`px-1.5 py-1 rounded ${i === 0 ? "bg-[#2C7A7B]/20 text-[#4fd1c5]" : "text-[#777]"}`}>
              {item}
            </div>
          ))}
        </div>
        {/* main */}
        <div className="flex-1 p-3 flex flex-col gap-2.5 min-w-0">
          {/* stat tiles */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Active students", v: "64", d: "+6 this mo." },
              { label: "Invoices paid", v: "98%", d: "auto-sent" },
              { label: "Certs issued", v: "31", d: "auto-gen" },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-white/[0.07] bg-white/[0.03] p-2">
                <p className="text-[7px] text-[#777] mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>{s.label}</p>
                <p className="text-sm font-bold text-white leading-none">{s.v}</p>
                <p className="text-[7px] text-[#4fd1c5] mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>{s.d}</p>
              </div>
            ))}
          </div>
          {/* students table */}
          <div className="flex-1 rounded-md border border-white/[0.07] bg-white/[0.02] p-2 min-h-0 overflow-hidden">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[8px] text-[#999]" style={{ fontFamily: "var(--font-mono)" }}>STUDENTS</p>
              <div className="h-3.5 w-14 rounded-full bg-[#2C7A7B] grid place-items-center text-[7px] text-white" style={{ fontFamily: "var(--font-mono)" }}>
                + Enroll
              </div>
            </div>
            <div className="space-y-1">
              {[
                { n: "Minh T.", c: "Scratch B", pay: "Paid", cert: "Issued" },
                { n: "Linh N.", c: "Python A", pay: "Paid", cert: "—" },
                { n: "Duc P.", c: "Web Dev", pay: "Paid", cert: "Issued" },
                { n: "An V.", c: "Scratch B", pay: "Due 07/10", cert: "—" },
              ].map((r) => (
                <div key={r.n} className="flex items-center gap-2 rounded bg-white/[0.03] px-2 py-1 text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
                  <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#2952b8] to-[#7C3AED] shrink-0" />
                  <span className="text-[#ccc] w-12 truncate">{r.n}</span>
                  <span className="text-[#777] flex-1 truncate">{r.c}</span>
                  <span className={`px-1.5 py-0.5 rounded-full ${r.pay === "Paid" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>
                    {r.pay}
                  </span>
                  <span className="text-[#666] hidden sm:block">{r.cert}</span>
                </div>
              ))}
            </div>
          </div>
          {/* automation strip */}
          <div className="rounded-md border border-[#2C7A7B]/30 bg-[#2C7A7B]/[0.08] px-2.5 py-1.5 flex items-center gap-2 text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4fd1c5] animate-pulse" />
            <span className="text-[#9adbd4] truncate">Auto: invoice sent → An V. · certificate generated → Duc P. · report emailed → 3 parents</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ BEFORE: teaching students ══════════════ */
function BeforePortal() {
  return (
    <div className="relative h-[340px] sm:h-[380px] select-none" aria-hidden>
      {/* emailed slides */}
      <Win
        title="Fwd: Fwd: lesson 7 slides (FINAL).pdf — Gmail"
        tint="#ea4335"
        className="absolute left-0 top-0 w-[58%] -rotate-[1deg]"
      >
        <div className="p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
            <div className="h-1.5 w-20 rounded bg-white/15" />
            <span className="ml-auto text-[7px] text-[#777]" style={{ fontFamily: "var(--font-mono)" }}>11:48 PM</span>
          </div>
          <div className="h-1 w-full rounded bg-white/[0.07]" />
          <div className="h-1 w-5/6 rounded bg-white/[0.07]" />
          <div className="flex gap-1.5 pt-1">
            <div className="rounded border border-white/10 px-2 py-1 text-[7px] text-[#999]" style={{ fontFamily: "var(--font-mono)" }}>
              📎 slides_v7_FINAL2.pdf
            </div>
            <div className="rounded border border-white/10 px-2 py-1 text-[7px] text-[#999]" style={{ fontFamily: "var(--font-mono)" }}>
              📎 homework.docx
            </div>
          </div>
          <p className="text-[7px] text-[#777] pt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
            did anyone actually open this? 🤷
          </p>
        </div>
      </Win>

      {/* homework chat chase */}
      <Win
        title="Class group — Zalo"
        tint="#0068ff"
        className="absolute right-0 top-8 w-[40%] rotate-[2deg] z-10"
      >
        <div className="p-2 space-y-1.5">
          <div className="rounded-lg bg-white/[0.08] px-2 py-1 text-[7px] text-[#aaa] w-5/6">
            Remember homework due Friday!!
          </div>
          <div className="rounded-lg bg-white/[0.08] px-2 py-1 text-[7px] text-[#aaa] w-4/6">
            Reminder again 🙏
          </div>
          <div className="flex justify-end">
            <div className="rounded-lg bg-[#0068ff]/25 px-2 py-1 text-[7px] text-[#9bc0ff]">
              teacher what homework?
            </div>
          </div>
          <p className="text-[7px] text-[#777]" style={{ fontFamily: "var(--font-mono)" }}>3 of 12 submitted…</p>
        </div>
      </Win>

      {/* hand-built portfolio */}
      <Win
        title="minh-portfolio-page-draft.html — editor"
        tint="#8b3dff"
        className="absolute left-[10%] bottom-0 w-[52%] rotate-[1.5deg] z-20"
      >
        <div className="p-2.5 space-y-1" style={{ fontFamily: "var(--font-mono)" }}>
          {[
            "<div class='project'>",
            "  <h2>Minh's game</h2>  <!-- TODO: 11 more students -->",
            "  <img src='???.png'>  <!-- ask for screenshot AGAIN -->",
            "</div>",
          ].map((line, i) => (
            <p key={i} className="text-[7px] leading-relaxed">
              <span className="text-[#555] mr-1.5">{i + 1}</span>
              <span className={line.includes("TODO") || line.includes("AGAIN") ? "text-[#e8a0a0]" : "text-[#8aa2c0]"}>{line}</span>
            </p>
          ))}
        </div>
      </Win>
    </div>
  );
}

/* ══════════════ AFTER: TechBash ══════════════ */
function AfterPortal() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/12 bg-[#0d0d0d] select-none" aria-hidden>
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-white/[0.03]">
        <span className="flex gap-1.5">
          <i className="w-2 h-2 rounded-full bg-white/15" />
          <i className="w-2 h-2 rounded-full bg-white/15" />
          <i className="w-2 h-2 rounded-full bg-white/15" />
        </span>
        <span className="ml-1 text-[9px] text-[#666]" style={{ fontFamily: "var(--font-mono)" }}>
          techbash — Mission 4: Build your first page
        </span>
      </div>
      <div className="h-[300px] sm:h-[340px] p-3 flex flex-col gap-2.5">
        {/* header: student + xp */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#2952b8] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-[8px] mb-1" style={{ fontFamily: "var(--font-mono)" }}>
              <span className="text-[#ccc]">Minh T. · Web track</span>
              <span className="text-[#a78bfa]">LVL 12 · 2,840 XP</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#a78bfa]" />
            </div>
          </div>
          <div className="flex gap-1">
            {["🔥", "🏅", "⚡"].map((b) => (
              <span key={b} className="w-5 h-5 rounded-full bg-white/[0.06] border border-white/10 grid place-items-center text-[9px]">{b}</span>
            ))}
          </div>
        </div>
        {/* editor + feedback */}
        <div className="flex-1 grid grid-cols-5 gap-2.5 min-h-0">
          <div className="col-span-3 rounded-md border border-white/[0.07] bg-[#0a0a0a] p-2.5 overflow-hidden" style={{ fontFamily: "var(--font-mono)" }}>
            {[
              ["1", "<h1>My Robot Shop</h1>", "#8aa2c0"],
              ["2", "<p>Robots that do chores!</p>", "#8aa2c0"],
              ["3", "<button class='buy'>", "#c0a2e8"],
              ["4", "  Buy now 🤖", "#9adbd4"],
              ["5", "</button>", "#c0a2e8"],
            ].map(([n, code, color]) => (
              <p key={n} className="text-[8px] leading-relaxed">
                <span className="text-[#555] mr-2">{n}</span>
                <span style={{ color: color as string }}>{code}</span>
              </p>
            ))}
            <div className="mt-2 h-3 w-1 bg-[#a78bfa] animate-pulse" />
          </div>
          <div className="col-span-2 flex flex-col gap-2 min-h-0">
            <div className="flex-1 rounded-md border border-emerald-500/25 bg-emerald-500/[0.06] p-2.5">
              <p className="text-[8px] text-emerald-300 mb-1" style={{ fontFamily: "var(--font-mono)" }}>✓ AI CHECK — PASSED</p>
              <p className="text-[8px] text-[#9c9] leading-relaxed">Great heading! Your button works. Try adding a price next.</p>
            </div>
            <div className="rounded-md border border-white/[0.07] bg-white/[0.03] p-2">
              <p className="text-[7px] text-[#777] mb-1" style={{ fontFamily: "var(--font-mono)" }}>AUTO-ADDED TO PORTFOLIO</p>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-4 rounded-sm bg-gradient-to-br from-[#2952b8]/60 to-[#7C3AED]/60" />
                <div>
                  <div className="h-1 w-14 rounded bg-white/20 mb-0.5" />
                  <div className="h-1 w-9 rounded bg-white/10" />
                </div>
                <span className="ml-auto text-[7px] text-[#4fd1c5]" style={{ fontFamily: "var(--font-mono)" }}>public ✓</span>
              </div>
            </div>
          </div>
        </div>
        {/* next missions strip */}
        <div className="flex gap-2 text-[8px]" style={{ fontFamily: "var(--font-mono)" }}>
          <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300">✓ M1–3</span>
          <span className="px-2 py-1 rounded-full bg-[#7C3AED]/25 text-[#c4b5fd] border border-[#7C3AED]/40">▶ M4 · +120 XP</span>
          <span className="px-2 py-1 rounded-full bg-white/[0.05] text-[#666]">M5 🔒</span>
          <span className="px-2 py-1 rounded-full bg-white/[0.05] text-[#666]">Boss 🔒</span>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterShowcase({ kind, side }: { kind: string; side: "before" | "after" }) {
  if (kind === "admin") return side === "before" ? <BeforeAdmin /> : <AfterAdmin />;
  return side === "before" ? <BeforePortal /> : <AfterPortal />;
}
