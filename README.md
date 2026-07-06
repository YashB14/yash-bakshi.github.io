# Yash Bakshi — Portfolio

A single-page, corporate/professional portfolio site built from resume content (education, experience, projects, skills, achievements). Pure HTML/CSS/JS — no build step, no dependencies beyond Google Fonts.

## Deploy on GitHub Pages (5 minutes)

1. **Create a new repository** on GitHub — e.g. `yash-bakshi.github.io` (using that exact name gives you a live site at `https://yash-bakshi.github.io`) or any name you like (e.g. `portfolio`).
2. **Upload the file**: add `index.html` (and this `README.md`) to the repo — either drag-and-drop via the GitHub web UI ("Add file" → "Upload files") or via git:
   ```bash
   git init
   git add index.html README.md
   git commit -m "Add portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. **Turn on Pages**: in the repo, go to **Settings → Pages**. Under "Build and deployment", set **Source** to `Deploy from a branch`, choose branch `main` and folder `/ (root)`, then **Save**.
4. Wait 1–2 minutes. Your site will be live at:
   - `https://<your-username>.github.io/<repo-name>/` (or `https://<your-username>.github.io/` if you named the repo `<your-username>.github.io`)

## Before you publish — a couple of things worth checking

- **LinkedIn link**: the contact section links to a LinkedIn URL found via search (`linkedin.com/in/yash-bakshi-56615a62`) since your resume PDF only had a generic "linkedin" hyperlink with no visible URL text. Please double-check this is actually your profile before publishing, and swap it out in `index.html` (search for `linkedin.com/in/`) if it's not.
- **Phone number**: your resume includes a phone number, but it's left off the public site intentionally — a phone number on a public GitHub Pages site gets scraped by bots quickly. Add it back into the contact section only if you're comfortable with that.
- **Custom domain (optional)**: if you own a domain, add a `CNAME` file with just the domain name in it, and point your DNS accordingly — GitHub's docs cover this under Settings → Pages → Custom domain.

## Editing content later

Everything lives in one file, `index.html`. Content sections are clearly commented by `<section id="...">`:
- `#background` — education & experience timeline
- `#projects` — the three project cards
- `#skills` — technical skills grid
- `#achievements` — GATE/CGPET stat cards
- `#contact` — email & LinkedIn

No build tools required — edit the HTML directly and refresh.
