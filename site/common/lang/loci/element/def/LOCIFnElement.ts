// @project-metadata
// Path: site/common/lang/loci/element/def/LOCIFnElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIIdAttributes } from "../../attribute/LOCIIdAttributes.ts";

/**
 * fn — funkcja wyznaczająca współrzędne w zależności od parametru:
 *   kartezjańsko: fn id="fn0" as="spiral" param="t" x="t*cos(2*pi*t)" y="t*sin(2*pi*t)"
 *   biegunowo:    fn id="fn1" as="arc" param="k" r="5" turn="k/6"   (kąt: deg albo rad albo turn)
 * Używana przez id albo alias, np. p … fn="spiral" at="1/3".
 */

/** Kąt biegunowy: dokładnie jeden z deg / rad / turn. */
type KatFn =
	| { deg: string; rad?: never; turn?: never }
	| { rad: string; deg?: never; turn?: never }
	| { turn: string; deg?: never; rad?: never };

/** Wzór: albo x i y, albo r i kąt — nie oba. */
type WzorFn =
	| { x: string; y: string; r?: never; deg?: never; rad?: never; turn?: never }
	| ({ r: string; x?: never; y?: never } & KatFn);

export type LOCIFnProps = LOCIIdAttributes<"fn"> & {
	/** nazwa parametru używana we wzorach, np. "t" */
	param: string;
} & WzorFn;

/** Znacznik fn. Sam nic nie robi. */
export function fn( _props: LOCIFnProps ): null {
	return null;
}
