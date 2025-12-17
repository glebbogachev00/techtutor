# TechTutor Codebase Overview

This repository hosts the static marketing site for TechTutor Academy. Everything ships as vanilla HTML files that pull Tailwind CSS from the CDN, so there is no build pipeline or dependency installation step—open any file in a browser to preview updates.

## Quick Facts & Shared Foundations
- **Tech stack:** Plain HTML, inline `<style>` blocks, Tailwind via `<script src="https://cdn.tailwindcss.com">`, Inter/Lato fonts from Google Fonts. There is no bundler, package manager, or framework.
- **Design tokens:** Each page defines a near-identical Tailwind config (primary `#193b92`, teal `#2C7A7B`, accent greens, etc.) and supplements utility classes with a short list of custom CSS helpers (e.g., `.card`, `.btn-primary`, `.section-title`).
- **Localization:** Main marketing surfaces (`index.html`, `index-redesign.html`, `free-trial.html`, `plans-and-faq.html`, `blog.html`, `student-projects.html`) share a bilingual model:
  - Mark copy with `data-i18n` (and `data-i18n-placeholder` for inputs).
  - Keep translations in a `const translations = { en: {...}, vi: {...} };` block.
  - Language toggles (`[data-lang]` buttons with 🇬🇧 / 🇻🇳 ) update DOM text and persist the choice to `localStorage` under the `tt-lang` key. Program detail pages currently force English on load but still render the toggle UI for consistency.
- **CTAs & forms:** All lead forms (`#trialForm` on `index.html`, the free-trial stand-alone form, and the discount popup) POST to `https://formspree.io/f/xqaynogk`. The main trial form also synthesizes WhatsApp (`waLink`) and Zalo (`zaloLink`) deep links with the submitted data, so parents can jump directly into chat. Phone numbers used throughout: WhatsApp `+84 902 776 753`, Zalo `+84 931 140 736` or `0902 776 753` depending on context.
- **Assets:** `images/` contains all illustrations (logos, hero art, screenshots). Recent additions such as `3d.png`, `gdev.png`, `python.png`, etc., power the redesigned program cards. Keep assets optimized; there is no image pipeline.
- **Analytics & deployment:** `index.html` loads Google Analytics (gtag `G-4MZ1XEZXB6`). Vercel serves the site using `vercel.json`, which currently only lists `index.html`, `student-projects.html`, and `images/**/*` as static builds—add new entry points here before deploying additional pages.

## Primary Entry Points
### `index.html`
Legacy hero page that still lives at the site root and contains the richest interactivity.
- **Hero & navigation:** Sticky nav with bilingual toggle, CTA buttons (Zalo, WhatsApp, free trial). Hero highlights retention, geographies, and testimonials, with floating badges and gradient background.
- **Sections:** Program summaries, “Programs & Pathways” cards, detailed curriculum blurbs, comparison charts, teacher spotlights, pricing overview, testimonials, blog teasers, and a long-form FAQ style accordion near the bottom. Every section uses data attributes for localization and responsive Tailwind grids.
- **Modals:** Clicking “View Program” buttons launches program-specific modals. Each modal lives inline, is tagged with `id="modal-<slug>"`, and is toggled via `data-open-modal` / `data-close-modal` handlers. Content covers overview, levels, projects, skills, and includes CTAs back to the form.
- **Discount popup:** Hidden modal with `id="modal-discount-popup"`; once dismissed it stores a timestamp under `tt-popup-closed` to avoid re-showing immediately.
- **Trial form + chat links:** The `#trialForm` block posts to Formspree and, on every input event, rebuilds the WhatsApp / Zalo `href` strings with URL-encoded notes so inquiries remain consistent even if the network submission fails.
- **Scripts:**
  - `setLanguage` applies translations and syncs the toggle state (lines ~1350–2100).
  - Modal wiring listens for document-level clicks on `[data-open-modal]` & `[data-close-modal]` elements.
  - Mobile menu toggles `#mobile-nav` visibility.
  - Form submission uses `fetch(form.action)` with `FormData`, displays transient status text via `#trialFormStatus`, and re-enables the button on completion.
  - IntersectionObserver adds `.visible` to `.fade-in-*` sections for scroll-in animations.
  - Testimonial slider cycles `.testimonial-slide` nodes every 6s and syncs dot indicators.
  - A YouTube modal (`#videoModal`) powers `[data-open-video]` buttons with privacy-friendly `youtube-nocookie` embeds.
  - `[data-toggle-all]` helper toggles bulk accordions (used inside FAQ sections).

