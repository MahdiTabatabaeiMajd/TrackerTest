# FlareWatch Design System

**FlareWatch** is an evidence-based psoriasis symptom tracker by **INIA Biosciences**. Patients log daily symptom severity (itch, pain, redness, scaling, 0–10) with affected body parts, lifestyle context (stress, sleep, alcohol, exercise, smoking, infection, skin trauma), and auto-fetched environment data (weather, humidity, PM2.5/PM10, NO₂ via Open-Meteo). Tabs: **Log · History · Treatments · Trends · Insights**. All data stays on-device (localStorage); the app is a privacy-first personal wellness diary, explicitly *not* a medical device.

**Source:** https://github.com/MahdiTabatabaeiMajd/TrackerTest (`index.html`, `css/v2.css`, `js/v2/*`). Explore it further to ground new designs — every token here was copied verbatim from `css/v2.css`.

## CONTENT FUNDAMENTALS
- **Voice:** second person, warm-clinical. "Track your skin. See what matters." / "Your strongest day-to-day patterns, in plain language." The app talks about "your data", "your log", "your dermatologist".
- **Plain language over jargon** in patient-facing copy ("On days with more **Stress**, your **itch** tends to be higher"); precise medical vocabulary in reference data (potency classes, biologic mechanism classes, drug names with brand in parens: "Adalimumab (Humira)").
- **Honest, caveated statistics:** always distinguish correlation from causation. Recurring disclaimer: "These are statistical patterns in *your own* data, not clinical findings… Discuss any concerns with your dermatologist."
- **Privacy reassurance inline** where data leaves the device: "Your location is rounded to ~10 km… your coordinates are never stored."
- **Casing:** Title Case for section headers rendered uppercase via CSS ("Symptom Severity", "Lifestyle & Context"); sentence case everywhere else. Buttons: verb-first, short ("Save", "Review Entry", "Mark as stopped today").
- **Emoji:** yes, sparingly and functionally — 📍 (fetch location), 🌡️ 💧 🌤 (env chips), ⚠️ (notices). Unicode glyphs as icons: ▾ ✕ ＋ ↩ →.
- **Empty states** are encouraging and specific: "No entries yet — Open the Log tab to record your first day." The app ships EMPTY — a dashed "Load 30-day demo" button (top-right of the card) generates 30 days of data with planted correlations + 3 staggered treatments (port of js/v2/demo.js).
- Middle dots (·) separate inline metadata: "Evidence-based psoriasis tracker · INIA Biosciences".

