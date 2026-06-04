export type StoryBeat = {
  character: "Captain Pixel" | "Bao" | "Mochi" | "Professor Loop" | "Jason" | "The Professor";
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
  // Optional: render as a chat mission (no code editor — just a prompt + AI response).
  kind?: "chat";
  starterPrompt?: string;
  goal?: string; // user-facing description of what the AI's reply should achieve
};

export type Track = {
  id: "web" | "python" | "genai" | "web-games";
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
  Jason: {
    color: "#DC2626",
    role: "Tech tycoon who wants to replace every coder with a machine",
    avatar: "/characters/jason.png",
  },
  "The Professor": {
    color: "#991B1B",
    role: "Jason's mentor — cold, calculating, and very into sabotage",
    avatar: "/characters/The-Professor.png",
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
      {
        n: 10,
        title: "Flexbox: lining things up",
        blurb: "Stop wrestling with layout. Meet flexbox.",
        xp: 90,
        language: "html",
        story: {
          character: "Bao",
          text: "Captain Pixel asked me to put three buttons in a row. THREE. I tried for an hour. They keep stacking on top of each other like sad pancakes. Apparently there's a magic word called 'flex' that fixes this? Please. I'm so close to giving up and just drawing them on paper.",
        },
        why: "Lining things up is 90% of building websites. Flexbox is the trick every real frontend developer uses to make rows, navbars, and tidy layouts.",
        concept:
          "Give a container the style display: flex and its children line up in a row instead of stacking. Add gap: 12px to put space between them. That's it. That's the magic.",
        example: `<div style="display:flex; gap:12px;">\n  <button>A</button><button>B</button><button>C</button>\n</div>`,
        task: "Make the three buttons sit in a single row with some space between them.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 40px; }
    button { padding: 10px 18px; border-radius: 8px; border: 0; background: #193b92; color: white; }
  </style>
</head>
<body>
  <div>
    <button>Save</button>
    <button>Cancel</button>
    <button>Help</button>
  </div>
</body>
</html>`,
      },
      {
        n: 11,
        title: "Hover effects",
        blurb: "Make the page react when the cursor visits.",
        xp: 80,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi watched a website yesterday. When mouse went over button, button changed color. Mochi gasped. Mochi has never gasped before. Teach Mochi this sorcery.",
        },
        why: "Hover effects are the difference between a page that feels alive and a page that feels like a printout. They're tiny details that make websites feel professional.",
        concept:
          "Add :hover after a selector in CSS to apply styles only when the mouse is over an element. Example: button:hover { background: red; } turns the button red on hover.",
        example: `a:hover { color: orange; }`,
        task: "Make the button change background color when the mouse hovers over it.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 40px; }
    button {
      padding: 12px 24px; border: 0; border-radius: 999px;
      background: #2C7A7B; color: white; font-weight: 600; cursor: pointer;
      transition: background 0.2s;
    }
  </style>
</head>
<body>
  <button>Hover me</button>
</body>
</html>`,
      },
      {
        n: 12,
        title: "Forms and inputs",
        blurb: "Let visitors type things back at you.",
        xp: 100,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit, the Academy is taking applications for the Junior Pilot Program. We need a sign-up form. Name field, age field, big shiny submit button. Make it friendly. Pilots are nervous enough already.",
        },
        why: "Every login, search bar, comment box, and checkout you've ever used is a form. Once you can build one, you can collect real information from real visitors.",
        concept:
          "A <form> wraps input fields. Each <input> takes typing. A <label> tells the user what to put in the field. A <button type=\"submit\"> sends the form.",
        example: `<form>\n  <label>Name <input /></label>\n  <button>Send</button>\n</form>`,
        task: "Add a second input for age, with a label, and a submit button at the bottom.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; }
    label { display: block; margin-top: 12px; font-weight: 600; }
    input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
  </style>
</head>
<body>
  <h1>Junior Pilot Sign-Up</h1>
  <form>
    <label>Name <input /></label>
  </form>
</body>
</html>`,
      },
      {
        n: 13,
        title: "Cards and shadows",
        blurb: "Make a page look like a real product.",
        xp: 110,
        language: "html",
        story: {
          character: "Bao",
          text: "I keep seeing these cool 'cards' on every website. Apple's site has them. Spotify has them. Even my dentist's site has them?! What is the SECRET? I demand to know.",
        },
        why: "Cards are the building block of modern UI — product listings, blog previews, dashboards. Master them and your pages instantly look ten times more professional.",
        concept:
          "A card is just a <div> with padding, rounded corners, and a soft shadow. The shadow is the secret. box-shadow: 0 4px 20px rgba(0,0,0,0.08) is the universal 'pretty card' formula.",
        example: `.card { background:white; padding:20px; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.08); }`,
        task: "Style the .card div so it has rounded corners, padding, and a soft shadow.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #F1F5F9; padding: 40px; font-family: sans-serif; }
    .card { background: white; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Stargazer Pro</h2>
    <p>The fanciest telescope in the galaxy. Probably.</p>
  </div>
</body>
</html>`,
      },
      {
        n: 14,
        title: "JavaScript variables",
        blurb: "Store stuff. Use it later. Magic.",
        xp: 90,
        language: "html",
        story: {
          character: "Professor Loop",
          text: "Hmm? Oh yes, JavaScript! Very useful. Variables are little labelled boxes. You put something in. You take it out. You change what's in it. Like my coffee cup, except I do remember where I put variables.",
        },
        why: "Variables are how websites remember things — your name, the score in a game, what you typed. Without variables, every page would forget you the second it loaded.",
        concept:
          "Use let to make a variable: let name = 'Bao'. Use it later by typing its name. Change it any time with name = 'Mochi'. Variables hold numbers, words ('strings'), or anything else.",
        example: `let score = 0;\nscore = score + 1;\nconsole.log(score);`,
        task: "Set a variable called name to your name, then put it inside the heading using document.getElementById.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1 id="greeting">Hello!</h1>
  <script>
    let name = "";
    // your code here
  </script>
</body>
</html>`,
      },
      {
        n: 15,
        title: "If statements: making decisions",
        blurb: "Teach your page to think.",
        xp: 120,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi made a game. Player guesses number. Game must say 'YES!' or 'no, try again, bring snacks.' Mochi does not know how to make computer choose. Please.",
        },
        why: "Every app on earth uses if-statements. They're how a page decides what to do based on what the user did. No if, no game logic.",
        concept:
          "if (something) { do this } else { do that }. The 'something' is a comparison — like score === 10 (exactly equal) or age > 12 (greater than).",
        example: `if (score > 100) {\n  alert("You win!");\n} else {\n  alert("Try again.");\n}`,
        task: "When the button is clicked, check if the input number equals 7. Show 'YES!' or 'no'.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <input id="guess" type="number" placeholder="Guess..." />
  <button onclick="check()">Check</button>
  <p id="msg"></p>
  <script>
    function check() {
      let guess = Number(document.getElementById("guess").value);
      // your if here
    }
  </script>
</body>
</html>`,
      },
      {
        n: 16,
        title: "Fix the bug: missing closing tag",
        blurb: "The page is broken. Find what's missing.",
        xp: 90,
        language: "html",
        story: {
          character: "Bao",
          text: "OK don't laugh. My homepage broke. The footer is sliding into the heading. I have no idea why. Captain Pixel just stared at it for a while and said 'oh dear.' That is NOT a good sign coming from her. Help.",
        },
        why: "Real coding is 50% writing, 50% fixing things you broke five minutes ago. The faster you can spot a missing tag, the faster you ship.",
        concept:
          "Every opening tag like <h1> needs a closing tag </h1>. If you forget one, the browser keeps applying it to everything below — sometimes the whole page.",
        task: "There's a missing </h1>. Add it so the heading and paragraph stop merging.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>My Cool Page
  <p>Welcome to my page.</p>
</body>
</html>`,
      },
      {
        n: 17,
        title: "Remove the line",
        blurb: "Less code is sometimes the answer.",
        xp: 80,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi added too many things. Page now has TWO huge headings. Mochi panicked and ran in circles. Please delete the extra one before Mochi runs in circles again.",
        },
        why: "Good developers delete code as often as they write it. Cleaning up is part of building.",
        concept:
          "Sometimes the fix isn't writing more — it's deleting what doesn't belong. Read the page, pick the line that breaks the design, and remove it.",
        task: "Delete the second <h1> so there's only one main heading.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>Welcome to my page</h1>
  <h1>Welcome to my page</h1>
  <p>Glad you're here.</p>
</body>
</html>`,
      },
      {
        n: 18,
        title: "CSS classes",
        blurb: "Style many things at once.",
        xp: 110,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit, we have three notice boards and they all need to look the same. Don't style them one by one. Give them a class. Style the class once. Future-you will thank you.",
        },
        why: "Classes are how real sites stay consistent. Style once, reuse everywhere.",
        concept:
          "Add class=\"note\" to elements. In CSS, target them with .note { ... }. Every element with that class gets the same style.",
        example: `<p class="note">Hi</p>\n<style>.note { background: yellow; }</style>`,
        task: "Give all three <p> tags the class \"note\", then style .note with a yellow background and 12px padding.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; }
  </style>
</head>
<body>
  <p>Notice one</p>
  <p>Notice two</p>
  <p>Notice three</p>
</body>
</html>`,
      },
      {
        n: 19,
        title: "Fix the bug: wrong attribute",
        blurb: "The image isn't loading. Why?",
        xp: 100,
        language: "html",
        story: {
          character: "Bao",
          text: "I added an image. It's just a sad broken icon. The URL is right, I CHECKED. Captain Pixel says 'look closer.' She always says that. UGH.",
        },
        why: "One typo can break a whole feature. Spot-the-bug is a real skill.",
        concept:
          "The <img> tag uses src= for the URL, not href=. href is for links (<a>), src is for sources (images, scripts).",
        task: "Change href to src on the <img> tag so the picture loads.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1>My pet</h1>
  <img href="https://placekitten.com/300/200" alt="cat" />
</body>
</html>`,
      },
      {
        n: 20,
        title: "Grid layout",
        blurb: "Lay out a gallery in rows and columns.",
        xp: 130,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit, the Academy art gallery is one giant pile of squares. The artists are crying. Make a tidy 3-column grid. They will name a sandwich after you.",
        },
        why: "CSS Grid is the modern way to build dashboards, galleries, magazine layouts — anything with rows AND columns.",
        concept:
          "display: grid plus grid-template-columns: repeat(3, 1fr) gives you three equal columns. Add gap: 12px for spacing.",
        example: `.gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }`,
        task: "Style .gallery so the boxes form a 3-column grid with 12px gap.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 24px; }
    .gallery { }
    .gallery div { background: #193b92; color: white; padding: 24px; border-radius: 8px; text-align: center; }
  </style>
</head>
<body>
  <div class="gallery">
    <div>1</div><div>2</div><div>3</div>
    <div>4</div><div>5</div><div>6</div>
  </div>
</body>
</html>`,
      },
      {
        n: 21,
        title: "Functions in JavaScript",
        blurb: "Bundle code into reusable boxes.",
        xp: 110,
        language: "html",
        story: {
          character: "Professor Loop",
          text: "JavaScript functions! Like Python functions, but with curly braces instead of indentation. Same idea: name a chunk of code, call it whenever. Saves typing. Saves brain cells.",
        },
        why: "Functions are the units real apps are built from. Every click handler, every API call, every game loop — functions.",
        concept:
          "function greet(name) { alert('Hi ' + name) } defines it. greet('Bao') runs it. Functions can return values too with return.",
        example: `function double(n) { return n * 2; }\nalert(double(7));`,
        task: "Write a function shout(msg) that alerts msg in upper case. Wire the button to call shout('hello').",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="">Press me</button>
  <script>
    // function shout here
  </script>
</body>
</html>`,
      },
      {
        n: 22,
        title: "Arrays: a list of things",
        blurb: "Hold many values in one variable.",
        xp: 100,
        language: "html",
        story: {
          character: "Bao",
          text: "I need to store everyone's high scores. Right now I have score1, score2, score3, score4. It's UGLY. There has to be a better way.",
        },
        why: "Arrays power leaderboards, playlists, shopping carts — anywhere you have a list of stuff.",
        concept:
          "let scores = [10, 20, 30]; — square brackets, comma separated. Access with scores[0]. Length with scores.length.",
        example: `let names = ["Bao", "Mochi"];\nalert(names[1]);`,
        task: "Create an array of 4 names and alert the third one.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="show()">Show</button>
  <script>
    function show() {
      // your array + alert here
    }
  </script>
</body>
</html>`,
      },
      {
        n: 23,
        title: "Loops in JavaScript",
        blurb: "Do something to every item.",
        xp: 120,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi has 100 cookies. Mochi must thank each cookie individually. Mochi cannot type 'thanks' 100 times. Mochi will malfunction.",
        },
        why: "Loops save you from typing the same thing over and over. Every list on every webpage you've ever scrolled was painted by a loop.",
        concept:
          "for (let i = 0; i < arr.length; i++) walks through every item. Inside the loop, arr[i] is the current one. Or use arr.forEach(item => ...).",
        example: `let n = [1,2,3];\nfor (let i=0; i<n.length; i++) console.log(n[i]);`,
        task: "Loop through the foods array and build one big string with all of them separated by commas. Alert it.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="run()">Run</button>
  <script>
    let foods = ["pho", "banh mi", "spring rolls"];
    function run() {
      // build a string and alert it
    }
  </script>
</body>
</html>`,
      },
      {
        n: 24,
        title: "Fix the bug: equality trap",
        blurb: "It looks right. It isn't.",
        xp: 110,
        language: "html",
        story: {
          character: "Bao",
          text: "My check function ALWAYS says 'YES!' even when I type 999. It's clearly broken but it's only one line. WHERE IS THE BUG.",
        },
        why: "= assigns. == and === compare. Confusing them is the #1 bug new devs make. Spotting it saves hours.",
        concept:
          "A single = sets a value. Two (==) or three (===) compare. Always use === in JavaScript.",
        task: "Change the broken = to === so the comparison works.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <input id="g" type="number" />
  <button onclick="run()">Check</button>
  <p id="msg"></p>
  <script>
    function run() {
      let n = Number(document.getElementById("g").value);
      if (n = 7) {
        document.getElementById("msg").textContent = "YES!";
      } else {
        document.getElementById("msg").textContent = "no";
      }
    }
  </script>
</body>
</html>`,
      },
      {
        n: 25,
        title: "Remove the line: unused style",
        blurb: "Delete the rule that breaks the look.",
        xp: 80,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Card looks correct EXCEPT one rule turns everything bright lime green. Mochi believes lime green is for limes only.",
        },
        why: "Knowing which line to delete is just as valuable as knowing which line to write.",
        concept:
          "Read each CSS rule. Find the one causing the problem. Delete it.",
        task: "Remove the rule that sets background: lime on .card.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { padding: 32px; font-family: sans-serif; }
    .card { padding: 20px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .card { background: lime; }
    h2 { color: #193b92; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Stargazer Pro</h2>
    <p>Fancy telescope.</p>
  </div>
</body>
</html>`,
      },
      {
        n: 26,
        title: "Objects: things with properties",
        blurb: "One variable, many fields.",
        xp: 120,
        language: "html",
        story: {
          character: "Professor Loop",
          text: "When one thing has many qualities — a pet has a name, an age, a favourite snack — we use an object. Like a tiny filing cabinet.",
        },
        why: "APIs, game state, user profiles — all objects. You can't go far without them.",
        concept:
          "let pet = { name: 'Mochi', age: 2 }; — read with pet.name, change with pet.age = 3.",
        example: `let p = { name: "Bao", score: 0 };\np.score = 10;`,
        task: "Create a pet object with name, age, and food. Alert pet.name + ' likes ' + pet.food.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="show()">Show pet</button>
  <script>
    function show() {
      // create pet and alert
    }
  </script>
</body>
</html>`,
      },
      {
        n: 27,
        title: "DOM: changing styles from JS",
        blurb: "Restyle a page in real time.",
        xp: 130,
        language: "html",
        story: {
          character: "Bao",
          text: "I want a dark mode toggle. Just one button. Click → background goes black, text goes white. So slick. Please help me look cool.",
        },
        why: "Live styling is what makes apps feel alive: toggles, animations, themes, hover tricks. All JavaScript reaching into the DOM.",
        concept:
          "document.body.style.background = '#000' changes the page background instantly. You can change any CSS property the same way.",
        task: "When the button is clicked, set body background to #0F172A and color to white.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="dark()">Dark mode</button>
  <p>Read me in the dark.</p>
  <script>
    function dark() {
      // change body styles here
    }
  </script>
</body>
</html>`,
      },
      {
        n: 28,
        title: "Counter: state in a variable",
        blurb: "Click. Count. Display.",
        xp: 130,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi wants a button that counts how many times Mochi pressed it. Mochi likes pressing things. This is good for Mochi.",
        },
        why: "A counter is the simplest example of 'state' — info the page remembers between clicks. Same idea behind likes, votes, scores.",
        concept:
          "Keep a variable outside the function. Each click bumps it and writes it into the page.",
        example: `let n = 0;\nfunction add(){ n++; document.getElementById('x').textContent = n; }`,
        task: "Make the button increase count by 1 each click and show it in the <span id=\"out\">.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="bump()">+1</button>
  <p>Count: <span id="out">0</span></p>
  <script>
    let count = 0;
    function bump() {
      // your code
    }
  </script>
