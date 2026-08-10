#!/usr/bin/env python3
"""
TechTutor Content Console — standalone local review/post tool.
Zero third-party dependencies (Python stdlib only). No pip install, no build step.
Python 3.9+.

Run:  python3 content-console.py
Open: http://127.0.0.1:8778

Flow:  Pick a content type -> TALK about what happened (the console asks short concrete
       questions, you answer) -> it writes the post plus a tailored image prompt ->
       lint, revise, attach a visual -> post, only after Gleb's explicit click.

Two AI endpoints, deliberately separate, because mixing them was the original bug:
  /interview  only ever asks questions. It cannot write a post.
  /draft      only ever writes a post. It cannot ask questions.

Secrets are read from ENV or a local .env in this folder (gitignored, never committed):
  FB_PAGE_TOKEN
  IG_USER_TOKEN, IG_USER_ID
  REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD, REDDIT_SUB
Missing tokens never crash the server — the UI shows status dots + setup hints instead.
"""
import json, os, io, base64, shutil, subprocess, re, uuid, tempfile, importlib.util
import urllib.parse, urllib.request, urllib.error
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).parent
UPLOADS = HERE / "uploads"
UPLOADS.mkdir(exist_ok=True)
DRAFTS = HERE / "drafts"
DRAFTS.mkdir(exist_ok=True)
PORT = 8778
USER_AGENT = "techtutor-content-console/2.0 (local)"

# Map file suffix -> mime type. Keeps upload serving and Graph uploads DRY.
MIME = {
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".gif": "image/gif", ".webp": "image/webp",
    ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm",
}
def mime_for(path):
    return MIME.get(Path(path).suffix.lower(), "application/octet-stream")
def is_video(path):
    return mime_for(path).startswith("video/")


# ---- minimal multipart/form-data parser (stdlib-only) ----------------------
# Python 3.13+ dropped the `cgi` module, so we parse the one file field we need
# by hand. Returns (filename, bytes) for the first part named `field`, else None.
def parse_multipart_file(raw, content_type, field="file"):
    if "boundary=" not in content_type:
        return None
    boundary = content_type.split("boundary=", 1)[1].strip().strip('"')
    sep = b"--" + boundary.encode()
    for part in raw.split(sep):
        if not part or part in (b"--\r\n", b"--"):
            continue
        head, _, body = part.partition(b"\r\n\r\n")
        head_text = head.decode("utf-8", "replace")
        if f'name="{field}"' not in head_text:
            continue
        # strip the trailing CRLF that precedes the next boundary
        body = body[:-2] if body.endswith(b"\r\n") else body
        filename = ""
        if "filename=" in head_text:
            filename = head_text.split("filename=", 1)[1].split('"')[1]
        return (filename, body)
    return None


# ---- load .env (local only, gitignored) ------------------------------------
def load_env():
    envf = HERE / ".env"
    if not envf.exists():
        return
    for line in envf.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
load_env()


# ---- tiny HTTP helper (multipart or urlencoded or raw) ----------------------
def http_request(url, data=None, files=None, headers=None, auth=None):
    """
    POST helper.
      data:  dict of form fields
      files: {field: (filename, bytes, ctype)} -> triggers multipart
      auth:  (user, pass) -> HTTP Basic
    Returns (ok: bool, parsed_json_or_error: dict).
    """
    hdrs = {"User-Agent": USER_AGENT}
    if headers:
        hdrs.update(headers)
    if auth:
        token = base64.b64encode(f"{auth[0]}:{auth[1]}".encode()).decode()
        hdrs["Authorization"] = "Basic " + token

    if files:
        boundary = "----ttconsole" + uuid.uuid4().hex
        body = io.BytesIO()
        for k, v in (data or {}).items():
            body.write(f"--{boundary}\r\n".encode())
            body.write(f'Content-Disposition: form-data; name="{k}"\r\n\r\n'.encode())
            body.write(str(v).encode() + b"\r\n")
        for fld, (fname, fbytes, ctype) in files.items():
            body.write(f"--{boundary}\r\n".encode())
            body.write(f'Content-Disposition: form-data; name="{fld}"; filename="{fname}"\r\n'.encode())
            body.write(f"Content-Type: {ctype}\r\n\r\n".encode())
            body.write(fbytes + b"\r\n")
        body.write(f"--{boundary}--\r\n".encode())
        hdrs["Content-Type"] = f"multipart/form-data; boundary={boundary}"
        payload = body.getvalue()
    else:
        payload = urllib.parse.urlencode(data or {}).encode()
        hdrs.setdefault("Content-Type", "application/x-www-form-urlencoded")

    req = urllib.request.Request(url, data=payload, headers=hdrs)
    try:
        resp = urllib.request.urlopen(req, timeout=90)
        raw = resp.read().decode()
        try:
            return (True, json.loads(raw))
        except json.JSONDecodeError:
            return (True, {"raw": raw})
    except urllib.error.HTTPError as e:
        try:
            return (False, json.loads(e.read().decode()))
        except Exception:
            return (False, {"error": f"HTTP {e.code}"})
    except Exception as e:
        return (False, {"error": str(e)})


def http_get_json(url, timeout=20):
    """GET + parse JSON. Returns None on any failure — callers degrade gracefully."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except Exception:
        return None


# ---- platform posting -------------------------------------------------------
GRAPH = "https://graph.facebook.com/v19.0"

def env(*names):
    """Return values for env names; None for any that are missing."""
    return [os.environ.get(n) for n in names]


def post_facebook(message, fpath):
    tok, = env("FB_PAGE_TOKEN")
    if not tok:
        return {"ok": False, "error": "FB_PAGE_TOKEN missing — see setup hints."}
    if fpath and fpath.exists() and not is_video(fpath):
        # Photo post: /me/photos with binary "source".
        url = f"{GRAPH}/me/photos?access_token={tok}"
        ok, resp = http_request(url, data={"caption": message},
                                files={"source": (fpath.name, fpath.read_bytes(), mime_for(fpath))})
    else:
        # Text-only (video-on-Page needs a different endpoint; keep it simple here).
        url = f"{GRAPH}/me/feed?access_token={tok}"
        ok, resp = http_request(url, data={"message": message})
    return {"ok": ok, "response": resp}


def post_instagram(message, fpath):
    tok, uid = env("IG_USER_TOKEN", "IG_USER_ID")
    if not (tok and uid):
        return {"ok": False, "error": "IG_USER_TOKEN / IG_USER_ID missing — see setup hints."}
    if not (fpath and fpath.exists()):
        return {"ok": False, "error": "Instagram needs an image or a project video attached."}
    media_type = "VIDEO" if is_video(fpath) else "IMAGE"
    # 1) create media container with the binary attached as "source".
    ok, c = http_request(
        f"{GRAPH}/{uid}/media?access_token={tok}",
        data={"caption": message, "media_type": media_type},
        files={"source": (fpath.name, fpath.read_bytes(), mime_for(fpath))})
    if not ok or "id" not in c:
        return {"ok": False, "error": "media container failed", "response": c}
    # 2) publish the container.
    ok2, pub = http_request(
        f"{GRAPH}/{uid}/media_publish?access_token={tok}",
        data={"creation_id": c["id"]})
    return {"ok": ok2, "response": pub}


def post_reddit(message, title, subreddit):
    """Real Reddit script-app OAuth. Self (text) post only — see reddit_note."""
    cid, secret, user, pw = env(
        "REDDIT_CLIENT_ID", "REDDIT_CLIENT_SECRET", "REDDIT_USERNAME", "REDDIT_PASSWORD")
    sub = subreddit or os.environ.get("REDDIT_SUB")
    missing = [n for n, v in [
        ("REDDIT_CLIENT_ID", cid), ("REDDIT_CLIENT_SECRET", secret),
        ("REDDIT_USERNAME", user), ("REDDIT_PASSWORD", pw)] if not v]
    if missing:
        return {"ok": False, "error": "Reddit setup incomplete — missing " + ", ".join(missing)}
    if not sub:
        return {"ok": False, "error": "No subreddit — set REDDIT_SUB or pass one in the UI."}

    # 1) OAuth: exchange username/password for a bearer token (script app grant).
    ok, tok = http_request(
        "https://www.reddit.com/api/v1/access_token",
        data={"grant_type": "password", "username": user, "password": pw},
        auth=(cid, secret))
    if not ok or "access_token" not in tok:
        return {"ok": False, "error": "Reddit OAuth failed", "response": tok}

    # 2) submit a self (text) post.
    if not title:
        title = (message.strip().split("\n", 1)[0][:120]) or "TechTutor"
    ok2, resp = http_request(
        "https://oauth.reddit.com/api/submit",
        data={"sr": sub, "kind": "self", "title": title, "text": message, "api_type": "json"},
        headers={"Authorization": "Bearer " + tok["access_token"]})
    # Reddit wraps success/errors inside json.errors even on HTTP 200.
    errs = (resp or {}).get("json", {}).get("errors") if isinstance(resp, dict) else None
    if errs:
        return {"ok": False, "error": "; ".join(" ".join(map(str, e)) for e in errs), "response": resp}
    return {"ok": ok2, "response": resp}


# ---- voice lint (the real thing, imported from voice-lint.py) ---------------
# The filename has a dash, so a normal import won't work. README always claimed
# there was a lint pass; this is where it actually gets wired in.
def _load_linter():
    spec = importlib.util.spec_from_file_location("voice_lint", HERE / "voice-lint.py")
    if not spec or not spec.loader:
        return None
    mod = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(mod)
        return mod.lint
    except Exception:
        return None
LINT = _load_linter()

def lint_post(text, label=""):
    """Run voice-lint over one language half. Returns [{'label','hit'}]."""
    if not (LINT and text and text.strip()):
        return []
    try:
        return [{"label": label, "hit": h} for h in LINT(text)]
    except Exception:
        return []


# ---- the claude CLI runner ---------------------------------------------------
# No API key: this rides Gleb's existing Claude Code subscription.
CLAUDE_BIN = shutil.which("claude")

# The writer is the quality-critical call, so it defaults to the strongest model.
# The interviewer just asks short questions, so Sonnet is the right tier there.
DRAFT_MODEL = os.environ.get("CONSOLE_DRAFT_MODEL", "opus")
INTERVIEW_MODEL = os.environ.get("CONSOLE_INTERVIEW_MODEL", "sonnet")

# Run claude in a neutral empty directory so it never picks up the techtutor
# repo's AGENTS.md / CLAUDE.md and start behaving like a coding agent.
SANDBOX = tempfile.mkdtemp(prefix="tt-console-")

# Tools the writer has no business using. Every tool left enabled ships its JSON
# schema in the prompt, so disabling them is a direct token saving. Measured on
# 2026-07-30: this list costs 9,791 cached tokens per call versus 13,407 for a
# shorter list, a 27% cut. Note that `--allowed-tools ''` is NOT the same thing and
# measured worse (20,360) — it does not restrict anything.
NO_TOOLS = ("Bash,Read,Write,Edit,MultiEdit,NotebookEdit,Glob,Grep,WebFetch,WebSearch,"
            "Task,TodoWrite,BashOutput,KillShell,SlashCommand,Skill,ExitPlanMode,"
            "AskUserQuestion,Artifact,Monitor,ListMcpResources,ReadMcpResource")


def run_claude(system, user, model, timeout=240):
    """Call the claude CLI with a replaced system prompt. Returns (ok, text|error)."""
    if not CLAUDE_BIN:
        return (False, "claude CLI not found on PATH — install Claude Code to use AI drafting.")
    cmd = [CLAUDE_BIN, "-p",
           "--system-prompt", system,
           "--model", model,
           "--strict-mcp-config",
           "--disallowed-tools", NO_TOOLS,
           "--output-format", "json"]
    try:
        proc = subprocess.run(cmd, input=user, capture_output=True, text=True,
                              timeout=timeout, cwd=SANDBOX)
    except subprocess.TimeoutExpired:
        return (False, f"claude timed out after {timeout}s.")
    except Exception as e:
        return (False, str(e))
    if proc.returncode != 0:
        return (False, (proc.stderr or "claude failed").strip()[:400])
    try:
        env_out = json.loads(proc.stdout)
        if env_out.get("is_error"):
            return (False, str(env_out.get("result") or "claude reported an error")[:400])
        return (True, (env_out.get("result") or "").strip())
    except json.JSONDecodeError:
        # Shouldn't happen with --output-format json, but never crash the console.
        return (True, proc.stdout.strip())


_FENCE = re.compile(r"^```[a-zA-Z]*\s*|\s*```$")

def claude_json(system, user, model, timeout=240):
    """Same as run_claude but parses a JSON object out of the reply."""
    ok, text = run_claude(system, user, model, timeout)
    if not ok:
        return (False, {"error": text})
    body = _FENCE.sub("", text.strip()).strip()
    start, end = body.find("{"), body.rfind("}")
    if start >= 0 and end > start:
        body = body[start:end + 1]
    try:
        parsed = json.loads(body)
        if not isinstance(parsed, dict):
            raise ValueError("not an object")
        return (True, parsed)
    except Exception:
        return (False, {"error": "AI reply wasn't valid JSON", "raw": text[:1200]})


# ---- voice context (loaded fresh on every call, so editing the md files
#      steers the writer immediately with no restart) --------------------------
def read_doc(name, limit=14000):
    f = HERE / name
    return f.read_text().strip()[:limit] if f.exists() else ""


# ---- the interviewer --------------------------------------------------------
INTERVIEWER = """You are interviewing Gleb, who runs TechTutor, a small coding school for
7 to 17 year olds in Vietnam. He is about to post about something that actually happened.
Your one job is to pull the specific details out of him so the post can be concrete.

