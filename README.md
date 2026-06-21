# OSAYI — Modeling Portfolio

Street fashion modeling portfolio for Osayi (`@_seekforpeace`).
Static site — pure HTML/CSS/JS, no build step. Balenciaga-adjacent brutalist
aesthetic: pure black, Helvetica, uppercase, lots of negative space.

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Adding photos

Put image files in `assets/work/` named `01.jpg`, `02.jpg`, … `08.jpg`.
They appear in the WORK grid automatically. See `assets/work/README.md`.

## Structure

```
index.html     # markup + content
styles.css     # all styling
script.js      # placeholders, footer year, scroll cue
assets/work/   # portfolio photos
```

## To fill in later

- `BASE` location in the INFO section (`index.html`)
- Contact email in the `mailto:` link (`index.html`)
- Real photos in `assets/work/`

## Deploy

Free options for a static site:
- **GitHub Pages** — Settings → Pages → deploy from `main`.
- **Netlify / Vercel** — drag-and-drop the folder or connect the repo.
