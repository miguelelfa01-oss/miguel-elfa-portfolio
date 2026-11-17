'use strict';
(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const art = document.querySelector('.orbital');
  const button = document.querySelector('.motion-toggle');
  const running = new Set();
  let paused = false;
  let inView = true;
  let frame = 0;
  let pointerBounds;
  let scrollFrame = 0;
  try { paused = localStorage.getItem('miguel-motion') === 'paused'; } catch {}

  function stopReveals() {
    for (const animation of running) animation.cancel();
    running.clear();
  }
  function updateMotion() {
    root.dataset.pageVisible = String(!document.hidden);
    root.dataset.motion = media.matches || paused ? 'paused' : 'full';
    const welcomeClosed = root.dataset.welcome !== 'waiting' && root.dataset.welcome !== 'leaving';
    root.dataset.orbit = !media.matches && !paused && !document.hidden && inView && welcomeClosed ? 'running' : 'paused';
    button.hidden = media.matches;
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations');
    if (root.dataset.motion === 'paused') {
      stopReveals();
      art.style.removeProperty('--tilt-x');
      art.style.removeProperty('--tilt-y');
      art.style.removeProperty('--story-progress');
    }
  }
  updateMotion();
  document.addEventListener('portfolio:reveal', updateMotion);
  document.addEventListener('portfolio:entered', updateMotion);
  button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('miguel-motion', paused ? 'paused' : 'full'); } catch {}
    updateMotion();
  });
  media.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopReveals();
    updateMotion();
  });

  if ('IntersectionObserver' in window) {
    const perElement = new WeakMap();
    const entered = new WeakSet();
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) { entered.delete(entry.target); entry.target.dataset.revealed = 'false'; continue; }
        if (entered.has(entry.target)) continue;
        entered.add(entry.target);
        entry.target.dataset.revealed = 'true';
        if (root.dataset.motion === 'paused' || document.hidden || !entry.target.animate) continue;
        perElement.get(entry.target)?.cancel();
        let entrance = 'translate3d(0,28px,0)';
        if (entry.target.classList.contains('section-side')) entrance = 'translate3d(-38px,0,0)';
        if (entry.target.classList.contains('contact-top')) entrance = 'translate3d(0,40px,0) scale(.96)';
        const animation = entry.target.animate([
          { opacity: 0, transform: entrance },
          { opacity: 1, transform: 'translate3d(0,0,0)' }
        ], { duration: 460, delay: Number(entry.target.dataset.revealDelay || 0), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        perElement.set(entry.target, animation);
        running.add(animation);
        animation.finished.then(() => running.delete(animation)).catch(() => running.delete(animation));
      }
    }, { threshold: 0, rootMargin: '0px 0px -12px 0px' });
    document.querySelectorAll('.section-side,.section-content > p,.approach,.section-heading,.project-empty,.project-row,.contact-top,.email-link,.social-links').forEach((element, index) => {
      if (element.parentElement.classList.contains('section-content')) element.dataset.revealDelay = String(Math.min(index % 4 * 30, 60));
      reveal.observe(element);
    });
    const orbitVisibility = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      updateMotion();
    });
    orbitVisibility.observe(art);
    const heroVisibility = new IntersectionObserver(entries => {
      root.dataset.intro = entries[0].isIntersecting ? 'ready' : 'idle';
    }, { threshold: 0 });
    heroVisibility.observe(document.querySelector('.hero-copy'));
  }

  window.addEventListener('scroll', () => {
    if (scrollFrame || root.dataset.motion === 'paused' || !inView) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      if (root.dataset.motion !== 'paused') art.style.setProperty('--story-progress', String(Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight)))));
    });
  }, { passive: true });

  art.addEventListener('pointerenter', () => { pointerBounds = art.getBoundingClientRect(); });
  art.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || root.dataset.motion === 'paused' || frame) return;
    const x = event.clientX, y = event.clientY;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (root.dataset.motion === 'paused') return;
      const bounds = pointerBounds || (pointerBounds = art.getBoundingClientRect());
      art.style.setProperty('--tilt-x', `${(y - bounds.top - bounds.height / 2) / bounds.height * -8}deg`);
      art.style.setProperty('--tilt-y', `${(x - bounds.left - bounds.width / 2) / bounds.width * 10}deg`);
    });
  });
  art.addEventListener('pointerleave', () => {
    pointerBounds = null;
    cancelAnimationFrame(frame); frame = 0;
    art.style.removeProperty('--tilt-x'); art.style.removeProperty('--tilt-y');
  });
})();
