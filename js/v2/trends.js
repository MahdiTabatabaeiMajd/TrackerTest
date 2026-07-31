// Trends tab: line charts for symptoms and triggers over the last 14 entries.
//
// The user controls which metrics are shown and which treatments are overlaid.
// Treatment bands appear ONLY on symptom charts — they have no meaningful
// relationship to environmental/lifestyle triggers (e.g. a steroid doesn't
// change PM2.5 or humidity), so we never draw them on trigger charts.

import { loadLog, treatmentColor } from './data.js';

// Treatment band colours come from the shared per-treatment palette in data.js,
// so a band matches that treatment's card colour on the Treatments tab.

// ── Selection state (persists across tab switches within the session) ─────────
let selectedMetrics    = null;   // Set of metric keys the user wants to see
let selectedTreatments = null;   // Set of treatment ids to overlay
let knownTreatmentIds  = null;   // tracks which treatments we've seen, so NEW
                                 // ones default to visible without re-showing
                                 // ones the user deliberately unchecked.

export function renderTrends(treatments = []) {
  const entries   = loadLog();
  const container = document.getElementById("trends-container");

  if (entries.length === 0) {
    container.innerHTML = '<p class="empty-msg">No data yet — log some entries first.</p>';
    return;
  }

  const recent = entries.slice(-14);
  const dates  = recent.map(e => e.date.slice(5));   // "MM-DD" x-axis labels

  // Master list of every possible chart, tagged by category.
  const chartDefs = [
    { key: "itch",     title: "Itch",         category: "symptom", scores: recent.map(e => e.symptoms[0]?.score ?? null),   maxVal: 10,  color: "#e11d48" },
    { key: "pain",     title: "Pain",         category: "symptom", scores: recent.map(e => e.symptoms[1]?.score ?? null),   maxVal: 10,  color: "#ea580c" },
    { key: "redness",  title: "Redness",      category: "symptom", scores: recent.map(e => e.symptoms[2]?.score ?? null),   maxVal: 10,  color: "#db2777" },
    { key: "scaling",  title: "Scaling",      category: "symptom", scores: recent.map(e => e.symptoms[3]?.score ?? null),   maxVal: 10,  color: "#9333ea" },
    { key: "stress",   title: "Stress",       category: "trigger", scores: recent.map(e => e.lifestyle?.stress ?? null),    maxVal: 10,  color: "#4f46e5" },
    { key: "sleep",    title: "Sleep (h)",    category: "trigger", scores: recent.map(e => e.lifestyle?.sleepHours ?? null), maxVal: 12, color: "#0d9488" },
    { key: "pm25",     title: "PM2.5",        category: "trigger", scores: recent.map(e => e.environment?.pm25 ?? null),     maxVal: 60,  color: "#64748b" },
    { key: "humidity", title: "Humidity (%)", category: "trigger", scores: recent.map(e => e.environment?.humidity ?? null), maxVal: 100, color: "#0284c7" },
  ];

  // Compute treatment bands that fall inside the visible window.
  const allBands = computeBands(recent, treatments);

  // ── Initialise / update selection state ─────────────────────────────────────
  if (selectedMetrics === null)   selectedMetrics   = new Set(chartDefs.map(c => c.key));
  if (selectedTreatments === null) selectedTreatments = new Set();
  if (knownTreatmentIds === null)  knownTreatmentIds  = new Set();

  // Any treatment we haven't seen before defaults to "shown".
  allBands.forEach(function (b) {
    if (!knownTreatmentIds.has(b.id)) {
      knownTreatmentIds.add(b.id);
      selectedTreatments.add(b.id);
    }
  });

  container.innerHTML = "";
  container.appendChild(buildControls(chartDefs, allBands, drawCharts));

  const chartsArea = document.createElement("div");
  container.appendChild(chartsArea);

  drawCharts();

  // ── Inner: (re)draw only the charts + legend, leaving controls untouched ────
  function drawCharts() {
    chartsArea.innerHTML = "";

    const visible = chartDefs.filter(c => selectedMetrics.has(c.key));
    if (visible.length === 0) {
      chartsArea.innerHTML = '<p class="empty-msg">Select at least one metric above to see charts.</p>';
      return;
    }

    const activeBands = allBands.filter(b => selectedTreatments.has(b.id));

    const grid = document.createElement("div");
    grid.className = "trends-grid";

    visible.forEach(function (c) {
      // Treatment bands only on symptom charts.
      const bands = c.category === "symptom" ? activeBands : [];
      const div = document.createElement("div");
      div.className = "trend-chart";
      div.innerHTML = "<h4>" + c.title + "</h4>"
                    + buildLineChart(c.scores, dates, c.maxVal, c.color, bands);
      grid.appendChild(div);
    });

    chartsArea.appendChild(grid);

    const note = document.createElement("p");
    note.className = "trends-note";
    note.textContent = "Last " + recent.length + " logged entries  ·  gaps = no data that day";
    chartsArea.appendChild(note);

    // Legend — only when treatments are actually being drawn (a symptom chart is
    // visible AND at least one treatment is selected).
    const anySymptomVisible = visible.some(c => c.category === "symptom");
    if (anySymptomVisible && activeBands.length > 0) {
      chartsArea.appendChild(buildLegend(activeBands));
    }
  }
}

