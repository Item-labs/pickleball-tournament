# Battle of the Startups — Pickleball Edition 🏓

Static landing page for the **Battle of the Startups, Pickleball Edition** tournament,
presented by **item × Slash**. Built to match the invitation branding.

## Run locally

It's a plain static site — no build step. Either:

```bash
# option 1: just open the file
open index.html

# option 2: serve it (recommended, so fonts/relative paths behave)
python3 -m http.server 8765
# then visit http://localhost:8765
```

## Structure

- `index.html` — single-page site
- `styles.css` — all styling (brand colors + fonts)

Page sections (per the wireframe):
1. **Hero** — Battle of the Startups, date, RSVP CTA
2. **Tournament details** — when / where / format + rules
3. **item × Slash** — partner plugs with links
4. **Who's going?** — logo wall that fills as teams RSVP
5. **FAQs**

## Branding

- Orange `#EE7230` / `#D7632B`, ink `#231F20`, navy `#2A4556`, mist `#ECEEF2`, peach `#F9D0BA`
- Display font: **Anton** · Body font: **Inter** (Google Fonts)
- RSVP currently links out to `item.app/pickle`

## TODO (placeholders marked `[TBD]` in the page)

- Venue / address / schedule
- Final format & full rules
- Entry cost (if any)
- Slash website URL + partner blurbs
- Real company logos in the "Who's going" wall
- Decide RSVP backend / database (form integration) later
