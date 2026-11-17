# Orbital Launch — approved design

User approved a roughly two-second orbital assembly and Miguel Elfa name entrance, followed by the headline. Scrolling is immediately available and ends the intro. Existing fonts, light/dark palette, content and links remain. Scroll transitions move the orbit aside as About enters; Projects receives a sweeping line; Contact gets a bold type entrance. Pause and reduced motion remain available.

Approaches: Orbital Launch was selected over Typography Film because it develops the existing orbital identity. Implementation call: use a short, noninteractive, aria-hidden CSS overlay with no scroll lock, native scroll/visibility events and IntersectionObserver. No added library or full-screen WebGL scene. Use transforms and opacity for animation; avoid animated blur. Preserve readable defaults without scripts. The overlay cannot capture pointer input and is dismissed by scrolling, keyboard focus or reduced motion.

Acceptance: opening completes in 2000ms; scrolling cancels it; no modal or waiting gate; reduced-motion and saved Pause show the page immediately; distinct About, Projects and Contact compositions; no overflow at320px; public audience preserved.