// ── Controls panel ────────────────────────────────────────────────────────────
function buildControls(chartDefs, allBands, onChange) {
  const wrap = document.createElement("div");
  wrap.className = "trend-controls";

  const symptomDefs = chartDefs.filter(c => c.category === "symptom");
  const triggerDefs = chartDefs.filter(c => c.category === "trigger");

  wrap.appendChild(metricGroup("Symptoms", symptomDefs, onChange));
  wrap.appendChild(metricGroup("Triggers", triggerDefs, onChange));

  if (allBands.length > 0) {
    wrap.appendChild(treatmentGroup(allBands, onChange));
  }
  return wrap;
}

function metricGroup(title, defs, onChange) {
  const g = document.createElement("div");
  g.className = "tc-group";

  const head = document.createElement("div");
  head.className = "tc-group-head";
  const t = document.createElement("span");
  t.className = "tc-group-title";
  t.textContent = title;
  head.appendChild(t);

  const allBtn  = miniBtn("All");
  const noneBtn = miniBtn("None");
  head.appendChild(allBtn);
  head.appendChild(noneBtn);
  g.appendChild(head);

  const opts = document.createElement("div");
  opts.className = "tc-options";
  const cbs = [];

  defs.forEach(function (d) {
    const { label, cb } = makeCheckbox(d.title, selectedMetrics.has(d.key), function (on) {
      if (on) selectedMetrics.add(d.key); else selectedMetrics.delete(d.key);
      onChange();
    });
    cbs.push(cb);
    opts.appendChild(label);
  });

  allBtn.addEventListener("click", function () {
    defs.forEach(d => selectedMetrics.add(d.key));
    cbs.forEach(cb => cb.checked = true);
    onChange();
  });
  noneBtn.addEventListener("click", function () {
    defs.forEach(d => selectedMetrics.delete(d.key));
    cbs.forEach(cb => cb.checked = false);
    onChange();
  });

  g.appendChild(opts);
  return g;
}

function treatmentGroup(bands, onChange) {
  const g = document.createElement("div");
  g.className = "tc-group tc-group--treatments";

  const head = document.createElement("div");
  head.className = "tc-group-head";
  const t = document.createElement("span");
  t.className = "tc-group-title";
  t.textContent = "Treatments";
  head.appendChild(t);
  const hint = document.createElement("span");
  hint.className = "tc-group-hint";
  hint.textContent = "shown on symptom charts only";
  head.appendChild(hint);

  const allBtn  = miniBtn("All");
  const noneBtn = miniBtn("None");
  head.appendChild(allBtn);
  head.appendChild(noneBtn);
  g.appendChild(head);

  const opts = document.createElement("div");
  opts.className = "tc-options";
  const cbs = [];

  bands.forEach(function (b) {
    const { label, cb } = makeCheckbox(b.fullName, selectedTreatments.has(b.id), function (on) {
      if (on) selectedTreatments.add(b.id); else selectedTreatments.delete(b.id);
      onChange();
    }, treatmentDot(b.color));
    cbs.push(cb);
    opts.appendChild(label);
  });

  allBtn.addEventListener("click", function () {
    bands.forEach(b => selectedTreatments.add(b.id));
    cbs.forEach(cb => cb.checked = true);
    onChange();
  });
  noneBtn.addEventListener("click", function () {
    bands.forEach(b => selectedTreatments.delete(b.id));
    cbs.forEach(cb => cb.checked = false);
    onChange();
  });

  g.appendChild(opts);
  return g;
}

