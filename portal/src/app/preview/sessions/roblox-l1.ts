import type { ClassSession } from "../sessions";

export const robloxLesson1: ClassSession = {
  contentId: "roblox-l1",
  program: "roblox",
  lessonNumber: 1,
  title: "Volcano Island Emergency",
  tagline: "Professor Loop's research station is melting. Rebuild the scripts.",
  bigIdea: "Properties on a Part = colour, size, transparency. Scripts change them to make games respond.",
  introCharacterId: "professor-loop",
  accentColor: "#DC2626",
  storyIntro:
    "Professor Loop appears on screen looking flustered. \"My research station on Volcano Island is in trouble. Someone broke the scripts — lava doesn't hurt anyone, the healing fountain does nothing, and the escape bridge is invisible. I need a young engineer. Are you in?\"",
  exercises: [
    {
      difficulty: "easy",
      title: "Make the lava deadly",
      speakerId: "professor-loop",
      storyBeat:
        "\"The Lava Part is still there — someone just changed the damage line to do nothing. One number, fixed.\"",
      concept: "OnTouch fires a function when a player steps on a Part.",
      instructions: [
        "Open the starter Roblox place your teacher shared, then click Edit.",
        "In the Explorer panel, find the Part named 'Lava'.",
        "Click the arrow next to it — there's a Script inside.",
        "Double-click the script to open it.",
        "Find: humanoid.Health = humanoid.Health",
        "Change to: humanoid.Health = humanoid.Health - 10",
        "Press Play and walk into the lava — your health drops.",
      ],
      hint: "Subtract 10 from humanoid.Health on every touch. The OnTouch event is already wired up.",
      successCriteria: "Touching the Lava part lowers the player's health.",
      xp: 80,
    },
    {
      difficulty: "medium",
      title: "Fix the healing fountain",
      speakerId: "bao",
      storyBeat:
        "\"Now the fountain! It's flipped — it's HURTING players instead of healing. And we need it to stop at 100 health, not heal forever.\"",
      concept: "if-statements let scripts make decisions before acting.",
      instructions: [
        "In Explorer, find the Part named 'Fountain' and open its Script.",
        "Change the health line so it ADDS health instead of subtracting.",
        "Wrap it in an if so it stops at 100:",
        "   if humanoid.Health < 100 then",
        "       humanoid.Health = humanoid.Health + 20",
        "   end",
        "Test: take lava damage, then touch the fountain — health goes up but stops at 100.",
      ],
      hint: "Wrap the healing line in an if statement. Condition: humanoid.Health < 100. Don't forget the closing 'end'.",
      successCriteria: "Touching the fountain restores health, but never above 100.",
      xp: 140,
    },
    {
      difficulty: "hard",
      title: "Un-hide the escape bridge",
      speakerId: "captain-pixel",
      storyBeat:
        "\"The bridge is invisible AND you fall through it. Two property changes and the path off the island reopens.\"",
      concept: "Scripts can change a Part's properties on the fly.",
      instructions: [
        "In Explorer, find the Part named 'Bridge' and open its Script.",
        "The script is empty (just a comment). Add these two lines:",
        "   script.Parent.Transparency = 0",
        "   script.Parent.CanCollide = true",
        "Press Play — the bridge appears and you can walk across it.",
      ],
      hint: "Transparency 0 = visible. CanCollide true = solid. script.Parent refers to the Bridge Part itself.",
      successCriteria: "The bridge is visible and the player can walk across it.",
      xp: 200,
    },
  ],
  bossFight: {
    title: "The Eruption Protocol",
    speakerId: "the-professor",
    storyBeat:
      "\"Eruption sequence activated. Lava rocks are raining from the sky. Script them — or the island is lost!\"",
    challenges: [
      "Find the LavaRock part in the Workspace. Add an OnTouch script that deals 15 damage (same pattern as the Lava exercise).",
      "Make each LavaRock disappear 3 seconds after spawn. Use: task.wait(3) then script.Parent:Destroy()",
      "Add a ScreenGui to StarterGui with a TextLabel 'You survived!' that appears after 30 seconds. Use task.wait(30) before showing it.",
    ],
    timeLimitMinutes: 8,
    reward: "Volcano Survivor",
    xp: 280,
  },
};
