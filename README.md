# FlareWatch

An evidence-based **psoriasis symptom tracker** — log daily flare activity, treatments,
and lifestyle/environmental context, then explore the patterns in your own data.

Built as a single-page, **no-build** web app in vanilla HTML / CSS / JavaScript
(ES modules, `localStorage`). Just open the file — there is nothing to install.

> ⚠️ **Not a medical device.** FlareWatch is a personal wellness diary. Anything it
> shows is a statistical pattern in *your own* data, not a clinical finding —
> correlation does not prove causation. Discuss any health decisions with your
> dermatologist.

## Features

- **Log** — daily severity (itch, pain, redness, scaling) with affected body parts,
  plus lifestyle and context (stress, sleep, alcohol, exercise, smoking, infection,
  skin trauma).
- **Environment** — optionally fetch that day's weather and air quality from the
  open-source [Open-Meteo](https://open-meteo.com) API. Your location is rounded to
  ~10 km before the request and **only the measurements are stored** — your
  coordinates never are.
- **Treatments** — record topical steroids (by potency class) and biologics (by
  mechanism class), with start/stop dates and body areas.
- **Trends** — line charts of symptoms and triggers over time, with treatment
  periods overlaid as colored bands.
- **Insights** — plain-language takeaways, a "flare days vs calm days" comparison,
  and a full trigger × symptom correlation matrix, so the strongest patterns in
  your log surface at a glance.

## Run it

No build step, no dependencies:

```bash
# just open the file
open index.html
```

Or serve the folder and browse to it:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

Click **Load 30-day demo** in the header to populate the app with a sample dataset
(with planted correlations) so every tab has something to show.

## Privacy & security

- **On-device only.** All entries live in your browser's `localStorage`; nothing is
  sent to a server except the optional Open-Meteo weather/air-quality lookup.
- **Strict Content-Security-Policy.** Network access is locked down to the two
  Open-Meteo domains — no other outbound requests are possible, even from injected
  code.
- **Data minimisation.** Location is coarsened before use and never persisted.

## Tech

Vanilla HTML/CSS/JS · ES modules · `localStorage` · inline SVG charts (no chart
library) · Open-Meteo REST API · strict CSP.

## Project structure

```
index.html          # app shell — tabs, forms, layout
css/v2.css          # all styles
js/v2/
  main.js           # entry point; wires everything together
  data.js           # shared constants + localStorage helpers
  scoring.js        # pure scoring / correlation functions
  symptoms.js       # body-part selectors
  lifestyle.js      # lifestyle & context inputs
  environment.js    # Open-Meteo fetch
  log.js            # review / save / clear a daily entry
  history.js        # past-entries list
  trends.js         # symptom/trigger charts + treatment bands
  treatments.js     # topical & biologic treatment records
  insights.js       # correlations, plain-language takeaways, flare-vs-calm
  splash.js         # splash screen
  demo.js           # 30-day sample dataset
AppImages/
  warning.png       # flare-alert icon
```
