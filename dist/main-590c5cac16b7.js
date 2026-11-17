'use strict';
(() => {
  const root = document.documentElement;
  root.dataset.theme = 'dark';
  document.querySelector('meta[name="theme-color"]').content = '#060f1d';
  document.getElementById('year').textContent = new Date().getFullYear();

  const list = document.getElementById('project-list');
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const safeUrl = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  };
  for (const project of projects) {
    if (!project || typeof project.title !== 'string' || !project.title.trim()) continue;
    const row = document.createElement('article'); row.className = 'project-row';
    const name = document.createElement('h3'); name.textContent = project.title;
    const details = document.createElement('div');
    const description = document.createElement('p'); description.textContent = typeof project.description === 'string' ? project.description : '';
    details.append(description);
    if (Array.isArray(project.tags) && project.tags.length) {
      const tags = document.createElement('p'); tags.className = 'project-tags'; tags.textContent = project.tags.filter(tag => typeof tag === 'string').join(' / '); details.append(tags);
    }
    const links = document.createElement('div'); links.className = 'project-links';
    for (const [value, label] of [[project.codeUrl, 'View code'], [project.liveUrl, 'Live project']]) {
      const href = safeUrl(value); if (!href) continue;
      const link = document.createElement('a'); link.href = href; link.textContent = label; link.className = 'text-link'; link.target = '_blank'; link.rel = 'noopener noreferrer'; links.append(link);
    }
    details.append(links); row.append(name, details); list.append(row);
  }
  document.getElementById('project-empty').hidden = list.children.length > 0;
})();

'use strict';
(() => {
  const root = document.documentElement;
  const dialog = document.querySelector('.welcome-screen');
  const main = document.getElementById('main');
  const button = dialog?.querySelector('.welcome-enter');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'miguel_portfolio_entered';
  const preview = new URLSearchParams(location.search).get('welcome') === '1';
  let entered = false;
  try { entered = document.cookie.split(';').some(value => value.trim() === `${key}=1`); } catch {}
  try { entered = entered || sessionStorage.getItem(key) === '1'; } catch {}
  if (!dialog || !button || typeof dialog.showModal !== 'function' || (entered && !preview)) {
    root.dataset.welcome = 'done';
    return;
  }
  let entering = false, finished = false, revealed = false;
  let revealTimer, finishTimer;
  function remember() {
    try { document.cookie = `${key}=1; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`; } catch {}
    try { sessionStorage.setItem(key, '1'); } catch {}
  }
  function reveal() {
    if (revealed) return;
    revealed = true;
    root.dataset.welcome = 'revealing';
    document.dispatchEvent(new Event('portfolio:reveal'));
  }
  function complete() {
    if (finished) return;
    finished = true;
    clearTimeout(revealTimer); clearTimeout(finishTimer);
    reveal();
    if (dialog.open) dialog.close();
    main?.focus({ preventScroll: true });
    root.dataset.welcome = 'done';
    document.dispatchEvent(new Event('portfolio:entered'));
  }
  function enter(immediate = false) {
    if (entering) return;
    entering = true;
    remember();
    button.disabled = true;
    root.dataset.welcome = 'leaving';
    dialog.dataset.phase = 'leaving';
    if (immediate || reduced.matches || root.dataset.motion === 'paused') { complete(); return; }
    revealTimer = setTimeout(reveal, 300);
    finishTimer = setTimeout(complete, 1200);
  }
  root.dataset.welcome = 'waiting';
  dialog.dataset.phase = 'waiting';
  button.addEventListener('click', () => enter());
  dialog.addEventListener('cancel', event => { event.preventDefault(); enter(true); });
  reduced.addEventListener('change', () => { if (reduced.matches && entering) complete(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && entering) complete(); });
  try { dialog.showModal(); } catch { root.dataset.welcome = 'done'; }
})();
