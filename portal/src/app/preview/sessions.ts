// CLASS SESSIONS — speakerId references CHARACTERS in /portal/src/lib/characters.ts

export type SessionExercise = {
  difficulty: "easy" | "medium" | "hard";
  title: string;
  speakerId: string;
  storyBeat: string;
  concept: string;
  instructions: string[];
  hint: string;
  successCriteria: string;
  xp: number;
};

export type BossFight = {
  title: string;
  speakerId: string;
  storyBeat: string;
  challenges: string[];
  timeLimitMinutes: number;
  reward: string;
  xp: number;
};

export type ClassSession = {
  contentId: string;
  program: "gdevelop" | "roblox";
  lessonNumber: number;
  title: string;
  tagline: string;
  bigIdea: string;
  /** Character who opens the lesson (id from CHARACTERS) */
  introCharacterId: string;
  storyIntro: string;
  /** Theme accent — used for badges, progress bar, buttons */
  accentColor: string;
  exercises: [SessionExercise, SessionExercise, SessionExercise];
  bossFight: BossFight;
};

import { gdevelopLesson1 } from "./sessions/gdevelop-l1";
import { robloxLesson1 } from "./sessions/roblox-l1";

export const CLASS_SESSIONS: ClassSession[] = [gdevelopLesson1, robloxLesson1];

export const SESSION_BY_CONTENT_ID: Record<string, ClassSession> =
  Object.fromEntries(CLASS_SESSIONS.map((s) => [s.contentId, s]));

