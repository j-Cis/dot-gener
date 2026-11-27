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
import { usePanZoom } from "@/site/client/hooks/pan-zoom.ts";
import { dotxCanvas, dotxModelZJsx, dotxSvg } from "@/site/screen/Dotx.render.tsx";
import { lociCanvas, lociModelZJsx, lociSvg } from "@/site/screen/Loci.render.tsx";
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
        if (p.renderer === "SVG") okno.children = lociSvg(model);
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
      {
        if (p.source !== undefined && p.children !== undefined) {
          throw new Error("VectorViewport (DOTX): źródło albo w source, albo jako dzieci — nie oba");
        }
        // graf z gotowym układem w `source` albo znaczniki <Dotx> jako dzieci
        const graf = p.source ?? dotxModelZJsx(p.children);
        if (p.renderer === "SVG") okno.children = dotxSvg(graf);
        else {
          okno.paint = [
            "DOTX",
            graf
          ];
          okno.scene = [
            graf.width,
            graf.height
          ];
        }
        return okno;
      }
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
        dotxCanvas({
          ...c,
          dane: m[1]
        });
        return;
      case "LOCI":
        lociCanvas({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudENoaWxkcmVuIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgeyBpc2xhbmQgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5pbXBvcnQgeyBjeCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2Nzcy9jeC50c1wiO1xuaW1wb3J0IHsgRE9QQVNPV0FOSUEsIHR5cGUgU3ZnUmVnaXN0cnlLZXkgfSBmcm9tIFwiQC9zaXRlL2NsaWVudC9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtc3ZnLnRzXCI7XG5pbXBvcnQgeyBSWVNVTktJIH0gZnJvbSBcIkAvc2l0ZS9jbGllbnQvcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50c1wiO1xuaW1wb3J0IHsgdXNlUGFuWm9vbSB9IGZyb20gXCJAL3NpdGUvY2xpZW50L2hvb2tzL3Bhbi16b29tLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uZWRHcmFwaCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvZG90eC9tb2RlbC50c1wiO1xuaW1wb3J0IHR5cGUgeyBMb2NpTW9kZWwgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvbW9kZWwudHNcIjtcbmltcG9ydCB0eXBlIHsgQ2FudmFzRHJhd0NvbnRleHQsIENhbnZhc0RyYXdlciB9IGZyb20gXCJAL3NpdGUvc2NyZWVuL2NhbnZhcy9kcmF3LWNvbnRleHQudHNcIjtcbmltcG9ydCB7IGRvdHhDYW52YXMsIGRvdHhNb2RlbFpKc3gsIGRvdHhTdmcgfSBmcm9tIFwiQC9zaXRlL3NjcmVlbi9Eb3R4LnJlbmRlci50c3hcIjtcbmltcG9ydCB7IGxvY2lDYW52YXMsIGxvY2lNb2RlbFpKc3gsIGxvY2lTdmcgfSBmcm9tIFwiQC9zaXRlL3NjcmVlbi9Mb2NpLnJlbmRlci50c3hcIjtcblxuLyoqIENTUyBsZW5ndGggZm9yIHRoZSBib3ggc2l6ZS4gKi9cbmV4cG9ydCB0eXBlIEJveExlbmd0aCA9IGAke251bWJlcn0ke1wicmVtXCIgfCBcImVtXCIgfCBcInB4XCIgfCBcIiVcIiB8IFwidndcIiB8IFwidmhcIn1gO1xuXG4vKiogVGVjaG5vbG9naWEgd3nFm3dpZXRsYW5pYS4gKi9cbmV4cG9ydCB0eXBlIFJlbmRlcmVyID0gXCJTVkdcIiB8IFwiQ2FudmFzXCI7XG5cbi8qKiBMb2dpY3pueSByb3ptaWFyIHNjZW55IFtzemVyb2tvxZvEhywgd3lzb2tvxZvEh10g4oCUIGRvIGRvcGFzb3dhbmlhIHdpZG9rdSAoZml0KS4gKi9cbmV4cG9ydCB0eXBlIFNjZW5lU2l6ZSA9IHJlYWRvbmx5IFsgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgXTtcblxuaW50ZXJmYWNlIEJveFByb3BzIHtcblx0LyoqIFTFgm8gc3RvxYJ1LCBkb3dvbG55IGtvbG9yIENTUy4gKi9cblx0YmFja2dyb3VuZD86IHN0cmluZztcblx0LyoqIFN6ZXJva2/Fm8SHLiBEb215xZtsbmllIFwiMTAwJVwiLiAqL1xuXHR3aWR0aD86IEJveExlbmd0aDtcblx0LyoqIFd5c29rb8WbxIcuIERvbXnFm2xuaWUgXCIxMDAlXCIgeiBtaW4taGVpZ2h0IDIwMHB4OyB3eXBlxYJuaWVuaWUgd3ltYWdhIHJvZHppY2EgeiB3eXNva2/Fm2NpxIUuICovXG5cdGhlaWdodD86IEJveExlbmd0aDtcblx0LyoqIExpbWl0eSBwb3dpxJlrc3plbmlhIHd6Z2zEmWRlbSB3aWRva3UgZG9wYXNvd2FuZWdvLiBEb215xZtsbmllIDAuMSDigKYgNTAuICovXG5cdG1pblNjYWxlPzogbnVtYmVyO1xuXHRtYXhTY2FsZT86IG51bWJlcjtcbn1cblxuLyoqIMW5csOzZMWCbyB3IGF0cnlidWNpZSBgc291cmNlYCAodHlwIFQpIGFsYm8gamFrbyBkemllY2kgKHR5cCBELCBkb215xZtsbmllIFQpIOKAlCBqZWRubyB6IGR3w7NjaC4gKi9cbnR5cGUgQXRyeWJ1dEFsYm9EemllY2k8RiBleHRlbmRzIHN0cmluZywgVCwgRCA9IFQ+ID1cblx0fCB7IHNvdXJjZUZvcm1hdDogRjsgc291cmNlOiBUOyBjaGlsZHJlbj86IG5ldmVyIH1cblx0fCB7IHNvdXJjZUZvcm1hdDogRjsgY2hpbGRyZW46IEQ7IHNvdXJjZT86IG5ldmVyIH07XG5cbi8qKiDFuXLDs2TFgm8gdHlsa28gdyBhdHJ5YnVjaWUgYHNvdXJjZWAuICovXG50eXBlIEF0cnlidXQ8RiBleHRlbmRzIHN0cmluZywgVD4gPSB7IHNvdXJjZUZvcm1hdDogRjsgc291cmNlOiBUOyBjaGlsZHJlbj86IG5ldmVyIH07XG5cbmV4cG9ydCB0eXBlIFZlY3RvclZpZXdwb3J0UHJvcHMgPVxuXHQmIEJveFByb3BzXG5cdCYgKFxuXHRcdHwgKEF0cnlidXRBbGJvRHppZWNpPFwiU1ZHXCIsIENvbXBvbmVudENoaWxkcmVuPiAmIHtcblx0XHRcdHJlbmRlcmVyOiBSZW5kZXJlcjtcblx0XHRcdC8qKiBEb3Bhc293YW5pZSB6IHJlZ2lzdHJpZXMvZm9yLWlzbGFuZC1zdmcudHMsIHVydWNoYW1pYW5lIHcgcHJ6ZWdsxIVkYXJjZSAodHlsa28gcmVuZGVyZXIgU1ZHKS4gKi9cblx0XHRcdGFkanVzdD86IFN2Z1JlZ2lzdHJ5S2V5O1xuXHRcdH0pXG5cdFx0fCAoQXRyeWJ1dEFsYm9EemllY2k8XCJMT0NJXCIsIENvbXBvbmVudENoaWxkcmVuPiAmIHsgcmVuZGVyZXI6IFJlbmRlcmVyIH0pXG5cdFx0fCAoQXRyeWJ1dEFsYm9EemllY2k8XCJET1RYXCIsIFBvc2l0aW9uZWRHcmFwaCwgQ29tcG9uZW50Q2hpbGRyZW4+ICYgeyByZW5kZXJlcjogUmVuZGVyZXIgfSlcblx0XHR8IChBdHJ5YnV0PFwiQ0FOVkFTXCIsIENhbnZhc0RyYXdlcj4gJiB7XG5cdFx0XHQvKiogUnlzdW5layBDYW52YXMgbmllIG1hIHBvc3RhY2kgU1ZHLiAqL1xuXHRcdFx0cmVuZGVyZXI6IFwiQ2FudmFzXCI7XG5cdFx0XHQvKiogRGFuZSBkbGEgcnlzdW5rdSAoSlNPTiksIHcgZnVua2NqaSBqYWtvIGBkYW5lYC4gKi9cblx0XHRcdGRhdGE/OiB1bmtub3duO1xuXHRcdFx0c2NlbmU6IFNjZW5lU2l6ZTtcblx0XHR9KVxuXHQpO1xuXG50eXBlIEtsdWN6UnlzdW5rdSA9IGtleW9mIHR5cGVvZiBSWVNVTktJO1xuY29uc3Qga2x1Y3plUnlzdW5rb3cgPSBPYmplY3Qua2V5cyggUllTVU5LSSApIGFzIEtsdWN6UnlzdW5rdVtdO1xuXG4vKiogQ28gcnlzdWplIHDFgsOzdG5vOiBTVkcgeiB1a3J5dGVqIHRyZcWbY2ksIGdyYWYgRE9UWCwgbW9kZWwgTE9DSSBhbGJvIHJ5c3VuZWsgeiBSWVNVTktJLiAqL1xudHlwZSBNYWxvd2FuaWUgPVxuXHR8IHJlYWRvbmx5IFsgcm9kemFqOiBcIlNWR1wiIF1cblx0fCByZWFkb25seSBbIHJvZHphajogXCJET1RYXCIsIGdyYWY6IFBvc2l0aW9uZWRHcmFwaCBdXG5cdHwgcmVhZG9ubHkgWyByb2R6YWo6IFwiTE9DSVwiLCBtb2RlbDogTG9jaU1vZGVsIF1cblx0fCByZWFkb25seSBbIHJvZHphajogXCJSWVNVTkVLXCIsIGtsdWN6OiBLbHVjelJ5c3Vua3UsIGRhbmU6IHVua25vd24gXTtcblxuLyoqIFByb3BzeSBwbyBwcnp5Z290b3dhbml1IG5hIHNlcndlcnplIOKAlCB0bywgY28gcHJ6ZWNob2R6aSBwcnpleiBKU09OIGRvIHByemVnbMSFZGFya2kuICovXG5pbnRlcmZhY2UgT2tubyBleHRlbmRzIEJveFByb3BzIHtcblx0cmVuZGVyZXI6IFJlbmRlcmVyO1xuXHQvKiogU1ZHOiByeXNvd2FuZSAocmVuZGVyZXIgU1ZHKSBhbGJvIHVrcnl0ZSDFunLDs2TFgm8gb2JyYXp1IChyZW5kZXJlciBDYW52YXMpLiAqL1xuXHRjaGlsZHJlbj86IENvbXBvbmVudENoaWxkcmVuO1xuXHRhZGp1c3Q/OiBTdmdSZWdpc3RyeUtleTtcblx0cGFpbnQ/OiBNYWxvd2FuaWU7XG5cdHNjZW5lPzogU2NlbmVTaXplO1xufVxuXG4vKiogxblyw7NkxYJvIHogYXRyeWJ1dHUgYWxibyB6IGR6aWVjaSDigJQgamVkbm8geiBkd8OzY2guICovXG5mdW5jdGlvbiB6cm9kbG8oIHA6IHsgc291cmNlPzogQ29tcG9uZW50Q2hpbGRyZW47IGNoaWxkcmVuPzogQ29tcG9uZW50Q2hpbGRyZW4gfSwgZm9ybWF0OiBzdHJpbmcgKTogQ29tcG9uZW50Q2hpbGRyZW4ge1xuXHRpZiAoIHAuc291cmNlICE9PSB1bmRlZmluZWQgJiYgcC5jaGlsZHJlbiAhPT0gdW5kZWZpbmVkICkge1xuXHRcdHRocm93IG5ldyBFcnJvciggYFZlY3RvclZpZXdwb3J0ICgke2Zvcm1hdH0pOiDFunLDs2TFgm8gYWxibyB3IHNvdXJjZSwgYWxibyBqYWtvIGR6aWVjaSDigJQgbmllIG9iYWAgKTtcblx0fVxuXHRyZXR1cm4gcC5zb3VyY2UgPz8gcC5jaGlsZHJlbjtcbn1cblxuLyoqIFNlcndlcjogd2VqxZtjaWUg4oaSIHByb3BzeSB3eXNweSAoYmV6IGZ1bmtjamkgaSBWTm9kZSB3IGF0cnlidXRhY2gpLiAqL1xuZnVuY3Rpb24gcHJ6eWdvdHVqKCBwOiBWZWN0b3JWaWV3cG9ydFByb3BzICk6IE9rbm8ge1xuXHRjb25zdCBva25vOiBPa25vID0geyByZW5kZXJlcjogcC5yZW5kZXJlciB9O1xuXHRpZiAoIHAuYmFja2dyb3VuZCAhPT0gdW5kZWZpbmVkICkgb2tuby5iYWNrZ3JvdW5kID0gcC5iYWNrZ3JvdW5kO1xuXHRpZiAoIHAud2lkdGggIT09IHVuZGVmaW5lZCApIG9rbm8ud2lkdGggPSBwLndpZHRoO1xuXHRpZiAoIHAuaGVpZ2h0ICE9PSB1bmRlZmluZWQgKSBva25vLmhlaWdodCA9IHAuaGVpZ2h0O1xuXHRpZiAoIHAubWluU2NhbGUgIT09IHVuZGVmaW5lZCApIG9rbm8ubWluU2NhbGUgPSBwLm1pblNjYWxlO1xuXHRpZiAoIHAubWF4U2NhbGUgIT09IHVuZGVmaW5lZCApIG9rbm8ubWF4U2NhbGUgPSBwLm1heFNjYWxlO1xuXG5cdHN3aXRjaCAoIHAuc291cmNlRm9ybWF0ICkge1xuXHRcdGNhc2UgXCJTVkdcIjoge1xuXHRcdFx0Ly8gdGVrc3QgdyBgc291cmNlYCA9IGdvdG93ZSB6bmFjem5pa2kgU1ZHIChucC4gcGxpayAuc3ZnIHphaW1wb3J0b3dhbnkgamFrbyB0ZWtzdClcblx0XHRcdGNvbnN0IHN2ZyA9IHR5cGVvZiBwLnNvdXJjZSA9PT0gXCJzdHJpbmdcIiA/IDxkaXYgc3R5bGU9XCJkaXNwbGF5OmNvbnRlbnRzXCIgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBwLnNvdXJjZSB9fSAvPiA6IHpyb2RsbyggcCwgXCJTVkdcIiApO1xuXHRcdFx0b2tuby5jaGlsZHJlbiA9IHN2Zztcblx0XHRcdGlmICggcC5yZW5kZXJlciA9PT0gXCJDYW52YXNcIiApIG9rbm8ucGFpbnQgPSBbIFwiU1ZHXCIgXTtcblx0XHRcdGVsc2UgaWYgKCBwLmFkanVzdCAhPT0gdW5kZWZpbmVkICkgb2tuby5hZGp1c3QgPSBwLmFkanVzdDtcblx0XHRcdHJldHVybiBva25vO1xuXHRcdH1cblx0XHRjYXNlIFwiTE9DSVwiOiB7XG5cdFx0XHRjb25zdCBtb2RlbCA9IGxvY2lNb2RlbFpKc3goIHpyb2RsbyggcCwgXCJMT0NJXCIgKSApO1xuXHRcdFx0aWYgKCBwLnJlbmRlcmVyID09PSBcIlNWR1wiICkgb2tuby5jaGlsZHJlbiA9IGxvY2lTdmcoIG1vZGVsICk7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc3QgWyBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZIF0gPSBtb2RlbC56YWtyZXM7XG5cdFx0XHRcdG9rbm8ucGFpbnQgPSBbIFwiTE9DSVwiLCBtb2RlbCBdO1xuXHRcdFx0XHRva25vLnNjZW5lID0gWyBtYXhYIC0gbWluWCwgbWF4WSAtIG1pblkgXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBva25vO1xuXHRcdH1cblx0XHRjYXNlIFwiRE9UWFwiOiB7XG5cdFx0XHRpZiAoIHAuc291cmNlICE9PSB1bmRlZmluZWQgJiYgcC5jaGlsZHJlbiAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoIFwiVmVjdG9yVmlld3BvcnQgKERPVFgpOiDFunLDs2TFgm8gYWxibyB3IHNvdXJjZSwgYWxibyBqYWtvIGR6aWVjaSDigJQgbmllIG9iYVwiICk7XG5cdFx0XHR9XG5cdFx0XHQvLyBncmFmIHogZ290b3d5bSB1a8WCYWRlbSB3IGBzb3VyY2VgIGFsYm8gem5hY3puaWtpIDxEb3R4PiBqYWtvIGR6aWVjaVxuXHRcdFx0Y29uc3QgZ3JhZiA9IHAuc291cmNlID8/IGRvdHhNb2RlbFpKc3goIHAuY2hpbGRyZW4gKTtcblx0XHRcdGlmICggcC5yZW5kZXJlciA9PT0gXCJTVkdcIiApIG9rbm8uY2hpbGRyZW4gPSBkb3R4U3ZnKCBncmFmICk7XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0b2tuby5wYWludCA9IFsgXCJET1RYXCIsIGdyYWYgXTtcblx0XHRcdFx0b2tuby5zY2VuZSA9IFsgZ3JhZi53aWR0aCwgZ3JhZi5oZWlnaHQgXTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBva25vO1xuXHRcdH1cblx0XHRjYXNlIFwiQ0FOVkFTXCI6IHtcblx0XHRcdGNvbnN0IHJ5c3VuZWsgPSBwLnNvdXJjZTtcblx0XHRcdGNvbnN0IGtsdWN6ID0ga2x1Y3plUnlzdW5rb3cuZmluZCggKCBrICkgPT4gUllTVU5LSVtrXSA9PT0gcnlzdW5layApO1xuXHRcdFx0aWYgKCBrbHVjeiA9PT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0YFZlY3RvclZpZXdwb3J0OiByeXN1bmVrIOKAniR7cnlzdW5lay5uYW1lIHx8IFwiKGJleiBuYXp3eSlcIn3igJ0gbmllIGplc3QgdyByZWdpc3RyaWVzL2Zvci1pc2xhbmQtY2FudmFzLnRzIChSWVNVTktJKSDigJQgcHJ6ZWdsxIVkYXJrYSBnbyBuaWUgZG9zdGFuaWVgLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdFx0b2tuby5wYWludCA9IFsgXCJSWVNVTkVLXCIsIGtsdWN6LCBwLmRhdGEgPz8gbnVsbCBdO1xuXHRcdFx0b2tuby5zY2VuZSA9IHAuc2NlbmU7XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHR9XG5cdH1cbn1cblxuY29uc3QgTElDWkJBID0gL15cXHMqW1xcZC5dKyhweCk/XFxzKiQvO1xuXG4vKiogUm96bWlhciBTVkc6IGF0cnlidXR5IHdpZHRoL2hlaWdodCAobGljemJ5KSwgaW5hY3plaiB2aWV3Qm94LCBpbmFjemVqIGRvbXnFm2xuZSAzMDDDlzE1MCBwcnplZ2zEhWRhcmtpLiAqL1xuZnVuY3Rpb24gcm96bWlhclN2Zyggc3ZnOiBTVkdTVkdFbGVtZW50ICk6IFNjZW5lU2l6ZSB7XG5cdGNvbnN0IHZiID0gKCBzdmcuZ2V0QXR0cmlidXRlKCBcInZpZXdCb3hcIiApID8/IFwiXCIgKS50cmltKCkuc3BsaXQoIC9bXFxzLF0rLyApLm1hcCggTnVtYmVyICk7XG5cdGNvbnN0IGxpY3piYSA9ICggYTogc3RyaW5nLCB6YXBhczogbnVtYmVyIHwgdW5kZWZpbmVkLCBkb215c2xuYTogbnVtYmVyICkgPT4ge1xuXHRcdGNvbnN0IHYgPSBzdmcuZ2V0QXR0cmlidXRlKCBhICk7XG5cdFx0cmV0dXJuIHYgIT09IG51bGwgJiYgTElDWkJBLnRlc3QoIHYgKSA/IHBhcnNlRmxvYXQoIHYgKSA6IHphcGFzID8/IGRvbXlzbG5hO1xuXHR9O1xuXHRyZXR1cm4gWyBsaWN6YmEoIFwid2lkdGhcIiwgdmIubGVuZ3RoID09PSA0ID8gdmJbMl0gOiB1bmRlZmluZWQsIDMwMCApLCBsaWN6YmEoIFwiaGVpZ2h0XCIsIHZiLmxlbmd0aCA9PT0gNCA/IHZiWzNdIDogdW5kZWZpbmVkLCAxNTAgKSBdO1xufVxuXG4vKiogQmV6IGxpY3pib3d5Y2ggd2lkdGgvaGVpZ2h0IChicmFrIGFsYm8gJSkgU1ZHIG5hIHN0b2xlIG5pZSBtYSByb3ptaWFydSDigJQgdXN0YWxhIGdvIHogdmlld0JveC4gKi9cbmZ1bmN0aW9uIHVzdGFsUm96bWlhciggc3ZnOiBTVkdTVkdFbGVtZW50ICk6IFNjZW5lU2l6ZSB7XG5cdGNvbnN0IHIgPSByb3ptaWFyU3ZnKCBzdmcgKTtcblx0aWYgKCAhTElDWkJBLnRlc3QoIHN2Zy5nZXRBdHRyaWJ1dGUoIFwid2lkdGhcIiApID8/IFwiXCIgKSB8fCAhTElDWkJBLnRlc3QoIHN2Zy5nZXRBdHRyaWJ1dGUoIFwiaGVpZ2h0XCIgKSA/PyBcIlwiICkgKSB7XG5cdFx0c3ZnLnNldEF0dHJpYnV0ZSggXCJ3aWR0aFwiLCBTdHJpbmcoIHJbMF0gKSApO1xuXHRcdHN2Zy5zZXRBdHRyaWJ1dGUoIFwiaGVpZ2h0XCIsIFN0cmluZyggclsxXSApICk7XG5cdH1cblx0cmV0dXJuIHI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzbGFuZChcblx0aW1wb3J0Lm1ldGEudXJsLFxuXHRmdW5jdGlvbiBWZWN0b3JWaWV3cG9ydChcblx0XHR7IHJlbmRlcmVyLCBjaGlsZHJlbiwgYWRqdXN0LCBwYWludCwgc2NlbmUsIGJhY2tncm91bmQsIHdpZHRoID0gXCIxMDAlXCIsIGhlaWdodCwgbWluU2NhbGUgPSAwLjEsIG1heFNjYWxlID0gNTAgfTogT2tubyxcblx0KSB7XG5cdFx0Y29uc3QgdHJlc2MgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KCBudWxsICk7XG5cdFx0Y29uc3QgcGxvdG5vID0gdXNlUmVmPEhUTUxDYW52YXNFbGVtZW50PiggbnVsbCApO1xuXHRcdGNvbnN0IHJhZiA9IHVzZVJlZjxudW1iZXIgfCBudWxsPiggbnVsbCApO1xuXHRcdC8qKiBTVkcg4oaSIENhbnZhczogb2JyYXogeiB1a3J5dGVqIHRyZcWbY2kgaSBqZWdvIHJvem1pYXIuICovXG5cdFx0Y29uc3Qgb2JyYXogPSB1c2VSZWY8SFRNTEltYWdlRWxlbWVudCB8IG51bGw+KCBudWxsICk7XG5cdFx0Y29uc3Qgcm96bWlhciA9IHVzZVJlZjxTY2VuZVNpemUgfCB1bmRlZmluZWQ+KCBzY2VuZSApO1xuXG5cdFx0Y29uc3QgbWFsdWogPSAoIG06IE1hbG93YW5pZSwgYzogQ2FudmFzRHJhd0NvbnRleHQgKSA9PiB7XG5cdFx0XHRzd2l0Y2ggKCBtWzBdICkge1xuXHRcdFx0XHRjYXNlIFwiU1ZHXCI6IHtcblx0XHRcdFx0XHRjb25zdCBbIHcsIGggXSA9IHJvem1pYXIuY3VycmVudCA/PyBbIDAsIDAgXTtcblx0XHRcdFx0XHRpZiAoIG9icmF6LmN1cnJlbnQgKSBjLmN0eC5kcmF3SW1hZ2UoIG9icmF6LmN1cnJlbnQsIDAsIDAsIHcsIGggKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FzZSBcIkRPVFhcIjpcblx0XHRcdFx0XHRkb3R4Q2FudmFzKCB7IC4uLmMsIGRhbmU6IG1bMV0gfSApO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0Y2FzZSBcIkxPQ0lcIjpcblx0XHRcdFx0XHRsb2NpQ2FudmFzKCB7IC4uLmMsIGRhbmU6IG1bMV0gfSApO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0Y2FzZSBcIlJZU1VORUtcIjoge1xuXHRcdFx0XHRcdGNvbnN0IHJ5c3VuZWs6IENhbnZhc0RyYXdlciB8IHVuZGVmaW5lZCA9IFJZU1VOS0lbbVsxXV07XG5cdFx0XHRcdFx0aWYgKCByeXN1bmVrICkgcnlzdW5layggeyAuLi5jLCBkYW5lOiBtWzJdIH0gKTtcblx0XHRcdFx0XHRlbHNlIGNvbnNvbGUud2FybiggYFZlY3RvclZpZXdwb3J0OiBicmFrIHJ5c3Vua3Ug4oCeJHttWzFdfeKAnSB3IFJZU1VOS0lgICk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdGNvbnN0IHJ5c3VqID0gKCkgPT4ge1xuXHRcdFx0cmFmLmN1cnJlbnQgPSBudWxsO1xuXHRcdFx0Y29uc3QgYiA9IHB6LmJveC5jdXJyZW50LCBlbCA9IHBsb3Ruby5jdXJyZW50O1xuXHRcdFx0aWYgKCAhYiB8fCAhZWwgfHwgIXBhaW50ICkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgY3R4ID0gZWwuZ2V0Q29udGV4dCggXCIyZFwiICk7XG5cdFx0XHRpZiAoICFjdHggKSByZXR1cm47XG5cblx0XHRcdGNvbnN0IGRwciA9IGdsb2JhbFRoaXMuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuXHRcdFx0Y29uc3QgdyA9IGIuY2xpZW50V2lkdGgsIGggPSBiLmNsaWVudEhlaWdodDtcblx0XHRcdGNvbnN0IHB3ID0gTWF0aC5tYXgoIDEsIE1hdGgucm91bmQoIHcgKiBkcHIgKSApLCBwaCA9IE1hdGgubWF4KCAxLCBNYXRoLnJvdW5kKCBoICogZHByICkgKTtcblx0XHRcdGlmICggZWwud2lkdGggIT09IHB3IHx8IGVsLmhlaWdodCAhPT0gcGggKSB7XG5cdFx0XHRcdGVsLndpZHRoID0gcHc7XG5cdFx0XHRcdGVsLmhlaWdodCA9IHBoO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCB2ID0gcHoudmlldy5jdXJyZW50O1xuXHRcdFx0Y3R4LnNhdmUoKTtcblx0XHRcdGN0eC5zZXRUcmFuc2Zvcm0oIGRwciwgMCwgMCwgZHByLCAwLCAwICk7XG5cdFx0XHRjdHguY2xlYXJSZWN0KCAwLCAwLCB3LCBoICk7XG5cdFx0XHRjdHgudHJhbnNsYXRlKCB2LngsIHYueSApO1xuXHRcdFx0Y3R4LnNjYWxlKCB2LnMsIHYucyApO1xuXHRcdFx0bWFsdWooIHBhaW50LCB7IGN0eCwgdmlldzogdiwgd2lkdGg6IHcsIGhlaWdodDogaCwgZHByIH0gKTtcblx0XHRcdGN0eC5yZXN0b3JlKCk7XG5cdFx0fTtcblxuXHRcdGNvbnN0IHphcGxhbnVqID0gKCkgPT4ge1xuXHRcdFx0aWYgKCByYWYuY3VycmVudCA9PT0gbnVsbCApIHJhZi5jdXJyZW50ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCByeXN1aiApO1xuXHRcdH07XG5cblx0XHQvKiogU1ZHOiBwcnplc3V3YSBpIHNrYWx1amUgdHJlxZvEhzsgQ2FudmFzOiByeXN1amUgb2Qgbm93YS4gKi9cblx0XHRjb25zdCB6bWlhbmEgPSAoKSA9PiB7XG5cdFx0XHRpZiAoIHJlbmRlcmVyID09PSBcIkNhbnZhc1wiICkgcmV0dXJuIHphcGxhbnVqKCk7XG5cdFx0XHRjb25zdCB7IHgsIHksIHMgfSA9IHB6LnZpZXcuY3VycmVudDtcblx0XHRcdGlmICggIXRyZXNjLmN1cnJlbnQgKSByZXR1cm47XG5cdFx0XHR0cmVzYy5jdXJyZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpIHNjYWxlKCR7c30pYDtcblx0XHRcdC8vIHBvd2nEmWtzemVuaWUgZGxhIHRyZcWbY2k6IGVsZW1lbnR5IHcgcHggZWtyYW51IChucC4ga29uc3RydWtjamEgTE9DSSkgZHppZWzEhSBwcnpleiBuaWUgc3fDs2ogcm96bWlhclxuXHRcdFx0dHJlc2MuY3VycmVudC5zdHlsZS5zZXRQcm9wZXJ0eSggXCItLXZ2LXNcIiwgU3RyaW5nKCBzICkgKTtcblx0XHR9O1xuXG5cdFx0Y29uc3QgcHogPSB1c2VQYW5ab29tKCB7IG1pblNjYWxlLCBtYXhTY2FsZSwgb25DaGFuZ2U6IHptaWFuYSB9ICk7XG5cblx0XHRjb25zdCBkb3Bhc3VqID0gKCkgPT4ge1xuXHRcdFx0aWYgKCByZW5kZXJlciA9PT0gXCJDYW52YXNcIiApIHtcblx0XHRcdFx0Y29uc3QgciA9IHJvem1pYXIuY3VycmVudDtcblx0XHRcdFx0aWYgKCByICkgcHouZml0VG8oIHJbMF0sIHJbMV0gKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc3QgYyA9IHRyZXNjLmN1cnJlbnQ7XG5cdFx0XHRpZiAoIGMgKSBwei5maXRUbyggYy5vZmZzZXRXaWR0aCwgYy5vZmZzZXRIZWlnaHQgKTtcblx0XHR9O1xuXG5cdFx0Ly8gU1ZHOiBkb3Bhc293YW5pZSB3aWRva3UgaSBvcGNqb25hbG5lIGRvcGFzb3dhbmllIHogcmVqZXN0cnVcblx0XHR1c2VFZmZlY3QoICgpID0+IHtcblx0XHRcdGlmICggcmVuZGVyZXIgIT09IFwiU1ZHXCIgKSByZXR1cm47XG5cdFx0XHRjb25zdCBzdmcgPSB0cmVzYy5jdXJyZW50Py5xdWVyeVNlbGVjdG9yPFNWR1NWR0VsZW1lbnQ+KCBcInN2Z1wiICk7XG5cdFx0XHRpZiAoIHN2ZyApIHVzdGFsUm96bWlhciggc3ZnICk7XG5cdFx0XHRkb3Bhc3VqKCk7XG5cdFx0XHRpZiAoICFhZGp1c3QgKSByZXR1cm47XG5cdFx0XHRkb2N1bWVudC5mb250cy5yZWFkeS50aGVuKCAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHN2ZyA9IHRyZXNjLmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3I8U1ZHU1ZHRWxlbWVudD4oIFwic3ZnXCIgKTtcblx0XHRcdFx0aWYgKCAhc3ZnICkgcmV0dXJuO1xuXHRcdFx0XHRjb25zdCBmID0gRE9QQVNPV0FOSUFbYWRqdXN0XTtcblx0XHRcdFx0aWYgKCBmICkgZiggc3ZnICk7XG5cdFx0XHRcdGVsc2UgY29uc29sZS53YXJuKCBgVmVjdG9yVmlld3BvcnQ6IG5pZXpuYW55IGFkanVzdD1cIiR7YWRqdXN0fVwiYCApO1xuXHRcdFx0fSApO1xuXHRcdH0sIFsgcmVuZGVyZXIsIGFkanVzdCBdICk7XG5cblx0XHQvLyBDYW52YXM6IG9icmF6IHogU1ZHIChnZHkgdHJ6ZWJhKSwgZG9wYXNvd2FuaWUsIHJ5c293YW5pZSBwcnp5IHptaWFuaWUgcm96bWlhcnVcblx0XHR1c2VFZmZlY3QoICgpID0+IHtcblx0XHRcdGlmICggcmVuZGVyZXIgIT09IFwiQ2FudmFzXCIgKSByZXR1cm47XG5cdFx0XHRjb25zdCBiID0gcHouYm94LmN1cnJlbnQ7XG5cdFx0XHRpZiAoICFiICkgcmV0dXJuO1xuXHRcdFx0bGV0IGFkcmVzOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuXHRcdFx0aWYgKCBwYWludD8uWzBdID09PSBcIlNWR1wiICkge1xuXHRcdFx0XHRjb25zdCBzdmcgPSB0cmVzYy5jdXJyZW50Py5xdWVyeVNlbGVjdG9yPFNWR1NWR0VsZW1lbnQ+KCBcInN2Z1wiICk7XG5cdFx0XHRcdGlmICggc3ZnICkge1xuXHRcdFx0XHRcdC8vIE9icmF6IFNWRyBuaWUgd2N6eXR1amUgemFzb2LDs3cgemV3bsSZdHJ6bnljaCAoY3pjaW9uZWsgeiBzaWVjaSwgb2JyYXrDs3cpIOKAlCB0eWxrbyBjemNpb25raSBzeXN0ZW1vd2UuXG5cdFx0XHRcdFx0Y29uc3Qga29waWEgPSBzdmcuY2xvbmVOb2RlKCB0cnVlICkgYXMgU1ZHU1ZHRWxlbWVudDtcblx0XHRcdFx0XHRjb25zdCByID0gdXN0YWxSb3ptaWFyKCBrb3BpYSApO1xuXHRcdFx0XHRcdGFkcmVzID0gVVJMLmNyZWF0ZU9iamVjdFVSTCggbmV3IEJsb2IoIFsgbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZygga29waWEgKSBdLCB7IHR5cGU6IFwiaW1hZ2Uvc3ZnK3htbFwiIH0gKSApO1xuXHRcdFx0XHRcdGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0XHRcdGltZy5vbmxvYWQgPSAoKSA9PiB7XG5cdFx0XHRcdFx0XHRvYnJhei5jdXJyZW50ID0gaW1nO1xuXHRcdFx0XHRcdFx0cm96bWlhci5jdXJyZW50ID0gcjtcblx0XHRcdFx0XHRcdGRvcGFzdWooKTtcblx0XHRcdFx0XHRcdHphcGxhbnVqKCk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRpbWcuc3JjID0gYWRyZXM7XG5cdFx0XHRcdH0gZWxzZSBjb25zb2xlLndhcm4oIFwiVmVjdG9yVmlld3BvcnQ6IGJyYWsgPHN2Zz4gdyDFunLDs2RsZVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdGRvcGFzdWooKTtcblx0XHRcdGRvY3VtZW50LmZvbnRzLnJlYWR5LnRoZW4oIHphcGxhbnVqICk7XG5cdFx0XHRjb25zdCBybyA9IG5ldyBSZXNpemVPYnNlcnZlciggKCkgPT4gemFwbGFudWooKSApO1xuXHRcdFx0cm8ub2JzZXJ2ZSggYiApO1xuXHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0cm8uZGlzY29ubmVjdCgpO1xuXHRcdFx0XHRpZiAoIHJhZi5jdXJyZW50ICE9PSBudWxsICkgY2FuY2VsQW5pbWF0aW9uRnJhbWUoIHJhZi5jdXJyZW50ICk7XG5cdFx0XHRcdGlmICggYWRyZXMgIT09IG51bGwgKSBVUkwucmV2b2tlT2JqZWN0VVJMKCBhZHJlcyApO1xuXHRcdFx0fTtcblx0XHR9LCBbIHJlbmRlcmVyLCBwYWludCwgc2NlbmUgXSApO1xuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxkaXYgY2xhc3M9XCJ2aWV3cG9ydFwiPlxuXHRcdFx0XHQ8ZGl2XG5cdFx0XHRcdFx0cmVmPXtwei5ib3h9XG5cdFx0XHRcdFx0Y2xhc3M9e2N4KCBcInZpZXdwb3J0LXN0b2xcIiwgcHoubG9ja2VkICYmIFwiaXMtbG9ja2VkXCIgKX1cblx0XHRcdFx0XHRzdHlsZT17e1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZCxcblx0XHRcdFx0XHRcdHdpZHRoLFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBoZWlnaHQgPz8gXCIxMDAlXCIsXG5cdFx0XHRcdFx0XHRtaW5IZWlnaHQ6IGhlaWdodCA/IHVuZGVmaW5lZCA6IFwiMjAwcHhcIixcblx0XHRcdFx0XHR9fVxuXHRcdFx0XHRcdG9uV2hlZWw9e3B6LmhhbmRsZXJzLm9uV2hlZWx9XG5cdFx0XHRcdFx0b25Qb2ludGVyRG93bj17cHouaGFuZGxlcnMub25Qb2ludGVyRG93bn1cblx0XHRcdFx0XHRvblBvaW50ZXJNb3ZlPXtwei5oYW5kbGVycy5vblBvaW50ZXJNb3ZlfVxuXHRcdFx0XHRcdG9uUG9pbnRlclVwPXtwei5oYW5kbGVycy5vblBvaW50ZXJFbmR9XG5cdFx0XHRcdFx0b25Qb2ludGVyQ2FuY2VsPXtwei5oYW5kbGVycy5vblBvaW50ZXJFbmR9XG5cdFx0XHRcdFx0b25EYmxDbGljaz17cHoubG9ja2VkID8gdW5kZWZpbmVkIDogZG9wYXN1an1cblx0XHRcdFx0PlxuXHRcdFx0XHRcdDxidXR0b25cblx0XHRcdFx0XHRcdHR5cGU9XCJidXR0b25cIlxuXHRcdFx0XHRcdFx0Y2xhc3M9XCJ2aWV3cG9ydC16YW1la1wiXG5cdFx0XHRcdFx0XHRhcmlhLWxhYmVsPXtwei5sb2NrZWQgPyBcIk9kYmxva3VqIHN0w7PFglwiIDogXCJaYWJsb2t1aiBzdMOzxYJcIn1cblx0XHRcdFx0XHRcdHRpdGxlPXtwei5sb2NrZWQgPyBcIk9kYmxva3VqIHByemVzdXdhbmllIGkgem9vbVwiIDogXCJaYWJsb2t1aiAocHJ6ZXdpamFuaWUgc3Ryb255KVwifVxuXHRcdFx0XHRcdFx0b25Qb2ludGVyRG93bj17KCBlICkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cblx0XHRcdFx0XHRcdG9uRGJsQ2xpY2s9eyggZSApID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG5cdFx0XHRcdFx0XHRvbkNsaWNrPXtwei50b2dnbGVMb2NrfVxuXHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdHtwei5sb2NrZWQgPyBcIvCflJJcIiA6IFwi8J+Uk1wifVxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXG5cdFx0XHRcdFx0e3JlbmRlcmVyID09PSBcIlNWR1wiID8gPGRpdiByZWY9e3RyZXNjfSBjbGFzcz1cInZpZXdwb3J0LXRyZXNjXCI+e2NoaWxkcmVufTwvZGl2PiA6IChcblx0XHRcdFx0XHRcdDw+XG5cdFx0XHRcdFx0XHRcdDxjYW52YXMgcmVmPXtwbG90bm99IGNsYXNzPVwidmlld3BvcnQtcGxvdG5vXCIgLz5cblx0XHRcdFx0XHRcdFx0e2NoaWxkcmVuICE9PSB1bmRlZmluZWQgJiYgPGRpdiByZWY9e3RyZXNjfSBoaWRkZW4+e2NoaWxkcmVufTwvZGl2Pn1cblx0XHRcdFx0XHRcdDwvPlxuXHRcdFx0XHRcdCl9XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0PC9kaXY+XG5cdFx0KTtcblx0fSxcblx0cHJ6eWdvdHVqLFxuKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsOENBQThDO0FBQzlDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEOztBQUdqRCxTQUFTLFNBQVMsRUFBRSxNQUFNLFFBQVEsZUFBZTtBQUNqRCxTQUFTLE1BQU0sUUFBUSxrQkFBa0I7QUFDekMsU0FBUyxFQUFFLFFBQVEsMEJBQTBCO0FBQzdDLFNBQVMsV0FBVyxRQUE2Qiw2Q0FBNkM7QUFDOUYsU0FBUyxPQUFPLFFBQVEsZ0RBQWdEO0FBQ3hFLFNBQVMsVUFBVSxRQUFRLGtDQUFrQztBQUk3RCxTQUFTLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxRQUFRLGdDQUFnQztBQUNuRixTQUFTLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxRQUFRLGdDQUFnQztBQW1EbkYsTUFBTSxpQkFBaUIsT0FBTyxJQUFJLENBQUU7QUFtQnBDLHFEQUFxRCxHQUNyRCxTQUFTLE9BQVEsQ0FBK0QsRUFBRSxNQUFjO0VBQy9GLElBQUssRUFBRSxNQUFNLEtBQUssYUFBYSxFQUFFLFFBQVEsS0FBSyxXQUFZO0lBQ3pELE1BQU0sSUFBSSxNQUFPLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxtREFBbUQsQ0FBQztFQUNoRztFQUNBLE9BQU8sRUFBRSxNQUFNLElBQUksRUFBRSxRQUFRO0FBQzlCO0FBRUEsdUVBQXVFLEdBQ3ZFLFNBQVMsVUFBVyxDQUFzQjtFQUN6QyxNQUFNLE9BQWE7SUFBRSxVQUFVLEVBQUUsUUFBUTtFQUFDO0VBQzFDLElBQUssRUFBRSxVQUFVLEtBQUssV0FBWSxLQUFLLFVBQVUsR0FBRyxFQUFFLFVBQVU7RUFDaEUsSUFBSyxFQUFFLEtBQUssS0FBSyxXQUFZLEtBQUssS0FBSyxHQUFHLEVBQUUsS0FBSztFQUNqRCxJQUFLLEVBQUUsTUFBTSxLQUFLLFdBQVksS0FBSyxN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