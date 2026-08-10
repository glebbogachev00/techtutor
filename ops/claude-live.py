#!/usr/bin/env python3
"""
claude-live.py — local live monitor for Claude Code sessions.

Tails a Claude Code transcript JSONL file and streams parsed events to a
browser over SSE. Shows user prompts, assistant text, tool calls, tool
results, and a LIVE token counter (input / output / cache) per turn so you
can see token burn as it happens.

Zero dependencies — Python stdlib only.

Run:  python3 claude-live.py [--port 8799]
Open: http://127.0.0.1:8799
"""

import argparse
import json
import os
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote

HOME = Path.home()
PROJECTS_DIR = HOME / ".claude" / "projects"
BRIDGE_INDEX = HOME / ".hermes" / "skills" / "productivity" / "claude-code-bridge" / "index.json"

# Brand tokens (from SOUL.md)
ACCENT = "#193B92"
INK = "#0F172A"
BG = "#0a0a0c"
CARD = "#111317"


def load_sessions():
    """Build a list of sessions from the bridge index if present, else scan dirs."""
    sessions = []
    seen = set()
    if BRIDGE_INDEX.exists():
        try:
            data = json.loads(BRIDGE_INDEX.read_text())
            for s in data:
                proj = s.get("project", "")
                sid = s.get("session_id", "")
                if not sid:
                    continue
                # Reconstruct path: project "Documents/train" ->
                # ~/.claude/projects/-Users-glebbogachev-Documents-train/<sid>.jsonl
                encoded = "-Users-glebbogachev-" + proj.replace("/", "-")
                p = PROJECTS_DIR / encoded / f"{sid}.jsonl"
                if not p.exists():
                    continue
                key = str(p)
                if key in seen:
                    continue
                seen.add(key)
                sessions.append({
                    "path": key,
                    "project": proj,
                    "session_id": sid,
                    "mtime": s.get("mtime_str", ""),
                    "first_prompt": s.get("first_prompt", "")[:120],
                })
        except Exception:
            pass
    # Fallback / supplement: scan the directory tree directly
    if PROJECTS_DIR.exists():
        for jf in PROJECTS_DIR.rglob("*.jsonl"):
            key = str(jf)
            if key in seen:
                continue
            seen.add(key)
            proj = jf.parent.name.replace("-Users-glebbogachev-", "", 1).replace("-", "/")
            try:
                mtime = time.strftime("%Y-%m-%d %H:%M", time.localtime(jf.stat().st_mtime))
            except Exception:
                mtime = ""
            sessions.append({
                "path": key,
                "project": proj,
                "session_id": jf.stem,
                "mtime": mtime,
                "first_prompt": "",
            })
    sessions.sort(key=lambda x: x.get("mtime", ""), reverse=True)
    return sessions


