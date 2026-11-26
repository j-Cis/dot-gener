// @project-metadata
// Path: site/layout/SekcjaOProgramie.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { Title } from "@/site/widget/Title.widgets.tsx";
import { P } from "@/site/widget/Paragraph.widget.tsx";
import { tec, tecs } from "@/site/screen/Tec.render.tsx";
export interface SekcjaOProgramieProps {
  numer: string;
  tytul: string;
}
export default function SekcjaOProgramie(paragraf: SekcjaOProgramieProps) {
  return (
    <article class="">
      <header>
        <Title prefix={paragraf.numer} level="h1" size="2.125rem">
          {paragraf.tytul}
        </Title>
      </header>
      <P>
        Program "dot-gener" a w nim zawarty {tec`SilnikGrafu`}{" "}
        to generyczny nieświadomy o dziedzinie (rodzaje węzłów i lin, które deklaruje użytkownik) silnik sterowany schematem (typy węzłów i lin) który deklaruje użytkownik, z
        eksportem do
        {tec`DOT`} i {tec`SVG`} przez {tec`GraphViz`}.
      </P>
      <P>
        <strong>PRZYKŁAD</strong>
        <br />
        {tecs("typescript")`
const schemat = new SchematGrafu()
  .wezel("autor", {
    tag: "A",
    porty: ["dziela"],
    kategorie: { epoka: { pozytywizm: [], renesans: [] } },
    pola: { nazwisko: "" },
  })
  .wezel("ksiazka", {
    tag: "K",
    porty: ["autorzy"],
    kategorie: { rodzaj: { epika: ["powiesc", "nowela"] } },
    pola: { tytul: "" },
  })
  .lina("napisal", { tag: "N", od: { autor: ["dziela"] }, do: { ksiazka: ["autorzy"] } })
  .autoWezla("autor", { liczbaKsiazek: (a) => a.wyjscia("napisal").length })
  .szablonWezla("autor", (a) => ({ opis: [a.pola.nazwisko, \`książek: \${a.auto.liczbaKsiazek}\`] }));

const graf = new SilnikGrafu(schemat);
const prus = graf.dodajWezel("autor", { kategorie: { epoka: ["pozytywizm"] }, pola: { nazwisko: "Prus" } });
const lalka = graf.dodajWezel("ksiazka", { kategorie: { rodzaj: ["epika", "powiesc"] }, pola: { tytul: "Lalka" } });
graf.polacz("napisal", [prus, "dziela"], [lalka, "autorzy"]);
graf.doDot();
        `}
      </P>
      <P noindent>
        <strong>DECYZJE</strong>
        <br />
        <ul>
          <li>
            <strong>Schemat jako builder</strong>. Funkcje pól automatycznych dostają w pełni otypowany widok sąsiadów. W jednym obiekcie konfiguracji typ zależałby od samego
            siebie, dlatego każde wywołanie buildera zwraca nowy typ.{" "}
            <ul>
              <li>Pole auto może więc sięgać tylko po pola auto zdefiniowane wcześniej, co wyklucza cykle już na poziomie typów.</li>
              <li>Dla kodu w JS albo przy rzutowaniu jest dodatkowa kontrola w runtime (test 5).</li>
            </ul>
          </li>
          <li>
            <strong>Pola wpisywane</strong>. Wartości z {tec`pola`} są domyślne i z nich wynika typ: {tec`""`} daje {tec("ts")`string`}, bo {tec`F`} nie ma modyfikatora
            {tec("ts")`const`}. Przy tworzeniu podajesz {tec("ts")`Partial`} tych pól. Unie literałów deklarujesz przez {tec`as`}.
          </li>
          <li>
            <strong>Pola automatyczne</strong> są w osobnej przestrzeni {tec`auto`}, tylko do odczytu. Ich typ to {tec("ts")`ReturnType`}{" "}
            funkcji. Liczą się leniwie, a zapamiętany wynik jest unieważniany przy każdej zmianie grafu.
          </li>
          <li>
            <strong>Identyfikator</strong>. Przechowywana jest tylko krotka {tec("ts")`[rodzaj, numer]`} z{" "}
            {tec("ts")`nadaj()`}. Tekst ({tec`K01`}) powstaje przy odczycie, bo szerokość z {tec("ts")`liczbaCyfr()`} rośnie: dziesiąty węzeł zamienia {tec`K1`} w {tec`K01`}.
          </li>
          <li>Domyślnie szerokość liczona jest osobno dla każdego rodzaju. Opcja {tec("ts")`{ wyrownanie: "wspolne" }`} daje jedną szerokość (maksimum) dla całej puli.</li>
          <li>
            Tag nie może kończyć się cyfrą. Inaczej {tec`A`} + {tec`11`} i {tec`A1`} + {tec`1`} dałyby to samo {tec`A11`}. Kompilator zgłasza to czytelnym komunikatem, np.{" "}
            {tec`tag "K2" nie może kończyć się cyfrą`}, tak samo jak zajęty tag lub rodzaj.
          </li>
          <li>
            <strong>DOT</strong>.<ul>
              <li>
                Porty to komórki tabeli HTML z atrybutem {tec`PORT`}. Kompas {tec`:e`}/{tec`:w`} (przy {tec`LR`}) albo {tec`:s`}/{tec`:n`} (przy{" "}
                {tec`TB`}) prowadzi linie do boku komórki.
              </li>
              <li>Każda lina dostaje atrybut {tec`id="N01"`} z drugiej instancji {tec`SilnikUnikalnychKluczy`}, więc trafia on do {tec`SVG`}.</li>
              <li>Własny {tec`label`} w szablonie wyłącza tabelę generowaną przez silnik.</li>
            </ul>
          </li>
          <li>
            <strong>Użyte elementy TypeScriptu i ES2025</strong>:<ul>
              <li>{tec("ts")`NoInfer`} w {tec`polacz`}, dzięki czemu rodzaj liny wynika tylko z pierwszego argumentu;</li>
              <li>{tec("ts")`const`} type parameters, template literal types (komunikaty błędów, typ {tec("ts")`K\${number}`}), {tec`infer`} w {tec`StanSchematu`};</li>
              <li>{tec("ts")`Exclude`}, {tec("ts")`Record`}, {tec("ts")`Readonly`}, {tec("ts")`Partial`};</li>
              <li>iterator helpers i {tec("ts")`Set.prototype.difference`} z ES2025;</li>
              <li>blok {tec`static`} do dostępu schemat → silnik.</li>
            </ul>
          </li>
        </ul>
      </P>
    </article>
  );
}
