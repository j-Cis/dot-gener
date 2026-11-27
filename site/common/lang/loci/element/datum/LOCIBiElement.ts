// @project-metadata
// Path: site/common/lang/loci/element/datum/LOCIBiElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * bi — układ bipolarny (DATUM 2D) z dwoma biegunami w punktach: bi id="bi0" at="p0,p1".
 */
export interface LOCIBiProps {
	id: string;
	/** dwa punkty (bieguny), po przecinku: "p0,p1" */
	at: `${string},${string}`;
}

/** Układ bi po wczytaniu: bieguny jako id punktów (współrzędne — gdy będą punkty). */
export interface LOCIBiElement {
	id: string;
	at: readonly [ biegun1: string, biegun2: string ];
}

/** Atrybuty bi → element. */
export function biElement( p: LOCIBiProps ): LOCIBiElement {
	const czesci = p.at.split( "," ).map( ( s ) => s.trim() );
	const [ b1, b2 ] = czesci;
	if ( czesci.length !== 2 || !b1 || !b2 ) throw new Error( `LOCI: bi id="${p.id}" at="${p.at}" — dwa punkty po przecinku, np. "p0,p1"` );
	return { id: p.id, at: [ b1, b2 ] };
}
