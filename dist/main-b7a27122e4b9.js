'use strict';
(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  function updateToggle() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', `Switch to ${next} theme`);
    toggle.querySelector('.theme-label').textContent = next === 'dark' ? 'Dark' : 'Light';
    document.querySelector('meta[name="theme-color"]').content = next === 'dark' ? '#f5f4ef' : '#101a28';
  }
  toggle.hidden = false;
  updateToggle();
  toggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('miguel-theme', root.dataset.theme); } catch {}
    updateToggle();
  });
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
