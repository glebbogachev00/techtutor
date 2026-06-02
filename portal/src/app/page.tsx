import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "TechBash — Become great at your own pace · by TechTutor",
  description:
    "TechBash turns coding into a story-driven galaxy. Your child builds real websites, Python projects, and AI tools at their own pace — guided by characters they actually grow to love.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role === "teacher" || profile?.role === "admin") redirect("/teacher");
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-0.5">
            <span style={{ color: "#193b92" }}>Tech</span><span style={{ color: "#2C7A7B" }}>Bash</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <a href="#demo" className="hover:text-[#193b92] transition">See it in action</a>
            <a href="#crew" className="hover:text-[#193b92] transition">Meet the crew</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="https://techtutor.academy" className="hidden md:inline text-xs text-slate-400 hover:text-slate-600 transition whitespace-nowrap">← TechTutor</a>
            <Link href="/login" className="rounded-full border-2 border-[#193b92] text-[#193b92] px-5 py-2 text-sm font-semibold hover:bg-[#193b92] hover:text-white transition whitespace-nowrap">
              Log in
            </Link>
            <Link href="/preview" className="rounded-full bg-[#193b92] text-white px-5 py-2.5 text-sm font-bold shadow hover:bg-[#2952b8] transition whitespace-nowrap">
              Try free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="badge-pill bg-blue-50 text-[#193b92]">
              <span className="w-2 h-2 rounded-full bg-[#E89F47] inline-block"></span> For parents who want more than YouTube
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-black leading-tight tracking-tight text-[#0F172A]">
              Finally, a screen your kid <span style={{ color: "#E89F47" }}>begs to open</span> — and you&apos;re glad they did.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-xl">
              TechBash turns coding into a story-driven galaxy. Your child builds real websites, Python projects, and AI tools at their own pace — guided by characters they actually grow to love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/preview" className="rounded-full bg-[#193b92] text-white px-7 py-3 font-bold shadow-lg hover:bg-[#2952b8] transition inline-flex items-center gap-2">
                Try a free mission now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <a href="#demo" className="rounded-full border-2 border-slate-200 text-slate-700 px-7 py-3 font-semibold hover:border-[#193b92] hover:text-[#193b92] transition">See it in action</a>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>No download</span>
              <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>No ads, no chat, no algorithm</span>
              <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>Free to try</span>
            </div>
          </div>
          <div className="relative">
            <Image src="/images/landing_bash.png" alt="TechBash cosmic coding scene" width={700} height={560} className="w-full h-auto" priority />
          </div>
        </div>
      </section>

      {/* PARENT PAINS */}
      <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge-pill bg-rose-100 text-rose-700">Sound familiar?</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-black text-[#0F172A]">You&apos;ve tried the other things.</h2>
            <p className="mt-3 text-slate-600">And one of these probably happened.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📺", title: '"They just watch coding on YouTube."', body: 'Hours of videos, zero things built. We flip it: build first, watch never.' },
              { icon: "💸", title: '"Tutoring costs $60/hour and they zone out."', body: 'Story-driven missions hold attention without paying a human every week.' },
              { icon: "📚", title: '"They signed up for a course and quit by week 3."', body: "No deadlines. No teacher voice droning on. Just the next mission, when they're ready." },
              { icon: "🎮", title: '"Anything fun is also full of garbage."', body: 'No ads. No comments. No "subscribe and like" — ever. Closed garden, real code.' },
            ].map((c) => (
              <div key={c.icon} className="pain-card rounded-2xl bg-white p-5 border border-slate-200">
                <div className="text-2xl">{c.icon}</div>
                <h3 className="mt-3 font-bold text-[#0F172A] text-sm">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS TECHBASH */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <span className="badge-pill bg-blue-50 text-[#193b92]">What is TechBash</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#0F172A]">A coding portal that feels like a galaxy.</h2>
          <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto">
            Three modes. One crew. Real code. Kids switch between guided missions, open-ended adventures, and a free playground — building confidence one screen at a time.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            {[
              { letter: "M", color: "bg-[#193b92] text-white", title: "Missions", body: "Bite-sized, guided lessons. Story → concept → try → check. Perfect for first-timers." },
              { letter: "A", color: "bg-[#2C7A7B] text-white", title: "Adventure", body: "Six planets. Six citizens with real problems. Build the project — your way." },
              { letter: "P", color: "bg-[#E89F47] text-[#0F172A]", title: "Playground", body: "A blank canvas with a help button. Captain Pixel scaffolds line-by-line whenever a kid gets stuck." },
            ].map((m) => (
              <div key={m.letter} className="rounded-3xl border border-slate-200 bg-white p-7">
                <div className={`w-12 h-12 rounded-2xl ${m.color} grid place-items-center text-xl font-black`}>{m.letter}</div>
                <h3 className="mt-5 text-xl font-bold text-[#0F172A]">{m.title}</h3>
                <p className="mt-2 text-slate-600">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="py-20 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge-pill bg-teal-50 text-[#234E52]">See it in action</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#0F172A]">This is what your kid actually sees.</h2>
            <p className="mt-4 text-slate-600">Not a slideshow. Real story. Real code editor. Real AI feedback.</p>
          </div>
          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {/* Demo 1 */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">1 · The story arrives</p>
              <div className="browser-frame">
                <div className="browser-bar">
                  <span className="browser-dot" style={{ background: "#ff5f57" }}></span>
                  <span className="browser-dot" style={{ background: "#febc2e" }}></span>
                  <span className="browser-dot" style={{ background: "#28c840" }}></span>
                  <span className="browser-url">bash.techtutor.academy/preview?track=web</span>
                </div>
                <div className="portal-header">
                  <div className="portal-logo"><span style={{ color: "#193b92" }}>Tech</span><span style={{ color: "#2C7A7B" }}>Bash</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Total <b style={{ color: "#193b92" }}>240</b> XP</span>
                    <span className="portal-avatar">A</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 space-y-3">
                  <div className="mission-card">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mission 3 · Web</p>
                    <h4 className="font-bold text-[#0F172A] text-sm">Give your page a heart</h4>
                    <div className="speaker-row mt-3">
                      <Image src="/characters/captain-pixel.png" alt="Captain Pixel" width={44} height={44} className="speaker-avatar object-cover" style={{ background: "#f5f0ff" }} />
                      <div>
                        <p className="text-[11px] font-semibold text-[#193b92]">Captain Pixel</p>
                        <p className="text-[13px] text-[#0F172A] mt-0.5 leading-snug">&quot;My old homepage is so boring. Add a header with my name and a paragraph telling visitors what I love. We need <b>personality</b>!&quot;</p>
                      </div>
                    </div>
                    <div className="concept-box mt-3">
                      <b>Concept:</b> the <code>&lt;h1&gt;</code> tag is your page&apos;s biggest voice. <code>&lt;p&gt;</code> is for the chatty bits.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Demo 2 */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">2 · They build it themselves</p>
              <div className="browser-frame">
                <div className="browser-bar">
                  <span className="browser-dot" style={{ background: "#ff5f57" }}></span>
                  <span className="browser-dot" style={{ background: "#febc2e" }}></span>
                  <span className="browser-dot" style={{ background: "#28c840" }}></span>
                  <span className="browser-url">bash.techtutor.academy/preview</span>
                </div>
                <div className="p-3 bg-slate-50">
                  <div className="rounded-lg overflow-hidden border border-slate-200">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">index.html</span>
                      <span className="xp-pill">▶ Run</span>
                    </div>
                    <pre className="code-editor m-0"><span className="comment">{`<!-- Your turn -->`}</span>{"\n"}<span className="tag">{`<h1>`}</span>Hi, I&apos;m <span style={{ color: "#fbbf24" }}>Alex</span>!<span className="tag">{`</h1>`}</span>{"\n"}<span className="tag">{`<p>`}</span>I build games and love{"\n"}ramen noodles 🍜<span className="tag">{`</p>`}</span></pre>
                  </div>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Live preview</p>
                    <h3 className="text-base font-black text-[#0F172A]">Hi, I&apos;m Alex!</h3>
                    <p className="text-xs text-slate-600 mt-1">I build games and love ramen noodles 🍜</p>
                  </div>
                  <div className="mt-3 chat-feedback">✅ <b>Nailed it.</b> Your page has a heading AND two paragraphs. +80 XP earned.</div>
                </div>
              </div>
            </div>
            {/* Demo 3 */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">3 · They learn to talk to AI</p>
              <div className="browser-frame">
                <div className="browser-bar">
                  <span className="browser-dot" style={{ background: "#ff5f57" }}></span>
                  <span className="browser-dot" style={{ background: "#febc2e" }}></span>
                  <span className="browser-dot" style={{ background: "#28c840" }}></span>
                  <span className="browser-url">bash.techtutor.academy/preview?track=genai</span>
                </div>
                <div className="p-3 bg-slate-50">
                  <div className="mission-card">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mission 4 · GenAI</p>
                    <h4 className="font-bold text-[#0F172A] text-sm">Get the AI to reply in JSON</h4>
                    <p className="text-[11px] mt-2"><b style={{ color: "#7C3AED" }}>Goal:</b> AI returns a JSON array of 3 dinosaurs with name + fact.</p>
                  </div>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 flex flex-col gap-2">
                    <div className="chat-bubble-user">Reply with ONLY a JSON array of 3 dinosaurs. Each item has &apos;name&apos; and &apos;fact&apos;. No other text.</div>
                    <div className="chat-bubble-ai" style={{ fontFamily: "ui-monospace,'SF Mono',monospace", fontSize: "11.5px" }}>[{"\n  "}{`{"name":"T-Rex","fact":"Tiny arms, huge bite."},`}{"\n  "}{`{"name":"Stegosaurus","fact":"Brain the size of a walnut."},`}{"\n  "}{`{"name":"Velociraptor","fact":"Had feathers, actually."}`}{"\n]"}</div>
                  </div>
                  <div className="mt-3 chat-feedback">✅ Valid JSON · 3 items · both keys present. <b>Prompt engineer in training.</b></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link href="/preview" className="inline-flex items-center gap-2 rounded-full bg-[#193b92] text-white px-7 py-3 font-bold shadow-lg hover:bg-[#2952b8] transition">
              Try it free — takes 30 seconds
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </Link>
            <p className="mt-3 text-xs text-slate-500">No sign-up needed to try the first missions.</p>
          </div>
        </div>
      </section>

      {/* WHY PARENTS */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="badge-pill bg-amber-50 text-amber-700">Why parents pick TechBash</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#0F172A]">It works because it&apos;s built around how kids actually learn.</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              { icon: "📖", title: "Story-driven, not lecture-driven", body: "Every mission opens with a character who needs help. Kids care about the problem before they meet the code." },
              { icon: "🐢", title: "Self-paced, no pressure", body: "15 minutes today, an hour Saturday. No deadlines. Curiosity decides when they come back — and curiosity is what makes it stick." },
              { icon: "🛠️", title: "They build, from minute one", body: 'No "watch this 12-min video first." Mission 1 has them editing real code with a live preview side by side.' },
              { icon: "📊", title: "You can see they're learning", body: "XP, completed missions, and tracks are saved to their profile. Open it any time to see exactly what they've built." },
              { icon: "🤖", title: "Real AI literacy, not magic", body: "Our GenAI track teaches kids to direct AI — prompt engineering, structured output, spotting hallucinations. The skill of the next decade." },
              { icon: "💰", title: "Costs less than one tutoring hour", body: "A full month of TechBash is cheaper than a single private session — and they can revisit anything, any time." },
            ].map((b) => (
              <div key={b.icon} className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-[#0F172A]">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREW */}
      <section id="crew" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <span className="badge-pill bg-teal-50 text-[#234E52]">Meet the crew</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#0F172A]">Four characters. Endless trouble.</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Each one teaches a different kind of thinking. Kids don&apos;t just learn syntax — they learn who to ask.</p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { src: "/characters/captain-pixel.png", name: "Captain Pixel", role: "Mission Commander", color: "text-[#193b92]", quote: '"800 years in command. Still hasn\'t learned to make tea."' },
              { src: "/characters/bao.png", name: "Bao", role: "First Builder", color: "text-[#234E52]", quote: "Learns alongside the student. Asks the questions kids are too shy to ask." },
              { src: "/characters/mochi.png", name: "Mochi", role: "Game Designer", color: "text-[#E89F47]", quote: "Loves loops. Loves snacks. Loves loops about snacks." },
              { src: "/characters/professor-loop.png", name: "Professor Loop", role: "AI Scientist", color: "text-[#7C3AED]", quote: "Knows what data wants. Forgets what day it is." },
            ].map((c) => (
              <div key={c.name} className="crew-card rounded-3xl bg-slate-50 p-6 border border-slate-200">
                <Image src={c.src} alt={c.name} width={112} height={112} className="w-28 h-28 mx-auto" />
                <h3 className="mt-4 text-lg font-bold text-[#0F172A]">{c.name}</h3>
                <p className={`mt-1 text-xs uppercase tracking-wider font-semibold ${c.color}`}>{c.role}</p>
                <p className="mt-3 text-sm text-slate-600">{c.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARENT SAFETY */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
          <span className="badge-pill bg-blue-50 text-[#193b92]">For parents</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black text-[#0F172A]">A safer place than YouTube.</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">No ads. No comments. No algorithm. Just a kid, a screen, and real code.</p>
          <div className="mt-12 grid md:grid-cols-2 gap-5 text-left">
            {[
              { icon: "🛡️", title: "Safe by design", body: "No social features. No external links. Closed environment for focused learning." },
              { icon: "⏱️", title: "Self-paced", body: "No deadlines. Kids return when curious — that's when learning sticks." },
              { icon: "🌍", title: "International teachers", body: "When kids want a real human, our certified teachers are one click away." },
              { icon: "📜", title: "Real certificates", body: "Each level completed earns a verifiable certificate of achievement." },
            ].map((p) => (
              <div key={p.icon} className="rounded-2xl bg-white p-6 border border-slate-200 flex gap-4">
                <div className="text-2xl">{p.icon}</div>
                <div>
                  <h3 className="font-bold text-[#0F172A]">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-[#193b92] text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black leading-tight">Ready to launch?</h2>
          <p className="mt-4 text-blue-200 text-lg">First mission is free. No account needed.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/preview" className="rounded-full bg-white text-[#193b92] px-8 py-3.5 font-bold shadow-lg hover:bg-slate-100 transition inline-flex items-center gap-2">
              Try a free mission
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </Link>
            <Link href="/login" className="rounded-full border-2 border-white/40 text-white px-8 py-3.5 font-semibold hover:border-white transition">
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Image src="/images/robot-rocket.png" alt="TechBash" width={48} height={48} className="h-12 w-auto" />
            <div>
              <p className="font-black text-lg"><span style={{ color: "#7dd3fc" }}>Tech</span><span style={{ color: "#5eead4" }}>Bash</span></p>
              <p className="text-xs text-slate-400">by TechTutor Academy</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            <a href="https://techtutor.academy" className="hover:text-white transition">TechTutor Academy</a>
            <a href="https://techtutor.academy/en/blog.html" className="hover:text-white transition">Blog</a>
            <a href="mailto:hello@techtutor.academy" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-xs text-slate-500">© 2025 TechTutor Academy</p>
        </div>
      </footer>
    </div>
  );
}

