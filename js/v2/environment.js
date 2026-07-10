// Geolocation + Open-Meteo weather/air-quality fetch.
// Privacy: coordinates are rounded to 1 decimal place (~11 km) and never stored.

import { WMO } from './data.js';

let currentEnv = null;

export function getCurrentEnv() { return currentEnv; }
export function clearEnv()      { currentEnv = null; }

export function getSeason(date) {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return "Spring";
  if (m >= 6 && m <= 8) return "Summer";
  if (m >= 9 && m <= 11) return "Autumn";
  return "Winter";
}

// Returns a CSS class based on whether the air-quality value is good/moderate/poor.
export function aqClass(value, good, moderate) {
  if (value == null)     return "";
  if (value <= good)     return "good";
  if (value <= moderate) return "moderate";
  return "poor";
}

function envChip(text, cls) {
  return '<span class="env-chip ' + cls + '">' + text + '</span>';
}

// Sets up the Fetch button. `onFetched` is called after a successful fetch
// so main.js can trigger a summary update if the review panel is already open.
export function initEnvFetch(dateInputEl, envDisplayEl, btnFetchEl, onFetched) {
  btnFetchEl.addEventListener("click", function () {
    if (!navigator.geolocation) {
      envDisplayEl.innerHTML = '<span class="env-error">Geolocation not supported by this browser.</span>';
      return;
    }
    btnFetchEl.disabled = true;
    btnFetchEl.textContent = "Fetching…";

    navigator.geolocation.getCurrentPosition(
      async function (pos) {
        // Round to 1 decimal place (~11 km precision) — enough for city air quality
        const lat = Math.round(pos.coords.latitude  * 10) / 10;
        const lon = Math.round(pos.coords.longitude * 10) / 10;

        try {
          const [wRes, aqRes] = await Promise.all([
            fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon
                + "&current=temperature_2m,relative_humidity_2m,weather_code,precipitation"),
            fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=" + lat + "&longitude=" + lon
                + "&current=pm2_5,pm10,nitrogen_dioxide"),
          ]);
          const w  = await wRes.json();
          const aq = await aqRes.json();

          // Only the fetched measurements go into currentEnv — coordinates are discarded
          currentEnv = {
            temperature : w.current.temperature_2m,
            humidity    : w.current.relative_humidity_2m,
            weatherCode : w.current.weather_code,
            weatherDesc : WMO[w.current.weather_code] || "Unknown",
            precipitation: w.current.precipitation,
            pm25        : Math.round(aq.current.pm2_5            * 10) / 10,
            pm10        : Math.round(aq.current.pm10             * 10) / 10,
            no2         : Math.round(aq.current.nitrogen_dioxide * 10) / 10,
            season      : getSeason(new Date(dateInputEl.value)),
          };

          envDisplayEl.innerHTML =
              envChip(currentEnv.weatherDesc, "") +
              envChip("🌡️ " + currentEnv.temperature + "°C", "") +
              envChip("💧 " + currentEnv.humidity + "% RH", "") +
              envChip("PM2.5 " + currentEnv.pm25, aqClass(currentEnv.pm25, 15, 35)) +
              envChip("PM10 "  + currentEnv.pm10, aqClass(currentEnv.pm10, 45, 75)) +
              envChip("NO₂ "   + currentEnv.no2,  aqClass(currentEnv.no2,  25, 50)) +
              envChip(currentEnv.season, "");

          onFetched();

        } catch (_err) {
          envDisplayEl.innerHTML = '<span class="env-error">Fetch failed — check your connection.</span>';
        }

        btnFetchEl.disabled = false;
        btnFetchEl.textContent = "📍 Fetch weather & air quality";
      },
      function (_err) {
        envDisplayEl.innerHTML = '<span class="env-error">Location access denied.</span>';
        btnFetchEl.disabled = false;
        btnFetchEl.textContent = "📍 Fetch weather & air quality";
      },
      { timeout: 10000 }
    );
  });
}
