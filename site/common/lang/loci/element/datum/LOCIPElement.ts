// @project-metadata
// Path: site/common/lang/loci/element/datum/LOCIPElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LiczbaTekst } from "../../shared/types.ts";
import type { LOCIIdAttributes } from "../../attribute/LOCIIdAttributes.ts";

/**
 * p — punkt konstrukcyjny (DATUM 0D). Nie należy do rysowanego obiektu. Jego wygląd ustala body,
 * jeden dla wszystkich punktów rysunku.
 * Położenie w układzie `in` (domyślnie podstawowy csax z body), w jednej z trzech postaci:
 *   kartezjańsko:  p id="p2" in="csax0" xy="3,4"
 *   biegunowo:     p id="p3" r="5" deg="30"         (kąt: deg albo rad albo turn)
 *   z funkcji:     p id="p4" fn="spiral" at="t0"    (funkcja fn — id albo alias — w wartości parametru: liczba albo var)
 */

/** Kąt biegunowy: dokładnie jeden z deg / rad / turn. */
type KatP =
	| { deg: LiczbaTekst; rad?: never; turn?: never }
	| { rad: LiczbaTekst; deg?: never; turn?: never }
	| { turn: LiczbaTekst; deg?: never; rad?: never };

/** Położenie: dokładnie jedna z trzech postaci. */
type PolozenieP =
	| { xy: `${number},${number}`; r?: never; deg?: never; rad?: never; turn?: never; fn?: never; at?: never }
	| ({ r: LiczbaTekst; xy?: never; fn?: never; at?: never } & KatP)
	| { fn: string; at: string; xy?: never; r?: never; deg?: never; rad?: never; turn?: never };

export type LOCIPProps = LOCIIdAttributes<"p"> & {
	/** układ odniesienia: id albo alias csax; domyślnie podstawowy csax z body */
	in?: string;
} & PolozenieP;

/** Znacznik p. Sam nic nie robi. */
export function p( _props: LOCIPProps ): null {
	return null;
}
