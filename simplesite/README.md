# Simple Site UK-EN

Portfolio landing page implemented from the [Figma design](https://www.figma.com/design/0AJ044qDtJVGznIF4X0hLx/Simple-Site-UK-EN?node-id=0-1).

## Live demo

GitHub Pages: `https://<your-username>.github.io/simple-site-uk-en/`

## Repository structure

```
simple-site-uk-en/
├── index.html
├── css/
│   └── styles.css
├── scss/
│   ├── main.scss
│   ├── abstracts/
│   ├── base/
│   ├── layout/
│   ├── components/
│   └── utilities/
└── images/
    └── project.svg
```

## Branches

- `main` — CSS version with custom properties (`:root` variables), Flexbox layout, and media queries
- `scss-modules` — refactored styles using SCSS modules, `@use` / `@forward`, mixins, and media mixins

## Development

Install dependencies and compile SCSS (on the `scss-modules` branch):

```bash
npm install
npm run build:css
```

Watch for changes:

```bash
npm run watch:css
```

## GitHub Pages setup

1. Push the repository to GitHub
2. Open **Settings → Pages**
3. Set **Source** to `Deploy from a branch`
4. Choose branch `main` and folder `/ (root)`
5. Save and wait for deployment

## Design reference

- Font: Roboto (400, 500)
- Primary color: `#34547a`
- Background: `#edeef0`
- Muted text: `#727272`
- Minimum supported width: 375px