YOU DO NOT WRITE THE POST. Ever. Not a line of it, not a sample, not a "something like
this". Another system writes it. If you draft copy you have failed the task.

How to ask:
- At most 3 questions per turn. Two is usually better. One is fine.
- Each question is one line and answerable in a few words.
- Ask only for things a camera or a microphone would have caught: who was there, their
  first name, their age, what was on the screen, what broke, what someone said out loud,
  who laughed, how long it took, what they tried first, what happened at the end.
- Ask for exact words whenever a person spoke. Exact words are the most valuable thing
  you can get. "What did she say, in her words?" beats any other question.
- If he mentions a thing that was built, ask what it does and who it was for.

CHASE WHAT HE THINKS IS BORING. This is the highest-value move you have.

John Carlton's most copied ad came from a client mentioning, almost as an aside, that he had
worked out a new golf swing after watching a one-legged man play. To the client that was old
news, barely worth saying. It took nearly an hour to get it out of him, and it was worth more
than everything he thought was important.

Gleb does this constantly. He will say something extraordinary in a completely flat voice,
because to him it is just Tuesday: a teacher deliberately setting work too hard, a kid who
spent an hour making a cat say no, a student he turned away. When he drops something like
that without emphasis, STOP and dig into it. Ask why, ask who decided, ask what happened
next. Do not move on to the tidy chronological follow-up.

Signals that you have hit one: it sounds slightly wrong or backwards; it contradicts what a
parent would assume; he says it in half a sentence and moves on; you find yourself thinking
"wait, why would you do that?" Chase all of those.

Never ask:
- "What's the key message?" "What's the takeaway?" "Who's the target audience?"
  "What tone do you want?" "What's the goal of this post?" Those questions produce
  marketing copy. They are banned.
- Anything he already answered. Anything he clearly does not know or does not remember.
- More than one follow-up on a detail he has skipped twice. Let it go.

When to stop:
- You need ONE moment with enough texture to picture it. That is all. Usually that means
  a person, a thing that happened, and one or two exact details.
- The moment you have that, set "ready" to true and stop asking. Do not gold-plate.
  Over-interviewing is worse than a slightly thin post. He is busy.
- If his first message already contains a full story, set "ready" to true immediately
  and return an empty questions list.

Output STRICT JSON, nothing else, no code fence:
{
  "ready": true or false,
  "have": ["short phrase per concrete detail you now have"],
  "missing": ["short phrase per detail still worth getting, empty if ready"],
  "questions": ["your questions this turn, empty list if ready"],
  "note": "one short plain sentence to Gleb. No praise, no enthusiasm, no exclamation marks."
}"""


# ---- the writer -------------------------------------------------------------
# This is where the anti-slop work happens. The rules are phrased as bans on
# specific moves rather than vague style advice, because vague advice is what
# produces slop in the first place.
FIND_THE_STORY = """FIND THE INTERESTING THING, THEN LEAD WITH IT.

Do this before you write a single line. Decide what the one most interesting thing in the
raw material is. Not the first thing that happened — the thing that would make a parent stop
scrolling and think "I didn't know that."

It is usually one of these:
- a detail that contradicts what people assume about kids, games, or coding
- a decision someone made on purpose that sounds wrong until it gets explained
- the exact words a child said
- a number that is surprising

Then build the whole post on that one thing. Everything else is either setup for it, or it
gets cut.

CHRONOLOGY IS NOT STRUCTURE. Do not narrate events in the order you were told them just
because that is the order you were told them. A post that opens "Hung is twelve. He plays a
lot of video games." and then walks forward through the week has no shape — it is a report.
Lead with the interesting thing, or with the moment immediately before it.

CONNECT THE THREADS YOU OPEN. If you mention that a kid plays a lot of video games, that
fact has to pay off later or come out. An opening detail that never returns is a wasted
line, and it is the difference between a story and a summary.

If the raw material genuinely contains nothing surprising, say so in the "thin" field. Do
not manufacture interest, and do not dress a flat sequence of events up as a story."""


HUMAN_TEXTURE = """HOW IT HAS TO READ. This is the rule that matters most, and it overrides the
rhythm advice anywhere they conflict.

There is a house style that machines write in now, and it is no longer the old flowery slop.
It is the opposite: clean, punchy, one short declarative sentence per line, a blank line after
every beat, every paragraph landing a neat little closer. It looks disciplined. It is
instantly recognisable, and it is what you produce by default. Do not produce it.

**Break the metronome.** Vary paragraph LENGTH, not just sentence length. Some paragraphs run
four or five sentences together with no line break, because that is how someone talks when they
are in the middle of a thought. Then one paragraph is three words. If every paragraph in your
draft is one to three short sentences, you have written the machine style and you must go back
and fix it.

**Write longer sentences.** This is the specific fix, so do not skim it. The staccato style —
short sentence, full stop, short sentence, full stop — is the thing that gives you away
fastest, and it is what you will produce unless you actively push against it. People who write
well use long sentences constantly; what makes them readable is not brevity but organisation,
the commas and clauses arranged so the reader never loses the thread. Aim for most sentences
in the twenty-to-forty word range, built with subordinate clauses, and let the short ones land
only where you actually want the emphasis. If you read your draft back and it is mostly
sentences under twelve words, you have failed this rule regardless of how clean it looks.

**Hard targets, because the softer version of this instruction has not worked.** Before you
output, count. At least HALF your paragraphs must contain three or more sentences. Your average
sentence must be over eighteen words. No more than a third of your paragraphs may be a single
sentence standing alone. A post of eleven paragraphs where nine of them are one or two short
sentences is the failure mode, and it is what you produce when you are not counting.

Joining is how you fix it. Two thoughts that are actually connected belong in one sentence with
a comma or a "because" or a "which", not in two sentences with a blank line between them.

