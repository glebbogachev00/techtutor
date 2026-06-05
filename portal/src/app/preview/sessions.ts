// ─────────────────────────────────────────────────────────────────────────────
// CLASS SESSIONS
// Each session is one live class. The teacher unlocks stages in real-time;
// students see the exercises appear. Static content lives here; dynamic state
// (scheduled_at, zoom_url, unlocked_stage) lives in Supabase class_sessions.
// ─────────────────────────────────────────────────────────────────────────────

export type SessionExercise = {
  difficulty: "easy" | "medium" | "hard";
  /** Short emoji label shown on the exercise card */
  emoji: string;
  title: string;
  /** Story line shown above the exercise to set the scene */
  storyBeat: string;
  /** Step-by-step instructions for the student */
  instructions: string[];
  /** Code hint or snippet — shown inside a collapsible */
  hint: string;
  /** What the student should observe when it's working */
  successCriteria: string;
};

export type BossFight = {
  title: string;
  storyBeat: string;
  /** Challenges the student must fix / build */
  challenges: string[];
  timeLimitMinutes: number;
  reward: string; // badge name
};

export type ClassSession = {
  /** Matches the static slug used in the URL: /preview/session/[contentId] */
  contentId: string;
  program: "gdevelop" | "roblox";
  lessonNumber: number;
  title: string;
  /** Short intro text shown before class starts */
  storyIntro: string;
  /** Character delivering the intro */
  introCharacter: string;
  introCharacterEmoji: string;
  accentColor: string;
  exercises: [SessionExercise, SessionExercise, SessionExercise]; // always 3
  bossFight: BossFight;
};

