# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page e-commerce landing page for **Capy & Co** — a capybara-themed eco-friendly tote bag brand. The entire site lives in one self-contained file: `index.html` (~960 lines).

## Running the Site

No build step required. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
# or
python -m http.server 8080
```

## File Structure

Everything is in `index.html`:
- **Lines 10–485**: CSS (custom properties, layout, responsive breakpoints at 480px)
- **Lines 486–743**: HTML structure
- **Lines 744–957**: JavaScript (translations object, language toggle, FAQ accordion, sticky bar logic)

Asset: `bag.png.png` — referenced in HTML as `src="bag.png"` (note: filename has double extension).

## Architecture

### Internationalization (i18n)
The page is bilingual (Hebrew RTL primary, English LTR secondary). All user-visible strings are stored in a `translations` JS object (lines ~765–879) keyed by element ID. `applyLang(lang)` iterates these keys and sets `textContent` on matching elements; it also flips `dir` on `<html>` and toggles `.rtl` class for layout mirroring.

To add a new translatable string:
1. Give the HTML element a unique `id`
2. Add `"element-id": { he: "...", en: "..." }` to the `translations` object

### Key JavaScript Functions
- `toggleFaq(btn)` — accordion open/close for FAQ section
- `toggleLang()` / `applyLang(lang)` — language switching
- Scroll listener — shows/hides the sticky buy bar after the hero section

### Placeholder Values to Replace Before Launch
- WhatsApp number: `972XXXXXXXXX` (appears in multiple `wa.me` links)
- Any `href="#"` CTAs that should point to a real checkout or form
