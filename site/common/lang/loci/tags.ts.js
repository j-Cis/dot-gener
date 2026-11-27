// @project-metadata
// Path: site/common/lang/loci/tags.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { body } from "./element/LOCIBodyElement.ts";
import { csax } from "./element/datum/LOCICsaxElement.ts";
import { csbi } from "./element/datum/LOCICsbiElement.ts";
import { p } from "./element/datum/LOCIPElement.ts";
import { fn } from "./element/def/LOCIFnElement.ts";
import { varTag } from "./element/def/LOCIVarElement.ts";
import { v } from "./element/curve/LOCIVElement.ts";
/**
 * LOCI — znaczniki <Loci.…>, ich atrybuty i funkcje pomocnicze do wypełniania atrybutów.
 * Tylko tyle: co można użyć i jak. Jak to rozumieć i wyświetlić, ustala odbiorca, np. interpreter
 * i render w site/screen/ dla wysp. Czysty TypeScript, bez Preact.
 *
 *   <VectorViewport renderer="SVG" sourceFormat="LOCI">
 *     <Loci.body csaxId="csax0">
 *       <Loci.p id="p2" xy="3,4" />
 *     </Loci.body>
 *   </VectorViewport>
 */ /** Znaczniki LOCI. Zwykły obiekt (nie funkcja), żeby podpowiedź po `<Loci.` pokazywała tylko znaczniki. */ export const Loci = {
  /** Klocek główny: cały rysunek; atrybuty: wygląd konstrukcji i id układu podstawowego. */ body,
  /** Punkt konstrukcyjny: <Loci.p id="p2" in="csax0" xy="3,4" />, <Loci.p id="p3" r="5" deg="30" />, <Loci.p id="p4" fn="spiral" at="t0" />. */ p,
  /** Układ odniesienia csax (kartezjański i biegunowy): <Loci.csax id="csax1" at="p0" thru="p1" />. */ csax,
  /** Układ bipolarny: <Loci.csbi id="csbi0" at="p0,p1" />. */ csbi,
  /** Funkcja parametru: <Loci.fn id="fn0" as="spiral" param="t" x="…" y="…" /> albo <Loci.fn id="fn1" as="arc" param="k" r="5" turn="k/6" />. */ fn,
  /** Zmienna: <Loci.var id="var0" as="t0" val="1/3" />. */ var: varTag,
  /** Łamana przez n punktów: <Loci.v id="v0" p="p0,p1,p2" />, z cycle (domknięta) i surface (wypełniona). */ v
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY29tbW9uL2xhbmcvbG9jaS90YWdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEBwcm9qZWN0LW1ldGFkYXRhXG4vLyBQYXRoOiBzaXRlL2NvbW1vbi9sYW5nL2xvY2kvdGFncy50c1xuLy8gQXV0aG9yOiBKYW4gUm9tYW4gQ2lzb3dza2lcbi8vIE9SQ0lEOiBodHRwczovL29yY2lkLm9yZy8wMDA5LTAwMDktMjkwNy0zNzkyXG4vLyBSZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vai1DaXMvZG90LWdlbmVyXG5cbmltcG9ydCB7IGJvZHkgfSBmcm9tIFwiLi9lbGVtZW50L0xPQ0lCb2R5RWxlbWVudC50c1wiO1xuaW1wb3J0IHsgY3NheCB9IGZyb20gXCIuL2VsZW1lbnQvZGF0dW0vTE9DSUNzYXhFbGVtZW50LnRzXCI7XG5pbXBvcnQgeyBjc2JpIH0gZnJvbSBcIi4vZWxlbWVudC9kYXR1bS9MT0NJQ3NiaUVsZW1lbnQudHNcIjtcbmltcG9ydCB7IHAgfSBmcm9tIFwiLi9lbGVtZW50L2RhdHVtL0xPQ0lQRWxlbWVudC50c1wiO1xuaW1wb3J0IHsgZm4gfSBmcm9tIFwiLi9lbGVtZW50L2RlZi9MT0NJRm5FbGVtZW50LnRzXCI7XG5pbXBvcnQgeyB2YXJUYWcgfSBmcm9tIFwiLi9lbGVtZW50L2RlZi9MT0NJVmFyRWxlbWVudC50c1wiO1xuaW1wb3J0IHsgdiB9IGZyb20gXCIuL2VsZW1lbnQvY3VydmUvTE9DSVZFbGVtZW50LnRzXCI7XG5cbi8qKlxuICogTE9DSSDigJQgem5hY3puaWtpIDxMb2NpLuKApj4sIGljaCBhdHJ5YnV0eSBpIGZ1bmtjamUgcG9tb2NuaWN6ZSBkbyB3eXBlxYJuaWFuaWEgYXRyeWJ1dMOzdy5cbiAqIFR5bGtvIHR5bGU6IGNvIG1vxbxuYSB1xbx5xIcgaSBqYWsuIEphayB0byByb3p1bWllxIcgaSB3ecWbd2lldGxpxIcsIHVzdGFsYSBvZGJpb3JjYSwgbnAuIGludGVycHJldGVyXG4gKiBpIHJlbmRlciB3IHNpdGUvc2NyZWVuLyBkbGEgd3lzcC4gQ3p5c3R5IFR5cGVTY3JpcHQsIGJleiBQcmVhY3QuXG4gKlxuICogICA8VmVjdG9yVmlld3BvcnQgcmVuZGVyZXI9XCJTVkdcIiBzb3VyY2VGb3JtYXQ9XCJMT0NJXCI+XG4gKiAgICAgPExvY2kuYm9keSBjc2F4SWQ9XCJjc2F4MFwiPlxuICogICAgICAgPExvY2kucCBpZD1cInAyXCIgeHk9XCIzLDRcIiAvPlxuICogICAgIDwvTG9jaS5ib2R5PlxuICogICA8L1ZlY3RvclZpZXdwb3J0PlxuICovXG5cbi8qKiBabmFjem5pa2kgTE9DSS4gWnd5a8WCeSBvYmlla3QgKG5pZSBmdW5rY2phKSwgxbxlYnkgcG9kcG93aWVkxbogcG8gYDxMb2NpLmAgcG9rYXp5d2HFgmEgdHlsa28gem5hY3puaWtpLiAqL1xuZXhwb3J0IGNvbnN0IExvY2kgPSB7XG5cdC8qKiBLbG9jZWsgZ8WCw7N3bnk6IGNhxYJ5IHJ5c3VuZWs7IGF0cnlidXR5OiB3eWdsxIVkIGtvbnN0cnVrY2ppIGkgaWQgdWvFgmFkdSBwb2RzdGF3b3dlZ28uICovXG5cdGJvZHksXG5cdC8qKiBQdW5rdCBrb25zdHJ1a2N5am55OiA8TG9jaS5wIGlkPVwicDJcIiBpbj1cImNzYXgwXCIgeHk9XCIzLDRcIiAvPiwgPExvY2kucCBpZD1cInAzXCIgcj1cIjVcIiBkZWc9XCIzMFwiIC8+LCA8TG9jaS5wIGlkPVwicDRcIiBmbj1cInNwaXJhbFwiIGF0PVwidDBcIiAvPi4gKi9cblx0cCxcblx0LyoqIFVrxYJhZCBvZG5pZXNpZW5pYSBjc2F4IChrYXJ0ZXpqYcWEc2tpIGkgYmllZ3Vub3d5KTogPExvY2kuY3NheCBpZD1cImNzYXgxXCIgYXQ9XCJwMFwiIHRocnU9XCJwMVwiIC8+LiAqL1xuXHRjc2F4LFxuXHQvKiogVWvFgmFkIGJpcG9sYXJueTogPExvY2kuY3NiaSBpZD1cImNzYmkwXCIgYXQ9XCJwMCxwMVwiIC8+LiAqL1xuXHRjc2JpLFxuXHQvKiogRnVua2NqYSBwYXJhbWV0cnU6IDxMb2NpLmZuIGlkPVwiZm4wXCIgYXM9XCJzcGlyYWxcIiBwYXJhbT1cInRcIiB4PVwi4oCmXCIgeT1cIuKAplwiIC8+IGFsYm8gPExvY2kuZm4gaWQ9XCJmbjFcIiBhcz1cImFyY1wiIHBhcmFtPVwia1wiIHI9XCI1XCIgdHVybj1cImsvNlwiIC8+LiAqL1xuXHRmbixcblx0LyoqIFptaWVubmE6IDxMb2NpLnZhciBpZD1cInZhcjBcIiBhcz1cInQwXCIgdmFsPVwiMS8zXCIgLz4uICovXG5cdHZhcjogdmFyVGFnLFxuXHQvKiogxYFhbWFuYSBwcnpleiBuIHB1bmt0w7N3OiA8TG9jaS52IGlkPVwidjBcIiBwPVwicDAscDEscDJcIiAvPiwgeiBjeWNsZSAoZG9ta25pxJl0YSkgaSBzdXJmYWNlICh3eXBlxYJuaW9uYSkuICovXG5cdHYsXG59IGFzIGNvbnN0O1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQixzQ0FBc0M7QUFDdEMsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFFakQsU0FBUyxJQUFJLFFBQVEsK0JBQStCO0FBQ3BELFNBQVMsSUFBSSxRQUFRLHFDQUFxQztBQUMxRCxTQUFTLElBQUksUUFBUSxxQ0FBcUM7QUFDMUQsU0FBUyxDQUFDLFFBQVEsa0NBQWtDO0FBQ3BELFNBQVMsRUFBRSxRQUFRLGlDQUFpQztBQUNwRCxTQUFTLE1BQU0sUUFBUSxrQ0FBa0M7QUFDekQsU0FBUyxDQUFDLFFBQVEsa0NBQWtDO0FBRXBEOzs7Ozs7Ozs7O0NBVUMsR0FFRCx5R0FBeUcsR0FDekcsT0FBTyxNQUFNLE9BQU87RUFDbkIsd0ZBQXdGLEdBQ3hGO0VBQ0EsNElBQTRJLEdBQzVJO0VBQ0EsbUdBQW1HLEdBQ25HO0VBQ0EsMERBQTBELEdBQzFEO0VBQ0EsNklBQTZJLEdBQzdJO0VBQ0EsdURBQXVELEdBQ3ZELEtBQUs7RUFDTCx5R0FBeUcsR0FDekc7QUFDRCxFQUFXIn0=