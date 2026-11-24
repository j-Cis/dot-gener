import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { RYSUNKI } from "@/site/scripts/registries/for-island-canvas.ts";
import type { BoxLength } from "./Svg.island.tsx";

export interface CanvasView {
  x: number;
  y: number;
  s: number;
}

export interface CanvasDrawContext {
  ctx: CanvasRenderingContext2D;
  view: CanvasView;
  /** Rozmiar płótna w pikselach CSS. */
  width: number;
  height: number;
  dpr: number;
  dane?: unknown;
}

export type CanvasDrawer = (c: CanvasDrawContext) => void;

export interface CanvasProps {
  /** Nazwa funkcji rysującej zarejestrowanej w scripts/rysunki.ts. */
  registryKey: string;
  /** Opcjonalne dane przekazywane do funkcji rysującej (muszą być serializowalne). */
  dane?: unknown;
  /** Logiczne wymiary sceny (używane przez fit() do wyśrodkowania i skalowania). */
  sceneWidth: number;
  sceneHeight: number;
  /** Tło stołu, dowolny kolor CSS. */
  background?: string;
  /** Szerokość kontenera. Domyślnie "100%". */
  width?: BoxLength;
  /** Wysokość kontenera. Domyślnie "100%" z min-height 200px. */
  height?: BoxLength;
  /** Limity powiększenia względem widoku dopasowanego. Domyślnie 0.1 … 50. */
  minScale?: number;
  maxScale?: number;
}

/** Zmiana zoomu na piksel rolki (wykładnicza, symetryczna w obie strony). */
const ZOOM_SPEED = 0.0015;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Stół pan & zoom oparty o <canvas>:
 * rolka / pinch → zoom pod kursorem, przeciąganie → przesuwanie, dwuklik → fit.
 *
 * Scena rysowana jest w układzie logicznym (sceneWidth × sceneHeight) —
 * transformacja widoku (translate + scale) oraz DPR są nakładane automatycznie.
 */
export default island(
  import.meta.url,
  function Canvas(
    {
      registryKey,
      dane,
      sceneWidth,
      sceneHeight,
      background,
      width = "100%",
      height,
      minScale = 0.1,
      maxScale = 50,
    }: CanvasProps,
  ) {
    const box = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const view = useRef<CanvasView>({ x: 0, y: 0, s: 1 });
    const fitScale = useRef(1);
    const drag = useRef<{ id: number; x: number; y: number } | null>(null);
    const raf = useRef<number | null>(null);

    const draw = () => {
      raf.current = null;
      const b = box.current, el = canvas.current;
      if (!b || !el) return;

      const ctx = el.getContext("2d");
      if (!ctx) return;

      const drawer = RYSUNKI[registryKey];
      if (!drawer) {
        console.warn(`Canvas: nieznany registryKey="${registryKey}"`);
        return;
      }

      const dpr = globalThis.devicePixelRatio || 1;
      const w = b.clientWidth;
      const h = b.clientHeight;
      const pw = Math.max(1, Math.round(w * dpr));
      const ph = Math.max(1, Math.round(h * dpr));

      if (el.width !== pw || el.height !== ph) {
        el.width = pw;
        el.height = ph;
      }

      const v = view.current;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // układ sceny: najpierw przesunięcie w px CSS, potem skala
      ctx.translate(v.x, v.y);
      ctx.scale(v.s, v.s);

      drawer({ ctx, view: v, width: w, height: h, dpr, dane });
      ctx.restore();
    };

    const scheduleDraw = () => {
      if (raf.current === null) {
        raf.current = requestAnimationFrame(draw);
      }
    };

    /** Dopasuj i wyśrodkuj scenę w kontenerze. */
    const fit = () => {
      const b = box.current;
      if (!b || !sceneWidth || !sceneHeight) return;
      const s = Math.min(
        b.clientWidth / sceneWidth,
        b.clientHeight / sceneHeight,
      );
      fitScale.current = s;
      view.current = {
        s,
        x: (b.clientWidth - sceneWidth * s) / 2,
        y: (b.clientHeight - sceneHeight * s) / 2,
      };
      scheduleDraw();
    };

    useEffect(() => {
      const b = box.current;
      if (!b) return;

      fit();
      // przerysuj po załadowaniu czcionek (istotne dla fillText na canvasie)
      document.fonts.ready.then(scheduleDraw);

      const ro = new ResizeObserver(() => scheduleDraw());
      ro.observe(b);

      return () => {
        ro.disconnect();
        if (raf.current !== null) cancelAnimationFrame(raf.current);
      };
    }, [registryKey, dane, sceneWidth, sceneHeight]);

    const onWheel = (e: WheelEvent) => {
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
      scheduleDraw();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      box.current?.setPointerCapture(e.pointerId);
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || d.id !== e.pointerId) return;
      view.current.x += e.clientX - d.x;
      view.current.y += e.clientY - d.y;
      d.x = e.clientX;
      d.y = e.clientY;
      scheduleDraw();
    };

    const onPointerEnd = (e: PointerEvent) => {
      if (drag.current?.id === e.pointerId) drag.current = null;
    };

    return (
      <div class="svg-box">
        <div
          ref={box}
          class="box-svg"
          style={{
            background,
            width,
            height: height ?? "100%",
            minHeight: height ? undefined : "200px",
          }}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onDblClick={fit}
        >
          <canvas ref={canvas} class="box-canvas" />
        </div>
      </div>
    );
  },
);
