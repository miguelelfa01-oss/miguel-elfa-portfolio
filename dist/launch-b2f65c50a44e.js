"use strict";
(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let started = false, timer;
  function finish() { clearTimeout(timer); root.dataset.launch = 'done'; }
  function start() {
    if (started || document.hidden || ['waiting','leaving'].includes(root.dataset.welcome)) return;
    started = true;
    if (media.matches || scrollY > 80 || location.hash) { finish(); return; }
    root.dataset.launch = 'playing'; timer = setTimeout(finish, 900);
  }
  document.addEventListener('portfolio:reveal', start);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); else start(); });
  window.addEventListener('scroll', () => { if (scrollY > 12) finish(); }, {passive:true});
  media.addEventListener('change', () => { if (media.matches) finish(); });
  start();
})();
