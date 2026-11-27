// @project-metadata
// Path: site/common/lang/loci/element/def/LOCIFnElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { JednostkaKata } from "../../shared/types.ts";

/**
 * fn — funkcja wyznaczająca współrzędne w zależności od parametru:
 *   kartezjańsko: fn id="spiral" param="t" x="t*cos(2*pi*t)" y="t*sin(2*pi*t)"
 *   biegunowo:    fn id="arc" param="k" r="5" turn="k/6"   (kąt: deg albo rad albo turn)
 * Używana przez nazwę, np. p … fn="spiral" at="1/3".
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

export type LOCIFnProps = {
	/** nazwa funkcji */
	id: string;
	/** nazwa parametru używana we wzorach, np. "t" */
	param: string;
} & WzorFn;

/** Funkcja po wczytaniu: wzór jako krotka. Wyrażenia nie są jeszcze liczone — zostają tekstem. */
export interface LOCIFnElement {
	id: string;
	param: string;
	wzor: readonly [ postac: "xy", x: string, y: string ] | readonly [ postac: "polar", r: string, kat: string, jednostka: JednostkaKata ];
}

/** Atrybuty fn → element. */
export function fnElement( p: LOCIFnProps ): LOCIFnElement {
	if ( p.x !== undefined ) return { id: p.id, param: p.param, wzor: [ "xy", p.x, p.y ] };
	const [ jednostka, kat ] = p.deg !== undefined ? [ "deg", p.deg ] as const : p.rad !== undefined ? [ "rad", p.rad ] as const : [ "turn", p.turn ] as const;
	return { id: p.id, param: p.param, wzor: [ "polar", p.r, kat, jednostka ] };
}