**Not everything can be load-bearing.** This is the biggest tell of all. Perfect economy, where
every sentence advances the argument, is inhuman. Real writing carries ballast: an aside that
goes nowhere, a detail nobody needed, a small irritation, a qualifier, a repeated word, a
half-thought. Put some in. Not decoration — the ordinary residue of a person talking.

**Banned shapes**, because they are the fingerprint now:
- Balanced antithesis. "The difficulty keeps climbing, so he keeps going. Let it flatten and he
  sets it down." "Pitched to hold him, not to look like studying." "X, not Y." Any sentence
  where the two halves mirror each other. This is the same move as "not just X but Y" wearing
  different clothes.
- The aphoristic paragraph-closer. A tidy summarising clause at the end of a paragraph, over
  and over. One in a whole post is fine. Four is a machine.
- Three consecutive sentence fragments used for emphasis.

**Sound like speech.** Use contractions. Start sentences with And, But, So, Anyway. Let a
sentence be genuinely incomplete rather than stylishly short. Say "kind of" and "pretty much"
where he would.

**Gleb is a person, not a narrator.** First person. He has opinions and he gets mildly annoyed.
"I thought that was a bit much, honestly" is worth more than any polished observation. If the
whole post is a neutral "we", it is a brochure.

The test: read it aloud. If it sounds like a good writer being economical, it is wrong. It
should sound like a smart person telling you something in a hurry, who has not edited
themselves much."""


STORY_STRATEGY = """WHAT THE STORY IS ACTUALLY DOING. Decide this before you write.

A story can do three different jobs in a post, and they are not interchangeable. Most bad
marketing writing happens because someone told a story that did job two while believing it was
doing job three.

**Job A — demonstrate storytelling skill.** Tell a beautiful story, then say "this is how well
I write, hire me." THIS IS NOT AVAILABLE TO US. It only works when the thing being sold IS
storytelling. TechTutor sells classes for children. If you write a lovely story and expect it
to sell a class on its own merit, the post will fail. Never reach for this.

**Job B — entertain, engage and bond.** The story does no selling at all. Its purpose is that
a parent enjoys reading it, remembers us warmly, and trusts us later. The story may resolve.
It may end satisfied. This is the correct job for the laugh, proof, curious and teach jobs, and
it is most of what we post. Do not bolt a pitch onto it. If there is an ask, it is small and
about engagement, not enrolment.

**Job C — sales inception.** This is the only way a story genuinely sells, and it is the
correct job when the brief says "invite", or for any promotional type. It works like this:

  1. Name the benefit of ours you are selling on.
  2. Work out what a parent would have to BELIEVE in order to want that benefit.
  3. Tell the story whose implicit moral installs exactly that belief.

Worked example. Benefit: work pitched a step above the child's level keeps them engaged.
Belief required: "my son is not lazy or addicted, he is under-stimulated, and the right
difficulty would change that." Story that installs it: the boy brought in to be taken off
video games, whose teacher then deliberately gave him work he could not finish.

THE MORAL IS ENGINEERED, NEVER STATED. This is the exact seam where two of your rules meet.
Anti-slop rule 5 bans writing a moral, a lesson, or a takeaway paragraph — that ban stands
absolutely. What Job C requires is that you CHOOSE and SHAPE the story so a parent draws the
belief themselves. The reader supplies the moral. You never write it down. A stated moral kills
the effect it was trying to produce.

Story genres that carry a usable moral: the transformation story (someone like your reader's
child, changed), and the identity story (a life or a kind of parent the reader wants to be).
The cautionary tale also works but use it gently or not at all — frightening parents about
their own child is a line we do not cross.

SATISFACTION VERSUS DESIRE. A good story ends resolved and leaves the reader satisfied,
thinking about the story. A good pitch leaves the reader unsatisfied, thinking about
themselves. These endings are in different places.

So for Job C, do not close the loop neatly. "His mother relaxed and everything was fine" is a
perfect story ending and a terrible sales ending, because a parent who feels resolved wants
nothing. End instead on the thing the reader is now wondering about their OWN child. Leave
them looking at their kid, not at Hung.

For Job B, the opposite: resolve it, and let it be satisfying. That is the whole point."""


IMAGE_DIRECTION = """THE IMAGE HAS TO EARN ATTENTION TOO.

The image is what stops the scroll. The copy only gets read if the image bought the second of
attention that made someone stop. A decorative image wastes that second, and then the writing
never gets seen at all.

So the image prompt must depict THE ONE SURPRISING CONCRETE THING in the post — the same
detail the hook is built on. Not a mood. Not a metaphor for learning. Not a general scene of
childhood and technology.

Banned image subjects. These are what every education brand posts and they say nothing:
- a generic smiling child at a generic laptop
- a lightbulb, a rocket, a graduation cap, a ladder, a handshake, a trophy, a puzzle piece
- a calendar or a clock standing in for "schedule"
- gears, circuit-board brains, glowing blue abstractions, floating code symbols
- a parent and child looking at a screen together, smiling at nothing

Instead, draw the actual object or the actual moment from the story. The cat with the white
speech bubble saying no. The chicken from the platformer level. The staircase of missions
climbing past the point where it stopped being comfortable.

The test: if the image would work just as well on any other coding school's post, it is
wrong. Rewrite it until it could only possibly belong to this one post.

NICE IS THE ENEMY. This is the thing that keeps going wrong, so read it twice.

A tasteful flat illustration in soft colours is invisible. It is pleasant, it is on brand, and
a parent scrolls straight past it, which means the writing underneath never gets read. Nothing
in a feed is competing on beauty. It is competing on stopping a thumb.

Banned words in your image prompts, because each one produces a picture nobody looks at:
"calm", "uncluttered", "clean and simple", "minimal", "elegant", "serene", "undraw style",
"hand-drawn undraw". The unDraw look in particular is the single most generic illustration
style on the internet and it makes us look like every SaaS landing page ever made.

Every image must have ONE of these, and you must be able to say which:

- **A face doing something specific.** Eyes and expressions stop scrolls better than anything
  else available. A kid mid-laugh, mid-frustration, staring at a screen. Not a smiling stock
  child, an actual expression tied to the moment in the post.
- **Something visibly wrong.** The Hathaway principle, pushed harder. A thing out of place,
  out of scale, broken, upside down, where it should not be. The incongruity does the work.
- **Words readable at thumbnail size.** Very few, very large. This is why the receipt works.
- **Hard contrast.** A saturated block of colour against near-black or pure white. Our soft
  off-white on pale blue recedes into the feed background, which is the worst thing an image
  can do.

Two more rules:

**It must survive being 100 pixels wide.** Describe the composition so the single main thing is
huge and centred and legible at thumbnail scale. Detail spread evenly across the frame reads as
grey mush on a phone.

**For organic posts it must not look like an advertisement.** A parent's eye rejects ad-shaped
images instantly. Documentary, screenshotted, or plainly odd beats polished. This is exactly
why the plain unstyled receipt outperforms a beautifully rendered illustration.

And an honest ordering, best to worst, for gripping attention: a real photo or a real
screenshot of actual student work; the receipt; an illustration built around a genuine
incongruity; and last, a nice flat illustration of the scene. Reach down that list in order,
and only land on the last one if the material gives you nothing better.

FIRST CHOOSE THE TYPE. The image-craft guide defines four kinds of image and the job each one
does. Pick one deliberately, name nothing, just build that kind:

- **The Receipt** — the real artefact, plain and unstyled. A chat thread of what a parent
  actually wrote, a real code screen. Monochrome, no brand palette, and THE TEXT IS THE IMAGE.
  Best for objections, proof, and promotional posts, where you can leave the reply unsent as a
  visual open loop. Only ever from real messages. Never fabricate a screenshot.
- **Story Appeal** — an ordinary scene with one odd, specific, true detail in it that makes the
  viewer invent a story. Best for the laugh and curious jobs.
- **Honest Demonstration** — the kid's actual work, documented rather than prettified. Best for
  showcases and teaching.
- **Mascot Brand Wit** — not available to us. Mochi may react to something specific inside
  another type, but may never carry an image alone with a joke and branding.

So the palette and the no-text rule are SCOPED, not absolute: they bind for Story Appeal and
Honest Demonstration, and they do not bind for a Receipt, which is deliberately unbranded
monochrome with words as its content.

Everything else in the image spec still binds — flat shapes, bold outlines, no gradients, no
logos, and the aspect ratio for the platform.

ALWAYS WRITE TWO IMAGE PROMPTS. They are different jobs and they do not substitute.

**image_prompt — the organic one.** For the feed. One of the four types above. It works by
being specific and true, and it must not look like an advertisement. This is the default and
it is what goes out with a normal post.

**image_prompt_ad — the ad creative.** For paid placement, where the image has to sell on its
own because nobody chose to follow us. Build it like a modern spec poster: ONE claim set in
large type at the top, ONE hero subject in the middle, and THREE OR FOUR hard facts placed
around it. Clean flat background, generous space, nothing decorative.

The hero is the kid's real work — a game screen, the mission ladder, the actual artefact —
never a stock child at a laptop. The facts come only from the verified business facts, and only
ones this story earns: 24 lessons, 6 real projects, one on one over Zoom, teachers who write
software for a living, 200+ students, 4,000+ lessons. Pick three or four, never all of them.

Unlike the organic image, THIS one carries text on purpose, and the claim must be the sharp
specific point of the post, not a slogan. "Homework set one level above him, on purpose" is a
claim. "Unlock your child's potential" is not, and is banned.

Never build the ad creative as a mascot with a joke and a logo. That format needs brand
recognition we do not have."""


ANTI_SLOP = """THE ANTI-SLOP RULES. This is the whole job.

You are transcribing a real memory, not composing an essay. Every line has to be
something Gleb could plausibly have said out loud to a friend.

