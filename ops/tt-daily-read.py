#!/usr/bin/env python3
"""Single-file local feed reader. Zero dependencies. Python 3.9+."""
import json, os, re, urllib.parse, urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Dict, List

HERE = Path(__file__).parent
FEEDS = HERE / "feeds.json"
PORT = 3100
CACHE_TTL = 20 * 60  # 20 minutes

# ---------------------------------------------------------------
# minimal RSS parser — handles title / link / pubDate / item
# ---------------------------------------------------------------
class RSSParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
        self._item = None
        self._tag_stack = []
        self._capture = None
        self._in_channel = False

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        cls = attrs_d.get("class", "")
        if tag == "item" or (tag in ("entry", "entry") ):
            self._item = {}
            self._in_channel = True
        if self._item is not None and tag in ("title", "link", "pubdate", " published"):
            self._capture = tag
        if tag == "link" and self._item is not None and attrs_d.get("href"):
            self._item["link"] = attrs_d["href"]

    def handle_endtag(self, tag):
        if self._item is not None and tag in ("item", "entry"):
            if self._item.get("title") and self._item.get("link"):
                self.items.append(self._item)
            self._item = None
            self._capture = None
        self._tag_stack = [t for t in self._tag_stack if t != tag]

    def handle_data(self, data):
        if self._item is None or self._capture is None:
            return
        text = data.strip()
        if not text:
            return
        k = {
            "title": "title",
            "link": "link",
            "pubdate": "pubDate",
            "published": "pubDate",
        }.get(self._capture)
        if k and k not in self._item:
            self._item[k] = text


def parse_items(xml: str):
    p = RSSParser()
    p.feed(xml)
    return p.items


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "tt-reader/1.0"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace")


def parse_pubdate(s: str):
    for fmt in (
        "%a, %d %b %Y %H:%M:%S %z",
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
    ):
        try:
            return datetime.strptime(s, fmt)
        except Exception:
            pass
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------
# feed fetching with simple file cache
# ---------------------------------------------------------------
CACHE_DIR = HERE / ".reader-cache"
CACHE_DIR.mkdir(exist_ok=True)


def cache_path(url: str) -> Path:
    return CACHE_DIR / (re.sub(r"[^a-zA-Z0-9_-]", "_", url) + ".json")


def load_feeds():
    if not FEEDS.exists():
        return []
    return json.loads(FEEDS.read_text())


def save_feeds(feeds):
    FEEDS.write_text(json.dumps(feeds, ensure_ascii=False, indent=2))


def get_items(feed):
    url = feed["url"]
    cp = cache_path(url)
    use_cache = cp.exists() and (datetime.now().timestamp() - cp.stat().st_mtime < CACHE_TTL)
    if use_cache:
        data = json.loads(cp.read_text())
        return data.get("items", [])
    try:
        xml = fetch(url)
        items = parse_items(xml)
        cp.write_text(json.dumps({"fetched": datetime.now(timezone.utc).isoformat(), "items": items}))
        return items
    except Exception as e:
        return [{"title": f"fetch error: {e}", "link": "#", "pubDate": ""}]


def merged(feeds, channel_filter=None):
    out = []
    seen = set()
    for f in feeds:
        if channel_filter and f.get("channel") != channel_filter:
            continue
        for it in get_items(f):
            key = (it.get("title", ""), it.get("link", ""))
            if key in seen:
                continue
            seen.add(key)
            it["source"] = f.get("name", "")
            out.append(it)
    out.sort(key=lambda x: parse_pubdate(x.get("pubDate", "")), reverse=True)
    return out


