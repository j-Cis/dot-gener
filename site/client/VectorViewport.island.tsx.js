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
import { renderDotxSvg } from "@/site/screen/dotx/render-svg.tsx";
import { drawDotxCanvas } from "@/site/common/lang/dotx/render-canvas.ts";
import { lociModelZJsx } from "@/site/screen/Loci.render.tsx";
import { renderLociSvg } from "@/site/screen/loci/render-svg.tsx";
import { drawLociCanvas } from "@/site/screen/loci/render-canvas.ts";
const kluczeRysunkow = Object.keys(RYSUNKI);
/** Źródło z atrybutu albo z dzieci — jedno z dwóch. */ function zrodlo(p, format) {
  if (p.source !== undefined && p.children !== undefined) {
    throw new Error(`VectorViewport (${format}): źródło albo w source, albo jako dzieci — nie oba`);
  }
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
      {
        // tekst w `source` = gotowe znaczniki SVG (np. plik .svg zaimportowany jako tekst)
        const svg = typeof p.source === "string" ? /*#__PURE__*/ _jsx("div", {
          style: "display:contents",
          dangerouslySetInnerHTML: {
            __html: p.source
          }
        }) : zrodlo(p, "SVG");
        okno.children = svg;
        if (p.renderer === "Canvas") okno.paint = [
          "SVG"
        ];
        else if (p.adjust !== undefined) okno.adjust = p.adjust;
        return okno;
      }
    case "LOCI":
      {
        const model = lociModelZJsx(zrodlo(p, "LOCI"));
        if (p.renderer === "SVG") okno.children = renderLociSvg(model);
        else {
          const [minX, minY, maxX, maxY] = model.zakres;
          okno.paint = [
            "LOCI",
            model
          ];
          okno.scene = [
            maxX - minX,
            maxY - minY
          ];
        }
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
      case "LOCI":
        drawLociCanvas({
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
    if (!tresc.current) return;
    tresc.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    // powiększenie dla treści: elementy w px ekranu (np. konstrukcja LOCI) dzielą przez nie swój rozmiar
    tresc.current.style.setProperty("--vv-s", String(s));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudENoaWxkcmVuIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgeyBpc2xhbmQgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5pbXBvcnQgeyBjeCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2Nzcy9jeC50c1wiO1xuaW1wb3J0IHsgRE9QQVNPV0FOSUEsIHR5cGUgU3ZnUmVnaXN0cnlLZXkgfSBmcm9tIFwiQC9zaXRlL2NsaWVudC9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtc3ZnLnRzXCI7XG5pbXBvcnQgeyBSWVNVTktJIH0gZnJvbSBcIkAvc2l0ZS9jbGllbnQvcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50c1wiO1xuaW1wb3J0IHsgdXNlUGFuWm9vbSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL3V0aWwvdXNlUGFuWm9vbS50c1wiO1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbmVkR3JhcGggfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2RvdHgvbW9kZWwudHNcIjtcbmltcG9ydCB7IHJlbmRlckRvdHhTdmcgfSBmcm9tIFwiQC9zaXRlL3NjcmVlbi9kb3R4L3JlbmRlci1zdmcudHN4XCI7XG5pbXBvcnQgeyBkcmF3RG90eENhbnZhcyB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvZG90eC9yZW5kZXItY2FudmFzLnRzXCI7XG5pbXBvcnQgdHlwZSB7IExvY2lNb2RlbCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9tb2RlbC50c1wiO1xuaW1wb3J0IHsgbG9jaU1vZGVsWkpzeCB9IGZyb20gXCJAL3NpdGUvc2NyZWVuL0xvY2kucmVuZGVyLnRzeFwiO1xuaW1wb3J0IHsgcmVuZGVyTG9jaVN2ZyB9IGZyb20gXCJAL3NpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3hcIjtcbmltcG9ydCB7IGRyYXdMb2NpQ2FudmFzIH0gZnJvbSBcIkAvc2l0ZS9zY3JlZW4vbG9jaS9yZW5kZXItY2FudmFzLnRzXCI7XG5cbi8qKiBDU1MgbGVuZ3RoIGZvciB0aGUgYm94IHNpemUuICovXG5leHBvcnQgdHlwZSBCb3hMZW5ndGggPSBgJHtudW1iZXJ9JHtcInJlbVwiIHwgXCJlbVwiIHwgXCJweFwiIHwgXCIlXCIgfCBcInZ3XCIgfCBcInZoXCJ9YDtcblxuLyoqIFRlY2hub2xvZ2lhIHd5xZt3aWV0bGFuaWEuICovXG5leHBvcnQgdHlwZSBSZW5kZXJlciA9IFwiU1ZHXCIgfCBcIkNhbnZhc1wiO1xuXG4vKiogTG9naWN6bnkgcm96bWlhciBzY2VueSBbc3plcm9rb8WbxIcsIHd5c29rb8WbxIddIOKAlCBkbyBkb3Bhc293YW5pYSB3aWRva3UgKGZpdCkuICovXG5leHBvcnQgdHlwZSBTY2VuZVNpemUgPSByZWFkb25seSBbIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIF07XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FudmFzVmlldyB7XG5cdHg6IG51bWJlcjtcblx0eTogbnVtYmVyO1xuXHRzOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FudmFzRHJhd0NvbnRleHQge1xuXHRjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblx0dmlldzogQ2FudmFzVmlldztcblx0LyoqIFJvem1pYXIgcMWCw7N0bmEgdyBwaWtzZWxhY2ggQ1NTLiAqL1xuXHR3aWR0aDogbnVtYmVyO1xuXHRoZWlnaHQ6IG51bWJlcjtcblx0ZHByOiBudW1iZXI7XG5cdGRhbmU/OiB1bmtub3duO1xufVxuXG4vKiogUnlzdW5layBDYW52YXM7IMW8ZWJ5IGR6aWHFgmHFgiB3IHByemVnbMSFZGFyY2UsIG11c2kgYnnEhyB3IHJlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHMgKFJZU1VOS0kpLiAqL1xuZXhwb3J0IHR5cGUgQ2FudmFzRHJhd2VyID0gKCBjOiBDYW52YXNEcmF3Q29udGV4dCApID0+IHZvaWQ7XG5cbmludGVyZmFjZSBCb3hQcm9wcyB7XG5cdC8qKiBUxYJvIHN0b8WCdSwgZG93b2xueSBrb2xvciBDU1MuICovXG5cdGJhY2tncm91bmQ/OiBzdHJpbmc7XG5cdC8qKiBTemVyb2tvxZvEhy4gRG9tecWbbG5pZSBcIjEwMCVcIi4gKi9cblx0d2lkdGg/OiBCb3hMZW5ndGg7XG5cdC8qKiBXeXNva2/Fm8SHLiBEb215xZtsbmllIFwiMTAwJVwiIHogbWluLWhlaWdodCAyMDBweDsgd3lwZcWCbmllbmllIHd5bWFnYSByb2R6aWNhIHogd3lzb2tvxZtjacSFLiAqL1xuXHRoZWlnaHQ/OiBCb3hMZW5ndGg7XG5cdC8qKiBMaW1pdHkgcG93acSZa3N6ZW5pYSB3emdsxJlkZW0gd2lkb2t1IGRvcGFzb3dhbmVnby4gRG9tecWbbG5pZSAwLjEg4oCmIDUwLiAqL1xuXHRtaW5TY2FsZT86IG51bWJlcjtcblx0bWF4U2NhbGU/OiBudW1iZXI7XG59XG5cbi8qKiDFuXLDs2TFgm8gdyBhdHJ5YnVjaWUgYHNvdXJjZWAgYWxibyBqYWtvIGR6aWVjaSDigJQgamVkbm8geiBkd8OzY2guICovXG50eXBlIEF0cnlidXRBbGJvRHppZWNpPEYgZXh0ZW5kcyBzdHJpbmcsIFQ+ID1cblx0fCB7IHNvdXJjZUZvcm1hdDogRjsgc291cmNlOiBUOyBjaGlsZHJlbj86IG5ldmVyIH1cblx0fCB7IHNvdXJjZUZvcm1hdDogRjsgY2hpbGRyZW46IFQ7IHNvdXJjZT86IG5ldmVyIH07XG5cbi8qKiDFuXLDs2TFgm8gdHlsa28gdyBhdHJ5YnVjaWUgYHNvdXJjZWAuICovXG50eXBlIEF0cnlidXQ8RiBleHRlbmRzIHN0cmluZywgVD4gPSB7IHNvdXJjZUZvcm1hdDogRjsgc291cmNlOiBUOyBjaGlsZHJlbj86IG5ldmVyIH07XG5cbmV4cG9ydCB0eXBlIFZlY3RvclZpZXdwb3J0UHJvcHMgPVxuXHQmIEJveFByb3BzXG5cdCYgKFxuXHRcdHwgKEF0cnlidXRBbGJvRHppZWNpPFwiU1ZHXCIsIENvbXBvbmVudENoaWxkcmVuPiAmIHtcblx0XHRcdHJlbmRlcmVyOiBSZW5kZXJlcjtcblx0XHRcdC8qKiBEb3Bhc293YW5pZSB6IHJlZ2lzdHJpZXMvZm9yLWlzbGFuZC1zdmcudHMsIHVydWNoYW1pYW5lIHcgcHJ6ZWdsxIVkYXJjZSAodHlsa28gcmVuZGVyZXIgU1ZHKS4gKi9cblx0XHRcdGFkanVzdD86IFN2Z1JlZ2lzdHJ5S2V5O1xuXHRcdH0pXG5cdFx0fCAoQXRyeWJ1dEFsYm9EemllY2k8XCJMT0NJXCIsIENvbXBvbmVudENoaWxkcmVuPiAmIHsgcmVuZGVyZXI6IFJlbmRlcmVyIH0pXG5cdFx0fCAoQXRyeWJ1dDxcIkRPVFhcIiwgUG9zaXRpb25lZEdyYXBoPiAmIHsgcmVuZGVyZXI6IFJlbmRlcmVyIH0pXG5cdFx0fCAoQXRyeWJ1dDxcIkNBTlZBU1wiLCBDYW52YXNEcmF3ZXI+ICYge1xuXHRcdFx0LyoqIFJ5c3VuZWsgQ2FudmFzIG5pZSBtYSBwb3N0YWNpIFNWRy4gKi9cblx0XHRcdHJlbmRlcmVyOiBcIkNhbnZhc1wiO1xuXHRcdFx0LyoqIERhbmUgZGxhIHJ5c3Vua3UgKEpTT04pLCB3IGZ1bmtjamkgamFrbyBgZGFuZWAuICovXG5cdFx0XHRkYXRhPzogdW5rbm93bjtcblx0XHRcdHNjZW5lOiBTY2VuZVNpemU7XG5cdFx0fSlcblx0KTtcblxudHlwZSBLbHVjelJ5c3Vua3UgPSBrZXlvZiB0eXBlb2YgUllTVU5LSTtcbmNvbnN0IGtsdWN6ZVJ5c3Vua293ID0gT2JqZWN0LmtleXMoIFJZU1VOS0kgKSBhcyBLbHVjelJ5c3Vua3VbXTtcblxuLyoqIENvIHJ5c3VqZSBwxYLDs3RubzogU1ZHIHogdWtyeXRlaiB0cmXFm2NpLCBncmFmIERPVFgsIG1vZGVsIExPQ0kgYWxibyByeXN1bmVrIHogUllTVU5LSS4gKi9cbnR5cGUgTWFsb3dhbmllID1cblx0fCByZWFkb25seSBbIHJvZHphajogXCJTVkdcIiBdXG5cdHwgcmVhZG9ubHkgWyByb2R6YWo6IFwiRE9UWFwiLCBncmFmOiBQb3NpdGlvbmVkR3JhcGggXVxuXHR8IHJlYWRvbmx5IFsgcm9kemFqOiBcIkxPQ0lcIiwgbW9kZWw6IExvY2lNb2RlbCBdXG5cdHwgcmVhZG9ubHkgWyByb2R6YWo6IFwiUllTVU5FS1wiLCBrbHVjejogS2x1Y3pSeXN1bmt1LCBkYW5lOiB1bmtub3duIF07XG5cbi8qKiBQcm9wc3kgcG8gcHJ6eWdvdG93YW5pdSBuYSBzZXJ3ZXJ6ZSDigJQgdG8sIGNvIHByemVjaG9kemkgcHJ6ZXogSlNPTiBkbyBwcnplZ2zEhWRhcmtpLiAqL1xuaW50ZXJmYWNlIE9rbm8gZXh0ZW5kcyBCb3hQcm9wcyB7XG5cdHJlbmRlcmVyOiBSZW5kZXJlcjtcblx0LyoqIFNWRzogcnlzb3dhbmUgKHJlbmRlcmVyIFNWRykgYWxibyB1a3J5dGUgxbpyw7NkxYJvIG9icmF6dSAocmVuZGVyZXIgQ2FudmFzKS4gKi9cblx0Y2hpbGRyZW4/OiBDb21wb25lbnRDaGlsZHJlbjtcblx0YWRqdXN0PzogU3ZnUmVnaXN0cnlLZXk7XG5cdHBhaW50PzogTWFsb3dhbmllO1xuXHRzY2VuZT86IFNjZW5lU2l6ZTtcbn1cblxuLyoqIMW5csOzZMWCbyB6IGF0cnlidXR1IGFsYm8geiBkemllY2kg4oCUIGplZG5vIHogZHfDs2NoLiAqL1xuZnVuY3Rpb24genJvZGxvKCBwOiB7IHNvdXJjZT86IENvbXBvbmVudENoaWxkcmVuOyBjaGlsZHJlbj86IENvbXBvbmVudENoaWxkcmVuIH0sIGZvcm1hdDogc3RyaW5nICk6IENvbXBvbmVudENoaWxkcmVuIHtcblx0aWYgKCBwLnNvdXJjZSAhPT0gdW5kZWZpbmVkICYmIHAuY2hpbGRyZW4gIT09IHVuZGVmaW5lZCApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIGBWZWN0b3JWaWV3cG9ydCAoJHtmb3JtYXR9KTogxbpyw7NkxYJvIGFsYm8gdyBzb3VyY2UsIGFsYm8gamFrbyBkemllY2kg4oCUIG5pZSBvYmFgICk7XG5cdH1cblx0cmV0dXJuIHAuc291cmNlID8/IHAuY2hpbGRyZW47XG59XG5cbi8qKiBTZXJ3ZXI6IHdlasWbY2llIOKGkiBwcm9wc3kgd3lzcHkgKGJleiBmdW5rY2ppIGkgVk5vZGUgdyBhdHJ5YnV0YWNoKS4gKi9cbmZ1bmN0aW9uIHByenlnb3R1aiggcDogVmVjdG9yVmlld3BvcnRQcm9wcyApOiBPa25vIHtcblx0Y29uc3Qgb2tubzogT2tubyA9IHsgcmVuZGVyZXI6IHAucmVuZGVyZXIgfTtcblx0aWYgKCBwLmJhY2tncm91bmQgIT09IHVuZGVmaW5lZCApIG9rbm8uYmFja2dyb3VuZCA9IHAuYmFja2dyb3VuZDtcblx0aWYgKCBwLndpZHRoICE9PSB1bmRlZmluZWQgKSBva25vLndpZHRoID0gcC53aWR0aDtcblx0aWYgKCBwLmhlaWdodCAhPT0gdW5kZWZpbmVkICkgb2tuby5oZWlnaHQgPSBwLmhlaWdodDtcblx0aWYgKCBwLm1pblNjYWxlICE9PSB1bmRlZmluZWQgKSBva25vLm1pblNjYWxlID0gcC5taW5TY2FsZTtcblx0aWYgKCBwLm1heFNjYWxlICE9PSB1bmRlZmluZWQgKSBva25vLm1heFNjYWxlID0gcC5tYXhTY2FsZTtcblxuXHRzd2l0Y2ggKCBwLnNvdXJjZUZvcm1hdCApIHtcblx0XHRjYXNlIFwiU1ZHXCI6IHtcblx0XHRcdC8vIHRla3N0IHcgYHNvdXJjZWAgPSBnb3Rvd2Ugem5hY3puaWtpIFNWRyAobnAuIHBsaWsgLnN2ZyB6YWltcG9ydG93YW55IGpha28gdGVrc3QpXG5cdFx0XHRjb25zdCBzdmcgPSB0eXBlb2YgcC5zb3VyY2UgPT09IFwic3RyaW5nXCIgPyA8ZGl2IHN0eWxlPVwiZGlzcGxheTpjb250ZW50c1wiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcC5zb3VyY2UgfX0gLz4gOiB6cm9kbG8oIHAsIFwiU1ZHXCIgKTtcblx0XHRcdG9rbm8uY2hpbGRyZW4gPSBzdmc7XG5cdFx0XHRpZiAoIHAucmVuZGVyZXIgPT09IFwiQ2FudmFzXCIgKSBva25vLnBhaW50ID0gWyBcIlNWR1wiIF07XG5cdFx0XHRlbHNlIGlmICggcC5hZGp1c3QgIT09IHVuZGVmaW5lZCApIG9rbm8uYWRqdXN0ID0gcC5hZGp1c3Q7XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHR9XG5cdFx0Y2FzZSBcIkxPQ0lcIjoge1xuXHRcdFx0Y29uc3QgbW9kZWwgPSBsb2NpTW9kZWxaSnN4KCB6cm9kbG8oIHAsIFwiTE9DSVwiICkgKTtcblx0XHRcdGlmICggcC5yZW5kZXJlciA9PT0gXCJTVkdcIiApIG9rbm8uY2hpbGRyZW4gPSByZW5kZXJMb2NpU3ZnKCBtb2RlbCApO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnN0IFsgbWluWCwgbWluWSwgbWF4WCwgbWF4WSBdID0gbW9kZWwuemFrcmVzO1xuXHRcdFx0XHRva25vLnBhaW50ID0gWyBcIkxPQ0lcIiwgbW9kZWwgXTtcblx0XHRcdFx0b2tuby5zY2VuZSA9IFsgbWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZIF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHR9XG5cdFx0Y2FzZSBcIkRPVFhcIjpcblx0XHRcdGlmICggcC5yZW5kZXJlciA9PT0gXCJTVkdcIiApIG9rbm8uY2hpbGRyZW4gPSByZW5kZXJEb3R4U3ZnKCBwLnNvdXJjZSApO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG9rbm8ucGFpbnQgPSBbIFwiRE9UWFwiLCBwLnNvdXJjZSBdO1xuXHRcdFx0XHRva25vLnNjZW5lID0gWyBwLnNvdXJjZS53aWR0aCwgcC5zb3VyY2UuaGVpZ2h0IF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHRjYXNlIFwiQ0FOVkFTXCI6IHtcblx0XHRcdGNvbnN0IHJ5c3VuZWsgPSBwLnNvdXJjZTtcblx0XHRcdGNvbnN0IGtsdWN6ID0ga2x1Y3plUnlzdW5rb3cuZmluZCggKCBrICkgPT4gUllTVU5LSVtrXSA9PT0gcnlzdW5layApO1xuXHRcdFx0aWYgKCBrbHVjeiA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0YFZlY3RvclZpZXdwb3J0OiByeXN1bmVrIOKAniR7cnlzdW5lay5uYW1lIHx8IFwiKGJleiBuYXp3eSlcIn3igJ0gbmllIGplc3QgdyByZWdpc3RyaWVzL2Zvci1pc2xhbmQtY2FudmFzLnRzIChSWVNVTktJKSDigJQgcHJ6ZWdsxIVkYXJrYSBnbyBuaWUgZG9zdGFuaWVgLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0b2tuby5wYWludCA9IFsgXCJSWVNVTkVLXCIsIGtsdWN6LCBwLmRhdGEgPz8gbnVsbCBdO1xuXHRcdFx0b2tuby5zY2VuZSA9IHAuc2NlbmU7XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHR9XG5cdH1cbn1cblxuY29uc3QgTElDWkJBID0gL15cXHMqW1xcZC5dKyhweCk/XFxzKiQvO1xuXG4vKiogUm96bWlhciBTVkc6IGF0cnlidXR5IHdpZHRoL2hlaWdodCAobGljemJ5KSwgaW5hY3plaiB2aWV3Qm94LCBpbmFjemVqIGRvbXnFm2xuZSAzMDDDlzE1MCBwcnplZ2zEhWRhcmtpLiAqL1xuZnVuY3Rpb24gcm96bWlhclN2Zyggc3ZnOiBTVkdTVkdFbGVtZW50ICk6IFNjZW5lU2l6ZSB7XG5cdGNvbnN0IHZiID0gKCBzdmcuZ2V0QXR0cmlidXRlKCBcInZpZXdCb3hcIiApID8/IFwiXCIgKS50cmltKCkuc3BsaXQoIC9bXFxzLF0rLyApLm1hcCggTnVtYmVyICk7XG5cdGNvbnN0IGxpY3piYSA9ICggYTogc3RyaW5nLCB6YXBhczogbnVtYmVyIHwgdW5kZWZpbmVkLCBkb215c2xuYTogbnVtYmVyICkgPT4ge1xuXHRcdGNvbnN0IHYgPSBzdmcuZ2V0QXR0cmlidXRlKCBhICk7XG5cdFx0cmV0dXJuIHYgIT09IG51bGwgJiYgTElDWkJBLnRlc3QoIHYgKSA/IHBhcnNlRmxvYXQoIHYgKSA6IHphcGFzID8/IGRvbXlzbG5hO1xuXHR9O1xuXHRyZXR1cm4gWyBsaWN6YmEoIFwid2lkdGhcIiwgdmIubGVuZ3RoID09PSA0ID8gdmJbMl0gOiB1bmRlZmluZWQsIDMwMCApLCBsaWN6YmEoIFwiaGVpZ2h0XCIsIHZiLmxlbmd0aCA9PT0gNCA/IHZiWzNdIDogdW5kZWZpbmVkLCAxNTAgKSBdO1xufVxuXG4vKiogQmV6IGxpY3pib3d5Y2ggd2lkdGgvaGVpZ2h0IChicmFrIGFsYm8gJSkgU1ZHIG5hIHN0b2xlIG5pZSBtYSByb3ptaWFydSDigJQgdXN0YWxhIGdvIHogdmlld0JveC4gKi9cbmZ1bmN0aW9uIHVzdGFsUm96bWlhciggc3ZnOiBTVkdTVkdFbGVtZW50ICk6IFNjZW5lU2l6ZSB7XG5cdGNvbnN0IHIgPSByb3ptaWFyU3ZnKCBzdmcgKTtcblx0aWYgKCAhTElDWkJBLnRlc3QoIHN2Zy5nZXRBdHRyaWJ1dGUoIFwid2lkdGhcIiApID8/IFwiXCIgKSB8fCAhTElDWkJBLnRlc3QoIHN2Zy5nZXRBdHRyaWJ1dGUoIFwiaGVpZ2h0XCIgKSA/PyBcIlwiICkgKSB7XG5cdFx0c3ZnLnNldEF0dHJpYnV0ZSggXCJ3aWR0aFwiLCBTdHJpbmcoIHJbMF0gKSApO1xuXHRcdHN2Zy5zZXRBdHRyaWJ1dGUoIFwiaGVpZ2h0XCIsIFN0cmluZyggclsxXSApICk7XG5cdH1cblx0cmV0dXJuIHI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzbGFuZChcblx0aW1wb3J0Lm1ldGEudXJsLFxuXHRmdW5jdGlvbiBWZWN0b3JWaWV3cG9ydChcblx0XHR7IHJlbmRlcmVyLCBjaGlsZHJlbiwgYWRqdXN0LCBwYWludCwgc2NlbmUsIGJhY2tncm91bmQsIHdpZHRoID0gXCIxMDAlXCIsIGhlaWdodCwgbWluU2NhbGUgPSAwLjEsIG1heFNjYWxlID0gNTAgfTogT2tubyxcblx0KSB7XG5cdFx0Y29uc3QgdHJlc2MgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KCBudWxsICk7XG5cdFx0Y29uc3QgcGxvdG5vID0gdXNlUmVmPEhUTUxDYW52YXNFbGVtZW50PiggbnVsbCApO1xuXHRcdGNvbnN0IHJhZiA9IHVzZVJlZjxudW1iZXIgfCBudWxsPiggbnVsbCApO1xuXHRcdC8qKiBTVkcg4oaSIENhbnZhczogb2JyYXogeiB1a3J5dGVqIHRyZcWbY2kgaSBqZWdvIHJvem1pYXIuICovXG5cdFx0Y29uc3Qgb2JyYXogPSB1c2VSZWY8SFRNTEltYWdlRWxlbWVudCB8IG51bGw+KCBudWxsICk7XG5cdFx0Y29uc3Qgcm96bWlhciA9IHVzZVJlZjxTY2VuZVNpemUgfCB1bmRlZmluZWQ+KCBzY2VuZSApO1xuXG5cdFx0Y29uc3QgbWFsdWogPSAoIG06IE1hbG93YW5pZSwgYzogQ2FudmFzRHJhd0NvbnRleHQgKSA9PiB7XG5cdFx0XHRzd2l0Y2ggKCBtWzBdICkge1xuXHRcdFx0XHRjYXNlIFwiU1ZHXCI6IHtcblx0XHRcdFx0XHRjb25zdCBbIHcsIGggXSA9IHJvem1pYXIuY3VycmVudCA/PyBbIDAsIDAgXTtcblx0XHRcdFx0XHRpZiAoIG9icmF6LmN1cnJlbnQgKSBjLmN0eC5kcmF3SW1hZ2UoIG9icmF6LmN1cnJlbnQsIDAsIDAsIHcsIGggKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSBcIkRPVFhcIjpcblx0XHRcdFx0XHRkcmF3RG90eENhbnZhcyggeyAuLi5jLCBkYW5lOiBtWzFdIH0gKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGNhc2UgXCJMT0NJXCI6XG5cdFx0XHRcdFx0ZHJhd0xvY2lDYW52YXMoIHsgLi4uYywgZGFuZTogbVsxXSB9ICk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRjYXNlIFwiUllTVU5FS1wiOiB7XG5cdFx0XHRcdFx0Y29uc3QgcnlzdW5lazogQ2FudmFzRHJhd2VyIHwgdW5kZWZpbmVkID0gUllTVU5LSVttWzFdXTtcblx0XHRcdFx0XHRpZiAoIHJ5c3VuZWsgKSByeXN1bmVrKCB7IC4uLmMsIGRhbmU6IG1bMl0gfSApO1xuXHRcdFx0XHRcdGVsc2UgY29uc29sZS53YXJuKCBgVmVjdG9yVmlld3BvcnQ6IGJyYWsgcnlzdW5rdSDigJ4ke21bMV194oCdIHcgUllTVU5LSWAgKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3QgcnlzdWogPSAoKSA9PiB7XG5cdFx0XHRyYWYuY3VycmVudCA9IG51bGw7XG5cdFx0XHRjb25zdCBiID0gcHouYm94LmN1cnJlbnQsIGVsID0gcGxvdG5vLmN1cnJlbnQ7XG5cdFx0XHRpZiAoICFiIHx8ICFlbCB8fCAhcGFpbnQgKSByZXR1cm47XG5cdFx0XHRjb25zdCBjdHggPSBlbC5nZXRDb250ZXh0KCBcIjJkXCIgKTtcblx0XHRcdGlmICggIWN0eCApIHJldHVybjtcblxuXHRcdFx0Y29uc3QgZHByID0gZ2xvYmFsVGhpcy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG5cdFx0XHRjb25zdCB3ID0gYi5jbGllbnRXaWR0aCwgaCA9IGIuY2xpZW50SGVpZ2h0O1xuXHRcdFx0Y29uc3QgcHcgPSBNYXRoLm1heCggMSwgTWF0aC5yb3VuZCggdyAqIGRwciApICksIHBoID0gTWF0aC5tYXgoIDEsIE1hdGgucm91bmQoIGggKiBkcHIgKSApO1xuXHRcdFx0aWYgKCBlbC53aWR0aCAhPT0gcHcgfHwgZWwuaGVpZ2h0ICE9PSBwaCApIHtcblx0XHRcdFx0ZWwud2lkdGggPSBwdztcblx0XHRcdFx0ZWwuaGVpZ2h0ID0gcGg7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IHYgPSBwei52aWV3LmN1cnJlbnQ7XG5cdFx0XHRjdHguc2F2ZSgpO1xuXHRcdFx0Y3R4LnNldFRyYW5zZm9ybSggZHByLCAwLCAwLCBkcHIsIDAsIDAgKTtcblx0XHRcdGN0eC5jbGVhclJlY3QoIDAsIDAsIHcsIGggKTtcblx0XHRcdGN0eC50cmFuc2xhdGUoIHYueCwgdi55ICk7XG5cdFx0XHRjdHguc2NhbGUoIHYucywgdi5zICk7XG5cdFx0XHRtYWx1aiggcGFpbnQsIHsgY3R4LCB2aWV3OiB2LCB3aWR0aDogdywgaGVpZ2h0OiBoLCBkcHIgfSApO1xuXHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHR9O1xuXG5cdFx0Y29uc3QgemFwbGFudWogPSAoKSA9PiB7XG5cdFx0XHRpZiAoIHJhZi5jdXJyZW50ID09PSBudWxsICkgcmFmLmN1cnJlbnQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoIHJ5c3VqICk7XG5cdFx0fTtcblxuXHRcdC8qKiBTVkc6IHByemVzdXdhIGkgc2thbHVqZSB0cmXFm8SHOyBDYW52YXM6IHJ5c3VqZSBvZCBub3dhLiAqL1xuXHRcdGNvbnN0IHptaWFuYSA9ICgpID0+IHtcblx0XHRcdGlmICggcmVuZGVyZXIgPT09IFwiQ2FudmFzXCIgKSByZXR1cm4gemFwbGFudWooKTtcblx0XHRcdGNvbnN0IHsgeCwgeSwgcyB9ID0gcHoudmlldy5jdXJyZW50O1xuXHRcdFx0aWYgKCAhdHJlc2MuY3VycmVudCApIHJldHVybjtcblx0XHRcdHRyZXNjLmN1cnJlbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3h9cHgsICR7eX1weCkgc2NhbGUoJHtzfSlgO1xuXHRcdFx0Ly8gcG93acSZa3N6ZW5pZSBkbGEgdHJlxZtjaTogZWxlbWVudHkgdyBweCBla3JhbnUgKG5wLiBrb25zdHJ1a2NqYSBMT0NJKSBkemllbMSFIHByemV6IG5pZSBzd8OzaiByb3ptaWFyXG5cdFx0XHR0cmVzYy5jdXJyZW50LnN0eWxlLnNldFByb3BlcnR5KCBcIi0tdnYtc1wiLCBTdHJpbmcoIHMgKSApO1xuXHRcdH07XG5cblx0XHRjb25zdCBweiA9IHVzZVBhblpvb20oIHsgbWluU2NhbGUsIG1heFNjYWxlLCBvbkNoYW5nZTogem1pYW5hIH0gKTtcblxuXHRcdGNvbnN0IGRvcGFzdWogPSAoKSA9PiB7XG5cdFx0XHRpZiAoIHJlbmRlcmVyID09PSBcIkNhbnZhc1wiICkge1xuXHRcdFx0XHRjb25zdCByID0gcm96bWlhci5jdXJyZW50O1xuXHRcdFx0XHRpZiAoIHIgKSBwei5maXRUbyggclswXSwgclsxXSApO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjb25zdCBjID0gdHJlc2MuY3VycmVudDtcblx0XHRcdGlmICggYyApIHB6LmZpdFRvKCBjLm9mZnNldFdpZHRoLCBjLm9mZnNldEhlaWdodCApO1xuXHRcdH07XG5cblx0XHQvLyBTVkc6IGRvcGFzb3dhbmllIHdpZG9rdSBpIG9wY2pvbmFsbmUgZG9wYXNvd2FuaWUgeiByZWplc3RydVxuXHRcdHVzZUVmZmVjdCggKCkgPT4ge1xuXHRcdFx0aWYgKCByZW5kZXJlciAhPT0gXCJTVkdcIiApIHJldHVybjtcblx0XHRcdGNvbnN0IHN2ZyA9IHRyZXNjLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3I8U1ZHU1ZHRWxlbWVudD4oIFwic3ZnXCIgKTtcblx0XHRcdGlmICggc3ZnICkgdXN0YWxSb3ptaWFyKCBzdmcgKTtcblx0XHRcdGRvcGFzdWooKTtcblx0XHRcdGlmICggIWFkanVzdCApIHJldHVybjtcblx0XHRcdGRvY3VtZW50LmZvbnRzLnJlYWR5LnRoZW4oICgpID0+IHtcblx0XHRcdFx0Y29uc3Qgc3ZnID0gdHJlc2MuY3VycmVudD8ucXVlcnlTZWxlY3RvcjxTVkdTVkdFbGVtZW50PiggXCJzdmdcIiApO1xuXHRcdFx0XHRpZiAoICFzdmcgKSByZXR1cm47XG5cdFx0XHRcdGNvbnN0IGYgPSBET1BBU09XQU5JQVthZGp1c3RdO1xuXHRcdFx0XHRpZiAoIGYgKSBmKCBzdmcgKTtcblx0XHRcdFx0ZWxzZSBjb25zb2xlLndhcm4oIGBWZWN0b3JWaWV3cG9ydDogbmllem5hbnkgYWRqdXN0PVwiJHthZGp1c3R9XCJgICk7XG5cdFx0XHR9ICk7XG5cdFx0fSwgWyByZW5kZXJlciwgYWRqdXN0IF0gKTtcblxuXHRcdC8vIENhbnZhczogb2JyYXogeiBTVkcgKGdkeSB0cnplYmEpLCBkb3Bhc293YW5pZSwgcnlzb3dhbmllIHByenkgem1pYW5pZSByb3ptaWFydVxuXHRcdHVzZUVmZmVjdCggKCkgPT4ge1xuXHRcdFx0aWYgKCByZW5kZXJlciAhPT0gXCJDYW52YXNcIiApIHJldHVybjtcblx0XHRcdGNvbnN0IGIgPSBwei5ib3guY3VycmVudDtcblx0XHRcdGlmICggIWIgKSByZXR1cm47XG5cdFx0XHRsZXQgYWRyZXM6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXG5cdFx0XHRpZiAoIHBhaW50Py5bMF0gPT09IFwiU1ZHXCIgKSB7XG5cdFx0XHRcdGNvbnN0IHN2ZyA9IHRyZXNjLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3I8U1ZHU1ZHRWxlbWVudD4oIFwic3ZnXCIgKTtcblx0XHRcdFx0aWYgKCBzdmcgKSB7XG5cdFx0XHRcdFx0Ly8gT2JyYXogU1ZHIG5pZSB3Y3p5dHVqZSB6YXNvYsOzdyB6ZXduxJl0cnpueWNoIChjemNpb25layB6IHNpZWNpLCBvYnJhesOzdykg4oCUIHR5bGtvIGN6Y2lvbmtpIHN5c3RlbW93ZS5cblx0XHRcdFx0XHRjb25zdCBrb3BpYSA9IHN2Zy5jbG9uZU5vZGUoIHRydWUgKSBhcyBTVkdTVkdFbGVtZW50O1xuXHRcdFx0XHRcdGNvbnN0IHIgPSB1c3RhbFJvem1pYXIoIGtvcGlhICk7XG5cdFx0XHRcdFx0YWRyZXMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKCBuZXcgQmxvYiggWyBuZXcgWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKCBrb3BpYSApIF0sIHsgdHlwZTogXCJpbWFnZS9zdmcreG1sXCIgfSApICk7XG5cdFx0XHRcdFx0Y29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0XHRcdFx0aW1nLm9ubG9hZCA9ICgpID0+IHtcblx0XHRcdFx0XHRcdG9icmF6LmN1cnJlbnQgPSBpbWc7XG5cdFx0XHRcdFx0XHRyb3ptaWFyLmN1cnJlbnQgPSByO1xuXHRcdFx0XHRcdFx0ZG9wYXN1aigpO1xuXHRcdFx0XHRcdFx0emFwbGFudWooKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGltZy5zcmMgPSBhZHJlcztcblx0XHRcdFx0fSBlbHNlIGNvbnNvbGUud2FybiggXCJWZWN0b3JWaWV3cG9ydDogYnJhayA8c3ZnPiB3IMW6csOzZGxlXCIgKTtcblx0XHRcdH1cblxuXHRcdFx0ZG9wYXN1aigpO1xuXHRcdFx0ZG9jdW1lbnQuZm9udHMucmVhZHkudGhlbiggemFwbGFudWogKTtcblx0XHRcdGNvbnN0IHJvID0gbmV3IFJlc2l6ZU9ic2VydmVyKCAoKSA9PiB6YXBsYW51aigpICk7XG5cdFx0XHRyby5vYnNlcnZlKCBiICk7XG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRyby5kaXNjb25uZWN0KCk7XG5cdFx0XHRcdGlmICggcmFmLmN1cnJlbnQgIT09IG51bGwgKSBjYW5jZWxBbmltYXRpb25GcmFtZSggcmFmLmN1cnJlbnQgKTtcblx0XHRcdFx0aWYgKCBhZHJlcyAhPT0gbnVsbCApIFVSTC5yZXZva2VPYmplY3RVUkwoIGFkcmVzICk7XG5cdFx0XHR9O1xuXHRcdH0sIFsgcmVuZGVyZXIsIHBhaW50LCBzY2VuZSBdICk7XG5cblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdiBjbGFzcz1cInZpZXdwb3J0XCI+XG5cdFx0XHRcdDxkaXZcblx0XHRcdFx0XHRyZWY9e3B6LmJveH1cblx0XHRcdFx0XHRjbGFzcz17Y3goIFwidmlld3BvcnQtc3RvbFwiLCBwei5sb2NrZWQgJiYgXCJpcy1sb2NrZWRcIiApfVxuXHRcdFx0XHRcdHN0eWxlPXt7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kLFxuXHRcdFx0XHRcdFx0d2lkdGgsXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IGhlaWdodCA/PyBcIjEwMCVcIixcblx0XHRcdFx0XHRcdG1pbkhlaWdodDogaGVpZ2h0ID8gdW5kZWZpbmVkIDogXCIyMDBweFwiLFxuXHRcdFx0XHRcdH19XG5cdFx0XHRcdFx0b25XaGVlbD17cHouaGFuZGxlcnMub25XaGVlbH1cblx0XHRcdFx0XHRvblBvaW50ZXJEb3duPXtwei5oYW5kbGVycy5vblBvaW50ZXJEb3dufVxuXHRcdFx0XHRcdG9uUG9pbnRlck1vdmU9e3B6LmhhbmRsZXJzLm9uUG9pbnRlck1vdmV9XG5cdFx0XHRcdFx0b25Qb2ludGVyVXA9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cblx0XHRcdFx0XHRvblBvaW50ZXJDYW5jZWw9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cblx0XHRcdFx0XHRvbkRibENsaWNrPXtwei5sb2NrZWQgPyB1bmRlZmluZWQgOiBkb3Bhc3VqfVxuXHRcdFx0XHQ+XG5cdFx0XHRcdFx0PGJ1dHRvblxuXHRcdFx0XHRcdFx0dHlwZT1cImJ1dHRvblwiXG5cdFx0XHRcdFx0XHRjbGFzcz1cInZpZXdwb3J0LXphbWVrXCJcblx0XHRcdFx0XHRcdGFyaWEtbGFiZWw9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogc3TDs8WCXCIgOiBcIlphYmxva3VqIHN0w7PFglwifVxuXHRcdFx0XHRcdFx0dGl0bGU9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogcHJ6ZXN1d2FuaWUgaSB6b29tXCIgOiBcIlphYmxva3VqIChwcnpld2lqYW5pZSBzdHJvbnkpXCJ9XG5cdFx0XHRcdFx0XHRvblBvaW50ZXJEb3duPXsoIGUgKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuXHRcdFx0XHRcdFx0b25EYmxDbGljaz17KCBlICkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cblx0XHRcdFx0XHRcdG9uQ2xpY2s9e3B6LnRvZ2dsZUxvY2t9XG5cdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0e3B6LmxvY2tlZCA/IFwi8J+UklwiIDogXCLwn5STXCJ9XG5cdFx0XHRcdFx0PC9idXR0b24+XG5cblx0XHRcdFx0XHR7cmVuZGVyZXIgPT09IFwiU1ZHXCIgPyA8ZGl2IHJlZj17dHJlc2N9IGNsYXNzPVwidmlld3BvcnQtdHJlc2NcIj57Y2hpbGRyZW59PC9kaXY+IDogKFxuXHRcdFx0XHRcdFx0PD5cblx0XHRcdFx0XHRcdFx0PGNhbnZhcyByZWY9e3Bsb3Rub30gY2xhc3M9XCJ2aWV3cG9ydC1wbG90bm9cIiAvPlxuXHRcdFx0XHRcdFx0XHR7Y2hpbGRyZW4gIT09IHVuZGVmaW5lZCAmJiA8ZGl2IHJlZj17dHJlc2N9IGhpZGRlbj57Y2hpbGRyZW59PC9kaXY+fVxuXHRcdFx0XHRcdFx0PC8+XG5cdFx0XHRcdFx0KX1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9LFxuXHRwcnp5Z290dWosXG4pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQiw4Q0FBOEM7QUFDOUMsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7O0FBR2pELFNBQVMsU0FBUyxFQUFFLE1BQU0sUUFBUSxlQUFlO0FBQ2pELFNBQVMsTUFBTSxRQUFRLGtCQUFrQjtBQUN6QyxTQUFTLEVBQUUsUUFBUSwwQkFBMEI7QUFDN0MsU0FBUyxXQUFXLFFBQTZCLDZDQUE2QztBQUM5RixTQUFTLE9BQU8sUUFBUSxnREFBZ0Q7QUFDeEUsU0FBUyxVQUFVLFFBQVEsbUNBQW1DO0FBRTlELFNBQVMsYUFBYSxRQUFRLG9DQUFvQztBQUNsRSxTQUFTLGNBQWMsUUFBUSwyQ0FBMkM7QUFFMUUsU0FBUyxhQUFhLFFBQVEsZ0NBQWdDO0FBQzlELFNBQVMsYUFBYSxRQUFRLG9DQUFvQztBQUNsRSxTQUFTLGNBQWMsUUFBUSxzQ0FBc0M7QUFzRXJFLE1BQU0saUJBQWlCLE9BQU8sSUFBSSxDQUFFO0FBbUJwQyxxREFBcUQsR0FDckQsU0FBUyxPQUFRLENBQStELEVBQUUsTUFBYztFQUMvRixJQUFLLEVBQUUsTUFBTSxLQUFLLGFBQWEsRUFBRSxRQUFRLEtBQUssV0FBWTtJQUN6RCxNQUFNLElBQUksTUFBTyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sbURBQW1ELENBQUM7RUFDaEc7RUFDQSxPQUFPLEVBQUUsTUFBTSxJQUFJLEVBQUUs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