# Edrian Barandino — Portfolio

A static site (HTML, CSS, JS). No build step, ready for GitHub Pages.

## Before you publish
1. In `index.html`, replace `YOUR-GITHUB-USERNAME` in the footer link with your GitHub username.
2. Optional: change the email address in `index.html` and `script.js` if you want a separate work email.

## Deploy on GitHub Pages
1. Create a new public repository on GitHub.
   - Name it `<your-username>.github.io` to get the address `https://<your-username>.github.io`
   - Or use any name (e.g. `portfolio`) to get `https://<your-username>.github.io/portfolio`
2. Upload these files to the root of the repository: `index.html`, `styles.css`, `script.js`, `.nojekyll`, `README.md`
   (on GitHub: **Add file → Upload files**, or with git:)
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repository go to **Settings → Pages**, set **Source** to "Deploy from a branch", choose `main` and `/ (root)`, then save.
4. After a minute or two the site is live at the address shown on that page.

## Editing
- Projects are in the "Things I've built" section of `index.html`. Copy an `<article class="case">` block to add one.
- Colors live at the top of `styles.css` under `:root`.
- The contact form opens the visitor's email app with a pre-filled message, so no server is needed.
