# Conway's Game of Life

This repository contains a simple implementation of Conway's Game of Life that can be hosted using GitHub Pages. The game is entirely client side and requires no additional dependencies.

## Running locally

Open `index.html` in your browser or run a local web server from the repository root:

```bash
python3 -m http.server
```

Then navigate to `http://localhost:8000`.

## GitHub Pages deployment

A GitHub Actions workflow is included to automatically deploy the site to GitHub Pages whenever changes are pushed to the `main` branch.

### Steps

1. Create a repository on GitHub and push this code.
2. In the repository settings, enable GitHub Pages by selecting the `gh-pages` branch.
3. The next push to `main` will trigger the workflow, creating the `gh-pages` branch with the built site.
4. After the workflow completes, the game will be available at `https://<username>.github.io/<repo>/`.

If you have already performed the manual steps, let me know and I can continue with any further automation.
