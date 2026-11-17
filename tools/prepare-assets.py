"""Fingerprint production assets; keep entry initialization in the main bundle."""
from pathlib import Path
import hashlib
import re

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
page = dist / 'index.html'
html = page.read_text(encoding='utf-8')
html = re.sub(r'\s*<script src="welcome(?:-[0-9a-f]+)?\.js" defer></script>', '', html)
for name, attribute in [('styles.css', 'href'), ('main.js', 'src'), ('motion.js', 'src'), ('launch.js', 'src')]:
    data = (dist / name).read_bytes()
    if name == 'main.js':
        data += b'\n' + (dist / 'welcome.js').read_bytes()
    stem, extension = name.rsplit('.', 1)
    filename = f'{stem}-{hashlib.sha256(data).hexdigest()[:12]}.{extension}'
    (dist / filename).write_bytes(data)
    pattern = attribute + r'="' + re.escape(stem) + r'(?:-[0-9a-f]+)?\.' + extension + '"'
    html = re.sub(pattern, f'{attribute}="{filename}"', html)
page.write_text(html, encoding='utf-8')
print('Prepared fingerprinted CSS and main/motion/launch scripts.')
