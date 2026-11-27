// @project-metadata
// Path: site/common/lang/loci/model.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { bodyElement, type LOCIBodyElement, type LOCIBodyProps } from "./element/LOCIBodyElement.ts";
import type { LOCIAxProps } from "./element/frame/LOCIAxElement.ts";
import { biElement, type LOCIBiElement, type LOCIBiProps } from "./element/frame/LOCIBiElement.ts";
import { fnElement, type LOCIFnElement, type LOCIFnProps } from "./element/def/LOCIFnElement.ts";
import { type LOCIVarElement, type LOCIVarProps, varElement } from "./element/def/LOCIVarElement.ts";

/**
 * LOCI — język znaczników geometrii, czysty TypeScript (bez Preact, bez SVG).
 * Klocki: element/ (każdy znacznik w swoim pliku), grupy atrybutów: attribute/, wspólne: shared/.
 * Tu: budowa modelu całego rysunku z atrybutów body i jego dzieci.
 * Zamiana na JSX, SVG i Canvas jest poza lang — w site/screen/.
 */

/** Dziecko body: [znacznik, atrybuty]. */
export type LOCIDziecko =
	| readonly [ znacznik: "ax", atrybuty: LOCIAxProps ]
	| readonly [ znacznik: "bi", atrybuty: LOCIBiProps ]
	| readonly [ znacznik: "fn", atrybuty: LOCIFnProps ]
	| readonly [ znacznik: "var", atrybuty: LOCIVarProps ];

/** Znaczniki, które mogą być dziećmi body. */
export type LOCIZnacznik = LOCIDziecko[0];

/** Model całego rysunku = element body. */
export type LociModel = LOCIBodyElement;

/** Atrybuty body i jego dzieci → model. Sprawdza powtórzone id. */
export function lociModel( body: LOCIBodyProps, dzieci: readonly LOCIDziecko[] ): LociModel {
	const bis: LOCIBiElement[] = [], fns: LOCIFnElement[] = [], vars: LOCIVarElement[] = [];
	const ids = new Set<string>( [ body.axId ?? "ax0" ] );
	for ( const d of dzieci ) {
		switch ( d[0] ) {
			case "ax":
				throw new Error( "LOCI: ax wymaga punktów (at, thru), a znacznika punktu jeszcze nie ma" );
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
	return bodyElement( body, { bi: bis, fn: fns, var: vars } );
}
