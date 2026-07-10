// Treatment logging: topical corticosteroids and biologics.
//
// Topical steroids: 5 potency classes (US system, Class I = most potent).
// Biologics: 5 mechanism classes, all FDA-approved for moderate-to-severe plaque psoriasis.
//
// Each treatment stored as:
// { id, type:"topical"|"biologic", potencyClass, biologicClass, drug, bodyAreas,
//   startDate, stopDate (null = ongoing), notes }

import { loadTreatments, saveTreatments, treatmentColor } from './data.js';

// ── Drug reference data ───────────────────────────────────────────────────────

export const TOPICAL_CLASSES = [
  {
    label   : "Mild — Class VII",
    note    : "Safe for face/skin folds; long-term use",
    drugs   : ["Hydrocortisone 1%", "Hydrocortisone 2.5%", "Hydrocortisone acetate 1%"],
  },
  {
    label   : "Low–Moderate — Class V–VI",
    note    : "Thin or sensitive skin; mild psoriasis",
    drugs   : ["Desonide 0.05%", "Fluocinolone acetonide 0.01%", "Alclometasone dipropionate 0.05%"],
  },
  {
    label   : "Medium — Class IV–V",
    note    : "Most common for body plaques",
    drugs   : ["Mometasone furoate 0.1%", "Triamcinolone acetonide 0.1%",
               "Fluticasone propionate 0.05%", "Betamethasone valerate 0.12%"],
  },
  {
    label   : "High — Class II–III",
    note    : "Thick plaques on trunk/limbs",
    drugs   : ["Fluocinonide 0.05%", "Betamethasone dipropionate 0.05%",
               "Desoximetasone 0.25%", "Halcinonide 0.1%"],
  },
  {
    label   : "Ultra-High — Class I",
    note    : "Short-term only; scalp/palms/soles",
    drugs   : ["Clobetasol propionate 0.05%", "Halobetasol propionate 0.05%",
               "Betamethasone dipropionate (augmented) 0.05%", "Diflorasone diacetate 0.05%"],
  },
];

export const BIOLOGIC_CLASSES = [
  {
    label : "TNF-α inhibitors",
    note  : "Oldest class (2004–); broad immune suppression",
    drugs : ["Adalimumab (Humira)", "Etanercept (Enbrel)", "Infliximab (Remicade)", "Certolizumab (Cimzia)"],
  },
  {
    label : "IL-12/23 inhibitor (anti-p40)",
    note  : "Targets both IL-12 and IL-23 pathways",
    drugs : ["Ustekinumab (Stelara)"],
  },
  {
    label : "IL-17A inhibitors",
    note  : "High PASI 90 rates; rapid onset",
    drugs : ["Secukinumab (Cosentyx)", "Ixekizumab (Taltz)"],
  },
  {
    label : "IL-17A/F inhibitor",
    note  : "Dual IL-17A and IL-17F blockade; newest approval (2023)",
    drugs : ["Bimekizumab (Bimzelx)"],
  },
  {
    label : "IL-23 inhibitors (anti-p19)",
    note  : "Highest PASI 90/100 rates; quarterly dosing after loading",
    drugs : ["Guselkumab (Tremfya)", "Risankizumab (Skyrizi)", "Tildrakizumab (Ilumya)"],
  },
];

// ── Render ────────────────────────────────────────────────────────────────────

export function renderTreatments() {
  const treatments = loadTreatments();
  const container  = document.getElementById("treatment-list");
  container.innerHTML = "";

  const active = treatments.filter(t => !t.stopDate);
  const past   = treatments.filter(t =>  t.stopDate);

  if (treatments.length === 0) {
    container.innerHTML = '<p class="empty-msg">No treatments logged yet.</p>';
    return;
  }

  if (active.length > 0) {
    container.appendChild(sectionHead("Active"));
    active.forEach((t, i) => container.appendChild(treatmentCard(t, treatments.indexOf(t))));
  }

  if (past.length > 0) {
    container.appendChild(sectionHead("Past"));
    past.forEach(t => container.appendChild(treatmentCard(t, treatments.indexOf(t))));
  }

  // Event delegation for stop / delete buttons.
  // Bind ONCE: renderTreatments() runs on every tab-open, save, stop and delete,
  // but the #treatment-list element itself persists (only its innerHTML is
  // replaced). Attaching the listener here each call would stack a new one every
  // render, so a single click would fire the handler N times. The dataset guard
  // ensures exactly one listener for the life of the page.
  if (!container.dataset.bound) {
    container.dataset.bound = "1";
    container.addEventListener("click", function (e) {
      const stopBtn = e.target.closest(".btn-stop-treatment");
      const delBtn  = e.target.closest(".btn-del-treatment");
      if (!stopBtn && !delBtn) return;

      const idx = parseInt((stopBtn || delBtn).dataset.idx);
      const ts  = loadTreatments();

      if (stopBtn) {
        ts[idx].stopDate = new Date().toISOString().split("T")[0];
        saveTreatments(ts);
        renderTreatments();
      }
      if (delBtn) {
        if (confirm("Delete this treatment record?")) {
          ts.splice(idx, 1);
          saveTreatments(ts);
          renderTreatments();
        }
      }
    });
  }
}

