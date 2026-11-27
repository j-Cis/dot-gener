// @project-metadata
// Path: site/common/lang/loci/model.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { axPodstawowy, bodyElement, type LOCIBodyElement, type LOCIBodyProps } from "./element/LOCIBodyElement.ts";
import type { LOCIAxElement, LOCIAxProps } from "./element/datum/LOCIAxElement.ts";
import { biElement, type LOCIBiElement, type LOCIBiProps } from "./element/datum/LOCIBiElement.ts";
import { type LOCIPElement, type LOCIPProps, pElement } from "./element/datum/LOCIPElement.ts";
import { fnElement, type LOCIFnElement, type LOCIFnProps } from "./element/def/LOCIFnElement.ts";
import { type LOCIVarElement, type LOCIVarProps, varElement } from "./element/def/LOCIVarElement.ts";

/**
 * LOCI — język znaczników geometrii, czysty TypeScript (bez Preact, bez SVG).
 * Klocki: element/ (każdy znacznik w swoim pliku; datum/ — elementy konstrukcyjne: p, ax, bi;
 * def/ — definicje: fn, var), grupy atrybutów: attribute/, wspólne: shared/.
 * Tu: budowa modelu całego rysunku z atrybutów body i jego dzieci.
 * Zamiana na JSX, SVG i Canvas jest poza lang — w site/screen/.
 */

/** Dziecko body: [znacznik, atrybuty]. */
export type LOCIDziecko =
	| readonly [ znacznik: "p", atrybuty: LOCIPProps ]
	| readonly [ znacznik: "ax", atrybuty: LOCIAxProps ]
	| readonly [ znacznik: "bi", atrybuty: LOCIBiProps ]
	| readonly [ znacznik: "fn", atrybuty: LOCIFnProps ]
	| readonly [ znacznik: "var", atrybuty: LOCIVarProps ];

/** Znaczniki, które mogą być dziećmi body. */
export type LOCIZnacznik = LOCIDziecko[0];

/** Model całego rysunku = element body. */
export type LociModel = LOCIBodyElement;

/** Atrybuty body i jego dzieci → model. Sprawdza powtórzone id; układ musi być zdefiniowany przed użyciem. */
export function lociModel( body: LOCIBodyProps, dzieci: readonly LOCIDziecko[] ): LociModel {
	const ax0 = axPodstawowy( body );
	const uklady = new Map<string, LOCIAxElement>( [ [ ax0.id, ax0 ] ] );
	const ps: LOCIPElement[] = [], bis: LOCIBiElement[] = [], fns: LOCIFnElement[] = [], vars: LOCIVarElement[] = [];
	const ids = new Set<string>( [ ax0.id ] );
	for ( const d of dzieci ) {
		switch ( d[0] ) {
			case "p": {
				const nazwa = d[1].in ?? ax0.id;
				const uklad = uklady.get( nazwa );
				if ( uklad === undefined ) throw new Error( `LOCI: p id="${d[1].id}" in="${nazwa}" — nie ma wcześniej takiego układu ax` );
				ps.push( pElement( d[1], uklad ) );
				break;
			}
			case "ax":
				throw new Error( "LOCI: ax — model jeszcze nie przetwarza tego znacznika" );
			case "bi":
				bis.push( biElement( d[1] ) );
				break;
			case "fn":
				fns.push( fnElement( d[1] ) );
				break;
			case "var":
				vars.push( varElement( d[1] ) );
				break;
		}
		const { id } = d[1];
		if ( ids.has( id ) ) throw new Error( `LOCI: id="${id}" użyte więcej niż raz` );
		ids.add( id );
	}
	return bodyElement( body, { ax: [ ...uklady.values() ], p: ps, bi: bis, fn: fns, var: vars } );
}
