# Miguel portfolio implementation plan

> Agentic workers: execute inline using executing-plans.

Goal: ship the approved personal portfolio, with honest content and maintainable future projects.
Architecture: buildless static dist directory; semantic HTML, self-hosted fonts, responsive CSS, isolated project data, progressively enhanced theme control.
Spec: ../PRODUCT.md and ../DESIGN.md, recording the approved chat brief.

## Constraints
- Exact headline: Curious mind. Useful ideas.
- Full name in About, short name prominently.
- No invented work, expertise, testimonials or metrics.
- Email: miguelelfa01@gmail.com
- Responsive from 320px; reduced-motion support; all contact links work without JavaScript.

## Tasks
- [x] Build semantic content and orbital graphic in dist/index.html; style both themes in dist/styles.css.
- [x] Add theme persistence with storage failures tolerated, and projects rendering with an honest empty state in dist/main.js and dist/projects.js.
- [x] Check syntax, contact targets, local page response, desktop/mobile rendering and keyboard interactions; fix concrete failures.
- [x] Package and publish owner-private through Sites; deliver source and live URL.

## Review focus
Blocked localStorage must not disable theme switching. Empty projects must show no fake work. Long project names must wrap. Navigation must remain usable at 320px. Reduced motion must stop decorative animation.