</body>
</html>`,
      },
      {
        n: 29,
        title: "Input → output",
        blurb: "Read what the user typed and respond.",
        xp: 120,
        language: "html",
        story: {
          character: "Bao",
          text: "I made a name field. I just want the page to say 'Hi <yourname>!' when you press Greet. That's it. That's the whole feature.",
        },
        why: "Reading inputs and writing outputs is the heartbeat of every form, search bar, and chat app on Earth.",
        concept:
          ".value reads what the user typed. .textContent writes it into the page.",
        task: "Read the input value, build a greeting like 'Hi <name>!' and put it in #out.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <input id="n" placeholder="Your name" />
  <button onclick="greet()">Greet</button>
  <p id="out"></p>
  <script>
    function greet() {
      // read #n, write into #out
    }
  </script>
</body>
</html>`,
      },
      {
        n: 30,
        title: "Fix the bug: typo in id",
        blurb: "Nothing happens. The id is wrong.",
        xp: 100,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi clicks button. Nothing happens. Mochi clicks harder. Still nothing. Mochi has questions.",
        },
        why: "Selectors that don't match anything return null and silently fail. Train your eye to check ids.",
        concept:
          "If getElementById returns null, no element with that id exists. Compare the id in the HTML to the one in your JS.",
        task: "Fix the typo so the heading actually changes when the button is clicked.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <h1 id="title">Click me</h1>
  <button onclick="go()">Press</button>
  <script>
    function go() {
      document.getElementById("titel").textContent = "Hello!";
    }
  </script>
