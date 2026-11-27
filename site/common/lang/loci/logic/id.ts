// @project-metadata
// Path: site/common/lang/loci/logic/id.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { IdZnacznika, ZnacznikId } from "../shared/types.ts";

/**
 * Licznik id dla jednego rysunku: id w postaci „znacznik + numer” (p0, csax1 …).
 *
 *   const id = lociId();                       // w szablonie rysunku, osobno dla każdego rysunku
 *   <Loci.p id={id.p()} xy="3,4" />            // "p0"
 *   <Loci.p id={id.p( 7 )} xy="1,2" />         // "p7" — numer wskazany ręcznie
 *   <Loci.p id={id.p()} xy="5,6" />            // "p8" — następny po największym
 *
 * Licznik tworzy się w szablonie, nie w module: moduł żyje na serwerze między wyświetleniami
 * strony, więc wspólny licznik dawałby przy każdym wyświetleniu inne numery.
 * Licznik nie widzi id wpisanych ręcznie (id="p3"); powtórzenie zgłasza wtedy interpreter.
 * csax zaczyna od 1, bo csax0 to podstawowy układ tworzony przez body.
 */

/** Licznik: metoda dla każdego znacznika. Bez liczby — następny numer; z liczbą — ten numer. */
export type LociId = { readonly [Z in ZnacznikId]: ( numer?: number ) => IdZnacznika<Z> };

/** Pierwszy numer nadawany bez wskazania. */
const START: Readonly<Record<ZnacznikId, number>> = { p: 0, csax: 1, csbi: 0, fn: 0, var: 0, v: 0 };

/** Nowy licznik dla jednego rysunku. */
export function lociId(): LociId {
	const uzyte: Record<ZnacznikId, Set<number>> = { p: new Set(), csax: new Set(), csbi: new Set(), fn: new Set(), var: new Set(), v: new Set() };
	const nastepny: Record<ZnacznikId, number> = { ...START };
	const nadaj = <Z extends ZnacznikId>( z: Z, numer?: number ): IdZnacznika<Z> => {
		const n = numer ?? nastepny[z];
		if ( !Number.isInteger( n ) || n < 0 ) throw new RangeError( `LOCI: id ${z}${n} — numer to liczba całkowita ≥ 0` );
		if ( uzyte[z].has( n ) ) throw new Error( `LOCI: id ${z}${n} już nadane; następny wolny: ${z}${nastepny[z]}` );
		uzyte[z].add( n );
		nastepny[z] = Math.max( nastepny[z], n + 1 );
		return `${z}${n}`;
	};
	return {
		p: ( n ) => nadaj( "p", n ),
		csax: ( n ) => nadaj( "csax", n ),
		csbi: ( n ) => nadaj( "csbi", n ),
		fn: ( n ) => nadaj( "fn", n ),
		var: ( n ) => nadaj( "var", n ),
		v: ( n ) => nadaj( "v", n ),
	};
}
