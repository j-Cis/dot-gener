// @project-metadata
// Path: site/common/lang/loci/element/LOCIBodyElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { Zakres } from "../shared/types.ts";
import { ZAKRES_PUSTY } from "../shared/geometry.ts";
import { type LOCIPointProps, wygladPunktu } from "../attribute/LOCIPointProps.ts";
import { type LOCIAxisProps, wygladPolosi } from "../attribute/LOCIAxisProps.ts";
import type { LOCIAxElement } from "./frame/LOCIAxElement.ts";
import type { LOCIBiElement } from "./frame/LOCIBiElement.ts";
import type { LOCIFnElement } from "./def/LOCIFnElement.ts";
import type { LOCIVarElement } from "./def/LOCIVarElement.ts";

/**
 * body — klocek główny: cały rysunek. Atrybuty: id podstawowego ax oraz wygląd konstrukcji
 * (grupy z attribute/).
 */
export interface LOCIBodyProps extends LOCIPointProps, LOCIAxisProps {
	/** id podstawowego układu odniesienia ax; domyślnie "ax0" */
	axId?: string;
}

/** Cały rysunek po wczytaniu: obszar, układy (ax: pierwszy to podstawowy) i definicje. */
export interface LOCIBodyElement {
	zakres: Zakres;
	ax: readonly LOCIAxElement[];
	bi: readonly LOCIBiElement[];
	fn: readonly LOCIFnElement[];
	var: readonly LOCIVarElement[];
}

/** Elementy wczytane z dzieci body. */
export type DzieciBody = Pick<LOCIBodyElement, "bi" | "fn" | "var">;

export const DOMYSLNE_BODY = { axId: "ax0" } as const;

/** Atrybuty body i wczytane dzieci → element; podstawowy ax w (0,0), bez obrotu. */
export function bodyElement( p: LOCIBodyProps, dzieci: DzieciBody ): LOCIBodyElement {
	const ax0: LOCIAxElement = {
		id: p.axId ?? DOMYSLNE_BODY.axId,
		poczatek: [ 0, 0 ],
		kat: 0,
		punkt: wygladPunktu( p ),
		polosie: wygladPolosi( p ),
	};
	return { zakres: ZAKRES_PUSTY, ax: [ ax0 ], ...dzieci };
}
