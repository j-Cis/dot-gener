// @project-metadata
// Path: site/common/lang/loci/shared/geometry.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { JednostkaKata, Punkt2, Zakres } from "./types.ts";

/**
 * Geometria wspólna. Układ rysunku: X w prawo, Y w górę, kąty w stopniach
 * przeciwnie do ruchu wskazówek zegara.
 */

/** Obszar, gdy rysunek nie ma jeszcze elementów (sam podstawowy ax). */
export const ZAKRES_PUSTY: Zakres = [ -100, -100, 100, 100 ];

/**
 * Długość promienia z punktu `p` pod kątem `kat` (stopnie, w układzie rysunku) do brzegu zakresu
 * — półosie i osie są nieskończone, rysujemy je do brzegu obszaru.
 */
export function doBrzegu( [ x, y ]: Punkt2, kat: number, [ minX, minY, maxX, maxY ]: Zakres ): number {
	const r = ( kat * Math.PI ) / 180;
	const dx = Math.cos( r ), dy = Math.sin( r );
	const E = 1e-12;
	const tx = dx > E ? ( maxX - x ) / dx : dx < -E ? ( minX - x ) / dx : Infinity;
	const ty = dy > E ? ( maxY - y ) / dy : dy < -E ? ( minY - y ) / dy : Infinity;
	return Math.max( 0, Math.min( tx, ty ) );
}

/** Kąt w podanej jednostce → stopnie. */
export function naStopnie( wartosc: number, jednostka: JednostkaKata ): number {
	return jednostka === "deg" ? wartosc : jednostka === "rad" ? ( wartosc * 180 ) / Math.PI : wartosc * 360;
}

/** Punkt [x, y] z układu lokalnego (początek `poczatek`, oś X obrócona o `kat` stopni) → układ rysunku. */
export function wRysunku( poczatek: Punkt2, kat: number, [ x, y ]: Punkt2 ): Punkt2 {
	const r = ( kat * Math.PI ) / 180;
	const c = Math.cos( r ), s = Math.sin( r );
	return [ poczatek[0] + x * c - y * s, poczatek[1] + x * s + y * c ];
}
