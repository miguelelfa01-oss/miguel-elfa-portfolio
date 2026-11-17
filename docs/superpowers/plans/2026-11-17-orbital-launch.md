# Orbital Launch implementation plan

> Execute inline with executing-plans; the approved design is ../specs/2026-11-17-orbital-launch-design.md.

Goal: replace the generic opening with the approved orbital launch while keeping direct page access.
Architecture: static launch markup plus isolated launch.js; motion.js continues to own section reveals, pause and orbital behavior. CSS owns the two-second sequence and section-specific treatments. No dependency additions.

Global constraints: keep existing text, fonts, themes, contacts, reduced-motion and Pause; never lock scrolling or intercept clicks; use fingerprinted assets.

- [x] Add aria-hidden orbital/name stage in dist/index.html, styled in dist/styles.css.
- [x] Add dist/launch.js: start on foreground top-of-page, settle at1450ms, finish at2000ms; cancel on scroll, wheel, touch, keyboard focus, pause and reduced motion.
- [x] Give About a sideways entrance, Projects an accent line sweep, and Contact a scaled type entrance in dist/motion.js/CSS; add bounded scroll movement to the orbit.
- [x] Verify controller cancellation/timing, existing animation behavior, syntax, narrow layout, then publish to the existing Site and refresh the browser.

Review focus: opening in a background tab, restored scroll position, interruptions during the intro, reduced motion changed mid-intro, and CSS/JS cache mismatch.

Verification: launch, motion and portfolio behavior suites passed. Browser midpoint captures showed the orbital/name scene;320px content width305px; scroll dismissed the scene immediately. Independent code review approved. Full normal/reduced filmstrips and hardware profiling remain unavailable.
