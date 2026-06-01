// Propagates en/techbash.html (body + structure) to us/, in/, vn/
// and replaces each locale techbash <header> with that locale's index.html <header>.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = fs.readFileSync(path.join(ROOT, "en/techbash.html"), "utf8");

const HEADER_RE = /<header[\s\S]*?<\/header>/;

function extractHeader(html) {
  const m = html.match(HEADER_RE);
  if (!m) throw new Error("no header in " + html.slice(0, 200));
  return m[0];
}

function rewriteLinks(html, locale) {
  // /en/ → /{locale}/
  return html.replace(/\/en\//g, `/${locale}/`);
}

const LOCALES = ["us", "in", "vn"];

for (const loc of LOCALES) {
  const indexPath = path.join(ROOT, loc, "index.html");
  const outPath = path.join(ROOT, loc, "techbash.html");
  if (!fs.existsSync(indexPath)) {
    console.warn(`skip ${loc}: no index.html`);
    continue;
  }
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const localeHeader = extractHeader(indexHtml);

  // Start from en/techbash.html, rewrite /en/ → /loc/ in body
  let next = rewriteLinks(SRC, loc);
  // Swap the header block for the locale's own index header (already locale-prefixed).
  next = next.replace(HEADER_RE, localeHeader);
  // Fix hreflang/canonical that were absolute en URLs (now /loc/ — keep alternates intact)
  next = next.replace(
    /<link rel="canonical" href="https:\/\/techtutor\.academy\/[a-z]{2}\/techbash\.html"/,
    `<link rel="canonical" href="https://techtutor.academy/${loc}/techbash.html"`,
  );

  fs.writeFileSync(outPath, next, "utf8");
  console.log(`wrote ${outPath}`);
}
