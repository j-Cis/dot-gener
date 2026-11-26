// @project-metadata
// Path: site/client/AsCanvasView.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { RYSUNKI } from "@/site/client/registries/for-island-canvas.ts";
import { usePanZoom } from "@/site/common/util/usePanZoom.ts";
import type { BoxLength } from "./AsSvgView.island.tsx";

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
  /** Nazwa funkcji rysującej zarejestrowanej w registries/for-island-canvas.ts. */
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

export default island(
  import.meta.url,
  function AsCanvasView(
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
    const canvas = useRef<HTMLCanvasElement>(null);
    const raf = useRef<number | null>(null);

    const draw = () => {
      raf.current = null;
      const b = pz.box.current, el = canvas.current;
      if (!b || !el) return;

      const ctx = el.getContext("2d");
      if (!ctx) return;

      const drawer = RYSUNKI[registryKey];
      if (!drawer) {
        console.warn(`AsCanvasView: nieznany registryKey="${registryKey}"`);
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

      const v = pz.view.current;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

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

    const pz = usePanZoom({ minScale, maxScale, onChange: scheduleDraw });

    const fit = () => pz.fitTo(sceneWidth, sceneHeight);

    useEffect(() => {
      const b = pz.box.current;
      if (!b) return;

      fit();
      document.fonts.ready.then(scheduleDraw);

      const ro = new ResizeObserver(() => scheduleDraw());
      ro.observe(b);

      return () => {
        ro.disconnect();
        if (raf.current !== null) cancelAnimationFrame(raf.current);
      };
    }, [registryKey, dane, sceneWidth, sceneHeight]);

    return (
      <div class="svg-box">
        <div
          ref={pz.box}
          class={pz.locked ? "box-svg is-locked" : "box-svg"}
          style={{
            background,
            width,
            height: height ?? "100%",
            minHeight: height ? undefined : "200px",
          }}
          onWheel={pz.handlers.onWheel}
          onPointerDown={pz.handlers.onPointerDown}
          onPointerMove={pz.handlers.onPointerMove}
          onPointerUp={pz.handlers.onPointerEnd}
          onPointerCancel={pz.handlers.onPointerEnd}
          onDblClick={pz.locked ? undefined : fit}
        >
          <button
            type="button"
            class="box-svg-lock"
            aria-label={pz.locked ? "Odblokuj stół" : "Zablokuj stół"}
            title={pz.locked ? "Odblokuj przesuwanie i zoom" : "Zablokuj (przewijanie strony)"}
            onPointerDown={(e) => e.stopPropagation()}
            onDblClick={(e) => e.stopPropagation()}
            onClick={pz.toggleLock}
          >
            {pz.locked ? "🔒" : "🔓"}
          </button>

          <canvas ref={canvas} class="box-canvas" />
        </div>
      </div>
    );
  },
);
