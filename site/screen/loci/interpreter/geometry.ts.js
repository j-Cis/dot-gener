// @project-metadata
// Path: site/screen/loci/interpreter/geometry.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
/**
 * Geometria rysunku. Układ rysunku: X w prawo, Y w górę, kąty w stopniach
 * przeciwnie do ruchu wskazówek zegara.
 */ /** Obszar, gdy rysunek nie ma jeszcze elementów (sam podstawowy csax). */ export const ZAKRES_PUSTY = [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2xvY2kvaW50ZXJwcmV0ZXIvZ2VvbWV0cnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2xvY2kvaW50ZXJwcmV0ZXIvZ2VvbWV0cnkudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IEplZG5vc3RrYUthdGEgfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi9sYW5nL2xvY2kvc2hhcmVkL3R5cGVzLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFB1bmt0MiwgWmFrcmVzIH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuLyoqXG4gKiBHZW9tZXRyaWEgcnlzdW5rdS4gVWvFgmFkIHJ5c3Vua3U6IFggdyBwcmF3bywgWSB3IGfDs3LEmSwga8SFdHkgdyBzdG9wbmlhY2hcbiAqIHByemVjaXduaWUgZG8gcnVjaHUgd3NrYXrDs3dlayB6ZWdhcmEuXG4gKi9cblxuLyoqIE9ic3phciwgZ2R5IHJ5c3VuZWsgbmllIG1hIGplc3pjemUgZWxlbWVudMOzdyAoc2FtIHBvZHN0YXdvd3kgY3NheCkuICovXG5leHBvcnQgY29uc3QgWkFLUkVTX1BVU1RZOiBaYWtyZXMgPSBbIC0xMDAsIC0xMDAsIDEwMCwgMTAwIF07XG5cbi8qKlxuICogRMWCdWdvxZvEhyBwcm9taWVuaWEgeiBwdW5rdHUgYHBgIHBvZCBrxIV0ZW0gYGthdGAgKHN0b3BuaWUsIHcgdWvFgmFkemllIHJ5c3Vua3UpIGRvIGJyemVndSB6YWtyZXN1XG4gKiDigJQgcMOzxYJvc2llIGkgb3NpZSBzxIUgbmllc2tvxYRjem9uZSwgcnlzdWplbXkgamUgZG8gYnJ6ZWd1IG9ic3phcnUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkb0JyemVndSggWyB4LCB5IF06IFB1bmt0Miwga2F0OiBudW1iZXIsIFsgbWluWCwgbWluWSwgbWF4WCwgbWF4WSBdOiBaYWtyZXMgKTogbnVtYmVyIHtcblx0Y29uc3QgciA9ICgga2F0ICogTWF0aC5QSSApIC8gMTgwO1xuXHRjb25zdCBkeCA9IE1hdGguY29zKCByICksIGR5ID0gTWF0aC5zaW4oIHIgKTtcblx0Y29uc3QgRSA9IDFlLTEyO1xuXHRjb25zdCB0eCA9IGR4ID4gRSA/ICggbWF4WCAtIHggKSAvIGR4IDogZHggPCAtRSA/ICggbWluWCAtIHggKSAvIGR4IDogSW5maW5pdHk7XG5cdGNvbnN0IHR5ID0gZHkgPiBFID8gKCBtYXhZIC0geSApIC8gZHkgOiBkeSA8IC1FID8gKCBtaW5ZIC0geSApIC8gZHkgOiBJbmZpbml0eTtcblx0cmV0dXJuIE1hdGgubWF4KCAwLCBNYXRoLm1pbiggdHgsIHR5ICkgKTtcbn1cblxuLyoqIEvEhXQgdyBwb2RhbmVqIGplZG5vc3RjZSDihpIgc3RvcG5pZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuYVN0b3BuaWUoIHdhcnRvc2M6IG51bWJlciwgamVkbm9zdGthOiBKZWRub3N0a2FLYXRhICk6IG51bWJlciB7XG5cdHJldHVybiBqZWRub3N0a2EgPT09IFwiZGVnXCIgPyB3YXJ0b3NjIDogamVkbm9zdGthID09PSBcInJhZFwiID8gKCB3YXJ0b3NjICogMTgwICkgLyBNYXRoLlBJIDogd2FydG9zYyAqIDM2MDtcbn1cblxuLyoqIFB1bmt0IFt4LCB5XSB6IHVrxYJhZHUgbG9rYWxuZWdvIChwb2N6xIV0ZWsgYHBvY3phdGVrYCwgb8WbIFggb2Jyw7Njb25hIG8gYGthdGAgc3RvcG5pKSDihpIgdWvFgmFkIHJ5c3Vua3UuICovXG5leHBvcnQgZnVuY3Rpb24gd1J5c3Vua3UoIHBvY3phdGVrOiBQdW5rdDIsIGthdDogbnVtYmVyLCBbIHgsIHkgXTogUHVua3QyICk6IFB1bmt0MiB7XG5cdGNvbnN0IHIgPSAoIGthdCAqIE1hdGguUEkgKSAvIDE4MDtcblx0Y29uc3QgYyA9IE1hdGguY29zKCByICksIHMgPSBNYXRoLnNpbiggciApO1xuXHRyZXR1cm4gWyBwb2N6YXRla1swXSArIHggKiBjIC0geSAqIHMsIHBvY3phdGVrWzFdICsgeCAqIHMgKyB5ICogYyBdO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQixpREFBaUQ7QUFDakQsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFLakQ7OztDQUdDLEdBRUQsd0VBQXdFLEdBQ3hFLE9BQU8sTUFBTSxlQUF1QjtFQUFFLENBQUM7RUFBSyxDQUFDO0VBQUs7RUFBSztDQUFLLENBQUM7QUFFN0Q7OztDQUdDLEdBQ0QsT0FBTyxTQUFTLFNBQVUsQ0FBRSxHQUFHLEVBQVcsRUFBRSxHQUFXLEVBQUUsQ0FBRSxNQUFNLE1BQU0sTUFBTSxLQUFjO0VBQzFGLE1BQU0sSUFBSSxBQUFFLE1BQU0sS0FBSyxFQUFFLEdBQUs7RUFDOUIsTUFBTSxLQUFLLEtBQUssR0FBRyxDQUFFLElBQUssS0FBSyxLQUFLLEdBQUcsQ0FBRTtFQUN6QyxNQUFNLElBQUk7RUFDVixNQUFNLEtBQUssS0FBSyxJQUFJLENBQUUsT0FBTyxDQUFFLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFFLE9BQU8sQ0FBRSxJQUFJLEtBQUs7RUFDdEUsTUFBTSxLQUFLLEtBQUssSUFBSSxDQUFFLE9BQU8sQ0FBRSxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBRSxPQUFPLENBQUUsSUFBSSxLQUFLO0VBQ3RFLE9BQU8sS0FBSyxHQUFHLENBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBRSxJQUFJO0FBQ25DO0FBRUEsdUNBQXVDLEdBQ3ZDLE9BQU8sU0FBUyxVQUFXLE9BQWUsRUFBRSxTQUF3QjtFQUNuRSxPQUFPLGNBQWMsUUFBUSxVQUFVLGNBQWMsUUFBUSxBQUFFLFVBQVUsTUFBUSxLQUFLLEVBQUUsR0FBRyxVQUFVO0FBQ3RHO0FBRUEseUdBQXlHLEdBQ3pHLE9BQU8sU0FBUyxTQUFVLFFBQWdCLEVBQUUsR0FBVyxFQUFFLENBQUUsR0FBRyxFQUFXO0VBQ3hFLE1BQU0sSUFBSSxBQUFFLE1BQU0sS0FBSyxFQUFFLEdBQUs7RUFDOUIsTUFBTSxJQUFJLEtBQUssR0FBRyxDQUFFLElBQUssSUFBSSxLQUFLLEdBQUcsQ0FBRTtFQUN2QyxPQUFPO0lBQUUsUUFBUSxDQUFDLEVBQUUsR0FBRyxJQUFJLElBQUksSUFBSTtJQUFHLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxJQUFJLElBQUk7R0FBRztBQUNwRSJ9