// ─────────────────────────────────────────────────────────────────────────────
// GDevelop Lesson 1 — "The Broken Arcade"
// ─────────────────────────────────────────────────────────────────────────────
const gdevelopLesson1: ClassSession = {
  contentId: "gdevelop-l1",
  program: "gdevelop",
  lessonNumber: 1,
  title: "The Broken Arcade",
  accentColor: "#DB2777",
  introCharacter: "Captain Pixel",
  introCharacterEmoji: "🎮",
  storyIntro:
    "Captain Pixel bursts into the room carrying a smoking arcade cabinet. \"Jason hacked the academy arcade! The platform game is completely broken — the player can't jump, the coins are frozen, and the enemies just stand there. We need to fix it before the showcase tonight. You in?\"",
  exercises: [
    {
      difficulty: "easy",
      emoji: "🟢",
      title: "Make the player jump again",
      storyBeat:
        "Captain Pixel points at the screen. \"Look — the jump event is there, but it's switched off. Jason just disabled it! One click and we're back in business.\"",
      instructions: [
        "Open the starter GDevelop project your teacher shared.",
        "Click the Events tab at the top.",
        "Find the event called 'Player Jump'. It has a grey checkbox — it's disabled.",
        "Click the checkbox to re-enable it. It should turn blue.",
        "Press the Play button (▶) and test — your character should jump when you press Space or Up arrow.",
      ],
      hint: "Disabled events have a grey tick on the left. Enabled events have a blue tick. Click it once to toggle.",
      successCriteria:
        "Character jumps when you press Space or the Up arrow key.",
    },
    {
      difficulty: "medium",
      emoji: "🟡",
      title: "Make the coins spin",
      storyBeat:
        "\"The player can jump again — great! But look at those coins. They're completely still. A coin that doesn't spin is just a yellow square. Let's fix the animation.\"",
      instructions: [
        "Find the Coin object in the Objects panel on the right.",
        "The coin has a 'Spin' animation already set up — it just never starts.",
        "In the Events tab, add a new event.",
        "Set the condition to: 'At the beginning of the scene'.",
        "Set the action to: 'Play animation \"Spin\" on Coin' and check 'repeat'.",
        "Playtest — coins should now spin continuously.",
      ],
      hint: "Use 'At the beginning of the scene' as the condition. Under Actions, look for 'Change the animation' under the Coin object. Set it to 'Spin' with loop enabled.",
      successCriteria: "All coins on screen spin in a continuous loop.",
    },
    {
      difficulty: "hard",
      emoji: "🔴",
      title: "Fix the enemy patrol",
      storyBeat:
        "\"Coins spinning, player jumping — but look at that enemy. It just walks off the edge and vanishes. A broken enemy makes the game too easy. We need it to patrol back and forth.\"",
      instructions: [
        "Select the Enemy object in the Objects panel.",
        "Go to the Events tab and find the 'Enemy Movement' group.",
        "You'll see the enemy moves right — but there's no event to flip direction when it hits a wall.",
        "Add a new event: Condition = 'Enemy is in collision with Wall', Action = 'Flip Enemy horizontally'.",
        "Also add: Condition = 'Enemy is at the edge of the platform', Action = 'Flip Enemy horizontally'.",
        "Playtest — the enemy should now bounce back and forth.",
      ],
      hint: "Under the Enemy's actions, look for 'Flip the object horizontally'. The condition 'Object is in collision with another object' lets you choose Wall as the target.",
      successCriteria:
        "Enemy reverses direction when it hits a wall and never falls off the platform.",
    },
  ],
  bossFight: {
    title: "Survive Jason's Trap Room",
    storyBeat:
      "Jason's voice crackles over the speaker. \"You fixed my sabotage? Impressive. But can you handle the TRAP ROOM? Three problems. All at once. Clock's ticking.\" A new broken scene loads...",
    challenges: [
      "The platform has no collision — the player falls through it. Fix it by enabling the 'Solid' option on the Platform object.",
      "The spike hazard doesn't reduce player health. Add an event: 'Player collides with Spike → remove 1 life'.",
      "The score counter is stuck at 0. Find the coin-collect event and add the action: 'Add 1 to variable Score, update ScoreText'.",
    ],
    timeLimitMinutes: 8,
    reward: "Arcade Defender",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Roblox Lesson 1 — "Volcano Island Emergency"
// ─────────────────────────────────────────────────────────────────────────────
const robloxLesson1: ClassSession = {
  contentId: "roblox-l1",
  program: "roblox",
  lessonNumber: 1,
  title: "Volcano Island Emergency",
  accentColor: "#DC2626",
  introCharacter: "Professor Loop",
  introCharacterEmoji: "🌋",
  storyIntro:
    "Professor Loop appears on screen looking flustered. \"My research station on Volcano Island is in trouble. Someone broke all the scripts — the lava doesn't hurt anyone, the healing fountain does nothing, and the escape bridge is invisible. I need a young engineer. Are you in?\"",
  exercises: [
    {
      difficulty: "easy",
      emoji: "🟢",
      title: "Make the lava deadly",
      storyBeat:
        "\"The lava Part exists — it just has a broken script inside it. Someone changed the damage line to do nothing. One word fix and this island is dangerous again.\"",
      instructions: [
        "Open the starter Roblox place your teacher shared — click Edit.",
        "In the Explorer panel, find the Part named 'Lava'.",
        "Click the arrow next to it — you'll see a Script inside.",
        "Double-click the script to open it.",
        "Find this line:  humanoid.Health = humanoid.Health",
        "Change it to:  humanoid.Health = humanoid.Health - 10",
        "Press Play to test — walk into the lava and your health should drop.",
      ],
      hint: "The script already has the OnTouch event set up. You just need to change the one line that sets Health. Subtract 10 instead of nothing.",
      successCriteria:
        "Walking into the Lava part reduces the player's health bar.",
    },
    {
      difficulty: "medium",
      emoji: "🟡",
      title: "Fix the healing fountain",
      storyBeat:
        "\"Great — lava works! Now the healing fountain is broken too. It's supposed to restore health, but someone flipped the sign. And we need to make sure it can't heal you above 100.\"",
      instructions: [
        "In the Explorer, find the Part named 'Fountain'.",
        "Open its Script.",
        "Change the health line to ADD health instead of subtract:",
        "   humanoid.Health = humanoid.Health + 20",
        "Now add a condition so it doesn't go over 100:",
        "   if humanoid.Health < 100 then",
        "       humanoid.Health = humanoid.Health + 20",
        "   end",
        "Test: take damage from lava, then touch the fountain — health should recover.",
      ],
      hint: "Wrap the healing line inside an if statement. The condition is humanoid.Health < 100. Don't forget the 'end' to close the if block.",
      successCriteria:
        "Touching the fountain increases health but never above 100.",
    },
    {
      difficulty: "hard",
      emoji: "🔴",
      title: "Un-hide the escape bridge",
      storyBeat:
        "\"Almost done! The escape bridge exists in the game — it's just completely invisible and you fall through it. Two property changes and the path off the island reopens.\"",
      instructions: [
        "In the Explorer, find the Part named 'Bridge'.",
        "Click the arrow next to Bridge — find the Script inside.",
        "The script is empty (just a comment). Add these two lines:",
        "   script.Parent.Transparency = 0",
        "   script.Parent.CanCollide = true",
        "Press Play — the bridge should appear and you should be able to walk on it.",
      ],
      hint: "Transparency = 0 makes it fully visible (1 = invisible). CanCollide = true means your character stands on it instead of falling through.",
      successCriteria:
        "The bridge is visible and the player can walk across it.",
    },
  ],
  bossFight: {
    title: "The Eruption Protocol",
    storyBeat:
      "The volcano rumbles. Professor Loop shouts: \"I accidentally activated the eruption sequence! Lava rocks are falling from the sky. Script them — or the island is lost!\" Three tasks. Eight minutes.",
    challenges: [
      "Find the LavaRock part in the workspace. Add a script that deals 15 damage on touch (same pattern as the Lava exercise).",
      "Make each LavaRock disappear 3 seconds after it spawns. Use: task.wait(3) then script.Parent:Destroy()",
      "Add a ScreenGui to StarterGui with a TextLabel that says 'You survived!' — make it appear after 30 seconds using task.wait(30).",
    ],
    timeLimitMinutes: 8,
    reward: "Volcano Survivor",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
export const CLASS_SESSIONS: ClassSession[] = [gdevelopLesson1, robloxLesson1];

export const SESSION_BY_CONTENT_ID: Record<string, ClassSession> =
  Object.fromEntries(CLASS_SESSIONS.map((s) => [s.contentId, s]));