# ---------------------------------------------------------------
# HTTP — one file, zero deps
# ---------------------------------------------------------------
HTML_TMPL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>tt-daily-read</title>
<style>
:root{--bg:#0b0d12;--ink:#e6e8ee;--muted:#8a93a6;--line:#1e232d;--navy:#193B92;--card:#12141a;--accent:#FFA500;}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--ink);font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;line-height:1.55}
header{position:sticky;top:0;z-index:10;background:rgba(11,13,18,.88);backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid var(--line);padding:14px 24px;display:flex;align-items:center;gap:12px}
.brand{font-weight:800;letter-spacing:-.3px;font-size:17px;color:var(--navy)}
.sub{color:var(--muted);font-size:12px;margin-left:4px}
.chips{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap}
.chip{padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:var(--card);font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;text-decoration:none}
.chip.on{background:var(--navy);color:#fff;border-color:var(--navy)}
main{max-width:980px;margin:22px auto;padding:0 22px 80px}
.item{border:1px solid var(--line);border-radius:14px;background:var(--card);padding:14px 16px;margin-bottom:12px;box-shadow:0 1px 2px rgba(0,0,0,.24)}
.item:hover{border-color:#2c3b7a;box-shadow:0 6px 20px -10px rgba(25,59,146,.22)}
.row{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.src{font-size:11px;font-weight:700;color:var(--navy);text-transform:uppercase;letter-spacing:.6px}
.when{font-size:11.5px;color:var(--muted)}
.title{font-size:15.5px;font-weight:700;margin-top:6px;letter-spacing:-.2px}
a{color:var(--ink);text-decoration:none}a:hover{color:var(--navy)}
.empty{color:var(--muted);font-size:14px;padding:28px 0;text-align:center}
::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--line);border-radius:999px}
</style>
</head>
<body>
<header>
  <div class="brand">tt-daily-read</div>
  <div class="sub">Tech / AI / Builder</div>
  <div class="chips" id="chips">{chips}</div>
</header>
<main>
  <div id="feed">{body}</div>
</main>
<script>
document.getElementById('chips').addEventListener('click',function(e){var t=e.target;if(t.classList.contains('chip')){document.querySelectorAll('.chip').forEach(function(x){x.classList.remove('on');});t.classList.add('on');}});
</script>
</body>
</html>
"""


def _esc(s: str) -> str:
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def build_html(feeds, items):
    channels = []
    seen = set()
    for f in feeds:
        c = f.get("channel", "")
        if c not in seen:
            seen.add(c)
            channels.append(c)
    chips = "".join(
        f'<a class="chip {"on" if i==0 else ""}" href="?channel={_esc(c)}">{_esc(c)}</a>'
        for i, c in enumerate(channels)
    )
    body_items = []
    for it in items[:120]:
        body_items.append(
            f'<div class="item">'
            f'<div class="row"><span class="src">{_esc(it.get("source",""))}</span>'
            f'<span class="when">{_esc(it.get("pubDate",""))}</span></div>'
            f'<div class="title"><a href="{_esc(it.get("link","#"))}" target="_blank" rel="noopener">{_esc(it.get("title",""))}</a></div>'
            f'</div>'
        )
    body = "".join(body_items) if body_items else '<div class="empty">Nothing yet.</div>'
    return HTML_TMPL.replace("{chips}", chips).replace("{body}", body)


class Handler(BaseHTTPRequestHandler):
    feeds = staticmethod(load_feeds)

    def do_GET(self):
        p = urllib.parse.urlparse(self.path)
        if p.path not in ("/", "/index"):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"not found")
            return
        feeds = load_feeds()
        qs = urllib.parse.parse_qs(p.query)
        channel_filter = (qs.get("channel") or [None])[0]
        items = merged(feeds, channel_filter=channel_filter)
        body = build_html(feeds, items).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_HEAD(self):
        p = urllib.parse.urlparse(self.path)
        if p.path not in ("/", "/index"):
            self.send_response(404)
            self.end_headers()
            return
        feeds = load_feeds()
        items = merged(feeds)
        body = build_html(feeds, items).encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()


def serve_forever():
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

    class S(ThreadingHTTPServer):
        def handle_error(self, request, client_address):
            import traceback
            traceback.print_exc()

    srv = S(("127.0.0.1", PORT), Handler)
    print(f"tt-daily-read -> http://127.0.0.1:{PORT}")
    print(f"Feeds file : {FEEDS}")
    print("Ctrl+C to stop.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nbye")
        srv.shutdown()


if __name__ == "__main__":
    if not FEEDS.exists():
        print(f"Create {FEEDS} first: JSON array of feed objects.")
        print("Example: [{\"name\":\"Fireship\",\"channel\":\"YT\",\"url\":\"https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA\"}]")
        raise SystemExit(0)
    serve_forever()
