export type StoryBeat = {
  character: "Captain Pixel" | "Bao" | "Mochi" | "Professor Loop";
  text: string;
};

export type Mission = {
  n: number;
  title: string;
  blurb: string;
  xp: number;
  story: StoryBeat;
  why: string;
  concept: string;
  example?: string;
  task: string;
  starter: string;
  language: "html" | "python";
};

export type Track = {
  id: "web" | "python";
  name: string;
  tagline: string;
  accent: string;
  storyIntro: string;
  missions: Mission[];
};

export const CHARACTERS = {
  "Captain Pixel": {
    color: "#193b92",
    role: "Your mentor at the Academy",
    avatar: "/characters/captain-pixel.png",
  },
  Bao: {
    color: "#2C7A7B",
    role: "Your classmate and partner-in-crime",
    avatar: "/characters/bao.png",
  },
  Mochi: {
    color: "#E89F47",
    role: "The Academy's clumsy robot pet",
    avatar: "/characters/mochi.png",
  },
  "Professor Loop": {
    color: "#7C3AED",
    role: "The brilliant (and very forgetful) Python professor",
    avatar: "/characters/professor-loop.png",
  },
} as const;

export const TRACKS: Track[] = [
  {
    id: "web",
    name: "Web Development",
    tagline: "Build real web pages from scratch.",
    accent: "#193b92",
    storyIntro:
      "Buckle up, recruit. Last night the internet sneezed and half the websites in the world fell off. Pages, gone. Buttons, missing. Captain Pixel paced the command deck all night and finally said: 'We need new builders. Smart ones. Brave ones.' Then she looked straight at you. So... yeah. No pressure.",
    missions: [
      {
        n: 1,
        title: "Your first page",
        blurb: "Write your first HTML and meet the browser.",
        xp: 50,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Alright, recruit — listen up. Every website you've ever loved is built from one secret ingredient: HTML. Today you write your very first page. Just one tiny page. Put your name on it so I can pin it to the Wall of New Builders. (Yes, that's a real wall. I made it last week.)",
        },
        why: "Every website you've ever visited — YouTube, your favorite game, your school site — is made of HTML. Once you know it, you can build your own corner of the internet.",
        concept:
          "HTML is the language web pages are made of. Every page lives inside <html> tags. A heading goes inside <h1> tags. Whatever you put between the opening <h1> and closing </h1> shows up big and bold on the page.",
        example: `<h1>This is a heading</h1>\n<p>This is a paragraph.</p>`,
        task: "Change the text between the <h1> tags to your own name.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>Hello, world!</h1>
  <p>This is my very first webpage.</p>
</body>
</html>`,
      },
      {
        n: 2,
        title: "Headings and paragraphs",
        blurb: "Structure a page like a real document.",
        xp: 60,
        language: "html",
        story: {
          character: "Bao",
          text: "Pssst. Over here. So... Captain Pixel told me to build an 'About Me' page, and honestly? Mine looks like a sad noodle. One heading. One sentence. THAT'S IT. Can you help me jazz it up before she sees it? I'm begging you, fellow recruit.",
        },
        why: "Good structure is what makes a page easy to read. Without headings, everything looks like one giant wall of text — boring AND confusing. The worst combo.",
        concept:
          "Pages have different sizes of headings: <h1> is the biggest, then <h2>, then <h3>. Paragraphs of text go inside <p> tags. Together they make your page easy to read.",
        example: `<h1>Big title</h1>\n<h2>Smaller title</h2>\n<p>Some text.</p>`,
        task: "Add a second heading (h2) and one more paragraph below it.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>About me</h1>
  <p>I am learning to build websites.</p>
</body>
</html>`,
      },
      {
        n: 3,
        title: "Add a picture",
        blurb: "Use the img tag and learn about file paths.",
        xp: 70,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. BEEP-boop. Mochi has a confession. Mochi tripped over a cable and the Academy mascot picture went POOF. Captain Pixel will be SO mad. Quick — put any picture on the page. A kitten. A dragon. A sandwich. Mochi will accept any of these. Especially the sandwich.",
        },
        why: "Text is fine, but pictures make pages come alive. Every meme, every photo, every game screenshot you see online is just an <img> tag hiding in plain sight.",
        concept:
          "Images live on the web at a URL — like an address. The <img> tag tells the browser to fetch a picture from that address. The src says where to find it, the alt describes it for people who can't see it.",
        example: `<img src="https://example.com/cat.jpg" alt="A cat" />`,
        task: "Change the image src to any other URL you like.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>My pet</h1>
  <img src="https://placekitten.com/300/200" alt="A cute kitten" />
</body>
</html>`,
      },
      {
        n: 4,
        title: "Links",
        blurb: "Connect your page to the rest of the web.",
        xp: 80,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Good work so far, recruit. Now — the Academy is building a directory page. Think of it like a hallway full of magic doors, and every door leads somewhere useful. There's one door already. I need you to add another that leads home to techtutor.academy. Make it count.",
        },
        why: "Links are what make the web a WEB. Without them, you'd have one lonely page, by itself, forever. Links are how every page in the world holds hands.",
        concept:
          "Links use the <a> tag. The href tells the browser where to go when someone clicks. Whatever text is inside the tag becomes the clickable part.",
        example: `<a href="https://techtutor.academy">Visit TechTutor</a>`,
        task: "Add a second link that points to techtutor.academy.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>My links</h1>
  <a href="https://google.com">Visit Google</a>
</body>
</html>`,
      },
      {
        n: 5,
        title: "Lists",
        blurb: "Show items in a tidy list.",
        xp: 80,
        language: "html",
        story: {
          character: "Bao",
          text: "Okay, story time. I tried to make a 'My Favorites' page and only wrote ONE thing on it. Music. The whole page just stares at you like, 'is that... it?' YES THAT'S IT, BAO. Anyway. Can you add three more favorites so I look like a person with personality?",
        },
        why: "Menus, top-10 charts, shopping carts, navigation bars — almost every list on the web is built with these two tags. They're tiny but they're EVERYWHERE.",
        concept:
          "A bulleted list uses <ul> on the outside and <li> for each item. You can put as many <li> items as you want — the browser adds the bullets for you, like a fancy little waiter.",
        example: `<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n</ul>`,
        task: "Add three more list items — your favorite foods.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>My favorites</h1>
  <ul>
    <li>Music</li>
  </ul>
</body>
</html>`,
      },
      {
        n: 6,
        title: "Color magic",
        blurb: "Use CSS to make the page truly yours.",
        xp: 100,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEEP! Mochi has done it again. Mochi tried to carry a paint bucket. Mochi should not be allowed to carry paint buckets. Now the Academy's colors are all wrong. The heading needs to be teal — #2C7A7B — and the background needs to be plain white. Save Mochi from being grounded. PLEASE.",
        },
        why: "HTML gives a page its bones. CSS gives it its style. Without CSS, every website on Earth would look like a 1995 school project. Yikes.",
        concept:
          "CSS is how we style a page. We write rules inside <style> tags. Each rule picks an element (like h1) and changes things about it — color, size, background, anything you can imagine.",
        example: `<style>\n  h1 { color: red; }\n  body { background: yellow; }\n</style>`,
        task: "Change the heading color to teal (#2C7A7B) and the background to white.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #FAFAFA; font-family: sans-serif; padding: 40px; text-align: center; }
    h1   { color: #193b92; }
  </style>
</head>
<body>
  <h1>Hello, world!</h1>
  <p>Change my colors.</p>
</body>
</html>`,
      },
      {
        n: 7,
        title: "A real button",
        blurb: "Style a button and make it pop.",
        xp: 110,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit. Our 'Press Me' button is so boring people walk straight past it. Yesterday I watched seven people ignore it. SEVEN. Style this button. Give it your favorite color. Make it so loud and proud that no one in the galaxy can miss it.",
        },
        why: "Every 'Sign up' or 'Buy now' button you've ever clicked was designed by someone using CSS. A good button is the difference between people clicking and people leaving.",
        concept:
          "Buttons get their look from CSS. You can give them a class (like 'btn') and then style that class — set the background color, the padding, the rounded corners, the whole vibe.",
        example: `<style>\n  .btn { background: blue; color: white; padding: 10px; }\n</style>\n<button class="btn">Click</button>`,
        task: "Change the button background to your favorite color.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 40px; text-align: center; }
    .btn {
      background: #193b92; color: white;
      padding: 12px 28px; border: none; border-radius: 50px;
      font-weight: 600; cursor: pointer;
    }
  </style>
