/**
 * Tester wzoru lasu: wartości wpisane ręcznie ↔ wartości wyliczone przez silnik z położenia węzłów.
 *
 *   deno run examples/tester-wzoru-lasu.ts   — raport ✓/✗ z różnicami
 *   deno task test                           — to samo jako test (tests/testy.ts)
 */
import { equal } from "@std/assert";
import type { RodzajWezla, StanSchematu } from "@/src/silnik-grafu.ts";
import type { PolaLasu, schematLasu } from "@/examples/schemat-lasu.ts";
import { type Las, zbudujLas } from "@/examples/przyklad-lasu.ts";

/** Skróty używane we wzorze → rodzaje węzłów w schemacie (satisfies: literówka = błąd kompilacji). */
export const RODZAJ = {
  Ego: "korzen",
  Dad: "ojciec",
  Mom: "matka",
} as const satisfies Record<string, RodzajWezla<StanSchematu<typeof schematLasu>>>;

type Rodzaj = keyof typeof RODZAJ;

/** Pojedyncza liczba albo — wyjątek korzenia — para [pierwsza, druga]. */
type Wartosc = number | readonly [pierwsza: number, druga: number];

export type WierszWzoru = readonly [
  wzor: string,
  rodzaj: Rodzaj,
  numer: number,
  polozenie: Readonly<Pick<PolaLasu, "iK" | "iA" | "iR">>,
  indeksy: Readonly<Record<"jA" | "jR" | "fA" | "fR", Wartosc>>,
  serie: Readonly<Pick<PolaLasu, "yA" | "xA" | "yR" | "xR">>,
];

// deno-fmt-ignore
export const WEZLY_WZORU: readonly WierszWzoru[] = [
  ["NK01", "Ego", 1, { iK: 0, iA: 0, iR: 0 }, { jA: [1, -1], jR: [1, -1], fA: [0.5, -0.5], fR: [0.5, -0.5] }, { yA: [1, 0], xA: [0, 0], yR: [0, 0], xR: [1, 0]}],
  ["YA01", "Dad", 1, { iK: 1, iA: 0, iR: 1 }, { jA: 2, jR: 3, fA: 0.25, fR: 0.75 }, { yA: [1, 1], xA: [2, 0], yR: [0, 1], xR: [3, 0] }],
  ["XA01", "Mom", 1, { iK: 1, iA: 1, iR: 0 }, { jA: 3, jR: 2, fA: 0.75, fR: 0.25 }, { yA: [3, 0], xA: [0, 1], yR: [2, 0], xR: [1, 1] }],

  ["YA02", "Dad", 2, { iK: 2, iA: 0, iR: 3 }, { jA: 4, jR: 7, fA: 0.125, fR: 0.875 }, { yA: [1, 2], xA: [4, 0], yR: [0, 2], xR: [7, 0] }],
  ["XA03", "Mom", 3, { iK: 2, iA: 1, iR: 2 }, { jA: 5, jR: 6, fA: 0.375, fR: 0.625 }, { yA: [5, 0], xA: [2, 1], yR: [6, 0], xR: [3, 1] }],
  ["YA03", "Dad", 3, { iK: 2, iA: 2, iR: 1 }, { jA: 6, jR: 5, fA: 0.625, fR: 0.375 }, { yA: [3, 1], xA: [6, 0], yR: [2, 1], xR: [5, 0] }],
  ["XA02", "Mom", 2, { iK: 2, iA: 3, iR: 0 }, { jA: 7, jR: 4, fA: 0.875, fR: 0.125 }, { yA: [7, 0], xA: [0, 2], yR: [4, 0], xR: [1, 2] }],

  ["YA04", "Dad", 4, { iK: 3, iA: 0, iR: 7 }, { jA: 8,  jR: 15, fA: 0.0625, fR: 0.9375 }, { yA: [1,  3], xA: [8, 0], yR: [0, 3], xR: [15, 0] }],
  ["XA07", "Mom", 7, { iK: 3, iA: 1, iR: 6 }, { jA: 9,  jR: 14, fA: 0.1875, fR: 0.8125 }, { yA: [9,  0], xA: [4, 1], yR: [14, 0], xR: [7, 1] }],
  ["YA05", "Dad", 5, { iK: 3, iA: 2, iR: 5 }, { jA: 10, jR: 13, fA: 0.3125, fR: 0.6875 }, { yA: [5,  1], xA: [10, 0], yR: [0, 3], xR: [15, 0] }],
  ["XA06", "Mom", 6, { iK: 3, iA: 3, iR: 4 }, { jA: 11, jR: 12, fA: 0.4375, fR: 0.5625 }, { yA: [11, 0], xA: [2, 2], yR: [14, 0], xR: [7, 1] }],
  ["YA06", "Dad", 6, { iK: 3, iA: 4, iR: 3 }, { jA: 12, jR: 11, fA: 0.5625, fR: 0.4375 }, { yA: [3,  2], xA: [12, 0], yR: [0, 3], xR: [15, 0] }],
  ["XA05", "Mom", 5, { iK: 3, iA: 5, iR: 2 }, { jA: 13, jR: 10, fA: 0.6875, fR: 0.3125 }, { yA: [13, 0], xA: [6, 1], yR: [14, 0], xR: [7, 1] }],
  ["YA07", "Dad", 7, { iK: 3, iA: 6, iR: 1 }, { jA: 14, jR: 9,  fA: 0.8125, fR: 0.1875 }, { yA: [7,  1], xA: [14, 0], yR: [0, 3], xR: [15, 0] }],
  ["XA04", "Mom", 4, { iK: 3, iA: 7, iR: 0 }, { jA: 15, jR: 8,  fA: 0.9375, fR: 0.0625 }, { yA: [15, 0], xA: [0, 3], yR: [14, 0], xR: [7, 1] }],
];

