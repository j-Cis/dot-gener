// @project-metadata
// Path: site/screen/loci/interpreter/csax.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { Punkt2 } from "./types.ts";

/** csax w modelu: sama geometria. */
export interface ModelCsax {
	id: string;
	/** początek układu w układzie rysunku */
	poczatek: Punkt2;
	/** obrót osi X (stopnie, przeciwnie do wskazówek zegara) */
	kat: number;
}

/** Kierunki półosi w układzie lokalnym (stopnie), w kolejności wyglądu półosi z body (ModelBody.polosie). */
export const KIERUNKI_POLOSI = [ 0, 90, 180, 270 ] as const;
