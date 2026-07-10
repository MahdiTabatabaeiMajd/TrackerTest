// History tab renderer + archive/restore.

import { loadLog, saveLog, loadArchive, saveArchive } from './data.js';
import { getSeverityLabel } from './scoring.js';
import { ALCOHOL_LABELS, EXERCISE_LABELS } from './lifestyle.js';

export function renderHistory() {
  const entries   = loadLog();
  const archive   = loadArchive();
  const container = document.getElementById("history-list");
  container.innerHTML = "";

  // ── Toolbar: archive + restore buttons ────────────────────────────────────
  const toolbar = document.createElement("div");
  toolbar.className = "history-toolbar";

  if (entries.length > 0) {
    const archiveBtn = document.createElement("button");
    archiveBtn.className = "btn-archive";
    archiveBtn.textContent = "Archive all entries";
    archiveBtn.addEventListener("click", function () {
      const confirmed = confirm(
        "Your " + entries.length + " entries will be hidden from this view.\n\n"
        + "Your data stays on this device and can be restored anytime.\n\n"
        + "Continue?"
      );
      if (!confirmed) return;

      // Merge into archive (keep existing archive too), then clear active log
      const merged = [...archive, ...entries].sort((a, b) => a.date.localeCompare(b.date));
      saveArchive(merged);
      saveLog([]);
      renderHistory();
    });
    toolbar.appendChild(archiveBtn);
  }

  if (archive.length > 0) {
    const restoreBtn = document.createElement("button");
    restoreBtn.className = "btn-restore";
    restoreBtn.textContent = "↩ Restore " + archive.length + " archived entries";
    restoreBtn.addEventListener("click", function () {
      const confirmed = confirm(
        "Restore " + archive.length + " archived entries?\n\n"
        + "They will be merged with your current entries and sorted by date."
      );
      if (!confirmed) return;

      const merged = [...loadLog(), ...archive].sort((a, b) => a.date.localeCompare(b.date));
      saveLog(merged);
      saveArchive([]);   // clear archive after restore
      renderHistory();
    });
    toolbar.appendChild(restoreBtn);
  }

  if (toolbar.children.length > 0) container.appendChild(toolbar);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (entries.length === 0) {
    const msg = document.createElement("p");
    msg.className = "empty-msg";
    msg.textContent = archive.length > 0
      ? "No active entries — " + archive.length + " entries are archived above."
      : "No entries yet — log your first day.";
    container.appendChild(msg);
    return;
  }

  // ── Entry cards ───────────────────────────────────────────────────────────
  const list = document.createElement("div");

  entries.slice().reverse().forEach(function (entry, idx) {
    const realIdx = entries.length - 1 - idx;
    const card = document.createElement("div");
    card.className = "history-card";

    const header = document.createElement("div");
    header.className = "history-header";

    const dl = document.createElement("span");
    dl.className = "history-date";
    dl.textContent = entry.date;
    header.appendChild(dl);

    if (entry.isFlareDay) {
      const ft = document.createElement("span");
      ft.className = "history-flare";
      ft.textContent = "Flare day";
      header.appendChild(ft);
    }

    const db = document.createElement("button");
    db.className = "delete-btn";
    db.textContent = "✕";
    db.dataset.idx = realIdx;
    header.appendChild(db);
    card.appendChild(header);

    entry.symptoms.forEach(function (s) {
      const lbl = getSeverityLabel(s.score);
      const row = document.createElement("div");
      row.className = "history-symptom";
      row.innerHTML =
        '<span class="summary-name">' + s.name + '</span>'
        + '<span class="summary-score">' + s.score + "/10</span>"
        + '<span class="summary-part">' + (s.parts && s.parts.join(", ") || "—") + '</span>'
        + '<span class="severity-' + lbl.toLowerCase() + '">' + lbl + '</span>';
      card.appendChild(row);
    });

    if (entry.environment || entry.lifestyle) {
      const footer = document.createElement("div");
      footer.className = "history-env";
      const lines = [];
      if (entry.environment) {
        const e = entry.environment;
        lines.push("🌤 " + e.weatherDesc + " · " + e.temperature + "°C · " + e.humidity
          + "% RH · PM2.5 " + e.pm25 + " · PM10 " + e.pm10 + " · NO₂ " + e.no2 + " · " + e.season);
      }
      if (entry.lifestyle) {
        const l = entry.lifestyle;
        lines.push("Stress " + l.stress + "/10 · Sleep " + l.sleepHours + " h"
          + " · Alcohol: " + ALCOHOL_LABELS[l.alcohol] + " · Exercise: " + EXERCISE_LABELS[l.exercise]
          + (l.smoking ? " · Smoking" : "") + (l.infection ? " · Infection" : "") + (l.koebner ? " · Skin trauma" : ""));
      }
      footer.textContent = lines.join("\n");
      card.appendChild(footer);
    }

    list.appendChild(card);
  });

  container.appendChild(list);

  list.addEventListener("click", function (e) {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;
    const ents = loadLog();
    ents.splice(parseInt(btn.dataset.idx), 1);
    saveLog(ents);
    renderHistory();
  });
}
