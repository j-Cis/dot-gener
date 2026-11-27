// @project-metadata
// Path: site/screen/loci/interpreter/fn.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIFnProps } from "@/site/common/lang/loci/element/def/LOCIFnElement.ts";
import type { JednostkaKata } from "@/site/common/lang/loci/shared/types.ts";

/** fn w modelu: wzór jako krotka. Wyrażenia nie są jeszcze liczone — zostają tekstem. */
export interface ModelFn {
	id: string;
	param: string;
	wzor: readonly [ postac: "xy", x: string, y: string ] | readonly [ postac: "polar", r: string, kat: string, jednostka: JednostkaKata ];
}

/** Atrybuty fn → model. */
export function fnModel( p: LOCIFnProps ): ModelFn {
	if ( p.x !== undefined ) return { id: p.id, param: p.param, wzor: [ "xy", p.x, p.y ] };
	const [ jednostka, kat ] = p.deg !== undefined ? [ "deg", p.deg ] as const : p.rad !== undefined ? [ "rad", p.rad ] as const : [ "turn", p.turn ] as const;
	return { id: p.id, param: p.param, wzor: [ "polar", p.r, kat, jednostka ] };
}
