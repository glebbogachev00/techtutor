# TechTutor Voice Spec

The single source of truth for how TechTutor sounds. Every caption the studio
drafts (and every post Gleb writes) is checked against this before it ships.
Purpose: a voice a Vietnamese parent trusts — calm, concrete, never salesy.

## The one sentence

We sound like a founder who actually teaches kids to build things, talking to a
parent he respects — not a brand account, not a brochure, not an influencer.

## Principles (non-negotiable)

1. **Concrete over abstract.** Name the kid, the age, the thing they built, the
   moment it clicked. "Minh, 10, built a water-reminder app for his brother" beats
   "students build real projects." Show, don't summarize.
2. **No hype.** No "revolutionary," "world-class," "seamless," "empower,"
   "unlock potential." No exclamation-mark enthusiasm. Quiet confidence only.
3. **No marketing triads.** Not "faster, cheaper, better." One true point per
   sentence. If you need three examples, make them specific, not a slogan set.
4. **First person, human.** "I started TechTutor because…" not "TechTutor believes."
   The founder is the voice. Reddit AMAs and founder posts lead with the person.
5. **Respect the skeptic.** Myth-busters name the doubt fairly first ("I get why
   people think coding for kids is babysitting"), then dismantle with evidence.
   Never condescend to a parent who's unsure.
6. **Contrarian but fair.** Take the obvious belief and add the nuance ("screen time
   isn't one thing — watching a video and building one are opposites"). This is the
   value-post signature.
7. **Soft CTA, always.** Trial-class link in comments, not "ENROLL NOW." Low pressure.
   Confidence about the offer, never pushy.
8. **Formatting is the message, but air is not the message.** Never a wall of text, and
   never the opposite either. The old version of this rule said one idea per line with a
   blank line between every beat, and that was wrong: followed literally it produces short
   sentence, full stop, short sentence, full stop, which is the clearest sign in 2026 that
   a machine wrote something. Write proper paragraphs of three to five sentences, with long
   sentences organised by commas and clauses, and break for air where a break actually
   means something. Open with a hook that stands on its own. A draft that is one solid block
   has failed; so has a draft that is thirty single-line paragraphs.

## Banned tells (lint these)

- em dash (—) in prose captions
- emoji
- bold/markdown headers in plain captions
- "!" enthusiasm, hype adjectives (seamless, robust, powerful, cutting-edge,
  effortless, world-class, next-gen, revolutionary, empower, unlock)
- rule-of-three slogan triads ("fun, fast, effective")
- hedge closers ("hope this helps!", "let's build the future together")
- "As a [parent/teacher], I know…" filler
- passive voice where the actor is known
- **staccato** — a run of short declarative sentences each on its own line. This is the
  main thing to lint for now. Long sentences are fine and usually better; badly organised
  ones are the actual problem, not long ones.
- balanced antithesis ("keeps climbing, so he keeps going; let it flatten and he sets it
  down", "pitched to hold him, not to look like studying") — the same tell as "not just X
  but Y" in a different coat
- every paragraph ending on a tidy summarising clause
- generic praise of the child without a specific detail

## Voice by platform

- **Facebook (VN parents):** warm, conversational, concrete. VN-first. One real
  story, one soft CTA. 2–4 short sentences. Parent reads on a phone at 9pm.
- **Instagram (VN parents, real project videos):** even shorter. The video carries
  it; caption is a one-line hook + soft CTA. No wall of text.
- **Reddit (builders/educators, EN):** teach something real. Text post, lead with
  the person, answer in comments. No CTA in the body — link only in profile.
  Be specific and technical; Reddit smells promotion and punishes it.
- **Founder Voice (any):** first person, reflective, specific origin. Sincere, not
  earnest. The "I" is the brand.

## Bilingual handling

- Default draft: **Vietnamese first**, English second. Audience is mostly VN parents.
- VN voice follows the same principles — concrete, no hype, soft CTA. Avoid VN
  marketing clichés ("hàng đầu", "tiên phong", "đột phá") the same way we avoid EN
  ones. Keep it plain: "con bạn sẽ tự làm ra một ứng dụng" not "khóa học đột phá."
- Translation is NOT word-for-word. The EN and VN say the same true thing in each
  language's natural rhythm.
- For Reddit/EN-audience types, skip VN.

## How the studio uses this

The `/generate` route drafts against these rules. After drafting, run the lint pass
(emoji / em-dash / hype-words / triads / sentence-length). Anything flagged is
shown to Gleb to fix before post. The voice is enforced by review, not by hoping
the model got it.

## Examples (good vs slop)

GOOD (FB, EN) — note the formatting: short beats, blank line between each, easy to scan:

Parents ask me this often: my child isn't strong at maths, can they still learn to code?

It's a fair question. Code looks like equations, so the assumption makes sense.

But maths and programming use different parts of the brain.

Khoa, 9, struggled with every maths worksheet his teacher handed him. He also spent two hours one afternoon hunting down a bug in his own game, with nobody asking him to.

The difference was that he wanted the game to work.

Coding teaches you to solve problems, not to calculate.

Come try a trial class and see for yourself. Link in comments.

GOOD (FB, VN):
"Tối qua con gái tôi mở laptop để hoàn thiện trò chơi nó bắt đầu ở lớp. Tuần này nó
viết lại bằng Python, vì Scratch đã thành quá dễ. Bé 10 tuổi. Link lớp thử ở comment."

SLOP:
"🚀 Khóa học coding đột phá — giúp con bạn trở thành creator thực thụ! Đăng ký ngay
hôm nay để unlock tiềm năng! 🔥"

GOOD (Reddit, EN):
"I run a small coding school for 7–17s in Vietnam. A 9yo spent three classes
convinced her game was broken. It wasn't — she'd flipped two coordinates. Here's the
actual bug and what it taught her about debugging."

SLOP:
"We're excited to announce our world-class coding program that empowers the next
generation of young innovators! Ask me anything!"
