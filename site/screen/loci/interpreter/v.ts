// @project-metadata
// Path: site/screen/loci/interpreter/v.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIVProps } from "@/site/common/lang/loci/element/curve/LOCIVElement.ts";
import type { LineStyle } from "@/site/common/lang/loci/element/LOCIBodyElement.ts";
import type { JednostkaKata, KolorCss } from "@/site/common/lang/loci/shared/types.ts";
import type { Punkt2 } from "./types.ts";
import type { ModelCsax } from "./csax.ts";
import { naStopnie, wRysunku } from "./geometry.ts";
import { dodatnia, katZJednostka, liczba } from "./check.ts";

/** Wygląd linii v, gdy element go nie podaje. */
export const WYGLAD_V_DOMYSLNY = {
	lineWidth: 1,
	lineColor: "#cfcfd0",
	lineStyle: "solid",
} as const satisfies Required<Pick<LOCIVProps, "lineWidth" | "lineColor" | "lineStyle">>;

/** Wygląd linii: [kolor, grubość w jednostkach rysunku, styl]. */
export type WygladV = readonly [ kolor: KolorCss, grubosc: number, styl: LineStyle ];

/** v w modelu: punkty w układzie rysunku i wygląd. */
export interface ModelV {
	id: string;
	punkty: readonly Punkt2[];
	cycle: boolean;
	surface: boolean;
	wyglad: WygladV;
}

/** Skąd interpreter bierze istniejące punkty i układy (po id albo aliasie); brak → błąd. */
export interface ZrodlaV {
	punkt: ( nazwa: string ) => Punkt2;
	uklad: ( nazwa: string ) => ModelCsax;
	/** id podstawowego układu (domyślne in) */
	csax0: string;
}

/** Atrybuty v → model. */
export function vModel( p: LOCIVProps, z: ZrodlaV ): ModelV {
	const opis = `v id="${p.id}"`;
	const punkty = p.p !== undefined ? lista( p.p, ",", `${opis} p` ).map( z.punkt ) : wpisane( p, z, opis );
	if ( punkty.length < 2 ) throw new Error( `LOCI: ${opis} — potrzeba co najmniej dwóch punktów` );
	return {
		id: p.id,
		punkty,
		cycle: p.cycle === true,
		surface: p.surface === true,
		wyglad: [
			p.lineColor ?? WYGLAD_V_DOMYSLNY.lineColor,
			dodatnia( p.lineWidth ?? WYGLAD_V_DOMYSLNY.lineWidth, `${opis} lineWidth` ),
			p.lineStyle ?? WYGLAD_V_DOMYSLNY.lineStyle,
		],
	};
}

/** Punkty wpisane (px+py, pxy, pr+kąt) → układ rysunku, każdy w swoim układzie `in`. */
function wpisane( p: Exclude<LOCIVProps, { p: string }>, z: ZrodlaV, opis: string ): Punkt2[] {
	const lokalne = lokalnePunkty( p, opis );
	const nazwy = p.in === undefined ? [ z.csax0 ] : lista( p.in, ",", `${opis} in` );
	if ( nazwy.length !== 1 && nazwy.length !== lokalne.length ) {
		throw new Error( `LOCI: ${opis} in — jeden układ dla wszystkich albo po jednym na punkt (punktów: ${lokalne.length}, układów: ${nazwy.length})` );
	}
	return lokalne.map( ( punkt, i ) => {
		const uklad = z.uklad( nazwy.length === 1 ? nazwy[0] ?? z.csax0 : nazwy[i] ?? z.csax0 );
		return wRysunku( uklad.poczatek, uklad.kat, punkt );
	} );
}

/** Punkty w swoich układach, jeszcze przed przeliczeniem do układu rysunku. */
function lokalnePunkty( p: Exclude<LOCIVProps, { p: string }>, opis: string ): Punkt2[] {
	if ( p.px !== undefined ) {
		const xs = liczby( p.px, `${opis} px` ), ys = liczby( p.py, `${opis} py` );
		if ( xs.length !== ys.length ) throw new Error( `LOCI: ${opis} — px i py muszą mieć tyle samo liczb (${xs.length} ≠ ${ys.length})` );
		return xs.map( ( x, i ): Punkt2 => [ x, ys[i] ?? 0 ] );
	}
	if ( p.pxy !== undefined ) {
		return lista( p.pxy, ";", `${opis} pxy` ).map( ( para, i ): Punkt2 => {
			const xy = liczby( para, `${opis} pxy[${i}]` );
			const [ x, y ] = xy;
			if ( xy.length !== 2 || x === undefined || y === undefined ) throw new Error( `LOCI: ${opis} pxy[${i}]="${para}" — para x,y, np. "3,4"` );
			return [ x, y ];
		} );
	}
	const rs = liczby( p.pr, `${opis} pr` );
	const katy: readonly (readonly [ number, JednostkaKata ])[] = p.pa !== undefined
		? lista( p.pa, ",", `${opis} pa` ).map( ( k, i ) => katZJednostka( k, `${opis} pa[${i}]` ) )
		: p.pdeg !== undefined
		? liczby( p.pdeg, `${opis} pdeg` ).map( ( k ) => [ k, "deg" ] as const )
		: p.prad !== undefined
		? liczby( p.prad, `${opis} prad` ).map( ( k ) => [ k, "rad" ] as const )
		: liczby( p.pturn, `${opis} pturn` ).map( ( k ) => [ k, "turn" ] as const );
	if ( rs.length !== katy.length ) throw new Error( `LOCI: ${opis} — pr i kąty muszą mieć tyle samo wartości (${rs.length} ≠ ${katy.length})` );
	return rs.map( ( r, i ): Punkt2 => {
		const [ wartosc, jednostka ] = katy[i] ?? [ 0, "deg" ];
		const a = ( naStopnie( wartosc, jednostka ) * Math.PI ) / 180;
		return [ r * Math.cos( a ), r * Math.sin( a ) ];
	} );
}

/** Lista po separatorze; puste pozycje to błąd. */
function lista( tekst: string, sep: string, atrybut: string ): string[] {
	const czesci = tekst.split( sep ).map( ( s ) => s.trim() );
	if ( czesci.some( ( s ) => s === "" ) ) throw new Error( `LOCI: ${atrybut}="${tekst}" — pusta pozycja na liście` );
	return czesci;
}

/** Lista liczb po przecinku. */
function liczby( tekst: string, atrybut: string ): number[] {
	return lista( tekst, ",", atrybut ).map( ( s, i ) => liczba( s, `${atrybut}[${i}]` ) );
}