// Checkbox label; optional leading colour dot (as CSP-safe inline SVG).
function makeCheckbox(text, checked, onToggle, dotSvg) {
  const label = document.createElement("label");
  label.className = "tc-option";

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = checked;
  cb.addEventListener("change", () => onToggle(cb.checked));
  label.appendChild(cb);

  if (dotSvg) {
    const holder = document.createElement("span");
    holder.innerHTML = dotSvg;
    label.appendChild(holder.firstChild);
  }
  label.appendChild(document.createTextNode(" " + text));
  return { label, cb };
}

function miniBtn(text) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "tc-mini";
  b.textContent = text;
  return b;
}

function treatmentDot(color) {
  return '<svg class="tc-dot" width="12" height="12" viewBox="0 0 12 12">'
       + '<rect x="1" y="1" width="10" height="10" rx="3" fill="' + color + '" fill-opacity="0.25"/>'
       + '<rect x="1" y="1" width="10" height="3.2" rx="1.6" fill="' + color + '"/>'
       + '</svg>';
}

// ── Treatment band legend ─────────────────────────────────────────────────────
function buildLegend(bands) {
  const legend = document.createElement("div");
  legend.className = "trend-band-legend";

  const title = document.createElement("p");
  title.className = "trend-band-legend-title";
  title.textContent = "Treatments shown on charts";
  legend.appendChild(title);

  bands.forEach(function (b) {
    const item = document.createElement("div");
    item.className = "band-item";
    const dateStr = b.startDate + (b.stopDate ? " → " + b.stopDate : " → ongoing");
    const typeLabel = b.isTopical ? "Topical" : "Biologic";
    const swatch =
      '<svg class="band-swatch" width="26" height="14" viewBox="0 0 26 14">'
      + '<rect x="0" y="0" width="26" height="14" rx="3" fill="' + b.color + '" fill-opacity="0.18"/>'
      + '<rect x="0" y="0" width="26" height="3.5" rx="1.5" fill="' + b.color + '"/>'
      + '</svg>';
    item.innerHTML =
      swatch
      + '<span class="band-item-name">' + b.fullName + '</span>'
      + '<span class="band-item-type">' + typeLabel + '</span>'
      + '<span class="band-item-dates">' + dateStr + '</span>';
    legend.appendChild(item);
  });

  return legend;
}

// ── Compute treatment bands for the current date window ───────────────────────
function computeBands(recent, treatments) {
  const results = [];
  treatments.forEach(function (t, ti) {
    const endDate = t.stopDate || "9999-12-31";
    // First entry whose date falls on or after the treatment start.
    // Returns -1 when ALL entries are before the start date (treatment not yet begun).
    // When treatment started before the window, findIndex naturally returns 0 — correct.
    let startIdx = recent.findIndex(e => e.date >= t.startDate);
    if (startIdx < 0) return;              // treatment starts after our window — skip
    // find last entry on or before treatment end
    let endIdx = -1;
    for (let i = recent.length - 1; i >= 0; i--) {
      if (recent[i].date <= endDate) { endIdx = i; break; }
    }
    if (endIdx < 0) return;                // treatment ended before our window
    if (startIdx > endIdx) return;
    results.push({
      id        : t.id || ("t" + ti),
      startIdx,
      endIdx,
      isTopical : t.type === "topical",
      label     : shortLabel(t),
      fullName  : t.drug || t.biologicClass || "Treatment",
      startDate : t.startDate,
      stopDate  : t.stopDate,
      color     : treatmentColor(ti),
    });
  });
  return results;
}

function shortLabel(t) {
  const name = t.drug || t.biologicClass || "";
  return name.split(" ")[0];              // "Clobetasol propionate…" → "Clobetasol"
}

