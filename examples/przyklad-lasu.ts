// @project-metadata
// Path: examples/przyklad-lasu.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type IdWezla, SilnikGrafu, type StanSchematu } from "@/src/silnik-grafu.ts";
import { schematLasu } from "@/examples/schemat-lasu.ts";
import { zapisz } from "@/src/zapisz.ts";

export type Las = SilnikGrafu<StanSchematu<typeof schematLasu>>;
type IdWezlaLasu = IdWezla<"korzen" | "ojciec" | "matka">;

/**
 * Pełny rodowód o zadanej liczbie pokoleń nad korzeniem.
 * Kolejność tworzenia jak w drzewie: ojcowie numerowani od lewej, matki od prawej.
 */
export function zbudujLas(pokolenia: number): Las {
  if (!Number.isInteger(pokolenia) || pokolenia < 0 || pokolenia > 20) {
    throw new RangeError(`liczba pokoleń ${pokolenia} spoza 0…20`);
  }
  const graf = new SilnikGrafu(schematLasu, { wyrownanie: "wspolne" });

  const ojciec = (dziecko: IdWezlaLasu) => {
    const o = graf.dodajWezel("ojciec");
    graf.polacz("lewa", [dziecko, "wyL"], [o, "weL"]);
    return o;
  };
  const matka = (dziecko: IdWezlaLasu) => {
    const m = graf.dodajWezel("matka");
    graf.polacz("prawa", [dziecko, "wyP"], [m, "weP"]);
    return m;
  };

  let pokolenie: IdWezlaLasu[] = [graf.dodajWezel("korzen")];
  for (let k = 1; k <= pokolenia; k++) {
    const o = pokolenie.map(ojciec); //                         od lewej
    const m = pokolenie.toReversed().map(matka).toReversed(); // od prawej
    pokolenie = o.flatMap((rodzic, i) => [rodzic, ...m.slice(i, i + 1)]);
  }
  return graf;
}

export const opcjeDot = {
  nazwa: "LAS",
  kierunek: "TB",
  atrybutyGrafu: { nodesep: 0.4, ranksep: 1.2 },
  atrybutyWezlow: { fontname: "Franklin Gothic Heavy", fontsize: 11 },
} as const;

// ── deno run --allow-write=generated --allow-run=dot examples/przyklad-las.ts [pokolenia=3] ──
if (import.meta.main) {
  const pokolenia = Number(Deno.args[0] ?? 3);
  const graf = zbudujLas(pokolenia);
  const [nWezlow, nLin] = graf.rozmiar();
  console.log(`pokolenia ${pokolenia}: węzły ${nWezlow}, liny ${nLin}`);
  await zapisz(`las-${pokolenia}`, graf.doDot(opcjeDot));
}
