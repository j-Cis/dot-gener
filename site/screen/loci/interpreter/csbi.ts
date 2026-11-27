// @project-metadata
// Path: site/screen/loci/interpreter/csbi.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCICsbiProps } from "@/site/common/lang/loci/element/datum/LOCICsbiElement.ts";

/** csbi w modelu: bieguny jako id punktów (współrzędne — gdy interpreter będzie je liczył). */
export interface ModelCsbi {
	id: string;
	at: readonly [ biegun1: string, biegun2: string ];
}

/** Atrybuty csbi → model. */
export function csbiModel( p: LOCICsbiProps ): ModelCsbi {
	const czesci = p.at.split( "," ).map( ( s ) => s.trim() );
	const [ b1, b2 ] = czesci;
	if ( czesci.length !== 2 || !b1 || !b2 ) throw new Error( `LOCI: csbi id="${p.id}" at="${p.at}" — dwa punkty po przecinku, np. "p0,p1"` );
	return { id: p.id, at: [ b1, b2 ] };
}
