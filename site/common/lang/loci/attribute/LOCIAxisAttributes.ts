// @project-metadata
// Path: site/common/lang/loci/attribute/LOCIAxisAttributes.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { KolorCss } from "../shared/types.ts";
import { dodatnia } from "../shared/check.ts";

/** Grupa atrybutów: wygląd osi i półosi konstrukcyjnych (axisWidth, axisStyle, axisColor, halfAxisX, halfAxisY). */

/** Styl linii konstrukcyjnej. */
export type LineStyle = "dashed" | "dotted" | "solid";

/** Półoś: [kolor, grubość w px, skala grota]; pominięte elementy — domyślne. */
export type HalfAxis = readonly [ color: KolorCss, width?: number, arrow?: number ];

export interface LOCIAxisAttributes {
	/** grubość osi i półosi konstrukcyjnych w px ekranu; domyślnie 1 */
	axisWidth?: number;
	/** styl osi i półosi konstrukcyjnych; domyślnie "dashed" */
	axisStyle?: LineStyle;
	/** kolor osi i półosi konstrukcyjnych */
	axisColor?: KolorCss;
	/** dodatnia półoś X: [kolor, grubość, skala grota] */
	halfAxisX?: HalfAxis;
	/** dodatnia półoś Y: [kolor, grubość, skala grota] */
	halfAxisY?: HalfAxis;
}

export const DOMYSLNE_OSI = {
	axisWidth: 1,
	axisStyle: "dashed",
	axisColor: "#6b7280",
	halfAxisX: [ "#e5484d", 1.5, 1 ],
	halfAxisY: [ "#46a758", 1.5, 1 ],
} as const satisfies Required<LOCIAxisAttributes>;

/** Wygląd linii konstrukcyjnej: [kolor, grubość px, styl, skala grota (0 — bez grota)]. */
export type WygladLinii = readonly [ kolor: KolorCss, grubosc: number, styl: LineStyle, grot: number ];

/** Wygląd czterech półosi: +X, +Y, −X, −Y. */
export type WygladPolosi = readonly [ plusX: WygladLinii, plusY: WygladLinii, minusX: WygladLinii, minusY: WygladLinii ];

/** Atrybuty → wygląd półosi: +X i +Y z halfAxisX/Y (z grotem), −X i −Y konstrukcyjne (bez grota). */
export function wygladPolosi( p: LOCIAxisAttributes ): WygladPolosi {
	const grubosc = dodatnia( p.axisWidth ?? DOMYSLNE_OSI.axisWidth, "axisWidth" );
	const styl = p.axisStyle ?? DOMYSLNE_OSI.axisStyle;
	const konstrukcyjna: WygladLinii = [ p.axisColor ?? DOMYSLNE_OSI.axisColor, grubosc, styl, 0 ];
	/** Półoś z atrybutu; brakująca grubość / skala grota — z domyślnych. */
	const polos = (
		[ kolor, w, grot ]: HalfAxis,
		[ , wD, grotD ]: typeof DOMYSLNE_OSI.halfAxisX | typeof DOMYSLNE_OSI.halfAxisY,
		atrybut: string,
	): WygladLinii => [ kolor, dodatnia( w ?? wD, `${atrybut}[1]` ), styl, dodatnia( grot ?? grotD, `${atrybut}[2]` ) ];
	return [
		polos( p.halfAxisX ?? DOMYSLNE_OSI.halfAxisX, DOMYSLNE_OSI.halfAxisX, "halfAxisX" ),
		polos( p.halfAxisY ?? DOMYSLNE_OSI.halfAxisY, DOMYSLNE_OSI.halfAxisY, "halfAxisY" ),
		konstrukcyjna,
		konstrukcyjna,
	];
}