</head>
<body>
  <button class="btn" onclick="alert('Hi!')">Press me</button>
</body>
</html>`,
      },
      {
        n: 8,
        title: "Buttons that do things",
        blurb: "Your first line of JavaScript.",
        xp: 130,
        language: "html",
        story: {
          character: "Bao",
          text: "WAIT. Wait wait wait. Captain Pixel just told me pages can actually DO things. Like, you click a button and stuff HAPPENS? My brain is melting. She says you're ready for this. So let's make a button that changes the page when we click it. I'm so hyped.",
        },
        why: "HTML and CSS make a page LOOK right. JavaScript is what makes it actually DO things — games, calculators, chat apps, anything you can dream up. This is where the magic starts.",
        concept:
          "JavaScript makes pages do things. We can find an element by its id, then change what's inside it. onclick runs code when a button is pressed.",
        example: `<h1 id="title">Hi</h1>\n<button onclick="document.getElementById('title').textContent='Hello!'">\n  Click\n</button>`,
        task: "Make the button change the heading text to something fun when clicked.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1 id="title">Click the button</h1>
  <button onclick="document.getElementById('title').textContent='Hello!'">
    Press me
  </button>
</body>
</html>`,
      },
      {
        n: 9,
        title: "Mini project: profile card",
        blurb: "Combine everything into one finished page.",
        xp: 200,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Final mission of the chapter, recruit. Every member of the Academy gets a personal profile card pinned to the main wall. Yours is the only one missing — and frankly, it's been bothering me. Build it. Your name, a photo, three things you love. This is YOU. Make us proud.",
        },
        why: "Real developers don't use one skill at a time — they mash them all together. This is your chance to put everything you've learned into one thing you can actually show off.",
        concept:
          "You've learned headings, paragraphs, images, links, lists, CSS, and JavaScript. Now combine them. A profile card is a small box on a page that shows the world who you are.",
        task: "Build a card with your name, a photo, and three things you like.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #FAFAFA; padding: 40px; }
    .card {
      max-width: 320px; margin: auto; background: white;
      border-radius: 16px; padding: 24px; text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Your name</h2>
    <p>Tell us about yourself...</p>
  </div>
</body>
</html>`,
      },
    ],
  },
  {
    id: "python",
    name: "Python",
    tagline: "Learn the language behind games and AI.",
    accent: "#2C7A7B",
    storyIntro:
      "Deep in the basement of the Academy lives Professor Loop. He's a genius. He's also forgotten where he put his coffee three times today. His Python lab is full of half-finished inventions and he desperately needs an assistant who can actually remember things. Enter: you. Try not to let him wander off mid-sentence.",
    missions: [
      {
        n: 1,
        title: "Hello, Python",
        blurb: "Your first line of Python.",
        xp: 50,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Ah! A new assistant! Wonderful, wonderful. Now — where was I? Oh, yes. Every great Python adventure begins with one tiny word: hello. Type it. Print it. Then put your name in there too, so I have a fighting chance of remembering who you are tomorrow.",
        },
        why: "Python runs YouTube, Instagram, NASA experiments, and most AI tools on the planet. It's also one of the easiest languages to read — almost like English. Lucky you.",
        concept:
          "print() is how Python talks. Whatever you put inside the parentheses (and quotes) gets shown on the screen. Strings — which are just fancy words for words — go inside quotes.",
        example: `print("Hello!")`,
        task: "Change the message to print your name.",
        starter: `print("Hello, world!")`,
      },
      {
        n: 2,
        title: "Variables",
        blurb: "Store information for later.",
        xp: 60,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "I once had an assistant. His name was Alex. Or maybe Alec? Anyway — I keep typing his name everywhere and my fingers hurt. Teach the computer to REMEMBER a name for me, so I never have to type it twice. Oh, and how old are you? Save that too. I will absolutely forget by Tuesday.",
        },
        why: "Every app you've ever used stores things — your score, your username, your high level, your friends list. Variables are how programs remember stuff for you.",
        concept:
          "A variable is a name we give to a value, so we can use it again later. The equals sign means 'store this value under this name'. Like a labeled jar.",
        example: `name = "Alex"\nprint(name)`,
        task: "Create a variable called age, give it a number, and print it.",
        starter: `name = "Alex"\nprint("My name is", name)`,
      },
      {
        n: 3,
        title: "Doing math",
        blurb: "Python is a really fast calculator.",
        xp: 70,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP! Professor Loop asked Mochi what 7 times 8 is. Mochi rolled across the floor and bumped into a chair. Professor Loop said 'that's not an answer.' Mochi disagrees. But also — could YOU make Python solve it? Save Mochi's dignity. What's left of it.",
        },
        why: "Computers were literally invented to do math fast. Games, scientific simulations, even Instagram filters — they're all just millions of math problems happening per second.",
        concept:
          "Python understands +, -, * (times), and / (divide). You can mix numbers and operators just like in math class, then print() the answer.",
        example: `print(10 * 3)\nprint(20 - 5)`,
        task: "Print the result of 7 multiplied by 8.",
        starter: `print(2 + 2)`,
      },
      {
        n: 4,
        title: "If this, then that",
        blurb: "Make Python make decisions.",
        xp: 90,
        language: "python",
        story: {
          character: "Bao",
          text: "Okay so I wrote this program that's SUPPOSED to figure out if someone's a kid or a teenager. But it says 'kid' for EVERYONE. Even me. I am clearly a teenager. I have opinions about music. Help me fix it before it insults the whole Academy.",
        },
        why: "Every smart program is just a long list of decisions. 'If the player presses jump, then jump.' 'If the password is correct, log in.' This is where programs start to feel alive.",
        concept:
          "if checks whether something is true. If yes, the indented code runs. Otherwise, the else code runs. The colon and the indentation are important — Python uses them to know what belongs together.",
        example: `score = 85\nif score >= 50:\n    print("passed")\nelse:\n    print("try again")`,
        task: "Change the age so the message says 'teenager'.",
        starter: `age = 8\nif age < 13:\n    print("kid")\nelse:\n    print("teenager")`,
      },
      {
        n: 5,
        title: "Loops",
        blurb: "Do the same thing many times.",
        xp: 100,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "They call me Professor LOOP for a reason, you know. I LOVE counting. Counting is my joy. The current program counts from 1 to 5, but I distinctly remember asking for 1 to 10. Or was it 1 to 100? No, 10. Definitely 10. Fix it before I forget what I was counting in the first place.",
        },
        why: "Computers are amazing at boring, repeated tasks. Loops are how you tell them to do something a hundred — or a million — times without copy-pasting until your fingers fall off.",
        concept:
          "for ... in range(a, b) repeats a block of code. The variable (usually called i) takes each number from a up to (but not including) b.",
        example: `for i in range(1, 4):\n    print(i)\n# prints 1, 2, 3`,
        task: "Make the loop count from 1 to 10 (so it should print 1 through 10).",
        starter: `for i in range(1, 6):\n    print(i)`,
      },
      {
        n: 6,
        title: "Lists",
        blurb: "Keep many things in one box.",
        xp: 110,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP! Mochi loves colors. ALL the colors. Professor Loop only gave Mochi two — red and blue — and Mochi cried tiny robot tears. Please add two more colors to Mochi's list. Pick good ones. Mochi will judge you. Lovingly. But still.",
        },
        why: "A playlist, a contact list, a list of enemies in a game — programs are stuffed with lists. Without them, you'd need a separate variable for every single item. Nightmare fuel.",
        concept:
          "A list holds many values in order, inside square brackets. You can loop through a list with for, and the variable takes each item one at a time.",
        example: `fruits = ["apple", "banana", "pear"]\nfor f in fruits:\n    print(f)`,
        task: "Add two more colors to the list and print them all.",
        starter: `colors = ["red", "blue"]\nfor c in colors:\n    print(c)`,
      },
      {
        n: 7,
        title: "Functions",
        blurb: "Teach Python a new trick.",
        xp: 130,
        language: "python",
        story: {
          character: "Bao",
          text: "I built a greeting function and I was SO proud. Then I noticed it only ever greets 'World'. Which, you know, fine, but a little impersonal? Change the call so it greets one of your actual friends by name. Make it warm. Make it real.",
        },
        why: "Functions are how big programs are built. Instead of writing the same code over and over, you wrap it up once and reuse it forever. Every app you've ever used is thousands of functions calling each other like a busy phone system.",
        concept:
          "A function is a reusable piece of code with a name. We define it with def, give it parameters in parentheses, and then call it whenever we want.",
        example: `def add(a, b):\n    print(a + b)\n\nadd(2, 3)`,
        task: "Change the function call so it greets your friend by name.",
        starter: `def greet(name):\n    print("Hello, " + name)\n\ngreet("World")`,
      },
      {
        n: 8,
        title: "Mini project: dice roll",
        blurb: "Use randomness to build a tiny game.",
        xp: 200,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Final experiment of the chapter! I am inventing a board game. A glorious board game. It needs dice — but inside Python. We already roll one die, which is technically a die, but for a real game I need FIVE rolls in a row. Build the loop. You will have created an actual, real, working game tool. I might even remember your name afterwards.",
        },
        why: "Random numbers are everywhere in games — dice rolls, card shuffles, loot drops, enemy spawns. Once you can generate them, you can build your own games.",
        concept:
          "import lets us borrow extra Python tools. random.randint(a, b) gives us a random whole number between a and b. Combine that with a loop and suddenly you have a dice game.",
        example: `import random\nprint(random.randint(1, 6))`,
        task: "Roll the dice 5 times in a loop and print each result.",
        starter: `import random\nprint(random.randint(1, 6))`,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ADVENTURE MODE