### `index-redesign.html`
New primary experience referenced by most secondary pages.
- **Structure:** Modernized hero with stats tiles, “Why TechTutor?” proof points, testimonial cards, partner CTA, pricing comparison, detailed program highlights (each referencing the large new PNGs), blog preview, and an in-card free-trial form.
- **Localization:** Follows the same `data-i18n` + `translations` pattern but covers far more keys (nav, hero copy, pricing labels, blog copy, etc.). `localStorage` persists the choice just like on the legacy page.
- **Interactive pieces:**
  - Dropdown nav for “Programs ▾” on desktop and an accordion on mobile.
  - The trial form is presentational only—there is no submission handler yet. Wire it to Formspree (or reuse the `index.html` script) before collecting live leads from this page.
  - Social icons in the footer link to Facebook, Instagram, Zalo, WhatsApp, and email anchors are live.
- **Variants:** `index-redesign-backup.html` and `index-new.html` are alternate explorations of this layout. They reuse the same design tokens but have fewer scripts; treat them as reference files when iterating.

## Supporting Marketing Pages
### `free-trial.html`
Dedicated conversion page with hero imagery, benefit cards, a Formspree-backed form (includes `_gotcha` honeypot and `source_page` hidden field), a “What happens next?” timeline, and bilingual testimonials. Shares the nav + language toggle script with the redesign page and saves `tt-lang` preference globally.

### `plans-and-faq.html`
Pricing-centric page with sticky nav, bilingual plan cards (private vs small group), “What’s included” grid, and an accordion-style FAQ. JavaScript handles:
- language switching (same pattern),
- FAQ expand/collapse toggled by `.faq-item` click events, and
- a hover-triggered dropdown for the programs list.

### `student-projects.html`
Highlights representative student work with a hero, feature chips, and five detailed project cards (each listing focus areas and tools). Includes CTA to book a trial and uses the shared translation + mobile-menu scripts.

### `blog.html` & article pages
- `blog.html` renders a big featured story plus cards pointing to two long-form articles. Bilingual copy lives in its `translations` block. It also implements the mobile nav dropdown script.
- `blog-tech-like-playtime.html` and `blog-spot-nurture-tech-skill.html` host the full articles. Both reuse the same nav/dropdown shell as other pages but are English-only right now.

### `vision.html`
Mission/values storytelling page. No scripts beyond Tailwind; localization toggle is present but static (no translations included yet).

### Program detail pages (`programs/*.html`)
There are seven standalone pages: Scratch Game Coder, GDevelop Game Designer, Roblox World Creator, 3D Designer, AI & Programming Quest, Generative AI Magic, and App Development.
- **Layout:** Each file follows the same template—hero with stats and imagery, “What your child will learn,” “Tools & Skills,” and a CTA card leading back to the free-trial flow.
- **Behavior:** Minimal JavaScript toggles the mobile nav and ensures the language switcher visually sticks to English (`localStorage.setItem('tt-lang', 'en')`). Use these as templates if you introduce additional programs.

### Other content
- `student-projects.html`, `plans-and-faq.html`, `free-trial.html`, `vision.html`, and `blog*.html` all reference `index-redesign.html` in their nav links so the redesign acts as the canonical “home.”
- `js/` currently exists but is empty—scripts live inline within each HTML document.

## Assets, Config, and Deployment
- **Images:** All graphical assets live under `images/`. Hero art such as `form.png`, `tt-new.png`, `robot-rocket.png`, and the new program cards (`3d.png`, `doodle.png`, `gdev.png`, `genai.png`, `python.png`, `roblox.png`, `thunkable.png`) are referenced by name in the relevant sections.
- **`vercel.json`:** Defines the static build. Update the `builds` array if you deploy new HTML entry points (e.g., `plan-and-faq.html`, `free-trial.html`). Without that, Vercel will only output `index.html` and `student-projects.html`.
- **Analytics / SEO:** Pages include metadata (title/description) tuned for their focus area. Only the main index currently injects GA.

## Working With the Codebase
1. **Previewing:** Open any HTML file directly in the browser. Because Tailwind loads via CDN, you need an internet connection for the styles to render.
2. **Adding content:** Keep new sections consistent by copying the `.card` and `.btn-*` patterns. For bilingual sections, add matching entries in the `translations` object and wrap visible strings with `data-i18n`.
3. **Forms:** Reuse the Formspree endpoint (or create a new one) and remember to add `_gotcha` + `source_page` hidden fields if you want to track source pages.
4. **Navigation:** Update both desktop and mobile navs when adding/removing routes. Every nav also includes the language pill group—ensure aria attributes (`aria-pressed`) stay accurate.
5. **Modals & sliders:** When adding new modals on `index.html`, wire them by giving the trigger a unique `data-open-modal="slug"` and the modal container an `id="modal-slug"`. The global click handler does the rest. For carousel content, add `.testimonial-slide` nodes and matching `.dot` buttons.
6. **Localization state:** Respect the `tt-lang` localStorage key so language choices persist as users navigate between pages. Program detail pages currently force English; adjust that script if/when you localize the content.
7. **Deployment:** Because there is no build step, deploys are just static file uploads. Keep `vercel.json` in sync with any new entry points so Vercel publishes them.

Use this document as a living reference so future sessions can jump straight into implementation work without re-auditing the repo.
