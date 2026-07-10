// Pure scoring functions — no DOM, no side effects.
// These are the functions we unit-test with Vitest.

export function getSeverityLabel(score) {
  if (score === 0) return "Clear";
  if (score <= 3)  return "Mild";
  if (score <= 5)  return "Moderate";
  return "Severe";
}

export function isFlareDay(score) {
  return score >= 7;
}

// Pearson correlation coefficient between two arrays of equal length.
// Returns null when fewer than 3 pairs — not enough data to be meaningful.
export function pearsonR(xs, ys) {
  const n = xs.length;
  if (n < 3) return null;
  const mx = xs.reduce((a, b) => a + b) / n;
  const my = ys.reduce((a, b) => a + b) / n;
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const dx  = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
  const dy  = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return (dx * dy === 0) ? 0 : num / (dx * dy);
}

// Returns a CSS class name for a correlation cell (defined in main.css).
// Using classes instead of inline styles keeps CSP happy.
export function corrClass(r) {
  if (r === null) return "corr-nil";
  if (r >=  0.5)  return "corr-sp";   // strong positive
  if (r >=  0.2)  return "corr-mp";   // moderate positive
  if (r <= -0.5)  return "corr-sn";   // strong negative
  if (r <= -0.2)  return "corr-mn";   // moderate negative
  return "corr-w";                    // weak / none
}
