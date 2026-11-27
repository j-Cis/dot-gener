// @project-metadata
// Path: site/common/lang/loci/shared/types.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/** Typy wartości atrybutów LOCI, wspólne dla wszystkich znaczników. */

/** Dowolny kolor CSS: "#e5484d", "rgb(…)", "teal" … */
export type KolorCss = string;

/** Jednostka kąta: stopnie, radiany albo obroty (1 turn = 360°). */
export type JednostkaKata = "deg" | "rad" | "turn";

/** Liczba zapisana tekstem w atrybucie, np. "3", "-0.5", "1e3". */
export type LiczbaTekst = `${number}`;

/** Znaczniki, które mają id (wszystkie poza body). */
export type ZnacznikId = "p" | "csax" | "csbi" | "fn" | "var" | "v";

/** id znacznika: nazwa znacznika i numer, np. "p0", "csax1". */
export type IdZnacznika<Z extends ZnacznikId> = `${Z}${number}`;
