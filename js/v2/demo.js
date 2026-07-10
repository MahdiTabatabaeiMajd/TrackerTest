// 30-day demo dataset for development testing.
// Generates plausible psoriasis data with planted correlations so the
// Trends and Insights tabs show meaningful patterns right away.

import { saveLog, loadLog, saveTreatments } from './data.js';

// Plants these intentional correlations (visible in Insights tab):
//   • Stress    → Itch  (strong positive)
//   • Sleep     → Itch  (negative — less sleep = more itch)
//   • Infection → all symptoms spike
//   • PM2.5     → Redness (moderate positive)

export function loadDemoData() {
  if (loadLog().length > 0) {
    if (!confirm("This will overwrite your existing entries with demo data. Continue?")) return;
  }

  // ── Helper: date string for N days ago ───────────────────────────────────
  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  }

  const bodyParts = {
    itch    : ["Scalp", "Left forearm"],
    pain    : ["Right knee"],
    redness : ["Scalp", "Torso"],
    scaling : ["Left forearm"],
  };

  const WMO_SAMPLE = ["Clear sky", "Partly cloudy", "Overcast", "Mainly clear"];

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, Math.round(v))); }
  function rand(lo, hi)     { return lo + Math.random() * (hi - lo); }
  function randInt(lo, hi)  { return Math.round(rand(lo, hi)); }

  // ── 30-day symptom + trigger log ─────────────────────────────────────────
  const entries = [];
  const today   = new Date();

  let itch    = 4;
  let pain    = 2;
  let redness = 3;
  let scaling = 2;

  for (let d = 29; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];

    // Scenario events
    const isStressWeek = d >= 18 && d <= 22;
    const isInfected   = d >= 10 && d <= 12;
    const isHighAQ     = d >= 5  && d <= 8;
    const isRecovery   = d <= 4;

    const stress     = isStressWeek ? randInt(7, 10) : isInfected ? randInt(5, 8) : randInt(1, 5);
    const sleepHours = isStressWeek ? rand(4, 6) : isRecovery ? rand(7, 9) : rand(5.5, 8.5);
    const alcohol    = d % 7 === 0 ? 2 : d % 7 === 6 ? 1 : 0;
    const exercise   = isStressWeek || isInfected ? 0 : randInt(0, 2);
    const infection  = isInfected;
    const koebner    = d === 15;

    const stressEffect  = (stress - 3) * 0.4;
    const sleepEffect   = (7 - sleepHours) * 0.3;
    const infectEffect  = isInfected ? 3 : 0;
    const koebnerEffect = koebner    ? 2 : 0;

    itch    = clamp(itch    + stressEffect + sleepEffect + infectEffect + koebnerEffect + rand(-1, 1),  0, 10);
    pain    = clamp(pain    + infectEffect * 0.5 + rand(-0.5, 0.5),   0, 10);
    redness = clamp(redness + (isHighAQ ? 1.5 : 0) + infectEffect * 0.4 + rand(-0.8, 0.8), 0, 10);
    scaling = clamp(scaling + stressEffect * 0.3 + rand(-0.6, 0.6),   0, 10);

    if (isRecovery) {
      itch    = clamp(itch    - rand(0.5, 1.5), 0, 10);
      redness = clamp(redness - rand(0.3, 1.0), 0, 10);
    }

    const hasEnv = Math.random() > 0.3;
    const environment = hasEnv ? {
      temperature  : Math.round(rand(isRecovery ? 22 : 15, 30) * 10) / 10,
      humidity     : randInt(40, 80),
      weatherCode  : 0,
      weatherDesc  : WMO_SAMPLE[randInt(0, WMO_SAMPLE.length - 1)],
      precipitation: 0,
      pm25         : Math.round((isHighAQ ? rand(30, 55) : rand(5, 18))  * 10) / 10,
      pm10         : Math.round((isHighAQ ? rand(50, 80) : rand(10, 35)) * 10) / 10,
      no2          : Math.round((isHighAQ ? rand(30, 55) : rand(5, 20))  * 10) / 10,
      season       : "Summer",
    } : null;

    const symptoms = [
      { name: "Itch",    score: itch,    parts: itch    > 3 ? bodyParts.itch    : [] },
      { name: "Pain",    score: pain,    parts: pain    > 3 ? bodyParts.pain    : [] },
      { name: "Redness", score: redness, parts: redness > 3 ? bodyParts.redness : [] },
      { name: "Scaling", score: scaling, parts: scaling > 3 ? bodyParts.scaling : [] },
    ];

    entries.push({
      date      : dateStr,
      symptoms,
      isFlareDay: symptoms.some(s => s.score >= 7),
      lifestyle : {
        stress,
        sleepHours: Math.round(sleepHours * 10) / 10,
        alcohol, exercise, smoking: false, infection, koebner,
      },
      environment,
    });
  }

  // ── Demo treatments — deliberately partial date ranges ───────────────────
  //
  // The Trends tab shows the last 14 entries (= entries from ~13 days ago to today).
  // Three treatments are spaced so they cover non-overlapping portions of that window,
  // making it visually obvious whether each band covers only its own period.
  //
  // Treatment 1 (topical, high): 24→10 days ago
  //   → In Trends: starts before the window, band visible from the left edge to ~entry 3
  //
  // Treatment 2 (topical, ultra-high): 9→4 days ago
  //   → In Trends: clearly in the middle of the chart (~entries 4-9)
  //
  // Treatment 3 (biologic, IL-17A): 3 days ago → ongoing
  //   → In Trends: right side of chart to the current end, still active
  //
  // None of them run from day 1 to day 30 — that's intentional so you can verify
  // each band covers only its own treatment period and not the whole timeline.

  const demoTreatments = [
    {
      id           : "demo-t1",
      type         : "topical",
      potencyClass : "High — Class II–III",
      biologicClass: null,
      drug         : "Betamethasone dipropionate 0.05%",
      bodyAreas    : ["Scalp", "Torso"],
      startDate    : daysAgo(24),   // well before Trends window
      stopDate     : daysAgo(10),   // stops early in Trends window
      notes        : "Demo — initial flare management",
    },
    {
      id           : "demo-t2",
      type         : "topical",
      potencyClass : "Ultra-High — Class I",
      biologicClass: null,
      drug         : "Clobetasol propionate 0.05%",
      bodyAreas    : ["Left forearm", "Right forearm"],
      startDate    : daysAgo(9),    // starts mid-Trends window
      stopDate     : daysAgo(4),    // stops mid-Trends window
      notes        : "Demo — short-course for forearm flare",
    },
    {
      id           : "demo-t3",
      type         : "biologic",
      potencyClass : null,
      biologicClass: "IL-17A inhibitors",
      drug         : "Secukinumab (Cosentyx)",
      bodyAreas    : [],
      startDate    : daysAgo(3),    // starts near the right end of Trends window
      stopDate     : null,          // ongoing
      notes        : "Demo — loading dose initiated",
    },
  ];

  saveLog(entries);
  saveTreatments(demoTreatments);
  alert("30-day demo loaded with symptom data and 3 treatments.\nOpen Trends to see the treatment bands.");
  window.location.reload();
}
