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
