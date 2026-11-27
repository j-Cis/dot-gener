// @project-metadata
// Path: site/screen/loci/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { doBrzegu } from "./interpreter/geometry.ts";
import { KIERUNKI_POLOSI } from "./interpreter/csax.ts";
import { GROT, KRESKI, kreskiRysunku, odcinkiSymbolu } from "./render-wspolne.ts";
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
        m.v.map((v)=>/*#__PURE__*/ _jsx(VSvg, {
            v: v
          }, v.id)),
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
/** v: łamana w jednostkach rysunku; elementy konstrukcyjne rysują się nad nią. */ function VSvg({ v }) {
  const [kolor, grubosc, styl] = v.wyglad;
  const Tag = v.cycle ? "polygon" : "polyline";
  const kreski = kreskiRysunku(styl, grubosc);
  return /*#__PURE__*/ _jsx(Tag, {
    id: v.id,
    class: "loci-v",
    points: v.punkty.map(([x, y])=>`${x},${y}`).join(" "),
    fill: v.surface ? kolor : "none",
    "fill-opacity": v.surface ? 0.3 : undefined,
    stroke: kolor,
    "stroke-width": grubosc,
    "stroke-linejoin": "round",
    "stroke-dasharray": kreski.length ? kreski.join(" ") : undefined
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExvY2lNb2RlbCB9IGZyb20gXCIuL2ludGVycHJldGVyL21vZGVsLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFpha3JlcyB9IGZyb20gXCIuL2ludGVycHJldGVyL3R5cGVzLnRzXCI7XG5pbXBvcnQgeyBkb0JyemVndSB9IGZyb20gXCIuL2ludGVycHJldGVyL2dlb21ldHJ5LnRzXCI7XG5pbXBvcnQgeyBLSUVSVU5LSV9QT0xPU0ksIHR5cGUgTW9kZWxDc2F4IH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXIvY3NheC50c1wiO1xuaW1wb3J0IHR5cGUgeyBNb2RlbFAgfSBmcm9tIFwiLi9pbnRlcnByZXRlci9wLnRzXCI7XG5pbXBvcnQgdHlwZSB7IE1vZGVsViB9IGZyb20gXCIuL2ludGVycHJldGVyL3YudHNcIjtcbmltcG9ydCB0eXBlIHsgV3lnbGFkTGluaWksIFd5Z2xhZFBvbG9zaSwgV3lnbGFkUHVua3R1IH0gZnJvbSBcIi4vaW50ZXJwcmV0ZXIvYm9keS50c1wiO1xuaW1wb3J0IHsgR1JPVCwgS1JFU0tJLCBrcmVza2lSeXN1bmt1LCBvZGNpbmtpU3ltYm9sdSB9IGZyb20gXCIuL3JlbmRlci13c3BvbG5lLnRzXCI7XG5cbi8qKlxuICogTW9kZWwgTE9DSSDihpIgU1ZHIChwYXJhIGRsYSBkcmF3TG9jaUNhbnZhcyB6IHJlbmRlci1jYW52YXMudHMpLiBPxZsgWSB3IGfDs3LEmTogY2HFgnkgcnlzdW5la1xuICogdyA8ZyB0cmFuc2Zvcm09XCJzY2FsZSgxLC0xKVwiPi4gUm96bWlhcnkga29uc3RydWtjeWpuZSB3IHB4IGVrcmFudTogVmVjdG9yVmlld3BvcnQgdXN0YXdpYVxuICogbmEgdHJlxZtjaSAtLXZ2LXMgKGJpZcW8xIVjZSBwb3dpxJlrc3plbmllKSwgYSB0dSBkemllbGkgc2nEmSBwcnpleiBuaWUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJMb2NpU3ZnKCBtOiBMb2NpTW9kZWwgKSB7XG5cdGNvbnN0IFsgbWluWCwgbWluWSwgbWF4WCwgbWF4WSBdID0gbS56YWtyZXM7XG5cdGNvbnN0IHcgPSBtYXhYIC0gbWluWCwgaCA9IG1heFkgLSBtaW5ZO1xuXHRyZXR1cm4gKFxuXHRcdDxzdmdcblx0XHRcdGNsYXNzPVwibG9jaVwiXG5cdFx0XHR4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcblx0XHRcdHdpZHRoPXt3fVxuXHRcdFx0aGVpZ2h0PXtofVxuXHRcdFx0dmlld0JveD17YCR7bWluWH0gJHstbWF4WX0gJHt3fSAke2h9YH1cblx0XHRcdHN0eWxlPXt7IG92ZXJmbG93OiBcInZpc2libGVcIiB9fVxuXHRcdD5cblx0XHRcdDxnIHRyYW5zZm9ybT1cInNjYWxlKDEsLTEpXCI+XG5cdFx0XHRcdHttLnYubWFwKCAoIHYgKSA9PiA8VlN2ZyBrZXk9e3YuaWR9IHY9e3Z9IC8+ICl9XG5cdFx0XHRcdHttLmNzYXgubWFwKCAoIGNzICkgPT4gPENzYXhTdmcga2V5PXtjcy5pZH0gY3M9e2NzfSB6YWtyZXM9e20uemFrcmVzfSBwb2xvc2llPXttLnBvbG9zaWV9IHB1bmt0PXttLnB1bmt0fSAvPiApfVxuXHRcdFx0XHR7bS5wLm1hcCggKCBwICkgPT4gPFBTdmcga2V5PXtwLmlkfSBwPXtwfSB3eWdsYWQ9e20ucHVua3R9IC8+ICl9XG5cdFx0XHQ8L2c+XG5cdFx0PC9zdmc+XG5cdCk7XG59XG5cbi8qKiBweCBla3JhbnUg4oaSIGTFgnVnb8WbxIcgQ1NTIHcgamVkbm9zdGthY2ggcnlzdW5rdS4gKi9cbmNvbnN0IHB4ID0gKCBuOiBudW1iZXIgKSA9PiBgY2FsYygke259cHggLyB2YXIoLS12di1zLCAxKSlgO1xuLyoqIFNrYWxhIGVsZW1lbnR1IHJ5c293YW5lZ28gdyBweCBla3JhbnUgKGRvIGB0cmFuc2Zvcm1gKS4gKi9cbmNvbnN0IHNrYWxhID0gKCBrOiBudW1iZXIgKSA9PiBgc2NhbGUoY2FsYygke2t9IC8gdmFyKC0tdnYtcywgMSkpKWA7XG5cbi8qKiBjc2F4OiBww7PFgm9zaWUgZG8gYnJ6ZWd1IHpha3Jlc3UgaSBwdW5rdCB3IHBvY3rEhXRrdSwgdyB3eWdsxIVkemllIHogYm9keS4gKi9cbmZ1bmN0aW9uIENzYXhTdmcoIHsgY3MsIHpha3JlcywgcG9sb3NpZSwgcHVua3QgfTogeyBjczogTW9kZWxDc2F4OyB6YWtyZXM6IFpha3JlczsgcG9sb3NpZTogV3lnbGFkUG9sb3NpOyBwdW5rdDogV3lnbGFkUHVua3R1IH0gKSB7XG5cdGNvbnN0IFsgeCwgeSBdID0gY3MucG9jemF0ZWs7XG5cdHJldHVybiAoXG5cdFx0PGcgaWQ9e2NzLmlkfSBjbGFzcz1cImxvY2ktY3NheFwiIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3h9ICR7eX0pIHJvdGF0ZSgke2NzLmthdH0pYH0+XG5cdFx0XHR7cG9sb3NpZS5tYXAoICggd3lnbGFkLCBpICkgPT4ge1xuXHRcdFx0XHRjb25zdCBraWVyID0gS0lFUlVOS0lfUE9MT1NJW2ldID8/IDA7XG5cdFx0XHRcdHJldHVybiA8UG9sb3NTdmcga2V5PXtraWVyfSBraWVyPXtraWVyfSBkbHVnb3NjPXtkb0JyemVndSggY3MucG9jemF0ZWssIGNzLmthdCArIGtpZXIsIHpha3JlcyApfSB3eWdsYWQ9e3d5Z2xhZH0gLz47XG5cdFx0XHR9ICl9XG5cdFx0XHQ8UHVua3RTdmcgd3lnbGFkPXtwdW5rdH0gLz5cblx0XHQ8L2c+XG5cdCk7XG59XG5cbi8qKiB2OiDFgmFtYW5hIHcgamVkbm9zdGthY2ggcnlzdW5rdTsgZWxlbWVudHkga29uc3RydWtjeWpuZSByeXN1asSFIHNpxJkgbmFkIG5pxIUuICovXG5mdW5jdGlvbiBWU3ZnKCB7IHYgfTogeyB2OiBNb2RlbFYgfSApIHtcblx0Y29uc3QgWyBrb2xvciwgZ3J1Ym9zYywgc3R5bCBdID0gdi53eWdsYWQ7XG5cdGNvbnN0IFRhZyA9IHYuY3ljbGUgPyBcInBvbHlnb25cIiA6IFwicG9seWxpbmVcIjtcblx0Y29uc3Qga3Jlc2tpID0ga3Jlc2tpUnlzdW5rdSggc3R5bCwgZ3J1Ym9zYyApO1xuXHRyZXR1cm4gKFxuXHRcdDxUYWdcblx0XHRcdGlkPXt2LmlkfVxuXHRcdFx0Y2xhc3M9XCJsb2NpLXZcIlxuXHRcdFx0cG9pbnRzPXt2LnB1bmt0eS5tYXAoICggWyB4LCB5IF0gKSA9PiBgJHt4fSwke3l9YCApLmpvaW4oIFwiIFwiICl9XG5cdFx0XHRmaWxsPXt2LnN1cmZhY2UgPyBrb2xvciA6IFwibm9uZVwifVxuXHRcdFx0ZmlsbC1vcGFjaXR5PXt2LnN1cmZhY2UgPyAwLjMgOiB1bmRlZmluZWR9XG5cdFx0XHRzdHJva2U9e2tvbG9yfVxuXHRcdFx0c3Ryb2tlLXdpZHRoPXtncnVib3NjfVxuXHRcdFx0c3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIlxuXHRcdFx0c3Ryb2tlLWRhc2hhcnJheT17a3Jlc2tpLmxlbmd0aCA/IGtyZXNraS5qb2luKCBcIiBcIiApIDogdW5kZWZpbmVkfVxuXHRcdC8+XG5cdCk7XG59XG5cbi8qKiBwOiBwdW5rdCBrb25zdHJ1a2N5am55IHcgc3dvaW0gcG/Fgm/FvGVuaXUsIHcgd3lnbMSFZHppZSB6IGJvZHkuICovXG5mdW5jdGlvbiBQU3ZnKCB7IHAsIHd5Z2xhZCB9OiB7IHA6IE1vZGVsUDsgd3lnbGFkOiBXeWdsYWRQdW5rdHUgfSApIHtcblx0Y29uc3QgWyB4LCB5IF0gPSBwLnBvbG96ZW5pZTtcblx0cmV0dXJuIChcblx0XHQ8ZyBpZD17cC5pZH0gY2xhc3M9XCJsb2NpLXBcIiB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHt4fSAke3l9KWB9PlxuXHRcdFx0PFB1bmt0U3ZnIHd5Z2xhZD17d3lnbGFkfSAvPlxuXHRcdDwvZz5cblx0KTtcbn1cblxuLyoqIFDDs8WCb8WbIHogYmllxbzEhWNlZ28gKDAsMCkgcG9kIGvEhXRlbSBga2llcmAgKHN0b3BuaWUpLCBkxYJ1Z2/Fm2NpIGBkbHVnb3NjYCAoamVkbm9zdGtpIHJ5c3Vua3UpLiAqL1xuZnVuY3Rpb24gUG9sb3NTdmcoIHsga2llciwgZGx1Z29zYywgd3lnbGFkOiBbIGtvbG9yLCBncnVib3NjLCBzdHlsLCBncm90IF0gfTogeyBraWVyOiBudW1iZXI7IGRsdWdvc2M6IG51bWJlcjsgd3lnbGFkOiBXeWdsYWRMaW5paSB9ICkge1xuXHRjb25zdCBrcmVza2kgPSBLUkVTS0lbc3R5bF07XG5cdGNvbnN0IFsgZ2QsIGdzIF0gPSBHUk9UO1xuXHRyZXR1cm4gKFxuXHRcdDxnIGNsYXNzPVwibG9jaS1wb2xvc1wiIHRyYW5zZm9ybT17YHJvdGF0ZSgke2tpZXJ9KWB9PlxuXHRcdFx0PGxpbmVcblx0XHRcdFx0eDE9ezB9XG5cdFx0XHRcdHkxPXswfVxuXHRcdFx0XHR4Mj17ZGx1Z29zY31cblx0XHRcdFx0eTI9ezB9XG5cdFx0XHRcdHN0cm9rZT17a29sb3J9XG5cdFx0XHRcdHN0eWxlPXt7IHN0cm9rZVdpZHRoOiBweCggZ3J1Ym9zYyApLCBzdHJva2VEYXNoYXJyYXk6IGtyZXNraS5sZW5ndGggPyBrcmVza2kubWFwKCBweCApLmpvaW4oIFwiIFwiICkgOiBcIm5vbmVcIiB9fVxuXHRcdFx0Lz5cblx0XHRcdHtncm90ID4gMCAmJiAoXG5cdFx0XHRcdDxnIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke2RsdWdvc2N9IDApYH0+XG5cdFx0XHRcdFx0PHBhdGggZD17YE0wIDAgTCR7LWdkfSAke2dzIC8gMn0gTCR7LWdkfSAkey1ncyAvIDJ9IFpgfSBmaWxsPXtrb2xvcn0gc3R5bGU9e3sgdHJhbnNmb3JtOiBza2FsYSggZ3JvdCApIH19IC8+XG5cdFx0XHRcdDwvZz5cblx0XHRcdCl9XG5cdFx0PC9nPlxuXHQpO1xufVxuXG4vKiogUHVua3Qga29uc3RydWtjeWpueSB3IGJpZcW8xIVjeW0gKDAsMCksIHcgcHggZWtyYW51LiAqL1xuZnVuY3Rpb24gUHVua3RTdmcoIHsgd3lnbGFkOiBbIHN5bWJvbCwgd2llbGtvc2MsIGtvbG9yIF0gfTogeyB3eWdsYWQ6IFd5Z2xhZFB1bmt0dSB9ICkge1xuXHRyZXR1cm4gKFxuXHRcdDxnIGNsYXNzPVwibG9jaS1wdW5rdFwiIHN0eWxlPXt7IHRyYW5zZm9ybTogc2thbGEoIDEgKSB9fSBzdHJva2U9e2tvbG9yfSBzdHJva2Utd2lkdGg9ezF9IGZpbGw9XCJub25lXCI+XG5cdFx0XHR7c3ltYm9sID09PSBcImNpcmNsZVwiICYmIDxjaXJjbGUgcj17d2llbGtvc2MgLyAyfSAvPn1cblx0XHRcdHtzeW1ib2wgPT09IFwiZG90XCIgJiYgPGNpcmNsZSByPXt3aWVsa29zYyAvIDR9IGZpbGw9e2tvbG9yfSBzdHJva2U9XCJub25lXCIgLz59XG5cdFx0XHR7b2RjaW5raVN5bWJvbHUoIHN5bWJvbCwgd2llbGtvc2MgKS5tYXAoICggWyB4MSwgeTEsIHgyLCB5MiBdLCBpICkgPT4gPGxpbmUga2V5PXtpfSB4MT17eDF9IHkxPXt5MX0geDI9e3gyfSB5Mj17eTJ9IC8+ICl9XG5cdFx0PC9nPlxuXHQpO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQix3Q0FBd0M7QUFDeEMsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7O0FBSWpELFNBQVMsUUFBUSxRQUFRLDRCQUE0QjtBQUNyRCxTQUFTLGVBQWUsUUFBd0Isd0JBQXdCO0FBSXhFLFNBQVMsSUFBSSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsY0FBYyxRQUFRLHNCQUFzQjtBQUVsRjs7OztDQUlDLEdBQ0QsT0FBTyxTQUFTLGNBQWUsQ0FBWTtFQUMxQyxNQUFNLENBQUUsTUFBTSxNQUFNLE1BQU0sS0FBTSxHQUFHLEVBQUUsTUFBTTtFQUMzQyxN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