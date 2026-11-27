// @project-metadata
// Path: site/common/lang/loci/attribute/LOCIPointProps.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { KolorCss } from "../shared/types.ts";
import { dodatnia } from "../shared/check.ts";

/** Grupa atrybutów: wygląd punktów konstrukcyjnych (pointSize, pointColor, pointSymbol). */

/** Symbol punktu konstrukcyjnego: "rays24" — 12 przeciętych linii (24 kierunki), "cross" — krzyżyk, "circle" — okrąg, "dot" — kropka. */
export type PointSymbol = "rays24" | "cross" | "circle" | "dot";

export interface LOCIPointProps {
	/** wielkość punktów konstrukcyjnych w px ekranu; domyślnie 12 */
	pointSize?: number;
	/** kolor punktów konstrukcyjnych */
	pointColor?: KolorCss;
	/** symbol punktu konstrukcyjnego; domyślnie "rays24" */
	pointSymbol?: PointSymbol;
}

export const DOMYSLNE_PUNKTU = {
	pointSize: 12,
	pointColor: "#cfcfd0",
	pointSymbol: "rays24",
} as const satisfies Required<LOCIPointProps>;

/** Wygląd punktu konstrukcyjnego: [symbol, wielkość px, kolor]. */
export type WygladPunktu = readonly [ symbol: PointSymbol, wielkosc: number, kolor: KolorCss ];

/** Atrybuty → wygląd punktu (brakujące z domyślnych). */
export function wygladPunktu( p: LOCIPointProps ): WygladPunktu {
	return [
		p.pointSymbol ?? DOMYSLNE_PUNKTU.pointSymbol,
		dodatnia( p.pointSize ?? DOMYSLNE_PUNKTU.pointSize, "pointSize" ),
		p.pointColor ?? DOMYSLNE_PUNKTU.pointColor,
	];
}