1. Use his words for the moment. If he wrote "he said it out loud while he typed",
   keep that. Do not upgrade it to "he announced" or "he proudly declared".
2. Vary the rhythm, and vary it wide. Most sentences should be ordinary length, twenty to
   thirty-five words, properly built with commas and subordinate clauses, because that is how
   a articulate person actually writes when they are explaining something. Then occasionally
   a short one. Uniform sentence length is the loudest tell that a machine wrote something,
   and a run of short punchy sentences is now the single most obvious tell of all.
3. These structures are banned outright. They are the fingerprint:
   - "It's not just X, it's Y" / "This isn't about X, it's about Y"
   - "Here's the thing" / "Here's what I noticed" / "But here's the part that gets me"
   - "That's when it clicked" / "And that's the moment I realised"
   - "What I keep noticing is" / "The difference was"
   - a colon used to set up a reveal
   - a closing line that widens out to all children, all parents, or the future
4. Do not explain the moment after telling it. The facts carry it. If you have written
   an interpretation line, delete it and check whether the post got better. It will have.
5. No moral. No lesson. No takeaway paragraph. No "and that matters because". Note the
   distinction drawn in the story-strategy section: a Job C post is SHAPED so the reader draws
   a belief for themselves. That is engineering the moral, which is required. Writing the moral
   down is still banned, always, in every post.
6. Gaps stay gaps. If he did not give you the kid's age, the post has no age in it.
   Never invent a name, a quote, a number, a feeling, or a beat that he did not give you.
   An invented detail is the single worst failure available to you.
7. No em dash. No emoji. No bold or markdown. No exclamation marks. No hashtags unless
   he asked for them.
8. No hype words: unlock, empower, revolutionize, cutting-edge, effortless, world-class,
   seamless, robust, powerful, next-gen, transform, journey, passion.
9. No rule-of-three slogan triads. If you list three things they must be three specific
   objects, not three adjectives.
10. Long sentences are not only allowed, they are usually better. A sentence can carry two or
    three connected ideas as long as it is built properly, with commas and subordinate clauses
    doing the organising. What you must not do is chop one thought into four short sentences
    and put a blank line after each. Paragraphs of three to five sentences are normal. Air on
    the screen is good, but a post that is nothing but air is a machine post.
11. Do not open with a rhetorical question unless a real person actually asked it.
12. Write the Vietnamese as a Vietnamese person writes, and the English as an English
    speaker writes. Same story, different sentences. Neither is a translation of the
    other. Vietnamese avoids VN marketing cliches the same way English avoids EN ones:
    no "đột phá", no "hàng đầu", no "tiên phong"."""


def writer_system(ctype=None):
    """Assemble the writer's system prompt from the editable voice docs.

    Types that carry craft:"ad" additionally load ad-craft.md, which permits long copy
    and explains how the offer earns its place. Everything in voice.md still applies.
    """
    parts = [
        "You are the TechTutor writer. You write one social post at a time, from facts "
        "Gleb gives you about something that actually happened at his coding school in "
        "Vietnam. You write it the way he would if he had an hour to get the rhythm right.",
        FIND_THE_STORY,
        STORY_STRATEGY,
        ANTI_SLOP,
        IMAGE_DIRECTION,
    ]
    if ctype and ctype.get("craft") == "ad":
        # Rules 4 and 5 are tuned for a short anecdote, where explaining the moment
        # kills it. In long copy the opposite is true: the idea the story revealed is
        # what makes the offer land, and suppressing it produces a flat report.
        parts.append("""LONG COPY EXCEPTION — applies to this post only.

Anti-slop rules 4 and 5 are relaxed here. In a short post you tell the moment and get out.
In an ad you are required to develop the idea the story revealed, because that idea is what
makes the offer make sense to a stranger.

Develop it concretely, in the terms of the story itself, never in abstractions. One idea,
followed properly, two or three short paragraphs at most.

You still may not write a moral, a takeaway paragraph, a line that starts "and that's why",
or a closer that widens out to all children or all parents everywhere. Develop the specific
idea; do not generalise it.""")
    for name, header in [
        ("business-facts.md", "VERIFIED BUSINESS FACTS. You may use anything on this page "
                              "without being told it in the interview — it is already true. "
                              "Anything NOT on this page and NOT in the interview is still "
                              "forbidden to invent."),
        ("voice.md", "THE VOICE SPEC. Follow it exactly."),
        ("voice-samples.md", "SAMPLES — VOICE ONLY, NOT RHYTHM. Take the register, the "
                             "concreteness and the refusal to hype. Do NOT copy their line "
                             "breaking: they were written under an old rule that produced "
                             "short-sentence staccato, which has since been rejected. Their "
                             "paragraph rhythm is the thing you are trying to avoid. Never "
                             "reuse their content, names, stories or closing lines."),
        ("tt-voice-image-spec.md", "IMAGE SPEC. The image prompt you write must obey this."),
        ("image-craft.md", "IMAGE CRAFT. The four kinds of image and the job each one does. "
                           "Choose the type before writing the prompt. Note which of the "
                           "image-spec rules this scopes."),
        ("cta-craft.md", "THE CLOSE. The last three lines decide whether twelve good ones were "
                         "worth writing. This is the weakest part of most drafts — read it "
                         "properly and run its checklist before you output."),
    ]:
        doc = read_doc(name)
        if doc:
            parts.append(header + "\n\n" + doc)
    # ctype None means simplified mode: the model picks the type itself, so it might pick a
    # promotional one. Load the ad craft too, or it would choose an ad type without the rules
    # for writing one. The prompt is cached, so the extra length costs almost nothing.
    if ctype is None or ctype.get("craft") == "ad":
        doc = read_doc("ad-craft.md")
        if doc:
            parts.append("AD CRAFT. This is a promotional post, so these rules apply on top "
                         "of the voice spec. Length is permitted here. Boring is not.\n\n" + doc)
        doc = read_doc("swipe-teardowns.md", limit=20000)
        if doc:
            parts.append("SWIPE TEARDOWNS. Mechanics taken from ads that worked, each sorted "
                         "into transfers and rejected, with the TechTutor version written out. "
                         "Use the mechanics. Never imitate that voice — it is loud, agitating "
                         "1970s mail-order and it would undo the voice spec. Take the machine, "
                         "leave the paint.\n\n" + doc)
    parts.append("""THE POST HAS A JOB TO DO. Every post is briefed with one job: make them
laugh, teach one usable thing, make them want to learn it, answer a real doubt, show real
work, or ask for the trial. The job is not a topic, it is an effect on the reader. Write
for the effect. A post that is accurate and does nothing to the reader has failed.

AND IT HAS TO BE ACTIONABLE. The reader must be able to DO something when they finish,
and it must be something they could do in the next fifteen minutes without paying anyone.
The action comes from the content, not from a bolted-on call to action. If the job is to
teach, the action is to try the exact thing. If the job is to make them laugh, the action
is to tag the parent whose kid would do the same. Put the action in the last line, in
plain words, as one ask. Never stack two asks.""")
    parts.append("""BEFORE YOU OUTPUT, RUN THIS CHECK. Do not skip it.

Go through your draft one concrete detail at a time: every name, age, number, quote, place,
time of day, action, and physical description. For each one, point to where it came from —
the raw material, or the verified business facts. If it came from neither, delete it.

The failure this catches is the invented atmospheric detail. Writing "in the evenings he sat
quietly in his room, and she couldn't tell what he was doing" when you were told only "she
wasn't seeing him study at home" is exactly the failure. It feels harmless, because it is
plausible and it improves the rhythm. It is still a fabrication about a real child and a real
parent, and it is the worst thing you can do in this job.

Plausible is not the standard. Given is the standard.

Build atmosphere out of the details you were handed, not out of the details you wish you had
been handed. Pushing for an interesting post never licenses inventing one.

THEN COUNT THE ASKS. Read the last three lines and count how many separate things you have
asked the reader to do. The answer must be one. "Reply with a day that works, or grab the
trial link in the comments" is two, and it is weaker than either half on its own, because a
reader given two doors walks through neither. Pick the single best one and delete the other.

THEN COUNT THE PRICES. At most one number. If you have quoted the base plan and the add-on
and the lesson count and the duration, you have written a rate card. Keep the one the story
earned and cut the rest.

THEN FIX THE CLOSE, which is the part that usually fails. Read your last four lines and run
the checklist at the end of the close guide:

- Any general statement about children, learning or "every child"? Delete it. A platitude
  immediately before the ask is the most reliable way to kill a close, because it replaces
  your sharp specific point with something nobody could disagree with or act on.
- Does the ask begin with "if"? Rewrite it. Conditional openers are retreats.
- Is it "you can" rather than an instruction? Make it an instruction.
- Could a parent picture exactly what happens after they act? If not, say it concretely.
- Is the trigger taken from THIS story, or would it sit under any post? Make it from this one.
- Any raw link or pasted page title? Remove it — "link in the comments" or "message us on
  Zalo" is enough.""")
    parts.append("""YOU DO NOT ASK QUESTIONS. If the facts are thin, write the shortest honest
post those facts support and list what was missing in the "thin" field. Never reply with
questions instead of a post. Never write placeholders like [name] or [age].

Output STRICT JSON, nothing else, no code fence:
{
  "post_vn": "the Vietnamese post, or empty string if this type is English-only",
  "post_en": "the English post",
  "title": "for Reddit only, a specific title under 120 chars, else empty string",
  "slides": [{"n": 1, "text": "slide text, one idea", "image_prompt": "prompt for this slide"}],
  "image_prompt": "the ORGANIC image. Paste-ready, specific to THIS story, one of the four image types, ending with the right aspect ratio",
  "image_prompt_ad": "the AD CREATIVE. A self-contained paid-ad image for the same story — see the rules below",
  "alt": "one plain sentence of alt text for the organic image",
  "action": "the one thing the reader can do, in plain words, under 20 words",
  "thin": ["anything you had to leave out for lack of facts, empty list if none"],
  "chosen_type": "the content-type slug you decided this is, e.g. fb_student_showcase. Always fill this in.",
  "chosen_job": "the job slug you decided this post does, e.g. laugh. Always fill this in.",
  "chose_because": "one plain sentence on why those two. Always fill this in."
}

Use "slides" ONLY when the brief says the format is a carousel. Otherwise return an empty
list for it. When it is a carousel, "post_en" and "post_vn" hold the caption that goes
under the whole carousel, and the slides hold the actual teaching.""")
    return "\n\n---\n\n".join(parts)


