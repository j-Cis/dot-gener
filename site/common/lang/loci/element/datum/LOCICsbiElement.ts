// @project-metadata
// Path: site/common/lang/loci/element/datum/LOCICsbiElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIIdAttributes } from "../../attribute/LOCIIdAttributes.ts";

/**
 * csbi — układ bipolarny (DATUM 2D) z dwoma biegunami w punktach: csbi id="csbi0" at="p0,p1".
 */
export interface LOCICsbiProps extends LOCIIdAttributes<"csbi"> {
	/** dwa punkty (bieguny), po przecinku: "p0,p1" */
	at: `${string},${string}`;
}

/** Znacznik csbi. Sam nic nie robi. */
export function csbi( _props: LOCICsbiProps ): null {
	return null;
}
