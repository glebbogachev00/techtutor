# TechTutor Academy Landing Page

A minimal Khan Academy-inspired landing page for TechTutor Academy. The page is built with HTML and Tailwind CSS (CDN) and is optimized for bilingual audiences in Vietnam.

## Features
- Sticky header with oversized PNG logo and EN/VN language toggle
- Concise hero with trial and chat CTAs (WhatsApp, Zalo)
- Program overview covering STEAM, coding, AI, and design tracks
- Lesson format, flexible learning cadence, and pricing with VND + USD estimates
- Alternating sections for readability, calm palette, and responsive layout (max-width 1040px)

## File Structure
```
[hello world]/
├── images/
│   ├── logo-no-bg.png
│   └── tt-logo.png (unused placeholder)
├── index.html
├── README.md
└── vercel.json
```

## Getting Started
1. Open `index.html` in any modern browser.
2. Toggle the EN/VN pills in the header to switch languages (no build step required).
3. Use the CTAs to test anchor navigation and external chat links.

## Development Notes
- Tailwind is loaded via CDN and configured inline in the `<head>`.
- Custom colors align with the requested palette: primary `#1E66F5`, accent `#16A34A`, surface `#F8FAFC`.
- The language toggle updates UI text and maintains accessibility via focus-visible outlines.
- Mobile navigation is a simple button that toggles a hidden menu; no other JavaScript is used.
