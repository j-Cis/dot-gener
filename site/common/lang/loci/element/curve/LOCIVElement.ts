// @project-metadata
// Path: site/common/lang/loci/element/curve/LOCIVElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIIdAttributes } from "../../attribute/LOCIIdAttributes.ts";
import type { KolorCss } from "../../shared/types.ts";
import type { LineStyle } from "../LOCIBodyElement.ts";

/**
 * v — linia łamana przez n punktów: ciąg wektorów od pierwszego punktu do ostatniego.
 * Element rysunku (nie DATUM): ma własny wygląd linii.
 *
 * Punkty — dokładnie jedna z postaci:
 *   v id="v0" p="p0,p4,start"                            — istniejące punkty (id albo alias)
 *   v id="v1" px="23,43,43" py="32,53,12"                — wpisane: x i y osobno
 *   v id="v2" pxy="23,32; 43,53; 43,12"                  — wpisane: pary x,y po średniku
 *   v id="v3" pr="5,6,7" pa="30deg, 0.5rad, 0.25turn"    — biegunowo, jednostka przy każdym kącie
 *   v id="v4" pr="5,6,7" pdeg="30,45,60"                 — biegunowo, jedna jednostka (pdeg / prad / pturn)
 * in — układ punktów wpisanych: jeden dla wszystkich albo lista, po jednym na punkt; domyślnie csax0.
 *
 * cycle — ostatni punkt łączy się z pierwszym.
 * surface — wypełnienie powierzchni; bez cycle brzeg od ostatniego punktu do pierwszego nie jest rysowany.
 */

/** Atrybuty punktów, z których wolno użyć tylko jednej postaci. */
type KluczPunktow = "p" | "px" | "py" | "pxy" | "pr" | "pa" | "pdeg" | "prad" | "pturn" | "in";

/** Postać T; pozostałe atrybuty punktów zakazane. */
type Tylko<T, K extends KluczPunktow> = T & { [Z in Exclude<KluczPunktow, K>]?: never };

/** Punkty: dokładnie jedna postać. Listy po przecinku (pxy: pary po średniku). */
type PunktyV =
	| Tylko<{ p: string }, "p">
	| Tylko<{ px: string; py: string; in?: string }, "px" | "py" | "in">
	| Tylko<{ pxy: string; in?: string }, "pxy" | "in">
	| Tylko<{ pr: string; pa: string; in?: string }, "pr" | "pa" | "in">
	| Tylko<{ pr: string; pdeg: string; in?: string }, "pr" | "pdeg" | "in">
	| Tylko<{ pr: string; prad: string; in?: string }, "pr" | "prad" | "in">
	| Tylko<{ pr: string; pturn: string; in?: string }, "pr" | "pturn" | "in">;

export type LOCIVProps = LOCIIdAttributes<"v"> & PunktyV & {
	/** ostatni punkt łączy się z pierwszym */
	cycle?: true;
	/** wypełnienie powierzchni */
	surface?: true;
	/** grubość linii w jednostkach rysunku */
	lineWidth?: number;
	/** kolor linii (i wypełnienia) */
	lineColor?: KolorCss;
	/** styl linii */
	lineStyle?: LineStyle;
};

/** Znacznik v. Sam nic nie robi. */
export function v( _props: LOCIVProps ): null {
	return null;
}
