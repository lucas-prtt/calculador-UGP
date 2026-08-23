import { useRef, useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { snap05, clamp, curveValueAt, timeToHours, computeMonotoneSlopes } from '../utils/carbsCurve';

const STEP_PX = 48;
const M = { top: 22, right: 20, bottom: 34, left: 44 };
const MIN_HEIGHT = 320;

export default function CarbsCurveChart({ curve, maxValue, onChange }) {
  const { isDark } = useTheme();
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const [height, setHeight] = useState(480);
  const [dragging, setDragging] = useState(null);
  const curveRef = useRef(curve);
  curveRef.current = curve;
  const draggingRef = useRef(null);
  const pointerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const h = el.clientHeight;
      if (h > 0) setHeight(h);
    };
    update();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }
    window.addEventListener('resize', update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const n = curve.length;
  const W = n * STEP_PX + M.left + M.right;

  const safeMax = maxValue > 0 ? maxValue : 1;
  const plotW = W - M.left - M.right;
  const plotH = height - M.top - M.bottom;

  const xForHours = (hours) => M.left + hours * STEP_PX;
  const yForValue = (v) => M.top + (1 - clamp(v, 0, safeMax) / safeMax) * plotH;
  const valueForY = (y) => clamp((1 - (y - M.top) / plotH) * safeMax, 0, safeMax);

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryColor = '#8E8E93';
  const gridColor = isDark ? '#38383A' : '#E5E5EA';
  const accentColor = '#208AEF';
  const handleColor = isDark ? '#FFFFFF' : '#208AEF';

  const buildPath = () => {
    const m = computeMonotoneSlopes(curve);
    let d = '';
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const x0 = xForHours(i);
      const x1 = i === n - 1 ? xForHours(24) : xForHours(j);
      const y0 = yForValue(curve[i]);
      const y1 = yForValue(curve[j]);
      let cy0;
      let cy1;
      if (i === n - 1) {
        cy0 = y0 + (y1 - y0) / 3;
        cy1 = y1 - (y1 - y0) / 3;
      } else {
        cy0 = yForValue(curve[i] + m[i] / 3);
        cy1 = yForValue(curve[j] - m[j] / 3);
      }
      const cx0 = x0 + (x1 - x0) / 3;
      const cx1 = x1 - (x1 - x0) / 3;
      if (i === 0) d += `M ${x0.toFixed(2)} ${y0.toFixed(2)}`;
      d += ` C ${cx0.toFixed(2)} ${cy0.toFixed(2)}, ${cx1.toFixed(2)} ${cy1.toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    }
    return d;
  };

  const applyPointer = (clientY, index) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const y = ((clientY - rect.top) / rect.height) * height;
    const v = snap05(valueForY(y));
    onChange(curveRef.current.map((val, i) => (i === index ? v : val)));
  };

  const endDrag = () => {
    draggingRef.current = null;
    setDragging(null);
    const p = pointerRef.current;
    if (p) {
      try { p.element?.releasePointerCapture?.(p.pointerId); } catch {}
      pointerRef.current = null;
    }
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  };

  const handlePointerDown = (index) => (e) => {
    e.preventDefault();
    const el = e.currentTarget;
    draggingRef.current = index;
    setDragging(index);
    try { el.setPointerCapture?.(e.pointerId); } catch {}
    pointerRef.current = { pointerId: e.pointerId, element: el };

    const onPointerMove = (ev) => {
      if (draggingRef.current == null) return;
      applyPointer(ev.clientY, draggingRef.current);
    };
    const onTouchMove = (ev) => {
      if (draggingRef.current == null) return;
      const t = ev.touches && ev.touches[0];
      if (t) applyPointer(t.clientY, draggingRef.current);
      if (ev.cancelable) ev.preventDefault();
    };
    const onEnd = () => endDrag();

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onEnd);
    window.addEventListener('pointercancel', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);

    cleanupRef.current = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };

    applyPointer(e.clientY, index);
  };

  const xTicks = Array.from({ length: 25 }, (_, i) => i);
  const yTicks = (() => {
    const arr = [];
    for (let v = 0; v <= safeMax + 1e-6; v += 5) arr.push(v);
    return arr;
  })();

  const nowHours = timeToHours(new Date());
  const nowX = xForHours(nowHours);
  const nowY = yForValue(curveValueAt(curve, nowHours));

  return (
    <div ref={wrapRef} style={{ height: '100%', width: W, minHeight: MIN_HEIGHT }}>
      <svg
        ref={svgRef}
        width={W}
        height={height}
        style={{ display: 'block', touchAction: dragging != null ? 'none' : 'auto' }}
      >
        {yTicks.map((v) => (
          <g key={v}>
            <line
              x1={M.left}
              y1={yForValue(v)}
              x2={W - M.right}
              y2={yForValue(v)}
              stroke={gridColor}
              strokeWidth={1}
            />
            <text
              x={M.left - 6}
              y={yForValue(v) + 3}
              fontSize={11}
              fill={textColor}
              textAnchor="end"
            >
              {Math.round(v * 10) / 10}
            </text>
          </g>
        ))}

        {xTicks.map((h) => (
          <text
            key={h}
            x={xForHours(h)}
            y={height - M.bottom + 17}
            fontSize={13}
            fontWeight={600}
            fill={textColor}
            textAnchor="middle"
          >
            {String(Math.floor(h)).padStart(2, '0')}:00
          </text>
        ))}

        <path
          d={buildPath()}
          fill="none"
          stroke={accentColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <line
          x1={nowX}
          y1={M.top}
          x2={nowX}
          y2={height - M.bottom}
          stroke={accentColor}
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.45}
        />
        <circle cx={nowX} cy={nowY} r={4} fill={accentColor} />

        {curve.map((v, i) => (
          <g key={i}>
            <circle
              cx={xForHours(i)}
              cy={yForValue(v)}
              r={16}
              fill="transparent"
              style={{ cursor: 'ns-resize', touchAction: 'none' }}
              onPointerDown={handlePointerDown(i)}
            />
            <circle
              cx={xForHours(i)}
              cy={yForValue(v)}
              r={dragging === i ? 8 : 6}
              fill={handleColor}
              stroke={isDark ? '#000000' : '#FFFFFF'}
              strokeWidth={1.5}
              pointerEvents="none"
            />
          </g>
        ))}

        <text x={W - M.right} y={M.top - 8} fontSize={10} fill={secondaryColor} textAnchor="end">
          G/U
        </text>
      </svg>
    </div>
  );
}
