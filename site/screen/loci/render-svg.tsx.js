// @project-metadata
// Path: site/screen/loci/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { doBrzegu } from "@/site/common/lang/loci/shared/geometry.ts";
import { KIERUNKI_POLOSI } from "@/site/common/lang/loci/element/datum/LOCIAxElement.ts";
import { GROT, KRESKI, odcinkiSymbolu } from "./render-wspolne.ts";
/**
 * Model LOCI → SVG (para dla drawLociCanvas z render-canvas.ts). Oś Y w górę: cały rysunek
 * w <g transform="scale(1,-1)">. Rozmiary konstrukcyjne w px ekranu: VectorViewport ustawia
 * na treści --vv-s (bieżące powiększenie), a tu dzieli się przez nie.
 */ export function renderLociSvg(m) {
  const [minX, minY, maxX, maxY] = m.zakres;
  const w = maxX - minX, h = maxY - minY;
  return /*#__PURE__*/ _jsx("svg", {
    class: "loci",
    xmlns: "http://www.w3.org/2000/svg",
    width: w,
    height: h,
    viewBox: `${minX} ${-maxY} ${w} ${h}`,
    style: {
      overflow: "visible"
    },
    children: /*#__PURE__*/ _jsxs("g", {
      transform: "scale(1,-1)",
      children: [
        m.ax.map((ax)=>/*#__PURE__*/ _jsx(AxSvg, {
            ax: ax,
            zakres: m.zakres
          }, ax.id)),
        m.p.map((p)=>/*#__PURE__*/ _jsx(PSvg, {
            p: p,
            wyglad: m.punkt
          }, p.id))
      ]
    })
  });
}
/** px ekranu → długość CSS w jednostkach rysunku. */ const px = (n)=>`calc(${n}px / var(--vv-s, 1))`;
/** Skala elementu rysowanego w px ekranu (do `transform`). */ const skala = (k)=>`scale(calc(${k} / var(--vv-s, 1)))`;
/** ax: półosie do brzegu zakresu i punkt w początku. */ function AxSvg({ ax, zakres }) {
  const [x, y] = ax.poczatek;
  return /*#__PURE__*/ _jsxs("g", {
    id: ax.id,
    class: "loci-ax",
    transform: `translate(${x} ${y}) rotate(${ax.kat})`,
    children: [
      ax.polosie.map((wyglad, i)=>{
        const kier = KIERUNKI_POLOSI[i] ?? 0;
        return /*#__PURE__*/ _jsx(PolosSvg, {
          kier: kier,
          dlugosc: doBrzegu(ax.poczatek, ax.kat + kier, zakres),
          wyglad: wyglad
        }, kier);
      }),
      /*#__PURE__*/ _jsx(PunktSvg, {
        wyglad: ax.punkt
      })
    ]
  });
}
/** p: punkt konstrukcyjny w swoim położeniu, w wyglądzie z body. */ function PSvg({ p, wyglad }) {
  const [x, y] = p.polozenie;
  return /*#__PURE__*/ _jsx("g", {
    id: p.id,
    class: "loci-p",
    transform: `translate(${x} ${y})`,
    children: /*#__PURE__*/ _jsx(PunktSvg, {
      wyglad: wyglad
    })
  });
}
/** Półoś z bieżącego (0,0) pod kątem `kier` (stopnie), długości `dlugosc` (jednostki rysunku). */ function PolosSvg({ kier, dlugosc, wyglad: [kolor, grubosc, styl, grot] }) {
  const kreski = KRESKI[styl];
  const [gd, gs] = GROT;
  return /*#__PURE__*/ _jsxs("g", {
    class: "loci-polos",
    transform: `rotate(${kier})`,
    children: [
      /*#__PURE__*/ _jsx("line", {
        x1: 0,
        y1: 0,
        x2: dlugosc,
        y2: 0,
        stroke: kolor,
        style: {
          strokeWidth: px(grubosc),
          strokeDasharray: kreski.length ? kreski.map(px).join(" ") : "none"
        }
      }),
      grot > 0 && /*#__PURE__*/ _jsx("g", {
        transform: `translate(${dlugosc} 0)`,
        children: /*#__PURE__*/ _jsx("path", {
          d: `M0 0 L${-gd} ${gs / 2} L${-gd} ${-gs / 2} Z`,
          fill: kolor,
          style: {
            transform: skala(grot)
          }
        })
      })
    ]
  });
}
/** Punkt konstrukcyjny w bieżącym (0,0), w px ekranu. */ function PunktSvg({ wyglad: [symbol, wielkosc, kolor] }) {
  return /*#__PURE__*/ _jsxs("g", {
    class: "loci-punkt",
    style: {
      transform: skala(1)
    },
    stroke: kolor,
    "stroke-width": 1,
    fill: "none",
    children: [
      symbol === "circle" && /*#__PURE__*/ _jsx("circle", {
        r: wielkosc / 2
      }),
      symbol === "dot" && /*#__PURE__*/ _jsx("circle", {
        r: wielkosc / 4,
        fill: kolor,
        stroke: "none"
      }),
      odcinkiSymbolu(symbol, wielkosc).map(([x1, y1, x2, y2], i)=>/*#__PURE__*/ _jsx("line", {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2
        }, i))
    ]
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExvY2lNb2RlbCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9tb2RlbC50c1wiO1xuaW1wb3J0IHR5cGUgeyBaYWtyZXMgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvc2hhcmVkL3R5cGVzLnRzXCI7XG5pbXBvcnQgeyBkb0JyemVndSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9zaGFyZWQvZ2VvbWV0cnkudHNcIjtcbmltcG9ydCB7IEtJRVJVTktJX1BPTE9TSSwgdHlwZSBMT0NJQXhFbGVtZW50IH0gZnJvbSBcIkAvc2l0ZS9jb21tb24vbGFuZy9sb2NpL2VsZW1lbnQvZGF0dW0vTE9DSUF4RWxlbWVudC50c1wiO1xuaW1wb3J0IHR5cGUgeyBMT0NJUEVsZW1lbnQgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvZWxlbWVudC9kYXR1bS9MT0NJUEVsZW1lbnQudHNcIjtcbmltcG9ydCB0eXBlIHsgV3lnbGFkTGluaWkgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvYXR0cmlidXRlL0xPQ0lBeGlzQXR0cmlidXRlcy50c1wiO1xuaW1wb3J0IHR5cGUgeyBXeWdsYWRQdW5rdHUgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvYXR0cmlidXRlL0xPQ0lQb2ludEF0dHJpYnV0ZXMudHNcIjtcbmltcG9ydCB7IEdST1QsIEtSRVNLSSwgb2RjaW5raVN5bWJvbHUgfSBmcm9tIFwiLi9yZW5kZXItd3Nwb2xuZS50c1wiO1xuXG4vKipcbiAqIE1vZGVsIExPQ0kg4oaSIFNWRyAocGFyYSBkbGEgZHJhd0xvY2lDYW52YXMgeiByZW5kZXItY2FudmFzLnRzKS4gT8WbIFkgdyBnw7NyxJk6IGNhxYJ5IHJ5c3VuZWtcbiAqIHcgPGcgdHJhbnNmb3JtPVwic2NhbGUoMSwtMSlcIj4uIFJvem1pYXJ5IGtvbnN0cnVrY3lqbmUgdyBweCBla3JhbnU6IFZlY3RvclZpZXdwb3J0IHVzdGF3aWFcbiAqIG5hIHRyZcWbY2kgLS12di1zIChiaWXFvMSFY2UgcG93acSZa3N6ZW5pZSksIGEgdHUgZHppZWxpIHNpxJkgcHJ6ZXogbmllLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTG9jaVN2ZyggbTogTG9jaU1vZGVsICkge1xuXHRjb25zdCBbIG1pblgsIG1pblksIG1heFgsIG1heFkgXSA9IG0uemFrcmVzO1xuXHRjb25zdCB3ID0gbWF4WCAtIG1pblgsIGggPSBtYXhZIC0gbWluWTtcblx0cmV0dXJuIChcblx0XHQ8c3ZnXG5cdFx0XHRjbGFzcz1cImxvY2lcIlxuXHRcdFx0eG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG5cdFx0XHR3aWR0aD17d31cblx0XHRcdGhlaWdodD17aH1cblx0XHRcdHZpZXdCb3g9e2Ake21pblh9ICR7LW1heFl9ICR7d30gJHtofWB9XG5cdFx0XHRzdHlsZT17eyBvdmVyZmxvdzogXCJ2aXNpYmxlXCIgfX1cblx0XHQ+XG5cdFx0XHQ8ZyB0cmFuc2Zvcm09XCJzY2FsZSgxLC0xKVwiPlxuXHRcdFx0XHR7bS5heC5tYXAoICggYXggKSA9PiA8QXhTdmcga2V5PXtheC5pZH0gYXg9e2F4fSB6YWtyZXM9e20uemFrcmVzfSAvPiApfVxuXHRcdFx0XHR7bS5wLm1hcCggKCBwICkgPT4gPFBTdmcga2V5PXtwLmlkfSBwPXtwfSB3eWdsYWQ9e20ucHVua3R9IC8+ICl9XG5cdFx0XHQ8L2c+XG5cdFx0PC9zdmc+XG5cdCk7XG59XG5cbi8qKiBweCBla3JhbnUg4oaSIGTFgnVnb8WbxIcgQ1NTIHcgamVkbm9zdGthY2ggcnlzdW5rdS4gKi9cbmNvbnN0IHB4ID0gKCBuOiBudW1iZXIgKSA9PiBgY2FsYygke259cHggLyB2YXIoLS12di1zLCAxKSlgO1xuLyoqIFNrYWxhIGVsZW1lbnR1IHJ5c293YW5lZ28gdyBweCBla3JhbnUgKGRvIGB0cmFuc2Zvcm1gKS4gKi9cbmNvbnN0IHNrYWxhID0gKCBrOiBudW1iZXIgKSA9PiBgc2NhbGUoY2FsYygke2t9IC8gdmFyKC0tdnYtcywgMSkpKWA7XG5cbi8qKiBheDogcMOzxYJvc2llIGRvIGJyemVndSB6YWtyZXN1IGkgcHVua3QgdyBwb2N6xIV0a3UuICovXG5mdW5jdGlvbiBBeFN2ZyggeyBheCwgemFrcmVzIH06IHsgYXg6IExPQ0lBeEVsZW1lbnQ7IHpha3JlczogWmFrcmVzIH0gKSB7XG5cdGNvbnN0IFsgeCwgeSBdID0gYXgucG9jemF0ZWs7XG5cdHJldHVybiAoXG5cdFx0PGcgaWQ9e2F4LmlkfSBjbGFzcz1cImxvY2ktYXhcIiB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHt4fSAke3l9KSByb3RhdGUoJHtheC5rYXR9KWB9PlxuXHRcdFx0e2F4LnBvbG9zaWUubWFwKCAoIHd5Z2xhZCwgaSApID0+IHtcblx0XHRcdFx0Y29uc3Qga2llciA9IEtJRVJVTktJX1BPTE9TSVtpXSA/PyAwO1xuXHRcdFx0XHRyZXR1cm4gPFBvbG9zU3ZnIGtleT17a2llcn0ga2llcj17a2llcn0gZGx1Z29zYz17ZG9CcnplZ3UoIGF4LnBvY3phdGVrLCBheC5rYXQgKyBraWVyLCB6YWtyZXMgKX0gd3lnbGFkPXt3eWdsYWR9IC8+O1xuXHRcdFx0fSApfVxuXHRcdFx0PFB1bmt0U3ZnIHd5Z2xhZD17YXgucHVua3R9IC8+XG5cdFx0PC9nPlxuXHQpO1xufVxuXG4vKiogcDogcHVua3Qga29uc3RydWtjeWpueSB3IHN3b2ltIHBvxYJvxbxlbml1LCB3IHd5Z2zEhWR6aWUgeiBib2R5LiAqL1xuZnVuY3Rpb24gUFN2ZyggeyBwLCB3eWdsYWQgfTogeyBwOiBMT0NJUEVsZW1lbnQ7IHd5Z2xhZDogV3lnbGFkUHVua3R1IH0gKSB7XG5cdGNvbnN0IFsgeCwgeSBdID0gcC5wb2xvemVuaWU7XG5cdHJldHVybiAoXG5cdFx0PGcgaWQ9e3AuaWR9IGNsYXNzPVwibG9jaS1wXCIgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7eH0gJHt5fSlgfT5cblx0XHRcdDxQdW5rdFN2ZyB3eWdsYWQ9e3d5Z2xhZH0gLz5cblx0XHQ8L2c+XG5cdCk7XG59XG5cbi8qKiBQw7PFgm/FmyB6IGJpZcW8xIVjZWdvICgwLDApIHBvZCBrxIV0ZW0gYGtpZXJgIChzdG9wbmllKSwgZMWCdWdvxZtjaSBgZGx1Z29zY2AgKGplZG5vc3RraSByeXN1bmt1KS4gKi9cbmZ1bmN0aW9uIFBvbG9zU3ZnKCB7IGtpZXIsIGRsdWdvc2MsIHd5Z2xhZDogWyBrb2xvciwgZ3J1Ym9zYywgc3R5bCwgZ3JvdCBdIH06IHsga2llcjogbnVtYmVyOyBkbHVnb3NjOiBudW1iZXI7IHd5Z2xhZDogV3lnbGFkTGluaWkgfSApIHtcblx0Y29uc3Qga3Jlc2tpID0gS1JFU0tJW3N0eWxdO1xuXHRjb25zdCBbIGdkLCBncyBdID0gR1JPVDtcblx0cmV0dXJuIChcblx0XHQ8ZyBjbGFzcz1cImxvY2ktcG9sb3NcIiB0cmFuc2Zvcm09e2Byb3RhdGUoJHtraWVyfSlgfT5cblx0XHRcdDxsaW5lXG5cdFx0XHRcdHgxPXswfVxuXHRcdFx0XHR5MT17MH1cblx0XHRcdFx0eDI9e2RsdWdvc2N9XG5cdFx0XHRcdHkyPXswfVxuXHRcdFx0XHRzdHJva2U9e2tvbG9yfVxuXHRcdFx0XHRzdHlsZT17eyBzdHJva2VXaWR0aDogcHgoIGdydWJvc2MgKSwgc3Ryb2tlRGFzaGFycmF5OiBrcmVza2kubGVuZ3RoID8ga3Jlc2tpLm1hcCggcHggKS5qb2luKCBcIiBcIiApIDogXCJub25lXCIgfX1cblx0XHRcdC8+XG5cdFx0XHR7Z3JvdCA+IDAgJiYgKFxuXHRcdFx0XHQ8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtkbHVnb3NjfSAwKWB9PlxuXHRcdFx0XHRcdDxwYXRoIGQ9e2BNMCAwIEwkey1nZH0gJHtncyAvIDJ9IEwkey1nZH0gJHstZ3MgLyAyfSBaYH0gZmlsbD17a29sb3J9IHN0eWxlPXt7IHRyYW5zZm9ybTogc2thbGEoIGdyb3QgKSB9fSAvPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQpfVxuXHRcdDwvZz5cblx0KTtcbn1cblxuLyoqIFB1bmt0IGtvbnN0cnVrY3lqbnkgdyBiaWXFvMSFY3ltICgwLDApLCB3IHB4IGVrcmFudS4gKi9cbmZ1bmN0aW9uIFB1bmt0U3ZnKCB7IHd5Z2xhZDogWyBzeW1ib2wsIHdpZWxrb3NjLCBrb2xvciBdIH06IHsgd3lnbGFkOiBXeWdsYWRQdW5rdHUgfSApIHtcblx0cmV0dXJuIChcblx0XHQ8ZyBjbGFzcz1cImxvY2ktcHVua3RcIiBzdHlsZT17eyB0cmFuc2Zvcm06IHNrYWxhKCAxICkgfX0gc3Ryb2tlPXtrb2xvcn0gc3Ryb2tlLXdpZHRoPXsxfSBmaWxsPVwibm9uZVwiPlxuXHRcdFx0e3N5bWJvbCA9PT0gXCJjaXJjbGVcIiAmJiA8Y2lyY2xlIHI9e3dpZWxrb3NjIC8gMn0gLz59XG5cdFx0XHR7c3ltYm9sID09PSBcImRvdFwiICYmIDxjaXJjbGUgcj17d2llbGtvc2MgLyA0fSBmaWxsPXtrb2xvcn0gc3Ryb2tlPVwibm9uZVwiIC8+fVxuXHRcdFx0e29kY2lua2lTeW1ib2x1KCBzeW1ib2wsIHdpZWxrb3NjICkubWFwKCAoIFsgeDEsIHkxLCB4MiwgeTIgXSwgaSApID0+IDxsaW5lIGtleT17aX0geDE9e3gxfSB5MT17eTF9IHgyPXt4Mn0geTI9e3kyfSAvPiApfVxuXHRcdDwvZz5cblx0KTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEOztBQUlqRCxTQUFT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