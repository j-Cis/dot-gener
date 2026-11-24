// @project-metadata
// Path: examples/przyklad-biblioteczka.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { SilnikGrafu, type StanSchematu } from "@/src/silnik-grafu.ts";
import { schematBiblioteczki } from "@/examples/schemat-biblioteczki.ts";
import { zapisz } from "@/src/zapisz.ts";

type Epoka = "renesans" | "pozytywizm" | "mloda_polska";
type Rodzaj =
  | readonly ["epika", "powiesc" | "nowela"]
  | readonly ["liryka", "tren" | "sonet"]
  | readonly ["dramat", "tragedia" | "komedia"];

export type Biblioteczka = SilnikGrafu<StanSchematu<typeof schematBiblioteczki>>;

export function zbudujBiblioteczke(): Biblioteczka {
  const graf = new SilnikGrafu(schematBiblioteczki);

  // ── półki ──────────────────────────────────────────────────────────────
  const salon = graf.dodajWezel("polka", { kategorie: { pomieszczenie: ["salon"] }, pola: { opis: "witryna" } });
  const regal = graf.dodajWezel("polka", {
    kategorie: { pomieszczenie: ["gabinet", "regal"] },
    pola: { opis: "górna półka" },
  });
  const biurko = graf.dodajWezel("polka", { kategorie: { pomieszczenie: ["gabinet", "biurko"] } });

  // ── autorzy ────────────────────────────────────────────────────────────
  const autor = (imie: string, nazwisko: string, epoka: Epoka) => graf.dodajWezel("autor", { kategorie: { epoka: [epoka] }, pola: { imie, nazwisko } });

  const kochanowski = autor("Jan", "Kochanowski", "renesans");
  const prus = autor("Bolesław", "Prus", "pozytywizm");
  const orzeszkowa = autor("Eliza", "Orzeszkowa", "pozytywizm");
  const sienkiewicz = autor("Henryk", "Sienkiewicz", "pozytywizm");
  const zeromski = autor("Stefan", "Żeromski", "mloda_polska");

  // ── książki: [autor, tytuł, rodzaj, oprawa, półka, pozycja] ─────────────
  const ksiazki: readonly (readonly [typeof prus, string, Rodzaj, "twarda" | "miekka", typeof salon, number])[] = [
    [kochanowski, "Treny", ["liryka", "tren"], "twarda", salon, 1],
    [kochanowski, "Odprawa posłów greckich", ["dramat", "tragedia"], "miekka", salon, 2],
    [prus, "Lalka", ["epika", "powiesc"], "twarda", regal, 1],
    [prus, "Faraon", ["epika", "powiesc"], "twarda", regal, 2],
    [prus, "Kamizelka", ["epika", "nowela"], "miekka", biurko, 1],
    [orzeszkowa, "Nad Niemnem", ["epika", "powiesc"], "twarda", regal, 3],
    [orzeszkowa, "Dobra pani", ["epika", "nowela"], "miekka", biurko, 2],
    [sienkiewicz, "Ogniem i mieczem", ["epika", "powiesc"], "twarda", regal, 4],
    [sienkiewicz, "Potop", ["epika", "powiesc"], "twarda", regal, 5],
    [sienkiewicz, "Quo vadis", ["epika", "powiesc"], "twarda", salon, 3],
    [sienkiewicz, "Krzyżacy", ["epika", "powiesc"], "twarda", regal, 6],
    [sienkiewicz, "Janko Muzykant", ["epika", "nowela"], "miekka", biurko, 3],
    [zeromski, "Ludzie bezdomni", ["epika", "powiesc"], "twarda", salon, 4],
    [zeromski, "Przedwiośnie", ["epika", "powiesc"], "miekka", biurko, 4],
  ];

  for (const [kto, tytul, rodzaj, oprawa, polka, pozycja] of ksiazki) {
    const k = graf.dodajWezel("ksiazka", { kategorie: { rodzaj, oprawa: [oprawa] }, pola: { tytul } });
    graf.polacz("napisal", [kto, "dziela"], [k, "autorzy"]);
    graf.polacz("stoi_na", [k, "miejsce"], [polka, "zawartosc"], { pola: { pozycja } });
  }

  // pole wpisywane można zmienić później; pola auto przeliczą się same
  graf.ustawPola(biurko, { opis: "stos przy lampie" });
  return graf;
}

// ── uruchomienie: deno task przyklad ─────────────────────────────────────
if (import.meta.main) {
  const graf = zbudujBiblioteczke();
  const [nWezlow, nLin] = graf.rozmiar();
  console.log(`węzły: ${nWezlow}, liny: ${nLin}`);
  for (const k of graf.wezly("ksiazka").slice(0, 3)) {
    console.log(k.idTekst, k.pola.tytul, "→", k.auto.autorzy, "@", k.auto.polka);
  }
  await zapisz("biblioteczka", graf.doDot({ nazwa: "biblioteczka", atrybutyGrafu: { nodesep: 0.25, ranksep: 1.1 } }));
}
