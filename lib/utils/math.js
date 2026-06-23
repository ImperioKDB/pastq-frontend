// lib/utils/math.js
// Single source of truth for math symbol rendering.
// Import this in both app/questions/page.js and app/quiz/page.js.

export function renderMath(text) {
  if (!text) return text;
  return String(text)
    .replace(/\^-3/g, '\u207B\u00B3')
    .replace(/\^-2/g, '\u207B\u00B2')
    .replace(/\^-1/g, '\u207B\u00B9')
    .replace(/\^2/g, '\u00B2')
    .replace(/\^3/g, '\u00B3')
    .replace(/sqrt\(([^)]+)\)/g, '\u221A($1)')
    .replace(/_2/g, '\u2082')
    .replace(/_3/g, '\u2083')
    .replace(/\bpi\b/gi, '\u03C0')
    .replace(/\btheta\b/gi, '\u03B8')
    .replace(/\bdelta\b/gi, '\u03B4')
    .replace(/\bsigma\b/gi, '\u03C3')
    .replace(/\binfinity\b/gi, '\u221E');
}
