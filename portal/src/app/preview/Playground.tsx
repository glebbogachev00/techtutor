"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { CHARACTERS, type ScaffoldStep } from "./missions";
import { runPython } from "./python-runner";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Lang = "html" | "python";

const HTML_BLANK = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; }
  </style>
</head>
<body>
  <h1>Hello, world!</h1>
</body>
</html>`;

const PY_BLANK = `# Try anything you want.
print("Hello, world!")`;

const HTML_SCAFFOLD: ScaffoldStep[] = [
  { line: "<!DOCTYPE html>", note: "Tells the browser this is HTML." },
  { line: "<html>", note: "Everything on the page lives between <html> and </html>." },
  {
    line: "<head>\n  <style>\n    body { font-family: sans-serif; padding: 32px; background: #FAFAFA; }\n    h1   { color: #193b92; }\n  </style>\n</head>",
    note: "The <head> holds settings the visitor doesn't see directly — like CSS styles.",
  },
  { line: "<body>", note: "Open the part the visitor actually sees." },
  { line: "  <h1>Hello, world!</h1>", note: "A heading. <h1> is the biggest one." },
  { line: "  <p>Welcome to my first page.</p>", note: "A paragraph of normal text." },
  {
    line: '  <a href="https://techtutor.academy">Visit TechTutor</a>',
    note: "A link. The href is where it goes when clicked.",
  },
  { line: "</body>\n</html>", note: "Close the body and the html. Done!" },
];

const PY_SCAFFOLD: ScaffoldStep[] = [
  { line: "# A friendly greeting program", note: "A comment — Python ignores it. Notes for humans." },
  { line: 'name = "recruit"', note: "A variable. We're storing some text in a box called `name`." },
  { line: 'print("Hello,", name, "!")', note: "Print combines the word Hello with whatever is in `name`." },
  { line: "for i in range(3):", note: "A loop. The body runs 3 times. Notice the colon." },
  { line: '    print("Round", i + 1)', note: "Indented 4 spaces — that's how Python knows it's inside the loop." },
];

export default function Playground() {
  const [lang, setLang] = useState<Lang>("html");
  const [htmlCode, setHtmlCode] = useState<string>(HTML_BLANK);
  const [pyCode, setPyCode] = useState<string>(PY_BLANK);
  const [htmlStep, setHtmlStep] = useState<number>(0);
  const [pyStep, setPyStep] = useState<number>(0);
  const [lastNote, setLastNote] = useState<string | null>(null);

  const code = lang === "html" ? htmlCode : pyCode;
  const setCode = lang === "html" ? setHtmlCode : setPyCode;
  const step = lang === "html" ? htmlStep : pyStep;
  const setStep = lang === "html" ? setHtmlStep : setPyStep;
  const scaffold = lang === "html" ? HTML_SCAFFOLD : PY_SCAFFOLD;

  const captain = CHARACTERS["Captain Pixel"];
  const pythonOutput = useMemo(
    () => (lang === "python" ? runPython(pyCode) : ""),
    [lang, pyCode],
  );

  function askCaptain() {
    if (step >= scaffold.length) return;
    const next = scaffold[step];
    const trimmed = code.replace(/\s+$/, "");
    const newCode = trimmed.length === 0 ? next.line : `${trimmed}\n${next.line}`;
    setCode(newCode);
    setStep(step + 1);
    setLastNote(next.note);
  }

  function clearAll() {
    if (lang === "html") {
      setHtmlCode("");
      setHtmlStep(0);
    } else {
      setPyCode("");
      setPyStep(0);
    }
    setLastNote(null);
  }

  function resetTemplate() {
    if (lang === "html") {
      setHtmlCode(HTML_BLANK);
      setHtmlStep(0);
    } else {
      setPyCode(PY_BLANK);
      setPyStep(0);
    }
    setLastNote(null);
  }

  return (
    <section>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1f2937] to-[#193b92] text-white p-7 md:p-9 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 mb-2">
            Playground
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            A blank canvas. Build whatever.
          </h1>
          <p className="text-white/80 mt-2 max-w-xl text-sm md:text-base leading-relaxed">
            No briefs, no grading. Try things. Break things. When you get stuck,
            ask Captain Pixel for help and she'll walk you through it line by
            line.
          </p>
        </div>
      </div>

      {/* Controls row */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full">
          <button
            onClick={() => setLang("html")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
              lang === "html"
                ? "bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-[#0F172A]"
            }`}
          >
            HTML / CSS
          </button>
          <button
            onClick={() => setLang("python")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition ${
              lang === "python"
                ? "bg-white text-[#0F172A] shadow-[0_2px_8px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-[#0F172A]"
            }`}
          >
            Python
          </button>
        </div>

        <button
          onClick={resetTemplate}
          className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] px-3 py-2 rounded-full"
        >
          Load starter
        </button>
        <button
          onClick={clearAll}
          className="text-xs font-semibold text-slate-500 hover:text-[#0F172A] px-3 py-2 rounded-full"
        >
          Clear editor
        </button>

        <button
          onClick={askCaptain}
          disabled={step >= scaffold.length}
          className="ml-auto inline-flex items-center gap-2 bg-[#193b92] hover:bg-[#0f2861] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-full transition shadow-[0_4px_15px_rgba(25,59,146,0.25)]"
        >
          <img
            src={captain.avatar}
            alt=""
            aria-hidden
            className="w-6 h-6 rounded-full -ml-2 ring-2 ring-white object-cover"
          />
          {step >= scaffold.length
            ? "Captain has nothing else"
            : step === 0
            ? "Ask Captain for help"
            : `Next line (${step}/${scaffold.length})`}
        </button>
      </div>

      {/* Editor + preview */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
          <div className="px-4 py-2 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Code</span>
            <span className="text-slate-400">
              {lang === "python" ? "main.py" : "index.html"}
            </span>
          </div>
          <Editor
            height="440px"
            language={lang === "python" ? "python" : "html"}
            theme="vs"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              tabSize: lang === "python" ? 4 : 2,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col">
          <div className="px-4 py-2 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>{lang === "python" ? "Output" : "Preview"}</span>
            <span className="flex items-center gap-1.5 text-[#2C7A7B]">
              <span className="w-1.5 h-1.5 bg-[#2C7A7B] rounded-full" />
              Live
            </span>
          </div>
          {lang === "python" ? (
            <pre className="w-full h-[440px] p-4 text-sm font-mono text-[#0F172A] bg-[#0F172A]/[0.03] overflow-auto whitespace-pre-wrap">
              {pythonOutput}
            </pre>
          ) : (
            <iframe
              title="Playground preview"
              sandbox="allow-scripts"
              srcDoc={htmlCode}
              className="w-full h-[440px] bg-white"
            />
          )}
        </div>
      </div>

      {/* Captain's last note */}
      {lastNote && (
        <div className="mt-4 rounded-2xl border border-[#193b92]/20 bg-[#193b92]/[0.04] p-5">
          <div className="flex items-start gap-3">
            <img
              src={captain.avatar}
              alt="Captain Pixel"
              className="shrink-0 w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#193b92] mb-1">
                Captain Pixel · explains
              </p>
              <p className="text-sm leading-relaxed text-[#0F172A]">
                {lastNote}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
