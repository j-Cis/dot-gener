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
  /** Zmienna: <Loci.var id="var0" as="t0" val="1/3" />. */ var: varTag
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY29tbW9uL2xhbmcvbG9jaS90YWdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEBwcm9qZWN0LW1ldGFkYXRhXG4vLyBQYXRoOiBzaXRlL2NvbW1vbi9sYW5nL2xvY2kvdGFncy50c1xuLy8gQXV0aG9yOiBKYW4gUm9tYW4gQ2lzb3dza2lcbi8vIE9SQ0lEOiBodHRwczovL29yY2lkLm9yZy8wMDA5LTAwMDktMjkwNy0zNzkyXG4vLyBSZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vai1DaXMvZG90LWdlbmVyXG5cbmltcG9ydCB7IGJvZHkgfSBmcm9tIFwiLi9lbGVtZW50L0xPQ0lCb2R5RWxlbWVudC50c1wiO1xuaW1wb3J0IHsgY3NheCB9IGZyb20gXCIuL2VsZW1lbnQvZGF0dW0vTE9DSUNzYXhFbGVtZW50LnRzXCI7XG5pbXBvcnQgeyBjc2JpIH0gZnJvbSBcIi4vZWxlbWVudC9kYXR1bS9MT0NJQ3NiaUVsZW1lbnQudHNcIjtcbmltcG9ydCB7IHAgfSBmcm9tIFwiLi9lbGVtZW50L2RhdHVtL0xPQ0lQRWxlbWVudC50c1wiO1xuaW1wb3J0IHsgZm4gfSBmcm9tIFwiLi9lbGVtZW50L2RlZi9MT0NJRm5FbGVtZW50LnRzXCI7XG5pbXBvcnQgeyB2YXJUYWcgfSBmcm9tIFwiLi9lbGVtZW50L2RlZi9MT0NJVmFyRWxlbWVudC50c1wiO1xuXG4vKipcbiAqIExPQ0kg4oCUIHpuYWN6bmlraSA8TG9jaS7igKY+LCBpY2ggYXRyeWJ1dHkgaSBmdW5rY2plIHBvbW9jbmljemUgZG8gd3lwZcWCbmlhbmlhIGF0cnlidXTDs3cuXG4gKiBUeWxrbyB0eWxlOiBjbyBtb8W8bmEgdcW8ecSHIGkgamFrLiBKYWsgdG8gcm96dW1pZcSHIGkgd3nFm3dpZXRsacSHLCB1c3RhbGEgb2RiaW9yY2EsIG5wLiBpbnRlcnByZXRlclxuICogaSByZW5kZXIgdyBzaXRlL3NjcmVlbi8gZGxhIHd5c3AuIEN6eXN0eSBUeXBlU2NyaXB0LCBiZXogUHJlYWN0LlxuICpcbiAqICAgPFZlY3RvclZpZXdwb3J0IHJlbmRlcmVyPVwiU1ZHXCIgc291cmNlRm9ybWF0PVwiTE9DSVwiPlxuICogICAgIDxMb2NpLmJvZHkgY3NheElkPVwiY3NheDBcIj5cbiAqICAgICAgIDxMb2NpLnAgaWQ9XCJwMlwiIHh5PVwiMyw0XCIgLz5cbiAqICAgICA8L0xvY2kuYm9keT5cbiAqICAgPC9WZWN0b3JWaWV3cG9ydD5cbiAqL1xuXG4vKiogWm5hY3puaWtpIExPQ0kuIFp3eWvFgnkgb2JpZWt0IChuaWUgZnVua2NqYSksIMW8ZWJ5IHBvZHBvd2llZMW6IHBvIGA8TG9jaS5gIHBva2F6eXdhxYJhIHR5bGtvIHpuYWN6bmlraS4gKi9cbmV4cG9ydCBjb25zdCBMb2NpID0ge1xuXHQvKiogS2xvY2VrIGfFgsOzd255OiBjYcWCeSByeXN1bmVrOyBhdHJ5YnV0eTogd3lnbMSFZCBrb25zdHJ1a2NqaSBpIGlkIHVrxYJhZHUgcG9kc3Rhd293ZWdvLiAqL1xuXHRib2R5LFxuXHQvKiogUHVua3Qga29uc3RydWtjeWpueTogPExvY2kucCBpZD1cInAyXCIgaW49XCJjc2F4MFwiIHh5PVwiMyw0XCIgLz4sIDxMb2NpLnAgaWQ9XCJwM1wiIHI9XCI1XCIgZGVnPVwiMzBcIiAvPiwgPExvY2kucCBpZD1cInA0XCIgZm49XCJzcGlyYWxcIiBhdD1cInQwXCIgLz4uICovXG5cdHAsXG5cdC8qKiBVa8WCYWQgb2RuaWVzaWVuaWEgY3NheCAoa2FydGV6amHFhHNraSBpIGJpZWd1bm93eSk6IDxMb2NpLmNzYXggaWQ9XCJjc2F4MVwiIGF0PVwicDBcIiB0aHJ1PVwicDFcIiAvPi4gKi9cblx0Y3NheCxcblx0LyoqIFVrxYJhZCBiaXBvbGFybnk6IDxMb2NpLmNzYmkgaWQ9XCJjc2JpMFwiIGF0PVwicDAscDFcIiAvPi4gKi9cblx0Y3NiaSxcblx0LyoqIEZ1bmtjamEgcGFyYW1ldHJ1OiA8TG9jaS5mbiBpZD1cImZuMFwiIGFzPVwic3BpcmFsXCIgcGFyYW09XCJ0XCIgeD1cIuKAplwiIHk9XCLigKZcIiAvPiBhbGJvIDxMb2NpLmZuIGlkPVwiZm4xXCIgYXM9XCJhcmNcIiBwYXJhbT1cImtcIiByPVwiNVwiIHR1cm49XCJrLzZcIiAvPi4gKi9cblx0Zm4sXG5cdC8qKiBabWllbm5hOiA8TG9jaS52YXIgaWQ9XCJ2YXIwXCIgYXM9XCJ0MFwiIHZhbD1cIjEvM1wiIC8+LiAqL1xuXHR2YXI6IHZhclRhZyxcbn0gYXMgY29uc3Q7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLHNDQUFzQztBQUN0Qyw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUVqRCxTQUFTLElBQUksUUFBUSwrQkFBK0I7QUFDcEQsU0FBUyxJQUFJLFFBQVEscUNBQXFDO0FBQzFELFNBQVMsSUFBSSxRQUFRLHFDQUFxQztBQUMxRCxTQUFTLENBQUMsUUFBUSxrQ0FBa0M7QUFDcEQsU0FBUyxFQUFFLFFBQVEsaUNBQWlDO0FBQ3BELFNBQVMsTUFBTSxRQUFRLGtDQUFrQztBQUV6RDs7Ozs7Ozs7OztDQVVDLEdBRUQseUdBQXlHLEdBQ3pHLE9BQU8sTUFBTSxPQUFPO0VBQ25CLHdGQUF3RixHQUN4RjtFQUNBLDRJQUE0SSxHQUM1STtFQUNBLG1HQUFtRyxHQUNuRztFQUNBLDBEQUEwRCxHQUMxRDtFQUNBLDZJQUE2SSxHQUM3STtFQUNBLHVEQUF1RCxHQUN2RCxLQUFLO0FBQ04sRUFBVyJ9