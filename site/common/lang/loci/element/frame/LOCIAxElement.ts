// @project-metadata
// Path: site/common/lang/loci/element/frame/LOCIAxElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { Punkt2 } from "../../shared/types.ts";
import type { LOCIPointProps, WygladPunktu } from "../../attribute/LOCIPointProps.ts";
import type { LOCIAxisProps, WygladPolosi } from "../../attribute/LOCIAxisProps.ts";

/**
 * ax — układ odniesienia, kartezjański (x, y) i biegunowy (r, t) zarazem.
 *   ax id="ax1" at="p0" thru="p1"  — początek w p0, oś X przez p1
 * Podstawowy ax (domyślnie ax0) tworzy body. Znacznik ax wymaga punktów, więc model jeszcze go nie przetwarza.
 */
export interface LOCIAxProps extends LOCIPointProps, LOCIAxisProps {
	id: string;
	/** punkt początku układu */
	at: string;
	/** punkt, przez który przechodzi dodatnia półoś X */
	thru: string;
}

/** ax po wczytaniu: współrzędne i wygląd. */
export interface LOCIAxElement {
	id: string;
	/** początek układu w układzie rysunku */
	poczatek: Punkt2;
	/** obrót osi X (stopnie, przeciwnie do wskazówek zegara) */
	kat: number;
	punkt: WygladPunktu;
	/** półosie: +X, +Y, −X, −Y */
	polosie: WygladPolosi;
}

/** Kierunki półosi w układzie lokalnym (stopnie), w kolejności LOCIAxElement.polosie. */
export const KIERUNKI_POLOSI = [ 0, 90, 180, 270 ] as const;
