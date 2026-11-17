# Publish with GitHub and Vercel

Repository name: `miguel-elfa-portfolio` (suggested).

The site is static HTML, CSS, and JavaScript. `vercel.json` serves `dist/`; there is no install or build command and no environment variables are required.

1. Push this project to your GitHub repository.
2. Import that repository in Vercel with Framework Preset **Other** and Output Directory **dist**. Leave Build and Install Commands empty.
3. Deploy. Subsequent pushes to the production branch can publish automatically.

When editing CSS or JavaScript, run `python tools/prepare-assets.py` before committing so the fingerprinted production files match the source. The welcome script is included in the generated main bundle.

The existing Sites deployment stays available independently.
