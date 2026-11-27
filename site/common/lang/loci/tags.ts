// @project-metadata
// Path: site/common/lang/loci/tags.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { body } from "./element/LOCIBodyElement.ts";
import { csax } from "./element/datum/LOCICsaxElement.ts";
import { csbi } from "./element/datum/LOCICsbiElement.ts";
import { p } from "./element/datum/LOCIPElement.ts";
import { fn } from "./element/def/LOCIFnElement.ts";
import { varTag } from "./element/def/LOCIVarElement.ts";

/**
 * LOCI — znaczniki <Loci.…>, ich atrybuty i funkcje pomocnicze do wypełniania atrybutów.
 * Tylko tyle: co można użyć i jak. Jak to rozumieć i wyświetlić, ustala odbiorca, np. interpreter
 * i render w site/screen/ dla wysp. Czysty TypeScript, bez Preact.
 *
 *   <VectorViewport renderer="SVG" sourceFormat="LOCI">
 *     <Loci.body csaxId="csax0">
 *       <Loci.p id="p2" xy="3,4" />
 *     </Loci.body>
 *   </VectorViewport>
 */

/** Znaczniki LOCI. Zwykły obiekt (nie funkcja), żeby podpowiedź po `<Loci.` pokazywała tylko znaczniki. */
export const Loci = {
	/** Klocek główny: cały rysunek; atrybuty: wygląd konstrukcji i id układu podstawowego. */
	body,
	/** Punkt konstrukcyjny: <Loci.p id="p2" in="csax0" xy="3,4" />, <Loci.p id="p3" r="5" deg="30" />, <Loci.p id="p4" fn="spiral" at="t0" />. */
	p,
	/** Układ odniesienia csax (kartezjański i biegunowy): <Loci.csax id="csax1" at="p0" thru="p1" />. */
	csax,
	/** Układ bipolarny: <Loci.csbi id="csbi0" at="p0,p1" />. */
	csbi,
	/** Funkcja parametru: <Loci.fn id="fn0" as="spiral" param="t" x="…" y="…" /> albo <Loci.fn id="fn1" as="arc" param="k" r="5" turn="k/6" />. */
	fn,
	/** Zmienna: <Loci.var id="var0" as="t0" val="1/3" />. */
	var: varTag,
} as const;