</body>
</html>`,
      },
      {
        n: 31,
        title: "Random color",
        blurb: "Roll a fresh background on every click.",
        xp: 120,
        language: "html",
        story: {
          character: "Professor Loop",
          text: "Random is delightful. We pick from a bag and the bag never tells us what's coming. Build me a button that throws a new color on the page each time.",
        },
        why: "Randomness powers games, color pickers, dice rolls, art tools. It's tiny and very satisfying.",
        concept:
          "Math.random() returns a number 0..1. Multiply, floor, and use it as an index into an array.",
        example: `let i = Math.floor(Math.random() * arr.length);`,
        task: "When clicked, set body background to a random color from the colors array.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="roll()">Roll</button>
  <script>
    let colors = ["#FECACA", "#BFDBFE", "#BBF7D0", "#FDE68A", "#DDD6FE"];
    function roll() {
      // pick one and apply to body
    }
  </script>
</body>
</html>`,
      },
      {
        n: 32,
        title: "Transitions and animations",
        blurb: "Smooth movement, no library required.",
        xp: 110,
        language: "html",
        story: {
          character: "Bao",
          text: "When I change a color it just SNAPS. I want it to glide. Like butter. Or a slug. But fancier.",
        },
        why: "Tiny animations make interfaces feel alive. One CSS line, huge upgrade.",
        concept:
          "transition: all 0.3s ease on an element makes any change (color, size, position) animate smoothly.",
        example: `.btn { transition: background 0.3s ease; }`,
        task: "Add a transition to .box so its background changes smoothly on hover.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { padding: 40px; }
    .box { width: 200px; height: 100px; background: #193b92; }
    .box:hover { background: #2C7A7B; }
  </style>
</head>
<body>
  <div class="box"></div>
</body>
</html>`,
      },
      {
        n: 33,
        title: "Build a to-do list",
        blurb: "Add tasks. See them appear.",
        xp: 180,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit, the Academy needs a quick to-do app for orientation week. Type, press Add, see the task on screen. Don't worry about deleting yet — just adding.",
        },
        why: "A to-do list ties together inputs, arrays, loops, and the DOM. If you can build this, you can build a hundred small apps.",
        concept:
          "Read input value, push it into an array, then re-render the list with a loop.",
        task: "On Add: push the input value to todos, then rebuild #list as a <ul> of all todos.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <input id="t" placeholder="What to do?" />
  <button onclick="add()">Add</button>
  <ul id="list"></ul>
  <script>
    let todos = [];
    function add() {
      // your code
    }
  </script>
</body>
</html>`,
      },
      {
        n: 34,
        title: "Remove the line: double event",
        blurb: "Each click counts twice. Delete the cause.",
        xp: 100,
        language: "html",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi presses ONCE. Counter goes up by TWO. Mochi feels haunted.",
        },
        why: "Knowing which extra line to remove is half of debugging.",
        concept:
          "Each call to bump() runs everything inside it once. If you call it twice, the state changes twice.",
        task: "Delete the duplicate line so each click adds exactly 1.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="bump()">+1</button>
  <p>Count: <span id="o">0</span></p>
  <script>
    let n = 0;
    function bump() {
      n = n + 1;
      n = n + 1;
      document.getElementById("o").textContent = n;
    }
  </script>
</body>
</html>`,
      },
      {
        n: 35,
        title: "LocalStorage: remember between visits",
        blurb: "Save data that survives a refresh.",
        xp: 150,
        language: "html",
        story: {
          character: "Bao",
          text: "I made a fav-color picker. Beautiful. Then I refresh and it FORGETS. Browsers have a tiny notebook called localStorage. Please teach me to write in it.",
        },
        why: "LocalStorage is how settings, themes, login state, and game saves survive page reloads.",
        concept:
          "localStorage.setItem('key', value) saves. localStorage.getItem('key') reads. Both work with strings.",
        example: `localStorage.setItem("name", "Bao");\nalert(localStorage.getItem("name"));`,
        task: "On Save: write the input value into localStorage under 'fav'. On Load: read it and put it in #out.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <input id="i" placeholder="Favorite color" />
  <button onclick="save()">Save</button>
  <button onclick="load()">Load</button>
  <p id="out"></p>
  <script>
    function save() {}
    function load() {}
  </script>
</body>
</html>`,
      },
      {
        n: 36,
        title: "Fetch data from the internet",
        blurb: "Pull a random joke and show it.",
        xp: 180,
        language: "html",
        story: {
          character: "Professor Loop",
          text: "The internet is full of free APIs. Tiny servers waiting to send you data. Today: jokes. Tomorrow: weather, pokedex, anything!",
        },
        why: "fetch() is the gateway to every API on the web. Once you know it, you can build apps that talk to real services.",
        concept:
          "fetch(url).then(r => r.json()).then(data => ...). The data is a JS object you can use.",
        example: `fetch("https://api.example.com/x")\n  .then(r => r.json())\n  .then(d => console.log(d));`,
        task: "On click, fetch from https://icanhazdadjoke.com/ with header Accept: application/json, then put data.joke in #out.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="joke()">Joke me</button>
  <p id="out"></p>
  <script>
    async function joke() {
      // fetch + json + write into #out
    }
  </script>
</body>
</html>`,
      },
      {
        n: 37,
        title: "Try / catch: handle errors",
        blurb: "When the internet says no.",
        xp: 130,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit, real apps fail sometimes. Networks drop. Servers nap. Your job is to catch the error and show the user something nicer than a crash.",
        },
        why: "Robust apps don't explode. They recover. try/catch is the first tool you need.",
        concept:
          "try { risky() } catch (err) { handle(err) }. Inside catch you can show a friendly message instead of crashing.",
        task: "Wrap the JSON.parse call in try/catch. On error, set #out to 'Oops, bad input.'",
        starter: `<!DOCTYPE html>
<html>
<body>
  <input id="i" placeholder='Try {"a":1}' />
  <button onclick="parse()">Parse</button>
  <p id="out"></p>
  <script>
    function parse() {
      let raw = document.getElementById("i").value;
      let data = JSON.parse(raw);
      document.getElementById("out").textContent = JSON.stringify(data);
    }
  </script>
</body>
</html>`,
      },
      {
        n: 38,
        title: "Mini game: click target",
        blurb: "Click the moving square in 10 seconds.",
        xp: 200,
        language: "html",
        story: {
          character: "Bao",
          text: "Captain wants a quick reaction game for the open house. Square jumps to random spots. Each hit = +1. Ten seconds. Go.",
        },
        why: "Tiny games glue together randomness, state, the DOM, and timers — the foundations of most real interactive apps.",
        concept:
          "setInterval moves the square. setTimeout ends the game. Track score in a variable.",
        task: "On Start: every 700ms move #t to a random spot inside the 400x300 arena. Clicking #t bumps score.",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    .arena { position: relative; width: 400px; height: 300px; background: #F1F5F9; border-radius: 12px; }
    .target { position: absolute; width: 40px; height: 40px; background: #193b92; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <button onclick="start()">Start</button>
  <p>Score: <span id="s">0</span></p>
  <div class="arena">
    <div class="target" id="t" onclick="hit()"></div>
  </div>
  <script>
    let score = 0;
    function hit() { score++; document.getElementById("s").textContent = score; }
    function start() {
      // setInterval to move #t to random x,y
    }
  </script>
</body>
</html>`,
      },
      {
        n: 39,
        title: "Remove the line: leaky console",
        blurb: "Clean up debug prints before shipping.",
        xp: 80,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit, before we ship, no console.log noise. Hunt them down and remove every last one. Real ship-ready code is quiet.",
        },
        why: "Leftover console.log calls in production look unprofessional and leak info. Habit-building matters.",
        concept:
          "Find every console.log line in the script. Remove all of them. Functionality should still work.",
        task: "Delete all three console.log lines from the script.",
        starter: `<!DOCTYPE html>
<html>
<body>
  <button onclick="go()">Save</button>
  <script>
    function go() {
      console.log("called go");
      let n = 5;
      console.log("n =", n);
      n = n * 2;
      console.log("final", n);
      alert(n);
    }
  </script>
</body>
</html>`,
      },
      {
        n: 40,
        title: "Mini project: tip calculator",
        blurb: "Real-world math, real-world app.",
        xp: 250,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Final mission of the track, recruit. Build a tiny tip calculator. Bill goes in. Tip percent goes in. The total tip + grand total comes out. Useful in restaurants. Useful in life.",
        },
        why: "Real apps are tiny calculators wired to tiny forms. This is the pattern behind millions of tools.",
        concept:
          "Read both numbers. Compute tip = bill * (pct/100). Compute total = bill + tip. Show both, rounded to 2 decimals.",
        task: "On Calculate: read #bill and #pct, compute and write tip and total into #tip and #total (use toFixed(2)).",
        starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; max-width: 320px; }
    label { display: block; margin-top: 12px; font-weight: 600; }
    input { padding: 8px; width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; }
    button { margin-top: 16px; padding: 10px 16px; background: #193b92; color: white; border: 0; border-radius: 8px; }
    .out { margin-top: 16px; }
  </style>
</head>
<body>
  <h1>Tip calculator</h1>
  <label>Bill <input id="bill" type="number" /></label>
  <label>Tip % <input id="pct" type="number" /></label>
  <button onclick="calc()">Calculate</button>
  <div class="out">Tip: $<span id="tip">0</span></div>
  <div class="out">Total: $<span id="total">0</span></div>
  <script>
    function calc() {
      // read, compute, write
    }
  </script>
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
      {
        n: 9,
        title: "Lists: holding many things",
        blurb: "One variable, many values.",
        xp: 90,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Hmm! Important discovery. Today I tried to remember my seven favorite snacks using seven variables. I got to snack four and forgot snack two. Disaster. There is a better way: a list. One variable. Many snacks. Even I cannot mess this up. Probably.",
        },
        why: "Lists are how Python holds many things together — names, scores, shopping items, AI training data. Almost every program you ever write will use one.",
        concept:
          "A list goes inside square brackets, with commas between items: snacks = ['rice cake', 'mochi', 'mango']. Access items with snacks[0] (Python starts counting at zero, blame the professor).",
        example: `colors = ["red", "blue", "green"]\nprint(colors[1])`,
        task: "Make a list of three of your favorite foods and print the second one.",
        starter: `snacks = ["rice cake", "mochi", "mango"]\nprint(snacks[0])`,
      },
      {
        n: 10,
        title: "Looping over a list",
        blurb: "Do something to every item in a list.",
        xp: 100,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi has list of greetings. Mochi must say each greeting. Mochi typed print() one hundred times. Mochi is tired. Mochi heard there is a way to print all of them with three lines. Mochi needs this in life.",
        },
        why: "Looping over lists is the single most common thing Python developers do — sending a hundred emails, drawing a hundred enemies, reading a hundred rows of data. Master this and you can scale.",
        concept:
          "for item in mylist: runs the indented code once for each item in the list. The variable 'item' becomes each value in turn.",
        example: `for snack in ["mochi", "mango"]:\n    print("Yum:", snack)`,
        task: "Loop over the greetings list and print each greeting with 'Mochi says:' in front.",
        starter: `greetings = ["hello", "hi there", "beep boop"]\n# loop here`,
      },
      {
        n: 11,
        title: "If / else: decisions",
        blurb: "Teach Python to make a choice.",
        xp: 100,
        language: "python",
        story: {
          character: "Bao",
          text: "Captain Pixel asked me to build a 'are you old enough for the rollercoaster' checker. I am a noodle. I do not know how to make Python choose between two answers. Please rescue me before she finds out.",
        },
        why: "Every smart program — every game, login screen, AI — runs on decisions. If/else is how you teach the computer to react instead of just react like a brick.",
        concept:
          "if condition: runs the indented block when the condition is true. else: runs when it's false. Use ==, >, <, >=, <= to compare. Indentation matters in Python — four spaces.",
        example: `age = 12\nif age >= 13:\n    print("Welcome.")\nelse:\n    print("Come back next year.")`,
        task: "If age is 12 or higher, print 'You can ride!'. Otherwise print 'Maybe next year.'",
        starter: `age = 10\n# your if/else here`,
      },
      {
        n: 12,
        title: "Counting with a loop",
        blurb: "Repeat with numbers.",
        xp: 100,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "I am building a rocket countdown! Ten, nine, eight... no wait, was it nine? Anyway. Build me a countdown from 10 to 1 using a loop. I will sit here and add dramatic music.",
        },
        why: "Counting loops power timers, scoreboards, level progressions, animations, and every 'do this N times' moment in code.",
        concept:
          "range(10, 0, -1) gives the numbers 10, 9, 8, ... 1. Combine with a for loop: for i in range(10, 0, -1): print(i). The third argument is the step — negative means count down.",
        example: `for i in range(1, 4):\n    print(i)`,
        task: "Use a for loop to print numbers from 10 down to 1, then print 'Blast off!'.",
        starter: `# countdown here`,
      },
      {
        n: 13,
        title: "Input from the user",
        blurb: "Let people talk back to your program.",
        xp: 110,
        language: "python",
        story: {
          character: "Bao",
          text: "Hey hey — I want to make a tiny chatbot. Just one question, one answer. But my code has no way of ASKING me anything. It just talks AT me. Like my dad on car trips. Help.",
        },
        why: "input() is the bridge between your program and a real human. Quizzes, calculators, mini games — anything interactive needs it.",
        concept:
          "name = input('What is your name? ') pauses the program, lets the user type, and stores whatever they typed in name (always as text). Use int(input(...)) when you want a number.",
        example: `name = input("Name? ")\nprint("Hi", name)`,
        task: "Ask the user for their favorite snack and print 'Great choice — <snack>!'.",
        starter: `# ask and answer here`,
      },
      {
        n: 14,
        title: "Functions with return",
        blurb: "Functions that give answers back.",
        xp: 120,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Ah! Now we level up. Last time you built a function that PRINTED an answer. Today you build one that RETURNS an answer — meaning you can use the result somewhere else. Like a tiny calculator I can call any time I forget what 7 plus 8 is. Which, between you and me, is most days.",
        },
        why: "Returning values lets functions feed into other functions, into prints, into if-statements. It's how real Python programs are built — small pieces that hand answers around.",
        concept:
          "def add(a, b): then on the next line return a + b. Use it like result = add(2, 3) — now result holds 5. Without return, the function gives back nothing (None).",
        example: `def square(n):\n    return n * n\n\nprint(square(4))`,
        task: "Write a function called double that takes a number and returns it doubled. Print double(7).",
        starter: `# def double here\n`,
      },
      {
        n: 15,
        title: "Mini project: number guessing game",
        blurb: "Combine everything you've learned.",
        xp: 250,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Final chapter assignment, assistant! The Academy gift shop wants a tiny guessing game for the lobby tablet. Player guesses a secret number from 1 to 10. The program tells them 'too high', 'too low', or 'YES!'. Use everything — variables, if/else, input, loops, a function or two. Make me proud!",
        },
        why: "Real games are just lots of tiny decisions glued together. This project proves you can glue them. Plus it's actually fun to play.",
        concept:
          "Pick a secret number. Use a loop so the player can try again. Use input() to get their guess. Use if/elif/else to give feedback. Break out of the loop when they win.",
        task: "Build the game: pick a secret, loop until the player guesses it, print hints each turn.",
        starter: `import random\n\nsecret = random.randint(1, 10)\n# loop here — keep asking until they get it\n`,
      },
      {
        n: 16,
        title: "Fix the bug: indentation",
        blurb: "Python is picky about spaces.",
        xp: 90,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Assistant! My code refuses to run. Python is shouting 'IndentationError' at me. I tried to bribe it. It did not work.",
        },
        why: "Python uses indentation instead of curly braces. One wrong space = the whole function falls over.",
        concept:
          "Inside a function or if-block, every line must be indented with the same number of spaces (usually 4). Mix them and Python panics.",
        task: "Fix the indentation so the function runs without errors.",
        starter: `def greet(name):
print("Hi", name)

greet("Bao")`,
      },
      {
        n: 17,
        title: "Remove the line: stray print",
        blurb: "Delete the line that shouldn't be there.",
        xp: 70,
        language: "python",
        story: {
          character: "Bao",
          text: "I left a 'TODO REMOVE ME' print in my code and Captain Pixel saw it. She made The Face. Please erase the evidence.",
        },
        why: "Clean code = leftover-print-free code. Habit-building.",
        concept:
          "Read each line. Find the one that doesn't belong (the obvious TODO). Delete it.",
        task: "Remove the line that prints 'TODO REMOVE ME'.",
        starter: `name = "Bao"
print("Hi", name)
print("TODO REMOVE ME")
print("Welcome aboard!")`,
      },
      {
        n: 18,
        title: "While loops",
        blurb: "Keep going until something changes.",
        xp: 120,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "For loops know how many times to run. While loops keep going until you tell them to stop. Like me at the dessert table.",
        },
        why: "While loops power game loops, retry logic, and anything that runs 'until something is true'.",
        concept:
          "while condition: runs again and again as long as the condition is true. Change something inside the loop so it eventually becomes false — otherwise it never stops.",
        example: `n = 0\nwhile n < 3:\n    print(n)\n    n = n + 1`,
        task: "Use a while loop to print numbers from 1 to 5 (inclusive). Don't use for or range.",
        starter: `# your while loop here\n`,
      },
      {
        n: 19,
        title: "Fix the bug: infinite loop",
        blurb: "It runs forever. Stop it.",
        xp: 100,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi started the program. Mochi cannot stop it. Mochi is scared. Mochi requests help.",
        },
        why: "Forgetting to update a counter inside a while loop is the #1 way to freeze a program. Spotting it is a life skill.",
        concept:
          "A while loop ends when its condition becomes false. If nothing inside the loop changes the condition, it runs forever.",
        task: "Add a line inside the loop so n eventually becomes >= 5 and the loop stops.",
        starter: `n = 0
while n < 5:
    print("n is", n)
`,
      },
      {
        n: 20,
        title: "String methods",
        blurb: "Strings have superpowers built in.",
        xp: 100,
        language: "python",
        story: {
          character: "Bao",
          text: "Captain told me to fix everyone's name in the roster. Some are 'BAO', some are 'bao'. I want them all neat: 'Bao'.",
        },
        why: "Real data is messy. .upper(), .lower(), .strip(), .title() are how you clean it up.",
        concept:
          "Strings have built-in methods. name.upper() makes it loud. name.lower() makes it quiet. name.title() makes it proper-case.",
        example: `print("bao".title())`,
        task: "Print the name in Title case using .title().",
        starter: `name = "bao nguyen"
# print it as Title Case\n`,
      },
      {
        n: 21,
        title: "f-strings: easy interpolation",
        blurb: "Stop gluing strings with +.",
        xp: 100,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Modern Python has f-strings. Put a tiny f before the quote and you can drop variables right inside the string. Magic. Pure magic.",
        },
        why: "f-strings make code shorter, faster, and easier to read than 'Hi ' + name + '!'.",
        concept:
          "An f-string starts with f and lets you embed variables in {curly braces}: f\"Hi {name}!\"",
        example: `name = "Bao"\nprint(f"Hi {name}!")`,
        task: "Use an f-string to print: 'Hi <name>, you have <score> points.'",
        starter: `name = "Mochi"
score = 42
# print with an f-string\n`,
      },
      {
        n: 22,
        title: "Dictionaries: labeled storage",
        blurb: "Like lists, but with names instead of numbers.",
        xp: 130,
        language: "python",
        story: {
          character: "Captain Pixel",
          text: "Recruit, every pilot has a name, an age, and a callsign. We can't store that as three lists. We need ONE labeled box per pilot. Enter: the dictionary.",
        },
        why: "Dictionaries are how Python represents structured data — every API response, config file, and JSON blob is a dict.",
        concept:
          "Create with {}: pilot = {\"name\": \"Bao\", \"age\": 12}. Read with pilot[\"name\"]. Update with pilot[\"age\"] = 13.",
        example: `p = {"name": "Bao", "age": 12}\nprint(p["name"])`,
        task: "Make a pilot dict with name, age, and callsign. Print 'Callsign: <callsign>'.",
        starter: `# pilot = ...\n`,
      },
      {
        n: 23,
        title: "Looping over a dictionary",
        blurb: "Visit every key and value.",
        xp: 120,
        language: "python",
        story: {
          character: "Bao",
          text: "I have a dict of everyone's snacks. I want to print 'Mochi loves donuts' for each. There must be a way to loop over both the name AND the snack at the same time.",
        },
        why: "Most real data is a dict — looping over keys and values is something you'll do every day.",
        concept:
          "for key, value in d.items(): gives you both at once. Use them inside the loop.",
        example: `for k, v in snacks.items():\n    print(k, "loves", v)`,
        task: "Loop over snacks and print '<name> loves <snack>' for each entry.",
        starter: `snacks = {"Bao": "banh mi", "Mochi": "donuts", "Captain": "coffee"}
# loop here\n`,
      },
      {
        n: 24,
        title: "Fix the bug: off-by-one",
        blurb: "It almost works.",
        xp: 110,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "The countdown prints 10 down to 2. It refuses to say 1. We need 1 for dramatic effect! Find the missing digit!",
        },
        why: "Off-by-one errors are the most common bug in any language. Training your eye on range() saves hours.",
        concept:
          "range(10, 1, -1) goes 10, 9, ... 2 and STOPS. It does NOT include the end number. Change it to range(10, 0, -1).",
        task: "Fix the range so the countdown includes 1.",
        starter: `for i in range(10, 1, -1):
    print(i)
print("Blast off!")
`,
      },
      {
        n: 25,
        title: "Remove the line: duplicate import",
        blurb: "Tidy up the top of the file.",
        xp: 70,
        language: "python",
        story: {
          character: "Captain Pixel",
          text: "Recruit, we import random twice at the top. Once is enough. Delete the extra.",
        },
        why: "Clean imports = clean code. A small habit that signals professionalism.",
        concept:
          "Identical imports do nothing useful. Delete the duplicate.",
        task: "Delete the second 'import random' line.",
        starter: `import random
import random

print(random.randint(1, 6))
`,
      },
      {
        n: 26,
        title: "List comprehensions",
        blurb: "Build a list in one line.",
        xp: 140,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "We want a list of squares: 1, 4, 9, 16. We COULD use a for loop. Or we could do it in one beautiful Pythonic line. Let's be classy.",
        },
        why: "List comprehensions are the most Pythonic feature there is. They're shorter, faster, and once you get them, you'll never go back.",
        concept:
          "[expr for x in iterable] builds a new list. Example: [n*n for n in range(1, 5)] -> [1, 4, 9, 16].",
        example: `squares = [n*n for n in range(1, 6)]`,
        task: "Use a list comprehension to make a list of doubles of numbers 1–10 and print it.",
        starter: `# doubles = ...\nprint(doubles)\n`,
      },
      {
        n: 27,
        title: "Sorting and reversing",
        blurb: "Order is everything.",
        xp: 100,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi has a list of scores in random order. Mochi must show top score first. Mochi requires SORTING.",
        },
        why: "Leaderboards, search results, file listings — sorting is everywhere.",
        concept:
          "sorted(list) returns a new sorted list. sorted(list, reverse=True) sorts high → low. list.sort() sorts in place.",
        example: `sorted([3, 1, 2])  # -> [1, 2, 3]`,
        task: "Print the scores sorted from highest to lowest.",
        starter: `scores = [42, 17, 88, 23, 71]
# print sorted high to low\n`,
      },
      {
        n: 28,
        title: "Reading files",
        blurb: "Pull text from a file.",
        xp: 130,
        language: "python",
        story: {
          character: "Bao",
          text: "Captain gave me a notes.txt and asked me to print every line. I have no idea how Python reads files. Save me.",
        },
        why: "Most real Python jobs touch files: configs, logs, CSVs, datasets.",
        concept:
          "with open('file.txt') as f: opens the file safely. for line in f: walks every line. .strip() removes the trailing newline.",
        example: `with open("x.txt") as f:\n    for line in f:\n        print(line.strip())`,
        task: "Open notes.txt and print each line (already created for you).",
        starter: `# Pretend notes.txt is in this folder. Just simulate it:
notes = "first line\\nsecond line\\nthird line"
for line in notes.split("\\n"):
    # print each line stripped
    pass
`,
      },
      {
        n: 29,
        title: "Try / except: handle errors",
        blurb: "When the user types nonsense.",
        xp: 130,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "I asked for a number. They typed 'banana'. The program EXPLODED. We must handle this gracefully or banana will win.",
        },
        why: "Real input is messy. try/except keeps your program alive when the user (or the network) misbehaves.",
        concept:
          "try: risky_thing()\\nexcept ValueError: do_something_safer(). Catches the specific error you expect.",
        task: "Wrap int(raw) in try/except. On ValueError, print 'Not a number — try again.'",
        starter: `raw = "banana"
# convert raw to int safely
n = int(raw)
print(n * 2)
`,
      },
      {
        n: 30,
        title: "Fix the bug: wrong variable",
        blurb: "Reads the wrong name.",
        xp: 90,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP. Program greets the wrong person. Mochi was promised it would greet Mochi. Mochi has feelings.",
        },
        why: "Typos in variable names are silent bugs. Spotting them quickly is everything.",
        concept:
          "Read the code carefully. Compare variable names — Python won't warn you about typos in time.",
        task: "Fix the bug so the program greets the correct name (Mochi).",
        starter: `name = "Mochi"
print(f"Hi, {nam3}!")
`,
      },
      {
        n: 31,
        title: "Classes: your own types",
        blurb: "Bundle data + behavior together.",
        xp: 160,
        language: "python",
        story: {
          character: "Captain Pixel",
          text: "Recruit, every pet at the Academy needs a name, an age, and a 'speak' move. We could juggle three variables per pet — OR we could make a Pet class. Welcome to the big leagues.",
        },
        why: "Classes are how serious Python programs are structured. Every game, every framework uses them.",
        concept:
          "class Pet: with def __init__(self, name): self.name = name. Methods take self first.",
        example: `class Pet:
    def __init__(self, name):
        self.name = name
    def speak(self):
        print(self.name, "says hi")`,
        task: "Define a Pet class with name + speak() that prints '<name> says hi'. Create one and call .speak().",
        starter: `# define class Pet here\n`,
      },
      {
        n: 32,
        title: "Modules: import the goods",
        blurb: "Stand on the shoulders of giants.",
        xp: 110,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Python comes with hundreds of free modules. Want math? import math. Want random? import random. Want today's date? import datetime. Be lazy. Be wise.",
        },
        why: "Real Python is glue code between modules. The faster you reach for the standard library, the less you reinvent.",
        concept:
          "import math gives you math.sqrt, math.pi, etc. from math import sqrt imports just the one name.",
        example: `import math\nprint(math.sqrt(16))`,
        task: "Use math.sqrt to print the square root of 144.",
        starter: `# import and print here\n`,
      },
      {
        n: 33,
        title: "Lambdas: tiny anonymous functions",
        blurb: "One-line functions on the fly.",
        xp: 120,
        language: "python",
        story: {
          character: "Bao",
          text: "Sometimes I want a function for like, two seconds, and giving it a name feels overkill. Apparently Python has 'lambdas' for this. Sounds wizardly.",
        },
        why: "Lambdas show up in sorted(), filter(), map(), and lots of libraries. Knowing them = reading more real code.",
        concept:
          "lambda x: x * 2 is a tiny function that doubles. Often passed straight into sorted(..., key=lambda x: ...).",
        example: `sorted(["bb", "a", "ccc"], key=lambda s: len(s))`,
        task: "Use sorted with a lambda to sort words by length, shortest first.",
        starter: `words = ["banana", "kiwi", "apple", "fig"]
# print sorted shortest -> longest\n`,
      },
      {
        n: 34,
        title: "Remove the line: dead branch",
        blurb: "Some code can never run.",
        xp: 80,
        language: "python",
        story: {
          character: "Captain Pixel",
          text: "Recruit, there's an unreachable elif in this function. It can NEVER trigger. Find it and delete it.",
        },
        why: "Dead code confuses future readers. Delete what can't run.",
        concept:
          "If age > 10 already returns, the elif age < 5 below can never fire. Remove it.",
        task: "Delete the unreachable elif branch.",
        starter: `def classify(age):
    if age > 10:
        return "big"
    elif age < 5:
        return "tiny"
    elif age < 0:
        return "time traveler"
    else:
        return "medium"

print(classify(7))
`,
      },
      {
        n: 35,
        title: "Working with JSON",
        blurb: "The data format of the internet.",
        xp: 140,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Every API on Earth speaks JSON. Looks like a dict, but it's a string. Python's json module turns it back into a real dict so you can use it.",
        },
        why: "Anything that talks to the web touches JSON. Knowing the json module is required.",
        concept:
          "import json. json.loads('...') turns a JSON string into a Python dict. json.dumps(d) goes the other way.",
        example: `import json\nd = json.loads('{\"a\":1}')`,
        task: "Parse the raw JSON string and print the value of 'name'.",
        starter: `import json
raw = '{"name": "Bao", "age": 12}'
# parse and print name\n`,
      },
      {
        n: 36,
        title: "Fix the bug: wrong type",
        blurb: "Adding a number to a string. Boom.",
        xp: 110,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi tried to add age + ' years'. Python yelled 'TypeError'. Mochi is upset.",
        },
        why: "Type errors are the most common runtime bug. Knowing how to convert is essential.",
        concept:
          "You can't add an int to a str directly. Convert with str(n) first.",
        task: "Fix the line so it prints '12 years' without crashing.",
        starter: `age = 12
print(age + " years")
`,
      },
      {
        n: 37,
        title: "Recursion: function calls itself",
        blurb: "A function that uses itself.",
        xp: 160,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Brace yourself. A function can CALL ITSELF. It sounds insane. It is insane. It is also beautiful. Today: factorial.",
        },
        why: "Recursion is the natural way to express tree problems, fractals, and many puzzles. It also bends your brain in useful ways.",
        concept:
          "Every recursion needs a base case (when to stop) and a recursive case (call itself with a smaller input).",
        example: `def fact(n):\n    if n <= 1: return 1\n    return n * fact(n - 1)`,
        task: "Write fact(n) that returns n! recursively. Print fact(5) — should be 120.",
        starter: `def fact(n):
    # base case + recursive case
    pass

print(fact(5))
`,
      },
      {
        n: 38,
        title: "Dict comprehensions",
        blurb: "Build a dict in one line.",
        xp: 130,
        language: "python",
        story: {
          character: "Bao",
          text: "I want a dict mapping each number from 1 to 5 to its square. Without a for loop. There must be a magic line.",
        },
        why: "Dict comprehensions are the natural sequel to list comprehensions. Compact and Pythonic.",
        concept:
          "{k: v for x in iter} builds a dict. Example: {n: n*n for n in range(1, 6)}.",
        example: `{n: n*n for n in range(1, 4)}`,
        task: "Build a dict mapping 1..5 to their cubes (n*n*n). Print it.",
        starter: `# cubes = ...\nprint(cubes)\n`,
      },
      {
        n: 39,
        title: "Remove the line: useless else",
        blurb: "Some else branches don't help.",
        xp: 70,
        language: "python",
        story: {
          character: "Captain Pixel",
          text: "Recruit, the else here adds nothing — both branches do the same thing. Delete it. Keep the function lean.",
        },
        why: "Dead-equivalent branches add noise. Clean code = decisive code.",
        concept:
          "If two branches print the same thing, you can drop the else and the duplicate line.",
        task: "Remove the unnecessary else branch so the function just prints 'hello' unconditionally.",
        starter: `def greet():
    x = True
    if x:
        print("hello")
    else:
        print("hello")

greet()
`,
      },
      {
        n: 40,
        title: "Mini project: word frequency counter",
        blurb: "Count how often each word appears.",
        xp: 280,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Final assignment, assistant! Given a sentence, count how many times each word appears. Print each word and its count. Useful for spam filters, autocomplete, and beating your friends at Wordle. Probably.",
        },
        why: "Word counts are the foundation of search, AI text models, and data analysis. Tiny project — huge ideas.",
        concept:
          "Split the text on spaces. Loop over the words. Use a dict to keep counts. Print the dict.",
        task: "Lowercase the text, split into words, build a dict {word: count}, then print each 'word: count' line.",
        starter: `text = "the cat sat on the mat the cat smiled"
# build counts dict and print\n`,
      },
    ],
  },
  {
    id: "genai",
    name: "Generative AI",
    tagline: "Talk to AI like a pro — and build with it.",
    accent: "#7C3AED",
    storyIntro:
      "Professor Loop bursts into the lab covered in glitter. 'I built a generative AI! It paints, it writes, it makes up bedtime stories!' He pauses. 'It also painted my cat as a banana. We have a lot to learn about TALKING to these things. Suit up, assistant — we are going prompt-hunting.'",
    missions: [
      {
        n: 1,
        title: "Send your first prompt",
        blurb: "Type. Send. Watch the AI think.",
        xp: 60,
        language: "python",
        kind: "chat",
        story: {
          character: "Professor Loop",
          text: "An AI is like a very enthusiastic puppy that read the entire internet. Today's mission is the easiest one: send it ANY question and read the reply. Just say hi if you like!",
        },
        why: "Every chatbot, image generator, and AI tool runs on prompts. Whoever writes better prompts gets better results — that's the whole game.",
        concept:
          "A prompt is just the instruction you give to an AI. You type, you press send, you read what comes back. We'll get sneakier in later missions.",
        task: "Write any prompt at least 8 words long, then hit Send. The AI just needs to reply.",
        starter: "",
        starterPrompt: "",
        goal: "Get a real reply back from the AI.",
      },
      {
        n: 2,
        title: "Be specific (the magic trick)",
        blurb: "Vague in, vague out.",
        xp: 80,
        language: "python",
        kind: "chat",
        story: {
          character: "Bao",
          text: "I asked the AI to 'tell me a story' and it gave me TWO sentences. TWO. Captain Pixel says I need to be specific. Make it ask for a story about a banana detective on Mars in EXACTLY 5 sentences. Surely it can't ignore that?",
        },
        why: "Adding subject, setting, mood, and constraints is the #1 skill in AI work. Specific prompts get useful answers.",
        concept:
          "Strong prompts answer: WHO, WHAT, WHERE, HOW, HOW LONG. Mention numbers, characters, settings — the AI will follow.",
        example: `Bad:  "tell me a story"\nGood: "tell me a 5-sentence story about a banana detective solving a missing-sock case on Mars"`,
        task: "Write a prompt asking for a story about a banana detective on Mars, exactly 5 sentences long.",
        starter: "",
        starterPrompt: "Tell me a short story.",
        goal: "AI returns a story with exactly 5 sentences that mentions 'banana' AND 'Mars'.",
      },
      {
        n: 3,
        title: "Give the AI a role",
        blurb: "Tell it who to be.",
        xp: 90,
        language: "python",
        kind: "chat",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi asked AI for homework help. AI used words like 'paradigmatic' and Mochi cried. Mochi heard if you tell AI to be a teacher for kids, AI will be nice. Mochi wants this.",
        },
        why: "Roleplay prompts change the AI's tone, vocabulary, and depth. Same question, totally different answer.",
        concept:
          "Start your prompt with 'You are a [role]. Explain [topic] to [audience].' The AI matches the voice.",
        example: `"You are a friendly robot teacher for 9-year-olds. Explain gravity using a story about a juggling penguin."`,
        task: "Write a prompt that makes the AI roleplay as a kid-friendly teacher AND uses the word 'penguin' to explain gravity.",
        starter: "",
        starterPrompt: "Explain gravity.",
        goal: "AI's reply mentions 'penguin' and explains gravity in a friendly, simple way.",
      },
      {
        n: 4,
        title: "Output format: JSON",
        blurb: "Ask for structure, not prose.",
        xp: 110,
        language: "python",
        kind: "chat",
        story: {
          character: "Professor Loop",
          text: "When you want to USE an AI answer in a program, paragraphs are useless. We want JSON — neat little boxes the computer can read. Ask the AI to give you three dinosaur facts as a JSON list of objects.",
        },
        why: "Forcing JSON is how real AI apps get usable data. It's the #1 thing engineers do in production.",
        concept:
          "Ask explicitly: 'Reply with ONLY a JSON array. No other text. Each item should have a \"name\" and a \"fact\".'",
        example: `"Give me 3 dinosaurs as a JSON array. Each item has 'name' and 'fact'. No other text."`,
        task: "Get the AI to reply with a JSON array of 3 dinosaurs, each with 'name' and 'fact' fields.",
        starter: "",
        starterPrompt: "Tell me about three dinosaurs.",
        goal: "AI reply parses as a JSON array of 3 items, each with 'name' and 'fact'.",
      },
      {
        n: 5,
        title: "Few-shot: teach by example",
        blurb: "Show. Then ask.",
        xp: 110,
        language: "python",
        kind: "chat",
        story: {
          character: "Bao",
          text: "I asked the AI for emoji translations and it gave me whole essays. Captain Pixel says if you show it the PATTERN with examples, it copies the style. Let's try: cat -> 🐱, dog -> 🐶, then ask for dragon.",
        },
        why: "Few-shot prompting is how engineers steer AI without retraining. It's a real, paid skill.",
        concept:
          "Pattern: give 2-3 example pairs, then ask for the next. The AI mimics the format.",
        example: `cat -> 🐱\ndog -> 🐶\ndragon -> ?`,
        task: "Write a few-shot prompt with at least 2 example pairs (word -> emoji) and ask for the next one.",
        starter: "",
        starterPrompt: "",
        goal: "AI reply contains at least one emoji character and follows the 'word -> emoji' pattern.",
      },
      {
        n: 6,
        title: "Constraint challenge",
        blurb: "No vowels. No mercy.",
        xp: 130,
        language: "python",
        kind: "chat",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi made silly challenge. Ask AI to describe a cat WITHOUT using letter E. Mochi laughs. Can you make AI follow rule?",
        },
        why: "Constraints are the most fun (and the most useful) prompt-engineering trick. Writers, marketers, designers all use them.",
        concept:
          "State the rule clearly and twice if needed. 'Describe X. Important rule: do NOT use the letter E anywhere.'",
        example: `"Describe a sunset in 3 sentences. RULE: no word may contain the letter 'e'."`,
        task: "Get the AI to describe a cat in 2+ sentences without using the letter 'e' at all.",
        starter: "",
        starterPrompt: "Describe a cat.",
        goal: "AI reply is 2+ sentences about a cat and contains zero letter 'e' (case-insensitive).",
      },
      {
        n: 7,
        title: "Spot the hallucination",
        blurb: "AI lies confidently. Catch it.",
        xp: 120,
        language: "python",
        kind: "chat",
        story: {
          character: "Captain Pixel",
          text: "Listen up, recruit. AI sounds confident even when it's wrong. We call that hallucinating. Ask the AI a real fact, then ask it to CITE A SOURCE. If it makes one up, you'll see it.",
        },
        why: "Trusting AI blindly is how people get into trouble. Always ask for sources.",
        concept:
          "Ask for a fact AND require: 'Cite the source (book, website, or paper) with title and year. If you don't know a real one, say \"no reliable source\".'",
        example: `"Who invented the bicycle? Cite the source with title and year. If unsure, say 'no reliable source'."`,
        task: "Ask the AI a factual question AND require a cited source with a year. Read carefully — is the source real?",
        starter: "",
        starterPrompt: "",
        goal: "AI reply mentions a source with a year (e.g. 'Britannica, 2019') OR explicitly says 'no reliable source'.",
      },
      {
        n: 8,
        title: "Build a prompt template",
        blurb: "Your reusable AI tool.",
        xp: 250,
        language: "python",
        kind: "chat",
        story: {
          character: "Professor Loop",
          text: "Final mission, assistant! Build a TEMPLATE prompt — one that mixes a role, an audience, a topic, AND a format requirement, all in one go. Then send it. If the reply has all four ingredients, you've earned your prompt-engineer badge!",
        },
        why: "Reusable prompt templates power every real AI product. Once you can build one, you can build a tool — and tools are what people pay for.",
        concept:
          "Template = Role + Audience + Topic + Format. All four in one prompt. Example: 'You are a science teacher for 10-year-olds. Explain black holes as exactly 3 bullet points.'",
        task: "Write ONE prompt that combines: (1) a role (e.g. 'You are a...'), (2) an audience (e.g. '10-year-olds'), (3) a topic of your choice, AND (4) asks for the answer as exactly 3 bullet points.",
        starter: "",
        starterPrompt: "",
        goal: "AI reply contains exactly 3 bullet-point lines (lines starting with -, *, or a number).",
      },
    ],
  },
  {
    id: "web-games",
    name: "2D Game Development",
    tagline: "Build real 2D games in your browser using Kaplay.",
    accent: "#DB2777",
    storyIntro:
      "Captain Pixel barges in carrying a smoking arcade cabinet. 'Jason. He hacked every game in the academy arcade. PAC-MAN walks backwards now. Mario refuses to jump. Tetris just... sighs.' She drops the cabinet. 'We're rebuilding the arcade. From scratch. You in?' Spoiler: you're in. Welcome to game dev.",
    missions: [
      {
        n: 1,
        title: "Boot the game engine",
        blurb: "Load Kaplay and open your very first game window.",
        xp: 60,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Step one: power on the machine. Kaplay is a tiny game engine that runs right in the browser \u2014 no installs, no nonsense. The starter code already loads it from the internet. You just need to wake it up by calling kaplay(). Hit Run and watch a black game window appear. That's your canvas. The whole arcade will live in there.",
        },
        why: "Every game needs an engine. Kaplay handles the boring stuff (drawing, timing, input) so you can focus on making the FUN parts.",
        concept:
          "kaplay() initializes the game. You pass it an object with width, height, and background color. Once it runs, you have a game window ready for sprites, text, and chaos.",
        example: "kaplay({ width: 400, height: 300, background: [20, 20, 40] })",
        task: "Inside the second <script>, call kaplay() with width 400, height 300, and background [20, 20, 40]. Hit Run \u2014 you should see a dark blue/black window.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  // Wake up the engine here
</script>
</body>
</html>`,
      },
      {
        n: 2,
        title: "Put something on screen",
        blurb: "Add your first shape \u2014 a glowing pink rectangle.",
        xp: 70,
        language: "html",
        story: {
          character: "Bao",
          text: "Empty window? BORING. Let's slap something in there. In Kaplay, every thing in your game is a 'game object' made by add([...]). You feed it a list of traits \u2014 shape, position, color \u2014 and BOOM, it exists. Add a pink rectangle right in the middle.",
        },
        why: "Game objects are the building blocks of EVERYTHING you'll make: players, enemies, coins, walls, bullets. Learn add() and you've unlocked half the engine.",
        concept:
          "add([trait1, trait2, ...]) creates a new game object. Traits include rect(w,h) for a rectangle, pos(x,y) for position, and color(r,g,b) for color. Stack as many traits as you want.",
        example: "add([ rect(60, 60), pos(170, 120), color(255, 100, 200) ])",
        task: "After kaplay(), add a rectangle that is 60 wide, 60 tall, positioned at (170, 120), colored bright pink (255, 100, 200).",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  // Add your rectangle below
</script>
</body>
</html>`,
      },
      {
        n: 3,
        title: "Make it move",
        blurb: "A character that drifts across the screen.",
        xp: 80,
        language: "html",
        story: {
          character: "Mochi",
          text: "Beep boop! A square that just SITS there is not a game. That's a painting. I'm a robot pet, I should know the difference. Let's make it move! Save the object in a variable and slide it sideways every frame.",
        },
        why: "Movement is what makes pixels feel alive. Once you can move ONE thing, you can move enemies, bullets, particles \u2014 anything.",
        concept:
          "Save the object: const player = add([...]). Then onUpdate(() => { player.move(speed, 0) }) runs every frame. move(x, y) is pixels per second. Negative x = left, positive = right.",
        example: "onUpdate(() => { player.move(60, 0) })",
        task: "Save your rectangle in a variable called player. Then call onUpdate so it moves 60 pixels per second to the right.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  const player = add([ rect(40, 40), pos(40, 130), color(255, 100, 200) ])
  // Make it move every frame
</script>
</body>
</html>`,
      },
      {
        n: 4,
        title: "Player controls",
        blurb: "Arrow keys to move left and right.",
        xp: 90,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Auto-pilot is fine for cargo ships. Not games. A game needs a HUMAN at the wheel \u2014 that's the magic. Wire up the left and right arrow keys so the player only moves when the player wants to move.",
        },
        why: "Input is what turns a moving picture into a GAME. Every joystick, jump, and grab starts with one of these key handlers.",
        concept:
          "onKeyDown('left', () => { ... }) fires every frame WHILE the key is held down. Inside, call player.move(-200, 0) to go left, or move(200, 0) to go right.",
        example:
          "onKeyDown('left',  () => player.move(-200, 0))\nonKeyDown('right', () => player.move(200, 0))",
        task: "Remove the constant onUpdate motion. Add two onKeyDown handlers \u2014 left arrow moves player at -200, right arrow moves at +200. Click the game window first, then press arrows.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  const player = add([ rect(40, 40), pos(180, 130), color(255, 100, 200) ])
  // Add arrow-key controls below
</script>
</body>
</html>`,
      },
      {
        n: 5,
        title: "Gravity!",
        blurb: "What goes up must come down.",
        xp: 110,
        language: "html",
        story: {
          character: "Bao",
          text: "Okay so I tried adding gravity to my game by HAND yesterday. 200 lines of code. It looked like a confused balloon. Captain Pixel just laughed and pointed at body(). Turns out Kaplay does physics for you. Just add the body() trait, set world gravity, and your player FALLS.",
        },
        why: "Gravity is the heartbeat of platformers (Mario, Celeste, Hollow Knight). One trait, instant physics.",
        concept:
          "setGravity(1200) sets how strong gravity pulls down. Add body() as a trait on your player and it becomes a physics object that falls and can jump.",
        example: "setGravity(1200)\nconst player = add([ rect(40, 40), pos(180, 50), color(255, 100, 200), body() ])",
        task: "Add setGravity(1200) before creating the player. Then add body() as a trait inside the player's add([...]) list. Hit Run \u2014 the player should fall off the bottom of the screen.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  // Set gravity below, then update the player to use body()
  const player = add([ rect(40, 40), pos(180, 50), color(255, 100, 200) ])
</script>
</body>
</html>`,
      },
      {
        n: 6,
        title: "Build the floor",
        blurb: "Add a platform so the player has something to stand on.",
        xp: 110,
        language: "html",
        story: {
          character: "Mochi",
          text: "Beep! Player fell into the void! That's sad. Let's give him a FLOOR. In Kaplay, anything with body({ isStatic: true }) and area() becomes solid ground. Build a long thin rectangle at the bottom.",
        },
        why: "Floors, walls, ceilings, moving platforms \u2014 they're all built with the same recipe. Master this once and you can build any level.",
        concept:
          "area() gives an object a collision box. body({ isStatic: true }) makes it solid AND immovable. Together: a wall the player can't pass through.",
        example: "add([ rect(400, 30), pos(0, 270), color(80, 80, 120), area(), body({ isStatic: true }) ])",
        task: "Below the player, add a floor: rectangle 400 wide \u00d7 30 tall, positioned at (0, 270), color (80, 80, 120), with area() and body({ isStatic: true }) traits. The player should now land on it.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  setGravity(1200)
  const player = add([ rect(40, 40), pos(180, 50), color(255, 100, 200), area(), body() ])
  // Build the floor below
</script>
</body>
</html>`,
      },
      {
        n: 7,
        title: "Jump!",
        blurb: "Tap space to leap into the air.",
        xp: 120,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Standing on the floor is fine. JUMPING is iconic. Wire up the spacebar so a tap launches the player upward \u2014 but only if they're on the ground (no infinite double-jumps... yet).",
        },
        why: "The jump is the single most important mechanic in 2D games. Tuning jump feel = tuning the whole experience.",
        concept:
          "onKeyPress (not onKeyDown) fires ONCE per tap, not every frame. player.isGrounded() returns true when standing on something. player.jump(600) launches upward at 600 pixels/sec.",
        example: "onKeyPress('space', () => { if (player.isGrounded()) player.jump(600) })",
        task: "Add an onKeyPress for 'space'. Inside, check if the player isGrounded() \u2014 if so, call player.jump(600).",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  setGravity(1200)
  const player = add([ rect(40, 40), pos(180, 50), color(255, 100, 200), area(), body() ])
  add([ rect(400, 30), pos(0, 270), color(80, 80, 120), area(), body({ isStatic: true }) ])
  onKeyDown('left',  () => player.move(-200, 0))
  onKeyDown('right', () => player.move(200, 0))
  // Add jump below
</script>
</body>
</html>`,
      },
      {
        n: 8,
        title: "Collect a coin",
        blurb: "Touch the coin, the coin disappears, you feel powerful.",
        xp: 130,
        language: "html",
        story: {
          character: "Bao",
          text: "What's a game without LOOT? Add a shiny coin. When the player touches it, it should vanish. We'll use 'tags' \u2014 labels you put on objects so collision code can recognize them.",
        },
        why: "Collectibles drive every platformer, every RPG, every roguelike. The 'touch \u2192 collect \u2192 react' pattern is the foundation of game feedback.",
        concept:
          "Add a string like \"coin\" as a trait \u2014 that's a tag. onCollide('coin', (c) => { destroy(c) }) runs whenever the player touches anything tagged 'coin'. destroy() removes the object.",
        example: "add([ circle(12), pos(300, 240), color(255, 220, 0), area(), \"coin\" ])\nplayer.onCollide('coin', (c) => destroy(c))",
        task: "Add a yellow circle (radius 12) at position (300, 240) with area() and the tag \"coin\". Then call player.onCollide('coin', c => destroy(c)) so it disappears on touch.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  setGravity(1200)
  const player = add([ rect(40, 40), pos(40, 50), color(255, 100, 200), area(), body() ])
  add([ rect(400, 30), pos(0, 270), color(80, 80, 120), area(), body({ isStatic: true }) ])
  onKeyDown('left',  () => player.move(-200, 0))
  onKeyDown('right', () => player.move(200, 0))
  onKeyPress('space', () => { if (player.isGrounded()) player.jump(600) })
  // Add a coin + collide handler below
</script>
</body>
</html>`,
      },
      {
        n: 9,
        title: "Score counter",
        blurb: "Show points in the top corner, +1 per coin.",
        xp: 150,
        language: "html",
        story: {
          character: "Mochi",
          text: "Beep! Coin grabbed. But... nobody KNEW. No celebration. No number going up. I need that sweet dopamine number, friend. Add a score in the corner and bump it every time we grab a coin.",
        },
        why: "Score is feedback. Numbers going up = brain happy. Every arcade classic lives on this loop.",
        concept:
          "let score = 0 holds the number. const label = add([ text('Score: 0'), pos(10, 10) ]) shows it. In the coin collide handler, do score++; label.text = 'Score: ' + score.",
        example: "let score = 0\nconst label = add([ text('Score: 0'), pos(10, 10) ])",
        task: "Add THREE coins at different positions (e.g. x=150, 250, 350). Create a score variable and label. In the collide handler, increment score and update label.text.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  setGravity(1200)
  const player = add([ rect(40, 40), pos(40, 50), color(255, 100, 200), area(), body() ])
  add([ rect(400, 30), pos(0, 270), color(80, 80, 120), area(), body({ isStatic: true }) ])
  onKeyDown('left',  () => player.move(-200, 0))
  onKeyDown('right', () => player.move(200, 0))
  onKeyPress('space', () => { if (player.isGrounded()) player.jump(600) })
  // Add 3 coins, a score variable, a label, and the collide handler below
</script>
</body>
</html>`,
      },
      {
        n: 10,
        title: "Your first mini-game",
        blurb: "Win screen when all coins are collected.",
        xp: 200,
        language: "html",
        story: {
          character: "Captain Pixel",
          text: "Recruit \u2014 look at you. Player. Floor. Jump. Coins. Score. That's a GAME. Final step: a win condition. When the last coin disappears, show 'YOU WIN!' across the screen. Then post a screenshot in the Wall of Recruits. I expect tears of joy. Mine. Yours. Whatever.",
        },
        why: "Every great game has an ending. A clear goal turns a toy into a CHALLENGE. Even a 10-second mini-game with a real win condition feels like a real game.",
        concept:
          "Check score against a target. When score >= 3, show a big text label in the center. Tip: add([ text('YOU WIN!', { size: 48 }), pos(80, 120), color(255, 255, 100) ]).",
        example: "if (score >= 3) { add([ text('YOU WIN!', { size: 48 }), pos(60, 110), color(255, 255, 100) ]) }",
        task: "After incrementing the score in the collide handler, check if score === 3 (or however many coins you have). If so, add a 'YOU WIN!' text in the middle of the screen.",
        starter: `<!DOCTYPE html>
<html>
<head><style>body{margin:0;background:#0f172a}</style></head>
<body>
<script src="https://unpkg.com/kaplay@3001.0.0-alpha.27/dist/kaplay.js"></script>
<script>
  kaplay({ width: 400, height: 300, background: [20, 20, 40] })
  setGravity(1200)
  const player = add([ rect(40, 40), pos(40, 50), color(255, 100, 200), area(), body() ])
  add([ rect(400, 30), pos(0, 270), color(80, 80, 120), area(), body({ isStatic: true }) ])
  add([ circle(12), pos(150, 240), color(255, 220, 0), area(), "coin" ])
  add([ circle(12), pos(250, 240), color(255, 220, 0), area(), "coin" ])
  add([ circle(12), pos(350, 240), color(255, 220, 0), area(), "coin" ])
  let score = 0
  const label = add([ text('Score: 0'), pos(10, 10) ])
  onKeyDown('left',  () => player.move(-200, 0))
  onKeyDown('right', () => player.move(200, 0))
  onKeyPress('space', () => { if (player.isGrounded()) player.jump(600) })
  player.onCollide('coin', (c) => {
    destroy(c)
    score++
    label.text = 'Score: ' + score
    // Show YOU WIN when all coins collected
  })
</script>
</body>
</html>`,
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
    scaffold: [
      { line: "<!DOCTYPE html>", note: "Tells the browser this is HTML — every page starts here." },
      { line: "<html>\n<head>\n  <style>\n    body  { font-family: sans-serif; padding: 32px; background: #F0F9F8; }\n    label { display: block; margin-top: 12px; font-weight: 600; }\n    input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 240px; }\n    button{ margin-top: 16px; background: #2C7A7B; color: white; border: 0; padding: 10px 18px; border-radius: 999px; font-weight: 600; cursor: pointer; }\n  </style>\n</head>", note: "Cool teal styling — cloud people like soft and calming." },
      { line: "<body>", note: "Page content starts here." },
      { line: "  <h1>Cloud License Sign-Up</h1>", note: "A clear, friendly title so nobody panics." },
      { line: "  <form>", note: "A <form> groups all the input fields together." },
      { line: '    <label for="name">Name</label>\n    <input id="name" />', note: "First field. The label tells the user what to type." },
      { line: '    <label for="age">Age</label>\n    <input id="age" type="number" />', note: "Second field — a number input means only digits." },
      { line: '    <label for="cloud">Favorite cloud</label>\n    <input id="cloud" placeholder="cumulus, cirrus, stratus..." />', note: "Cloud people LOVE this question. Add a placeholder for hints." },
      { line: "    <button type=\"submit\">Submit</button>", note: "The big finishing button. License granted." },
      { line: "  </form>\n</body>\n</html>", note: "Close the form, body, and html. Cloud office is happy." },
    ],
  },
  {
    id: "sonix",
    planet: "Planet Sonix",
    glyph: "S",
    accent: "#E89F47",
    client: "Mochi",
    tagline: "Mochi needs a playlist page for the Academy disco.",
    brief:
      "BEEP! Mochi is DJ tonight. Mochi has six songs. Mochi has no webpage. Captain Pixel said no webpage means no disco. Mochi cannot disappoint the recruits. Please build Mochi a playlist page with a bouncy title and a list of songs. Bonus points if it looks like a party.",
    needs: [
      "A big colorful <h1> like 'Mochi's Mega Mix'",
      "An <ol> or <ul> with at least six songs",
      "Each song shows artist and title (your choice)",
      "A bright, fun background — disco vibes",
    ],
    hint: "Try a CSS gradient for the background: `background: linear-gradient(135deg, #E89F47, #7C3AED);`",
    reward: 180,
    language: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; color: white; background: #0F172A; }
    h1 { font-size: 42px; }
  </style>
</head>
<body>
  <h1>Mochi's Mega Mix</h1>
  <ol>
    <li>Track 1 — Mystery Artist</li>
  </ol>
</body>
</html>`,
    scaffold: [
      { line: "<!DOCTYPE html>", note: "Start of the page — browsers expect this on line one." },
      { line: "<html>\n<head>\n  <style>\n    body { font-family: sans-serif; padding: 32px; color: white; background: linear-gradient(135deg, #E89F47, #7C3AED); }\n    h1 { font-size: 48px; text-shadow: 0 2px 0 #0F172A; }\n    li { font-size: 18px; padding: 6px 0; }\n  </style>\n</head>", note: "Wild gradient background + giant title — proper disco energy." },
      { line: "<body>", note: "Page content begins." },
      { line: "  <h1>Mochi's Mega Mix 🎧</h1>", note: "Loud, friendly title — emoji optional but encouraged." },
      { line: "  <ol>", note: "An <ol> is an ordered (numbered) list, perfect for a playlist." },
      { line: "    <li>Robot Boogie — Mochi & The Beeps</li>", note: "First track." },
      { line: "    <li>Cosmic Noodles — Bao Sound System</li>\n    <li>Captain's Theme — Pixel Symphonic</li>\n    <li>Forget-Me-Not Funk — Professor Loop</li>\n    <li>Cloud Surfer — Nimbus Crew</li>\n    <li>Final Boss — The Recruits</li>", note: "Five more songs — six total. Swap in your own." },
      { line: "  </ol>\n</body>\n</html>", note: "Close the list, body, and html. DJ Mochi is ready." },
    ],
  },
  {
    id: "mazora",
    planet: "Planet Mazora",
    glyph: "M",
    accent: "#193b92",
    client: "Captain Pixel",
    tagline: "Print a maze pattern for the cadet training course.",
    brief:
      "Recruit — Academy needs a quick maze pattern printed for the cadet training course. Nothing fancy: walls made of # and spaces inside, six rows tall, ten columns wide. Use a loop. We don't draw 60 characters by hand around here.",
    needs: [
      "Print exactly 6 rows",
      "Top and bottom rows are solid (e.g. ##########)",
      "Middle rows start with #, end with #, spaces in between",
      "Use a loop — no copy-pasting the same line six times",
    ],
    hint: "Use `for i in range(6):` and an `if` to decide whether to print a solid wall or a side-wall row.",
    reward: 190,
    language: "python",
    starter: `# Print a 6-row, 10-column maze.
# Top and bottom: ##########
# Middle rows:    #        #

for i in range(6):
    print("##########")`,
    scaffold: [
      { line: "# Maze for Mazora — 6 rows tall, 10 columns wide", note: "Comment so future-you remembers what this is." },
      { line: "rows = 6", note: "Store the size in a variable so it's easy to change later." },
      { line: "cols = 10", note: "Same for width — clean code uses variables, not magic numbers." },
      { line: "wall = '#' * cols", note: "'#' * 10 gives '##########'. Python multiplies strings — wild." },
      { line: "side = '#' + ' ' * (cols - 2) + '#'", note: "A wall, eight spaces, a wall — that's a middle row." },
      { line: "for i in range(rows):", note: "Loop six times — once for each row." },
      { line: "    if i == 0 or i == rows - 1:", note: "First and last rows are the solid top and bottom." },
      { line: "        print(wall)", note: "Print the solid wall on those rows." },
      { line: "    else:", note: "Otherwise we're in the middle of the maze." },
      { line: "        print(side)", note: "Print the open row. Done — Captain Pixel salutes." },
    ],
  },
  {
    id: "cortex",
    planet: "Planet Cortex",
    glyph: "C",
    accent: "#7C3AED",
    client: "Professor Loop",
    tagline: "Build a prompt-builder for Professor Loop's pet AI.",
    brief:
      "I built a generative AI on Cortex and I cannot stop talking to it. The problem is I always forget the GOOD prompt structure — role, audience, task, format. Build me a tiny prompt-builder that takes those four pieces, sticks them together, and prints the final prompt. I will copy and paste it forever. Glory!",
    needs: [
      "Four variables: role, audience, task, format",
      "Combine them into one final prompt string",
      "Print a header like '=== FINAL PROMPT ===' before the prompt",
      "Use a function (def) so it's reusable",
    ],
    hint: "Try `def build(role, audience, task, format):` then return a string that joins all four pieces with line breaks (`\\n`).",
    reward: 220,
    language: "python",
    starter: `# Professor Loop's prompt builder

def build(role, audience, task, format):
    return role

print(build("You are a fun teacher.", "8 year olds", "Explain volcanoes", "3 short bullet points"))`,
    scaffold: [
      { line: "# Prompt builder for Professor Loop's pet AI", note: "Top-of-file comment — what this script does." },
      { line: "def build(role, audience, task, format):", note: "A function with four inputs — the building blocks of a strong prompt." },
      { line: '    prompt = role + "\\n"', note: "Start with the role on its own line." },
      { line: '    prompt = prompt + "Audience: " + audience + "\\n"', note: "Add who the answer is for." },
      { line: '    prompt = prompt + "Task: " + task + "\\n"', note: "Now the actual job we want done." },
      { line: '    prompt = prompt + "Format: " + format', note: "And how we want the answer shaped." },
      { line: "    return prompt", note: "Hand the finished prompt back so we can print it (or send it to an AI)." },
      { line: 'print("=== FINAL PROMPT ===")', note: "A header so the professor can spot the output." },
      { line: 'print(build("You are a fun science teacher.", "9 year olds", "Explain volcanoes", "3 short bullet points"))', note: "Call the function with real values. Copy the output into ChatGPT and watch it work." },
    ],
  },
  {
    id: "zephyr",
    planet: "Planet Zephyr",
    glyph: "Z",
    accent: "#0EA5E9",
    client: "Bao",
    tagline: "Build a weather report card webpage.",
    brief:
      "Planet Zephyr has SEVEN weather systems in one day. The locals are confused. Build them a webpage with today's weather: a big temperature, a condition (sunny / windy / etc.), and a friendly tip. Make it look like a real little weather card. Save Zephyr.",
    needs: [
      "An <h1> with the city name",
      "A big number for the temperature (style it large)",
      "A paragraph with the weather condition",
      "A tip paragraph (style it in a soft color)",
      "Wrap everything in a card with rounded corners and a soft shadow",
    ],
    hint: "Use a <div class=\"card\"> with padding, border-radius, and box-shadow.",
    reward: 180,
    language: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #E0F2FE; padding: 40px; }
  </style>
</head>
<body>
  <h1>Zephyr City</h1>
  <p>22°C — sunny</p>
</body>
</html>`,
    scaffold: [
      { line: "<!DOCTYPE html>", note: "Standard opener." },
      { line: "<html>\n<head>\n  <style>\n    body { font-family: sans-serif; background: #E0F2FE; padding: 40px; }\n    .card { background: white; max-width: 320px; margin: auto; padding: 24px; border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); text-align: center; }\n    .temp { font-size: 64px; font-weight: 700; color: #0369A1; }\n    .tip { color: #64748B; font-size: 14px; }\n  </style>\n</head>", note: "Soft sky background + a clean card shell." },
      { line: "<body>\n  <div class=\"card\">", note: "Open the card wrapper — everything goes inside." },
      { line: "    <h1>Zephyr City</h1>", note: "City name as the headline." },
      { line: "    <div class=\"temp\">22°C</div>", note: "Big bold temperature — visually loud." },
      { line: "    <p>Sunny with a chance of glitter clouds.</p>", note: "Condition line — keep it short." },
      { line: "    <p class=\"tip\">Tip: bring a light jacket, just in case.</p>", note: "Friendly tip in muted color." },
      { line: "  </div>\n</body>\n</html>", note: "Close the card, body, html. Done." },
    ],
  },
  {
    id: "ember",
    planet: "Planet Ember",
    glyph: "E",
    accent: "#DC2626",
    client: "Professor Loop",
    tagline: "Build a 'guess the volcano temperature' Python game.",
    brief:
      "Ember's volcanoes are extremely dramatic and the locals love a good guessing game. Build me a Python program that picks a secret temperature between 100 and 1000 and lets the player keep guessing with 'too hot' / 'too cold' hints until they get it. Three guesses or fewer wins a sticker. Glory awaits!",
    needs: [
      "Pick a random secret with random.randint(100, 1000)",
      "Loop so the player can keep guessing",
      "Print 'too hot' if guess > secret, 'too cold' if lower, 'YES!' on match",
      "Break out of the loop on a correct guess",
      "Use input() for each guess",
    ],
    hint: "Try `while True:` with `if guess == secret: break`.",
    reward: 220,
    language: "python",
    starter: `import random

secret = random.randint(100, 1000)
# loop until the player guesses it
`,
    scaffold: [
      { line: "import random", note: "We need random to pick the secret." },
      { line: "secret = random.randint(100, 1000)", note: "Pick a hidden number — the player will never see it." },
      { line: "tries = 0", note: "Count attempts so we can taunt them later." },
      { line: "while True:", note: "Loop forever — we'll break out when they win." },
      { line: "    raw = input(\"Your guess: \")", note: "Ask for input each turn." },
      { line: "    guess = int(raw)", note: "Convert text input into a number." },
      { line: "    tries = tries + 1", note: "Bump the attempt counter." },
      { line: "    if guess == secret:", note: "Winning case first — easiest to read." },
      { line: "        print(f\"YES! Got it in {tries} tries.\")", note: "Celebrate with an f-string." },
      { line: "        break", note: "Leave the loop — game over." },
      { line: "    elif guess > secret:", note: "Hotter means they overshot." },
      { line: "        print(\"too hot\")", note: "Hint." },
      { line: "    else:", note: "Otherwise too cold." },
      { line: "        print(\"too cold\")", note: "Hint." },
    ],
  },
  {
    id: "harmony",
    planet: "Planet Harmony",
    glyph: "H",
    accent: "#16A34A",
    client: "Mochi",
    tagline: "Build a kindness messages webpage.",
    brief:
      "BEEP. On Planet Harmony, every visitor must receive ONE kind message before they leave. Mochi needs a webpage that shows three kind messages, each in its own card, side by side in a row. Make them pretty. Mochi will hand them out to lonely robots. Mochi cares.",
    needs: [
      "An <h1> like 'Kind messages for you'",
      "Three message cards in a single row (use flexbox)",
      "Each card has rounded corners, padding, and a soft background",
      "Each card has different but warm background colors",
      "Center the row on the page",
    ],
    hint: "Use display: flex on a container with gap: 16px. Center with justify-content: center.",
    reward: 200,
    language: "html",
    starter: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 32px; text-align: center; }
  </style>
</head>
<body>
  <h1>Kind messages for you</h1>
</body>
</html>`,
    scaffold: [
      { line: "<!DOCTYPE html>", note: "Standard opener." },
      { line: "<html>\n<head>\n  <style>\n    body { font-family: sans-serif; padding: 32px; text-align: center; background: #F0FDF4; }\n    .row { display: flex; gap: 16px; justify-content: center; margin-top: 24px; }\n    .card { padding: 20px; border-radius: 16px; width: 180px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }\n    .a { background: #FEF3C7; }\n    .b { background: #DBEAFE; }\n    .c { background: #FCE7F3; }\n  </style>\n</head>", note: "A flex row + three pastel card backgrounds." },
      { line: "<body>\n  <h1>Kind messages for you</h1>", note: "Friendly headline." },
      { line: "  <div class=\"row\">", note: "Open the flex row — three cards inside." },
      { line: "    <div class=\"card a\"><p>You're doing great today.</p></div>", note: "Card 1 — yellow." },
      { line: "    <div class=\"card b\"><p>Someone is thinking of you.</p></div>", note: "Card 2 — blue." },
      { line: "    <div class=\"card c\"><p>Mochi believes in you. BEEP.</p></div>", note: "Card 3 — pink." },
      { line: "  </div>\n</body>\n</html>", note: "Close everything. Mochi salutes you." },
    ],
  },
];

