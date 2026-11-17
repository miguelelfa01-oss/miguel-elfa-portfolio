'use strict';
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let started = false;
  let settleTimer, finishTimer;
  function finish() {
    clearTimeout(settleTimer); clearTimeout(finishTimer);
    root.dataset.launch = 'done';
  }
  function start() {
    if (root.dataset.welcome === 'waiting' || root.dataset.welcome === 'leaving') return;
    if (started || document.hidden) return;
    started = true;
    if (reduced.matches || root.dataset.motion === 'paused' || window.scrollY > 80 || (location.hash && location.hash !== '#')) { finish(); return; }
    root.dataset.launch = 'playing';
    settleTimer = setTimeout(() => { root.dataset.launch = 'settling'; }, 1450);
    finishTimer = setTimeout(() => finish(), 2000);
  }
  start();
  document.addEventListener('portfolio:reveal', start);
  function interrupt() {
    if (['waiting', 'leaving', 'revealing'].includes(root.dataset.welcome)) return;
    finish();
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (started) finish(); } else start();
  });
  window.addEventListener('scroll', () => { if (window.scrollY > 12) interrupt(); }, { passive: true });
  for (const name of ['wheel', 'touchstart']) window.addEventListener(name, interrupt, { passive: true, once: true });
  document.addEventListener('focusin', interrupt, { once: true });
  document.addEventListener('pointerdown', interrupt, { once: true });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' || event.key === 'Tab') interrupt(); });
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
})();