/** Ten sam wiersz, ale z wartościami wyliczonymi przez silnik dla węzła [rodzaj, numer]. */
export function wierszSilnika(graf: Las, [wzor, rodzaj, numer]: WierszWzoru): WierszWzoru {
  const w = graf.wezel([RODZAJ[rodzaj], numer]);
  const a = w.auto;
  const drugie = w.rodzaj === "korzen" ? w.auto.drugie : undefined;
  const dwie = (x: number, d: number | undefined): Wartosc => (d === undefined ? x : [x, d]);
  return [
    wzor,
    rodzaj,
    numer,
    { iK: a.iK, iA: a.iA, iR: a.iR },
    { jA: dwie(a.jA, drugie?.jA), jR: dwie(a.jR, drugie?.jR), fA: dwie(a.fA, drugie?.fA), fR: dwie(a.fR, drugie?.fR) },
    { yA: a.yA, xA: a.xA, yR: a.yR, xR: a.xR },
  ];
}

/** Różnice wzór ↔ silnik: [pole, we wzorze, w silniku]; pusta lista = zgodność. */
export function roznice(wzor: WierszWzoru, silnik: WierszWzoru): readonly (readonly [pole: string, wzor: unknown, silnik: unknown])[] {
  const [, , , ...grupyWzoru] = wzor;
  const [, , , ...grupySilnika] = silnik;
  return grupyWzoru.flatMap((grupa, i) => {
    const druga: Readonly<Record<string, unknown>> = grupySilnika[i] ?? {};
    return Object.entries(grupa)
      .filter(([pole, wartosc]) => !equal(wartosc, druga[pole]))
      .map(([pole, wartosc]) => [pole, wartosc, druga[pole]] as const);
  });
}

// ── raport: deno run examples/tester-wzoru-lasu.ts ───────────────────────
if (import.meta.main) {
  const graf = zbudujLas(3);
  const json = (v: unknown) => JSON.stringify(v);
  let zgodne = 0;
  for (const wiersz of WEZLY_WZORU) {
    const r = roznice(wiersz, wierszSilnika(graf, wiersz));
    if (r.length === 0) {
      zgodne++;
      console.log(`✓ ${wiersz[0]}`);
    } else {
      console.log(`✗ ${wiersz[0]}  ${r.map(([pole, wz, si]) => `${pole}: wzór ${json(wz)} ≠ silnik ${json(si)}`).join(", ")}`);
    }
  }
  const [nWezlow] = graf.rozmiar();
  console.log(`\nzgodne: ${zgodne}/${WEZLY_WZORU.length}; węzłów w grafie: ${nWezlow}`);
}
