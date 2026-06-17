export interface Option {
  label: string
  correct: boolean
  explanation?: string
}

export interface QuizData {
  question: string
  options: Option[]
  xp?: number
}

export const QUIZZES: Record<string, QuizData> = {
  'genai-does-not-do': {
    question: 'Which of these does Generative AI NOT do?',
    xp: 10,
    options: [
      { label: 'Generate images from text descriptions', correct: false, explanation: 'This is core to GenAI — tools like Midjourney and DALL-E do exactly this.' },
      { label: 'Physically manufacture real-world objects', correct: true, explanation: 'Correct! GenAI creates digital content only — text, images, audio, video, code. It cannot print or build physical things.' },
      { label: 'Write and debug code', correct: false, explanation: 'GenAI is excellent at writing code — tools like GitHub Copilot and Claude do this constantly.' },
      { label: 'Compose original music', correct: false, explanation: 'Suno and Udio generate full music tracks from text prompts.' },
    ],
  },
  'fastest-web-app': {
    question: 'You want to build a habit-tracking web app. Which platform gets you there fastest?',
    xp: 10,
    options: [
      { label: 'Writing HTML/CSS from scratch', correct: false, explanation: 'This works but is the slowest approach with no AI help.' },
      { label: 'Bolt.new — describe the app and it scaffolds everything', correct: true, explanation: 'Correct! Bolt generates the full app from a description including database, backend, and UI.' },
      { label: 'Downloading a game engine', correct: false, explanation: 'Game engines are for games, not web apps.' },
      { label: 'Using Suno to generate music', correct: false, explanation: 'Suno makes music, not apps!' },
    ],
  },
  'rctf-missing-part': {
    question: 'A student wrote: "You are a game designer. Make me a level." Which R.C.T.F. part is missing the most?',
    xp: 10,
    options: [
      { label: 'Role — they never said who the AI should be', correct: false, explanation: '"You are a game designer" IS the Role. That part is covered.' },
      { label: 'Context & Format — no detail about the project, and no shape for the output', correct: true, explanation: 'Correct! There is no Context (what game? for whom?) and no Format (how long? what structure?). The Task is also vague. Great prompts answer all four.' },
      { label: 'Nothing — it is a perfect prompt', correct: false, explanation: 'It is far too vague. The AI has to guess almost everything.' },
      { label: 'It has too many parts', correct: false, explanation: 'The opposite — it is missing most of them.' },
    ],
  },
  'iterate-mindset': {
    question: 'You got your first AI image and it is "okay". What does a real creator do next?',
    xp: 10,
    options: [
      { label: 'Accept it — the first result is always the best', correct: false, explanation: 'The #1 beginner mistake. The first output is a starting point, not the finish line.' },
      { label: 'Give up and try a different tool', correct: false, explanation: 'Switching tools rarely fixes a weak prompt. Iterating does.' },
      { label: 'Send follow-up prompts to refine it — change lighting, angle, mood', correct: true, explanation: 'Correct! Pros iterate 10–20 times, refining one detail at a time until it is exactly right.' },
      { label: 'Blame the AI', correct: false, explanation: 'The result reflects the prompt. Better prompt, better result.' },
    ],
  },
  'genai-best-use': {
    question: 'Which task is Generative AI genuinely great at right now?',
    xp: 10,
    options: [
      { label: 'Drafting a script, then improving it with your direction', correct: true, explanation: 'Correct! AI is a brilliant first-draft partner. You steer, it generates, you refine.' },
      { label: 'Knowing today\u2019s exact weather without any tools', correct: false, explanation: 'AI does not know live facts unless connected to live data — it can confidently make things up.' },
      { label: 'Replacing your own judgement and taste', correct: false, explanation: 'Your taste is what makes the output good. AI generates; you decide what is great.' },
      { label: 'Guaranteeing every fact it states is true', correct: false, explanation: 'AI can "hallucinate". Always check important facts yourself.' },
    ],
  },
}
