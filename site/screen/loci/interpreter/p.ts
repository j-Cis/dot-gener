// @project-metadata
// Path: site/screen/loci/interpreter/p.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIPProps } from "@/site/common/lang/loci/element/datum/LOCIPElement.ts";
import type { JednostkaKata } from "@/site/common/lang/loci/shared/types.ts";
import type { Punkt2 } from "./types.ts";
import type { ModelCsax } from "./csax.ts";
import { naStopnie, wRysunku } from "./geometry.ts";
import { liczba } from "./check.ts";

/** Postać położenia, tak jak zapisano ją w atrybutach. */
export type PostacP =
	| readonly [ postac: "xy", x: number, y: number ]
	| readonly [ postac: "polar", r: number, kat: number, jednostka: JednostkaKata ]
	| readonly [ postac: "fn", fn: string, at: string ];

/** p w modelu. */
export interface ModelP {
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

/** Atrybuty p i jego układ → model z położeniem w układzie rysunku. */
export function pModel( p: LOCIPProps, uklad: ModelCsax ): ModelP {
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
