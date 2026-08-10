#!/Library/Developer/CommandLineTools/usr/bin/python3
"""
TechBash Clip Pipeline — v1 (local, no API key, no freetype/PIL needed)
- Watches inbox/ for .mov/.mp4
- Clips to N seconds, scales to vertical 9:16, adds TechBash blue bar
- Caption text is NOT burned (ffmpeg build lacks freetype); it goes in post copy
- Outputs: outbox/<name>-45s.mp4 (raw) + branded/<name>-branded.mp4
- Prints caption request for Hermes (OAuth) to fill platform copy

Usage: env -u PYTHONPATH python3 clip.py <input_file> [--duration 45]
"""
import os, subprocess, argparse, json

BASE = os.path.expanduser("~/Documents/techtutor/clips")
INBOX = os.path.join(BASE, "inbox")
OUTBOX = os.path.join(BASE, "outbox")
BRANDED = os.path.join(BASE, "branded")

def get_duration(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                        "format=duration", "-of", "json", path],
                       capture_output=True, text=True)
    return float(json.loads(r.stdout)["format"]["duration"])

def clip(input_path, duration=45):
    name = os.path.splitext(os.path.basename(input_path))[0]
    total = get_duration(input_path)
    clip_dur = min(duration, total)
    start = max(0, total / 2 - clip_dur / 2)

    out_mp4 = os.path.join(OUTBOX, f"{name}-45s.mp4")
    out_branded = os.path.join(BRANDED, f"{name}-branded.mp4")

    # raw trim (stream copy, fast)
    subprocess.run(["ffmpeg", "-y", "-ss", str(start), "-i", input_path,
                    "-t", str(clip_dur), "-c", "copy", out_mp4],
                   capture_output=True)

    # branded: 9:16 scale+pad + blue caption bar (drawbox, no freetype)
    vf = ("scale=1080:1920:force_original_aspect_ratio=decrease,"
          "pad=1080:1920:(ow-iw)/2:(oh-ih)/2,"
          "drawbox=y=ih-200:w=iw:h=200:color=0x193B92@0.85:t=fill")
    cmd = ["ffmpeg", "-y", "-ss", str(start), "-i", input_path,
           "-t", str(clip_dur), "-vf", vf,
           "-c:a", "aac", "-c:v", "libx264", "-preset", "fast",
           "-pix_fmt", "yuv420p", out_branded]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("[WARN] branded step failed:\n", res.stderr[-400:])
    else:
        print(f"[OK] Branded: {out_branded}")
    print(f"[OK] Raw: {out_mp4}")
    return out_branded, out_mp4

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--duration", type=int, default=45)
    args = ap.parse_args()
    branded, raw = clip(args.input, args.duration)
    print("\n--- CAPTION REQUEST ---")
    print(f"File: {branded}")
    print("Paste into Hermes: 'Write YT Shorts + TikTok + FB + VN captions for this student project clip'")