// Each planet has citizens with a real (silly) need. The recruit reads the
// brief and builds a project to solve it. Less hand-holding than missions.
// ─────────────────────────────────────────────────────────────────────────────

export type ScaffoldStep = {
  line: string; // raw line(s) to append to the editor
  note: string; // short in-character explanation
};

export type Quest = {
  id: string;
  planet: string;
  emoji?: never;
  glyph: string; // single character or short symbol used as a planet badge
  accent: string;
  client: keyof typeof CHARACTERS | "Citizens of the planet";
  tagline: string;
  brief: string; // longer in-character story / problem statement
  needs: string[]; // checklist of acceptance criteria
  hint?: string;
  reward: number;
  language: "html" | "python";
  starter: string;
  // "Ask Captain for help" reveals one step at a time when starting from scratch.
  scaffold?: ScaffoldStep[];
  blank?: string; // optional blank-canvas seed (defaults to minimal doc)
};

export const ADVENTURES: Quest[] = [
  {
    id: "lumen",
    planet: "Planet Lumen",
    glyph: "L",
    accent: "#193b92",
    client: "Bao",
    tagline: "Build a birthday card webpage for Bao's grandma.",
    brief:
      "Okay so — it's my grandma's birthday next week and I PROMISED her I'd make a webpage for her. A whole one! With her name on it. And a sweet message. And a picture of something she likes (she likes lotus flowers and cats, in that order). I cannot show up empty-handed. She will roast me. Lovingly, but still.",
    needs: [
      "An <h1> with grandma's name (you pick a name)",
      "At least one paragraph wishing her a happy birthday",
      "An image (cats or lotus flowers — your call)",
      "A soft, warm background color (not pure white)",
    ],
    hint: "Use <style> inside <head> to set body { background: ... }.",
    reward: 150,
    language: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 40px; }
  </style>
</head>
<body>
  <h1>Happy Birthday!</h1>
  <p>Wishing you the best day ever.</p>
</body>
</html>`,
    scaffold: [
      { line: "<!DOCTYPE html>", note: "Every webpage starts with this — tells the browser 'this is HTML.'" },
      { line: "<html>", note: "Everything on the page goes between <html> and </html>." },
      { line: "<head>\n  <style>\n    body { background: #FFF4E6; font-family: sans-serif; padding: 40px; }\n  </style>\n</head>", note: "Soft peach background — Bao said warm, so we go warm." },
      { line: "<body>", note: "Now we open the part the visitor actually sees." },
      { line: "  <h1>Happy Birthday, Grandma!</h1>", note: "The big headline. Swap in her real name." },
      { line: "  <p>Eighty years young and still cooler than all of us.</p>", note: "A warm message — rewrite in your own voice." },
      { line: '  <img src="https://placekitten.com/300/200" alt="A sweet cat" />', note: "A cat picture, because Bao said cats. Swap in a lotus URL if you want." },
      { line: "</body>\n</html>", note: "Close the body and the html. Done." },
    ],
  },
  {
    id: "bloop",
    planet: "Planet Bloop",
    glyph: "B",
    accent: "#E89F47",
    client: "Mochi",
    tagline: "Robots need a 'rules for visiting humans' page.",
    brief:
      "BEEP. Mochi's home planet is having Human Visitor Day and the robots are PANICKING because humans do confusing things like sneeze and forget where they parked. Mochi needs a webpage with a clear list of rules. Three rules minimum. Mochi suggests: 'no shouting at the toaster.' That one is non-negotiable.",
    needs: [
      "A heading that says 'Rules for Human Visitors'",
      "A bulleted list (<ul>) with at least three rules",
      "One rule must mention the toaster (Mochi insists)",
      "Style the heading in Mochi's color (#E89F47)",
    ],
    reward: 160,
    language: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; background: #FFF8EE; }
    h1   { color: #0F172A; }
  </style>
</head>
<body>
  <h1>Rules for Human Visitors</h1>
  <ul>
    <li>Do not eat the wires.</li>
  </ul>
</body>
</html>`,
    scaffold: [
      { line: "<!DOCTYPE html>", note: "Standard opener — tells the browser this is HTML." },
      { line: "<html>\n<head>\n  <style>\n    body { font-family: sans-serif; padding: 32px; background: #FFF8EE; }\n    h1   { color: #E89F47; }\n  </style>\n</head>", note: "Mochi-orange heading on a warm cream background. Mochi-approved." },
      { line: "<body>", note: "Page content starts here." },
      { line: "  <h1>Rules for Human Visitors</h1>", note: "Big clear title so even the most distracted human notices." },
      { line: "  <ul>", note: "A bulleted list. Each rule is one <li> inside." },
      { line: "    <li>Do not shout at the toaster.</li>", note: "Mochi's non-negotiable." },
      { line: "    <li>Please park your shoes by the door.</li>", note: "Robots find shoes confusing." },
      { line: "    <li>If you sneeze, warn us first.</li>", note: "Sneezes register as gunfire to most robots." },
      { line: "  </ul>\n</body>\n</html>", note: "Close everything up. Mochi is at peace." },
    ],
  },
  {
    id: "verdara",
    planet: "Planet Verdara",
    glyph: "V",
    accent: "#2C7A7B",
    client: "Citizens of the planet",
    tagline: "Print a watering schedule for the space gardener.",
    brief:
      "The chief gardener of Planet Verdara is in a bind. She has to water 5 plant beds every day for a week, and she keeps losing track. She doesn't need anything fancy — just a printed schedule. Day 1 through Day 7, and which bed gets watered each day (rotate through bed 1 to bed 5). She'll print it out and stick it on her greenhouse door.",
    needs: [
      "Use a `for` loop with `range`",
      "Print one line per day (Day 1 through Day 7)",
      "Each line should mention which bed to water",
      "Total: 7 lines of output",
    ],
    hint: "Use `range(1, 8)` to count days 1 through 7. To rotate beds, you can use the day number (or modulo if you're feeling fancy).",
    reward: 170,
    language: "python",
    starter: `# Print a 7-day watering schedule.
# Day 1 → Bed 1, Day 2 → Bed 2, ... Day 6 → Bed 1, Day 7 → Bed 2

for day in range(1, 8):
    print("Day", day)`,
    scaffold: [
      { line: "# Watering schedule for the chief gardener of Verdara", note: "A comment — Python ignores it, but future-you will thank you." },
      { line: "for day in range(1, 8):", note: "`range(1, 8)` gives 1, 2, 3, 4, 5, 6, 7. The colon means 'body next.'" },
      { line: "    bed = ((day - 1) % 5) + 1", note: "Modulo magic: rotates through beds 1–5 even when day goes past 5." },
      { line: '    print("Day", day, "→ water bed", bed)', note: "One tidy line per day. Notice the 4-space indent — that's how Python knows it's inside the loop." },
    ],
  },
  {
    id: "stax",
    planet: "Planet Stax",
    glyph: "S",
    accent: "#7C3AED",
    client: "Citizens of the planet",
    tagline: "A space DJ needs a setlist page with style.",
    brief:
      "DJ Nebula is performing at the Galactic Bass Drop tomorrow night and her old setlist page got eaten by a black hole (probably). She needs a new one — fast. Her vibe is purple, loud, and a little bit chaotic. Build her a setlist page she can pull up on her glove computer mid-set.",
    needs: [
      "A bold heading with the DJ's name and the event",
      "A numbered or bulleted list of at least 4 song names (make them up — the wilder the better)",
      "Purple-ish color scheme (background or accents)",
      "Use a custom font-family that isn't the default",
    ],
    reward: 180,
    language: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; }
  </style>
