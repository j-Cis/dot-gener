// @project-metadata
// Path: site/client/Svg.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { DOPASOWANIA, type SvgRegistryKey } from "@/site/client/registries/for-island-svg.ts";
import { usePanZoom } from "@/site/common/util/usePanZoom.ts";

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
    const content = useRef<HTMLDivElement>(null);

    const apply = () => {
      const { x, y, s } = pz.view.current;
      if (content.current) {
        content.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      }
    };

    const pz = usePanZoom({ minScale, maxScale, onChange: apply });

    const fit = () => {
      const c = content.current;
      if (c) pz.fitTo(c.offsetWidth, c.offsetHeight);
    };

    useEffect(() => {
      fit();
      if (!registryKey) return;
      document.fonts.ready.then(() => {
        const svg = content.current?.querySelector<SVGSVGElement>("svg");
        if (!svg) return;
        const dopasuj = DOPASOWANIA[registryKey];
        if (dopasuj) dopasuj(svg);
        else console.warn(`Svg: nieznany registryKey="${registryKey}"`);
      });
    }, [registryKey]);

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

          <div ref={content} class="box-svg-content">{children}</div>
        </div>
      </div>
    );
  },
);
