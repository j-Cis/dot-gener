// @project-metadata
// Path: site/common/util/kotwice.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type ComponentChildren, createContext } from "preact";

/**
 * Kotwice (#id) nagłówków jednej strony. Layout podaje świeży zbiór na każde renderowanie;
 * Title rezerwuje w nim swoje id, a powtórzone dostaje sufiks -1, -2 … (jak w markdown).
 * Bez dostawcy (null) id nie są pilnowane pod kątem powtórzeń.
 */
export const Kotwice = createContext<Set<string> | null>( null );

/**
 * Tekst → id kotwicy: małe litery; zostają litery (także polskie), cyfry, „.”, „_”, „-”;
 * odstępy → „-”, pozostała interpunkcja znika.
 *   "1.0:: LEKTURA O \"dot-gener\"" → "1.0-lektura-o-dot-gener"
 */
export function slug( tekst: string ): string {
	const s = tekst
		.normalize( "NFC" )
		.toLowerCase()
		.replace( /[^\p{L}\p{N}\s._-]/gu, "" )
		.trim()
		.replace( /\s+/g, "-" )
		.replace( /-{2,}/g, "-" )
		.replace( /^-+|-+$/g, "" );
	return s === "" ? "sekcja" : s;
}

/** Pierwsze wolne id: "x", potem "x-1", "x-2" …; rezerwuje je w zbiorze. */
export function unikalna( uzyte: Set<string> | null, id: string ): string {
	if ( uzyte === null ) return id;
	let wynik = id;
	for ( let n = 1; uzyte.has( wynik ); n++ ) wynik = `${id}-${n}`;
	uzyte.add( wynik );
	return wynik;
}

/** Sam tekst z dzieci JSX, rekurencyjnie: <>LEKTURA <em>x</em></> → "LEKTURA x". */
export function tekstZ( dzieci: ComponentChildren ): string {
	if ( dzieci == null || typeof dzieci === "boolean" ) return "";
	if ( typeof dzieci === "string" || typeof dzieci === "number" || typeof dzieci === "bigint" ) return String( dzieci );
	if ( Array.isArray( dzieci ) ) return dzieci.map( tekstZ ).join( "" );
	if ( typeof dzieci === "object" && "props" in dzieci ) {
		return tekstZ( ( dzieci.props as { children?: ComponentChildren } ).children );
	}
	return "";
}
