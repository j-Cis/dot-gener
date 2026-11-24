// @project-metadata
// Path: examples/schemat-drzewa.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Druga dziedzina: drzewo binarne z lustrzaną numeracją.
 * Wszystkie pola są automatyczne — wynikają wyłącznie z tego, jak węzły połączono linami.
 */
import { html, type HtmlDot, SchematGrafu, typ } from "@/src/silnik-grafu.ts";

export const NIEBIESKI = "#4f85d8";
export const CZERWONY = "#d84e5f";

/**
 * Reguły (sprawdzone na wszystkich 15 węzłach wzorcowego pliku DOT):
 *  korzeń: K=0, iA=1, iR=1, nL=0, nP=0, dL=1, dP=0
 *  lewy  (lina „lewa”):  K+1, iA=2·iA, iR=2·iR+1, nL+1, nP=0, dL=dL rodzica, dP=własne iA
 *  prawy (lina „prawa”): K+1, iA=2·iA+1, iR=2·iR, nL=0, nP+1, dL=własne iA, dP=dP rodzica
 *  każdy: jA = iA − 2^K, jR = iR − 2^K
 */
export type PolaDrzewa = {
  K: number;
  iA: number;
  iR: number;
  jA: number;
  jR: number;
  dL: number;
  nL: number;
  dP: number;
  nP: number;
};

/** Rodzic = źródło jedynej liny wchodzącej. */
function rodzic<T>(wezel: { wejscia(): readonly { readonly od: T }[] }): T {
  const [lina] = wezel.wejscia();
  if (lina === undefined) throw new Error("węzeł drzewa bez rodzica — najpierw połącz go liną");
  return lina.od;
}

type ZPolami = { readonly auto: Readonly<Pick<PolaDrzewa, "iA" | "iR" | "K">> };
const jA = (w: ZPolami) => w.auto.iA - 2 ** w.auto.K;
const jR = (w: ZPolami) => w.auto.iR - 2 ** w.auto.K;

export const schematDrzewa = new SchematGrafu()
  // ── 3 rodzaje węzłów: różnią się portem wejściowym ───────────────────
  .wezel("korzen", { tag: "K", porty: ["wyL", "wyP"] })
  .wezel("lewy", { tag: "L", porty: ["weL", "wyL", "wyP"] })
  .wezel("prawy", { tag: "P", porty: ["weP", "wyL", "wyP"] })
  // ── 2 rodzaje lin: każdy węzeł może być rodzicem ─────────────────────
  .lina("lewa", {
    tag: "LL",
    od: { korzen: ["wyL"], lewy: ["wyL"], prawy: ["wyL"] },
    do: { lewy: ["weL"] },
  })
  .lina("prawa", {
    tag: "LP",
    od: { korzen: ["wyP"], lewy: ["wyP"], prawy: ["wyP"] },
    do: { prawy: ["weP"] },
  })
  // ── pola automatyczne: wartość rodzica + krok zależny od rodzaju węzła ─
  .autoRekurencyjne(typ<PolaDrzewa>(), {
    korzen: {
      K: () => 0,
      iA: () => 1,
      iR: () => 1,
      jA,
      jR,
      dL: () => 1,
      nL: () => 0,
      dP: () => 0,
      nP: () => 0,
    },
    lewy: {
      K: (w) => rodzic(w).auto.K + 1,
      iA: (w) => 2 * rodzic(w).auto.iA,
      iR: (w) => 2 * rodzic(w).auto.iR + 1,
      jA,
      jR,
      dL: (w) => rodzic(w).auto.dL,
      nL: (w) => rodzic(w).auto.nL + 1,
      dP: (w) => w.auto.iA,
      nP: () => 0,
    },
    prawy: {
      K: (w) => rodzic(w).auto.K + 1,
      iA: (w) => 2 * rodzic(w).auto.iA + 1,
      iR: (w) => 2 * rodzic(w).auto.iR,
      jA,
      jR,
      dL: (w) => w.auto.iA,
      nL: () => 0,
      dP: (w) => rodzic(w).auto.dP,
      nP: (w) => rodzic(w).auto.nP + 1,
    },
  })
  // ── szablony DOT: własna etykieta HTML (silnik nie generuje wtedy swojej tabeli) ─
  .szablonWezla("korzen", (w) => ({ atrybuty: { shape: "plaintext", fontsize: 17, label: etykieta(w) } }))
  .szablonWezla("lewy", (w) => ({ atrybuty: { shape: "plaintext", fontsize: 17, label: etykieta(w, "weL") } }))
  .szablonWezla("prawy", (w) => ({ atrybuty: { shape: "plaintext", fontsize: 17, label: etykieta(w, "weP") } }))
  .szablonLiny("lewa", () => ({ atrybuty: styl(NIEBIESKI) }))
  .szablonLiny("prawa", () => ({ atrybuty: styl(CZERWONY) }));

function styl(color: string) {
  return { style: "bold", penwidth: 5, arrowsize: 1, minlen: 1.5, color } as const;
}

/**
 * Układ jak we wzorze: [wyL | wejście nad polami | wyP]; port wejściowy tylko w L i P.
 * Dodatkowy pierwszy wiersz tabeli pól: identyfikator z paddingiem.
 */
function etykieta(
  w: { readonly idTekst: string; readonly auto: Readonly<PolaDrzewa> },
  wejscie?: "weL" | "weP",
): HtmlDot {
  const a = w.auto;
  const td = (tresc: string, colspan = 1) => `<td align="left" balign="left"${colspan > 1 ? ` colspan="${colspan}"` : ""}>${tresc}</td>`;
  const pola = `<table border="0" cellborder="1" cellspacing="0" cellpadding="3" color="#aaaaaa" bgcolor="#dedede">` +
    `<tr><td colspan="4"><b>${w.idTekst}</b></td></tr>` +
    `<tr>${td(`iA=${a.iA}`, 2)}${td(`iR=${a.iR}`, 2)}</tr>` +
    `<tr>${td(`jA=${a.jA}`)}${td(`K=${a.K}`, 2)}${td(`jR=${a.jR}`)}</tr>` +
    `<tr>${td(`dL=${a.dL}`)}${td(`nL=${a.nL}`)}${td(`dP=${a.dP}`)}${td(`nP=${a.nP}`)}</tr>` +
    `</table>`;
  const wiersze = wejscie === undefined ? 1 : 2;
  const bok = (port: "wyL" | "wyP") =>
    `<td port="${port}" align="${port === "wyL" ? "left" : "right"}" rowspan="${wiersze}" bgcolor="${port === "wyL" ? NIEBIESKI : CZERWONY}"><b>${port}</b></td>`;
  const srodek = `<td align="center" bgcolor="#dedede">${pola}</td>`;
  const wiersz = wejscie === undefined
    ? `<tr>${bok("wyL")}${srodek}${bok("wyP")}</tr>`
    : `<tr>${bok("wyL")}<td port="${wejscie}" align="center" bgcolor="${wejscie === "weL" ? NIEBIESKI : CZERWONY}"><b>${wejscie}</b></td>${bok("wyP")}</tr><tr>${srodek}</tr>`;
  return html(
    `<table border="3" cellborder="1" cellspacing="0" cellpadding="3" color="#000000" bgcolor="#ffffff">${wiersz}</table>`,
  );
}
