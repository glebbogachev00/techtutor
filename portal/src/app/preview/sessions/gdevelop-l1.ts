import type { ClassSession } from "../sessions";

export const gdevelopLesson1: ClassSession = {
  contentId: "gdevelop-l1",
  program: "gdevelop",
  lessonNumber: 1,
  title: "The Broken Arcade",
  tagline: "Jason hacked every game in the arcade. Fix them, mission by mission.",
  bigIdea: "Events = conditions + actions. Master that, and you can fix any game.",
  introCharacterId: "captain-pixel",
  accentColor: "#DB2777",
  storyIntro:
    "Captain Pixel bursts in, dragging a smoking arcade cabinet. \"Jason hacked our arcade. The platform game is broken — the player won't jump, the coins are frozen, the enemy just stands there. The showcase is in one hour. You in?\"",
  exercises: [
    {
      difficulty: "easy",
      title: "Make the player jump again",
      speakerId: "captain-pixel",
      storyBeat:
        "\"Look — the jump event is already there. Jason just disabled it. One click and we're back.\"",
      concept: "Events can be turned on and off without deleting them.",
      instructions: [
        "Open the GDevelop project your teacher shared.",
        "Click the Events tab at the top.",
        "Find the event called 'Player Jump' — its tick is grey.",
        "Click the tick to enable it. It should turn blue.",
        "Press ▶ Play and tap Space — your character jumps.",
      ],
      hint: "Disabled events have a grey tick. Click it once to toggle to blue.",
      successCriteria: "Character jumps when you press Space or Up arrow.",
      xp: 80,
    },
    {
      difficulty: "medium",
      title: "Make the coins spin",
      speakerId: "bao",
      storyBeat:
        "\"Coins not spinning are just yellow squares. Let's give them life — animation playing the moment the scene starts.\"",
      concept: "Conditions trigger actions. 'At the start of the scene' is the simplest condition.",
      instructions: [
        "Find the Coin object in the right-side Objects panel.",
        "Open the Events tab and click '+ Add a new event'.",
        "Condition: 'At the beginning of the scene'.",
        "Action: Coin → Animations → Change the animation → 'Spin'.",
        "Tick the loop checkbox.",
        "Press ▶ Play — every coin should now spin smoothly.",
      ],
      hint: "Action: 'Change the animation' on Coin. Set to 'Spin' with loop enabled.",
      successCriteria: "All coins on the level spin in a continuous loop.",
      xp: 120,
    },
    {
      difficulty: "hard",
      title: "Fix the enemy patrol",
      speakerId: "professor-loop",
      storyBeat:
        "\"The enemy walks straight off the platform — too easy! We need true patrol behaviour: back and forth, like a guard.\"",
      concept: "Multiple conditions chain into one action. Collisions flip direction.",
      instructions: [
        "Select the Enemy object.",
        "In Events, find or create the 'Enemy Movement' group.",
        "Event 1 — Condition: Enemy in collision with Wall. Action: Flip Enemy horizontally.",
        "Event 2 — Condition: Enemy at the edge of a platform. Action: Flip Enemy horizontally.",
        "Press ▶ Play — the enemy patrols back and forth.",
      ],
      hint: "'Flip the object horizontally' is under Enemy → Actions. Pair it with a collision-with-Wall condition.",
      successCriteria: "Enemy reverses direction at walls and never falls off the platform.",
      xp: 200,
    },
  ],
  bossFight: {
    title: "Survive Jason's Trap Room",
    speakerId: "jason",
    storyBeat:
      "\"You fixed my sabotage? Cute. But the TRAP ROOM has three traps at once. Clock's ticking.\"",
    challenges: [
      "The platform has no collision — the player falls through. Enable the 'Platform' behaviour on the Platform object.",
      "Spikes deal no damage. Add an event: 'Player collides with Spike → remove 1 from PlayerHealth'.",
      "The score counter is stuck at 0. In the coin-collect event, add: 'Add 1 to variable Score, then modify ScoreText to be ToString(Score)'.",
    ],
    timeLimitMinutes: 8,
    reward: "Arcade Defender",
    xp: 240,
  },
};
