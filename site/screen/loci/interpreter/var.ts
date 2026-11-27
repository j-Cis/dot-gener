// @project-metadata
// Path: site/screen/loci/interpreter/var.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIVarProps } from "@/site/common/lang/loci/element/def/LOCIVarElement.ts";

/** var w modelu. Wyrażenie `val` nie jest jeszcze liczone — zostaje tekstem. */
export interface ModelVar {
	id: string;
	val: string;
}

/** Atrybuty var → model. */
export function varModel( p: LOCIVarProps ): ModelVar {
	return { id: p.id, val: p.val };
}
