// @project-metadata
// Path: site/screen/loci/interpreter/check.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { JednostkaKata, ZnacznikId } from "@/site/common/lang/loci/shared/types.ts";

/** Sprawdzanie wartości atrybutów przy wczytywaniu. */

/** Liczba ≥ 0 albo błąd z nazwą atrybutu. */
export function dodatnia( wartosc: number, atrybut: string ): number {
	if ( !( wartosc >= 0 ) || !Number.isFinite( wartosc ) ) throw new RangeError( `LOCI: ${atrybut} musi być liczbą ≥ 0, jest ${wartosc}` );
	return wartosc;
}

/** Tekst atrybutu → liczba skończona albo błąd z nazwą atrybutu. */
export function liczba( tekst: string, atrybut: string ): number {
	const wartosc = tekst.trim() === "" ? NaN : Number( tekst );
	if ( !Number.isFinite( wartosc ) ) throw new RangeError( `LOCI: ${atrybut}="${tekst}" — oczekiwana liczba, np. "3" albo "-0.5"` );
	return wartosc;
}

/** Postać „znacznik + numer” dla każdego znacznika z id (numer: liczba całkowita ≥ 0, bez zer wiodących). */
const POSTAC_ID = /^(p|csax|csbi|fn|var|v)(0|[1-9][0-9]*)$/;

/** id musi mieć postać „znacznik + numer” dla swojego znacznika. */
export function sprawdzId( znacznik: ZnacznikId, id: string ): void {
	if ( POSTAC_ID.exec( id )?.[1] !== znacznik ) throw new Error( `LOCI: ${znacznik} id="${id}" — id ma postać „${znacznik}” + numer, np. "${znacznik}0"` );
}

/** Alias nie może być pusty ani mieć postaci „znacznik + numer” (byłby dwuznaczny z id). */
export function sprawdzAlias( znacznik: ZnacznikId, id: string, alias: string ): void {
	if ( alias.trim() === "" || POSTAC_ID.test( alias ) ) throw new Error( `LOCI: ${znacznik} id="${id}" as="${alias}" — alias nie może być pusty ani wyglądać jak id` );
}

/** Kąt z jednostką przy liczbie, np. "30deg", "0.5rad", "-0.25turn" → [wartość, jednostka]. */
export function katZJednostka( tekst: string, atrybut: string ): readonly [ wartosc: number, jednostka: JednostkaKata ] {
	const m = /^\s*(.*?)\s*(deg|rad|turn)\s*$/.exec( tekst );
	if ( m === null ) throw new RangeError( `LOCI: ${atrybut}="${tekst}" — kąt z jednostką, np. "30deg", "0.5rad", "0.25turn"` );
	return [ liczba( m[1] ?? "", atrybut ), m[2] as JednostkaKata ];
}
