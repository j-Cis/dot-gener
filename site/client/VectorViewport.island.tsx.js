// @project-metadata
// Path: site/client/VectorViewport.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "preact/jsx-runtime";
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { cx } from "@/site/common/css/cx.ts";
import { DOPASOWANIA } from "@/site/client/registries/for-island-svg.ts";
import { RYSUNKI } from "@/site/client/registries/for-island-canvas.ts";
import { usePanZoom } from "@/site/common/util/usePanZoom.ts";
import { renderDotxSvg } from "@/site/common/lang/dotx/render-svg.tsx";
import { drawDotxCanvas } from "@/site/common/lang/dotx/render-canvas.ts";
const kluczeRysunkow = Object.keys(RYSUNKI);
/** LOCI → SVG. Miejsce na silnik LOCI; dopóki nie ma znaczników, zgłasza błąd. */ function lociDoSvg(_tresc) {
  throw new Error("VectorViewport: LOCI nie ma jeszcze żadnego znacznika");
}
/** Źródło z atrybutu albo z dzieci; tekst w `source` = gotowe znaczniki SVG (np. plik .svg zaimportowany jako tekst). */ function zrodlo(p, format) {
  if (p.source !== undefined && p.children !== undefined) {
    throw new Error(`VectorViewport (${format}): źródło albo w source, albo jako dzieci — nie oba`);
  }
  if (typeof p.source === "string") return /*#__PURE__*/ _jsx("div", {
    style: "display:contents",
    dangerouslySetInnerHTML: {
      __html: p.source
    }
  });
  return p.source ?? p.children;
}
/** Serwer: wejście → propsy wyspy (bez funkcji i VNode w atrybutach). */ function przygotuj(p) {
  const okno = {
    renderer: p.renderer
  };
  if (p.background !== undefined) okno.background = p.background;
  if (p.width !== undefined) okno.width = p.width;
  if (p.height !== undefined) okno.height = p.height;
  if (p.minScale !== undefined) okno.minScale = p.minScale;
  if (p.maxScale !== undefined) okno.maxScale = p.maxScale;
  switch(p.sourceFormat){
    case "SVG":
    case "LOCI":
      {
        const svg = p.sourceFormat === "SVG" ? zrodlo(p, "SVG") : lociDoSvg(zrodlo(p, "LOCI"));
        okno.children = svg;
        if (p.renderer === "Canvas") okno.paint = [
          "SVG"
        ];
        else if (p.sourceFormat === "SVG" && p.adjust !== undefined) okno.adjust = p.adjust;
        return okno;
      }
    case "DOTX":
      if (p.renderer === "SVG") okno.children = renderDotxSvg(p.source);
      else {
        okno.paint = [
          "DOTX",
          p.source
        ];
        okno.scene = [
          p.source.width,
          p.source.height
        ];
      }
      return okno;
    case "CANVAS":
      {
        const rysunek = p.source;
        const klucz = kluczeRysunkow.find((k)=>RYSUNKI[k] === rysunek);
        if (klucz === undefined) {
          throw new Error(`VectorViewport: rysunek „${rysunek.name || "(bez nazwy)"}” nie jest w registries/for-island-canvas.ts (RYSUNKI) — przeglądarka go nie dostanie`);
        }
        okno.paint = [
          "RYSUNEK",
          klucz,
          p.data ?? null
        ];
        okno.scene = p.scene;
        return okno;
      }
  }
}
const LICZBA = /^\s*[\d.]+(px)?\s*$/;
/** Rozmiar SVG: atrybuty width/height (liczby), inaczej viewBox, inaczej domyślne 300×150 przeglądarki. */ function rozmiarSvg(svg) {
  const vb = (svg.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  const liczba = (a, zapas, domyslna)=>{
    const v = svg.getAttribute(a);
    return v !== null && LICZBA.test(v) ? parseFloat(v) : zapas ?? domyslna;
  };
  return [
    liczba("width", vb.length === 4 ? vb[2] : undefined, 300),
    liczba("height", vb.length === 4 ? vb[3] : undefined, 150)
  ];
}
/** Bez liczbowych width/height (brak albo %) SVG na stole nie ma rozmiaru — ustala go z viewBox. */ function ustalRozmiar(svg) {
  const r = rozmiarSvg(svg);
  if (!LICZBA.test(svg.getAttribute("width") ?? "") || !LICZBA.test(svg.getAttribute("height") ?? "")) {
    svg.setAttribute("width", String(r[0]));
    svg.setAttribute("height", String(r[1]));
  }
  return r;
}
export default island(import.meta.url, function VectorViewport({ renderer, children, adjust, paint, scene, background, width = "100%", height, minScale = 0.1, maxScale = 50 }) {
  const tresc = useRef(null);
  const plotno = useRef(null);
  const raf = useRef(null);
  /** SVG → Canvas: obraz z ukrytej treści i jego rozmiar. */ const obraz = useRef(null);
  const rozmiar = useRef(scene);
  const maluj = (m, c)=>{
    switch(m[0]){
      case "SVG":
        {
          const [w, h] = rozmiar.current ?? [
            0,
            0
          ];
          if (obraz.current) c.ctx.drawImage(obraz.current, 0, 0, w, h);
          return;
        }
      case "DOTX":
        drawDotxCanvas({
          ...c,
          dane: m[1]
        });
        return;
      case "RYSUNEK":
        {
          const rysunek = RYSUNKI[m[1]];
          if (rysunek) rysunek({
            ...c,
            dane: m[2]
          });
          else console.warn(`VectorViewport: brak rysunku „${m[1]}” w RYSUNKI`);
          return;
        }
    }
  };
  const rysuj = ()=>{
    raf.current = null;
    const b = pz.box.current, el = plotno.current;
    if (!b || !el || !paint) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const dpr = globalThis.devicePixelRatio || 1;
    const w = b.clientWidth, h = b.clientHeight;
    const pw = Math.max(1, Math.round(w * dpr)), ph = Math.max(1, Math.round(h * dpr));
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
    maluj(paint, {
      ctx,
      view: v,
      width: w,
      height: h,
      dpr
    });
    ctx.restore();
  };
  const zaplanuj = ()=>{
    if (raf.current === null) raf.current = requestAnimationFrame(rysuj);
  };
  /** SVG: przesuwa i skaluje treść; Canvas: rysuje od nowa. */ const zmiana = ()=>{
    if (renderer === "Canvas") return zaplanuj();
    const { x, y, s } = pz.view.current;
    if (tresc.current) tresc.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  };
  const pz = usePanZoom({
    minScale,
    maxScale,
    onChange: zmiana
  });
  const dopasuj = ()=>{
    if (renderer === "Canvas") {
      const r = rozmiar.current;
      if (r) pz.fitTo(r[0], r[1]);
      return;
    }
    const c = tresc.current;
    if (c) pz.fitTo(c.offsetWidth, c.offsetHeight);
  };
  // SVG: dopasowanie widoku i opcjonalne dopasowanie z rejestru
  useEffect(()=>{
    if (renderer !== "SVG") return;
    const svg = tresc.current?.querySelector("svg");
    if (svg) ustalRozmiar(svg);
    dopasuj();
    if (!adjust) return;
    document.fonts.ready.then(()=>{
      const svg = tresc.current?.querySelector("svg");
      if (!svg) return;
      const f = DOPASOWANIA[adjust];
      if (f) f(svg);
      else console.warn(`VectorViewport: nieznany adjust="${adjust}"`);
    });
  }, [
    renderer,
    adjust
  ]);
  // Canvas: obraz z SVG (gdy trzeba), dopasowanie, rysowanie przy zmianie rozmiaru
  useEffect(()=>{
    if (renderer !== "Canvas") return;
    const b = pz.box.current;
    if (!b) return;
    let adres = null;
    if (paint?.[0] === "SVG") {
      const svg = tresc.current?.querySelector("svg");
      if (svg) {
        // Obraz SVG nie wczytuje zasobów zewnętrznych (czcionek z sieci, obrazów) — tylko czcionki systemowe.
        const kopia = svg.cloneNode(true);
        const r = ustalRozmiar(kopia);
        adres = URL.createObjectURL(new Blob([
          new XMLSerializer().serializeToString(kopia)
        ], {
          type: "image/svg+xml"
        }));
        const img = new Image();
        img.onload = ()=>{
          obraz.current = img;
          rozmiar.current = r;
          dopasuj();
          zaplanuj();
        };
        img.src = adres;
      } else console.warn("VectorViewport: brak <svg> w źródle");
    }
    dopasuj();
    document.fonts.ready.then(zaplanuj);
    const ro = new ResizeObserver(()=>zaplanuj());
    ro.observe(b);
    return ()=>{
      ro.disconnect();
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      if (adres !== null) URL.revokeObjectURL(adres);
    };
  }, [
    renderer,
    paint,
    scene
  ]);
  return /*#__PURE__*/ _jsx("div", {
    class: "viewport",
    children: /*#__PURE__*/ _jsxs("div", {
      ref: pz.box,
      class: cx("viewport-stol", pz.locked && "is-locked"),
      style: {
        background,
        width,
        height: height ?? "100%",
        minHeight: height ? undefined : "200px"
      },
      onWheel: pz.handlers.onWheel,
      onPointerDown: pz.handlers.onPointerDown,
      onPointerMove: pz.handlers.onPointerMove,
      onPointerUp: pz.handlers.onPointerEnd,
      onPointerCancel: pz.handlers.onPointerEnd,
      onDblClick: pz.locked ? undefined : dopasuj,
      children: [
        /*#__PURE__*/ _jsx("button", {
          type: "button",
          class: "viewport-zamek",
          "aria-label": pz.locked ? "Odblokuj stół" : "Zablokuj stół",
          title: pz.locked ? "Odblokuj przesuwanie i zoom" : "Zablokuj (przewijanie strony)",
          onPointerDown: (e)=>e.stopPropagation(),
          onDblClick: (e)=>e.stopPropagation(),
          onClick: pz.toggleLock,
          children: pz.locked ? "🔒" : "🔓"
        }),
        renderer === "SVG" ? /*#__PURE__*/ _jsx("div", {
          ref: tresc,
          class: "viewport-tresc",
          children: children
        }) : /*#__PURE__*/ _jsxs(_Fragment, {
          children: [
            /*#__PURE__*/ _jsx("canvas", {
              ref: plotno,
              class: "viewport-plotno"
            }),
            children !== undefined && /*#__PURE__*/ _jsx("div", {
              ref: tresc,
              hidden: true,
              children: children
            })
          ]
        })
      ]
    })
  });
}, przygotuj);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudENoaWxkcmVuIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgeyBpc2xhbmQgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5pbXBvcnQgeyBjeCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2Nzcy9jeC50c1wiO1xuaW1wb3J0IHsgRE9QQVNPV0FOSUEsIHR5cGUgU3ZnUmVnaXN0cnlLZXkgfSBmcm9tIFwiQC9zaXRlL2NsaWVudC9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtc3ZnLnRzXCI7XG5pbXBvcnQgeyBSWVNVTktJIH0gZnJvbSBcIkAvc2l0ZS9jbGllbnQvcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50c1wiO1xuaW1wb3J0IHsgdXNlUGFuWm9vbSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL3V0aWwvdXNlUGFuWm9vbS50c1wiO1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbmVkR3JhcGggfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2RvdHgvbW9kZWwudHNcIjtcbmltcG9ydCB7IHJlbmRlckRvdHhTdmcgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2RvdHgvcmVuZGVyLXN2Zy50c3hcIjtcbmltcG9ydCB7IGRyYXdEb3R4Q2FudmFzIH0gZnJvbSBcIkAvc2l0ZS9jb21tb24vbGFuZy9kb3R4L3JlbmRlci1jYW52YXMudHNcIjtcblxuLyoqIENTUyBsZW5ndGggZm9yIHRoZSBib3ggc2l6ZS4gKi9cbmV4cG9ydCB0eXBlIEJveExlbmd0aCA9IGAke251bWJlcn0ke1wicmVtXCIgfCBcImVtXCIgfCBcInB4XCIgfCBcIiVcIiB8IFwidndcIiB8IFwidmhcIn1gO1xuXG4vKiogVGVjaG5vbG9naWEgd3nFm3dpZXRsYW5pYS4gKi9cbmV4cG9ydCB0eXBlIFJlbmRlcmVyID0gXCJTVkdcIiB8IFwiQ2FudmFzXCI7XG5cbi8qKiBMb2dpY3pueSByb3ptaWFyIHNjZW55IFtzemVyb2tvxZvEhywgd3lzb2tvxZvEh10g4oCUIGRvIGRvcGFzb3dhbmlhIHdpZG9rdSAoZml0KS4gKi9cbmV4cG9ydCB0eXBlIFNjZW5lU2l6ZSA9IHJlYWRvbmx5IFt3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FudmFzVmlldyB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBzOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FudmFzRHJhd0NvbnRleHQge1xuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgdmlldzogQ2FudmFzVmlldztcbiAgLyoqIFJvem1pYXIgcMWCw7N0bmEgdyBwaWtzZWxhY2ggQ1NTLiAqL1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgZHByOiBudW1iZXI7XG4gIGRhbmU/OiB1bmtub3duO1xufVxuXG4vKiogUnlzdW5layBDYW52YXM7IMW8ZWJ5IGR6aWHFgmHFgiB3IHByemVnbMSFZGFyY2UsIG11c2kgYnnEhyB3IHJlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHMgKFJZU1VOS0kpLiAqL1xuZXhwb3J0IHR5cGUgQ2FudmFzRHJhd2VyID0gKGM6IENhbnZhc0RyYXdDb250ZXh0KSA9PiB2b2lkO1xuXG5pbnRlcmZhY2UgQm94UHJvcHMge1xuICAvKiogVMWCbyBzdG/FgnUsIGRvd29sbnkga29sb3IgQ1NTLiAqL1xuICBiYWNrZ3JvdW5kPzogc3RyaW5nO1xuICAvKiogU3plcm9rb8WbxIcuIERvbXnFm2xuaWUgXCIxMDAlXCIuICovXG4gIHdpZHRoPzogQm94TGVuZ3RoO1xuICAvKiogV3lzb2tvxZvEhy4gRG9tecWbbG5pZSBcIjEwMCVcIiB6IG1pbi1oZWlnaHQgMjAwcHg7IHd5cGXFgm5pZW5pZSB3eW1hZ2Egcm9kemljYSB6IHd5c29rb8WbY2nEhS4gKi9cbiAgaGVpZ2h0PzogQm94TGVuZ3RoO1xuICAvKiogTGltaXR5IHBvd2nEmWtzemVuaWEgd3pnbMSZZGVtIHdpZG9rdSBkb3Bhc293YW5lZ28uIERvbXnFm2xuaWUgMC4xIOKApiA1MC4gKi9cbiAgbWluU2NhbGU/OiBudW1iZXI7XG4gIG1heFNjYWxlPzogbnVtYmVyO1xufVxuXG4vKiogxblyw7NkxYJvIHcgYXRyeWJ1Y2llIGBzb3VyY2VgIGFsYm8gamFrbyBkemllY2kg4oCUIGplZG5vIHogZHfDs2NoLiAqL1xudHlwZSBBdHJ5YnV0QWxib0R6aWVjaTxGIGV4dGVuZHMgc3RyaW5nLCBUPiA9XG4gIHwgeyBzb3VyY2VGb3JtYXQ6IEY7IHNvdXJjZTogVDsgY2hpbGRyZW4/OiBuZXZlciB9XG4gIHwgeyBzb3VyY2VGb3JtYXQ6IEY7IGNoaWxkcmVuOiBUOyBzb3VyY2U/OiBuZXZlciB9O1xuXG4vKiogxblyw7NkxYJvIHR5bGtvIHcgYXRyeWJ1Y2llIGBzb3VyY2VgLiAqL1xudHlwZSBBdHJ5YnV0PEYgZXh0ZW5kcyBzdHJpbmcsIFQ+ID0geyBzb3VyY2VGb3JtYXQ6IEY7IHNvdXJjZTogVDsgY2hpbGRyZW4/OiBuZXZlciB9O1xuXG5leHBvcnQgdHlwZSBWZWN0b3JWaWV3cG9ydFByb3BzID1cbiAgJiBCb3hQcm9wc1xuICAmIChcbiAgICB8IChBdHJ5YnV0QWxib0R6aWVjaTxcIlNWR1wiLCBDb21wb25lbnRDaGlsZHJlbj4gJiB7XG4gICAgICByZW5kZXJlcjogUmVuZGVyZXI7XG4gICAgICAvKiogRG9wYXNvd2FuaWUgeiByZWdpc3RyaWVzL2Zvci1pc2xhbmQtc3ZnLnRzLCB1cnVjaGFtaWFuZSB3IHByemVnbMSFZGFyY2UgKHR5bGtvIHJlbmRlcmVyIFNWRykuICovXG4gICAgICBhZGp1c3Q/OiBTdmdSZWdpc3RyeUtleTtcbiAgICB9KVxuICAgIHwgKEF0cnlidXRBbGJvRHppZWNpPFwiTE9DSVwiLCBDb21wb25lbnRDaGlsZHJlbj4gJiB7IHJlbmRlcmVyOiBSZW5kZXJlciB9KVxuICAgIHwgKEF0cnlidXQ8XCJET1RYXCIsIFBvc2l0aW9uZWRHcmFwaD4gJiB7IHJlbmRlcmVyOiBSZW5kZXJlciB9KVxuICAgIHwgKEF0cnlidXQ8XCJDQU5WQVNcIiwgQ2FudmFzRHJhd2VyPiAmIHtcbiAgICAgIC8qKiBSeXN1bmVrIENhbnZhcyBuaWUgbWEgcG9zdGFjaSBTVkcuICovXG4gICAgICByZW5kZXJlcjogXCJDYW52YXNcIjtcbiAgICAgIC8qKiBEYW5lIGRsYSByeXN1bmt1IChKU09OKSwgdyBmdW5rY2ppIGpha28gYGRhbmVgLiAqL1xuICAgICAgZGF0YT86IHVua25vd247XG4gICAgICBzY2VuZTogU2NlbmVTaXplO1xuICAgIH0pXG4gICk7XG5cbnR5cGUgS2x1Y3pSeXN1bmt1ID0ga2V5b2YgdHlwZW9mIFJZU1VOS0k7XG5jb25zdCBrbHVjemVSeXN1bmtvdyA9IE9iamVjdC5rZXlzKFJZU1VOS0kpIGFzIEtsdWN6UnlzdW5rdVtdO1xuXG4vKiogQ28gcnlzdWplIHDFgsOzdG5vOiBTVkcgeiB1a3J5dGVqIHRyZcWbY2ksIGdyYWYgRE9UWCBhbGJvIHJ5c3VuZWsgeiBSWVNVTktJLiAqL1xudHlwZSBNYWxvd2FuaWUgPVxuICB8IHJlYWRvbmx5IFtyb2R6YWo6IFwiU1ZHXCJdXG4gIHwgcmVhZG9ubHkgW3JvZHphajogXCJET1RYXCIsIGdyYWY6IFBvc2l0aW9uZWRHcmFwaF1cbiAgfCByZWFkb25seSBbcm9kemFqOiBcIlJZU1VORUtcIiwga2x1Y3o6IEtsdWN6UnlzdW5rdSwgZGFuZTogdW5rbm93bl07XG5cbi8qKiBQcm9wc3kgcG8gcHJ6eWdvdG93YW5pdSBuYSBzZXJ3ZXJ6ZSDigJQgdG8sIGNvIHByemVjaG9kemkgcHJ6ZXogSlNPTiBkbyBwcnplZ2zEhWRhcmtpLiAqL1xuaW50ZXJmYWNlIE9rbm8gZXh0ZW5kcyBCb3hQcm9wcyB7XG4gIHJlbmRlcmVyOiBSZW5kZXJlcjtcbiAgLyoqIFNWRzogcnlzb3dhbmUgKHJlbmRlcmVyIFNWRykgYWxibyB1a3J5dGUgxbpyw7NkxYJvIG9icmF6dSAocmVuZGVyZXIgQ2FudmFzKS4gKi9cbiAgY2hpbGRyZW4/OiBDb21wb25lbnRDaGlsZHJlbjtcbiAgYWRqdXN0PzogU3ZnUmVnaXN0cnlLZXk7XG4gIHBhaW50PzogTWFsb3dhbmllO1xuICBzY2VuZT86IFNjZW5lU2l6ZTtcbn1cblxuLyoqIExPQ0kg4oaSIFNWRy4gTWllanNjZSBuYSBzaWxuaWsgTE9DSTsgZG9ww7NraSBuaWUgbWEgem5hY3puaWvDs3csIHpnxYJhc3phIGLFgsSFZC4gKi9cbmZ1bmN0aW9uIGxvY2lEb1N2ZyhfdHJlc2M6IENvbXBvbmVudENoaWxkcmVuKTogQ29tcG9uZW50Q2hpbGRyZW4ge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJWZWN0b3JWaWV3cG9ydDogTE9DSSBuaWUgbWEgamVzemN6ZSDFvGFkbmVnbyB6bmFjem5pa2FcIik7XG59XG5cbi8qKiDFuXLDs2TFgm8geiBhdHJ5YnV0dSBhbGJvIHogZHppZWNpOyB0ZWtzdCB3IGBzb3VyY2VgID0gZ290b3dlIHpuYWN6bmlraSBTVkcgKG5wLiBwbGlrIC5zdmcgemFpbXBvcnRvd2FueSBqYWtvIHRla3N0KS4gKi9cbmZ1bmN0aW9uIHpyb2RsbyhwOiB7IHNvdXJjZT86IENvbXBvbmVudENoaWxkcmVuOyBjaGlsZHJlbj86IENvbXBvbmVudENoaWxkcmVuIH0sIGZvcm1hdDogc3RyaW5nKTogQ29tcG9uZW50Q2hpbGRyZW4ge1xuICBpZiAocC5zb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBwLmNoaWxkcmVuICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFZlY3RvclZpZXdwb3J0ICgke2Zvcm1hdH0pOiDFunLDs2TFgm8gYWxibyB3IHNvdXJjZSwgYWxibyBqYWtvIGR6aWVjaSDigJQgbmllIG9iYWApO1xuICB9XG4gIGlmICh0eXBlb2YgcC5zb3VyY2UgPT09IFwic3RyaW5nXCIpIHJldHVybiA8ZGl2IHN0eWxlPVwiZGlzcGxheTpjb250ZW50c1wiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcC5zb3VyY2UgfX0gLz47XG4gIHJldHVybiBwLnNvdXJjZSA/PyBwLmNoaWxkcmVuO1xufVxuXG4vKiogU2Vyd2VyOiB3ZWrFm2NpZSDihpIgcHJvcHN5IHd5c3B5IChiZXogZnVua2NqaSBpIFZOb2RlIHcgYXRyeWJ1dGFjaCkuICovXG5mdW5jdGlvbiBwcnp5Z290dWoocDogVmVjdG9yVmlld3BvcnRQcm9wcyk6IE9rbm8ge1xuICBjb25zdCBva25vOiBPa25vID0geyByZW5kZXJlcjogcC5yZW5kZXJlciB9O1xuICBpZiAocC5iYWNrZ3JvdW5kICE9PSB1bmRlZmluZWQpIG9rbm8uYmFja2dyb3VuZCA9IHAuYmFja2dyb3VuZDtcbiAgaWYgKHAud2lkdGggIT09IHVuZGVmaW5lZCkgb2tuby53aWR0aCA9IHAud2lkdGg7XG4gIGlmIChwLmhlaWdodCAhPT0gdW5kZWZpbmVkKSBva25vLmhlaWdodCA9IHAuaGVpZ2h0O1xuICBpZiAocC5taW5TY2FsZSAhPT0gdW5kZWZpbmVkKSBva25vLm1pblNjYWxlID0gcC5taW5TY2FsZTtcbiAgaWYgKHAubWF4U2NhbGUgIT09IHVuZGVmaW5lZCkgb2tuby5tYXhTY2FsZSA9IHAubWF4U2NhbGU7XG5cbiAgc3dpdGNoIChwLnNvdXJjZUZvcm1hdCkge1xuICAgIGNhc2UgXCJTVkdcIjpcbiAgICBjYXNlIFwiTE9DSVwiOiB7XG4gICAgICBjb25zdCBzdmcgPSBwLnNvdXJjZUZvcm1hdCA9PT0gXCJTVkdcIiA/IHpyb2RsbyhwLCBcIlNWR1wiKSA6IGxvY2lEb1N2Zyh6cm9kbG8ocCwgXCJMT0NJXCIpKTtcbiAgICAgIG9rbm8uY2hpbGRyZW4gPSBzdmc7XG4gICAgICBpZiAocC5yZW5kZXJlciA9PT0gXCJDYW52YXNcIikgb2tuby5wYWludCA9IFtcIlNWR1wiXTtcbiAgICAgIGVsc2UgaWYgKHAuc291cmNlRm9ybWF0ID09PSBcIlNWR1wiICYmIHAuYWRqdXN0ICE9PSB1bmRlZmluZWQpIG9rbm8uYWRqdXN0ID0gcC5hZGp1c3Q7XG4gICAgICByZXR1cm4gb2tubztcbiAgICB9XG4gICAgY2FzZSBcIkRPVFhcIjpcbiAgICAgIGlmIChwLnJlbmRlcmVyID09PSBcIlNWR1wiKSBva25vLmNoaWxkcmVuID0gcmVuZGVyRG90eFN2ZyhwLnNvdXJjZSk7XG4gICAgICBlbHNlIHtcbiAgICAgICAgb2tuby5wYWludCA9IFtcIkRPVFhcIiwgcC5zb3VyY2VdO1xuICAgICAgICBva25vLnNjZW5lID0gW3Auc291cmNlLndpZHRoLCBwLnNvdXJjZS5oZWlnaHRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9rbm87XG4gICAgY2FzZSBcIkNBTlZBU1wiOiB7XG4gICAgICBjb25zdCByeXN1bmVrID0gcC5zb3VyY2U7XG4gICAgICBjb25zdCBrbHVjeiA9IGtsdWN6ZVJ5c3Vua293LmZpbmQoKGspID0+IFJZU1VOS0lba10gPT09IHJ5c3VuZWspO1xuICAgICAgaWYgKGtsdWN6ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBWZWN0b3JWaWV3cG9ydDogcnlzdW5layDigJ4ke3J5c3VuZWsubmFtZSB8fCBcIihiZXogbmF6d3kpXCJ94oCdIG5pZSBqZXN0IHcgcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50cyAoUllTVU5LSSkg4oCUIHByemVnbMSFZGFya2EgZ28gbmllIGRvc3RhbmllYCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIG9rbm8ucGFpbnQgPSBbXCJSWVNVTkVLXCIsIGtsdWN6LCBwLmRhdGEgPz8gbnVsbF07XG4gICAgICBva25vLnNjZW5lID0gcC5zY2VuZTtcbiAgICAgIHJldHVybiBva25vO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBMSUNaQkEgPSAvXlxccypbXFxkLl0rKHB4KT9cXHMqJC87XG5cbi8qKiBSb3ptaWFyIFNWRzogYXRyeWJ1dHkgd2lkdGgvaGVpZ2h0IChsaWN6YnkpLCBpbmFjemVqIHZpZXdCb3gsIGluYWN6ZWogZG9tecWbbG5lIDMwMMOXMTUwIHByemVnbMSFZGFya2kuICovXG5mdW5jdGlvbiByb3ptaWFyU3ZnKHN2ZzogU1ZHU1ZHRWxlbWVudCk6IFNjZW5lU2l6ZSB7XG4gIGNvbnN0IHZiID0gKHN2Zy5nZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIpID8/IFwiXCIpLnRyaW0oKS5zcGxpdCgvW1xccyxdKy8pLm1hcChOdW1iZXIpO1xuICBjb25zdCBsaWN6YmEgPSAoYTogc3RyaW5nLCB6YXBhczogbnVtYmVyIHwgdW5kZWZpbmVkLCBkb215c2xuYTogbnVtYmVyKSA9PiB7XG4gICAgY29uc3QgdiA9IHN2Zy5nZXRBdHRyaWJ1dGUoYSk7XG4gICAgcmV0dXJuIHYgIT09IG51bGwgJiYgTElDWkJBLnRlc3QodikgPyBwYXJzZUZsb2F0KHYpIDogemFwYXMgPz8gZG9teXNsbmE7XG4gIH07XG4gIHJldHVybiBbbGljemJhKFwid2lkdGhcIiwgdmIubGVuZ3RoID09PSA0ID8gdmJbMl0gOiB1bmRlZmluZWQsIDMwMCksIGxpY3piYShcImhlaWdodFwiLCB2Yi5sZW5ndGggPT09IDQgPyB2YlszXSA6IHVuZGVmaW5lZCwgMTUwKV07XG59XG5cbi8qKiBCZXogbGljemJvd3ljaCB3aWR0aC9oZWlnaHQgKGJyYWsgYWxibyAlKSBTVkcgbmEgc3RvbGUgbmllIG1hIHJvem1pYXJ1IOKAlCB1c3RhbGEgZ28geiB2aWV3Qm94LiAqL1xuZnVuY3Rpb24gdXN0YWxSb3ptaWFyKHN2ZzogU1ZHU1ZHRWxlbWVudCk6IFNjZW5lU2l6ZSB7XG4gIGNvbnN0IHIgPSByb3ptaWFyU3ZnKHN2Zyk7XG4gIGlmICghTElDWkJBLnRlc3Qoc3ZnLmdldEF0dHJpYnV0ZShcIndpZHRoXCIpID8/IFwiXCIpIHx8ICFMSUNaQkEudGVzdChzdmcuZ2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIpID8/IFwiXCIpKSB7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFN0cmluZyhyWzBdKSk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBTdHJpbmcoclsxXSkpO1xuICB9XG4gIHJldHVybiByO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc2xhbmQoXG4gIGltcG9ydC5tZXRhLnVybCxcbiAgZnVuY3Rpb24gVmVjdG9yVmlld3BvcnQoXG4gICAgeyByZW5kZXJlciwgY2hpbGRyZW4sIGFkanVzdCwgcGFpbnQsIHNjZW5lLCBiYWNrZ3JvdW5kLCB3aWR0aCA9IFwiMTAwJVwiLCBoZWlnaHQsIG1pblNjYWxlID0gMC4xLCBtYXhTY2FsZSA9IDUwIH06IE9rbm8sXG4gICkge1xuICAgIGNvbnN0IHRyZXNjID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgICBjb25zdCBwbG90bm8gPSB1c2VSZWY8SFRNTENhbnZhc0VsZW1lbnQ+KG51bGwpO1xuICAgIGNvbnN0IHJhZiA9IHVzZVJlZjxudW1iZXIgfCBudWxsPihudWxsKTtcbiAgICAvKiogU1ZHIOKGkiBDYW52YXM6IG9icmF6IHogdWtyeXRlaiB0cmXFm2NpIGkgamVnbyByb3ptaWFyLiAqL1xuICAgIGNvbnN0IG9icmF6ID0gdXNlUmVmPEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCByb3ptaWFyID0gdXNlUmVmPFNjZW5lU2l6ZSB8IHVuZGVmaW5lZD4oc2NlbmUpO1xuXG4gICAgY29uc3QgbWFsdWogPSAobTogTWFsb3dhbmllLCBjOiBDYW52YXNEcmF3Q29udGV4dCkgPT4ge1xuICAgICAgc3dpdGNoIChtWzBdKSB7XG4gICAgICAgIGNhc2UgXCJTVkdcIjoge1xuICAgICAgICAgIGNvbnN0IFt3LCBoXSA9IHJvem1pYXIuY3VycmVudCA/PyBbMCwgMF07XG4gICAgICAgICAgaWYgKG9icmF6LmN1cnJlbnQpIGMuY3R4LmRyYXdJbWFnZShvYnJhei5jdXJyZW50LCAwLCAwLCB3LCBoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIkRPVFhcIjpcbiAgICAgICAgICBkcmF3RG90eENhbnZhcyh7IC4uLmMsIGRhbmU6IG1bMV0gfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjYXNlIFwiUllTVU5FS1wiOiB7XG4gICAgICAgICAgY29uc3QgcnlzdW5lazogQ2FudmFzRHJhd2VyIHwgdW5kZWZpbmVkID0gUllTVU5LSVttWzFdXTtcbiAgICAgICAgICBpZiAocnlzdW5laykgcnlzdW5layh7IC4uLmMsIGRhbmU6IG1bMl0gfSk7XG4gICAgICAgICAgZWxzZSBjb25zb2xlLndhcm4oYFZlY3RvclZpZXdwb3J0OiBicmFrIHJ5c3Vua3Ug4oCeJHttWzFdfeKAnSB3IFJZU1VOS0lgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcnlzdWogPSAoKSA9PiB7XG4gICAgICByYWYuY3VycmVudCA9IG51bGw7XG4gICAgICBjb25zdCBiID0gcHouYm94LmN1cnJlbnQsIGVsID0gcGxvdG5vLmN1cnJlbnQ7XG4gICAgICBpZiAoIWIgfHwgIWVsIHx8ICFwYWludCkgcmV0dXJuO1xuICAgICAgY29uc3QgY3R4ID0gZWwuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgaWYgKCFjdHgpIHJldHVybjtcblxuICAgICAgY29uc3QgZHByID0gZ2xvYmFsVGhpcy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgICBjb25zdCB3ID0gYi5jbGllbnRXaWR0aCwgaCA9IGIuY2xpZW50SGVpZ2h0O1xuICAgICAgY29uc3QgcHcgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHcgKiBkcHIpKSwgcGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGggKiBkcHIpKTtcbiAgICAgIGlmIChlbC53aWR0aCAhPT0gcHcgfHwgZWwuaGVpZ2h0ICE9PSBwaCkge1xuICAgICAgICBlbC53aWR0aCA9IHB3O1xuICAgICAgICBlbC5oZWlnaHQgPSBwaDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdiA9IHB6LnZpZXcuY3VycmVudDtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKGRwciwgMCwgMCwgZHByLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XG4gICAgICBjdHgudHJhbnNsYXRlKHYueCwgdi55KTtcbiAgICAgIGN0eC5zY2FsZSh2LnMsIHYucyk7XG4gICAgICBtYWx1aihwYWludCwgeyBjdHgsIHZpZXc6IHYsIHdpZHRoOiB3LCBoZWlnaHQ6IGgsIGRwciB9KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHphcGxhbnVqID0gKCkgPT4ge1xuICAgICAgaWYgKHJhZi5jdXJyZW50ID09PSBudWxsKSByYWYuY3VycmVudCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyeXN1aik7XG4gICAgfTtcblxuICAgIC8qKiBTVkc6IHByemVzdXdhIGkgc2thbHVqZSB0cmXFm8SHOyBDYW52YXM6IHJ5c3VqZSBvZCBub3dhLiAqL1xuICAgIGNvbnN0IHptaWFuYSA9ICgpID0+IHtcbiAgICAgIGlmIChyZW5kZXJlciA9PT0gXCJDYW52YXNcIikgcmV0dXJuIHphcGxhbnVqKCk7XG4gICAgICBjb25zdCB7IHgsIHksIHMgfSA9IHB6LnZpZXcuY3VycmVudDtcbiAgICAgIGlmICh0cmVzYy5jdXJyZW50KSB0cmVzYy5jdXJyZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpIHNjYWxlKCR7c30pYDtcbiAgICB9O1xuXG4gICAgY29uc3QgcHogPSB1c2VQYW5ab29tKHsgbWluU2NhbGUsIG1heFNjYWxlLCBvbkNoYW5nZTogem1pYW5hIH0pO1xuXG4gICAgY29uc3QgZG9wYXN1aiA9ICgpID0+IHtcbiAgICAgIGlmIChyZW5kZXJlciA9PT0gXCJDYW52YXNcIikge1xuICAgICAgICBjb25zdCByID0gcm96bWlhci5jdXJyZW50O1xuICAgICAgICBpZiAocikgcHouZml0VG8oclswXSwgclsxXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGMgPSB0cmVzYy5jdXJyZW50O1xuICAgICAgaWYgKGMpIHB6LmZpdFRvKGMub2Zmc2V0V2lkdGgsIGMub2Zmc2V0SGVpZ2h0KTtcbiAgICB9O1xuXG4gICAgLy8gU1ZHOiBkb3Bhc293YW5pZSB3aWRva3UgaSBvcGNqb25hbG5lIGRvcGFzb3dhbmllIHogcmVqZXN0cnVcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgaWYgKHJlbmRlcmVyICE9PSBcIlNWR1wiKSByZXR1cm47XG4gICAgICBjb25zdCBzdmcgPSB0cmVzYy5jdXJyZW50Py5xdWVyeVNlbGVjdG9yPFNWR1NWR0VsZW1lbnQ+KFwic3ZnXCIpO1xuICAgICAgaWYgKHN2ZykgdXN0YWxSb3ptaWFyKHN2Zyk7XG4gICAgICBkb3Bhc3VqKCk7XG4gICAgICBpZiAoIWFkanVzdCkgcmV0dXJuO1xuICAgICAgZG9jdW1lbnQuZm9udHMucmVhZHkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IHRyZXNjLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3I8U1ZHU1ZHRWxlbWVudD4oXCJzdmdcIik7XG4gICAgICAgIGlmICghc3ZnKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGYgPSBET1BBU09XQU5JQVthZGp1c3RdO1xuICAgICAgICBpZiAoZikgZihzdmcpO1xuICAgICAgICBlbHNlIGNvbnNvbGUud2FybihgVmVjdG9yVmlld3BvcnQ6IG5pZXpuYW55IGFkanVzdD1cIiR7YWRqdXN0fVwiYCk7XG4gICAgICB9KTtcbiAgICB9LCBbcmVuZGVyZXIsIGFkanVzdF0pO1xuXG4gICAgLy8gQ2FudmFzOiBvYnJheiB6IFNWRyAoZ2R5IHRyemViYSksIGRvcGFzb3dhbmllLCByeXNvd2FuaWUgcHJ6eSB6bWlhbmllIHJvem1pYXJ1XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIGlmIChyZW5kZXJlciAhPT0gXCJDYW52YXNcIikgcmV0dXJuO1xuICAgICAgY29uc3QgYiA9IHB6LmJveC5jdXJyZW50O1xuICAgICAgaWYgKCFiKSByZXR1cm47XG4gICAgICBsZXQgYWRyZXM6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG4gICAgICBpZiAocGFpbnQ/LlswXSA9PT0gXCJTVkdcIikge1xuICAgICAgICBjb25zdCBzdmcgPSB0cmVzYy5jdXJyZW50Py5xdWVyeVNlbGVjdG9yPFNWR1NWR0VsZW1lbnQ+KFwic3ZnXCIpO1xuICAgICAgICBpZiAoc3ZnKSB7XG4gICAgICAgICAgLy8gT2JyYXogU1ZHIG5pZSB3Y3p5dHVqZSB6YXNvYsOzdyB6ZXduxJl0cnpueWNoIChjemNpb25layB6IHNpZWNpLCBvYnJhesOzdykg4oCUIHR5bGtvIGN6Y2lvbmtpIHN5c3RlbW93ZS5cbiAgICAgICAgICBjb25zdCBrb3BpYSA9IHN2Zy5jbG9uZU5vZGUodHJ1ZSkgYXMgU1ZHU1ZHRWxlbWVudDtcbiAgICAgICAgICBjb25zdCByID0gdXN0YWxSb3ptaWFyKGtvcGlhKTtcbiAgICAgICAgICBhZHJlcyA9IFVSTC5jcmVhdGVPYmplY3RVUkwobmV3IEJsb2IoW25ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoa29waWEpXSwgeyB0eXBlOiBcImltYWdlL3N2Zyt4bWxcIiB9KSk7XG4gICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgIG9icmF6LmN1cnJlbnQgPSBpbWc7XG4gICAgICAgICAgICByb3ptaWFyLmN1cnJlbnQgPSByO1xuICAgICAgICAgICAgZG9wYXN1aigpO1xuICAgICAgICAgICAgemFwbGFudWooKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIGltZy5zcmMgPSBhZHJlcztcbiAgICAgICAgfSBlbHNlIGNvbnNvbGUud2FybihcIlZlY3RvclZpZXdwb3J0OiBicmFrIDxzdmc+IHcgxbpyw7NkbGVcIik7XG4gICAgICB9XG5cbiAgICAgIGRvcGFzdWooKTtcbiAgICAgIGRvY3VtZW50LmZvbnRzLnJlYWR5LnRoZW4oemFwbGFudWopO1xuICAgICAgY29uc3Qgcm8gPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4gemFwbGFudWooKSk7XG4gICAgICByby5vYnNlcnZlKGIpO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgcm8uZGlzY29ubmVjdCgpO1xuICAgICAgICBpZiAocmFmLmN1cnJlbnQgIT09IG51bGwpIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZi5jdXJyZW50KTtcbiAgICAgICAgaWYgKGFkcmVzICE9PSBudWxsKSBVUkwucmV2b2tlT2JqZWN0VVJMKGFkcmVzKTtcbiAgICAgIH07XG4gICAgfSwgW3JlbmRlcmVyLCBwYWludCwgc2NlbmVdKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzPVwidmlld3BvcnRcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj17cHouYm94fVxuICAgICAgICAgIGNsYXNzPXtjeChcInZpZXdwb3J0LXN0b2xcIiwgcHoubG9ja2VkICYmIFwiaXMtbG9ja2VkXCIpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCA/PyBcIjEwMCVcIixcbiAgICAgICAgICAgIG1pbkhlaWdodDogaGVpZ2h0ID8gdW5kZWZpbmVkIDogXCIyMDBweFwiLFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25XaGVlbD17cHouaGFuZGxlcnMub25XaGVlbH1cbiAgICAgICAgICBvblBvaW50ZXJEb3duPXtwei5oYW5kbGVycy5vblBvaW50ZXJEb3dufVxuICAgICAgICAgIG9uUG9pbnRlck1vdmU9e3B6LmhhbmRsZXJzLm9uUG9pbnRlck1vdmV9XG4gICAgICAgICAgb25Qb2ludGVyVXA9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cbiAgICAgICAgICBvblBvaW50ZXJDYW5jZWw9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cbiAgICAgICAgICBvbkRibENsaWNrPXtwei5sb2NrZWQgPyB1bmRlZmluZWQgOiBkb3Bhc3VqfVxuICAgICAgICA+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cInZpZXdwb3J0LXphbWVrXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogc3TDs8WCXCIgOiBcIlphYmxva3VqIHN0w7PFglwifVxuICAgICAgICAgICAgdGl0bGU9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogcHJ6ZXN1d2FuaWUgaSB6b29tXCIgOiBcIlphYmxva3VqIChwcnpld2lqYW5pZSBzdHJvbnkpXCJ9XG4gICAgICAgICAgICBvblBvaW50ZXJEb3duPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgIG9uRGJsQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgb25DbGljaz17cHoudG9nZ2xlTG9ja31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cHoubG9ja2VkID8gXCLwn5SSXCIgOiBcIvCflJNcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgIHtyZW5kZXJlciA9PT0gXCJTVkdcIiA/IDxkaXYgcmVmPXt0cmVzY30gY2xhc3M9XCJ2aWV3cG9ydC10cmVzY1wiPntjaGlsZHJlbn08L2Rpdj4gOiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8Y2FudmFzIHJlZj17cGxvdG5vfSBjbGFzcz1cInZpZXdwb3J0LXBsb3Rub1wiIC8+XG4gICAgICAgICAgICAgIHtjaGlsZHJlbiAhPT0gdW5kZWZpbmVkICYmIDxkaXYgcmVmPXt0cmVzY30gaGlkZGVuPntjaGlsZHJlbn08L2Rpdj59XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG4gIHByenlnb3R1aixcbik7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLDhDQUE4QztBQUM5Qyw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDs7QUFHakQsU0FBUyxTQUFTLEVBQUUsTUFBTSxRQUFRLGVBQWU7QUFDakQsU0FBUyxNQUFNLFFBQVEsa0JBQWtCO0FBQ3pDLFNBQVMsRUFBRSxRQUFRLDBCQUEwQjtBQUM3QyxTQUFTLFdBQVcsUUFBNkIsNkNBQTZDO0FBQzlGLFNBQVMsT0FBTyxRQUFRLGdEQUFnRDtBQUN4RSxTQUFTLFVBQVUsUUFBUSxtQ0FBbUM7QUFFOUQsU0FBUyxhQUFhLFFBQVEseUNBQXlDO0FBQ3ZFLFNBQVMsY0FBYyxRQUFRLDJDQUEyQztBQXNFMUUsTUFBTSxpQkFBaUIsT0FBTyxJQUFJLENBQUM7QUFrQm5DLGdGQUFnRixHQUNoRixTQUFTLFVBQVUsTUFBeUI7RUFDMUMsTUFBTSxJQUFJLE1BQU07QUFDbEI7QUFFQSx1SEFBdUgsR0FDdkgsU0FBUyxPQUFPLENBQStELEVBQUUsTUFBYztFQUM3RixJQUFJLEVBQUUsTUFBTSxLQUFLLGFBQWEsRUFBRSxRQUFRLEtBQUssV0FBVztJQUN0RCxNQUFNLElBQUksTUFBTSxDQUFDLGdCQUFnQixFQUFFLE9BQU8sbURBQW1ELENBQUM7RUFDaEc7RUFDQSxJQUFJLE9BQU8sRUFBRSxNQUFNLEtBQUssVUFBVSxxQkFBTyxLQUFDO0lBQUksT0FBTTtJ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