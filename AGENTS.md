# TechTutor Academy AGENTS.md

## Build & Development
- **No build step required** - Static HTML/CSS/JS with Tailwind CDN
- **Path conversion**: `node convert-paths.js` - Converts image/CSS/link paths for language subdirectories
- **Deployment**: Vercel (`vercel.json` configured for clean URLs and no trailing slashes)

## Codebase Structure
- **Root (`/`)**: Landing page with language detection (`index.html`), global config
- **`/en/`, `/vn/`**: Language-specific versions (English, Vietnamese)
- **`/js/`**: Core scripts - `app.js` (promo/modal logic), `site.js` (nav/forms/i18n), `geo-redirect.js`, `carousel.js`, `supabase-client.js`
- **`/css/`**: Tailwind CSS configs
- **`/images/`**: Assets (logos, doodles, family portrait)
- **`/programs/`, `/courses/`**: Program and course landing pages
- **`/programs/`**: Individual course detail pages

## Code Style & Conventions
- **HTML**: Semantic markup, `data-i18n` attributes for translations, `aria-*` for accessibility
- **CSS**: Tailwind utility-first + custom `<style>` blocks in HTML; colors: primary `#193b92`, teal `#2C7A7B`, ink `#0F172A`
- **JavaScript**: Vanilla JS, defer/async attributes for performance, IIFE patterns for init functions, localStorage for language prefs
- **Forms**: Formspree integration (`form[data-formspree]`); custom status handling via `data-status-target`
- **Naming**: kebab-case for IDs/classes (e.g., `mobile-menu-button`), camelCase for JS functions
- **i18n**: Client-side with `data-i18n` selectors; language toggle updates localStorage `tt-lang-manual`
