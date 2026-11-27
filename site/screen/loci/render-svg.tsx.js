// @project-metadata
// Path: site/screen/loci/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { doBrzegu } from "@/site/common/lang/loci/shared/geometry.ts";
import { KIERUNKI_POLOSI } from "@/site/common/lang/loci/element/frame/LOCIAxElement.ts";
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
    children: /*#__PURE__*/ _jsx("g", {
      transform: "scale(1,-1)",
      children: m.ax.map((ax)=>/*#__PURE__*/ _jsx(AxSvg, {
          ax: ax,
          zakres: m.zakres
        }, ax.id))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvcmVuZGVyLXN2Zy50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IExvY2lNb2RlbCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9tb2RlbC50c1wiO1xuaW1wb3J0IHR5cGUgeyBaYWtyZXMgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvc2hhcmVkL3R5cGVzLnRzXCI7XG5pbXBvcnQgeyBkb0JyemVndSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9zaGFyZWQvZ2VvbWV0cnkudHNcIjtcbmltcG9ydCB7IEtJRVJVTktJX1BPTE9TSSwgdHlwZSBMT0NJQXhFbGVtZW50IH0gZnJvbSBcIkAvc2l0ZS9jb21tb24vbGFuZy9sb2NpL2VsZW1lbnQvZnJhbWUvTE9DSUF4RWxlbWVudC50c1wiO1xuaW1wb3J0IHR5cGUgeyBXeWdsYWRMaW5paSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvbG9jaS9hdHRyaWJ1dGUvTE9DSUF4aXNQcm9wcy50c1wiO1xuaW1wb3J0IHR5cGUgeyBXeWdsYWRQdW5rdHUgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvYXR0cmlidXRlL0xPQ0lQb2ludFByb3BzLnRzXCI7XG5pbXBvcnQgeyBHUk9ULCBLUkVTS0ksIG9kY2lua2lTeW1ib2x1IH0gZnJvbSBcIi4vcmVuZGVyLXdzcG9sbmUudHNcIjtcblxuLyoqXG4gKiBNb2RlbCBMT0NJIOKGkiBTVkcgKHBhcmEgZGxhIGRyYXdMb2NpQ2FudmFzIHogcmVuZGVyLWNhbnZhcy50cykuIE/FmyBZIHcgZ8OzcsSZOiBjYcWCeSByeXN1bmVrXG4gKiB3IDxnIHRyYW5zZm9ybT1cInNjYWxlKDEsLTEpXCI+LiBSb3ptaWFyeSBrb25zdHJ1a2N5am5lIHcgcHggZWtyYW51OiBWZWN0b3JWaWV3cG9ydCB1c3Rhd2lhXG4gKiBuYSB0cmXFm2NpIC0tdnYtcyAoYmllxbzEhWNlIHBvd2nEmWtzemVuaWUpLCBhIHR1IGR6aWVsaSBzacSZIHByemV6IG5pZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckxvY2lTdmcoIG06IExvY2lNb2RlbCApIHtcblx0Y29uc3QgWyBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZIF0gPSBtLnpha3Jlcztcblx0Y29uc3QgdyA9IG1heFggLSBtaW5YLCBoID0gbWF4WSAtIG1pblk7XG5cdHJldHVybiAoXG5cdFx0PHN2Z1xuXHRcdFx0Y2xhc3M9XCJsb2NpXCJcblx0XHRcdHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuXHRcdFx0d2lkdGg9e3d9XG5cdFx0XHRoZWlnaHQ9e2h9XG5cdFx0XHR2aWV3Qm94PXtgJHttaW5YfSAkey1tYXhZfSAke3d9ICR7aH1gfVxuXHRcdFx0c3R5bGU9e3sgb3ZlcmZsb3c6IFwidmlzaWJsZVwiIH19XG5cdFx0PlxuXHRcdFx0PGcgdHJhbnNmb3JtPVwic2NhbGUoMSwtMSlcIj5cblx0XHRcdFx0e20uYXgubWFwKCAoIGF4ICkgPT4gPEF4U3ZnIGtleT17YXguaWR9IGF4PXtheH0gemFrcmVzPXttLnpha3Jlc30gLz4gKX1cblx0XHRcdDwvZz5cblx0XHQ8L3N2Zz5cblx0KTtcbn1cblxuLyoqIHB4IGVrcmFudSDihpIgZMWCdWdvxZvEhyBDU1MgdyBqZWRub3N0a2FjaCByeXN1bmt1LiAqL1xuY29uc3QgcHggPSAoIG46IG51bWJlciApID0+IGBjYWxjKCR7bn1weCAvIHZhcigtLXZ2LXMsIDEpKWA7XG4vKiogU2thbGEgZWxlbWVudHUgcnlzb3dhbmVnbyB3IHB4IGVrcmFudSAoZG8gYHRyYW5zZm9ybWApLiAqL1xuY29uc3Qgc2thbGEgPSAoIGs6IG51bWJlciApID0+IGBzY2FsZShjYWxjKCR7a30gLyB2YXIoLS12di1zLCAxKSkpYDtcblxuLyoqIGF4OiBww7PFgm9zaWUgZG8gYnJ6ZWd1IHpha3Jlc3UgaSBwdW5rdCB3IHBvY3rEhXRrdS4gKi9cbmZ1bmN0aW9uIEF4U3ZnKCB7IGF4LCB6YWtyZXMgfTogeyBheDogTE9DSUF4RWxlbWVudDsgemFrcmVzOiBaYWtyZXMgfSApIHtcblx0Y29uc3QgWyB4LCB5IF0gPSBheC5wb2N6YXRlaztcblx0cmV0dXJuIChcblx0XHQ8ZyBpZD17YXguaWR9IGNsYXNzPVwibG9jaS1heFwiIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3h9ICR7eX0pIHJvdGF0ZSgke2F4LmthdH0pYH0+XG5cdFx0XHR7YXgucG9sb3NpZS5tYXAoICggd3lnbGFkLCBpICkgPT4ge1xuXHRcdFx0XHRjb25zdCBraWVyID0gS0lFUlVOS0lfUE9MT1NJW2ldID8/IDA7XG5cdFx0XHRcdHJldHVybiA8UG9sb3NTdmcga2V5PXtraWVyfSBraWVyPXtraWVyfSBkbHVnb3NjPXtkb0JyemVndSggYXgucG9jemF0ZWssIGF4LmthdCArIGtpZXIsIHpha3JlcyApfSB3eWdsYWQ9e3d5Z2xhZH0gLz47XG5cdFx0XHR9ICl9XG5cdFx0XHQ8UHVua3RTdmcgd3lnbGFkPXtheC5wdW5rdH0gLz5cblx0XHQ8L2c+XG5cdCk7XG59XG5cbi8qKiBQw7PFgm/FmyB6IGJpZcW8xIVjZWdvICgwLDApIHBvZCBrxIV0ZW0gYGtpZXJgIChzdG9wbmllKSwgZMWCdWdvxZtjaSBgZGx1Z29zY2AgKGplZG5vc3RraSByeXN1bmt1KS4gKi9cbmZ1bmN0aW9uIFBvbG9zU3ZnKCB7IGtpZXIsIGRsdWdvc2MsIHd5Z2xhZDogWyBrb2xvciwgZ3J1Ym9zYywgc3R5bCwgZ3JvdCBdIH06IHsga2llcjogbnVtYmVyOyBkbHVnb3NjOiBudW1iZXI7IHd5Z2xhZDogV3lnbGFkTGluaWkgfSApIHtcblx0Y29uc3Qga3Jlc2tpID0gS1JFU0tJW3N0eWxdO1xuXHRjb25zdCBbIGdkLCBncyBdID0gR1JPVDtcblx0cmV0dXJuIChcblx0XHQ8ZyBjbGFzcz1cImxvY2ktcG9sb3NcIiB0cmFuc2Zvcm09e2Byb3RhdGUoJHtraWVyfSlgfT5cblx0XHRcdDxsaW5lXG5cdFx0XHRcdHgxPXswfVxuXHRcdFx0XHR5MT17MH1cblx0XHRcdFx0eDI9e2RsdWdvc2N9XG5cdFx0XHRcdHkyPXswfVxuXHRcdFx0XHRzdHJva2U9e2tvbG9yfVxuXHRcdFx0XHRzdHlsZT17eyBzdHJva2VXaWR0aDogcHgoIGdydWJvc2MgKSwgc3Ryb2tlRGFzaGFycmF5OiBrcmVza2kubGVuZ3RoID8ga3Jlc2tpLm1hcCggcHggKS5qb2luKCBcIiBcIiApIDogXCJub25lXCIgfX1cblx0XHRcdC8+XG5cdFx0XHR7Z3JvdCA+IDAgJiYgKFxuXHRcdFx0XHQ8ZyB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoJHtkbHVnb3NjfSAwKWB9PlxuXHRcdFx0XHRcdDxwYXRoIGQ9e2BNMCAwIEwkey1nZH0gJHtncyAvIDJ9IEwkey1nZH0gJHstZ3MgLyAyfSBaYH0gZmlsbD17a29sb3J9IHN0eWxlPXt7IHRyYW5zZm9ybTogc2thbGEoIGdyb3QgKSB9fSAvPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQpfVxuXHRcdDwvZz5cblx0KTtcbn1cblxuLyoqIFB1bmt0IGtvbnN0cnVrY3lqbnkgdyBiaWXFvMSFY3ltICgwLDApLCB3IHB4IGVrcmFudS4gKi9cbmZ1bmN0aW9uIFB1bmt0U3ZnKCB7IHd5Z2xhZDogWyBzeW1ib2wsIHdpZWxrb3NjLCBrb2xvciBdIH06IHsgd3lnbGFkOiBXeWdsYWRQdW5rdHUgfSApIHtcblx0cmV0dXJuIChcblx0XHQ8ZyBjbGFzcz1cImxvY2ktcHVua3RcIiBzdHlsZT17eyB0cmFuc2Zvcm06IHNrYWxhKCAxICkgfX0gc3Ryb2tlPXtrb2xvcn0gc3Ryb2tlLXdpZHRoPXsxfSBmaWxsPVwibm9uZVwiPlxuXHRcdFx0e3N5bWJvbCA9PT0gXCJjaXJjbGVcIiAmJiA8Y2lyY2xlIHI9e3dpZWxrb3NjIC8gMn0gLz59XG5cdFx0XHR7c3ltYm9sID09PSBcImRvdFwiICYmIDxjaXJjbGUgcj17d2llbGtvc2MgLyA0fSBmaWxsPXtrb2xvcn0gc3Ryb2tlPVwibm9uZVwiIC8+fVxuXHRcdFx0e29kY2lua2lTeW1ib2x1KCBzeW1ib2wsIHdpZWxrb3NjICkubWFwKCAoIFsgeDEsIHkxLCB4MiwgeTIgXSwgaSApID0+IDxsaW5lIGtleT17aX0geDE9e3gxfSB5MT17eTF9IHgyPXt4Mn0geTI9e3kyfSAvPiApfVxuXHRcdDwvZz5cblx0KTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEOztBQUlqRCxTQUFTLFFBQVEsUUFBUSw2Q0FBNkM7QUFDdEUsU0FBUyxlQUFlLFFBQTRCLHlEQUF5RDtBQUc3RyxTQUFTLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxRQUFRLHNCQUFzQjtBQUVuRTs7OztDQUlDLEdBQ0QsT0FBTyxTQUFTLGNBQWUsQ0FBWTtFQUMxQyxNQUFNLENBQUUsTUFBTSxNQUFNLE1BQU0sS0FBTSxHQUFHLEVBQUUsTUFBTTtFQUMzQyxNQUFNLElBQUksT0FBTyxNQUFNLElBQUksT0FBTztFQUNsQyxxQkFDQyxLQUFDO0lBQ0EsT0FBTTtJQUNOLE9BQU07SUFDTixPQUFPO0lBQ1AsUUFBUTtJQUNSLFNBQVMsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUc7SUFDckMsT0FBTztNQUFFLFVBQVU7SUFBVTtjQUU3QixjQUFBLEtBQUM7TUFBRSxXQUFVO2dCQUNYLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBRSxDQUFFLG1CQUFRLEtBQUM7VUFBa0IsSUFBSTtVQUFJLFFBQVEsRUFBRSxNQUFNO1dBQS9CLEdBQUcsRUFBRTs7O0FBSTFD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