import { initSplash } from './splash.js';
initSplash();

// main.js — the conductor.
// Imports from every other module and wires them together.
// No business logic lives here; only initialisation and coordination.

import { buildPanel, setupTrigger, closeAllPanels, getSelectedParts } from './symptoms.js';
import { loadDemoData } from './demo.js';
import { initEnvFetch } from './environment.js';
import { setupGroup } from './lifestyle.js';
import { getReviewMode, renderSummary, initReview, initSave, initClear } from './log.js';
import { renderHistory } from './history.js';
import { renderTrends } from './trends.js';
import { renderInsights } from './insights.js';
import { renderTreatments, initTreatmentForm } from './treatments.js';
import { loadTreatments } from './data.js';
import { updateSliderFill } from './slider-fill.js';

// ── Callback shared across modules ───────────────────────────────────────────
// Called whenever any form input changes. Triggers a summary re-render only
// if the user has already clicked "Review Entry" (reviewMode is true).
function onFormChanged() {
  if (getReviewMode()) renderSummary();
}

// ── Tab navigation ────────────────────────────────────────────────────────────
const tabNav = document.querySelector(".tab-nav");

// The sliding "pill" that glides behind the active tab.
const tabIndicator = document.createElement("div");
tabIndicator.className = "tab-indicator";
tabNav.appendChild(tabIndicator);

// Move the indicator to sit exactly behind the given button.
// offsetLeft/offsetWidth are measured from the nav's padding edge, and the
// indicator is anchored to that same edge (left:0), so translateX lines up.
function moveIndicator(btn) {
  tabIndicator.style.width     = btn.offsetWidth + "px";
  tabIndicator.style.height    = btn.offsetHeight + "px";
  tabIndicator.style.transform = "translate(" + btn.offsetLeft + "px, " + btn.offsetTop + "px)";
}

document.querySelectorAll(".tab-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    moveIndicator(btn);
    closeAllPanels();

    if (btn.dataset.tab === "history")    renderHistory();
    if (btn.dataset.tab === "trends")     renderTrends(loadTreatments());
    if (btn.dataset.tab === "treatments") renderTreatments();
    if (btn.dataset.tab === "insights")   renderInsights();
  });
});

// Position the indicator on the active tab at startup, and keep it aligned on
// resize (button widths change with the viewport). requestAnimationFrame waits
// for the first layout pass so offsetWidth is accurate.
function syncIndicator() {
  const active = document.querySelector(".tab-btn.active");
  if (active) moveIndicator(active);
}
requestAnimationFrame(syncIndicator);
window.addEventListener("load", syncIndicator);
window.addEventListener("resize", syncIndicator);

// ── Symptom sliders ───────────────────────────────────────────────────────────
[
  ["itching", "itchingValue"],
  ["pain",    "painValue"],
  ["redness", "rednessValue"],
  ["scaling", "scalingValue"],
].forEach(function ([sliderId, valueId]) {
  document.getElementById(sliderId).addEventListener("input", function () {
    document.getElementById(valueId).textContent = this.value;
    updateSliderFill(this);
    onFormChanged();
  });
});

// Initialize the fill on load (test slider)
updateSliderFill(document.getElementById("itching"));

document.getElementById("logDate").addEventListener("change", onFormChanged);

// Set date to today and cap at today (no future logging)
const today = new Date().toISOString().split("T")[0];
document.getElementById("logDate").value = today;
document.getElementById("logDate").max   = today;

// ── Body part dropdowns ───────────────────────────────────────────────────────
buildPanel("itching", document.getElementById("itchingPanel"), document.getElementById("itchingTags"), document.getElementById("itchingTrigger"), onFormChanged);
buildPanel("pain",    document.getElementById("painPanel"),    document.getElementById("painTags"),    document.getElementById("painTrigger"),    onFormChanged);
buildPanel("redness", document.getElementById("rednessPanel"), document.getElementById("rednessTags"), document.getElementById("rednessTrigger"), onFormChanged);
buildPanel("scaling", document.getElementById("scalingPanel"), document.getElementById("scalingTags"), document.getElementById("scalingTrigger"), onFormChanged);

setupTrigger("itchingTrigger", "itchingPanel");
setupTrigger("painTrigger",    "painPanel");
setupTrigger("rednessTrigger", "rednessPanel");
setupTrigger("scalingTrigger", "scalingPanel");

document.addEventListener("click", closeAllPanels);

// ── Environment fetch ─────────────────────────────────────────────────────────
initEnvFetch(
  document.getElementById("logDate"),
  document.getElementById("envDisplay"),
  document.getElementById("btnFetchEnv"),
  onFormChanged   // called after a successful fetch
);

// ── Lifestyle sliders ─────────────────────────────────────────────────────────
document.getElementById("stressSlider").addEventListener("input", function () {
  document.getElementById("stressValue").textContent = this.value + " / 10";
  onFormChanged();
});
document.getElementById("sleepSlider").addEventListener("input", function () {
  document.getElementById("sleepValue").textContent = parseFloat(this.value).toFixed(1) + " h";
  onFormChanged();
});

// ── Lifestyle step/toggle groups ──────────────────────────────────────────────
["alcoholGroup", "exerciseGroup", "smokingGroup", "infectionGroup", "koebnerGroup"].forEach(function (gid) {
  setupGroup(gid, onFormChanged);
});

// ── Review / Save / Clear ─────────────────────────────────────────────────────
initReview();
initClear();
initTreatmentForm();
document.getElementById("btnDemo").addEventListener("click", loadDemoData);
initSave(function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 2200);
});
