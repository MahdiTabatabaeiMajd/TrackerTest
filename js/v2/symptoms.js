// Body part checkbox dropdowns — build, render chips, open/close.

import { bodyPartGroups } from './data.js';

// Module-level state: which parts are selected per symptom.
const selectedParts  = { itching: [], pain: [], redness: [], scaling: [] };
const partCheckboxes = { itching: {}, pain: {}, redness: {}, scaling: {} };

export function getSelectedParts() {
  return selectedParts;
}

// Builds the checkbox list inside a dropdown panel for one symptom.
// `onChanged` is called whenever the selection changes (wired in main.js).
export function buildPanel(symptomKey, panelEl, tagsEl, triggerEl, onChanged) {
  bodyPartGroups.forEach(function (group) {
    const gl = document.createElement("div");
    gl.className = "select-group-label";
    gl.textContent = group.label;
    panelEl.appendChild(gl);

    group.parts.forEach(function (part) {
      const lbl = document.createElement("label");
      const cb  = document.createElement("input");
      cb.type = "checkbox";
      cb.value = part;

      cb.addEventListener("change", function () {
        if (cb.checked) {
          if (!selectedParts[symptomKey].includes(part)) selectedParts[symptomKey].push(part);
        } else {
          selectedParts[symptomKey] = selectedParts[symptomKey].filter(p => p !== part);
        }
        renderTags(symptomKey, tagsEl, triggerEl, onChanged);
        updateTriggerLabel(symptomKey, triggerEl);
        onChanged();
      });

      partCheckboxes[symptomKey][part] = cb;
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(" " + part));
      panelEl.appendChild(lbl);
    });
  });
}

export function updateTriggerLabel(key, triggerEl) {
  const n = selectedParts[key].length;
  triggerEl.innerHTML = (n === 0
    ? "Add body parts"
    : n + (n === 1 ? " part" : " parts") + " selected")
    + ' <span class="trigger-arrow">▾</span>';
}

export function renderTags(key, tagsEl, triggerEl, onChanged) {
  tagsEl.innerHTML = "";
  selectedParts[key].forEach(function (part) {
    const chip = document.createElement("span");
    chip.className = "part-chip";
    chip.textContent = part + " ";

    const rm = document.createElement("button");
    rm.className = "chip-remove";
    rm.textContent = "✕";
    rm.type = "button";
    rm.addEventListener("click", function () {
      selectedParts[key] = selectedParts[key].filter(p => p !== part);
      if (partCheckboxes[key][part]) partCheckboxes[key][part].checked = false;
      renderTags(key, tagsEl, triggerEl, onChanged);
      updateTriggerLabel(key, triggerEl);
      onChanged();
    });

    chip.appendChild(rm);
    tagsEl.appendChild(chip);
  });
}

export function closeAllPanels() {
  document.querySelectorAll(".select-panel").forEach(p => p.classList.remove("open"));
  document.querySelectorAll(".select-trigger").forEach(t => t.classList.remove("active"));
}

export function setupTrigger(triggerId, panelId) {
  const trigger = document.getElementById(triggerId);
  const panel   = document.getElementById(panelId);

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();  // prevent the document click from immediately closing it
    const isOpen = panel.classList.contains("open");
    closeAllPanels();
    if (!isOpen) {
      panel.classList.add("open");
      trigger.classList.add("active");
    }
  });

  // Clicks inside the panel don't bubble up to close it
  panel.addEventListener("click", e => e.stopPropagation());
}

export function resetSymptoms() {
  ["itching", "pain", "redness", "scaling"].forEach(function (key) {
    selectedParts[key] = [];
    Object.values(partCheckboxes[key]).forEach(cb => cb.checked = false);
  });
  document.querySelectorAll(".part-tags").forEach(el => el.innerHTML = "");
  document.querySelectorAll(".select-trigger").forEach(t => {
    t.innerHTML = 'Add body parts <span class="trigger-arrow">▾</span>';
  });
}