function sectionHead(text) {
  const h = document.createElement("p");
  h.className = "treatment-section-head";
  h.textContent = text;
  return h;
}

function treatmentCard(t, idx) {
  const isTopical = t.type === "topical";
  const color = treatmentColor(idx);   // same colour this treatment gets in Trends

  const card = document.createElement("div");
  card.className = "treatment-card treatment-card--" + (isTopical ? "topical" : "biologic");
  // Border encodes treatment identity (matches its Trends band); the badge below
  // still encodes type. Inline CSSOM is fine under our CSP (only markup style="" / <style> are blocked).
  card.style.borderLeftColor = color;

  const header = document.createElement("div");
  header.className = "treatment-card-header";

  // Colour swatch — same rounded-square mark used in the Trends band legend.
  const swatch = document.createElement("span");
  swatch.className = "treatment-swatch";
  swatch.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 12 12">'
    + '<rect x="1" y="1" width="10" height="10" rx="3" fill="' + color + '" fill-opacity="0.25"/>'
    + '<rect x="1" y="1" width="10" height="3.2" rx="1.6" fill="' + color + '"/>'
    + '</svg>';
  header.appendChild(swatch);

  const badge = document.createElement("span");
  badge.className = "treatment-badge treatment-badge--" + (isTopical ? "topical" : "biologic");
  badge.textContent = isTopical ? "Topical" : "Biologic";
  header.appendChild(badge);

  const name = document.createElement("span");
  name.className = "treatment-name";
  name.textContent = t.drug;
  header.appendChild(name);

  const del = document.createElement("button");
  del.className = "delete-btn btn-del-treatment";
  del.textContent = "✕";
  del.dataset.idx = idx;
  header.appendChild(del);
  card.appendChild(header);

  const meta = document.createElement("div");
  meta.className = "treatment-meta";
  const classLabel = isTopical
    ? TOPICAL_CLASSES.find(c => c.label === t.potencyClass)?.label || t.potencyClass
    : BIOLOGIC_CLASSES.find(c => c.label === t.biologicClass)?.label || t.biologicClass;
  meta.textContent = classLabel;
  card.appendChild(meta);

  if (t.bodyAreas && t.bodyAreas.length > 0) {
    const areas = document.createElement("div");
    areas.className = "treatment-areas";
    areas.textContent = "Areas: " + t.bodyAreas.join(", ");
    card.appendChild(areas);
  }

  const dates = document.createElement("div");
  dates.className = "treatment-dates";
  dates.textContent = "Started " + t.startDate + (t.stopDate ? "  →  Stopped " + t.stopDate : "  →  Ongoing");
  card.appendChild(dates);

  if (t.notes) {
    const notes = document.createElement("div");
    notes.className = "treatment-notes";
    notes.textContent = t.notes;
    card.appendChild(notes);
  }

  if (!t.stopDate) {
    const stopBtn = document.createElement("button");
    stopBtn.className = "btn-stop-treatment";
    stopBtn.textContent = "Mark as stopped today";
    stopBtn.dataset.idx = idx;
    card.appendChild(stopBtn);
  }

  return card;
}

// ── Add-treatment form ────────────────────────────────────────────────────────

