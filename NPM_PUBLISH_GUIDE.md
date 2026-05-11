# Publishing FlowCSS to npm

A complete step-by-step guide to publishing your CSS framework as a public npm package.

---

## 1. Project Structure

Ensure your project looks like this:

```
flowcss/
├── dist/
│   ├── flow.css          ← compiled framework
│   └── flow.js           ← JS companion
├── src/                  ← source files (optional)
├── website/
│   └── index.html
├── docs/
│   └── index.html
├── package.json
├── README.md
└── LICENSE
```

---

## 2. package.json

Create or update your `package.json`:

```json
{
  "name": "flowcss",
  "version": "1.0.0",
  "description": "A modern CSS framework with 40+ animations, components, and theming built in.",
  "main": "dist/flow.css",
  "style": "dist/flow.css",
  "files": [
    "dist/",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "css",
    "framework",
    "animations",
    "utility",
    "components",
    "glassmorphism",
    "dark-mode",
    "tailwind-alternative"
  ],
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/flowcss.git"
  },
  "homepage": "https://flowcss.dev",
  "bugs": {
    "url": "https://github.com/yourusername/flowcss/issues"
  }
}
```

**Key fields explained:**
- `"style"` — tells bundlers (Webpack, Vite) which file is the CSS entry
- `"files"` — whitelist of what gets uploaded to npm (keeps the package lean)
- `"main"` — the default import entry point

---

## 3. Write a Great README.md

npm uses your README as the package landing page. Include:

```markdown
# FlowCSS

> A modern CSS framework with 40+ animations, components, glassmorphism, 3D transforms, and dark mode.

## Install

```bash
npm install flowcss
```

## Usage

```html
<link rel="stylesheet" href="node_modules/flowcss/dist/flow.css">
<script src="node_modules/flowcss/dist/flow.js" defer></script>
```

Or via CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/flowcss/dist/flow.css">
```

## Documentation

[flowcss.dev/docs](https://flowcss.dev/docs)
```

---

## 4. Add a LICENSE File

Create `LICENSE` (MIT is recommended):

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software...
```

Use https://choosealicense.com to generate the full text.

---

## 5. Create an npm Account

```bash
# Go to https://www.npmjs.com and sign up
# Then login from your terminal:
npm login
```

You'll be prompted for your username, password, and OTP if 2FA is enabled.

---

## 6. Check the Package Before Publishing

```bash
# Preview what will be published (no upload):
npm pack --dry-run

# This shows the list of files that will be included.
# Make sure dist/ is listed.
```

---

## 7. Publish

```bash
# First publish:
npm publish --access public

# For scoped packages like @yourname/flowcss:
npm publish --access public
```

That's it! Your package is now live at:
`https://www.npmjs.com/package/flowcss`

---

## 8. Updating the Package

```bash
# Bump version (choose one):
npm version patch    # 1.0.0 → 1.0.1  (bug fix)
npm version minor    # 1.0.0 → 1.1.0  (new feature)
npm version major    # 1.0.0 → 2.0.0  (breaking change)

# Then publish:
npm publish
```

---

## 9. CDN Auto-support (unpkg / jsDelivr)

Once published on npm, your package is **automatically available** via CDN — no extra setup needed:

```html
<!-- unpkg -->
<link rel="stylesheet" href="https://unpkg.com/flowcss/dist/flow.css">
<script src="https://unpkg.com/flowcss/dist/flow.js" defer></script>

<!-- jsDelivr (faster, cached globally) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowcss/dist/flow.css">
<script src="https://cdn.jsdelivr.net/npm/flowcss/dist/flow.js" defer></script>
```

---

## 10. Add a GitHub Action for Auto-publish (Optional)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add your npm token as `NPM_TOKEN` in your GitHub repo secrets.

Now every time you push a tag (`git tag v1.0.1 && git push --tags`), it auto-publishes! 🚀

---

## Checklist

- [ ] `package.json` has correct name, version, files, keywords
- [ ] `dist/flow.css` and `dist/flow.js` are built and up to date
- [ ] `README.md` explains installation and usage clearly
- [ ] `LICENSE` file exists
- [ ] `npm login` was successful
- [ ] `npm pack --dry-run` shows the right files
- [ ] `npm publish --access public` completed successfully
- [ ] Test install in a fresh project: `npm install flowcss`
