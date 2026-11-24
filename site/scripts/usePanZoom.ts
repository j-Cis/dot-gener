import { useRef, useState } from "preact/hooks";

export interface PanZoomView {
  x: number;
  y: number;
  s: number;
}

interface UsePanZoomOptions {
  minScale: number;
  maxScale: number;
  defaultLocked?: boolean;
  onChange: () => void;
}

const ZOOM_SPEED = 0.0015;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function usePanZoom({
  minScale,
  maxScale,
  defaultLocked = true,
  onChange,
}: UsePanZoomOptions) {
  const box = useRef<HTMLDivElement>(null);
  const view = useRef<PanZoomView>({ x: 0, y: 0, s: 1 });
  const fitScale = useRef(1);
  const [locked, setLocked] = useState(defaultLocked);

  // Aktywne wskaźniki (mysz / palce) — pozwala obsłużyć 1 palec (pan) i 2 palce (pinch)
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; mx: number; my: number } | null>(null);

  const fitTo = (contentW: number, contentH: number) => {
    const b = box.current;
    if (!b || !contentW || !contentH) return;
    const s = Math.min(b.clientWidth / contentW, b.clientHeight / contentH);
    fitScale.current = s;
    view.current = {
      s,
      x: (b.clientWidth - contentW * s) / 2,
      y: (b.clientHeight - contentH * s) / 2,
    };
    onChange();
  };

  const toggleLock = () => {
    pointers.current.clear();
    pinch.current = null;
    setLocked((v) => !v);
  };

  const getPinchState = () => {
    const pts = [...pointers.current.values()];
    const p1 = pts[0], p2 = pts[1];
    if (!p1 || !p2) return null;
    return {
      dist: Math.hypot(p2.x - p1.x, p2.y - p1.y),
      mx: (p1.x + p2.x) / 2,
      my: (p1.y + p2.y) / 2,
    };
  };

  const onWheel = (e: WheelEvent) => {
    if (locked) return;
    const b = box.current;
    if (!b) return;
    e.preventDefault();
    const r = b.getBoundingClientRect();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * r.height : e.deltaY;
    const v = view.current;
    const s = clamp(
      v.s * Math.exp(-dy * ZOOM_SPEED),
      fitScale.current * minScale,
      fitScale.current * maxScale,
    );
    const k = s / v.s, px = e.clientX - r.left, py = e.clientY - r.top;
    view.current = { s, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
    onChange();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (locked) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    box.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    pinch.current = pointers.current.size === 2 ? getPinchState() : null;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (locked) return;
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;

    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    prev.x = e.clientX;
    prev.y = e.clientY;

    if (pointers.current.size === 1) {
      view.current.x += dx;
      view.current.y += dy;
      onChange();
    } else if (pointers.current.size === 2) {
      const b = box.current;
      const next = getPinchState();
      const old = pinch.current;
      if (!b || !next || !old || old.dist === 0) {
        pinch.current = next;
        return;
      }
      const r = b.getBoundingClientRect();
      const v = view.current;
      const s = clamp(
        v.s * (next.dist / old.dist),
        fitScale.current * minScale,
        fitScale.current * maxScale,
      );
      const k = s / v.s;
      const px = next.mx - r.left;
      const py = next.my - r.top;
      view.current = {
        s,
        x: px - (old.mx - r.left - v.x) * k,
        y: py - (old.my - r.top - v.y) * k,
      };
      pinch.current = next;
      onChange();
    }
  };

  const onPointerEnd = (e: PointerEvent) => {
    pointers.current.delete(e.pointerId);
    pinch.current = pointers.current.size === 2 ? getPinchState() : null;
  };

  return {
    box,
    view,
    locked,
    toggleLock,
    fitTo,
    handlers: {
      onWheel,
      onPointerDown,
      onPointerMove,
      onPointerEnd,
    },
  };
}