export function initTreatmentForm() {
  const form        = document.getElementById("treatment-form");
  const typeInputs  = form.querySelectorAll("input[name='treatType']");
  const topicalSec  = document.getElementById("topical-fields");
  const biologicSec = document.getElementById("biologic-fields");
  const potencyEl   = document.getElementById("treatPotency");
  const drugTopEl   = document.getElementById("treatDrugTopical");
  const bioClassEl  = document.getElementById("treatBioClass");
  const drugBioEl   = document.getElementById("treatDrugBiologic");
  const cancelBtn   = document.getElementById("btnTreatCancel");
  const saveBtn     = document.getElementById("btnTreatSave");

  // Populate potency class dropdown
  TOPICAL_CLASSES.forEach(function (c, i) {
    const opt = document.createElement("option");
    opt.value = c.label;
    opt.textContent = c.label;
    potencyEl.appendChild(opt);
  });

  // Populate biologic class dropdown
  BIOLOGIC_CLASSES.forEach(function (c) {
    const opt = document.createElement("option");
    opt.value = c.label;
    opt.textContent = c.label;
    bioClassEl.appendChild(opt);
  });

  // Show/hide sections on type change
  typeInputs.forEach(function (radio) {
    radio.addEventListener("change", function () {
      const isTopical = radio.value === "topical";
      topicalSec.style.display  = isTopical ? "block" : "none";
      biologicSec.style.display = isTopical ? "none"  : "block";
    });
  });

  // Update drug dropdown when potency class changes
  potencyEl.addEventListener("change", function () {
    populateDrugs(drugTopEl, TOPICAL_CLASSES, potencyEl.value);
  });
  bioClassEl.addEventListener("change", function () {
    populateDrugs(drugBioEl, BIOLOGIC_CLASSES, bioClassEl.value);
  });

  // Initialise drug dropdowns
  populateDrugs(drugTopEl, TOPICAL_CLASSES, TOPICAL_CLASSES[0].label);
  potencyEl.value = TOPICAL_CLASSES[0].label;
  populateDrugs(drugBioEl, BIOLOGIC_CLASSES, BIOLOGIC_CLASSES[0].label);
  bioClassEl.value = BIOLOGIC_CLASSES[0].label;

  cancelBtn.addEventListener("click", closeForm);

  saveBtn.addEventListener("click", function () {
    const isTopical = form.querySelector("input[name='treatType']:checked").value === "topical";
    const startDate = document.getElementById("treatStart").value;
    const stopDate  = document.getElementById("treatStop").value || null;

    if (!startDate) { alert("Please enter a start date."); return; }
    if (!isTopical && !bioClassEl.value) { alert("Please select a biologic class."); return; }

    const treatment = {
      id          : Date.now().toString(),
      type        : isTopical ? "topical" : "biologic",
      potencyClass: isTopical ? potencyEl.value  : null,
      biologicClass: !isTopical ? bioClassEl.value : null,
      drug        : isTopical ? drugTopEl.value   : drugBioEl.value,
      bodyAreas   : isTopical
        ? Array.from(document.querySelectorAll(".treat-area-cb:checked")).map(cb => cb.value)
        : [],
      startDate,
      stopDate,
      notes       : document.getElementById("treatNotes").value.trim(),
    };

    const ts = loadTreatments();
    ts.push(treatment);
    saveTreatments(ts);
    closeForm();
    renderTreatments();
  });

  function closeForm() {
    form.style.display = "none";
    document.getElementById("btnAddTopical").style.display  = "inline-block";
    document.getElementById("btnAddBiologic").style.display = "inline-block";
    form.reset();
    topicalSec.style.display  = "block";
    biologicSec.style.display = "none";
    populateDrugs(drugTopEl, TOPICAL_CLASSES, TOPICAL_CLASSES[0].label);
    potencyEl.value = TOPICAL_CLASSES[0].label;
  }

  document.getElementById("btnAddTopical").addEventListener("click", function () {
    openForm("topical");
  });
  document.getElementById("btnAddBiologic").addEventListener("click", function () {
    openForm("biologic");
  });

  function openForm(type) {
    document.getElementById("btnAddTopical").style.display  = "none";
    document.getElementById("btnAddBiologic").style.display = "none";
    form.style.display = "block";
    form.querySelector("input[value='" + type + "']").checked = true;
    topicalSec.style.display  = type === "topical"  ? "block" : "none";
    biologicSec.style.display = type === "biologic" ? "block" : "none";
    document.getElementById("treatStart").value = new Date().toISOString().split("T")[0];
  }
}

function populateDrugs(selectEl, classes, classLabel) {
  selectEl.innerHTML = "";
  const cls = classes.find(c => c.label === classLabel);
  if (!cls) return;
  cls.drugs.forEach(function (d) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    selectEl.appendChild(opt);
  });
}
