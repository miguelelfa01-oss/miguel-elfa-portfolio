"use strict";
(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const study = document.querySelector('.study');
  const controls = document.querySelector('.study-controls');
  const tabs = [...controls.querySelectorAll('[role="tab"]')];
  const panels = [...study.querySelectorAll('[role="tabpanel"]')];
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
    study.dataset.stage = String(index);
  }
  controls.hidden = false;
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); select(next, true);
    });
  });
  const section = document.querySelector('.case-study');
  let frame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  function paint() {
    frame = 0;
    if (document.hidden) return;
    const bounds = section.getBoundingClientRect();
    const heroBounds = study.getBoundingClientRect();
    const h = Math.max(1, innerHeight);
    const still = media.matches;
    root.dataset.motion = still ? 'reduced' : 'full';
    section.style.setProperty('--progress', still ? '1' : String(clamp((h * .7 - bounds.top) / Math.max(1, bounds.height - h * .2))));
    study.style.setProperty('--drift', still ? '0' : String(clamp(-heroBounds.top / h)));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('portfolio:entered', schedule);
  media.addEventListener('change', schedule);
  select(2); paint();
})();
