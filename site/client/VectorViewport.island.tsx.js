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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvY2xpZW50L1ZlY3RvclZpZXdwb3J0LmlzbGFuZC50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudENoaWxkcmVuIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgeyBpc2xhbmQgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5pbXBvcnQgeyBjeCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2Nzcy9jeC50c1wiO1xuaW1wb3J0IHsgRE9QQVNPV0FOSUEsIHR5cGUgU3ZnUmVnaXN0cnlLZXkgfSBmcm9tIFwiQC9zaXRlL2NsaWVudC9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtc3ZnLnRzXCI7XG5pbXBvcnQgeyBSWVNVTktJIH0gZnJvbSBcIkAvc2l0ZS9jbGllbnQvcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50c1wiO1xuaW1wb3J0IHsgdXNlUGFuWm9vbSB9IGZyb20gXCJAL3NpdGUvY2xpZW50L2hvb2tzL3Bhbi16b29tLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uZWRHcmFwaCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvZG90eC9tb2RlbC50c1wiO1xuaW1wb3J0IHR5cGUgeyBDYW52YXNEcmF3Q29udGV4dCwgQ2FudmFzRHJhd2VyIH0gZnJvbSBcIkAvc2l0ZS9zY3JlZW4vY2FudmFzL2RyYXctY29udGV4dC50c1wiO1xuaW1wb3J0IHsgZG90eENhbnZhcywgZG90eE1vZGVsWkpzeCwgZG90eFN2ZyB9IGZyb20gXCJAL3NpdGUvc2NyZWVuL0RvdHgucmVuZGVyLnRzeFwiO1xuaW1wb3J0IHsgbG9jaUNhbnZhcywgbG9jaU1vZGVsWkpzeCwgbG9jaVN2ZyB9IGZyb20gXCJAL3NpdGUvc2NyZWVuL0xvY2kucmVuZGVyLnRzeFwiO1xuXG4vKiogQ1NTIGxlbmd0aCBmb3IgdGhlIGJveCBzaXplLiAqL1xuZXhwb3J0IHR5cGUgQm94TGVuZ3RoID0gYCR7bnVtYmVyfSR7XCJyZW1cIiB8IFwiZW1cIiB8IFwicHhcIiB8IFwiJVwiIHwgXCJ2d1wiIHwgXCJ2aFwifWA7XG5cbi8qKiBUZWNobm9sb2dpYSB3ecWbd2lldGxhbmlhLiAqL1xuZXhwb3J0IHR5cGUgUmVuZGVyZXIgPSBcIlNWR1wiIHwgXCJDYW52YXNcIjtcblxuLyoqIExvZ2ljem55IHJvem1pYXIgc2NlbnkgW3N6ZXJva2/Fm8SHLCB3eXNva2/Fm8SHXSDigJQgZG8gZG9wYXNvd2FuaWEgd2lkb2t1IChmaXQpLiAqL1xuZXhwb3J0IHR5cGUgU2NlbmVTaXplID0gcmVhZG9ubHkgWyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciBdO1xuXG5pbnRlcmZhY2UgQm94UHJvcHMge1xuXHQvKiogVMWCbyBzdG/FgnUsIGRvd29sbnkga29sb3IgQ1NTLiAqL1xuXHRiYWNrZ3JvdW5kPzogc3RyaW5nO1xuXHQvKiogU3plcm9rb8WbxIcuIERvbXnFm2xuaWUgXCIxMDAlXCIuICovXG5cdHdpZHRoPzogQm94TGVuZ3RoO1xuXHQvKiogV3lzb2tvxZvEhy4gRG9tecWbbG5pZSBcIjEwMCVcIiB6IG1pbi1oZWlnaHQgMjAwcHg7IHd5cGXFgm5pZW5pZSB3eW1hZ2Egcm9kemljYSB6IHd5c29rb8WbY2nEhS4gKi9cblx0aGVpZ2h0PzogQm94TGVuZ3RoO1xuXHQvKiogTGltaXR5IHBvd2nEmWtzemVuaWEgd3pnbMSZZGVtIHdpZG9rdSBkb3Bhc293YW5lZ28uIERvbXnFm2xuaWUgMC4xIOKApiA1MC4gKi9cblx0bWluU2NhbGU/OiBudW1iZXI7XG5cdG1heFNjYWxlPzogbnVtYmVyO1xufVxuXG4vKiogxblyw7NkxYJvIHcgYXRyeWJ1Y2llIGBzb3VyY2VgICh0eXAgVCkgYWxibyBqYWtvIGR6aWVjaSAodHlwIEQsIGRvbXnFm2xuaWUgVCkg4oCUIGplZG5vIHogZHfDs2NoLiAqL1xudHlwZSBBdHJ5YnV0QWxib0R6aWVjaTxGIGV4dGVuZHMgc3RyaW5nLCBULCBEID0gVD4gPVxuXHR8IHsgc291cmNlRm9ybWF0OiBGOyBzb3VyY2U6IFQ7IGNoaWxkcmVuPzogbmV2ZXIgfVxuXHR8IHsgc291cmNlRm9ybWF0OiBGOyBjaGlsZHJlbjogRDsgc291cmNlPzogbmV2ZXIgfTtcblxuLyoqIMW5csOzZMWCbyB0eWxrbyB3IGF0cnlidWNpZSBgc291cmNlYC4gKi9cbnR5cGUgQXRyeWJ1dDxGIGV4dGVuZHMgc3RyaW5nLCBUPiA9IHsgc291cmNlRm9ybWF0OiBGOyBzb3VyY2U6IFQ7IGNoaWxkcmVuPzogbmV2ZXIgfTtcblxuZXhwb3J0IHR5cGUgVmVjdG9yVmlld3BvcnRQcm9wcyA9XG5cdCYgQm94UHJvcHNcblx0JiAoXG5cdFx0fCAoQXRyeWJ1dEFsYm9EemllY2k8XCJTVkdcIiwgQ29tcG9uZW50Q2hpbGRyZW4+ICYge1xuXHRcdFx0cmVuZGVyZXI6IFJlbmRlcmVyO1xuXHRcdFx0LyoqIERvcGFzb3dhbmllIHogcmVnaXN0cmllcy9mb3ItaXNsYW5kLXN2Zy50cywgdXJ1Y2hhbWlhbmUgdyBwcnplZ2zEhWRhcmNlICh0eWxrbyByZW5kZXJlciBTVkcpLiAqL1xuXHRcdFx0YWRqdXN0PzogU3ZnUmVnaXN0cnlLZXk7XG5cdFx0fSlcblx0XHR8IChBdHJ5YnV0QWxib0R6aWVjaTxcIkxPQ0lcIiwgQ29tcG9uZW50Q2hpbGRyZW4+ICYgeyByZW5kZXJlcjogUmVuZGVyZXIgfSlcblx0XHR8IChBdHJ5YnV0QWxib0R6aWVjaTxcIkRPVFhcIiwgUG9zaXRpb25lZEdyYXBoLCBDb21wb25lbnRDaGlsZHJlbj4gJiB7IHJlbmRlcmVyOiBSZW5kZXJlciB9KVxuXHRcdHwgKEF0cnlidXQ8XCJDQU5WQVNcIiwgQ2FudmFzRHJhd2VyPiAmIHtcblx0XHRcdC8qKiBSeXN1bmVrIENhbnZhcyBuaWUgbWEgcG9zdGFjaSBTVkcuICovXG5cdFx0XHRyZW5kZXJlcjogXCJDYW52YXNcIjtcblx0XHRcdC8qKiBEYW5lIGRsYSByeXN1bmt1IChKU09OKSwgdyBmdW5rY2ppIGpha28gYGRhbmVgLiAqL1xuXHRcdFx0ZGF0YT86IHVua25vd247XG5cdFx0XHRzY2VuZTogU2NlbmVTaXplO1xuXHRcdH0pXG5cdCk7XG5cbi8qKiBNb2RlbCBMT0NJIOKAlCB0eXAgd3luaWt1IGludGVycHJldGVyYSB6IHBsaWt1IGfFgsOzd25lZ28gTG9jaS5yZW5kZXIudHN4LiAqL1xudHlwZSBMb2NpTW9kZWwgPSBSZXR1cm5UeXBlPHR5cGVvZiBsb2NpTW9kZWxaSnN4PjtcblxudHlwZSBLbHVjelJ5c3Vua3UgPSBrZXlvZiB0eXBlb2YgUllTVU5LSTtcbmNvbnN0IGtsdWN6ZVJ5c3Vua293ID0gT2JqZWN0LmtleXMoIFJZU1VOS0kgKSBhcyBLbHVjelJ5c3Vua3VbXTtcblxuLyoqIENvIHJ5c3VqZSBwxYLDs3RubzogU1ZHIHogdWtyeXRlaiB0cmXFm2NpLCBncmFmIERPVFgsIG1vZGVsIExPQ0kgYWxibyByeXN1bmVrIHogUllTVU5LSS4gKi9cbnR5cGUgTWFsb3dhbmllID1cblx0fCByZWFkb25seSBbIHJvZHphajogXCJTVkdcIiBdXG5cdHwgcmVhZG9ubHkgWyByb2R6YWo6IFwiRE9UWFwiLCBncmFmOiBQb3NpdGlvbmVkR3JhcGggXVxuXHR8IHJlYWRvbmx5IFsgcm9kemFqOiBcIkxPQ0lcIiwgbW9kZWw6IExvY2lNb2RlbCBdXG5cdHwgcmVhZG9ubHkgWyByb2R6YWo6IFwiUllTVU5FS1wiLCBrbHVjejogS2x1Y3pSeXN1bmt1LCBkYW5lOiB1bmtub3duIF07XG5cbi8qKiBQcm9wc3kgcG8gcHJ6eWdvdG93YW5pdSBuYSBzZXJ3ZXJ6ZSDigJQgdG8sIGNvIHByemVjaG9kemkgcHJ6ZXogSlNPTiBkbyBwcnplZ2zEhWRhcmtpLiAqL1xuaW50ZXJmYWNlIE9rbm8gZXh0ZW5kcyBCb3hQcm9wcyB7XG5cdHJlbmRlcmVyOiBSZW5kZXJlcjtcblx0LyoqIFNWRzogcnlzb3dhbmUgKHJlbmRlcmVyIFNWRykgYWxibyB1a3J5dGUgxbpyw7NkxYJvIG9icmF6dSAocmVuZGVyZXIgQ2FudmFzKS4gKi9cblx0Y2hpbGRyZW4/OiBDb21wb25lbnRDaGlsZHJlbjtcblx0YWRqdXN0PzogU3ZnUmVnaXN0cnlLZXk7XG5cdHBhaW50PzogTWFsb3dhbmllO1xuXHRzY2VuZT86IFNjZW5lU2l6ZTtcbn1cblxuLyoqIMW5csOzZMWCbyB6IGF0cnlidXR1IGFsYm8geiBkemllY2kg4oCUIGplZG5vIHogZHfDs2NoLiAqL1xuZnVuY3Rpb24genJvZGxvKCBwOiB7IHNvdXJjZT86IENvbXBvbmVudENoaWxkcmVuOyBjaGlsZHJlbj86IENvbXBvbmVudENoaWxkcmVuIH0sIGZvcm1hdDogc3RyaW5nICk6IENvbXBvbmVudENoaWxkcmVuIHtcblx0aWYgKCBwLnNvdXJjZSAhPT0gdW5kZWZpbmVkICYmIHAuY2hpbGRyZW4gIT09IHVuZGVmaW5lZCApIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoIGBWZWN0b3JWaWV3cG9ydCAoJHtmb3JtYXR9KTogxbpyw7NkxYJvIGFsYm8gdyBzb3VyY2UsIGFsYm8gamFrbyBkemllY2kg4oCUIG5pZSBvYmFgICk7XG5cdH1cblx0cmV0dXJuIHAuc291cmNlID8/IHAuY2hpbGRyZW47XG59XG5cbi8qKiBTZXJ3ZXI6IHdlasWbY2llIOKGkiBwcm9wc3kgd3lzcHkgKGJleiBmdW5rY2ppIGkgVk5vZGUgdyBhdHJ5YnV0YWNoKS4gKi9cbmZ1bmN0aW9uIHByenlnb3R1aiggcDogVmVjdG9yVmlld3BvcnRQcm9wcyApOiBPa25vIHtcblx0Y29uc3Qgb2tubzogT2tubyA9IHsgcmVuZGVyZXI6IHAucmVuZGVyZXIgfTtcblx0aWYgKCBwLmJhY2tncm91bmQgIT09IHVuZGVmaW5lZCApIG9rbm8uYmFja2dyb3VuZCA9IHAuYmFja2dyb3VuZDtcblx0aWYgKCBwLndpZHRoICE9PSB1bmRlZmluZWQgKSBva25vLndpZHRoID0gcC53aWR0aDtcblx0aWYgKCBwLmhlaWdodCAhPT0gdW5kZWZpbmVkICkgb2tuby5oZWlnaHQgPSBwLmhlaWdodDtcblx0aWYgKCBwLm1pblNjYWxlICE9PSB1bmRlZmluZWQgKSBva25vLm1pblNjYWxlID0gcC5taW5TY2FsZTtcblx0aWYgKCBwLm1heFNjYWxlICE9PSB1bmRlZmluZWQgKSBva25vLm1heFNjYWxlID0gcC5tYXhTY2FsZTtcblxuXHRzd2l0Y2ggKCBwLnNvdXJjZUZvcm1hdCApIHtcblx0XHRjYXNlIFwiU1ZHXCI6IHtcblx0XHRcdC8vIHRla3N0IHcgYHNvdXJjZWAgPSBnb3Rvd2Ugem5hY3puaWtpIFNWRyAobnAuIHBsaWsgLnN2ZyB6YWltcG9ydG93YW55IGpha28gdGVrc3QpXG5cdFx0XHRjb25zdCBzdmcgPSB0eXBlb2YgcC5zb3VyY2UgPT09IFwic3RyaW5nXCIgPyA8ZGl2IHN0eWxlPVwiZGlzcGxheTpjb250ZW50c1wiIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcC5zb3VyY2UgfX0gLz4gOiB6cm9kbG8oIHAsIFwiU1ZHXCIgKTtcblx0XHRcdG9rbm8uY2hpbGRyZW4gPSBzdmc7XG5cdFx0XHRpZiAoIHAucmVuZGVyZXIgPT09IFwiQ2FudmFzXCIgKSBva25vLnBhaW50ID0gWyBcIlNWR1wiIF07XG5cdFx0XHRlbHNlIGlmICggcC5hZGp1c3QgIT09IHVuZGVmaW5lZCApIG9rbm8uYWRqdXN0ID0gcC5hZGp1c3Q7XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHR9XG5cdFx0Y2FzZSBcIkxPQ0lcIjoge1xuXHRcdFx0Y29uc3QgbW9kZWwgPSBsb2NpTW9kZWxaSnN4KCB6cm9kbG8oIHAsIFwiTE9DSVwiICkgKTtcblx0XHRcdGlmICggcC5yZW5kZXJlciA9PT0gXCJTVkdcIiApIG9rbm8uY2hpbGRyZW4gPSBsb2NpU3ZnKCBtb2RlbCApO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnN0IFsgbWluWCwgbWluWSwgbWF4WCwgbWF4WSBdID0gbW9kZWwuemFrcmVzO1xuXHRcdFx0XHRva25vLnBhaW50ID0gWyBcIkxPQ0lcIiwgbW9kZWwgXTtcblx0XHRcdFx0b2tuby5zY2VuZSA9IFsgbWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZIF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHR9XG5cdFx0Y2FzZSBcIkRPVFhcIjoge1xuXHRcdFx0aWYgKCBwLnNvdXJjZSAhPT0gdW5kZWZpbmVkICYmIHAuY2hpbGRyZW4gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCBcIlZlY3RvclZpZXdwb3J0IChET1RYKTogxbpyw7NkxYJvIGFsYm8gdyBzb3VyY2UsIGFsYm8gamFrbyBkemllY2kg4oCUIG5pZSBvYmFcIiApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gZ3JhZiB6IGdvdG93eW0gdWvFgmFkZW0gdyBgc291cmNlYCBhbGJvIHpuYWN6bmlraSA8RG90eD4gamFrbyBkemllY2lcblx0XHRcdGNvbnN0IGdyYWYgPSBwLnNvdXJjZSA/PyBkb3R4TW9kZWxaSnN4KCBwLmNoaWxkcmVuICk7XG5cdFx0XHRpZiAoIHAucmVuZGVyZXIgPT09IFwiU1ZHXCIgKSBva25vLmNoaWxkcmVuID0gZG90eFN2ZyggZ3JhZiApO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG9rbm8ucGFpbnQgPSBbIFwiRE9UWFwiLCBncmFmIF07XG5cdFx0XHRcdG9rbm8uc2NlbmUgPSBbIGdyYWYud2lkdGgsIGdyYWYuaGVpZ2h0IF07XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2tubztcblx0XHR9XG5cdFx0Y2FzZSBcIkNBTlZBU1wiOiB7XG5cdFx0XHRjb25zdCByeXN1bmVrID0gcC5zb3VyY2U7XG5cdFx0XHRjb25zdCBrbHVjeiA9IGtsdWN6ZVJ5c3Vua293LmZpbmQoICggayApID0+IFJZU1VOS0lba10gPT09IHJ5c3VuZWsgKTtcblx0XHRcdGlmICgga2x1Y3ogPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdGBWZWN0b3JWaWV3cG9ydDogcnlzdW5layDigJ4ke3J5c3VuZWsubmFtZSB8fCBcIihiZXogbmF6d3kpXCJ94oCdIG5pZSBqZXN0IHcgcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50cyAoUllTVU5LSSkg4oCUIHByemVnbMSFZGFya2EgZ28gbmllIGRvc3RhbmllYCxcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdG9rbm8ucGFpbnQgPSBbIFwiUllTVU5FS1wiLCBrbHVjeiwgcC5kYXRhID8/IG51bGwgXTtcblx0XHRcdG9rbm8uc2NlbmUgPSBwLnNjZW5lO1xuXHRcdFx0cmV0dXJuIG9rbm87XG5cdFx0fVxuXHR9XG59XG5cbmNvbnN0IExJQ1pCQSA9IC9eXFxzKltcXGQuXSsocHgpP1xccyokLztcblxuLyoqIFJvem1pYXIgU1ZHOiBhdHJ5YnV0eSB3aWR0aC9oZWlnaHQgKGxpY3pieSksIGluYWN6ZWogdmlld0JveCwgaW5hY3plaiBkb215xZtsbmUgMzAww5cxNTAgcHJ6ZWdsxIVkYXJraS4gKi9cbmZ1bmN0aW9uIHJvem1pYXJTdmcoIHN2ZzogU1ZHU1ZHRWxlbWVudCApOiBTY2VuZVNpemUge1xuXHRjb25zdCB2YiA9ICggc3ZnLmdldEF0dHJpYnV0ZSggXCJ2aWV3Qm94XCIgKSA/PyBcIlwiICkudHJpbSgpLnNwbGl0KCAvW1xccyxdKy8gKS5tYXAoIE51bWJlciApO1xuXHRjb25zdCBsaWN6YmEgPSAoIGE6IHN0cmluZywgemFwYXM6IG51bWJlciB8IHVuZGVmaW5lZCwgZG9teXNsbmE6IG51bWJlciApID0+IHtcblx0XHRjb25zdCB2ID0gc3ZnLmdldEF0dHJpYnV0ZSggYSApO1xuXHRcdHJldHVybiB2ICE9PSBudWxsICYmIExJQ1pCQS50ZXN0KCB2ICkgPyBwYXJzZUZsb2F0KCB2ICkgOiB6YXBhcyA/PyBkb215c2xuYTtcblx0fTtcblx0cmV0dXJuIFsgbGljemJhKCBcIndpZHRoXCIsIHZiLmxlbmd0aCA9PT0gNCA/IHZiWzJdIDogdW5kZWZpbmVkLCAzMDAgKSwgbGljemJhKCBcImhlaWdodFwiLCB2Yi5sZW5ndGggPT09IDQgPyB2YlszXSA6IHVuZGVmaW5lZCwgMTUwICkgXTtcbn1cblxuLyoqIEJleiBsaWN6Ym93eWNoIHdpZHRoL2hlaWdodCAoYnJhayBhbGJvICUpIFNWRyBuYSBzdG9sZSBuaWUgbWEgcm96bWlhcnUg4oCUIHVzdGFsYSBnbyB6IHZpZXdCb3guICovXG5mdW5jdGlvbiB1c3RhbFJvem1pYXIoIHN2ZzogU1ZHU1ZHRWxlbWVudCApOiBTY2VuZVNpemUge1xuXHRjb25zdCByID0gcm96bWlhclN2Zyggc3ZnICk7XG5cdGlmICggIUxJQ1pCQS50ZXN0KCBzdmcuZ2V0QXR0cmlidXRlKCBcIndpZHRoXCIgKSA/PyBcIlwiICkgfHwgIUxJQ1pCQS50ZXN0KCBzdmcuZ2V0QXR0cmlidXRlKCBcImhlaWdodFwiICkgPz8gXCJcIiApICkge1xuXHRcdHN2Zy5zZXRBdHRyaWJ1dGUoIFwid2lkdGhcIiwgU3RyaW5nKCByWzBdICkgKTtcblx0XHRzdmcuc2V0QXR0cmlidXRlKCBcImhlaWdodFwiLCBTdHJpbmcoIHJbMV0gKSApO1xuXHR9XG5cdHJldHVybiByO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc2xhbmQoXG5cdGltcG9ydC5tZXRhLnVybCxcblx0ZnVuY3Rpb24gVmVjdG9yVmlld3BvcnQoXG5cdFx0eyByZW5kZXJlciwgY2hpbGRyZW4sIGFkanVzdCwgcGFpbnQsIHNjZW5lLCBiYWNrZ3JvdW5kLCB3aWR0aCA9IFwiMTAwJVwiLCBoZWlnaHQsIG1pblNjYWxlID0gMC4xLCBtYXhTY2FsZSA9IDUwIH06IE9rbm8sXG5cdCkge1xuXHRcdGNvbnN0IHRyZXNjID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PiggbnVsbCApO1xuXHRcdGNvbnN0IHBsb3RubyA9IHVzZVJlZjxIVE1MQ2FudmFzRWxlbWVudD4oIG51bGwgKTtcblx0XHRjb25zdCByYWYgPSB1c2VSZWY8bnVtYmVyIHwgbnVsbD4oIG51bGwgKTtcblx0XHQvKiogU1ZHIOKGkiBDYW52YXM6IG9icmF6IHogdWtyeXRlaiB0cmXFm2NpIGkgamVnbyByb3ptaWFyLiAqL1xuXHRcdGNvbnN0IG9icmF6ID0gdXNlUmVmPEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsPiggbnVsbCApO1xuXHRcdGNvbnN0IHJvem1pYXIgPSB1c2VSZWY8U2NlbmVTaXplIHwgdW5kZWZpbmVkPiggc2NlbmUgKTtcblxuXHRcdGNvbnN0IG1hbHVqID0gKCBtOiBNYWxvd2FuaWUsIGM6IENhbnZhc0RyYXdDb250ZXh0ICkgPT4ge1xuXHRcdFx0c3dpdGNoICggbVswXSApIHtcblx0XHRcdFx0Y2FzZSBcIlNWR1wiOiB7XG5cdFx0XHRcdFx0Y29uc3QgWyB3LCBoIF0gPSByb3ptaWFyLmN1cnJlbnQgPz8gWyAwLCAwIF07XG5cdFx0XHRcdFx0aWYgKCBvYnJhei5jdXJyZW50ICkgYy5jdHguZHJhd0ltYWdlKCBvYnJhei5jdXJyZW50LCAwLCAwLCB3LCBoICk7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhc2UgXCJET1RYXCI6XG5cdFx0XHRcdFx0ZG90eENhbnZhcyggeyAuLi5jLCBkYW5lOiBtWzFdIH0gKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGNhc2UgXCJMT0NJXCI6XG5cdFx0XHRcdFx0bG9jaUNhbnZhcyggeyAuLi5jLCBkYW5lOiBtWzFdIH0gKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdGNhc2UgXCJSWVNVTkVLXCI6IHtcblx0XHRcdFx0XHRjb25zdCByeXN1bmVrOiBDYW52YXNEcmF3ZXIgfCB1bmRlZmluZWQgPSBSWVNVTktJW21bMV1dO1xuXHRcdFx0XHRcdGlmICggcnlzdW5layApIHJ5c3VuZWsoIHsgLi4uYywgZGFuZTogbVsyXSB9ICk7XG5cdFx0XHRcdFx0ZWxzZSBjb25zb2xlLndhcm4oIGBWZWN0b3JWaWV3cG9ydDogYnJhayByeXN1bmt1IOKAniR7bVsxXX3igJ0gdyBSWVNVTktJYCApO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjb25zdCByeXN1aiA9ICgpID0+IHtcblx0XHRcdHJhZi5jdXJyZW50ID0gbnVsbDtcblx0XHRcdGNvbnN0IGIgPSBwei5ib3guY3VycmVudCwgZWwgPSBwbG90bm8uY3VycmVudDtcblx0XHRcdGlmICggIWIgfHwgIWVsIHx8ICFwYWludCApIHJldHVybjtcblx0XHRcdGNvbnN0IGN0eCA9IGVsLmdldENvbnRleHQoIFwiMmRcIiApO1xuXHRcdFx0aWYgKCAhY3R4ICkgcmV0dXJuO1xuXG5cdFx0XHRjb25zdCBkcHIgPSBnbG9iYWxUaGlzLmRldmljZVBpeGVsUmF0aW8gfHwgMTtcblx0XHRcdGNvbnN0IHcgPSBiLmNsaWVudFdpZHRoLCBoID0gYi5jbGllbnRIZWlnaHQ7XG5cdFx0XHRjb25zdCBwdyA9IE1hdGgubWF4KCAxLCBNYXRoLnJvdW5kKCB3ICogZHByICkgKSwgcGggPSBNYXRoLm1heCggMSwgTWF0aC5yb3VuZCggaCAqIGRwciApICk7XG5cdFx0XHRpZiAoIGVsLndpZHRoICE9PSBwdyB8fCBlbC5oZWlnaHQgIT09IHBoICkge1xuXHRcdFx0XHRlbC53aWR0aCA9IHB3O1xuXHRcdFx0XHRlbC5oZWlnaHQgPSBwaDtcblx0XHRcdH1cblxuXHRcdFx0Y29uc3QgdiA9IHB6LnZpZXcuY3VycmVudDtcblx0XHRcdGN0eC5zYXZlKCk7XG5cdFx0XHRjdHguc2V0VHJhbnNmb3JtKCBkcHIsIDAsIDAsIGRwciwgMCwgMCApO1xuXHRcdFx0Y3R4LmNsZWFyUmVjdCggMCwgMCwgdywgaCApO1xuXHRcdFx0Y3R4LnRyYW5zbGF0ZSggdi54LCB2LnkgKTtcblx0XHRcdGN0eC5zY2FsZSggdi5zLCB2LnMgKTtcblx0XHRcdG1hbHVqKCBwYWludCwgeyBjdHgsIHZpZXc6IHYsIHdpZHRoOiB3LCBoZWlnaHQ6IGgsIGRwciB9ICk7XG5cdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdH07XG5cblx0XHRjb25zdCB6YXBsYW51aiA9ICgpID0+IHtcblx0XHRcdGlmICggcmFmLmN1cnJlbnQgPT09IG51bGwgKSByYWYuY3VycmVudCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSggcnlzdWogKTtcblx0XHR9O1xuXG5cdFx0LyoqIFNWRzogcHJ6ZXN1d2EgaSBza2FsdWplIHRyZcWbxIc7IENhbnZhczogcnlzdWplIG9kIG5vd2EuICovXG5cdFx0Y29uc3Qgem1pYW5hID0gKCkgPT4ge1xuXHRcdFx0aWYgKCByZW5kZXJlciA9PT0gXCJDYW52YXNcIiApIHJldHVybiB6YXBsYW51aigpO1xuXHRcdFx0Y29uc3QgeyB4LCB5LCBzIH0gPSBwei52aWV3LmN1cnJlbnQ7XG5cdFx0XHRpZiAoICF0cmVzYy5jdXJyZW50ICkgcmV0dXJuO1xuXHRcdFx0dHJlc2MuY3VycmVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eH1weCwgJHt5fXB4KSBzY2FsZSgke3N9KWA7XG5cdFx0XHQvLyBwb3dpxJlrc3plbmllIGRsYSB0cmXFm2NpOiBlbGVtZW50eSB3IHB4IGVrcmFudSAobnAuIGtvbnN0cnVrY2phIExPQ0kpIGR6aWVsxIUgcHJ6ZXogbmllIHN3w7NqIHJvem1pYXJcblx0XHRcdHRyZXNjLmN1cnJlbnQuc3R5bGUuc2V0UHJvcGVydHkoIFwiLS12di1zXCIsIFN0cmluZyggcyApICk7XG5cdFx0fTtcblxuXHRcdGNvbnN0IHB6ID0gdXNlUGFuWm9vbSggeyBtaW5TY2FsZSwgbWF4U2NhbGUsIG9uQ2hhbmdlOiB6bWlhbmEgfSApO1xuXG5cdFx0Y29uc3QgZG9wYXN1aiA9ICgpID0+IHtcblx0XHRcdGlmICggcmVuZGVyZXIgPT09IFwiQ2FudmFzXCIgKSB7XG5cdFx0XHRcdGNvbnN0IHIgPSByb3ptaWFyLmN1cnJlbnQ7XG5cdFx0XHRcdGlmICggciApIHB6LmZpdFRvKCByWzBdLCByWzFdICk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNvbnN0IGMgPSB0cmVzYy5jdXJyZW50O1xuXHRcdFx0aWYgKCBjICkgcHouZml0VG8oIGMub2Zmc2V0V2lkdGgsIGMub2Zmc2V0SGVpZ2h0ICk7XG5cdFx0fTtcblxuXHRcdC8vIFNWRzogZG9wYXNvd2FuaWUgd2lkb2t1IGkgb3Bjam9uYWxuZSBkb3Bhc293YW5pZSB6IHJlamVzdHJ1XG5cdFx0dXNlRWZmZWN0KCAoKSA9PiB7XG5cdFx0XHRpZiAoIHJlbmRlcmVyICE9PSBcIlNWR1wiICkgcmV0dXJuO1xuXHRcdFx0Y29uc3Qgc3ZnID0gdHJlc2MuY3VycmVudD8ucXVlcnlTZWxlY3RvcjxTVkdTVkdFbGVtZW50PiggXCJzdmdcIiApO1xuXHRcdFx0aWYgKCBzdmcgKSB1c3RhbFJvem1pYXIoIHN2ZyApO1xuXHRcdFx0ZG9wYXN1aigpO1xuXHRcdFx0aWYgKCAhYWRqdXN0ICkgcmV0dXJuO1xuXHRcdFx0ZG9jdW1lbnQuZm9udHMucmVhZHkudGhlbiggKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBzdmcgPSB0cmVzYy5jdXJyZW50Py5xdWVyeVNlbGVjdG9yPFNWR1NWR0VsZW1lbnQ+KCBcInN2Z1wiICk7XG5cdFx0XHRcdGlmICggIXN2ZyApIHJldHVybjtcblx0XHRcdFx0Y29uc3QgZiA9IERPUEFTT1dBTklBW2FkanVzdF07XG5cdFx0XHRcdGlmICggZiApIGYoIHN2ZyApO1xuXHRcdFx0XHRlbHNlIGNvbnNvbGUud2FybiggYFZlY3RvclZpZXdwb3J0OiBuaWV6bmFueSBhZGp1c3Q9XCIke2FkanVzdH1cImAgKTtcblx0XHRcdH0gKTtcblx0XHR9LCBbIHJlbmRlcmVyLCBhZGp1c3QgXSApO1xuXG5cdFx0Ly8gQ2FudmFzOiBvYnJheiB6IFNWRyAoZ2R5IHRyemViYSksIGRvcGFzb3dhbmllLCByeXNvd2FuaWUgcHJ6eSB6bWlhbmllIHJvem1pYXJ1XG5cdFx0dXNlRWZmZWN0KCAoKSA9PiB7XG5cdFx0XHRpZiAoIHJlbmRlcmVyICE9PSBcIkNhbnZhc1wiICkgcmV0dXJuO1xuXHRcdFx0Y29uc3QgYiA9IHB6LmJveC5jdXJyZW50O1xuXHRcdFx0aWYgKCAhYiApIHJldHVybjtcblx0XHRcdGxldCBhZHJlczogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cblx0XHRcdGlmICggcGFpbnQ/LlswXSA9PT0gXCJTVkdcIiApIHtcblx0XHRcdFx0Y29uc3Qgc3ZnID0gdHJlc2MuY3VycmVudD8ucXVlcnlTZWxlY3RvcjxTVkdTVkdFbGVtZW50PiggXCJzdmdcIiApO1xuXHRcdFx0XHRpZiAoIHN2ZyApIHtcblx0XHRcdFx0XHQvLyBPYnJheiBTVkcgbmllIHdjenl0dWplIHphc29iw7N3IHpld27EmXRyem55Y2ggKGN6Y2lvbmVrIHogc2llY2ksIG9icmF6w7N3KSDigJQgdHlsa28gY3pjaW9ua2kgc3lzdGVtb3dlLlxuXHRcdFx0XHRcdGNvbnN0IGtvcGlhID0gc3ZnLmNsb25lTm9kZSggdHJ1ZSApIGFzIFNWR1NWR0VsZW1lbnQ7XG5cdFx0XHRcdFx0Y29uc3QgciA9IHVzdGFsUm96bWlhcigga29waWEgKTtcblx0XHRcdFx0XHRhZHJlcyA9IFVSTC5jcmVhdGVPYmplY3RVUkwoIG5ldyBCbG9iKCBbIG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoIGtvcGlhICkgXSwgeyB0eXBlOiBcImltYWdlL3N2Zyt4bWxcIiB9ICkgKTtcblx0XHRcdFx0XHRjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdFx0XHRpbWcub25sb2FkID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0b2JyYXouY3VycmVudCA9IGltZztcblx0XHRcdFx0XHRcdHJvem1pYXIuY3VycmVudCA9IHI7XG5cdFx0XHRcdFx0XHRkb3Bhc3VqKCk7XG5cdFx0XHRcdFx0XHR6YXBsYW51aigpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0aW1nLnNyYyA9IGFkcmVzO1xuXHRcdFx0XHR9IGVsc2UgY29uc29sZS53YXJuKCBcIlZlY3RvclZpZXdwb3J0OiBicmFrIDxzdmc+IHcgxbpyw7NkbGVcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHRkb3Bhc3VqKCk7XG5cdFx0XHRkb2N1bWVudC5mb250cy5yZWFkeS50aGVuKCB6YXBsYW51aiApO1xuXHRcdFx0Y29uc3Qgcm8gPSBuZXcgUmVzaXplT2JzZXJ2ZXIoICgpID0+IHphcGxhbnVqKCkgKTtcblx0XHRcdHJvLm9ic2VydmUoIGIgKTtcblx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdHJvLmRpc2Nvbm5lY3QoKTtcblx0XHRcdFx0aWYgKCByYWYuY3VycmVudCAhPT0gbnVsbCApIGNhbmNlbEFuaW1hdGlvbkZyYW1lKCByYWYuY3VycmVudCApO1xuXHRcdFx0XHRpZiAoIGFkcmVzICE9PSBudWxsICkgVVJMLnJldm9rZU9iamVjdFVSTCggYWRyZXMgKTtcblx0XHRcdH07XG5cdFx0fSwgWyByZW5kZXJlciwgcGFpbnQsIHNjZW5lIF0gKTtcblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmlld3BvcnRcIj5cblx0XHRcdFx0PGRpdlxuXHRcdFx0XHRcdHJlZj17cHouYm94fVxuXHRcdFx0XHRcdGNsYXNzPXtjeCggXCJ2aWV3cG9ydC1zdG9sXCIsIHB6LmxvY2tlZCAmJiBcImlzLWxvY2tlZFwiICl9XG5cdFx0XHRcdFx0c3R5bGU9e3tcblx0XHRcdFx0XHRcdGJhY2tncm91bmQsXG5cdFx0XHRcdFx0XHR3aWR0aCxcblx0XHRcdFx0XHRcdGhlaWdodDogaGVpZ2h0ID8/IFwiMTAwJVwiLFxuXHRcdFx0XHRcdFx0bWluSGVpZ2h0OiBoZWlnaHQgPyB1bmRlZmluZWQgOiBcIjIwMHB4XCIsXG5cdFx0XHRcdFx0fX1cblx0XHRcdFx0XHRvbldoZWVsPXtwei5oYW5kbGVycy5vbldoZWVsfVxuXHRcdFx0XHRcdG9uUG9pbnRlckRvd249e3B6LmhhbmRsZXJzLm9uUG9pbnRlckRvd259XG5cdFx0XHRcdFx0b25Qb2ludGVyTW92ZT17cHouaGFuZGxlcnMub25Qb2ludGVyTW92ZX1cblx0XHRcdFx0XHRvblBvaW50ZXJVcD17cHouaGFuZGxlcnMub25Qb2ludGVyRW5kfVxuXHRcdFx0XHRcdG9uUG9pbnRlckNhbmNlbD17cHouaGFuZGxlcnMub25Qb2ludGVyRW5kfVxuXHRcdFx0XHRcdG9uRGJsQ2xpY2s9e3B6LmxvY2tlZCA/IHVuZGVmaW5lZCA6IGRvcGFzdWp9XG5cdFx0XHRcdD5cblx0XHRcdFx0XHQ8YnV0dG9uXG5cdFx0XHRcdFx0XHR0eXBlPVwiYnV0dG9uXCJcblx0XHRcdFx0XHRcdGNsYXNzPVwidmlld3BvcnQtemFtZWtcIlxuXHRcdFx0XHRcdFx0YXJpYS1sYWJlbD17cHoubG9ja2VkID8gXCJPZGJsb2t1aiBzdMOzxYJcIiA6IFwiWmFibG9rdWogc3TDs8WCXCJ9XG5cdFx0XHRcdFx0XHR0aXRsZT17cHoubG9ja2VkID8gXCJPZGJsb2t1aiBwcnplc3V3YW5pZSBpIHpvb21cIiA6IFwiWmFibG9rdWogKHByemV3aWphbmllIHN0cm9ueSlcIn1cblx0XHRcdFx0XHRcdG9uUG9pbnRlckRvd249eyggZSApID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG5cdFx0XHRcdFx0XHRvbkRibENsaWNrPXsoIGUgKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuXHRcdFx0XHRcdFx0b25DbGljaz17cHoudG9nZ2xlTG9ja31cblx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHR7cHoubG9ja2VkID8gXCLwn5SSXCIgOiBcIvCflJNcIn1cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblxuXHRcdFx0XHRcdHtyZW5kZXJlciA9PT0gXCJTVkdcIiA/IDxkaXYgcmVmPXt0cmVzY30gY2xhc3M9XCJ2aWV3cG9ydC10cmVzY1wiPntjaGlsZHJlbn08L2Rpdj4gOiAoXG5cdFx0XHRcdFx0XHQ8PlxuXHRcdFx0XHRcdFx0XHQ8Y2FudmFzIHJlZj17cGxvdG5vfSBjbGFzcz1cInZpZXdwb3J0LXBsb3Rub1wiIC8+XG5cdFx0XHRcdFx0XHRcdHtjaGlsZHJlbiAhPT0gdW5kZWZpbmVkICYmIDxkaXYgcmVmPXt0cmVzY30gaGlkZGVuPntjaGlsZHJlbn08L2Rpdj59XG5cdFx0XHRcdFx0XHQ8Lz5cblx0XHRcdFx0XHQpfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdCk7XG5cdH0sXG5cdHByenlnb3R1aixcbik7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLDhDQUE4QztBQUM5Qyw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDs7QUFHakQsU0FBUyxTQUFTLEVBQUUsTUFBTSxRQUFRLGVBQWU7QUFDakQsU0FBUyxNQUFNLFFBQVEsa0JBQWtCO0FBQ3pDLFNBQVMsRUFBRSxRQUFRLDBCQUEwQjtBQUM3QyxTQUFTLFdBQVcsUUFBNkIsNkNBQTZDO0FBQzlGLFNBQVMsT0FBTyxRQUFRLGdEQUFnRDtBQUN4RSxTQUFTLFVBQVUsUUFBUSxrQ0FBa0M7QUFHN0QsU0FBUyxVQUFVLEVBQUUsYUFBYSxFQUFFLE9BQU8sUUFBUSxnQ0FBZ0M7QUFDbkYsU0FBUyxVQUFVLEVBQUUsYUFBYSxFQUFFLE9BQU8sUUFBUSxnQ0FBZ0M7QUFzRG5GLE1BQU0saUJBQWlCLE9BQU8sSUFBSSxDQUFFO0FBbUJwQyxxREFBcUQsR0FDckQsU0FBUyxPQUFRLENBQStELEVBQUUsTUFBYztFQUMvRixJQUFLLEVBQUUsTUFBTSxLQUFLLGFBQWEsRUFBRSxRQUFRLEtBQUssV0FBWTtJQUN6RCxNQUFNLElBQUksTUFBTyxDQUFDLGdCQUFnQixFQUFFLE9BQU8sbURBQW1ELENBQUM7RUFDaEc7RUFDQSxPQUFPLEVBQUUsTUFBTSxJQUFJLEVBQUUsUUFBUTtBQUM5QjtBQUVBLHVFQUF1RSxHQUN2RSxTQUFTLFVBQVcsQ0FBc0I7RUFDekMsTUFBTSxPQUFhO0lBQUUsVUFBVSxFQUFFLFFBQVE7RUFBQztFQUMxQyxJQUFLLEVBQUUsVUFBVSxLQUFLLFdBQVksS0FBSyxVQUFVLEdBQUcsRUFBRSxVQUFVO0VBQ2hFLElBQUssRUFBRSxLQUFLLEtBQUss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