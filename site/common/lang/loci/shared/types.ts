// @project-metadata
// Path: site/common/lang/loci/shared/types.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/** Typy podstawowe LOCI, wspólne dla wszystkich znaczników. */

/** Dowolny kolor CSS: "#e5484d", "rgb(…)", "teal" … */
export type KolorCss = string;

/** Punkt na płaszczyźnie: [x, y] w jednostkach rysunku. */
export type Punkt2 = readonly [ x: number, y: number ];

/** Obszar rysunku: [minX, minY, maxX, maxY] w jednostkach rysunku. */
export type Zakres = readonly [ minX: number, minY: number, maxX: number, maxY: number ];

/** Jednostka kąta: stopnie, radiany albo obroty (1 turn = 360°). */
export type JednostkaKata = "deg" | "rad" | "turn";

/** Liczba zapisana tekstem w atrybucie, np. "3", "-0.5", "1e3". */
export type LiczbaTekst = `${number}`;