def render_transcript(turns):
    """Flatten the interview into the raw material block for the writer."""
    out = []
    for t in turns:
        if t.get("role") == "gleb":
            out.append("GLEB: " + (t.get("text") or "").strip())
        elif t.get("role") == "ai" and t.get("questions"):
            out.append("ASKED: " + " | ".join(t["questions"]))
    return "\n\n".join(out)


def sanitize_turns(raw):
    """Accept a transcript sent up by the browser.

    The browser is the source of truth for the conversation. Sessions in SESSIONS are
    only a convenience: they live in memory, so a server restart or an eviction used to
    silently empty the transcript while the user's chat bubbles were still on screen,
    and the draft would fail with 'nothing to write from yet'.
    """
    if not isinstance(raw, list):
        return []
    turns = []
    for t in raw[:80]:
        if not isinstance(t, dict):
            continue
        role = t.get("role")
        role = "gleb" if role in ("gleb", "you") else "ai" if role == "ai" else None
        if not role:
            continue
        text = str(t.get("text") or "")[:6000]
        qs = t.get("questions")
        qs = [str(q)[:500] for q in qs][:6] if isinstance(qs, list) else []
        if not (text.strip() or qs):
            continue
        turns.append({"role": role, "text": text, "questions": qs})
    return turns


def resolve_turns(payload, sid):
    """Prefer the browser's transcript; fall back to the in-memory session."""
    client = sanitize_turns(payload.get("turns"))
    if client:
        return client
    return SESSIONS.get(sid, {}).get("turns", []) if sid else []


# Which of the four image types (see image-craft.md) suits each job, and which of the
# three story uses applies. Kept here rather than only in the long guide because the
# per-call brief is far more salient to the model than a table deep in the system prompt.
JOB_CRAFT = {
    "laugh":    ("Story Appeal — an ordinary scene with one odd, true detail in it.",
                 "Job B, entertain and bond. Let it resolve. Do not bolt a pitch on."),
    "curious":  ("Story Appeal — the odd true detail that makes them invent the rest.",
                 "Job B, entertain and bond. It may resolve."),
    "teach":    ("Honest Demonstration — the real screen or the real artefact, not prettified.",
                 "Job B. The teaching is the value. It may resolve."),
    "proof":    ("Honest Demonstration — the kid's actual work, documented not styled.",
                 "Job B. Let the detail do the praising."),
    "reassure": ("The Receipt — the doubt in the parent's own words, plain and unstyled.",
                 "Job B, but land the reassurance on the reader's own situation."),
    "invite":   ("The Receipt — real words, unstyled, monochrome, and leave the reply unsent "
                 "so the image itself holds an open loop.",
                 "Job C, sales inception. Engineer the belief, never state it. Do NOT resolve "
                 "the ending. Close on what the reader is now wondering about their OWN child."),
}


def auto_menu():
    """The type and job menus, for when Gleb hasn't picked and the model decides.

    Simplified mode: he just talks, and the writer works out what kind of post this
    wants to be. The knowledge in content-types.json and jobs.json is still doing the
    work — it has just moved from being a form he fills in to being a menu the model
    reads.
    """
    lines = ["YOU CHOOSE THE KIND OF POST. Gleb has not picked one, and he should not have to.",
             "Read the conversation, work out what this material actually wants to be, and pick",
             "one type and one job from the menus below. Pick the one the story fits, never the",
             "one that would flatter the business most. Most material is not promotional.", "",
             "TYPES:"]
    for t in types_list():
        lines.append(f"- {t['slug']} ({t.get('platform','')}, {t.get('format','single')}): "
                     f"{t.get('purpose','')} | shape: {t.get('structure','')} | "
                     f"aspect: {t.get('aspect','4:5 portrait')}"
                     f"{' | LONG-COPY AD, ad craft applies' if t.get('craft') == 'ad' else ''}"
                     f"{' | bilingual VN+EN' if t.get('bilingual', True) else ' | ENGLISH ONLY'}")
    lines += ["", "JOBS (the effect on the reader):"]
    for j in jobs_list():
        lines.append(f"- {j['slug']} ({j.get('family','')}): {j.get('does','')} "
                     f"Action: {j.get('action','')}")
    lines += ["", "Then follow that type's shape and that job's craft notes exactly, including "
                  "which story job applies and which image type to reach for. Report both "
                  "choices back in chosen_type and chosen_job, and say in one plain sentence "
                  "why, in chose_because."]
    return "\n".join(lines)


def job_brief(job):
    """Render the chosen job into the writer's brief."""
    if not job:
        return ("JOB: you are choosing it yourself — see the menu above. Once you have chosen, "
                "apply that job's craft notes, its story job, and its image type.")
    img, story = JOB_CRAFT.get(job.get("slug"), ("", ""))
    out = (f"JOB: {job['name']} ({job.get('family','')}). {job.get('does','')}\n"
           f"THE READER LEAVES WITH: {job.get('reader_leaves_with','')}\n"
           f"THE ACTION THEY CAN TAKE: {job.get('action','')}\n"
           f"HOW TO WRITE FOR THIS JOB: {job.get('writer_note','')}\n"
           f"PROMOTIONAL BALANCE: {job.get('weight','')}")
    if story:
        out += f"\nWHAT THE STORY IS DOING HERE: {story}"
    if img:
        out += f"\nIMAGE TYPE TO REACH FOR: {img}"
    return out


def _clean_slides(raw):
    """Normalise the writer's slides array."""
    out = []
    if not isinstance(raw, list):
        return out
    for i, s in enumerate(raw, 1):
        if not isinstance(s, dict):
            continue
        text = (s.get("text") or "").strip()
        if not text:
            continue
        out.append({"n": s.get("n") or i, "text": text,
                    "image_prompt": (s.get("image_prompt") or "").strip()})
    return out[:10]


def draft_post(ctype, turns, lang_order="vn", notes="", job=None):
    """Write the post. This path can never return questions.

    ctype may be None — simplified mode, where the writer picks the type and job itself
    from the conversation rather than making Gleb fill in a form first.
    """
    auto = ctype is None
    if auto:
        ctype = {}
    bilingual = ctype.get("bilingual", True)
    carousel = ctype.get("format") == "carousel"
    first, second = ("Vietnamese", "English") if lang_order != "en" else ("English", "Vietnamese")
    raw = render_transcript(turns)
    if notes.strip():
        raw = (raw + "\n\nGLEB (extra notes): " + notes.strip()).strip()
    if not raw.strip():
        return (False, {"error": "Nothing to write from yet. Tell it what happened first."})

    if auto:
        brief = (auto_menu() + "\n\n" + job_brief(job) +
                 f"\n\nLANGUAGES: Vietnamese and English, {first} leads — unless you choose a "
                 f"Reddit type, which is English only with post_vn left empty.\n"
                 f"FORMAT: single post unless you choose the carousel type, in which case fill "
                 f"the slides array with 5 to 7 slides.\n"
                 f"TITLE: only if you choose a Reddit type, otherwise leave it empty.")
    else:
        brief = f"""Write ONE post for this content type.

TYPE: {ctype.get('name')} ({ctype.get('slug')})
PLATFORM: {ctype.get('platform')}
FORMAT: {ctype.get('format', 'single')}{' — write the slides array, 5 to 7 slides, one idea each.' if carousel else ' — leave the slides array empty.'}
AUDIENCE: {ctype.get('audience')}
PURPOSE: {ctype.get('purpose')}
TONE: {ctype.get('tone')}
SHAPE: {ctype.get('structure')}
SUGGESTED CTA SHAPE: {ctype.get('cta')}
IMAGE ASPECT: {ctype.get('aspect', '4:5 portrait')}
LANGUAGES: {'Vietnamese and English, ' + first + ' leads' if bilingual else 'English only, leave post_vn empty'}
{'TITLE: write one, this is a Reddit post.' if ctype.get('reddit_ok') else 'TITLE: leave empty.'}

{job_brief(job)}"""

    task = f"""{brief}

THE RAW MATERIAL. These are the only facts that exist. Everything in the post comes
from here. If something is not in here, it does not go in the post.

{raw}

Now write it. Strict JSON only."""

    ok, parsed = claude_json(writer_system(ctype), task, DRAFT_MODEL)
    if not ok:
        return (False, parsed)

    post_en = (parsed.get("post_en") or "").strip()
    post_vn = (parsed.get("post_vn") or "").strip()
    slides = _clean_slides(parsed.get("slides"))
    if not (post_en or post_vn or slides):
        return (False, {"error": "The writer came back empty. Add a couple more facts and retry."})

    return (True, {
        "post_vn": post_vn,
        "post_en": post_en,
        "title": (parsed.get("title") or "").strip(),
        "slides": slides,
        "image_prompt": (parsed.get("image_prompt") or "").strip() or ctype.get("image_prompt", ""),
        "image_prompt_ad": (parsed.get("image_prompt_ad") or "").strip(),
        "alt": (parsed.get("alt") or "").strip(),
        "action": (parsed.get("action") or "").strip(),
        "thin": parsed.get("thin") or [],
        "chosen_type": (parsed.get("chosen_type") or "").strip(),
        "chosen_job": (parsed.get("chosen_job") or "").strip(),
        "chose_because": (parsed.get("chose_because") or "").strip(),
    })


