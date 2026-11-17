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
    if (started || document.hidden) return;
    started = true;
    if (reduced.matches || root.dataset.motion === 'paused' || window.scrollY > 80 || (location.hash && location.hash !== '#')) { finish(); return; }
    root.dataset.launch = 'playing';
    settleTimer = setTimeout(() => { root.dataset.launch = 'settling'; }, 1450);
    finishTimer = setTimeout(() => finish(), 2000);
  }
  start();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (started) finish(); } else start();
  });
  window.addEventListener('scroll', () => { if (window.scrollY > 12) finish(); }, { passive: true });
  for (const name of ['wheel', 'touchstart']) window.addEventListener(name, finish, { passive: true, once: true });
  document.addEventListener('focusin', finish, { once: true });
  document.addEventListener('pointerdown', finish, { once: true });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' || event.key === 'Tab') finish(); });
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
  document.querySelector('.motion-toggle').addEventListener('click', finish);
})();
