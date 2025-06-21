# Conway's Game of Life

This repository contains a responsive implementation of Conway's Game of Life that can be hosted using GitHub Pages. The game runs entirely client side and requires no additional dependencies. The interface adapts to mobile screens and supports saving/loading patterns.

## Running locally

Open `index.html` in your browser or run a local web server from the repository root:

```bash
python3 -m http.server
```

Then navigate to `http://localhost:8000`.

## GitHub Pages deployment

A GitHub Actions workflow automatically deploys the site to GitHub Pages.  Pushes to `main` publish the game at the root URL, while other branches are deployed under `/preview/<branch>` so you can test changes before merging.

### Steps

1. Create a repository on GitHub and push this code.
2. In the repository settings, enable GitHub Pages by selecting the `gh-pages` branch.
3. Pushing to any branch will start the workflow.  When `main` is pushed, the site is deployed to the root of the `gh-pages` branch.  Other branches deploy under `preview/<branch>`.
4. After the workflow completes, visit `https://<username>.github.io/<repo>/` for `main` or `https://<username>.github.io/<repo>/preview/<branch>/` for preview branches.

### Controls

The interface provides the following controls:

* **Start** / **Stop** – begin or pause continuous simulation.
* **Step** – advance the game by a single generation.
* **Back** – revert to the previous generation (available only one step back).
* **Speed** – slider that changes how quickly generations update.
* **Rows / Cols** – set the grid dimensions.
* **Clear** – reset the board to all dead cells.
* **Random** – populate the board with a random pattern.
* **Export / Import** – save and load board state as JSON.
* **Info** – open a dialog describing the rules.

Cells are color-coded for clarity: new births appear **blue**, surviving cells **green**, those that will die next generation **red**, and recently dead cells fade out in **gray**.

If you have already performed the manual steps, let me know and I can continue with any further automation.
