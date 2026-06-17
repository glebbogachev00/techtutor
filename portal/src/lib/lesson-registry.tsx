// Lesson registry for Programs.
// Each lesson is structured exactly like a TechBash mission:
//   characterId → story → why → concept → sections → task → live AI chat
// No static slides — all lessons use the interactive workspace format.

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  level: number;
  xp: number;
}

export interface LessonSection {
  heading: string;
  content?: string;
  items?: { name: string; desc: string }[];
  tip?: string;
}

export interface LessonMission {
  characterId: string;
  story: string;
  why: string;
  concept: string;
  example?: string;
  sections?: LessonSection[];
  task: string;
  goal?: string;
  kind?: "chat";
  starterPrompt?: string;
}

export interface LessonEntry {
  meta: LessonMeta;
  mission: LessonMission;
}

export interface ProgramEntry {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  color: string;
  colorLight: string;
  ages: string;
  storyIntro: string;
  castIds: string[]; // character IDs from lib/characters.ts shown in "Meet the cast"
  /** Story-role intro per character, matching the missions cast style. */
  castIntros?: Record<string, string>;
  levels: {
    number: number;
    title: string;
    tier: "Beginner" | "Intermediate" | "Advanced";
    description: string;
    color: string;
    project: { number: number; title: string; emoji: string };
  }[];
  lessons: LessonEntry[];
}

// ── Generative AI Magic ───────────────────────────────────────────────────────