// ── SVG line chart builder ────────────────────────────────────────────────────
// scores: array of numbers or null (null = no data that day — line breaks)
// bands:  treatment period rectangles (computed by computeBands)
export function buildLineChart(scores, labels, maxVal, lineColor, bands = []) {
  const W = 280, H = 120, padL = 24, padB = 24, padT = 14, padR = 6;
  const cW = W - padL - padR;
  const cH = H - padT - padB;
  const n  = scores.length;

  function xOf(i) { return padL + (n === 1 ? cW / 2 : (i / (n - 1)) * cW); }
  function yOf(v) { return padT + cH - (v / maxVal) * cH; }

  // width="100%" as an attribute (not inline style) so it works under our CSP.
  let svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" class="trend-svg" preserveAspectRatio="xMidYMid meet">';

  // ── Treatment bands ───────────────────────────────────────────────────────
  bands.forEach(function (b) {
    const x1     = xOf(b.startIdx);
    const x2     = xOf(b.endIdx);
    const bw     = Math.max(x2 - x1, 4);
    const accent = b.color;
    svg += '<rect x="' + x1 + '" y="' + padT + '" width="' + bw + '" height="' + cH
         + '" fill="' + accent + '" fill-opacity="0.13"/>';
    svg += '<rect x="' + x1 + '" y="' + padT + '" width="' + bw + '" height="3" fill="' + accent + '"/>';
    svg += '<line x1="' + x1 + '" y1="' + padT + '" x2="' + x1 + '" y2="' + (padT + cH)
         + '" stroke="' + accent + '" stroke-width="1" stroke-dasharray="2,2" opacity="0.7"/>';
    svg += '<line x1="' + x2 + '" y1="' + padT + '" x2="' + x2 + '" y2="' + (padT + cH)
         + '" stroke="' + accent + '" stroke-width="1" stroke-dasharray="2,2" opacity="0.7"/>';
  });

  // ── Grid lines ────────────────────────────────────────────────────────────
  [0, Math.round(maxVal / 2), maxVal].forEach(function (v) {
    const y = yOf(v);
    svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y
         + '" stroke="#e2e8f0" stroke-width="1"/>';
    svg += '<text x="' + (padL - 3) + '" y="' + (y + 3)
         + '" text-anchor="end" font-size="8" fill="#a0aec0">' + v + '</text>';
  });

  // ── Build line segments (skip nulls — line breaks at gaps) ────────────────
  const segments = [];
  let current = null;
  scores.forEach(function (v, i) {
    if (v !== null) {
      if (!current) { current = []; segments.push(current); }
      current.push({ i, v });
    } else {
      current = null;
    }
  });

  // ── Lines ─────────────────────────────────────────────────────────────────
  segments.forEach(function (seg) {
    if (seg.length < 2) return;
    const pts = seg.map(p => xOf(p.i) + "," + yOf(p.v)).join(" ");
    svg += '<polyline points="' + pts + '" fill="none" stroke="' + lineColor
         + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
  });

  // ── Data points (circles) + value labels ─────────────────────────────────
  scores.forEach(function (v, i) {
    if (v === null) return;
    const x = xOf(i), y = yOf(v);
    svg += '<circle cx="' + x + '" cy="' + y
         + '" r="3" fill="white" stroke="' + lineColor + '" stroke-width="1.5"/>';
    if (v > 0) {
      svg += '<text x="' + x + '" y="' + (y - 5)
           + '" text-anchor="middle" font-size="7.5" fill="#4a5568">' + v + '</text>';
    }
  });

  // ── X-axis labels ─────────────────────────────────────────────────────────
  scores.forEach(function (_, i) {
    if (n > 8 && i % 2 !== 0) return;    // skip alternating labels when crowded
    svg += '<text x="' + xOf(i) + '" y="' + (padT + cH + 14)
         + '" text-anchor="middle" font-size="7.5" fill="#a0aec0">' + (labels[i] || "") + '</text>';
  });

  // ── Axes ──────────────────────────────────────────────────────────────────
  svg += '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + cH) + '" stroke="#cbd5e0" stroke-width="1"/>';
  svg += '<line x1="' + padL + '" y1="' + (padT + cH) + '" x2="' + (W - padR) + '" y2="' + (padT + cH) + '" stroke="#cbd5e0" stroke-width="1"/>';

  svg += '</svg>';
  return svg;
}
