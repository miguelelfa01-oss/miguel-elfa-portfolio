# Welcome portal — approved

Before entering, visitors see WELCOME TO / MY WORLD., moving cyan light and floating architectural planes. It waits for Enter portfolio. Clicking Enter tightens the button frame, separates the words, then opens two navy doors outward over about1200ms. Hero assembly starts as the doors begin to open. No sound or flashing.

Show once per browser session: a session cookie shares the entered state across tabs; sessionStorage is the fallback. No persistent expiry. If storage is unavailable, entry still succeeds. A deliberate ?welcome=1 URL previews the gate without clearing stored state. Normal visits honor the session flag.

Use a native modal dialog for focus containment/background inertness. Enter/Space activate the button; Escape skips directly to the portfolio. On completion, focus the main region without scrolling, preserve deep-link destinations, and release the modal. Reduced motion or saved Pause uses an immediate entrance. No-JS or unsupported dialog falls back to the readable portfolio.

Approaches: an automatically dismissed opening was considered but the user chose waiting for Enter. The selected portal animation replaces a simple welcome fade. Existing site content, theme preference, moving architecture and links remain.

Implementation plan: isolated dist/welcome.js before motion/launch scripts; dialog markup and portal CSS; launch waits for the welcome reveal event; ambient motion pauses behind the gate. Test session flags, storage failures, input, timing and hero handoff; inspect desktop/mobile and publish the existing public Site.

## Verified result
Browser checks showed the native dialog waiting with Enter focused and only modal content exposed in the accessibility tree. Mid-transition capture showed split text, central light and portal reveal with hero playing. Normal reload after entry skipped the welcome; explicit preview reopened it. At320px the dialog fit exactly without horizontal overflow. Welcome Pause stopped the frame and floating-plane animations while leaving Enter usable. Unit suites passed interruption, session, reduced motion, dark-only and project behavior. No full hardware/frame-rate certification is claimed.

User steering: removed light-theme UI and logic; current dark palette is the sole palette. The page uses native default/pointer cursor declarations. The user-observed glow was not produced by a custom page cursor (none existed in DOM or source).
