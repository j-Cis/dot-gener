// @project-metadata
// Path: site/common/lang/loci/shared/check.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/** Sprawdzanie wartości atrybutów. */

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
