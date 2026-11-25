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
  const scene = document.querySelector('.story-runway');
  const captions = [...document.querySelectorAll('.scene-captions article')];
  const chapters = [...document.querySelectorAll('#work,#portfolio,#about,#contact')];
  const hero = document.querySelector('.hero');
  const nav = [...document.querySelectorAll('.site-header nav a')];
  let frame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  function paint() {
    frame = 0;
    if (document.hidden) return;
    // Read stable wrappers, never the transformed children whose bounds they drive.
    const bounds = section.getBoundingClientRect();
    const sceneBounds = scene.getBoundingClientRect();
    const heroBounds = hero.getBoundingClientRect();
    const chapterBounds = chapters.map(element => element.getBoundingClientRect());
    const h = Math.max(1, innerHeight);
    const inset = document.querySelector('.site-header').offsetHeight;
    const still = media.matches || h <= 540;
    const progress = clamp((inset - sceneBounds.top) / Math.max(1, sceneBounds.height - h + inset));
    const step = Math.min(2, Math.floor(progress * 3));
    root.dataset.motion = still ? 'reduced' : 'full';
    root.dataset.cinematic = still ? 'off' : 'on';
    scene.style.setProperty('--scene', still ? '1' : progress.toFixed(4));
    scene.dataset.step = String(step);
    captions.forEach((caption, i) => {
      if (still) caption.removeAttribute('aria-hidden');
      else caption.setAttribute('aria-hidden', String(i !== step));
    });
    hero.style.setProperty('--departure', still ? '0' : String(clamp(-heroBounds.top / h)));
    section.style.setProperty('--progress', still ? '1' : String(clamp((h * .7 - bounds.top) / Math.max(1, bounds.height - h * .2))));
    let current = '';
    chapters.forEach((chapter, i) => {
      const position = clamp((h * .9 - chapterBounds[i].top) / (h * .6));
      chapter.style.setProperty('--arrival', still ? '1' : position.toFixed(4));
      if (chapterBounds[i].top <= h * .45) current = chapter.id;
    });
    nav.forEach(link => {
      const active = link.getAttribute('href') === '#' + (current === 'portfolio' ? 'work' : current);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('portfolio:entered', schedule);
  media.addEventListener('change', schedule);
  select(2); paint();
})();