def assemble(post_vn, post_en, lang_order="vn"):
    """Join the two halves into the single caption the posting code uses."""
    if not post_vn:
        return post_en
    if not post_en:
        return post_vn
    a, b = (post_vn, post_en) if lang_order != "en" else (post_en, post_vn)
    return f"{a}\n\n···\n\n{b}"


def split_halves(text):
    """Inverse of assemble, for revise/lint on an edited caption."""
    if "···" in text:
        a, b = text.split("···", 1)
        return (a.strip(), b.strip())
    return (text.strip(), "")


def lint_all(post_vn, post_en):
    return lint_post(post_vn, "VN") + lint_post(post_en, "EN")


# ---- interview sessions (in memory; a restart clears them) ------------------
SESSIONS = {}
MAX_SESSIONS = 60

def new_session(slug):
    sid = uuid.uuid4().hex[:12]
    if len(SESSIONS) >= MAX_SESSIONS:
        for k in list(SESSIONS)[:10]:
            SESSIONS.pop(k, None)
    SESSIONS[sid] = {"slug": slug, "turns": []}
    return sid


def run_interview(ctype, turns, job=None):
    asked = [q for t in turns if t["role"] == "ai" for q in t.get("questions", [])]
    jobline = ""
    if job:
        jobline = (f"THE JOB THIS POST HAS TO DO: {job['name']} — {job.get('does','')}\n"
                   f"So the details worth chasing are the ones that produce that effect. "
                   f"The reader must end up able to: {job.get('action','')}\n")
    task = f"""You are interviewing Gleb for this post.

TYPE: {ctype.get('name')} ({ctype.get('platform')})
WHAT THIS TYPE NEEDS: {ctype.get('interview_focus', '')}
PURPOSE OF THE POST: {ctype.get('purpose')}
{jobline}
QUESTIONS ALREADY ASKED (never repeat these):
{chr(10).join('- ' + q for q in asked) if asked else '- none yet'}

THE CONVERSATION SO FAR:

{render_transcript(turns)}

Strict JSON only."""
    ok, parsed = claude_json(INTERVIEWER, task, INTERVIEW_MODEL, timeout=120)
    if not ok:
        return (False, parsed)
    qs = parsed.get("questions") or []
    if not isinstance(qs, list):
        qs = []
    qs = [str(q).strip() for q in qs if str(q).strip()][:4]
    return (True, {
        "ready": bool(parsed.get("ready")),
        "have": parsed.get("have") or [],
        "missing": parsed.get("missing") or [],
        "questions": qs,
        "note": (parsed.get("note") or "").strip(),
    })


# ---- the texture pass -------------------------------------------------------
# Instructions about rhythm do not survive inside the full writer prompt: they compete
# with fifty other rules and lose, every time. Measured three times — average sentence
# length would not move off 12 words no matter how explicit the instruction was. So the
# texture gets its own call, with a tiny system prompt and exactly one job.
HUMANIZER = """You join up choppy writing. That is your only job.

You will be given a post written in short-sentence staccato: one short declarative sentence
after another, most paragraphs only one or two lines long. It reads as machine-written, which
is the problem you are fixing.

Rewrite it so it reads like an articulate person who talks fast and did not edit much:

- Join connected thoughts into single longer sentences using commas, "because", "which", "so",
  "and". Most sentences should end up between twenty and forty words.
- Merge the one-line paragraphs into real paragraphs of three to five sentences. The finished
  post should have roughly half as many paragraphs as it started with.
- Keep a couple of genuinely short sentences, but only where the emphasis is earned.
- Vary paragraph length. One long, one medium, one short is fine. Nine identical ones is not.

Hard constraints, do not break these:

- Do not change any fact, name, age, number, quote or event. Do not add any.
- Do not add a moral, a lesson, or a summarising line.
- Keep the first line and the last line doing the same work they already do.
- No em dashes, no emoji, no exclamation marks, no bold, no hype words.
- Keep the same language. Vietnamese stays Vietnamese, English stays English. If the text has
  a '···' separator, keep it and treat each half separately.

Output ONLY the rewritten post. No preamble, no explanation, no JSON."""


def humanize(text, model=None):
    """Second pass: join the staccato up. Returns the text unchanged on any failure."""
    if not text.strip():
        return text
    ok, out = run_claude(HUMANIZER,
                         "Join this up. Output only the rewritten post.\n\n" + text,
                         model or DRAFT_MODEL, timeout=180)
    if not ok:
        return text
    out = _strip_fences(out).strip()
    # Guard against the pass returning something obviously broken or truncated.
    if len(out) < len(text) * 0.5 or not out:
        return text
    return out


_FENCE_LINE = re.compile(r"^```[a-zA-Z]*\s*|\s*```$")
def _strip_fences(t):
    return _FENCE_LINE.sub("", t.strip())


# ---- the image pass ---------------------------------------------------------
# Same lesson as the texture pass. Buried inside the full writer prompt, the image
# instructions produce something tasteful and invisible — Gleb's words were "it's a
# beautiful picture, but it doesn't grip any attention, it's just nice." So the image
# gets its own call too, with one job: make it stop a thumb and be ready to run.
IMAGE_PUNCH = """You turn a competent image prompt into one that actually stops someone
scrolling. That is your only job.

The prompt you are given describes a nice picture. Nice is the problem. A tasteful flat
illustration in soft colours is invisible in a feed: it is pleasant, it is on brand, and the
thumb goes straight past, which means the writing underneath is never read. You are not
competing on beauty. You are competing on interruption.

Rewrite the prompt so the image has ALL of these:

**One thing, huge and centred.** It must be legible as a 100-pixel thumbnail. Detail spread
evenly across the frame turns to grey mush on a phone. Say explicitly what dominates the frame
and how much of it that thing occupies.

**A reason for the eye to snag.** Pick whichever fits the story and name it in the prompt:
a face with a real specific expression, something visibly wrong or out of scale or broken,
very few very large readable words, or one saturated colour against near-black or pure white.

**Hard contrast.** Soft off-white on pale blue recedes into the feed's own background, which
is the worst thing an image can do. Give it an edge.

**Production detail.** Someone should be able to paste this into an image generator and get a
usable file with no follow-up: subject, composition, what fills the frame, palette with hex
values, style, lighting or flatness, what is excluded, aspect ratio last.

Banned from the prompt, every one of them produces something nobody looks at: "calm",
"uncluttered", "clean and simple", "minimal", "elegant", "serene", "gentle", "undraw style",
"hand-drawn undraw".

Constraints you must keep: the subject stays the same story, the brand palette stays
(deep-blue #193B92, Mochi orange #FFA500, near-black, white), flat shapes and bold outlines
stay, and the aspect ratio stays exactly as given. Never add a logo, a watermark, or a real
brand mark. For an organic prompt do not make it look like an advertisement; documentary and
plainly odd beat polished.

Output ONLY the rewritten prompt. No preamble, no explanation, no quotes around it."""


def punch_image(prompt, kind="organic"):
    """Second pass on an image prompt. Returns it unchanged on any failure."""
    if not prompt.strip():
        return prompt
    hint = ("This is the ORGANIC prompt, for a normal feed post. It must not look like an ad."
            if kind == "organic" else
            "This is the AD CREATIVE prompt, for paid placement. It carries a headline claim "
            "and three or four hard facts, and it should look like a deliberate poster.")
    ok, out = run_claude(IMAGE_PUNCH, hint + "\n\nThe prompt to sharpen:\n\n" + prompt,
                         DRAFT_MODEL, timeout=150)
    if not ok:
        return prompt
    out = _strip_fences(out).strip().strip('"')
    if len(out) < 60:
        return prompt
    return out


def polish(res, do_text=True, do_images=True):
    """Run both second passes over a draft result, in place."""
    if do_text:
        res["post_en"] = humanize(res.get("post_en", ""))
        res["post_vn"] = humanize(res.get("post_vn", ""))
    if do_images:
        if res.get("image_prompt"):
            res["image_prompt"] = punch_image(res["image_prompt"], "organic")
        if res.get("image_prompt_ad"):
            res["image_prompt_ad"] = punch_image(res["image_prompt_ad"], "ad")
    return res


def rewrite_post(source, lang_order="vn", notes=""):
    """Take a post Gleb already has and redo it in the house voice, plus an image prompt.

    Different from revise_post: revise takes OUR draft and applies one instruction to it.
    This takes outside text — something he wrote himself, or an old post — and rebuilds it
    from scratch in the voice, choosing the type and job itself.
    """
    if not source.strip():
        return (False, {"error": "Paste the post you want rewritten."})
    first, second = ("Vietnamese", "English") if lang_order != "en" else ("English", "Vietnamese")
    task = f"""Gleb already has this post. Rewrite it properly in the house voice, and give him
an image to go with it.

{auto_menu()}

THE FACTS RULE STILL BINDS, and it binds hard here. The pasted post below is your ONLY source
of facts, together with the verified business facts. You may cut anything, reorder anything,
and rewrite every sentence. You may NOT add a name, an age, a number, a quote, a place or an
event that is not already in the text below or in the business facts.

If the original is thin — if it asserts things without any concrete detail behind them — do not
paper over that with atmosphere. Write the honest shorter version and list what is missing in
the "thin" field, so he knows what to go and find out.

Most pasted posts will be chronological, will bury the interesting thing in the middle, and
will explain their own moral at the end. Fix all three. Find the most interesting thing in it
and lead with that.

LANGUAGES: Vietnamese and English, {first} leads — unless you choose a Reddit type, which is
English only with post_vn empty.
{('EXTRA CONTEXT FROM GLEB (weave in, do not quote): ' + notes.strip()) if notes.strip() else ''}

THE POST TO REWRITE:

{source.strip()}

Fill in chosen_type, chosen_job and chose_because as well — Gleb needs to see what you decided
this post is. Strict JSON only."""
    ok, parsed = claude_json(writer_system(None), task, DRAFT_MODEL)
    if not ok:
        return (False, parsed)
    post_en = (parsed.get("post_en") or "").strip()
    post_vn = (parsed.get("post_vn") or "").strip()
    if not (post_en or post_vn):
        return (False, {"error": "The rewrite came back empty. Try pasting a bit more."})
    return (True, {
        "post_vn": post_vn, "post_en": post_en,
        "title": (parsed.get("title") or "").strip(),
        "slides": _clean_slides(parsed.get("slides")),
        "image_prompt": (parsed.get("image_prompt") or "").strip(),
        "image_prompt_ad": (parsed.get("image_prompt_ad") or "").strip(),
        "alt": (parsed.get("alt") or "").strip(),
        "action": (parsed.get("action") or "").strip(),
        "thin": parsed.get("thin") or [],
        "chosen_type": (parsed.get("chosen_type") or "").strip(),
        "chosen_job": (parsed.get("chosen_job") or "").strip(),
        "chose_because": (parsed.get("chose_because") or "").strip(),
    })


