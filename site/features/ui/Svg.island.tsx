import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { DOPASOWANIA, type SvgRegistryKey } from "@/site/scripts/registries/for-island-svg.ts";

/** CSS length for the box size. */
export type BoxLength = `${number}${"rem" | "em" | "px" | "%" | "vw" | "vh"}`;

export interface SvgProps {
  /** SVG markup; rendered on the server, kept as-is in the browser. */
  children: ComponentChildren;
  /** Opcjonalny klucz dopasowania z rejestru SVG. */
  registryKey?: SvgRegistryKey;
  /** Canvas background, any CSS color. */
  background?: string;
  /** Box width. Default "100%". */
  width?: BoxLength;
  /**
   * Box height. Default "100%" with min-height 200px; filling the height
   * needs a parent that has a height.
   */
  height?: BoxLength;
  /** Zoom limits, relative to the fitted view. Default 0.1 … 50. */
  minScale?: number;
  maxScale?: number;
}

/** Zoom change per wheel pixel (exponential, so in and out are symmetric). */
const ZOOM_SPEED = 0.0015;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Pan & zoom canvas for SVG:
 * wheel / trackpad pinch → zoom at the cursor, drag → pan, double-click → fit.
 *
 * The SVG stays static server-rendered HTML. If it needs a browser-side
 * fix-up (e.g. positions that depend on the font), it says so itself:
 * <svg data-dopasuj="name">, with `name` registered in scripts/dopasowania.ts.
 */
export default island(
  import.meta.url,
  function Svg(
    {
      children,
      registryKey,
      background,
      width = "100%",
      height,
      minScale = 0.1,
      maxScale = 50,
    }: SvgProps,
  ) {
    const box = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLDivElement>(null);
    // translate(x, y) in px, then scale(s); changed directly on the DOM,
    // so panning/zooming never re-renders the (possibly large) SVG.
    const view = useRef({ x: 0, y: 0, s: 1 });
    const fitScale = useRef(1);
    const drag = useRef<{ id: number; x: number; y: number } | null>(null);

    const apply = () => {
      const { x, y, s } = view.current;
      if (content.current) {
        content.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      }
    };

    /** Scale and center the content so it fits the box. */
    const fit = () => {
      const b = box.current, c = content.current;
      if (!b || !c || !c.offsetWidth || !c.offsetHeight) return;
      const s = Math.min(
        b.clientWidth / c.offsetWidth,
        b.clientHeight / c.offsetHeight,
      );
      fitScale.current = s;
      view.current = {
        s,
        x: (b.clientWidth - c.offsetWidth * s) / 2,
        y: (b.clientHeight - c.offsetHeight * s) / 2,
      };
      apply();
    };

    useEffect(() => {
      fit();
      if (!registryKey) return;
      // fix-ups requested by the SVGs inside (data-dopasuj), after fonts load
      document.fonts.ready.then(() => {
        const svg = content.current?.querySelector<SVGSVGElement>("svg");
        if (!svg) return;
        const dopasuj = DOPASOWANIA[registryKey];
        if (dopasuj) dopasuj(svg);
        else console.warn(`Svg: nieznany registryKey="${registryKey}"`);
      });
    }, [registryKey]);

    const onWheel = (e: WheelEvent) => {
      const b = box.current;
      if (!b) return;
      e.preventDefault();
      const r = b.getBoundingClientRect();
      // deltaMode: 0 = px, 1 = lines (e.g. Firefox + mouse wheel), 2 = pages
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * r.height : e.deltaY;
      const v = view.current;
      const s = clamp(
        v.s * Math.exp(-dy * ZOOM_SPEED),
        fitScale.current * minScale,
        fitScale.current * maxScale,
      );
      const k = s / v.s, px = e.clientX - r.left, py = e.clientY - r.top;
      // keep the point under the cursor in place
      view.current = { s, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
      apply();
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
      apply();
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
          <div ref={content} class="box-svg-content">{children}</div>
        </div>
      </div>
    );
  },
);
