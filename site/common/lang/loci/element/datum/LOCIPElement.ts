// @project-metadata
// Path: site/common/lang/loci/element/datum/LOCIPElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { JednostkaKata, LiczbaTekst, Punkt2 } from "../../shared/types.ts";
import { naStopnie, wRysunku } from "../../shared/geometry.ts";
import { liczba } from "../../shared/check.ts";
import type { LOCIAxElement } from "./LOCIAxElement.ts";

/**
 * p — punkt konstrukcyjny (DATUM 0D). Nie należy do rysowanego obiektu. Jego wygląd (symbol,
 * wielkość, kolor) ustala body, jeden dla wszystkich punktów rysunku.
 * Położenie w układzie `in` (domyślnie podstawowy ax z body), w jednej z trzech postaci:
 *   kartezjańsko:  p id="p2" in="ax0" xy="3,4"
 *   biegunowo:     p id="p3" r="5" deg="30"         (kąt: deg albo rad albo turn)
 *   z funkcji:     p id="p4" fn="spiral" at="t0"    (funkcja fn w wartości parametru: liczba albo var)
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

export type LOCIPProps = {
	id: string;
	/** układ odniesienia: id ax; domyślnie podstawowy ax z body */
	in?: string;
} & PolozenieP;

/** Postać położenia, tak jak zapisano ją w atrybutach. */
export type PostacP =
	| readonly [ postac: "xy", x: number, y: number ]
	| readonly [ postac: "polar", r: number, kat: number, jednostka: JednostkaKata ]
	| readonly [ postac: "fn", fn: string, at: string ];

/** Punkt po wczytaniu. */
export interface LOCIPElement {
	id: string;
	/** id układu, w którym podano położenie */
	in: string;
	postac: PostacP;
	/** położenie w układzie rysunku */
	polozenie: Punkt2;
}

/** Atrybuty p → postać położenia (bez liczenia). */
export function postacP( p: LOCIPProps ): PostacP {
	if ( p.xy !== undefined ) {
		const czesci = p.xy.split( "," );
		const [ x = "", y = "" ] = czesci;
		if ( czesci.length !== 2 ) throw new Error( `LOCI: p id="${p.id}" xy="${p.xy}" — dwie liczby po przecinku, np. "3,4"` );
		return [ "xy", liczba( x, `p id="${p.id}" xy[0]` ), liczba( y, `p id="${p.id}" xy[1]` ) ];
	}
	if ( p.r !== undefined ) {
		const [ jednostka, kat ] = p.deg !== undefined ? [ "deg", p.deg ] as const : p.rad !== undefined ? [ "rad", p.rad ] as const : [ "turn", p.turn ] as const;
		return [ "polar", liczba( p.r, `p id="${p.id}" r` ), liczba( kat, `p id="${p.id}" ${jednostka}` ), jednostka ];
	}
	return [ "fn", p.fn, p.at ];
}

/** Atrybuty p i jego układ → element z położeniem w układzie rysunku. */
export function pElement( p: LOCIPProps, uklad: LOCIAxElement ): LOCIPElement {
	const postac = postacP( p );
	const lokalnie = polozenieLokalne( p.id, postac );
	return { id: p.id, in: uklad.id, postac, polozenie: wRysunku( uklad.poczatek, uklad.kat, lokalnie ) };
}

/** Położenie w układzie `in`. Postać z funkcji czeka na liczenie wyrażeń fn i var. */
function polozenieLokalne( id: string, postac: PostacP ): Punkt2 {
	switch ( postac[0] ) {
		case "xy":
			return [ postac[1], postac[2] ];
		case "polar": {
			const kat = ( naStopnie( postac[2], postac[3] ) * Math.PI ) / 180;
			return [ postac[1] * Math.cos( kat ), postac[1] * Math.sin( kat ) ];
		}
		case "fn":
			throw new Error( `LOCI: p id="${id}" fn="${postac[1]}" — wyrażenia fn i var nie są jeszcze liczone; użyj xy albo r z kątem` );
	}
}
