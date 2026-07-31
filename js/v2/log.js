// Log tab: review summary, save, clear.

import { loadLog, saveLog } from './data.js';
import { getSeverityLabel, isFlareDay } from './scoring.js';
import { getSelectedParts, resetSymptoms } from './symptoms.js';
import { getCurrentEnv, clearEnv } from './environment.js';
import { currentLifestyle, resetLifestyle, ALCOHOL_LABELS, EXERCISE_LABELS } from './lifestyle.js';

let reviewMode = false;
export function getReviewMode() { return reviewMode; }

// ── Read current symptom slider values ───────────────────────────────────────

export function currentSymptoms() {
  return [
    { name: "Itch",    score: parseInt(document.getElementById("itching").value), parts: [...getSelectedParts().itching] },
    { name: "Pain",    score: parseInt(document.getElementById("pain").value),    parts: [...getSelectedParts().pain]    },
    { name: "Redness", score: parseInt(document.getElementById("redness").value), parts: [...getSelectedParts().redness] },
    { name: "Scaling", score: parseInt(document.getElementById("scaling").value), parts: [...getSelectedParts().scaling] },
  ];
}

// ── Summary panel ─────────────────────────────────────────────────────────────

export function renderSummary() {
  const dateInput     = document.getElementById("logDate");
  const symptomPanel  = document.getElementById("symptomPanel");
  const summaryContent= document.getElementById("summaryContent");
  const dateLabel     = document.getElementById("dateLabel");
  const w1status      = document.getElementById("w1status");
  const w1TextEl      = document.getElementById("w1Text");
  const buttonRow     = document.getElementById("buttonRow");

  symptomPanel.style.display = "block";
  buttonRow.style.display    = "flex";
  dateLabel.textContent      = dateInput.value;

  const symptoms  = currentSymptoms();
  const lifestyle = currentLifestyle();
  const env       = getCurrentEnv();
  let html = "";
  let flares = [];

  symptoms.forEach(function (s) {
    const lbl = getSeverityLabel(s.score);
    html += '<div class="summary-row">'
          + '<span class="summary-name">'  + s.name                      + '</span>'
          + '<span class="summary-score">' + s.score + "/10"              + '</span>'
          + '<span class="summary-part">'  + (s.parts.join(", ") || "—") + '</span>'
          + '<span class="severity-' + lbl.toLowerCase() + '">' + lbl + '</span>'
          + '</div>';
    if (isFlareDay(s.score)) s.parts.forEach(p => flares.push(s.name + " · " + p));
  });

  html += '<div class="summary-divider">Lifestyle</div>'
        + '<div class="summary-sub">'
        + "Stress: " + lifestyle.stress + "/10 · "
        + "Sleep: "  + lifestyle.sleepHours + " h · "
        + "Alcohol: " + ALCOHOL_LABELS[lifestyle.alcohol] + " · "
        + "Exercise: " + EXERCISE_LABELS[lifestyle.exercise]
        + (lifestyle.smoking   ? " · Smoking: Yes"      : "")
        + (lifestyle.infection ? " · Infection: Yes"    : "")
        + (lifestyle.koebner   ? " · Skin trauma: Yes"  : "")
        + '</div>';

  if (env) {
    html += '<div class="summary-divider">Environment</div>'
          + '<div class="summary-sub">'
          + env.weatherDesc + " · " + env.temperature + "°C · "
          + "Humidity " + env.humidity + "% · "
          + "PM2.5 " + env.pm25 + " · PM10 " + env.pm10 + " · NO₂ " + env.no2 + " · "
          + env.season
          + '</div>';
  }

  summaryContent.innerHTML = html;

  if (flares.length > 0) {
    w1status.style.display = "flex";
    w1TextEl.textContent   = "Flare alert: " + flares.join(", ");
  } else {
    w1status.style.display = "none";
  }
}

// ── Save ──────────────────────────────────────────────────────────────────────

export function initSave(showToastFn) {
  document.getElementById("btnSave").addEventListener("click", function () {
    const symptoms = currentSymptoms();
    const entry = {
      date      : document.getElementById("logDate").value,
      symptoms  : symptoms,
      isFlareDay: symptoms.some(s => isFlareDay(s.score)),
      lifestyle : currentLifestyle(),
      environment: getCurrentEnv() ? Object.assign({}, getCurrentEnv()) : null,
    };
    const entries = loadLog();
    entries.push(entry);
    saveLog(entries);
    showToastFn("✓ Entry saved");
  });
}

// ── Review button ─────────────────────────────────────────────────────────────

export function initReview() {
  document.getElementById("btnReview").addEventListener("click", function () {
    reviewMode = true;
    renderSummary();
  });
}

// ── Clear ─────────────────────────────────────────────────────────────────────

export function initClear() {
  document.getElementById("btnClear").addEventListener("click", function () {
    reviewMode = false;
    clearEnv();

    // Reset symptom sliders
    ["itching", "pain", "redness", "scaling"].forEach(function (key) {
      document.getElementById(key).value = 0;
      document.getElementById(key + "Value").textContent = "0";
    });

    resetSymptoms();
    resetLifestyle();

    document.getElementById("envDisplay").innerHTML =
      '<span class="env-placeholder">Click Fetch to load today\'s conditions</span>';

    document.getElementById("symptomPanel").style.display = "none";
    document.getElementById("w1status").style.display     = "none";
    document.getElementById("buttonRow").style.display    = "none";
    document.getElementById("logDate").value = new Date().toISOString().split("T")[0];
  });
}
