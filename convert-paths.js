/**
 * Convert paths script
 * Converts image, CSS, and internal links for language-specific directories
 */

const fs = require('fs');
const path = require('path');

function convertPathsForLanguageVersion(filePath, lang) {
  console.log(`Converting paths for ${lang}: ${filePath}`);

  let content = fs.readFileSync(filePath, 'utf8');

  // Convert image paths: images/ -> ../images/
  content = content.replace(/src="images\//g, 'src="../images/');
  content = content.replace(/href="images\//g, 'href="../images/');

  // Convert CSS paths: css/ -> ../css/
  content = content.replace(/href="css\//g, 'href="../css/');

  // Remove data-i18n attributes (static content now)
  // Keep the original text, just remove the attributes

  // Update internal navigation links to include language prefix
  // But NOT external links or hash links
  const linkUpdates = {
    'href="index.html"': `href="/en/index.html"`,
    'href="free-trial.html"': `href="/en/free-trial.html"`,
    'href="how-it-works.html"': `href="/en/how-it-works.html"`,
    'href="blog.html"': `href="/en/blog.html"`,
    'href="plans-and-faq.html"': `href="/en/plans-and-faq.html"`,
    'href="student-projects.html"': `href="/en/student-projects.html"`,
    'href="online-courses.html"': `href="/en/online-courses.html"`,
    'href="login.html"': `href="/en/login.html"`,
    'href="student-portal.html"': `href="/en/student-portal.html"`,
    'href="vision.html"': `href="/en/vision.html"`,
    'href="programs/scratch-game-coder.html"': `href="/en/programs/scratch-game-coder.html"`,
    'href="programs/gdevelop-game-designer.html"': `href="/en/programs/gdevelop-game-designer.html"`,
    'href="programs/roblox-world-creator.html"': `href="/en/programs/roblox-world-creator.html"`,
    'href="programs/3d-designer.html"': `href="/en/programs/3d-designer.html"`,
    'href="programs/ai-programming-quest.html"': `href="/en/programs/ai-programming-quest.html"`,
    'href="programs/generative-ai-magic.html"': `href="/en/programs/generative-ai-magic.html"`,
    'href="programs/app-development.html"': `href="/en/programs/app-development.html"`,
    'href="blog-tech-like-playtime.html"': `href="/en/blog-tech-like-playtime.html"`,
    'href="blog-spot-nurture-tech-skill.html"': `href="/en/blog-spot-nurture-tech-skill.html"`,
    'href="blog-project-based-learning.html"': `href="/en/blog-project-based-learning.html"`,
  };

  if (lang === 'vn') {
    Object.keys(linkUpdates).forEach(oldHref => {
      const newHref = linkUpdates[oldHref].replace('/en/', '/vn/');
      content = content.replace(new RegExp(oldHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newHref);
    });
  } else {
    Object.keys(linkUpdates).forEach(oldHref => {
      content = content.replace(new RegExp(oldHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), linkUpdates[oldHref]);
    });
  }

  // Write back
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Converted: ${filePath}`);
}

// Run conversion for English version
convertPathsForLanguageVersion('en/index.html', 'en');

console.log('\n✅ Path conversion complete!');
