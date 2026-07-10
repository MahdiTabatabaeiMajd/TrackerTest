// Insights tab (V2).
//
// Three layers, most-understandable first:
//   1. "What your data suggests" — plain-language takeaway cards with a
//      strength meter. Translates the raw correlation numbers into sentences.
//   2. "Flare days vs calm days" — average trigger level on the days you
//      flared vs the days you didn't. A within-diary case/control contrast.
//   3. "Full correlation matrix" — the original Pearson table, kept intact
//      for detail, now with a one-line plain-English explainer.
//
// All charts are inline SVG using presentation attributes only (no inline
// style attributes), so they stay within the page's strict CSP.

import { loadLog } from './data.js';
import { pearsonR, corrClass } from './scoring.js';

export function renderInsights() {
  const entries   = loadLog();
  const container = document.getElementById("insights-container");
  container.innerHTML = "";

  if (entries.length < 5) {
    container.innerHTML =
      '<p class="empty-msg">Need at least 5 entries to show correlations.<br>You have ' + entries.length + '.</p>';
    return;
  }

  // Each trigger has a label and a function that extracts a numeric value from an entry.
  const triggers = [
    { label: "Stress",       get: e => e.lifestyle?.stress },
    { label: "Sleep (h)",    get: e => e.lifestyle?.sleepHours },
    { label: "Alcohol",      get: e => e.lifestyle?.alcohol },
    { label: "Exercise",     get: e => e.lifestyle?.exercise },
    { label: "Smoking",      get: e => e.lifestyle?.smoking   ? 1 : 0, binary: true },
    { label: "Infection",    get: e => e.lifestyle?.infection ? 1 : 0, binary: true },
    { label: "Skin trauma",  get: e => e.lifestyle?.koebner   ? 1 : 0, binary: true },
    { label: "Temperature",  get: e => e.environment?.temperature },
    { label: "Humidity",     get: e => e.environment?.humidity },
    { label: "PM2.5",        get: e => e.environment?.pm25 },
    { label: "PM10",         get: e => e.environment?.pm10 },
    { label: "NO₂",          get: e => e.environment?.no2 },
  ];

  const symptoms = ["Itch", "Pain", "Redness", "Scaling", "Flare"];

  function getSymptomScore(entry, name) {
    if (name === "Flare") return entry.isFlareDay ? 1 : 0;
    const s = entry.symptoms?.find(s => s.name === name);
    return s ? s.score : null;
  }

  // Compute every trigger×symptom correlation once; all three sections reuse it.
  const cells = [];   // { trig, sym, r, n }
  triggers.forEach(function (trig) {
    symptoms.forEach(function (sym) {
      const pairs = entries
        .map(e => ({ x: trig.get(e), y: getSymptomScore(e, sym) }))
        .filter(p => p.x != null && p.y != null);
      const r = pairs.length >= 3 ? pearsonR(pairs.map(p => p.x), pairs.map(p => p.y)) : null;
      cells.push({ trig, sym, r, n: pairs.length });
    });
  });

  container.appendChild(buildTakeaways(cells));

  const fc = buildFlareVsCalm(entries, triggers, cells);
  if (fc) container.appendChild(fc);

  container.appendChild(buildMatrix(triggers, symptoms, cells));
}

// ── 1. Plain-language takeaway cards ──────────────────────────────────────────
function buildTakeaways(cells) {
  const wrap = document.createElement("div");
  wrap.className = "insights-block";
  wrap.innerHTML =
      '<h4 class="insights-section-title">What your data suggests</h4>'
    + '<p class="insights-section-sub">Your strongest day-to-day patterns, in plain language.</p>';

  const findings = cells
    .filter(c => c.r !== null && Math.abs(c.r) >= 0.3)
    .sort((a, b) => Math.abs(b.r) - Math.abs(a.r));

  if (findings.length === 0) {
    const p = document.createElement("p");
    p.className = "insights-none";
    p.textContent =
      "No clear patterns yet. Keep logging — a link shows up here once a trigger "
      + "and a symptom tend to rise and fall together across enough days.";
    wrap.appendChild(p);
    return wrap;
  }

  // Diversify so one dominant trigger can't fill every card:
  // at most 2 cards per trigger, up to 5 cards total.
  const perTrigger = {};
  const chosen = [];
  for (const f of findings) {
    const key = f.trig.label;
    if ((perTrigger[key] || 0) >= 2) continue;
    perTrigger[key] = (perTrigger[key] || 0) + 1;
    chosen.push(f);
    if (chosen.length >= 5) break;
  }

  const grid = document.createElement("div");
  grid.className = "insight-cards";
  chosen.forEach(f => grid.appendChild(insightCard(f)));
  wrap.appendChild(grid);
  return wrap;
}

