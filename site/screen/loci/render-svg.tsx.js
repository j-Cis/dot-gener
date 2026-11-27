// @project-metadata
// Path: site/screen/loci/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { doBrzegu } from "./interpreter/geometry.ts";
import { KIERUNKI_POLOSI } from "./interpreter/csax.ts";
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
        m.csax.map((cs)=>/*#__PURE__*/ _jsx(CsaxSvg, {
            cs: cs,
            zakres: m.zakres,
            polosie: m.polosie,
            punkt: m.punkt
          }, cs.id)),
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
/** csax: półosie do brzegu zakresu i punkt w początku, w wyglądzie z body. */ function CsaxSvg({ cs, zakres, polosie, punkt }) {
  const [x, y] = cs.poczatek;
  return /*#__PURE__*/ _jsxs("g", {
    id: cs.id,
    class: "loci-csax",
    transform: `translate(${x} ${y}) rotate(${cs.kat})`,
    children: [
      polosie.map((wyglad, i)=>{
        const kier = KIERUNKI_POLOSI[i] ?? 0;
        return /*#__PURE__*/ _jsx(PolosSvg, {
          kier: kier,
          dlugosc: doBrzegu(cs.poczatek, cs.kat + kier, zakres),
          wyglad: wyglad
        }, kier);
      }),
      /*#__PURE__*/ _jsx(PunktSvg, {
        wyglad: punkt
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExvY2lNb2RlbCB9IGZyb20gXCIuL2ludGVycHJldGVyL21vZGVsLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFpha3JlcyB9IGZyb20gXCIuL2ludGVycHJldGVyL3R5cGVzLnRzXCI7XG5pbXBvcnQgeyBkb0JyemVndSB9IGZyb20gXCIuL2ludGVycHJldGVyL2dlb21ldHJ5LnRzXCI7XG5pbXBvcnQgeyBLSUVSVU5LSV9QT0xPU0ksIHR5cGUgTW9kZWxDc2F4IH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXIvY3NheC50c1wiO1xuaW1wb3J0IHR5cGUgeyBNb2RlbFAgfSBmcm9tIFwiLi9pbnRlcnByZXRlci9wLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFd5Z2xhZExpbmlpLCBXeWdsYWRQb2xvc2ksIFd5Z2xhZFB1bmt0dSB9IGZyb20gXCIuL2ludGVycHJldGVyL2JvZHkudHNcIjtcbmltcG9ydCB7IEdST1QsIEtSRVNLSSwgb2RjaW5raVN5bWJvbHUgfSBmcm9tIFwiLi9yZW5kZXItd3Nwb2xuZS50c1wiO1xuXG4vKipcbiAqIE1vZGVsIExPQ0kg4oaSIFNWRyAocGFyYSBkbGEgZHJhd0xvY2lDYW52YXMgeiByZW5kZXItY2FudmFzLnRzKS4gT8WbIFkgdyBnw7NyxJk6IGNhxYJ5IHJ5c3VuZWtcbiAqIHcgPGcgdHJhbnNmb3JtPVwic2NhbGUoMSwtMSlcIj4uIFJvem1pYXJ5IGtvbnN0cnVrY3lqbmUgdyBweCBla3JhbnU6IFZlY3RvclZpZXdwb3J0IHVzdGF3aWFcbiAqIG5hIHRyZcWbY2kgLS12di1zIChiaWXFvMSFY2UgcG93acSZa3N6ZW5pZSksIGEgdHUgZHppZWxpIHNpxJkgcHJ6ZXogbmllLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTG9jaVN2ZyggbTogTG9jaU1vZGVsICkge1xuXHRjb25zdCBbIG1pblgsIG1pblksIG1heFgsIG1heFkgXSA9IG0uemFrcmVzO1xuXHRjb25zdCB3ID0gbWF4WCAtIG1pblgsIGggPSBtYXhZIC0gbWluWTtcblx0cmV0dXJuIChcblx0XHQ8c3ZnXG5cdFx0XHRjbGFzcz1cImxvY2lcIlxuXHRcdFx0eG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG5cdFx0XHR3aWR0aD17d31cblx0XHRcdGhlaWdodD17aH1cblx0XHRcdHZpZXdCb3g9e2Ake21pblh9ICR7LW1heFl9ICR7d30gJHtofWB9XG5cdFx0XHRzdHlsZT17eyBvdmVyZmxvdzogXCJ2aXNpYmxlXCIgfX1cblx0XHQ+XG5cdFx0XHQ8ZyB0cmFuc2Zvcm09XCJzY2FsZSgxLC0xKVwiPlxuXHRcdFx0XHR7bS5jc2F4Lm1hcCggKCBjcyApID0+IDxDc2F4U3ZnIGtleT17Y3MuaWR9IGNzPXtjc30gemFrcmVzPXttLnpha3Jlc30gcG9sb3NpZT17bS5wb2xvc2llfSBwdW5rdD17bS5wdW5rdH0gLz4gKX1cblx0XHRcdFx0e20ucC5tYXAoICggcCApID0+IDxQU3ZnIGtleT17cC5pZH0gcD17cH0gd3lnbGFkPXttLnB1bmt0fSAvPiApfVxuXHRcdFx0PC9nPlxuXHRcdDwvc3ZnPlxuXHQpO1xufVxuXG4vKiogcHggZWtyYW51IOKGkiBkxYJ1Z2/Fm8SHIENTUyB3IGplZG5vc3RrYWNoIHJ5c3Vua3UuICovXG5jb25zdCBweCA9ICggbjogbnVtYmVyICkgPT4gYGNhbGMoJHtufXB4IC8gdmFyKC0tdnYtcywgMSkpYDtcbi8qKiBTa2FsYSBlbGVtZW50dSByeXNvd2FuZWdvIHcgcHggZWtyYW51IChkbyBgdHJhbnNmb3JtYCkuICovXG5jb25zdCBza2FsYSA9ICggazogbnVtYmVyICkgPT4gYHNjYWxlKGNhbGMoJHtrfSAvIHZhcigtLXZ2LXMsIDEpKSlgO1xuXG4vKiogY3NheDogcMOzxYJvc2llIGRvIGJyemVndSB6YWtyZXN1IGkgcHVua3QgdyBwb2N6xIV0a3UsIHcgd3lnbMSFZHppZSB6IGJvZHkuICovXG5mdW5jdGlvbiBDc2F4U3ZnKCB7IGNzLCB6YWtyZXMsIHBvbG9zaWUsIHB1bmt0IH06IHsgY3M6IE1vZGVsQ3NheDsgemFrcmVzOiBaYWtyZXM7IHBvbG9zaWU6IFd5Z2xhZFBvbG9zaTsgcHVua3Q6IFd5Z2xhZFB1bmt0dSB9ICkge1xuXHRjb25zdCBbIHgsIHkgXSA9IGNzLnBvY3phdGVrO1xuXHRyZXR1cm4gKFxuXHRcdDxnIGlkPXtjcy5pZH0gY2xhc3M9XCJsb2NpLWNzYXhcIiB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHt4fSAke3l9KSByb3RhdGUoJHtjcy5rYXR9KWB9PlxuXHRcdFx0e3BvbG9zaWUubWFwKCAoIHd5Z2xhZCwgaSApID0+IHtcblx0XHRcdFx0Y29uc3Qga2llciA9IEtJRVJVTktJX1BPTE9TSVtpXSA/PyAwO1xuXHRcdFx0XHRyZXR1cm4gPFBvbG9zU3ZnIGtleT17a2llcn0ga2llcj17a2llcn0gZGx1Z29zYz17ZG9CcnplZ3UoIGNzLnBvY3phdGVrLCBjcy5rYXQgKyBraWVyLCB6YWtyZXMgKX0gd3lnbGFkPXt3eWdsYWR9IC8+O1xuXHRcdFx0fSApfVxuXHRcdFx0PFB1bmt0U3ZnIHd5Z2xhZD17cHVua3R9IC8+XG5cdFx0PC9nPlxuXHQpO1xufVxuXG4vKiogcDogcHVua3Qga29uc3RydWtjeWpueSB3IHN3b2ltIHBvxYJvxbxlbml1LCB3IHd5Z2zEhWR6aWUgeiBib2R5LiAqL1xuZnVuY3Rpb24gUFN2ZyggeyBwLCB3eWdsYWQgfTogeyBwOiBNb2RlbFA7IHd5Z2xhZDogV3lnbGFkUHVua3R1IH0gKSB7XG5cdGNvbnN0IFsgeCwgeSBdID0gcC5wb2xvemVuaWU7XG5cdHJldHVybiAoXG5cdFx0PGcgaWQ9e3AuaWR9IGNsYXNzPVwibG9jaS1wXCIgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7eH0gJHt5fSlgfT5cblx0XHRcdDxQdW5rdFN2ZyB3eWdsYWQ9e3d5Z2xhZH0gLz5cblx0XHQ8L2c+XG5cdCk7XG59XG5cbi8qKiBQw7PFgm/FmyB6IGJpZcW8xIVjZWdvICgwLDApIHBvZCBrxIV0ZW0gYGtpZXJgIChzdG9wbmllKSwgZMWCdWdvxZtjaSBgZGx1Z29zY2AgKGplZG5vc3RraSByeXN1bmt1KS4gKi9cbmZ1bmN0aW9uIFBvbG9zU3ZnKCB7IGtpZXIsIGRsdWdvc2MsIHd5Z2xhZDogWyBrb2xvciwgZ3J1Ym9zYywgc3R5bCwgZ3JvdCBdIH06IHsga2llcjogbnVtYmVyOyBkbHVnb3NjOiBudW1iZXI7IHd5Z2xhZDogV3lnbGFkTGluaWkgfSApIHtcblx0Y29uc3Qga3Jlc2tpID0gS1JFU0tJW3N0eWxdO1xuXHRjb25zdCBbIGdkLCBncyBdID0gR1JPVDtcblx0cmV0dXJuIChcblx0XHQ8ZyBjbGFzcz1cImxvY2ktcG9sb3NcIiB0cmFuc2Zvcm09e2Byb3RhdGUoJHtraWVyfSlgfT5cblx0XHRcdDxsaW5lXG5cdFx0XHRcdHgxPXswfVxuXHRcdFx0XHR5MT17MH1cblx0XHRcdFx0eDI9e2RsdWdvc2N9XG5cdFx0XHRcdHkyPXswfVxuXHRcdFx0XHRzdHJva2U9e2tvbG9yfVxuXHRcdFx0XHRzdHlsZT17eyBzdHJva2VXaWR0aDogcHgoIGdydWJvc2MgKSwgc3Ryb2tlRGFzaGFycmF5OiBrcmVza2kubGVuZ3RoID8ga3Jlc2tpLm1hcCggcHggKS5qb2luKCBcIiBcIiApIDogXCJub25lXCIgfX1cblx0XHRcdC8+XG5cdFx0XHR7Z3JvdCA+IDAgJiYgKFxuXHRcdFx0XHQ8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtkbHVnb3NjfSAwKWB9PlxuXHRcdFx0XHRcdDxwYXRoIGQ9e2BNMCAwIEwkey1nZH0gJHtncyAvIDJ9IEwkey1nZH0gJHstZ3MgLyAyfSBaYH0gZmlsbD17a29sb3J9IHN0eWxlPXt7IHRyYW5zZm9ybTogc2thbGEoIGdyb3QgKSB9fSAvPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQpfVxuXHRcdDwvZz5cblx0KTtcbn1cblxuLyoqIFB1bmt0IGtvbnN0cnVrY3lqbnkgdyBiaWXFvMSFY3ltICgwLDApLCB3IHB4IGVrcmFudS4gKi9cbmZ1bmN0aW9uIFB1bmt0U3ZnKCB7IHd5Z2xhZDogWyBzeW1ib2wsIHdpZWxrb3NjLCBrb2xvciBdIH06IHsgd3lnbGFkOiBXeWdsYWRQdW5rdHUgfSApIHtcblx0cmV0dXJuIChcblx0XHQ8ZyBjbGFzcz1cImxvY2ktcHVua3RcIiBzdHlsZT17eyB0cmFuc2Zvcm06IHNrYWxhKCAxICkgfX0gc3Ryb2tlPXtrb2xvcn0gc3Ryb2tlLXdpZHRoPXsxfSBmaWxsPVwibm9uZVwiPlxuXHRcdFx0e3N5bWJvbCA9PT0gXCJjaXJjbGVcIiAmJiA8Y2lyY2xlIHI9e3dpZWxrb3NjIC8gMn0gLz59XG5cdFx0XHR7c3ltYm9sID09PSBcImRvdFwiICYmIDxjaXJjbGUgcj17d2llbGtvc2MgLyA0fSBmaWxsPXtrb2xvcn0gc3Ryb2tlPVwibm9uZVwiIC8+fVxuXHRcdFx0e29kY2lua2lTeW1ib2x1KCBzeW1ib2wsIHdpZWxrb3NjICkubWFwKCAoIFsgeDEsIHkxLCB4MiwgeTIgXSwgaSApID0+IDxsaW5lIGtleT17aX0geDE9e3gxfSB5MT17eTF9IHgyPXt4Mn0geTI9e3kyfSAvPiApfVxuXHRcdDwvZz5cblx0KTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEOztBQUlqRCxTQUFTLFFBQVEsUUFBUSw0QkFBNEI7QUFDckQsU0FBUyxlQUFlLFFBQXdCLHdCQUF3QjtBQUd4RSxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxRQUFRLHNCQUFzQjtBQUVuRTs7OztDQUlDLEdBQ0Qs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