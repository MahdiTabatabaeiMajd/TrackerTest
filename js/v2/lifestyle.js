// Step button groups (Alcohol, Exercise) and Yes/No toggles (Smoking, Infection, Koebner).

export const ALCOHOL_LABELS  = ["None", "Light", "Moderate", "Heavy"];
export const EXERCISE_LABELS = ["None", "Light", "Moderate", "Intense"];

// Wires click behaviour for a step/toggle group.
// `onChanged` is called after any selection so main.js can trigger summary updates.
export function setupGroup(groupId, onChanged) {
  const group = document.getElementById(groupId);
  group.querySelectorAll("button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      group.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (onChanged) onChanged();
    });
  });
}

export function getGroupValue(groupId) {
  const active = document.getElementById(groupId).querySelector("button.active");
  return active ? parseInt(active.dataset.value) : 0;
}

// Reads all lifestyle fields and returns a plain object (safe to store in localStorage).
export function currentLifestyle() {
  return {
    stress    : parseInt(document.getElementById("stressSlider").value),
    sleepHours: parseFloat(document.getElementById("sleepSlider").value),
    alcohol   : getGroupValue("alcoholGroup"),
    exercise  : getGroupValue("exerciseGroup"),
    smoking   : getGroupValue("smokingGroup")   === 1,
    infection : getGroupValue("infectionGroup") === 1,
    koebner   : getGroupValue("koebnerGroup")   === 1,
  };
}

// Resets all lifestyle inputs to their defaults.
export function resetLifestyle() {
  document.getElementById("stressSlider").value = 0;
  document.getElementById("stressValue").textContent = "0 / 10";
  document.getElementById("sleepSlider").value = 7;
  document.getElementById("sleepValue").textContent = "7.0 h";

  ["alcoholGroup", "exerciseGroup", "smokingGroup", "infectionGroup", "koebnerGroup"].forEach(function (gid) {
    const btns = document.getElementById(gid).querySelectorAll("button");
    btns.forEach(b => b.classList.remove("active"));
    btns[0].classList.add("active");
  });
}