function insightCard(f) {
  const pos  = f.r > 0;
  const trig = f.trig.label;
  const sym  = f.sym;

  let sentence;
  if (sym === "Flare") {
    sentence = pos
      ? 'On days with more <b>' + trig + '</b>, you tend to have a <b>flare</b>.'
      : 'On days with more <b>' + trig + '</b>, you tend <b>not</b> to flare.';
  } else {
    sentence = pos
      ? 'On days with more <b>' + trig + '</b>, your <b>' + sym.toLowerCase() + '</b> tends to be higher.'
      : 'On days with more <b>' + trig + '</b>, your <b>' + sym.toLowerCase() + '</b> tends to be lower.';
  }

  const strengthWord = Math.abs(f.r) >= 0.5 ? "strong link" : "moderate link";
  const dirClass = pos ? "pos" : "neg";

  const card = document.createElement("div");
  card.className = "insight-card";
  card.innerHTML =
      '<p class="ic-sentence">' + sentence + '</p>'
    + '<div class="ic-meter-row">'
    +   strengthMeter(f.r)
    +   '<span class="ic-strength ic-strength-' + dirClass + '">' + strengthWord + '</span>'
    + '</div>'
    + '<p class="ic-meta">Seen across ' + f.n + ' logged days</p>';
  return card;
}

// Horizontal meter: fill length = |r| (0–1), coloured by direction.
function strengthMeter(r) {
  const W = 120, H = 8;
  const w = Math.max(Math.min(Math.abs(r), 1) * W, 2);
  const fill = r >= 0 ? "#ef4444" : "#10b981";
  return '<svg class="ic-meter-svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">'
       + '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="4" fill="#eef2f6"/>'
       + '<rect x="0" y="0" width="' + w + '" height="' + H + '" rx="4" fill="' + fill + '"/>'
       + '</svg>';
}

// ── 2. Flare days vs calm days ────────────────────────────────────────────────
function buildFlareVsCalm(entries, triggers, cells) {
  const flareDays = entries.filter(e => e.isFlareDay);
  const calmDays  = entries.filter(e => !e.isFlareDay);
  if (flareDays.length < 2 || calmDays.length < 2) return null;

  function avg(days, get) {
    const v = days.map(get).filter(x => x != null);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  }

  // Rank triggers by how strongly they track flaring — reuse the matrix's Flare column.
  const flareR = {};
  cells.forEach(c => { if (c.sym === "Flare") flareR[c.trig.label] = c.r; });

  const rows = triggers.map(function (trig) {
    const f = avg(flareDays, trig.get);
    const c = avg(calmDays,  trig.get);
    if (f == null || c == null) return null;
    const allVals = entries.map(trig.get).filter(x => x != null);
    const dataMax = allVals.length ? Math.max.apply(null, allVals.concat(0.0001)) : 1;
    return { trig, flareAvg: f, calmAvg: c, dataMax, rank: Math.abs(flareR[trig.label] || 0) };
  })
    .filter(Boolean)
    .filter(r => Math.abs(r.flareAvg - r.calmAvg) > 0.001)   // drop rows with no real difference
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 6);

  if (rows.length === 0) return null;

  const dLabel = n => n + " day" + (n === 1 ? "" : "s");

  const wrap = document.createElement("div");
  wrap.className = "insights-block";
  wrap.innerHTML =
      '<h4 class="insights-section-title">Flare days vs calm days</h4>'
    + '<p class="insights-section-sub">Your average trigger levels on the '
    + dLabel(flareDays.length) + ' you flared, compared with the '
    + dLabel(calmDays.length) + ' you didn’t.</p>';

  const legend = document.createElement("div");
  legend.className = "fc-legend";
  legend.innerHTML =
      '<span class="fc-chip fc-chip-flare">Flare days</span>'
    + '<span class="fc-chip fc-chip-calm">Calm days</span>';
  wrap.appendChild(legend);

  rows.forEach(r => wrap.appendChild(flareCalmRow(r)));
  return wrap;
}

