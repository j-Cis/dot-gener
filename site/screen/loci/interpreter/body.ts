// @project-metadata
// Path: site/screen/loci/interpreter/body.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { CSAX_PODSTAWOWY, type HalfAxis, type LineStyle, type LOCIBodyProps, type PointSymbol } from "@/site/common/lang/loci/element/LOCIBodyElement.ts";
import type { KolorCss } from "@/site/common/lang/loci/shared/types.ts";
import type { Zakres } from "./types.ts";
import { ZAKRES_PUSTY } from "./geometry.ts";
import { dodatnia } from "./check.ts";
import type { ModelCsax } from "./csax.ts";
import type { ModelCsbi } from "./csbi.ts";
import type { ModelP } from "./p.ts";
import type { ModelFn } from "./fn.ts";
import type { ModelVar } from "./var.ts";
import type { ModelV } from "./v.ts";

/**
 * body w modelu: cały rysunek. Wygląd konstrukcji z atrybutów body; brakujące — z wartości
 * domyślnych tego interpretera (wyświetlanie na wyspach).
 */

/** Wygląd konstrukcji, gdy body go nie podaje. */
export const WYGLAD_DOMYSLNY = {
	pointSize: 12,
	pointColor: "#cfcfd0",
	pointSymbol: "rays24",
	axisWidth: 1,
	axisStyle: "dashed",
	axisColor: "#6b7280",
	halfAxisX: [ "#e5484d", 1.5, 1 ],
	halfAxisY: [ "#46a758", 1.5, 1 ],
} as const satisfies Required<Omit<LOCIBodyProps, "csaxId">>;

/** Wygląd punktu konstrukcyjnego: [symbol, wielkość px, kolor]. */
export type WygladPunktu = readonly [ symbol: PointSymbol, wielkosc: number, kolor: KolorCss ];

/** Wygląd linii konstrukcyjnej: [kolor, grubość px, styl, skala grota (0 — bez grota)]. */
export type WygladLinii = readonly [ kolor: KolorCss, grubosc: number, styl: LineStyle, grot: number ];

/** Wygląd czterech półosi układu: +X, +Y, −X, −Y. */
export type WygladPolosi = readonly [ plusX: WygladLinii, plusY: WygladLinii, minusX: WygladLinii, minusY: WygladLinii ];

/** Cały rysunek w modelu: obszar, wygląd konstrukcji, układy (csax: pierwszy to podstawowy), punkty i definicje. */
export interface ModelBody {
	zakres: Zakres;
	/** wygląd wszystkich punktów konstrukcyjnych (p i początki układów) */
	punkt: WygladPunktu;
	/** wygląd półosi wszystkich układów csax */
	polosie: WygladPolosi;
	csax: readonly ModelCsax[];
	p: readonly ModelP[];
	csbi: readonly ModelCsbi[];
	fn: readonly ModelFn[];
	var: readonly ModelVar[];
	/** łamane (elementy rysunku) */
	v: readonly ModelV[];
}

/** Elementy wczytane z dzieci body (csax: z podstawowym na początku). */
export type DzieciBody = Pick<ModelBody, "csax" | "p" | "csbi" | "fn" | "var" | "v">;

/** Podstawowy csax z atrybutów body: w (0,0), bez obrotu. */
export function csaxPodstawowy( p: LOCIBodyProps ): ModelCsax {
	return { id: p.csaxId ?? CSAX_PODSTAWOWY, poczatek: [ 0, 0 ], kat: 0 };
}

/** Atrybuty body i wczytane dzieci → model. */
export function bodyModel( p: LOCIBodyProps, dzieci: DzieciBody ): ModelBody {
	return { zakres: ZAKRES_PUSTY, punkt: wygladPunktu( p ), polosie: wygladPolosi( p ), ...dzieci };
}

/** Atrybuty body → wygląd punktów (brakujące z domyślnych). */
function wygladPunktu( p: LOCIBodyProps ): WygladPunktu {
	return [
		p.pointSymbol ?? WYGLAD_DOMYSLNY.pointSymbol,
		dodatnia( p.pointSize ?? WYGLAD_DOMYSLNY.pointSize, "pointSize" ),
		p.pointColor ?? WYGLAD_DOMYSLNY.pointColor,
	];
}

/** Atrybuty body → wygląd półosi: +X i +Y z halfAxisX/Y (z grotem), −X i −Y konstrukcyjne (bez grota). */
function wygladPolosi( p: LOCIBodyProps ): WygladPolosi {
	const grubosc = dodatnia( p.axisWidth ?? WYGLAD_DOMYSLNY.axisWidth, "axisWidth" );
	const styl = p.axisStyle ?? WYGLAD_DOMYSLNY.axisStyle;
	const konstrukcyjna: WygladLinii = [ p.axisColor ?? WYGLAD_DOMYSLNY.axisColor, grubosc, styl, 0 ];
	/** Półoś z atrybutu; brakująca grubość / skala grota — z domyślnych. */
	const polos = (
		[ kolor, w, grot ]: HalfAxis,
		[ , wD, grotD ]: typeof WYGLAD_DOMYSLNY.halfAxisX | typeof WYGLAD_DOMYSLNY.halfAxisY,
		atrybut: string,
	): WygladLinii => [ kolor, dodatnia( w ?? wD, `${atrybut}[1]` ), styl, dodatnia( grot ?? grotD, `${atrybut}[2]` ) ];
	return [
		polos( p.halfAxisX ?? WYGLAD_DOMYSLNY.halfAxisX, WYGLAD_DOMYSLNY.halfAxisX, "halfAxisX" ),
		polos( p.halfAxisY ?? WYGLAD_DOMYSLNY.halfAxisY, WYGLAD_DOMYSLNY.halfAxisY, "halfAxisY" ),
		konstrukcyjna,
		konstrukcyjna,
	];
}