## VISUAL FOUNDATIONS
- **Color:** ocean blue→teal is the brand axis, derived from the INIA Biosciences logo (aqua wordmark #6ed8cc, dolphin steel blue). `--grad-brand` (90deg #2e7396→#3ab7bf→#5bcfc4) for accent bars and gradient headline text; `--grad-action` (135deg blue→teal) only on the primary Save button; `--grad-page` (#eaf4f8→#e4f7f4) as the fixed page background. Splash is FULL-VIEWPORT (fixed, covers the page before revealing the app card): two-tone wordmark (Flare white / Watch #3ab7bf) with tagline "Know your triggers. Prevent the flare." and credit "By INIA Biosciences · Mahdi Tabatabaei" on flat deep navy `--splash-bg` #132a31, over an animated teal trend-line canvas drawn as a smooth Catmull-Rom curve (port of js/v2/splash.js); content sits ~9vh above center to clear the line. Text is a slate ramp (#2d3748 → #a0aec0). Blue #2e7396 is the interactive accent (sliders, focus borders, checkboxes); teal #21a695 marks lifestyle/secondary controls. *Note: this palette intentionally diverges from the shipped app (`css/v2.css` is indigo→fuchsia) — rebranded to the logo at the owner's request.*
- **Semantic color systems** (all pill-shaped tinted chips, dark text on pale bg): severity Clear/Mild/Moderate/Severe (green/amber/orange/red); air-quality good/moderate/poor; warning notices amber (#fff7ed / #fdba74 border). Graded intensity ramps for stepper selections: risk factors (alcohol, smoking) slate→amber→burnt-orange→red (`--ramp-risk-*`), exercise soft→deep green (`--ramp-good-*`). Slider severity words: green/golden-yellow #eab308/orange/red. Charts have a fixed per-metric line color; treatments use a 6-color CVD-safe categorical palette shared between Trends bands and Treatment cards (identity is never color-alone — swatch always sits beside the name); treatment cards tint by type (topical #eaf3f9 blue, biologic #e3f7f2 teal).
- **Type:** system stack (`"Segoe UI", system-ui, sans-serif`) — **no webfont files exist**; do not substitute a Google Font. H1 1.8rem/700 with gradient text fill, beside the 42px INIA logo. Section headers: 0.78rem, 700, uppercase, 0.6px tracking, LEFT-aligned, with a Required/Optional pill mark in forms. Dense small sizes (0.66–0.92rem) everywhere; body copy is never large.
- **Layout:** single centered white card, width 700px on desktop (definite-width #root + `scrollbar-gutter:stable`, `box-sizing:border-box`), radius 24px, `overflow:clip` (not hidden — keeps the sticky Save bar working), big soft shadow, 5px gradient accent bar pinned to its top edge, footer credit "© 2026 INIA Biosciences · Built by Mahdi Tabatabaei". Inside: tinted section panels (radius 18px, 1px `--border-soft` border) containing white sub-cards (radius 14px, no shadow). Tab panels have minHeight 640 so the form doesn't resize between tabs (0 on mobile). Form actions live in a sticky frosted bar at the card bottom. Touch targets ≥40px (steppers, toggles, chips, tab nav). **Responsive:** components use inline styles, so every value that changes on small screens is a CSS variable in `tokens/responsive.css`, re-mapped by a single `@media (max-width:600px)` — 2-col grids collapse to 1 (`--grid-2col`), card/page padding and title tighten, header gains clearance under the demo button, TabNav shrinks and can scroll sideways.
- **Borders:** 1.5px is the signature weight (#e2e8f0 default, #cbd5e0 inputs). Dashed borders = ghost/add affordances. Radii: pills (50px) for primary buttons/toasts, 20px chips, 8–18px everything else — nothing square.
- **Shadows:** quiet. Cards 0 1px 4px 4%; popovers 0 6px 24px 12%; only the Save button gets a colored glow (0 3px 12px rgba(124,58,237,.4)).
- **Animation:** subtle and quick. Tab indicator = white pill gliding via transform 0.30s cubic-bezier(.4,0,.2,1); tab panels fade-up 6px/0.3s; buttons hover → opacity .85 + translateY(-1px), press → back to 0. `prefers-reduced-motion` respected. No bounces.
- **Hover states:** color shifts (muted→indigo), pale-indigo fills (#eef2ff), opacity dips. Press: translateY reset only.
- **Imagery:** none — the UI is chip-, chart-, and card-driven. Charts are hand-built inline SVG (280×120, thin strokes, white-filled dots, tiny 7.5px labels).
- No blur/transparency effects, no dark mode, no photography.

## ICONOGRAPHY
No icon font and no SVG icon set. The app's "icons" are (1) functional emoji (📍 🌡️ 💧 🌤 ⚠️), (2) unicode glyphs (▾ dropdown, ✕ delete, ＋ add, ↩ restore, → forward), and (3) one PNG: `assets/warning.png` (flare-alert). Inline SVG is reserved for data graphics: chart lines, treatment band swatches (rounded square with solid top bar), strength meters, comparison bars. Brand mark: `assets/INIA_logo.png` (INIA Biosciences dolphin logo, teal) — FlareWatch itself is wordmark-only (gradient text). Keep this vocabulary; do not import an icon font.

## Index
- `styles.css` → `tokens/` (colors, typography, spacing, effects, base, responsive)
- `assets/` — INIA_logo.png, warning.png
- `guidelines/` — foundation specimen cards
- `components/core/` — Button, Chip, Badge, TabNav, SectionHeader, Toast
- `components/forms/` — SliderRow, TriggerSlider, StepGroup, ToggleGroup, Field
- `components/charts/` — TrendChart
- `ui_kits/flarewatch/` — full working port of the app (all 5 tabs): real localStorage persistence (same keys as v2 — data is interchangeable between versions) and live geolocation + Open-Meteo fetch
- `SKILL.md`, `github.md`

## Intentional additions (diverge from the shipped repo, at the owner's request)
- Palette rebranded to the INIA logo (repo is indigo→fuchsia); graded ramp tokens for stepper selections.
- Form UX: left-aligned headers with Required/Optional marks, merged Yes/No rows (Infection, Skin trauma), sticky Save bar, live severity words on sliders, hover tooltips with evidence-based alcohol/smoking definitions (`FW.ALCOHOL_TIPS`/`SMOKING_TIPS`), smoking as a 4-level stepper.
- Treatments: potency/mechanism class dropdowns removed — flat drug list; class line dropped from cards.
- Body-part picker: dropdown → tap-to-toggle pills. Splash: card overlay → full viewport, smooth curve.
- App ships empty (repo seeds 14 days); demo data only via the Load 30-day demo button.
