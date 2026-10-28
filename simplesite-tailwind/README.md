# Simple Site — Tailwind CSS rebuild

Same markup and content as the original `simplesite` project, restyled with
Tailwind CSS, compiled to a plain stylesheet (no CDN, no build step needed
in the browser).

## Project structure

```
index.html          — markup, links css/styles.css
src/input.css        — Tailwind directives + custom tokens/components
css/styles.css        — compiled, minified output (generated, don't edit by hand)
tailwind.config.js   — theme extension (colors mapped to CSS custom properties)
images/project.svg   — icon used in the "Experience" section
```

## Build

```bash
npm install
npm run build:css   # one-off build into css/styles.css
npm run watch:css   # rebuild on change while editing src/input.css
```

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Tailwind rebuild of simplesite"
git branch -M main
git remote add origin https://github.com/ТВІЙ_НІК/simplesite-tailwind.git
git push -u origin main
```

Then in the repo: Settings → Pages → Source: `main` branch, `/ (root)`.
