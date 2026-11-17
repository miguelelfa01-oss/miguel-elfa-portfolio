'use strict';
(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const art = document.querySelector('.orbital');
  let inView = true;
  let frame = 0;
  let pointerBounds;
  let scrollFrame = 0;

  function updateMotion() {
    root.dataset.pageVisible = String(!document.hidden);
    root.dataset.motion = media.matches ? 'paused' : 'full';
    const welcomeClosed = root.dataset.welcome !== 'waiting' && root.dataset.welcome !== 'leaving';
    root.dataset.orbit = !media.matches && !document.hidden && inView && welcomeClosed ? 'running' : 'paused';
    if (root.dataset.motion === 'paused') {
      art.style.removeProperty('--tilt-x');
      art.style.removeProperty('--tilt-y');
      art.style.removeProperty('--story-progress');
    }
    document.dispatchEvent(new Event('portfolio:motionchange'));
  }
  updateMotion();
  document.addEventListener('portfolio:reveal', updateMotion);
  document.addEventListener('portfolio:entered', updateMotion);
  media.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', () => {
    updateMotion();
  });

  if ('IntersectionObserver' in window) {
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

  // One scroll clock: read geometry first, then write bounded progress values.
  const sections = [...document.querySelectorAll('.about,.projects-section,.contact')];
  const clamp = value => Math.min(1, Math.max(0, value));
  function paintScroll() {
    scrollFrame = 0;
    if (document.hidden) return;
    const still = root.dataset.motion === 'paused';
    const height = Math.max(1, window.innerHeight);
    const bounds = sections.map(section => section.getBoundingClientRect());
    const artBounds = art.getBoundingClientRect();
    const progress = bounds.map(rect => clamp((height * .94 - rect.top) / (height * .58)));
    sections.forEach((section, index) => {
      section.style.setProperty('--assembly', still ? '1' : progress[index].toFixed(4));
    });
    const depth = clamp((height * .55 - artBounds.top) / height);
    art.style.setProperty('--depth', still ? '0' : depth.toFixed(4));
    root.dataset.scrollStory = still ? 'still' : 'active';
    const start = bounds[0]?.top + window.scrollY || 0;
    const end = (bounds[2]?.bottom + window.scrollY || start + 1) - height * .5;
    root.style.setProperty('--connection', still ? '1' : String(clamp((window.scrollY + height * .55 - start) / Math.max(1, end - start))));
  }
  function scheduleScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  document.addEventListener('portfolio:motionchange', scheduleScroll);
  document.addEventListener('portfolio:entered', scheduleScroll);
  document.addEventListener('visibilitychange', scheduleScroll);
  paintScroll();

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
