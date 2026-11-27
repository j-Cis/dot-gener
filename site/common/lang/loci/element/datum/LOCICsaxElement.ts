// @project-metadata
// Path: site/common/lang/loci/element/datum/LOCICsaxElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIIdAttributes } from "../../attribute/LOCIIdAttributes.ts";

/**
 * csax — układ odniesienia (DATUM 2D), kartezjański (x, y) i biegunowy (r, t) zarazem.
 *   csax id="csax1" at="p0" thru="p1"  — początek w p0, oś X przez p1
 * Podstawowy csax (domyślnie csax0) tworzy body. Wygląd układu (punkt początku, półosie) ustala body.
 */
export interface LOCICsaxProps extends LOCIIdAttributes<"csax"> {
	/** punkt początku układu */
	at: string;
	/** punkt, przez który przechodzi dodatnia półoś X */
	thru: string;
}

/** Znacznik csax. Sam nic nie robi. */
export function csax( _props: LOCICsaxProps ): null {
	return null;
}
