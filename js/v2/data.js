// Shared constants and localStorage helpers.
// No DOM access here — pure data.

export const bodyPartGroups = [
  { label: "Head & Neck",  parts: ["Head","Neck","Scalp"] },
  { label: "Arms & Hands", parts: ["Left upper arm","Right upper arm","Left forearm","Right forearm","Left hand","Right hand"] },
  { label: "Torso",        parts: ["Torso","Hips"] },
  { label: "Legs & Feet",  parts: ["Left thigh","Right thigh","Left knee","Right knee","Left lower leg","Right lower leg","Left foot","Right foot"] },
];

// WMO weather interpretation codes → human-readable label
export const WMO = {
  0:"Clear sky", 1:"Mainly clear", 2:"Partly cloudy", 3:"Overcast",
  45:"Fog", 48:"Icy fog",
  51:"Light drizzle", 53:"Drizzle", 55:"Heavy drizzle",
  61:"Light rain", 63:"Moderate rain", 65:"Heavy rain",
  71:"Light snow", 73:"Moderate snow", 75:"Heavy snow",
  80:"Light showers", 81:"Showers", 82:"Heavy showers",
  95:"Thunderstorm",
};

// Per-treatment colours — the single source of truth shared by the Trends
// bands and the Treatments-tab cards, so one treatment reads as the SAME colour
// in both views. Assigned by position, so the first several treatments are
// always visually distinct (needed so overlapping bands stay tell-apart-able).
//
// This is a validated categorical palette (dataviz skill reference order). The
// hue ORDER is the colour-blind-safety mechanism, not cosmetic: worst adjacent
// CVD separation is ΔE 24.2 — well above the ≥12 target — so consecutive
// treatments stay distinct for protan/deutan/tritan viewers, far more than the
// old indigo/fuchsia/rose set. Aqua and amber sit below 3:1 on white, which is
// fine here: bands are translucent (meant to recede) and every swatch always
// appears beside the treatment's name (identity is never colour-alone).
export const TREATMENT_COLORS = [
  "#2a78d6", // blue
  "#1baf7a", // aqua
  "#eda100", // amber
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
];

export function treatmentColor(index) {
  return TREATMENT_COLORS[index % TREATMENT_COLORS.length];
}

const STORAGE_KEY    = "psotrack_v2";
const ARCHIVE_KEY    = "psotrack_v2_archive";
const TREATMENT_KEY  = "psotrack_v2_treatments";

export function loadLog()           { return JSON.parse(localStorage.getItem(STORAGE_KEY)   || "[]"); }
export function saveLog(e)          { localStorage.setItem(STORAGE_KEY,   JSON.stringify(e)); }

export function loadArchive()       { return JSON.parse(localStorage.getItem(ARCHIVE_KEY)   || "[]"); }
export function saveArchive(e)      { localStorage.setItem(ARCHIVE_KEY,   JSON.stringify(e)); }

export function loadTreatments()    { return JSON.parse(localStorage.getItem(TREATMENT_KEY) || "[]"); }
export function saveTreatments(t)   { localStorage.setItem(TREATMENT_KEY, JSON.stringify(t)); }