function flareCalmRow(r) {
  const { trig, flareAvg, calmAvg, dataMax } = r;
  const fmt = trig.binary
    ? v => Math.round(v * 100) + "% of days"
    : v => String(Math.round(v * 10) / 10);

  const tag = flareAvg > calmAvg
    ? '<span class="fc-tag fc-tag-flare">higher on flare days</span>'
    : '<span class="fc-tag fc-tag-calm">higher on calm days</span>';

  const row = document.createElement("div");
  row.className = "fc-row";
  row.innerHTML =
      '<div class="fc-head"><span class="fc-name">' + trig.label + '</span>' + tag + '</div>'
    + '<div class="fc-line">'
    +   '<span class="fc-key">Flare</span>' + hbar(flareAvg, dataMax, "#ef4444")
    +   '<span class="fc-val">' + fmt(flareAvg) + '</span>'
    + '</div>'
    + '<div class="fc-line">'
    +   '<span class="fc-key">Calm</span>' + hbar(calmAvg, dataMax, "#10b981")
    +   '<span class="fc-val">' + fmt(calmAvg) + '</span>'
    + '</div>';
  return row;
}

function hbar(value, dataMax, color) {
  const W = 150, H = 12;
  const w = value > 0 ? Math.max((value / dataMax) * W, 3) : 0;
  return '<svg class="fc-bar" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">'
       + '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="6" fill="#eef2f6"/>'
       + '<rect x="0" y="0" width="' + w + '" height="' + H + '" rx="6" fill="' + color + '"/>'
       + '</svg>';
}

// ── 3. Full correlation matrix (original table, kept intact) ──────────────────
function buildMatrix(triggers, symptoms, cells) {
  const wrap = document.createElement("div");
  wrap.className = "insights-block";
  wrap.innerHTML =
      '<h4 class="insights-section-title">Full correlation matrix</h4>'
    + '<p class="insights-section-sub">Every trigger against every symptom. Each number is a '
    + 'correlation from −1 to +1 — the further from 0, the stronger the link; '
    + 'red = symptom rises with the trigger, green = symptom falls.</p>';

  const legend = document.createElement("div");
  legend.className = "corr-legend";
  legend.innerHTML =
      '<span class="legend-chip legend-strong-pos">Strong +</span>'
    + '<span class="legend-chip legend-moderate-pos">Moderate +</span>'
    + '<span class="legend-chip legend-weak">Weak / none</span>'
    + '<span class="legend-chip legend-moderate-neg">Moderate −</span>'
    + '<span class="legend-chip legend-strong-neg">Strong −</span>';
  wrap.appendChild(legend);

  // Index the shared cells by trigger → symptom for quick table lookup.
  const byTrig = {};
  cells.forEach(c => { (byTrig[c.trig.label] = byTrig[c.trig.label] || {})[c.sym] = c; });

  const tableWrap = document.createElement("div");
  tableWrap.className = "corr-table-wrap";

  let html = '<table class="corr-table"><thead><tr><th>Trigger</th>';
  symptoms.forEach(s => { html += "<th>" + s + "</th>"; });
  html += "</tr></thead><tbody>";

  triggers.forEach(function (trig) {
    html += "<tr><td>" + trig.label + "</td>";
    symptoms.forEach(function (sym) {
      const c   = byTrig[trig.label][sym];
      const cls = corrClass(c.r);
      html += '<td class="' + cls + '">'
            + (c.r !== null ? c.r.toFixed(2) : '<span class="corr-na">—</span>')
            + '</td>';
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  tableWrap.innerHTML = html;
  wrap.appendChild(tableWrap);
  return wrap;
}
