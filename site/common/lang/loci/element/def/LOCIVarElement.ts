// @project-metadata
// Path: site/common/lang/loci/element/def/LOCIVarElement.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LOCIIdAttributes } from "../../attribute/LOCIIdAttributes.ts";

/**
 * var — zmienna: var id="var0" as="t0" val="1/3".
 * Używana przez id albo alias w innych znacznikach, np. p … fn="spiral" at="t0".
 */
export interface LOCIVarProps extends LOCIIdAttributes<"var"> {
	/** wartość: liczba albo wyrażenie, np. "1/3" */
	val: string;
}

/** Znacznik var (w obiekcie Loci pod kluczem `var`, bo `var` to słowo zarezerwowane). Sam nic nie robi. */
export function varTag( _props: LOCIVarProps ): null {
	return null;
}
