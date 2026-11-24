# Miguel Elfa portfolio

Static HTML/CSS/JavaScript, hosted on Vercel from GitHub. Serve with `python -m http.server 4173 --directory dist`.

Edit `dist/index.html` for content, `dist/styles.css` for design and `dist/motion.js` for the interactive study. `dist/main.js` maintains safe future-project rendering and is bundled with `dist/welcome.js`. `dist/launch.js` handles a short interruptible entrance.

After changes, run `python tools/prepare-assets.py` before committing generated assets and updated index. Vercel serves `dist/` with no install/build command and no environment variables. The portfolio has one dark theme, native cursor, no pause/play buttons, and device reduced-motion support.

Future work is maintained in `dist/projects.js` with title, description, tags, codeUrl and liveUrl. Add only real projects; HTTP(S) links and plain text are enforced. The built-in case study remains visible independently of future-project data.

The welcome waits for Enter once per browser session, uses cookie/sessionStorage fallback and supports Escape, keyboard focus and reduced motion. Preview with `?welcome=1`.

Design and asset provenance are recorded in DESIGN.md.
