# AGENTS.md

## Project Overview

Static single-page interactive "confession" site (romantic yes/no quiz). No build step, no package manager, no framework.

## File Map

- `index.html` — Single entry point. All screens in one page, toggled via `.active`/`.exit` CSS classes.
- `script.js` — All logic in one `DOMContentLoaded` block. Handles screen transitions, music player, and the dodging "No" button.
- `style.css` — All styles. Uses CSS custom properties for theming. `body.sad-mode` toggles a dark theme.
- `gifs/` — Local GIF assets referenced by filename in the `progression` array in `script.js`.
- `music.mp3` — Background audio file (loop disabled; song ending triggers the sad/easter-egg screen).
- `confession-site/` — Appears to be a WIP or unused subdirectory (only an empty `audio/` folder inside).

## Key Architecture

- **Screen system**: Four screens (`intro`, `question`, `success`, `sad`) are overlaid via CSS grid stacking. `switchScreen()` toggles `.active`/`.exit` classes.
- **Dodger (`script.js:312-471`)**: The "No" button uses spring-physics animation (`requestAnimationFrame` + lerp). On first interaction, it detaches from the card and becomes `position: fixed` on `document.body`. The `dodger.count` drives the GIF/text progression loop via modulo.
- **Easter egg**: If background music ends before the user clicks "Yes", the page transitions to a sad screen (`sad-screen`) with a typewriter effect. `hasAccepted` flag prevents this if the user already said yes.
- **External CDN**: `canvas-confetti` loaded from jsDelivr. `fireConfetti()` guards against network failure with a `typeof confetti` check.

## Editing Notes

- GIF filenames in the `progression` array must match files in `gifs/` exactly (no path normalization).
- The "No" button is moved to `document.body` at runtime after first hover — changes to its parent/DOM position must account for the detach logic in `dodger.dodge()`.
- Adding new progression steps requires adding a corresponding GIF file to `gifs/` and ensuring preloading (`new Image()`) still works.
- The `secondary-btn` (No button) is intentionally styled without CSS transitions on transform — movement is purely driven by the JS render loop for 60fps performance.