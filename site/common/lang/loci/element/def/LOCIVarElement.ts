// @project-metadata
// Path: site/common/lang/loci/element/def/LOCIVarElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * var — zmienna: var id="t0" val="1/3".
 * Używana przez nazwę w innych znacznikach, np. p … fn="spiral" at="t0".
 */
export interface LOCIVarProps {
	/** nazwa zmiennej */
	id: string;
	/** wartość: liczba albo wyrażenie, np. "1/3" */
	val: string;
}

/** Zmienna po wczytaniu. Wyrażenie `val` nie jest jeszcze liczone — zostaje tekstem. */
export interface LOCIVarElement {
	id: string;
	val: string;
}

/** Atrybuty var → element. */
export function varElement( p: LOCIVarProps ): LOCIVarElement {
	return { id: p.id, val: p.val };
}