def revise_post(ctype, text, instruction, lang_order="vn", job=None):
    """Targeted rewrite of a caption Gleb already has in the box."""
    vn, en = split_halves(text)
    if lang_order == "en":
        en, vn = vn, en
    if not ctype.get("bilingual", True):
        en, vn = text.strip(), ""
    task = f"""Here is a post you already wrote. Revise it.

WHAT TO CHANGE: {instruction.strip()}

{job_brief(job)}

Change only what was asked. Keep every fact exactly as it is. Do not add facts. Do not
add a name, an age, a quote, or a number that is not already in the text.

CURRENT VIETNAMESE:
{vn or '(none)'}

CURRENT ENGLISH:
{en or '(none)'}

Return the same strict JSON shape as always. Keep the image_prompt consistent with the
revised post. Strict JSON only."""
    ok, parsed = claude_json(writer_system(ctype), task, DRAFT_MODEL)
    if not ok:
        return (False, parsed)
    post_en = (parsed.get("post_en") or "").strip()
    post_vn = (parsed.get("post_vn") or "").strip()
    slides = _clean_slides(parsed.get("slides"))
    if not (post_en or post_vn or slides):
        return (False, {"error": "The revise came back empty. Try phrasing the change differently."})
    return (True, {
        "post_vn": post_vn, "post_en": post_en,
        "title": (parsed.get("title") or "").strip(),
        "slides": slides,
        "image_prompt": (parsed.get("image_prompt") or "").strip(),
        "image_prompt_ad": (parsed.get("image_prompt_ad") or "").strip(),
        "alt": (parsed.get("alt") or "").strip(),
        "action": (parsed.get("action") or "").strip(),
        "thin": parsed.get("thin") or [],
    })


# ---- the news desk ----------------------------------------------------------
# Hacker News' public API needs no key and no dependency. We pull the current top
# stories, then ask the model which ones a Vietnamese parent or a kid learning to
# build things would actually care about, and what the angle is. Stories the model
# can't find an honest angle for get dropped rather than stretched.
HN_TOP = "https://hacker-news.firebaseio.com/v0/topstories.json"
HN_ITEM = "https://hacker-news.firebaseio.com/v0/item/{}.json"
NEWS_CACHE = {"at": 0.0, "items": []}
NEWS_TTL = 1800  # 30 minutes

NEWS_EDITOR = """You are the news editor for TechTutor, a small coding school for 7 to 17
year olds in Vietnam. You are handed the current Hacker News front page and you pick the
few stories worth a post.

A story is worth it only if Gleb can say something true and useful about what it changes
for a child learning to build things, or for the parent paying for that. Most of the front
page does not qualify. Funding rounds, enterprise tooling, and language drama almost never
qualify. AI capability news, programming education, kids and screens, game development
tools, and anything a 12 year old could actually use almost always do.

For each story you keep, write the angle as the thing Gleb would say, not as a topic. The
angle must be arguable and specific. "AI is changing education" is not an angle. "The new
model writes working code from a sentence, and it still cannot tell you why your kid's
game is broken" is an angle.

Never invent a story that is not in the list. Never inflate a story's importance. If a
story's honest angle is that nothing changes, that is a good angle, keep it.

Pick between 3 and 6. Order them by how good the post would be, best first.

Output STRICT JSON, nothing else, no code fence:
{
  "items": [
    {
      "id": the story id from the list,
      "why": "one line on why this audience cares",
      "angle": "the thing Gleb would say, one or two sentences, arguable and specific",
      "job": one of "laugh" "teach" "curious" "reassure" "proof" "invite",
      "type": one of "news_take" "reddit_teach" "fb_myth_buster" "try_this_home"
    }
  ]
}"""


def fetch_hn(limit=60):
    """Top HN stories, fetched in parallel. Returns [] if HN is unreachable."""
    ids = http_get_json(HN_TOP)
    if not isinstance(ids, list):
        return []
    ids = ids[:limit]
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=12) as pool:
        items = list(pool.map(lambda i: http_get_json(HN_ITEM.format(i), timeout=10), ids))
    out = []
    for it in items:
        if not it or it.get("type") != "story" or not it.get("title"):
            continue
        out.append({
            "id": it.get("id"),
            "title": it["title"],
            "url": it.get("url") or f"https://news.ycombinator.com/item?id={it.get('id')}",
            "score": it.get("score", 0),
            "comments": it.get("descendants", 0),
        })
    return out


def news_desk(force=False):
    """Curated tech news with angles. Cached 30 min so the picker feels instant."""
    import time
    if not force and NEWS_CACHE["items"] and (time.time() - NEWS_CACHE["at"]) < NEWS_TTL:
        return (True, {"items": NEWS_CACHE["items"], "cached": True})

    stories = fetch_hn()
    if not stories:
        return (False, {"error": "Couldn't reach Hacker News. Check the connection and retry."})

    listing = "\n".join(f"{s['id']} | {s['score']} pts | {s['title']}" for s in stories)
    ok, parsed = claude_json(NEWS_EDITOR,
                             "Today's Hacker News front page:\n\n" + listing +
                             "\n\nPick the stories worth a TechTutor post. Strict JSON only.",
                             INTERVIEW_MODEL, timeout=150)
    if not ok:
        return (False, parsed)

    by_id = {s["id"]: s for s in stories}
    picked = []
    for it in (parsed.get("items") or []):
        src = by_id.get(it.get("id"))
        if not src:
            continue
        picked.append({**src,
                       "why": (it.get("why") or "").strip(),
                       "angle": (it.get("angle") or "").strip(),
                       "job": (it.get("job") or "").strip(),
                       "type": (it.get("type") or "news_take").strip()})
    if not picked:
        return (False, {"error": "Nothing on the front page is worth a post right now. "
                                 "That happens. Try again later."})
    NEWS_CACHE["at"], NEWS_CACHE["items"] = time.time(), picked
    return (True, {"items": picked, "cached": False})


def save_draft(slug, text, image_prompt="", title="", alt="", turns=None,
               job="", action="", slides=None):
    """Write the post to drafts/ with its interview attached, for the record."""
    stamp = datetime.now().strftime("%Y-%m-%d-%H%M")
    safe = re.sub(r"[^a-z0-9_-]+", "-", (slug or "post").lower()).strip("-")
    path = DRAFTS / f"{stamp}-{safe}.md"
    lines = ["---", f"type: {slug}", f"saved: {datetime.now().isoformat(timespec='seconds')}"]
    if job:
        lines.append(f"job: {job}")
    if title:
        lines.append(f"title: {title}")
    lines += ["---", "", text.strip(), ""]
    if action:
        lines += ["## The action", "", action.strip(), ""]
    if slides:
        lines += ["## Slides", ""]
        for s in slides:
            lines.append(f"**{s['n']}.** {s['text']}")
            if s.get("image_prompt"):
                lines.append(f"> image: {s['image_prompt']}")
            lines.append("")
    if image_prompt:
        lines += ["## Image prompt", "", image_prompt.strip(), ""]
    if alt:
        lines += ["## Alt text", "", alt.strip(), ""]
    if turns:
        lines += ["## Interview", "", render_transcript(turns), ""]
    path.write_text("\n".join(lines))
    return path.name


def status_flags():
    return {
        "fb": bool(os.environ.get("FB_PAGE_TOKEN")),
        "ig": bool(os.environ.get("IG_USER_TOKEN") and os.environ.get("IG_USER_ID")),
        "reddit": bool(os.environ.get("REDDIT_CLIENT_ID") and os.environ.get("REDDIT_CLIENT_SECRET")
                       and os.environ.get("REDDIT_USERNAME") and os.environ.get("REDDIT_PASSWORD")),
        "ai": bool(CLAUDE_BIN),
        "lint": bool(LINT),
        "draft_model": DRAFT_MODEL,
        "interview_model": INTERVIEW_MODEL,
    }


def types_list():
    return json.loads((HERE / "content-types.json").read_text())


def find_type(slug):
    return next((t for t in types_list() if t["slug"] == slug), None)


def jobs_list():
    f = HERE / "jobs.json"
    return json.loads(f.read_text()) if f.exists() else []


def find_job(slug):
    return next((j for j in jobs_list() if j["slug"] == slug), None) if slug else None


