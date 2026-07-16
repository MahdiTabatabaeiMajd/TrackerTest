// Colorful severity slider: paints the filled track green→red by value and
// keeps the thumb color in sync with the fill's leading edge.
// (TEST: Itch only — the matching CSS in v2.css is scoped to #itching.)
// Safe to call on any range input; sliders without the CSS simply ignore
// the custom properties.

// Same color stops as the CSS track gradient: green 0% → amber 55% → red 100%
const STOPS = [
  { at: 0,   rgb: [34, 197, 94] },  // #22c55e green
  { at: 55,  rgb: [234, 179, 8] },  // #eab308 amber
  { at: 100, rgb: [239, 68, 68] },  // #ef4444 red
];

// Linear interpolation between the gradient stops — returns the exact color
// the track shows at `pct`, so the thumb always matches the fill edge.
function colorAt(pct) {
  for (let i = 1; i < STOPS.length; i++) {
    if (pct <= STOPS[i].at) {
      const lo = STOPS[i - 1];
      const hi = STOPS[i];
      const t  = (pct - lo.at) / (hi.at - lo.at);
      const c  = lo.rgb.map((v, k) => Math.round(v + (hi.rgb[k] - v) * t));
      return "rgb(" + c.join(",") + ")";
    }
  }
  return "rgb(" + STOPS[STOPS.length - 1].rgb.join(",") + ")";
}

export function updateSliderFill(el) {
  const min = parseFloat(el.min) || 0;
  const max = parseFloat(el.max) || 100;
  const pct = ((parseFloat(el.value) - min) / (max - min)) * 100;
  el.style.setProperty("--fill", pct + "%");
  el.style.setProperty("--thumb-color", colorAt(pct));
}
