#!/usr/bin/env python3
"""
TechTutor voice lint — checks a caption against VOICE.md banned tells.
Mechanical only; human judgment (is it true? does it land?) is not lintable.
Usage:  python3 voice-lint.py "caption text here"
        python3 voice-lint.py  (reads stdin)
Exit 0 if clean, 1 if any violation found.
"""
import sys, re

HYPE = ["seamless","robust","powerful","cutting-edge","effortless","world-class",
        "next-generation","next gen","revolutionary","empower","unlock","đột phá",
        "hàng đầu","tiên phong","revolutionary"]
TRIAD_KW = None  # triads are contextual; flagged heuristically below

def lint(text):
    hits = []
    low = text.lower()
    if "—" in text: hits.append("em dash (—) in prose")
    if "—" not in text and "–" in text: hits.append("en dash used as em dash")
    if re.search(r"[\U0001F000-\U0001FAFF\u2600-\u27BF]", text): hits.append("emoji present")
    for h in HYPE:
        if h in low: hits.append(f"hype word: '{h}'")
    if "!" in text: hits.append("exclamation mark (hype tell)")
    if re.search(r"\*\*.+\*\*", text): hits.append("bold markdown in plain caption")
    # rule-of-three slogan triad: 3 comma/&/and-joined short adjectives
    if re.search(r"\b(\w+), (\w+), and (\w+)\b", text) or re.search(r"\b(\w+) \& (\w+) \& (\w+)\b", text):
        hits.append("possible rule-of-three triad")
    # Sentence length. The old limit was 22 words, which was actively wrong: it flagged
    # exactly the long, well-organised sentences that make writing sound human, and it
    # pushed every draft into short-sentence staccato — the clearest tell that a machine
    # wrote something. Only genuinely runaway sentences are worth flagging now.
    sentences = [s for s in re.split(r"[.!?]+", text) if s.strip()]
    for s in sentences:
        w = s.split()
        if len(w) > 55:
            hits.append(f"runaway sentence ({len(w)} words): {s.strip()[:60]}…")

    # The opposite problem, and the common one: staccato. If most sentences are very short,
    # the post reads as machine-written no matter how clean each line is.
    if len(sentences) >= 6:
        short = sum(1 for s in sentences if len(s.split()) <= 9)
        if short / len(sentences) > 0.45:
            hits.append(f"staccato: {short} of {len(sentences)} sentences under 10 words — "
                        "reads machine-written, needs longer joined-up sentences")
        avg = sum(len(s.split()) for s in sentences) / len(sentences)
        if avg < 15:
            hits.append(f"average sentence {avg:.0f} words — too clipped, aim for 20 to 40 "
                        "organised by commas and clauses")

    # Paragraph fragmentation. The real tell is not sentence length but a page of one-line
    # paragraphs: it looks disciplined and reads like a machine.
    paras = [p for p in re.split(r"\n\s*\n", text) if p.strip() and "···" not in p]
    if len(paras) >= 5:
        singles = sum(1 for p in paras
                      if len([s for s in re.split(r"[.!?]+", p) if s.strip()]) <= 1)
        if singles / len(paras) > 0.4:
            hits.append(f"fragmented: {singles} of {len(paras)} paragraphs are a single "
                        "sentence — join them into real paragraphs of 3 to 5")
    # hedge closers
    for c in ["hope this helps","let's build","lets build","dm us","click here"]:
        if c in low: hits.append(f"hedge/cliche closer: '{c}'")
    return hits

def main():
    if len(sys.argv) > 1:
        text = " ".join(sys.argv[1:])
    else:
        text = sys.stdin.read()
    hits = lint(text)
    if hits:
        print("VOICE VIOLATIONS:")
        for h in hits: print("  -", h)
        sys.exit(1)
    else:
        print("CLEAN ✔ no banned tells")
        sys.exit(0)

if __name__ == "__main__":
    main()
