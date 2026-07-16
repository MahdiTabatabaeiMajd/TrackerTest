// splash.js — FlareWatch V2 tracking-themed splash screen.
//
// Concept: a symptom-severity trend line draws itself across a faint chart
// grid — exactly what the app is about. The curve rises into a "flare" and
// then settles down (improvement), an intentionally hopeful shape for a
// disease-tracking tool. Colours follow the app's indigo→violet→fuchsia theme.

export function initSplash() {
  const splashEl = document.getElementById('splash-screen');
  const canvas   = document.getElementById('splash-canvas');
  if (!splashEl || !canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() {
    W = canvas.width  = innerWidth;
    H = canvas.height = innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Normalised severity series (0 = clear, 1 = severe). Rises to a flare,
  // then trends downward — a "getting better" story.
  const series = [0.30, 0.42, 0.55, 0.68, 0.80, 0.72, 0.60, 0.66, 0.48, 0.34, 0.26, 0.20, 0.14, 0.12];
  const n = series.length;

  // Chart geometry — sits in the lower-middle so it never fights the title.
  function geom() {
    const padX   = W * 0.12;
    const chartW = W - padX * 2;
    const baseY  = H * 0.62;          // vertical centre of the plot
    const amp    = Math.min(H * 0.17, 150);
    return { padX, chartW, baseY, amp };
  }
  function xOf(i, g) { return g.padX + (i / (n - 1)) * g.chartW; }
  function yOf(v, g) { return g.baseY - (v - 0.5) * 2 * g.amp; }   // higher severity = higher up

  // Smooth ease so the line accelerates then settles.
  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const DRAW_DUR = 3.2;   // seconds for the line to finish drawing
  let start = null;

  function frame(ts) {
    if (start === null) start = ts;
    const elapsed = (ts - start) / 1000;
    const p = easeInOut(Math.min(elapsed / DRAW_DUR, 1));   // 0 → 1 draw progress
    const g = geom();

    ctx.clearRect(0, 0, W, H);

    // ── Faint chart grid ──────────────────────────────────────────────────
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    // horizontal lines
    for (let k = 0; k <= 4; k++) {
      const y = g.baseY - g.amp + (k / 4) * (2 * g.amp);
      ctx.beginPath(); ctx.moveTo(g.padX, y); ctx.lineTo(g.padX + g.chartW, y); ctx.stroke();
    }
    // vertical lines (one per "day")
    for (let i = 0; i < n; i++) {
      const x = xOf(i, g);
      ctx.beginPath(); ctx.moveTo(x, g.baseY - g.amp); ctx.lineTo(x, g.baseY + g.amp); ctx.stroke();
    }

    // ── Points revealed so far ────────────────────────────────────────────
    const fIndex = p * (n - 1);              // fractional index of the pen tip
    const whole  = Math.floor(fIndex);
    const frac   = fIndex - whole;

    const pts = [];
    for (let i = 0; i <= whole; i++) pts.push({ x: xOf(i, g), y: yOf(series[i], g) });
    // interpolated leading point
    let tipX, tipY;
    if (whole < n - 1) {
      const x0 = xOf(whole, g),     y0 = yOf(series[whole], g);
      const x1 = xOf(whole + 1, g), y1 = yOf(series[whole + 1], g);
      tipX = x0 + (x1 - x0) * frac;
      tipY = y0 + (y1 - y0) * frac;
      pts.push({ x: tipX, y: tipY });
    } else {
      tipX = xOf(n - 1, g); tipY = yOf(series[n - 1], g);
    }

    // ── Soft area fill under the drawn line ───────────────────────────────
    if (pts.length > 1) {
      const areaGrad = ctx.createLinearGradient(0, g.baseY - g.amp, 0, g.baseY + g.amp);
      areaGrad.addColorStop(0, 'rgba(232,121,249,0.22)');   // fuchsia top
      areaGrad.addColorStop(1, 'rgba(129,140,248,0.02)');   // indigo fade
      ctx.beginPath();
      ctx.moveTo(pts[0].x, g.baseY + g.amp);
      pts.forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(pts[pts.length - 1].x, g.baseY + g.amp);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();
    }

    // ── The trend line itself (glowing) ───────────────────────────────────
    if (pts.length > 1) {
      const lineGrad = ctx.createLinearGradient(g.padX, 0, g.padX + g.chartW, 0);
      lineGrad.addColorStop(0,   '#67e8f9');   // cyan-300
      lineGrad.addColorStop(0.5, '#5eead4');   // teal-300
      lineGrad.addColorStop(1,   '#6ee7b7');   // emerald-300
      ctx.save();
      ctx.shadowColor = 'rgba(45,212,191,0.55)';
      ctx.shadowBlur  = 16;
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth   = 3.5;
      ctx.lineJoin = ctx.lineCap = 'round';
      ctx.beginPath();
      pts.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
      ctx.stroke();
      ctx.restore();
    }

    // ── Data dots for fully-revealed days ─────────────────────────────────
    for (let i = 0; i <= whole && i < n; i++) {
      const x = xOf(i, g), y = yOf(series[i], g);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(45,212,191,0.8)'; ctx.stroke();
    }

    // ── Pulsing marker at the pen tip ─────────────────────────────────────
    const pulse = 1 + 0.35 * Math.sin(ts / 180);
    ctx.beginPath(); ctx.arc(tipX, tipY, 9 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(240,171,252,0.25)'; ctx.fill();
    ctx.beginPath(); ctx.arc(tipX, tipY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // ── Dismiss after 5 s (or on Skip) ──────────────────────────────────────
  function dismiss() {
    splashEl.style.opacity = '0';
    setTimeout(() => { splashEl.style.display = 'none'; }, 1000);
  }
  setTimeout(dismiss, 5000);
  document.getElementById('splashSkip')?.addEventListener('click', dismiss);
}
