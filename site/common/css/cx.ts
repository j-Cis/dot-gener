// @project-metadata
// Path: site/common/css/cx.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/** Joins class names, skipping empty / undefined ones. */
export const cx = ( ...names: (string | false | null | undefined)[] ): string => names.filter( Boolean ).join( " " );
