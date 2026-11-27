// @project-metadata
// Path: site/common/lang/loci/element/LOCIBodyElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { Zakres } from "../shared/types.ts";
import { ZAKRES_PUSTY } from "../shared/geometry.ts";
import { type LOCIPointAttributes, type WygladPunktu, wygladPunktu } from "../attribute/LOCIPointAttributes.ts";
import { type LOCIAxisAttributes, wygladPolosi } from "../attribute/LOCIAxisAttributes.ts";
import type { LOCIAxElement } from "./datum/LOCIAxElement.ts";
import type { LOCIBiElement } from "./datum/LOCIBiElement.ts";
import type { LOCIPElement } from "./datum/LOCIPElement.ts";
import type { LOCIFnElement } from "./def/LOCIFnElement.ts";
import type { LOCIVarElement } from "./def/LOCIVarElement.ts";

/**
 * body — klocek główny: cały rysunek. Atrybuty: id podstawowego ax oraz wygląd konstrukcji
 * (grupy z attribute/) — jeden dla wszystkich elementów konstrukcyjnych (DATUM) rysunku.
 */
export interface LOCIBodyProps extends LOCIPointAttributes, LOCIAxisAttributes {
	/** id podstawowego układu odniesienia ax; domyślnie "ax0" */
	axId?: string;
}

/** Cały rysunek po wczytaniu: obszar, wygląd punktów, układy (ax: pierwszy to podstawowy), punkty i definicje. */
export interface LOCIBodyElement {
	zakres: Zakres;
	/** wygląd wszystkich punktów konstrukcyjnych p */
	punkt: WygladPunktu;
	ax: readonly LOCIAxElement[];
	p: readonly LOCIPElement[];
	bi: readonly LOCIBiElement[];
	fn: readonly LOCIFnElement[];
	var: readonly LOCIVarElement[];
}

/** Elementy wczytane z dzieci body (ax: z podstawowym na początku). */
export type DzieciBody = Pick<LOCIBodyElement, "ax" | "p" | "bi" | "fn" | "var">;

export const DOMYSLNE_BODY = { axId: "ax0" } as const;

/** Podstawowy ax z atrybutów body: w (0,0), bez obrotu. */
export function axPodstawowy( p: LOCIBodyProps ): LOCIAxElement {
	return {
		id: p.axId ?? DOMYSLNE_BODY.axId,
		poczatek: [ 0, 0 ],
		kat: 0,
		punkt: wygladPunktu( p ),
		polosie: wygladPolosi( p ),
	};
}

/** Atrybuty body i wczytane dzieci → element. */
export function bodyElement( p: LOCIBodyProps, dzieci: DzieciBody ): LOCIBodyElement {
	return { zakres: ZAKRES_PUSTY, punkt: wygladPunktu( p ), ...dzieci };
}