</head>
<body>
  <h1>DJ Nebula — Tonight's Set</h1>
  <ol>
    <li>Track 1</li>
  </ol>
</body>
</html>`,
    scaffold: [
      { line: "<!DOCTYPE html>\n<html>\n<head>", note: "Standard top of every HTML file." },
      { line: "  <style>\n    body { background: #1a0b2e; color: #f3e8ff; font-family: 'Courier New', monospace; padding: 40px; }\n    h1   { color: #c084fc; letter-spacing: 2px; }\n    li   { font-size: 18px; margin: 8px 0; }\n  </style>\n</head>", note: "Deep-space purple, glowy heading, monospace font for cyber-DJ vibes." },
      { line: "<body>", note: "Page content opens here." },
      { line: "  <h1>DJ NEBULA · GALACTIC BASS DROP</h1>", note: "Loud headline. All caps because she said loud." },
      { line: "  <ol>", note: "Ordered list — auto-numbers the tracks." },
      { line: "    <li>Quantum Wobble</li>\n    <li>Asteroid Stomp</li>\n    <li>Moonbase Meltdown</li>\n    <li>Singularity Drop</li>", note: "Four invented track names. Add more if you've got fire." },
      { line: "  </ol>\n</body>\n</html>", note: "Wrap it up. DJ Nebula is ready." },
    ],
  },
  {
    id: "quanta",
    planet: "Planet Quanta",
    glyph: "Q",
    accent: "#7C3AED",
    client: "Professor Loop",
    tagline: "Help Professor Loop remember his shopping list.",
    brief:
      "Right, so — I went to the market on Quanta and I forgot — what was I — yes! I forgot the entire list. The ENTIRE LIST. So I need you to write me a little program that will print my shopping list for me. Six items. Real items. Or fake. Honestly at this point I'll buy whatever the program says. ...What was I saying?",
    needs: [
      "Store the items in a way you can loop through (a list, or use range)",
      "Print exactly 6 items",
      "Each item on its own line",
      "Number each line (e.g. '1. Bread')",
    ],
    hint: "You can put items in a list like `items = [\"bread\", \"milk\", ...]` and use `for item in items:`. Use a counter variable to number them.",
    reward: 170,
    language: "python",
    starter: `# Print Professor Loop's shopping list.
# Each line should look like: 1. Bread

items = ["bread"]
for item in items:
    print(item)`,
    scaffold: [
      { line: "# Professor Loop's shopping list — six items, numbered", note: "Note to self so the professor doesn't forget what this file does." },
      { line: 'items = ["bread", "milk", "eggs", "apples", "cheese", "tea"]', note: "A Python list — six items in square brackets, separated by commas." },
      { line: "number = 1", note: "A counter. We'll bump it up by 1 each time through the loop." },
      { line: "for item in items:", note: "Walk through the list, one item at a time." },
      { line: '    print(number, ". ", item)', note: "Print the number and the item together." },
      { line: "    number = number + 1", note: "Increase the counter so the next line gets a fresh number." },
    ],
  },
  {
    id: "nimbus",
    planet: "Planet Nimbus",
    glyph: "N",
    accent: "#2C7A7B",
    client: "Citizens of the planet",
    tagline: "Cloud people need a sign-up page for cloud licenses.",
    brief:
      "On Planet Nimbus, every citizen needs a Cloud Operator's License before they can ride the clouds (it's a whole thing — long story). The license office is overwhelmed. They need a simple sign-up page so people can register from home. Keep it friendly. Cloud people scare easily.",
    needs: [
      "A heading: 'Cloud License Sign-Up'",
      "A form with at least three fields (name, age, favorite cloud, etc.)",
      "Each field has a <label> and an <input>",
      "A 'Submit' button at the bottom",
    ],
    hint: "Wrap fields in a <form>. Use <label for=\"id\"> paired with <input id=\"id\">.",
    reward: 200,
    language: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body  { font-family: sans-serif; padding: 32px; background: #F0F9F8; }
    label { display: block; margin-top: 12px; font-weight: 600; }
    input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 240px; }
    button{ margin-top: 16px; background: #2C7A7B; color: white; border: 0; padding: 10px 18px; border-radius: 999px; font-weight: 600; cursor: pointer; }
  </style>
</head>
<body>
  <h1>Cloud License Sign-Up</h1>
  <form>
    <label for="name">Name</label>
    <input id="name" />
  </form>
</body>
</html>`,
  },
];

