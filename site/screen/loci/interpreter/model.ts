// @project-metadata
// Path: site/screen/loci/interpreter/model.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIBodyProps } from "@/site/common/lang/loci/element/LOCIBodyElement.ts";
import type { LOCIPProps } from "@/site/common/lang/loci/element/datum/LOCIPElement.ts";
import type { LOCICsaxProps } from "@/site/common/lang/loci/element/datum/LOCICsaxElement.ts";
import type { LOCICsbiProps } from "@/site/common/lang/loci/element/datum/LOCICsbiElement.ts";
import type { LOCIFnProps } from "@/site/common/lang/loci/element/def/LOCIFnElement.ts";
import type { LOCIVarProps } from "@/site/common/lang/loci/element/def/LOCIVarElement.ts";
import { bodyModel, csaxPodstawowy, type ModelBody } from "./body.ts";
import type { ModelCsax } from "./csax.ts";
import { csbiModel, type ModelCsbi } from "./csbi.ts";
import { type ModelP, pModel } from "./p.ts";
import { fnModel, type ModelFn } from "./fn.ts";
import { type ModelVar, varModel } from "./var.ts";
import { sprawdzAlias, sprawdzId } from "./check.ts";

/**
 * Interpreter LOCI dla wysp: atrybuty znaczników → model rysunku. Sprawdza błędy (postać id i aliasu,
 * powtórzone id albo alias, układ użyty przed zdefiniowaniem) i liczy geometrię. Każdy znacznik ma tu swój plik.
 */

/** Dziecko body: [znacznik, atrybuty]. */
export type Dziecko =
	| readonly [ znacznik: "p", atrybuty: LOCIPProps ]
	| readonly [ znacznik: "csax", atrybuty: LOCICsaxProps ]
	| readonly [ znacznik: "csbi", atrybuty: LOCICsbiProps ]
	| readonly [ znacznik: "fn", atrybuty: LOCIFnProps ]
	| readonly [ znacznik: "var", atrybuty: LOCIVarProps ];

/** Znaczniki, które mogą być dziećmi body. */
export type ZnacznikDziecka = Dziecko[0];

/** Model całego rysunku = model body. */
export type LociModel = ModelBody;

/** Atrybuty body i jego dzieci → model. Sprawdza id i aliasy; układ musi być zdefiniowany przed użyciem. */
export function lociModel( body: LOCIBodyProps, dzieci: readonly Dziecko[] ): LociModel {
	const csax0 = csaxPodstawowy( body );
	sprawdzId( "csax", csax0.id );
	const uklady = new Map<string, ModelCsax>( [ [ csax0.id, csax0 ] ] );
	const ps: ModelP[] = [], csbis: ModelCsbi[] = [], fns: ModelFn[] = [], vars: ModelVar[] = [];
	/** Wszystkie nazwy dokumentu: id i aliasy → id. */
	const nazwy = new Map<string, string>( [ [ csax0.id, csax0.id ] ] );
	for ( const d of dzieci ) {
		const { id, as } = d[1];
		sprawdzId( d[0], id );
		if ( nazwy.has( id ) ) throw new Error( `LOCI: id="${id}" użyte więcej niż raz` );
		nazwy.set( id, id );
		if ( as !== undefined ) {
			sprawdzAlias( d[0], id, as );
			if ( nazwy.has( as ) ) throw new Error( `LOCI: alias as="${as}" (${id}) użyty więcej niż raz` );
			nazwy.set( as, id );
		}
		switch ( d[0] ) {
			case "p": {
				const nazwa = d[1].in ?? csax0.id;
				const uklad = uklady.get( nazwy.get( nazwa ) ?? nazwa );
				if ( uklad === undefined ) throw new Error( `LOCI: p id="${d[1].id}" in="${nazwa}" — nie ma wcześniej takiego układu csax` );
				ps.push( pModel( d[1], uklad ) );
				break;
			}
			case "csax":
				throw new Error( "LOCI: csax — interpreter jeszcze nie przetwarza tego znacznika" );
			case "csbi":
				csbis.push( csbiModel( d[1] ) );
				break;
			case "fn":
				fns.push( fnModel( d[1] ) );
				break;
			case "var":
				vars.push( varModel( d[1] ) );
				break;
		}
	}
	return bodyModel( body, { csax: [ ...uklady.values() ], p: ps, csbi: csbis, fn: fns, var: vars } );
}