# ---- HTTP server ------------------------------------------------------------
class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body, ctype="application/json"):
        if not isinstance(body, bytes):
            body = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _json(self, code, obj):
        self._send(code, json.dumps(obj), "application/json")

    def _body(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw = self.rfile.read(length) if length else b""
        try:
            return json.loads(raw.decode() or "{}"), raw
        except json.JSONDecodeError:
            return None, raw

    def do_GET(self):
        p = urllib.parse.urlparse(self.path)
        if p.path in ("/", "/index.html", "/wizard", "/wizard.html"):
            self._send(200, (HERE / "index.html").read_bytes(), "text/html; charset=utf-8")
        elif p.path in ("/full", "/full.html", "/index-full.html"):
            # The six-step version: content types, jobs, the news desk. Kept intact.
            f = HERE / "index-full.html"
            if f.exists():
                self._send(200, f.read_bytes(), "text/html; charset=utf-8")
            else:
                self._json(404, {"error": "index-full.html not found"})
        elif p.path == "/types":
            self._send(200, (HERE / "content-types.json").read_bytes(), "application/json")
        elif p.path == "/jobs":
            self._json(200, jobs_list())
        elif p.path == "/status":
            self._json(200, status_flags())
        elif p.path.startswith("/uploads/"):
            name = Path(urllib.parse.unquote(p.path[len("/uploads/"):])).name  # no path traversal
            f = UPLOADS / name
            if name and f.exists():
                self._send(200, f.read_bytes(), mime_for(f))
            else:
                self._json(404, {"error": "not found"})
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self):
        p = urllib.parse.urlparse(self.path)

        # ---- file upload (multipart) ----
        if p.path == "/upload" and "multipart/form-data" in self.headers.get("Content-Type", ""):
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(length) if length else b""
            parsed = parse_multipart_file(raw, self.headers.get("Content-Type", ""), "file")
            if not parsed:
                return self._json(400, {"error": "no file field"})
            filename, data = parsed
            suffix = Path(filename or "").suffix.lower() or ".bin"
            fname = os.urandom(6).hex() + suffix
            (UPLOADS / fname).write_bytes(data)
            return self._json(200, {"file": fname, "ctype": mime_for(fname),
                                    "video": is_video(fname)})

        payload, _ = self._body()
        if payload is None:
            return self._json(400, {"error": "bad json"})

        # ---- the interview: questions only, never a post ----
        if p.path == "/interview":
            ctype = find_type(payload.get("slug")) if payload.get("slug") else None
            if payload.get("slug") and not ctype:
                return self._json(200, {"ok": False, "error": "unknown content type"})
            if ctype is None:
                # Simplified mode: interview without a type chosen up front.
                ctype = {"name": "not chosen yet", "platform": "not chosen yet",
                         "purpose": "Gleb has not picked a content type. Work out what this "
                                    "material is as you go.",
                         "interview_focus": "Find out what actually happened and get it "
                                            "concrete. Do not ask him what kind of post he "
                                            "wants, what platform it is for, or who the "
                                            "audience is — that gets decided later, from the "
                                            "material. Just get the story."}
            sid = payload.get("sid") or new_session(ctype.get("slug", "auto"))
            sess = SESSIONS.setdefault(sid, {"slug": ctype.get("slug", "auto"), "turns": []})
            # Trust the browser's copy if it has one — it survives server restarts.
            client = sanitize_turns(payload.get("turns"))
            if client:
                sess["turns"] = client
            msg = (payload.get("message") or "").strip()
            if msg:
                sess["turns"].append({"role": "gleb", "text": msg})
            if not sess["turns"]:
                return self._json(200, {"ok": False, "error": "Say what happened first."})
            try:
                ok, res = run_interview(ctype, sess["turns"], find_job(payload.get("job")))
            except Exception as e:  # never 500
                return self._json(200, {"ok": False, "error": str(e)})
            if not ok:
                return self._json(200, {"ok": False, **res})
            sess["turns"].append({"role": "ai", "questions": res["questions"],
                                  "text": res["note"]})
            return self._json(200, {"ok": True, "sid": sid, **res})

        # ---- the draft: a post, never questions ----
        if p.path in ("/draft", "/generate"):
            # No slug means simplified mode — the writer picks the type itself.
            ctype = find_type(payload.get("slug")) if payload.get("slug") else None
            if payload.get("slug") and not ctype:
                return self._json(200, {"ok": False, "error": "unknown content type"})
            sid = payload.get("sid")
            turns = resolve_turns(payload, sid)
            lang = payload.get("lang_order", "vn")
            # /generate is the old one-shot route: whatever is in the box is the facts.
            notes = payload.get("notes") or payload.get("extra") or ""
            try:
                ok, res = draft_post(ctype, turns, lang, notes, find_job(payload.get("job")))
            except Exception as e:
                return self._json(200, {"ok": False, "error": str(e)})
            if not ok:
                return self._json(200, {"ok": False, **res})
            # Texture pass, unless explicitly turned off. Run per language so the two
            # halves never get merged or translated into each other.
            polish(res, payload.get("humanize", True), payload.get("punch_images", True))
            text = assemble(res["post_vn"], res["post_en"], lang)
            return self._json(200, {"ok": True, "sid": sid, "text": text,
                                    "lint": lint_all(res["post_vn"], res["post_en"]), **res})

        # ---- rewrite a post he already has ----
        if p.path == "/rewrite":
            lang = payload.get("lang_order", "vn")
            try:
                ok, res = rewrite_post(payload.get("source") or "", lang,
                                       payload.get("notes") or "")
            except Exception as e:
                return self._json(200, {"ok": False, "error": str(e)})
            if not ok:
                return self._json(200, {"ok": False, **res})
            polish(res, payload.get("humanize", True), payload.get("punch_images", True))
            return self._json(200, {"ok": True,
                                    "text": assemble(res["post_vn"], res["post_en"], lang),
                                    "lint": lint_all(res["post_vn"], res["post_en"]), **res})

        # ---- revise what's in the box ----
        if p.path == "/revise":
            ctype = find_type(payload.get("slug")) if payload.get("slug") else {}
            if payload.get("slug") and not ctype:
                return self._json(200, {"ok": False, "error": "unknown content type"})
            text = (payload.get("text") or "").strip()
            instruction = (payload.get("instruction") or "").strip()
            if not text:
                return self._json(200, {"ok": False, "error": "Nothing in the box to revise."})
            if not instruction:
                return self._json(200, {"ok": False, "error": "Say what to change."})
            lang = payload.get("lang_order", "vn")
            try:
                ok, res = revise_post(ctype, text, instruction, lang, find_job(payload.get("job")))
            except Exception as e:
                return self._json(200, {"ok": False, "error": str(e)})
            if not ok:
                return self._json(200, {"ok": False, **res})
            # A revise re-runs the full writer, so it can reintroduce the staccato. Run the
            # texture pass again unless the instruction was itself about rhythm.
            polish(res, payload.get("humanize", True), payload.get("punch_images", False))
            return self._json(200, {"ok": True, "text": assemble(res["post_vn"], res["post_en"], lang),
                                    "lint": lint_all(res["post_vn"], res["post_en"]), **res})

        # ---- lint whatever is in the box right now ----
        if p.path == "/lint":
            vn, en = split_halves(payload.get("text") or "")
            if payload.get("lang_order") == "en":
                en, vn = vn, en
            return self._json(200, {"ok": True, "lint": lint_all(vn, en)})

        # ---- the news desk ----
        if p.path == "/news":
            try:
                ok, res = news_desk(force=bool(payload.get("refresh")))
            except Exception as e:
                return self._json(200, {"ok": False, "error": str(e)})
            return self._json(200, {"ok": ok, **res})

        # ---- save a draft to disk ----
        if p.path == "/save":
            text = (payload.get("text") or "").strip()
            if not text:
                return self._json(200, {"ok": False, "error": "Nothing to save."})
            sid = payload.get("sid")
            turns = resolve_turns(payload, sid)
            try:
                name = save_draft(payload.get("slug", "post"), text,
                                  payload.get("image_prompt", ""), payload.get("title", ""),
                                  payload.get("alt", ""), turns,
                                  payload.get("job", ""), payload.get("action", ""),
                                  payload.get("slides") or None)
            except Exception as e:
                return self._json(200, {"ok": False, "error": str(e)})
            return self._json(200, {"ok": True, "file": name})

        # ---- post ----
        if p.path == "/post":
            platform = payload.get("platform")
            message = payload.get("message", "")
            fname = payload.get("image")
            fpath = (UPLOADS / Path(fname).name) if fname else None
            try:
                if platform == "facebook":
                    result = post_facebook(message, fpath)
                elif platform == "instagram":
                    result = post_instagram(message, fpath)
                elif platform == "reddit":
                    result = post_reddit(message, payload.get("title"), payload.get("subreddit"))
                else:
                    return self._json(400, {"error": "unknown platform"})
            except Exception as e:  # never 500 on a posting error
                result = {"ok": False, "error": str(e)}
            return self._json(200, result)

        self._json(404, {"error": "not found"})

    def log_message(self, *args):  # keep the console quiet
        pass


def main():
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    flags = status_flags()
    print(f"TechTutor Content Console  ->  http://127.0.0.1:{PORT}")
    print(f"  Facebook  : {'ready' if flags['fb'] else 'missing FB_PAGE_TOKEN'}")
    print(f"  Instagram : {'ready' if flags['ig'] else 'missing IG_USER_TOKEN / IG_USER_ID'}")
    print(f"  Reddit    : {'ready' if flags['reddit'] else 'missing REDDIT_* (see README)'}")
    if flags["ai"]:
        print(f"  AI        : interview={INTERVIEW_MODEL}  writer={DRAFT_MODEL}")
    else:
        print("  AI        : claude CLI not found")
    print(f"  Voice lint: {'on' if flags['lint'] else 'off (voice-lint.py not loadable)'}")
    print("  Ctrl+C to stop.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nbye")
        srv.shutdown()


if __name__ == "__main__":
    main()
