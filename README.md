# Portfolio

My personal portfolio: who I am, what I work with and what I have built. The page is styled like a terminal and an editor, and it includes a small interactive shell (press `` ` `` or the `>_` button, then type `help`).

**Live site:** https://nedavefo.github.io/Portfolio/

## Built with

- Plain HTML, CSS and JavaScript, no framework and no build step
- System fonts only (no external requests)
- Dark and light themes (follows the system, with a manual toggle)
- Responsive layout, keyboard navigation, `prefers-reduced-motion` support
- Deployed to GitHub Pages with GitHub Actions on every push to `main`

## Run locally

It is a static site. Open `index.html` in a browser, or serve it:

```bash
python -m http.server 8000
```

## Files

| File | What it does |
|---|---|
| `index.html` | All content and structure |
| `style.css` | Theme tokens, layout, terminal window styles |
| `script.js` | Theme toggle, scroll reveal and the interactive terminal |
