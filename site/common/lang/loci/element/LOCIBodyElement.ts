// @project-metadata
// Path: site/common/lang/loci/element/LOCIBodyElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { IdZnacznika, KolorCss } from "../shared/types.ts";

/**
 * body — klocek główny: cały rysunek. Tylko body decyduje o wyglądzie elementów konstrukcyjnych
 * (DATUM): jeden wygląd dla wszystkich. Same elementy konstrukcyjne mają tylko geometrię.
 * Body tworzy podstawowy układ csax; jego id podaje csaxId.
 */

/** Symbol punktu konstrukcyjnego: "rays24" — 12 przeciętych linii (24 kierunki), "cross" — krzyżyk, "circle" — okrąg, "dot" — kropka. */
export type PointSymbol = "rays24" | "cross" | "circle" | "dot";

/** Styl linii konstrukcyjnej. */
export type LineStyle = "dashed" | "dotted" | "solid";

/** Półoś: [kolor, grubość w px, skala grota]; pominięte elementy — domyślne. */
export type HalfAxis = readonly [ color: KolorCss, width?: number, arrow?: number ];

export interface LOCIBodyProps {
	/** id podstawowego układu odniesienia csax; domyślnie "csax0" */
	csaxId?: IdZnacznika<"csax">;
	/** wielkość punktów konstrukcyjnych w px ekranu */
	pointSize?: number;
	/** kolor punktów konstrukcyjnych */
	pointColor?: KolorCss;
	/** symbol punktów konstrukcyjnych */
	pointSymbol?: PointSymbol;
	/** grubość osi i półosi konstrukcyjnych w px ekranu */
	axisWidth?: number;
	/** styl osi i półosi konstrukcyjnych */
	axisStyle?: LineStyle;
	/** kolor osi i półosi konstrukcyjnych */
	axisColor?: KolorCss;
	/** dodatnia półoś X układów csax: [kolor, grubość, skala grota] */
	halfAxisX?: HalfAxis;
	/** dodatnia półoś Y układów csax: [kolor, grubość, skala grota] */
	halfAxisY?: HalfAxis;
}

/** id podstawowego układu, gdy body nie podaje csaxId — reguła języka. */
export const CSAX_PODSTAWOWY: IdZnacznika<"csax"> = "csax0";

/** Znacznik body: atrybuty i dzieci (znaczniki LOCI). Sam nic nie robi. */
export function body( _props: LOCIBodyProps & { children?: unknown } ): null {
	return null;
}