export const PROGRAMS: ProgramEntry[] = [
  {
    slug: "generative-ai-magic",
    title: "Generative AI Magic",
    tagline: "From zero to AI founder in 24 lessons",
    description:
      "Over 24 lessons and 6 signature projects, you'll go from understanding how AI works to shipping a hero-card pack, a web app, two games, an educational experience, and a full Discord community app.",
    emoji: "✨",
    color: "#7C3AED",
    colorLight: "#F5F3FF",
    ages: "10–15",
    storyIntro:
      "Six months from now you'll have shipped a pack of AI-designed trading cards, a web app, two games, an educational experience, and a full Discord community app. Not drafts. Not homework. Real things people can actually use. Captain Pixel is your guide. Bao is your partner. And the clock starts now.",
    castIds: ["captain-pixel", "bao", "mochi", "storm", "jason", "the-professor"],
    castIntros: {
      "captain-pixel": "Your mentor at the studio",
      "bao": "Your partner on every project",
      "mochi": "The studio's hype-bot",
      "storm": "The pro who shows up when it counts",
      "jason": "The tycoon who says AI makes you useless",
      "the-professor": "The mastermind betting you'll quit",
    },
    levels: [
      {
        number: 1,
        title: "The Founder's Origin",
        tier: "Beginner",
        description: "Master prompting, visuals, and audio — then ship your first Hero Card pack.",
        color: "#7C3AED",
        project: { number: 1, title: "Hero Card Pack", emoji: "🃏" },
      },
      {
        number: 2,
        title: "The Builder Rises",
        tier: "Intermediate",
        description: "Build AI-powered web apps and your first 2D game.",
        color: "#0891B2",
        project: { number: 2, title: "GenAI Web App + 2D Game", emoji: "🕹️" },
      },
      {
        number: 3,
        title: "The Creator's Masterclass",
        tier: "Advanced",
        description: "Go 3D, build immersive experiences, and ship a Discord app with PWA.",
        color: "#059669",
        project: { number: 3, title: "3D Game + Discord App + PWA", emoji: "🌐" },
      },
    ],
    lessons: [
      {
        meta: {
          slug: "01-founders-journey",
          title: "Welcome to Generative AI Magic",
          description:
            "Your tour of every platform, tool, and skill you'll master across 24 lessons and 6 real projects.",
          duration: "90 min",
          order: 1,
          level: 1,
          xp: 150,
        },
        mission: {
          characterId: "captain-pixel",
          story:
            "Founder, listen up. Six months from now you'll have shipped an AI-generated trailer, a real web app, two games, an educational experience, and a full Discord community app. Not sketches. Not homework. Real things people can actually use. This is Lesson 1 — your tour of every platform and skill you're about to own. Pay attention.",
          why: "Every platform you're about to learn — AI video, games, websites — responds to one thing: a great prompt. Your prompting skill determines the quality of everything you create. That's what we master first, right here, right now.",
          concept:
            "The secret weapon is called R.C.T.F. Every great prompt has four parts:\n\n• Role — tell the AI who it is. e.g. 'You are a Hollywood trailer writer...'\n• Context — tell it about you and the project. e.g. '...for a 13-year-old making a school film about AI...'\n• Task — give it a specific job. e.g. '...write a 60-second dramatic voiceover script...'\n• Format — describe the output. e.g. '...with short punchy sentences and a call to action at the end.'\n\nBiggest mistake: accepting the first output. Real creators send 10–20 follow-up prompts before they're happy.",
          example:
            "Role: You are a Hollywood trailer voiceover writer.\nContext: I'm a 13-year-old creating a school film about AI changing the world.\nTask: Write a dramatic 60-second voiceover script for my trailer.\nFormat: Short punchy sentences. End with a call to action.",
          sections: [
            {
              heading: "🎬 AI Video Platforms",
              content: "Your first project is an AI-generated trailer — a real cinematic short. These are the tools you'll use:",
              items: [
                { name: "Runway ML", desc: "The industry standard for AI video. Type a description, upload an image, get a clip. Used by professional filmmakers." },
                { name: "Kling AI", desc: "Exceptional at realistic motion and character movement. Great for dramatic scenes." },
                { name: "Luma Dream Machine", desc: "Specialises in 3D-style video and camera movement. Stunning cinematic shots." },
                { name: "Suno / Udio", desc: "Generate music from text. Describe a mood and tempo, get a real soundtrack in seconds." },
              ],
              tip: "The quality of your AI video is 80% prompting, 20% tool.",
            },
            {
              heading: "🕹️ Game Platforms",
              content: "Projects 3 and 4 are games — and you'll build them faster than you think.",
              items: [
                { name: "GDevelop", desc: "Uses events instead of code. Build a full platformer or shooter without writing a single line." },
                { name: "Construct 3", desc: "Browser-based, professional-grade. Used by indie studios worldwide." },
                { name: "Roblox Studio", desc: "Build 3D worlds with a built-in audience of 80 million daily players." },
              ],
            },
            {
              heading: "🌐 Website & App Platforms",
              content: "Project 2 is a real web app. These tools make it possible:",
              items: [
                { name: "Cursor", desc: "A code editor with AI built in. Describe what you want, it writes the code." },
                { name: "v0 by Vercel", desc: "Generate full UI components from a text description. Instant working React code." },
                { name: "Bolt.new", desc: "Full-stack apps from a single prompt — database, backend, frontend, all scaffolded." },
              ],
            },
          ],
          task: "Pick ONE platform from the list above. Write a full R.C.T.F. prompt for something you'd actually want to make with it — a trailer, a game concept, or an app idea. Then send it in the AI chat and see what you get.",
          goal: "Your prompt should clearly include all four R.C.T.F. parts: Role, Context, Task, and Format.",
          kind: "chat",
          starterPrompt: "Role: You are a...\nContext: I'm a student who wants to...\nTask: ...\nFormat: ...",
        },
      },

      // ── Lesson 2 ────────────────────────────────────────────────────────────
      {
        meta: {
          slug: "02-master-the-prompt",
          title: "Master the Prompt",
          description:
            "The pros never accept the first answer. Learn the iterate-and-refine loop that turns a good prompt into a great one.",
          duration: "90 min",
          order: 2,
          level: 1,
          xp: 120,
        },
        mission: {
          characterId: "bao",
          story:
            "Pixel makes it look easy, but here's the secret she didn't tell you: her first prompt is almost never her last. I've watched her rewrite a single trailer line fifteen times before she smiles. Today I'm handing you the exact loop the pros use — the one that separates 'kinda cool' from 'whoa, how did you make that?'",
          why: "Anyone can type a prompt. The skill that actually makes you a creator is iteration — reading what the AI gave you, spotting what's missing, and steering it closer with each follow-up. Master this loop now and every tool in this program becomes ten times more powerful.",
          concept:
            "The Iterate Loop has four moves you repeat until it's right:\n\n• Generate — send your best R.C.T.F. prompt.\n• Diagnose — name exactly what's wrong. 'Too long.' 'Wrong mood.' 'Too generic.'\n• Steer — give ONE clear instruction to fix it. Change one thing at a time.\n• Repeat — keep going. Pros run 10–20 loops without blinking.\n\nThree power moves that supercharge steering:\n• 'Give me 3 versions' — compare options instead of judging one.\n• 'Make it more ___ / less ___' — dial a single quality up or down.\n• 'Keep everything but change ___' — lock what works, fix what doesn't.",
          example:
            "You: Write a dramatic 1-line tagline for my AI trailer.\nAI: 'The future is here.'\nYou: Too generic. Make it more mysterious and mention a kid inventor.\nAI: 'One kid. One machine. A future nobody saw coming.'\nYou: Love it. Give me 3 more in that exact style.",
          sections: [
            {
              heading: "🔁 Why the first answer is a trap",
              content:
                "The AI's first reply is its safest, most average guess. It's a starting point, not a finish line. Treating it as final is the #1 beginner mistake.",
              items: [
                { name: "Generic = unfinished", desc: "If it could describe anyone's project, it isn't yours yet. Add specifics until it can only be about your idea." },
                { name: "One change at a time", desc: "Change five things at once and you won't know what helped. Steer with a single adjustment per loop." },
                { name: "Save the winners", desc: "When a line or image is great, copy it somewhere safe before you keep experimenting." },
              ],
              tip: "Treat the AI like a talented intern: clear feedback in, brilliant work out.",
            },
            {
              heading: "🎛️ Steering phrases that always work",
              content: "Keep these on a sticky note. They work in every AI tool you'll touch this program.",
              items: [
                { name: "More / less", desc: "'Make it more cinematic.' 'Make it less cheesy.' Dials a quality without rewriting everything." },
                { name: "In the style of", desc: "'In the style of a movie trailer.' Borrows a whole vibe in four words." },
                { name: "Give me options", desc: "'Show me 3 directions.' Turns one guess into a menu you choose from." },
              ],
            },
          ],
          task: "Start with a weak prompt on purpose — something vague like 'write a trailer line.' Then run the Iterate Loop at least 4 times in the chat, steering one change per message, until the line gives you chills.",
          goal: "Show a clear before-and-after: a generic first answer, then a sharp, specific final version reached through at least 4 steering follow-ups.",
          kind: "chat",
          starterPrompt: "Write a tagline for my trailer.",
        },
      },

      // ── Lesson 3 ────────────────────────────────────────────────────────────
      {
        meta: {
          slug: "03-ai-image-magic",
          title: "AI Image Magic",
          description:
            "Turn words into stunning visuals. Master image prompting — subject, style, lighting, and camera — to design every frame of your trailer.",
          duration: "90 min",
          order: 3,
          level: 1,
          xp: 120,
        },
        mission: {
          characterId: "storm",
          story:
            "Most people type 'a cool robot' and wonder why it looks like clip art. I don't do clip art. Every image in my trailer is designed — lighting, angle, mood, all of it. Today I'm teaching you to think like an art director, not a tourist. By the end you'll generate frames good enough to freeze and frame.",
          why: "Your trailer is built from images. Before anything moves, you need killer still frames — the hero shot, the wide establishing shot, the dramatic close-up. Strong image prompts give you strong video later. Weak images can't be saved.",
          concept:
            "Great image prompts stack five ingredients in order:\n\n• Subject — who or what, with specifics. 'A young inventor in a glowing workshop.'\n• Style — the art direction. 'Cinematic, photorealistic, Pixar-style, anime, watercolour…'\n• Lighting — sets the whole mood. 'Golden hour, neon glow, dramatic rim light.'\n• Camera — the shot type. 'Wide establishing shot, extreme close-up, low angle.'\n• Details — the finishing touch. 'Volumetric fog, shallow depth of field, 8k.'\n\nStack them and you go from 'a robot' to 'a weathered robot standing in golden-hour light, cinematic wide shot, shallow depth of field.'",
          example:
            "Subject: A 13-year-old inventor holding a glowing AI core.\nStyle: Cinematic, photorealistic, blockbuster movie still.\nLighting: Dramatic blue rim light in a dark workshop.\nCamera: Low-angle hero shot.\nDetails: Volumetric light, sparks in the air, shallow depth of field.",
          sections: [
            {
              heading: "🎨 The image tools you'll use",
              content: "These turn text into pictures. Each has a personality — try the same prompt in two and compare.",
              items: [
                { name: "Midjourney", desc: "The most cinematic, artistic results. Incredible for moody, dramatic trailer frames." },
                { name: "Leonardo AI", desc: "Free-friendly and great for characters and game-style art. Generous daily credits." },
                { name: "DALL·E (in ChatGPT)", desc: "Easiest to steer with plain conversation — just describe changes and it edits." },
                { name: "Ideogram", desc: "The best at putting readable text inside images — perfect for trailer titles and logos." },
              ],
              tip: "Generate 4 versions of every shot and pick the strongest. Quantity feeds quality.",
            },
            {
              heading: "📐 Aspect ratio = the difference between amateur and pro",
              content: "Trailers are widescreen. Tell the tool the shape you need or your frames won't fit your video.",
              items: [
                { name: "16:9 — cinematic", desc: "Standard widescreen for trailers and YouTube. Use this for almost every frame." },
                { name: "9:16 — vertical", desc: "For TikTok / Shorts / Reels cut-downs of your trailer." },
                { name: "1:1 — square", desc: "For thumbnails, posters, and social posts about your film." },
              ],
            },
            {
              heading: "🚫 Fixing the usual messes",
              content: "AI images have classic glitches. Here's how to steer around them.",
              items: [
                { name: "Weird hands", desc: "Add 'detailed hands' or hide them — 'hands in pockets', 'holding an object'." },
                { name: "Too busy", desc: "Add 'simple background, minimal' so your subject pops." },
                { name: "Looks fake", desc: "Add 'photorealistic, natural lighting, film grain' to ground it." },
              ],
            },
          ],
          task: "Design ONE hero frame for your trailer. Write a full 5-ingredient image prompt (Subject, Style, Lighting, Camera, Details) at 16:9, then refine it twice in the chat until it's frame-worthy.",
          goal: "Your final image prompt should clearly include all five ingredients and a 16:9 aspect ratio.",
          kind: "chat",
          starterPrompt: "Subject: ...\nStyle: cinematic, photorealistic\nLighting: ...\nCamera: ...\nDetails: ...\nAspect ratio: 16:9",
        },
      },

      // ── Lesson 4 ────────────────────────────────────────────────────────────
      {
        meta: {
          slug: "04-still-to-cinematic",
          title: "From Still to Cinematic",
          description:
            "Bring your images to life. Use image-to-video AI to add camera moves, motion, and drama — the moving shots of your trailer.",
          duration: "90 min",
          order: 4,
          level: 1,
          xp: 130,
        },
        mission: {
          characterId: "captain-pixel",
          story:
            "Here's where it gets real, founder. Those still frames you designed? We're about to make them MOVE. A slow push toward the inventor's eyes. Sparks drifting through the air. A camera that pulls back to reveal the whole machine. This is the moment your project stops being pictures and starts being a film.",
          why: "A trailer is motion. Image-to-video tools take a still you already love and animate it — camera moves, atmosphere, subtle action. Because you start from a frame you control, you keep the look you designed instead of rolling the dice on pure text-to-video.",
          concept:
            "Animating a still is about describing MOTION, not the scene (the image already shows the scene). Two motion layers:\n\n• Camera motion — how the lens moves. 'Slow push in, pull back, pan left, crane up, orbit around.'\n• Subject motion — what moves in the frame. 'Sparks drift, hair blows, eyes blink, smoke rises.'\n\nGolden rule: keep it SUBTLE and SHORT. Small, believable motion over 3–5 seconds looks cinematic. Big, fast motion looks broken. Generate several clips per shot and keep the cleanest one.",
          example:
            "Image: your low-angle hero shot of the inventor.\nMotion prompt: Slow cinematic push-in toward the inventor's face. Sparks drift gently through the air. Subtle blue light flickering. Camera barely moving, dramatic and slow.",
          sections: [
            {
              heading: "🎥 The video tools you'll use",
              content: "Each takes an image plus a motion description and returns a short clip.",
              items: [
                { name: "Runway ML (Gen-3)", desc: "The pro standard. Best control over camera moves and consistent motion." },
                { name: "Kling AI", desc: "Stunning realistic movement, especially faces and bodies. Generous free clips." },
                { name: "Luma Dream Machine", desc: "Gorgeous 3D-feeling camera moves. Brilliant for sweeping establishing shots." },
                { name: "Pika", desc: "Fast and playful, great for quick experiments and fun effects." },
              ],
              tip: "Always generate 3–4 versions of a shot. AI motion is unpredictable — pick the clean take.",
            },
            {
              heading: "🎬 Camera moves that feel like a real trailer",
              content: "Borrow these straight from Hollywood. Each one sells a different emotion.",
              items: [
                { name: "Slow push-in", desc: "Builds tension and focus. Perfect for a reveal or an emotional beat." },
                { name: "Pull-back reveal", desc: "Starts tight, widens to show the whole world. Great opening or ending shot." },
                { name: "Low orbit", desc: "Circles the hero slowly. Makes any subject look epic and important." },
              ],
            },
          ],
          task: "Take the hero frame you designed in Lesson 3 and write a motion prompt for it. Describe ONE camera move and ONE subtle subject motion, kept short and cinematic. Refine it in the chat until it reads like a real trailer shot.",
          goal: "Your motion prompt should describe a specific camera move plus a subtle subject motion, and stay short (3–5 seconds).",
          kind: "chat",
          starterPrompt: "Animate this image: [describe your hero frame].\nCamera move: ...\nSubject motion: ...\nKeep it subtle, slow and cinematic.",
        },
      },

      // ── Lesson 5 ────────────────────────────────────────────────────────────
      {
        meta: {
          slug: "05-sound-and-score",
          title: "Sound & Score",
          description:
            "Music is half of every trailer. Use AI to compose an original soundtrack and rhythm that makes your visuals hit hard.",
          duration: "90 min",
          order: 5,
          level: 1,
          xp: 130,
        },
        mission: {
          characterId: "mochi",
          story:
            "Okay okay okay — this is MY lesson and I'm so hyped! 🎵 Wanna know the trailer secret nobody talks about? Mute the sound on any movie trailer and it falls apart. The MUSIC is what gives you goosebumps. Today we make YOUR soundtrack — original, epic, made just for your film. Let's GO!",
          why: "Music controls emotion and pacing. The right track tells the audience how to feel and gives your editor a rhythm to cut to. With AI you can compose a custom, copyright-safe soundtrack in minutes instead of hunting for a track that 'kinda works.'",
          concept:
            "Prompting music means describing four things — no notes required:\n\n• Mood — the emotion. 'Epic, mysterious, hopeful, tense, triumphant.'\n• Genre — the style. 'Cinematic orchestral, electronic, hybrid trailer, lo-fi.'\n• Instruments — the texture. 'Booming drums, soft piano, rising strings, deep brass.'\n• Structure — the journey. 'Slow build, then a huge drop at the climax.'\n\nTrailer music almost always BUILDS: quiet and curious → growing tension → massive hit at the end. Describe that arc and the AI will follow it.",
          example:
            "A cinematic orchestral trailer track. Mysterious and hopeful mood. Soft piano and a ticking sound build slowly, then booming drums and rising strings explode into a triumphant climax. Epic, emotional, modern movie-trailer style.",
          sections: [
            {
              heading: "🎶 The music tools you'll use",
              content: "Describe a vibe, get a real track with melody and instruments in seconds.",
              items: [
                { name: "Suno", desc: "The most popular AI music tool. Full songs or instrumentals from a text description — even lyrics if you want them." },
                { name: "Udio", desc: "Exceptional audio quality and realistic instruments. Great for cinematic scores." },
                { name: "ElevenLabs", desc: "Best-in-class AI voices — perfect for your trailer's dramatic voiceover narration." },
              ],
              tip: "Generate an INSTRUMENTAL for trailers — no lyrics fighting your voiceover.",
            },
            {
              heading: "🗣️ Don't forget the voice",
              content: "Many trailers ride on a voiceover. AI can narrate your script in a cinematic voice.",
              items: [
                { name: "Write the line first", desc: "Use your RCTF skills to script a 2–3 sentence dramatic voiceover." },
                { name: "Pick a voice", desc: "Deep and dramatic for epic trailers; warm and bright for hopeful ones." },
                { name: "Match the music", desc: "Time the voiceover to land in the quiet part, before the music drops." },
              ],
            },
          ],
          task: "Compose your trailer's soundtrack. Write a music prompt describing Mood, Genre, Instruments, and a build-to-climax Structure that matches your film. Refine it in the chat until the description gives you chills.",
          goal: "Your music prompt should name a mood, genre, instruments, and a structure that builds to a climax.",
          kind: "chat",
          starterPrompt: "An instrumental cinematic trailer track.\nMood: ...\nGenre: ...\nInstruments: ...\nStructure: slow build, then a huge climax at the end.",
        },
      },

      // ── Lesson 6 ────────────────────────────────────────────────────────────
      {
        meta: {
          slug: "06-write-your-trailer",
          title: "Write Your Trailer",
          description:
            "Turn your idea into a plan. Build a script, shot list, and storyboard so every clip, line, and beat has a job.",
          duration: "90 min",
          order: 6,
          level: 1,
          xp: 130,
        },
        mission: {
          characterId: "bao",
          story:
            "You've got images, motion, and music — incredible. But scatter them with no plan and you get noise, not a trailer. The pros write it down first. A great 60-second trailer is engineered beat by beat. Today we build the blueprint so editing later feels like assembling a kit, not wrestling chaos.",
          why: "A storyboard and shot list are the bridge between your assets and a finished film. They tell you exactly which shots to generate, what each line says, and where the music swells — so you stop guessing and start building with intention.",
          concept:
            "A killer 60-second trailer follows a 4-beat structure:\n\n• The Hook (0–10s) — one striking image and a question. Grab them instantly.\n• The Build (10–35s) — show the world and the stakes. Tension rises, cuts get faster.\n• The Climax (35–50s) — the biggest shot, the music drop, the reveal.\n• The Title Card (50–60s) — your film's name and a final punch line.\n\nYour tools for the plan:\n• Script — the voiceover or on-screen text, beat by beat.\n• Shot list — every clip you need, in order, with its motion.\n• Storyboard — quick sketches or your AI frames laid out in sequence.",
          example:
            "Beat 1 Hook (0–8s): Wide shot of a dark workshop. VO: 'They said a kid couldn't change the world.'\nBeat 2 Build (8–35s): Inventor builds the AI core, faster cuts. VO: 'They were wrong.'\nBeat 3 Climax (35–50s): The core ignites, music drops, low orbit shot.\nBeat 4 Title (50–60s): Title card — 'THE SPARK.' VO: 'Coming this year.'",
          sections: [
            {
              heading: "🧠 Let AI co-write the plan",
              content: "Use your prompting skills to draft and refine the whole blueprint.",
              items: [
                { name: "Script the voiceover", desc: "Ask for a 60-second trailer script with the 4-beat structure, then iterate the lines until they hit." },
                { name: "Generate the shot list", desc: "Ask the AI to turn your script into a numbered shot list with a camera move for each beat." },
                { name: "Plan the music cues", desc: "Mark exactly where the track builds and where it drops so editing lines up." },
              ],
              tip: "Number your shots. 'Shot 4' is way faster to find than 'the part with the sparks.'",
            },
            {
              heading: "🗺️ Storyboard like a director",
              content: "A storyboard is just your shots in order. It catches problems before you waste time animating.",
              items: [
                { name: "One box per shot", desc: "Sketch or paste your AI frame, write the line and the motion underneath." },
                { name: "Read it like a flipbook", desc: "Flow boxes left to right — does the story make sense without sound?" },
                { name: "Cut the weak ones", desc: "If a shot doesn't push the story forward, delete it. Trailers are tight." },
              ],
            },
          ],
          task: "Write the full blueprint for YOUR trailer: a 4-beat script (Hook, Build, Climax, Title) plus a numbered shot list with a camera move for each shot. Draft it with the AI, then refine until every beat earns its place.",
          goal: "Your plan should include all 4 beats with script lines and a numbered shot list that names a camera move per shot.",
          kind: "chat",
          starterPrompt: "Help me write a 60-second trailer for my film about [your idea]. Use a 4-beat structure (Hook, Build, Climax, Title Card) with a voiceover line and a numbered shot list. Make it dramatic.",
        },
      },

      // ── Lesson 7 ────────────────────────────────────────────────────────────
      {
        meta: {
          slug: "07-assemble-in-canva",
          title: "Assemble in Canva",
          description:
            "Bring it all together. Edit your clips, music, voiceover, and titles into one polished trailer using Canva's video editor.",
          duration: "90 min",
          order: 7,
          level: 1,
          xp: 140,
        },
        mission: {
          characterId: "jason",
          story:
            "I've shipped products that millions of people use, and I'll tell you the truth: ideas are cheap, finishing is everything. You've got the clips, the score, the script. Now we ASSEMBLE — clips on the timeline, music underneath, titles on top, cuts on the beat. This is the lesson where your trailer becomes real.",
          why: "Editing is where scattered assets become a single experience. Canva's timeline is free, browser-based, and beginner-friendly — drag clips, drop your soundtrack, snap your titles, and cut to the rhythm of the music. No expensive software required.",
          concept:
            "Editing a trailer in Canva is a layered timeline:\n\n• Track 1 — Video. Drop your clips in story order, trimmed to their best 2–4 seconds.\n• Track 2 — Music. One continuous soundtrack running underneath everything.\n• Track 3 — Voiceover. Your AI narration, placed in the quiet gaps.\n• Track 4 — Text. Title cards, captions, and the final logo, animated in.\n\nThe one technique that makes it feel pro: CUT ON THE BEAT. Trim each clip so the change happens exactly when the music hits. Your eyes and ears lock together and it feels cinematic.",
          example:
            "Timeline: clip 1 (workshop, 3s) → clip 2 (building, 2s) → clip 3 (faster cuts) → BIG climax clip on the music drop → title card 'THE SPARK' with a fade-in. Soundtrack runs the whole way; voiceover sits in the quiet intro.",
          sections: [
            {
              heading: "🛠️ Your Canva editing toolkit",
              content: "Everything you need lives in Canva's free video editor.",
              items: [
                { name: "Upload your assets", desc: "Drag in your AI clips, soundtrack, and voiceover from the Uploads panel." },
                { name: "Trim & split", desc: "Click a clip and drag its edges, or split it, to keep only the strongest seconds." },
                { name: "Text & titles", desc: "Add animated text for your title card and captions. Pick a bold, cinematic font." },
                { name: "Transitions", desc: "A simple fade or cut between clips. Use them sparingly — fast cuts feel more like a trailer." },
              ],
              tip: "Less is more: quick, clean cuts beat fancy transitions every time.",
            },
            {
              heading: "🎯 The pro polish checklist",
              content: "Run through these before you call it done.",
              items: [
                { name: "Cut on the beat", desc: "Line up at least your biggest cut with the music's drop. Instant pro feel." },
                { name: "Match the lengths", desc: "Trailer should be 30–60s. Trim anything that drags." },
                { name: "Readable titles", desc: "Big text, on screen long enough to read twice, high contrast against the video." },
                { name: "Balanced audio", desc: "Music shouldn't drown the voiceover. Duck the music when the voice speaks." },
              ],
            },
          ],
          task: "Plan your Canva edit. Write the exact timeline order of your clips, where the music drop lands, where your voiceover sits, and where the title card appears. Use the chat to pressure-test your cut and tighten the pacing.",
          goal: "Your edit plan should lay out clip order, the beat you cut on, the voiceover placement, and the title card.",
          kind: "chat",
          starterPrompt: "Here's my trailer edit plan: [list your clips in order]. The music drops at [time]. My voiceover says [line]. The title card is [name]. Help me tighten the pacing and decide where to cut on the beat.",
        },
      },

      // ── Lesson 8 ────────────────────────────────────────────────────────────
      {
        meta: {
          slug: "08-premiere-night",
          title: "Premiere Night",
          description:
            "Ship it. Export your finished trailer, write a title and description, and launch your first real Generative AI project to the world.",
          duration: "90 min",
          order: 8,
          level: 1,
          xp: 200,
        },
        mission: {
          characterId: "the-professor",
          story:
            "Remarkable. Eight lessons ago you couldn't write a prompt — now you have a trailer with original visuals, motion, music, and a story. But a film no one sees is just a file. Tonight is Premiere Night. We export it, we package it, and we release it. A creator is someone who SHIPS. Welcome to the club.",
          why: "Finishing and publishing is the skill that turns a student into a creator. Exporting cleanly, writing a title and description that make people click, and putting your work where others can see it — this is how real projects earn an audience and how you build a portfolio.",
          concept:
            "Shipping has three stages:\n\n• Export — render the final video. 1080p, MP4, 16:9. Watch it back start to finish before anything else.\n• Package — write a clickable title, a short description, and design a thumbnail (your strongest frame plus the title text).\n• Publish — put it where people are: YouTube, your class showcase, a share link to family. Then ask for feedback.\n\nA great launch post answers three things fast: what is it, why should I watch, and what made it special (made with AI by you).",
          example:
            "Title: THE SPARK — An AI-Made Trailer 🎬\nDescription: A 60-second cinematic trailer about a kid inventor who changes the world. Every shot, sound, and score was created with generative AI — written, designed, and edited by me. Made in 8 lessons at TechTutor.\nThumbnail: the climax frame + bold 'THE SPARK' title.",
          sections: [
            {
              heading: "📦 Export it right the first time",
              content: "A clean export keeps all your hard work looking sharp.",
              items: [
                { name: "1080p MP4", desc: "Download as MP4 at 1080p (Full HD), 16:9. The universal, high-quality format." },
                { name: "Watch it fully", desc: "Play the whole export once. Catch any silent gaps, abrupt cuts, or audio spikes." },
                { name: "Keep your project", desc: "Don't delete the Canva project — you'll want it for v2 after feedback." },
              ],
              tip: "Always export AFTER a final watch-through. You'll catch one thing every time.",
            },
            {
              heading: "🚀 Make people want to click",
              content: "Packaging is prompting for humans. Use everything you learned to sell the watch.",
              items: [
                { name: "A title with a hook", desc: "Short, intriguing, and it teases the story. Add one emoji, not five." },
                { name: "A thumbnail that pops", desc: "Your boldest frame plus the title in big, readable text. This earns the click." },
                { name: "Tell the AI story", desc: "Mention it's fully AI-made by you — that's what makes people share it." },
              ],
            },
            {
              heading: "🏆 You've shipped Project 1",
              content: "Look at what you can now do — and where you're headed next.",
              items: [
                { name: "You mastered prompting", desc: "RCTF, iteration, and prompting for images, video, music, and writing." },
                { name: "You shipped a real film", desc: "A complete trailer with original assets, edited and published. That's a portfolio piece." },
                { name: "Next: you become a builder", desc: "Level 2 turns these prompting powers toward real web apps and your first 2D game." },
              ],
            },
          ],
          task: "Package your premiere. Write the final title, a 2–3 sentence description, and a thumbnail plan (which frame + what text) for your trailer. Refine the title and description in the chat until you'd genuinely click it.",
          goal: "You should produce a clickable title, a short description that mentions it's AI-made by you, and a clear thumbnail plan.",
          kind: "chat",
          starterPrompt: "Help me package my AI trailer for launch.\nTitle: ...\nDescription (2–3 sentences, mention it's made with AI by me): ...\nThumbnail: which frame + what text?",
        },
      },
    ],
  },
];

export function getProgram(slug: string): ProgramEntry | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export function getLesson(
  programSlug: string,
  lessonSlug: string,
): LessonEntry | undefined {
  return getProgram(programSlug)?.lessons.find((l) => l.meta.slug === lessonSlug);
}
