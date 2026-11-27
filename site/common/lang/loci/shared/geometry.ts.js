// @project-metadata
// Path: site/common/lang/loci/shared/geometry.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
/**
 * Geometria wspólna. Układ rysunku: X w prawo, Y w górę, kąty w stopniach
 * przeciwnie do ruchu wskazówek zegara.
 */ /** Obszar, gdy rysunek nie ma jeszcze elementów (sam podstawowy ax). */ export const ZAKRES_PUSTY = [
  -100,
  -100,
  100,
  100
];
/**
 * Długość promienia z punktu `p` pod kątem `kat` (stopnie, w układzie rysunku) do brzegu zakresu
 * — półosie i osie są nieskończone, rysujemy je do brzegu obszaru.
 */ export function doBrzegu([x, y], kat, [minX, minY, maxX, maxY]) {
  const r = kat * Math.PI / 180;
  const dx = Math.cos(r), dy = Math.sin(r);
  const E = 1e-12;
  const tx = dx > E ? (maxX - x) / dx : dx < -E ? (minX - x) / dx : Infinity;
  const ty = dy > E ? (maxY - y) / dy : dy < -E ? (minY - y) / dy : Infinity;
  return Math.max(0, Math.min(tx, ty));
}
/** Kąt w podanej jednostce → stopnie. */ export function naStopnie(wartosc, jednostka) {
  return jednostka === "deg" ? wartosc : jednostka === "rad" ? wartosc * 180 / Math.PI : wartosc * 360;
}
/** Punkt [x, y] z układu lokalnego (początek `poczatek`, oś X obrócona o `kat` stopni) → układ rysunku. */ export function wRysunku(poczatek, kat, [x, y]) {
  const r = kat * Math.PI / 180;
  const c = Math.cos(r), s = Math.sin(r);
  return [
    poczatek[0] + x * c - y * s,
    poczatek[1] + x * s + y * c
  ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY29tbW9uL2xhbmcvbG9jaS9zaGFyZWQvZ2VvbWV0cnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvY29tbW9uL2xhbmcvbG9jaS9zaGFyZWQvZ2VvbWV0cnkudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IEplZG5vc3RrYUthdGEsIFB1bmt0MiwgWmFrcmVzIH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuLyoqXG4gKiBHZW9tZXRyaWEgd3Nww7NsbmEuIFVrxYJhZCByeXN1bmt1OiBYIHcgcHJhd28sIFkgdyBnw7NyxJksIGvEhXR5IHcgc3RvcG5pYWNoXG4gKiBwcnplY2l3bmllIGRvIHJ1Y2h1IHdza2F6w7N3ZWsgemVnYXJhLlxuICovXG5cbi8qKiBPYnN6YXIsIGdkeSByeXN1bmVrIG5pZSBtYSBqZXN6Y3plIGVsZW1lbnTDs3cgKHNhbSBwb2RzdGF3b3d5IGF4KS4gKi9cbmV4cG9ydCBjb25zdCBaQUtSRVNfUFVTVFk6IFpha3JlcyA9IFsgLTEwMCwgLTEwMCwgMTAwLCAxMDAgXTtcblxuLyoqXG4gKiBExYJ1Z2/Fm8SHIHByb21pZW5pYSB6IHB1bmt0dSBgcGAgcG9kIGvEhXRlbSBga2F0YCAoc3RvcG5pZSwgdyB1a8WCYWR6aWUgcnlzdW5rdSkgZG8gYnJ6ZWd1IHpha3Jlc3VcbiAqIOKAlCBww7PFgm9zaWUgaSBvc2llIHPEhSBuaWVza2/FhGN6b25lLCByeXN1amVteSBqZSBkbyBicnplZ3Ugb2JzemFydS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRvQnJ6ZWd1KCBbIHgsIHkgXTogUHVua3QyLCBrYXQ6IG51bWJlciwgWyBtaW5YLCBtaW5ZLCBtYXhYLCBtYXhZIF06IFpha3JlcyApOiBudW1iZXIge1xuXHRjb25zdCByID0gKCBrYXQgKiBNYXRoLlBJICkgLyAxODA7XG5cdGNvbnN0IGR4ID0gTWF0aC5jb3MoIHIgKSwgZHkgPSBNYXRoLnNpbiggciApO1xuXHRjb25zdCBFID0gMWUtMTI7XG5cdGNvbnN0IHR4ID0gZHggPiBFID8gKCBtYXhYIC0geCApIC8gZHggOiBkeCA8IC1FID8gKCBtaW5YIC0geCApIC8gZHggOiBJbmZpbml0eTtcblx0Y29uc3QgdHkgPSBkeSA+IEUgPyAoIG1heFkgLSB5ICkgLyBkeSA6IGR5IDwgLUUgPyAoIG1pblkgLSB5ICkgLyBkeSA6IEluZmluaXR5O1xuXHRyZXR1cm4gTWF0aC5tYXgoIDAsIE1hdGgubWluKCB0eCwgdHkgKSApO1xufVxuXG4vKiogS8SFdCB3IHBvZGFuZWogamVkbm9zdGNlIOKGkiBzdG9wbmllLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5hU3RvcG5pZSggd2FydG9zYzogbnVtYmVyLCBqZWRub3N0a2E6IEplZG5vc3RrYUthdGEgKTogbnVtYmVyIHtcblx0cmV0dXJuIGplZG5vc3RrYSA9PT0gXCJkZWdcIiA/IHdhcnRvc2MgOiBqZWRub3N0a2EgPT09IFwicmFkXCIgPyAoIHdhcnRvc2MgKiAxODAgKSAvIE1hdGguUEkgOiB3YXJ0b3NjICogMzYwO1xufVxuXG4vKiogUHVua3QgW3gsIHldIHogdWvFgmFkdSBsb2thbG5lZ28gKHBvY3rEhXRlayBgcG9jemF0ZWtgLCBvxZsgWCBvYnLDs2NvbmEgbyBga2F0YCBzdG9wbmkpIOKGkiB1a8WCYWQgcnlzdW5rdS4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3UnlzdW5rdSggcG9jemF0ZWs6IFB1bmt0Miwga2F0OiBudW1iZXIsIFsgeCwgeSBdOiBQdW5rdDIgKTogUHVua3QyIHtcblx0Y29uc3QgciA9ICgga2F0ICogTWF0aC5QSSApIC8gMTgwO1xuXHRjb25zdCBjID0gTWF0aC5jb3MoIHIgKSwgcyA9IE1hdGguc2luKCByICk7XG5cdHJldHVybiBbIHBvY3phdGVrWzBdICsgeCAqIGMgLSB5ICogcywgcG9jemF0ZWtbMV0gKyB4ICogcyArIHkgKiBjIF07XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLGlEQUFpRDtBQUNqRCw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUlqRDs7O0NBR0MsR0FFRCxzRUFBc0UsR0FDdEUsT0FBTyxNQUFNLGVBQXVCO0VBQUUsQ0FBQztFQUFLLENBQUM7RUFBSztFQUFLO0NBQUssQ0FBQztBQUU3RDs7O0NBR0MsR0FDRCxPQUFPLFNBQVMsU0FBVSxDQUFFLEdBQUcsRUFBVyxFQUFFLEdBQVcsRUFBRSxDQUFFLE1BQU0sTUFBTSxNQUFNLEtBQWM7RUFDMUYsTUFBTSxJQUFJLEFBQUUsTUFBTSxLQUFLLEVBQUUsR0FBSztFQUM5QixNQUFNLEtBQUssS0FBSyxHQUFHLENBQUUsSUFBSyxLQUFLLEtBQUssR0FBRyxDQUFFO0VBQ3pDLE1BQU0sSUFBSTtFQUNWLE1BQU0sS0FBSyxLQUFLLElBQUksQ0FBRSxPQUFPLENBQUUsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUUsT0FBTyxDQUFFLElBQUksS0FBSztFQUN0RSxNQUFNLEtBQUssS0FBSyxJQUFJLENBQUUsT0FBTyxDQUFFLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFFLE9BQU8sQ0FBRSxJQUFJLEtBQUs7RUFDdEUsT0FBTyxLQUFLLEdBQUcsQ0FBRSxHQUFHLEtBQUssR0FBRyxDQUFFLElBQUk7QUFDbkM7QUFFQSx1Q0FBdUMsR0FDdkMsT0FBTyxTQUFTLFVBQVcsT0FBZSxFQUFFLFNBQXdCO0VBQ25FLE9BQU8sY0FBYyxRQUFRLFVBQVUsY0FBYyxRQUFRLEFBQUUsVUFBVSxNQUFRLEtBQUssRUFBRSxHQUFHLFVBQVU7QUFDdEc7QUFFQSx5R0FBeUcsR0FDekcsT0FBTyxTQUFTLFNBQVUsUUFBZ0IsRUFBRSxHQUFXLEVBQUUsQ0FBRSxHQUFHLEVBQVc7RUFDeEUsTUFBTSxJQUFJLEFBQUUsTUFBTSxLQUFLLEVBQUUsR0FBSztFQUM5QixNQUFNLElBQUksS0FBSyxHQUFHLENBQUUsSUFBSyxJQUFJLEtBQUssR0FBRyxDQUFFO0VBQ3ZDLE9BQU87SUFBRSxRQUFRLENBQUMsRUFBRSxHQUFHLElBQUksSUFBSSxJQUFJO0lBQUcsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksSUFBSTtHQUFHO0FBQ3BFIn0=