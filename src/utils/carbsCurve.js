export const SLOTS = 24;
export const STEP_MINUTES = 60;

export function defaultCurve(value) {
  return new Array(SLOTS).fill(value);
}

export function round1(x) {
  return Math.round(x * 10) / 10;
}

export function snap05(x) {
  return Math.round(x * 2) / 2;
}

export function clamp(x, min, max) {
  return Math.min(max, Math.max(min, x));
}

// Genera marcas "redondas" (1, 2, 2.5, 5 × 10^n) que cubren [min, max].
export function niceTicks(min, max, targetCount = 10) {
  if (!(max > min)) return [min];
  const rawStep = (max - min) / Math.max(1, targetCount - 1);
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const fractions = [1, 2, 2.5, 5, 10];
  let stepFrac = fractions[fractions.length - 1];
  for (const f of fractions) {
    if (norm <= f) { stepFrac = f; break; }
  }
  const step = stepFrac * mag;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  const startIdx = Math.round(start / step);
  const endIdx = Math.round(end / step);
  for (let k = startIdx; k <= endIdx; k++) {
    ticks.push(Math.round(k * step * 1e6) / 1e6);
  }
  return ticks;
}

export function timeToHours(date) {
  return date.getHours() + date.getMinutes() / 60;
}

export function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatOffset(minutes) {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}:${String(m).padStart(2, '0')}`;
}

// Pendientes de interpolación cúbica monótona (Fritsch–Carlson).
// Garantiza que la curva no sobrepase los valores de los puntos entre los que
// interpola (sin sobrepicos ni saltos).
export function computeMonotoneSlopes(values, h = 1) {
  const n = values.length;
  const m = new Array(n).fill(0);
  if (n < 2) return m;

  const d = new Array(n - 1);
  for (let i = 0; i < n - 1; i++) d[i] = (values[i + 1] - values[i]) / h;

  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = (d[i - 1] + d[i]) / 2;

  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / d[i];
      const b = m[i + 1] / d[i];
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        m[i] = tau * a * d[i];
        m[i + 1] = tau * b * d[i];
      }
    }
  }
  return m;
}

let _curveCache = null;

// Interpolación cúbica monótona (Hermite) del valor a una hora dada (0..24).
// El segmento de cierre (23:00 -> 24:00/00:00) se interpola de forma lineal
// para evitar sobrepicos en el salto de medianoche.
export function curveValueAt(curve, hours) {
  const n = curve.length;
  if (!n) return 0;
  const hh = 24 / n;
  const h = ((hours % 24) + 24) % 24;
  const i = Math.min(n - 1, Math.floor(h / hh));
  const u = (h - i * hh) / hh;
  const j = (i + 1) % n;

  const p0 = curve[i];
  const p1 = curve[j];

  if (i === n - 1) {
    if (_curveCache && _curveCache.closing && _curveCache.h === h && _curveCache.p0 === p0 && _curveCache.p1 === p1) {
      return _curveCache.value;
    }
    const value = p0 + u * (p1 - p0);
    _curveCache = { closing: true, h, p0, p1, value };
    return value;
  }

  const pm1 = curve[(i - 1 + n) % n];
  const p2 = curve[(i + 2) % n];

  if (
    _curveCache &&
    !_curveCache.closing &&
    _curveCache.h === h &&
    _curveCache.pm1 === pm1 &&
    _curveCache.p0 === p0 &&
    _curveCache.p1 === p1 &&
    _curveCache.p2 === p2
  ) {
    return _curveCache.value;
  }

  const m = computeMonotoneSlopes(curve, hh);
  const t = u;
  const h00 = 2 * t * t * t - 3 * t * t + 1;
  const h10 = t * t * t - 2 * t * t + t;
  const h01 = -2 * t * t * t + 3 * t * t;
  const h11 = t * t * t - t * t;
  const value = h00 * p0 + h10 * hh * m[i] + h01 * p1 + h11 * hh * m[j];

  _curveCache = { closing: false, h, pm1, p0, p1, p2, value };
  return value;
}
