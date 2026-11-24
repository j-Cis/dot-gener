// @project-metadata
// Path: examples/tester-wzoru-drzewa.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Wartości przepisane programowo z wzorcowego pliku DOT (głębokość 3).
 * Id z pliku → [rodzaj, numer]: K00 → ["korzen", 1] (silnik numeruje od 1), L0n → ["lewy", n], P0n → ["prawy", n].
 */
import type { PolaDrzewa } from "@/examples/schemat-drzewa.ts";

type Rodzaj = "korzen" | "lewy" | "prawy";

export const WEZLY_WZORU: readonly (readonly [wzor: string, rodzaj: Rodzaj, numer: number, pola: PolaDrzewa])[] = [
  ["K00", "korzen", 1, { K: 0, iA: 1, iR: 1, jA: 0, jR: 0, dL: 1, nL: 0, dP: 0, nP: 0 }],
  ["L01", "lewy", 1, { K: 1, iA: 2, iR: 3, jA: 0, jR: 1, dL: 1, nL: 1, dP: 2, nP: 0 }],
  ["P01", "prawy", 1, { K: 1, iA: 3, iR: 2, jA: 1, jR: 0, dL: 3, nL: 0, dP: 0, nP: 1 }],
  ["L02", "lewy", 2, { K: 2, iA: 4, iR: 7, jA: 0, jR: 3, dL: 1, nL: 2, dP: 4, nP: 0 }],
  ["P03", "prawy", 3, { K: 2, iA: 5, iR: 6, jA: 1, jR: 2, dL: 5, nL: 0, dP: 2, nP: 1 }],
  ["L03", "lewy", 3, { K: 2, iA: 6, iR: 5, jA: 2, jR: 1, dL: 3, nL: 1, dP: 6, nP: 0 }],
  ["P02", "prawy", 2, { K: 2, iA: 7, iR: 4, jA: 3, jR: 0, dL: 7, nL: 0, dP: 0, nP: 2 }],
  ["L04", "lewy", 4, { K: 3, iA: 8, iR: 15, jA: 0, jR: 7, dL: 1, nL: 3, dP: 8, nP: 0 }],
  ["P07", "prawy", 7, { K: 3, iA: 9, iR: 14, jA: 1, jR: 6, dL: 9, nL: 0, dP: 4, nP: 1 }],
  ["L05", "lewy", 5, { K: 3, iA: 10, iR: 13, jA: 2, jR: 5, dL: 5, nL: 1, dP: 10, nP: 0 }],
  ["P06", "prawy", 6, { K: 3, iA: 11, iR: 12, jA: 3, jR: 4, dL: 11, nL: 0, dP: 2, nP: 2 }],
  ["L06", "lewy", 6, { K: 3, iA: 12, iR: 11, jA: 4, jR: 3, dL: 3, nL: 2, dP: 12, nP: 0 }],
  ["P05", "prawy", 5, { K: 3, iA: 13, iR: 10, jA: 5, jR: 2, dL: 13, nL: 0, dP: 6, nP: 1 }],
  ["L07", "lewy", 7, { K: 3, iA: 14, iR: 9, jA: 6, jR: 1, dL: 7, nL: 1, dP: 14, nP: 0 }],
  ["P04", "prawy", 4, { K: 3, iA: 15, iR: 8, jA: 7, jR: 0, dL: 15, nL: 0, dP: 0, nP: 3 }],
];

/** [od, portOd, do, portDo] — id z pliku */
export const KRAWEDZIE_WZORU: readonly (readonly [od: string, portOd: string, do_: string, portDo: string])[] = [
  ["K00", "wyL", "L01", "weL"],
  ["L01", "wyL", "L02", "weL"],
  ["P01", "wyL", "L03", "weL"],
  ["L02", "wyL", "L04", "weL"],
  ["P03", "wyL", "L05", "weL"],
  ["L03", "wyL", "L06", "weL"],
  ["P02", "wyL", "L07", "weL"],
  ["K00", "wyP", "P01", "weP"],
  ["L01", "wyP", "P03", "weP"],
  ["P01", "wyP", "P02", "weP"],
  ["L02", "wyP", "P07", "weP"],
  ["P03", "wyP", "P06", "weP"],
  ["L03", "wyP", "P05", "weP"],
  ["P02", "wyP", "P04", "weP"],
];
