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
  id: "web" | "python" | "genai";
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
        title: "What even is a prompt?",
        blurb: "Your words are the steering wheel.",
        xp: 60,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "An AI is like a very enthusiastic puppy that read the entire internet. It will do whatever you ask — but ONLY what you ask. The thing you ask it is called a prompt. Today we just practice writing one out loud.",
        },
        why: "Every chatbot, image generator, and AI tool runs on prompts. Whoever writes better prompts gets better results — that's the whole game.",
        concept:
          "A prompt is just the instruction you give to an AI. The clearer and more specific it is, the better the answer. 'Write something' is bad. 'Write a 3-line poem about a sleepy cat' is great.",
        example: `prompt = "Write a haiku about pizza"\nprint("Sending to AI:", prompt)`,
        task: "Change the prompt to ask for a haiku about your favorite animal.",
        starter: `prompt = "Write a haiku about pizza"\nprint("Sending to AI:", prompt)`,
      },
      {
        n: 2,
        title: "Be specific (the magic trick)",
        blurb: "Add details and watch the AI shine.",
        xp: 80,
        language: "python",
        story: {
          character: "Bao",
          text: "I asked the AI to 'draw a dog' and it gave me something that looked like a potato with ears. Captain Pixel says I need to be MORE SPECIFIC. Help me upgrade the prompt before I get demoted to potato duty.",
        },
        why: "Vague prompts get vague results. Adding subject, style, mood, and details is the #1 skill in AI work — and it transfers to every job in the future.",
        concept:
          "Strong prompts answer: WHO (subject), WHAT (action), WHERE (setting), HOW (style/mood). 'A golden retriever puppy chasing a butterfly in a sunny meadow, watercolor style' beats 'draw a dog' every time.",
        example: `vague = "draw a dog"\nstrong = "a golden retriever puppy chasing a butterfly, watercolor"\nprint(strong)`,
        task: "Rewrite the vague prompt into a specific one with subject, action, and style.",
        starter: `vague = "draw a dog"\nstrong = "draw a dog"  # upgrade me\nprint(strong)`,
      },
      {
        n: 3,
        title: "Give the AI a role",
        blurb: "Tell it who to pretend to be.",
        xp: 90,
        language: "python",
        story: {
          character: "Mochi",
          text: "BEEP. Mochi asked AI for homework help. AI gave answer that was very smart but Mochi did not understand any of words. Mochi heard you can tell AI to be a teacher for kids. Mochi wants this.",
        },
        why: "Roleplay prompts ('You are a friendly science teacher for 10-year-olds...') change the AI's tone, vocabulary, and depth. It's how pros get useful, age-appropriate answers.",
        concept:
          "Start your prompt with 'You are a [role]. Explain [topic] to [audience].' The AI will match that voice. Same question, totally different answer.",
        example: `role = "You are a pirate chef."\ntask = "Explain how to make a sandwich."\nprint(role + " " + task)`,
        task: "Make the AI act as a friendly robot teacher explaining gravity to a 9-year-old.",
        starter: `role = "You are ..."  # choose a role\ntask = "Explain gravity."\nprint(role + " " + task)`,
      },
      {
        n: 4,
        title: "Image prompts",
        blurb: "Words become pictures.",
        xp: 100,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Today the AI will PAINT for us! But it cannot read minds. It can only read your prompt. So we layer in: subject, setting, art style, lighting, color. Stack those words like a sandwich and you get masterpieces. Skip them and you get... well, my banana cat.",
        },
        why: "Image generators (DALL-E, Midjourney, Stable Diffusion) all use stacked-keyword prompts. This skill makes the difference between blurry mush and gallery-worthy art.",
        concept:
          "Image prompt formula: [subject], [setting], [style], [lighting], [extra mood]. Example: 'a tiny dragon, sitting on a stack of books, in a cozy library, warm candlelight, watercolor illustration'.",
        example: `parts = ["a tiny dragon", "on a pile of books", "cozy library", "watercolor"]\nprint(", ".join(parts))`,
        task: "Build an image prompt for a robot pet — include subject, setting, style, and mood.",
        starter: `parts = ["a robot pet"]\n# add 3 more details\nprint(", ".join(parts))`,
      },
      {
        n: 5,
        title: "Few-shot: show examples",
        blurb: "Teach the AI by example.",
        xp: 110,
        language: "python",
        story: {
          character: "Bao",
          text: "I asked the AI to make rhymes for my song. It kept giving me boring ones. Captain Pixel says if I show it TWO good examples first, it will copy the style. This is genius and also kind of sneaky. I love it.",
        },
        why: "Few-shot prompting (giving examples in the prompt) is how engineers fine-tune AI behavior without retraining the model. It's a real, paid skill.",
        concept:
          "Pattern: 'Here are examples. Now do the same.'\nExample 1: input -> output\nExample 2: input -> output\nYour turn: input -> ?",
        example: `prompt = """Rhyme with these.\ncat -> hat\ndog -> log\nfrog -> ?"""\nprint(prompt)`,
        task: "Build a few-shot prompt that teaches the AI to turn nouns into emoji. Give 2 examples then ask for a third.",
        starter: `prompt = """Turn nouns into emoji.\ncat -> 🐱\n# add another example\n# then ask for the next one"""\nprint(prompt)`,
      },
      {
        n: 6,
        title: "Prompt chaining",
        blurb: "Use one AI answer to ask the next question.",
        xp: 120,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Big brain time! Today: chains. First we ask the AI for a story idea. Then we feed THAT idea back in and ask for chapter one. Each answer feeds the next prompt. This is how real AI apps work. Mind = blown. Glitter = everywhere.",
        },
        why: "Real AI products (writing apps, code assistants, agents) work by chaining prompts. Learning this now puts you ahead of most adults.",
        concept:
          "Step 1: ask AI for X. Step 2: take its answer and put it inside the next prompt. In Python we'd store answers in variables and build the next prompt with them.",
        example: `idea = "a sleepy dragon librarian"\nchapter_prompt = "Write chapter one about " + idea\nprint(chapter_prompt)`,
        task: "Chain two prompts: first ask for a hero name, then use it inside a prompt asking for that hero's backstory.",
        starter: `hero_name = "Captain Mochi"  # imagine the AI returned this\nbackstory_prompt = "Tell the origin story of " + hero_name\nprint(backstory_prompt)`,
      },
      {
        n: 7,
        title: "Evaluating AI answers",
        blurb: "AI lies sometimes. Spot it.",
        xp: 120,
        language: "python",
        story: {
          character: "Captain Pixel",
          text: "Listen up, recruit. AI sounds confident even when it's wrong. We call that hallucinating. Your job as a smart builder is to ALWAYS check. Today we make a simple checker that flags answers we should double-verify.",
        },
        why: "Trusting AI blindly is how people get into trouble. Critical thinking + verification is what separates skilled AI users from victims of AI.",
        concept:
          "Make a checklist: (1) Does it sound made up? (2) Can I find a real source? (3) Did it cite anything? If any answer is shaky, verify with a real source before using it.",
        example: `answer = "The Eiffel Tower is in Brazil."\nif "Eiffel" in answer and "Brazil" in answer:\n    print("⚠️ Double check this!")`,
        task: "Print three questions a smart kid should ask before trusting any AI answer.",
        starter: `checks = [\n    "Where does this fact come from?",\n    # add two more\n]\nfor c in checks:\n    print("-", c)`,
      },
      {
        n: 8,
        title: "Mini project: build a prompt template",
        blurb: "Your own reusable AI tool.",
        xp: 250,
        language: "python",
        story: {
          character: "Professor Loop",
          text: "Final mission of the chapter! Build me a prompt TEMPLATE. The user fills in a topic and an audience, and out pops a perfectly engineered prompt — role, format, examples, the works. This is the skill that turns kids into AI engineers. Off you go!",
        },
        why: "Reusable prompt templates power every real AI product. Once you can build one, you can build a tool — and tools are what people pay for.",
        concept:
          "Use variables for the bits that change (topic, audience, style). Build the full prompt by combining them. Print the result so you can copy it into any AI tool.",
        task: "Build a function that takes topic and audience and returns a full prompt with a role, the topic, and a clear format request.",
        starter: `def build_prompt(topic, audience):\n    role = "You are a fun teacher."\n    # combine role + audience + topic into one prompt\n    return role\n\nprint(build_prompt("volcanoes", "8 year olds"))`,
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
];

