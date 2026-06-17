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
}
