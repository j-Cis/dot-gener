// @project-metadata
// Path: site/common/lang/loci/attribute/LOCIIdAttributes.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { IdZnacznika, ZnacznikId } from "../shared/types.ts";

/**
 * Grupa atrybutów wspólna dla wszystkich znaczników z id:
 *   id — „znacznik + numer” (p0, csax1, fn2 …), jedyne w całym dokumencie; wpisane ręcznie albo z lociId();
 *   as — alias: opisowa nazwa, też jedyna w dokumencie, nie w postaci „znacznik + numer”.
 * Odwołania (np. in, thru, fn, at) przyjmują id albo alias.
 *
 *   <Loci.fn id="fn0" as="spiral" … />   <Loci.p id="p4" fn="spiral" at="t0" />
 */
export interface LOCIIdAttributes<Z extends ZnacznikId> {
	/** id: znacznik + numer */
	id: IdZnacznika<Z>;
	/** alias: opisowa nazwa do odwołań */
	as?: string;
}