def parse_line(line):
    """Parse one JSONL transcript line into normalized event(s). Returns list of events."""
    line = line.strip()
    if not line:
        return []
    try:
        obj = json.loads(line)
    except Exception:
        return []
    t = obj.get("type")
    events = []
    if t == "user":
        msg = obj.get("message", {})
        content = msg.get("content", [])
        if isinstance(content, str):
            content = [{"type": "text", "text": content}]
        for item in content:
            it = item.get("type")
            if it == "text":
                events.append({"kind": "user", "text": item.get("text", "")})
            elif it == "tool_result":
                c = item.get("content", "")
                if isinstance(c, list):
                    c = " ".join(x.get("text", "") for x in c if isinstance(x, dict))
                events.append({
                    "kind": "tool_result",
                    "text": str(c)[:800],
                    "is_error": item.get("is_error", False),
                })
    elif t == "assistant":
        msg = obj.get("message", {})
        content = msg.get("content", [])
        usage = obj.get("usage") or msg.get("usage", {})
        for item in content:
            it = item.get("type")
            if it == "text":
                events.append({"kind": "assistant", "text": item.get("text", "")})
            elif it == "thinking":
                events.append({"kind": "thinking", "text": item.get("thinking", "")})
            elif it == "tool_use":
                inp = item.get("input", {})
                label = item.get("name", "tool")
                detail = ""
                if isinstance(inp, dict):
                    if "command" in inp:
                        detail = inp["command"]
                    elif "file_path" in inp:
                        detail = inp["file_path"]
                        if "new_string" in inp:
                            detail += "\n+" + inp["new_string"][:400]
                        elif "content" in inp:
                            detail += "\n" + inp["content"][:400]
                    else:
                        detail = json.dumps(inp, ensure_ascii=False)[:400]
                events.append({"kind": "tool_use", "tool": label, "text": detail})
        if usage:
            events.append({
                "kind": "usage",
                "input": usage.get("input_tokens", 0),
                "output": usage.get("output_tokens", 0),
                "cache_read": usage.get("cache_read_input_tokens", 0),
                "cache_create": usage.get("cache_creation_input_tokens", 0),
            })
    elif t == "summary":
        txt = obj.get("summary", "")
        if txt:
            events.append({"kind": "summary", "text": txt})
    return events


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # quiet

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/" or parsed.path == "/index.html":
            self.serve_html()
        elif parsed.path == "/api/sessions":
            self.serve_sessions()
        elif parsed.path == "/api/tail":
            qs = parse_qs(parsed.query)
            path = qs.get("session", [None])[0]
            if path:
                self.serve_tail(unquote(path))
            else:
                self.send_error(400, "missing session")
        else:
            self.send_error(404)

    def serve_html(self):
        html = HTML_TEMPLATE
        body = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_sessions(self):
        data = json.dumps(load_sessions()).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def serve_tail(self, path):
        p = Path(path)
        if not p.exists():
            self.send_error(404, "session file not found")
            return
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Accel-Buffering", "no")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        # Send existing history (last 600 lines) first
        try:
            with open(p, "r", encoding="utf-8", errors="replace") as f:
                lines = f.readlines()
        except Exception:
            lines = []
        history = lines[-600:]
        for line in history:
            for ev in parse_line(line):
                self.send_event(ev)
        self.send_event({"kind": "meta", "status": "live"})

        # Tail new content
        try:
            with open(p, "r", encoding="utf-8", errors="replace") as f:
                f.seek(0, 2)  # end
                last_size = f.tell()
                while True:
                    f.seek(last_size)
                    new_data = f.read()
                    if new_data:
                        buf = ""
                        for ch in new_data:
                            buf += ch
                            if ch == "\n":
                                for ev in parse_line(buf):
                                    self.send_event(ev)
                                last_size = f.tell()
                                buf = ""
                        # keep partial line for next poll
                        if buf:
                            last_size = f.tell() - len(buf.encode("utf-8", "replace"))
                    else:
                        time.sleep(0.6)
        except (BrokenPipeError, ConnectionResetError):
            return

    def send_event(self, ev):
        try:
            payload = json.dumps(ev, ensure_ascii=False)
            self.wfile.write(f"data: {payload}\n\n".encode("utf-8"))
            self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            raise


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Claude Code — Live Monitor</title>
<style>
  :root { --accent:#193B92; --ink:#0F172A; --bg:#0a0a0c; --card:#111317; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:#e6e8ec;
         font-family:"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace;
         font-size:13px; line-height:1.5; }
  header { position:sticky; top:0; z-index:10; background:var(--bg);
           border-bottom:1px solid #1c1f26; padding:10px 16px;
           display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  header h1 { font-size:14px; margin:0; letter-spacing:.5px; color:#fff; font-weight:600; }
  select { background:var(--card); color:#e6e8ec; border:1px solid #2a2e38;
           padding:7px 10px; border-radius:6px; font-family:inherit; font-size:12px;
           max-width:420px; }
  .stats { margin-left:auto; display:flex; gap:14px; font-size:12px; }
  .stat { text-align:right; }
  .stat b { display:block; font-size:15px; color:#fff; font-weight:600; }
  .stat span { color:#7c828c; font-size:10px; text-transform:uppercase; letter-spacing:.5px; }
  .stat.acc b { color:var(--accent); }
  #feed { padding:14px 16px 80px; max-width:980px; margin:0 auto; }
  .ev { border-left:2px solid #1c1f26; padding:8px 12px; margin:0 0 10px 0;
        background:var(--card); border-radius:0 6px 6px 0; }
  .ev.user { border-left-color:#3b82f6; }
  .ev.assistant { border-left-color:var(--accent); }
  .ev.tool_use { border-left-color:#f59e0b; background:#16130b; }
  .ev.tool_result { border-left-color:#2a2e38; color:#9aa0aa; font-size:12px; }
  .ev.thinking { border-left-color:#4b5563; color:#6b7280; font-size:12px; font-style:italic; }
  .ev.summary { border-left-color:#8b5cf6; background:#140f1c; }
  .ev.usage { border-left-color:#22c55e; background:#0c150f; font-size:11px; color:#86efac; }
  .ev.meta { border-left-color:transparent; background:transparent; color:#7c828c; font-size:11px; text-align:center; }
  .label { font-size:10px; text-transform:uppercase; letter-spacing:.5px;
           color:#7c828c; margin-bottom:3px; }
  .ev pre { white-space:pre-wrap; word-break:break-word; margin:4px 0 0;
            font-family:inherit; font-size:12px; }
  .tool { color:#f59e0b; font-weight:600; }
  .err { color:#ef4444; }
  code { background:#0a0a0c; padding:1px 4px; border-radius:3px; }
  .empty { color:#7c828c; text-align:center; margin-top:40px; }
</style>
</head>
<body>
<header>
  <h1>● CLAUDE CODE LIVE</h1>
  <select id="sess"><option>loading sessions…</option></select>
  <div class="stats">
    <div class="stat acc"><b id="s-in">0</b><span>in tok</span></div>
    <div class="stat"><b id="s-out">0</b><span>out tok</span></div>
    <div class="stat"><b id="s-cache">0</b><span>cache rd</span></div>
  </div>
</header>
<div id="feed"><div class="empty">Select a session to begin monitoring.</div></div>

<script>
const fmt = n => n.toLocaleString();
let es = null, tot = {in:0,out:0,cache:0};

function setStat() {
  document.getElementById('s-in').textContent = fmt(tot.in);
  document.getElementById('s-out').textContent = fmt(tot.out);
  document.getElementById('s-cache').textContent = fmt(tot.cache);
}

function esc(s){ return (s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

function addEv(ev) {
  const feed = document.getElementById('feed');
  const empty = feed.querySelector('.empty');
  if (empty) empty.remove();
  const div = document.createElement('div');
  div.className = 'ev ' + ev.kind;
  if (ev.kind === 'usage') {
    tot.in += ev.input||0; tot.out += ev.output||0; tot.cache += ev.cache_read||0;
    setStat();
    div.innerHTML = `<div class="label">tokens this turn</div>` +
      `<div>in ${fmt(ev.input)} · out ${fmt(ev.output)} · cache-read ${fmt(ev.cache_read)} · cache-new ${fmt(ev.cache_create)}</div>`;
  } else if (ev.kind === 'tool_use') {
    div.innerHTML = `<div class="label">tool · <span class="tool">${esc(ev.tool)}</span></div>` +
      `<pre>${esc(ev.text)}</pre>`;
  } else if (ev.kind === 'tool_result') {
    div.innerHTML = `<div class="label">result${ev.is_error?' · <span class="err">error</span>':''}</div><pre>${esc(ev.text)}</pre>`;
  } else if (ev.kind === 'thinking') {
    div.innerHTML = `<div class="label">thinking</div><pre>${esc(ev.text).slice(0,600)}</pre>`;
  } else if (ev.kind === 'summary') {
    div.innerHTML = `<div class="label">summary</div><pre>${esc(ev.text)}</pre>`;
  } else if (ev.kind === 'meta') {
    div.innerHTML = `<div>— ${esc(ev.status)} —</div>`;
  } else {
    const who = ev.kind === 'user' ? 'you' : (ev.kind === 'assistant' ? 'claude' : ev.kind);
    div.innerHTML = `<div class="label">${who}</div><pre>${esc(ev.text)}</pre>`;
  }
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function connect(path) {
  if (es) es.close();
  tot = {in:0,out:0,cache:0}; setStat();
  document.getElementById('feed').innerHTML = '';
  es = new EventSource('/api/tail?session=' + encodeURIComponent(path));
  es.onmessage = e => { try { addEv(JSON.parse(e.data)); } catch(_) {} };
  es.onerror = () => { /* browser auto-reconnects */ };
}

function loadSessions() {
  fetch('/api/sessions').then(r=>r.json()).then(list=>{
    const sel = document.getElementById('sess');
    sel.innerHTML = '';
    list.forEach(s=>{
      const o = document.createElement('option');
      o.value = s.path;
      const fp = s.first_prompt ? ' — ' + s.first_prompt.slice(0,60) : '';
      o.textContent = `${s.project} · ${s.mtime}${fp}`;
      sel.appendChild(o);
    });
    if (list.length) connect(list[0].path);
    sel.onchange = () => connect(sel.value);
  });
}
loadSessions();
setInterval(loadSessions, 15000); // refresh session list periodically
</script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8799)
    ap.add_argument("--host", default="127.0.0.1")
    args = ap.parse_args()
    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Claude Code Live Monitor → http://{args.host}:{args.port}")
    print(f"Watching: {PROJECTS_DIR}")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        srv.shutdown()


if __name__ == "__main__":
    main()
