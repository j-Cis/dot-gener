// @project-metadata
// Path: site/screen/Tec.render.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { VNode } from "preact";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import rust from "highlight.js/lib/languages/rust";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { cx } from "@/site/common/util/cx.ts";

/**
 * Kod wyświetlany dosłownie (jako tekst, nie renderowany). Bez `lang` Preact sam zamienia
 * <, & i " na encje; z `lang` koloruje highlight.js, który też zamienia je na encje —
 * w obu przypadkach nic z treści nie stanie się znacznikiem HTML.
 * Działa i na serwerze, i w wyspie (highlight.js jest w import mapie przeglądarki).
 *
 *   W linii (<code>):              {tec`const x = { a: 1 };`}
 *   W linii, z kolorami:           {tec("ts")`const x: number = 1;`}
 *   Blok wielolinijkowy (<pre>):   {tecs`
 *                                     function f<T>(x: T): T {
 *                                       return x;
 *                                     }
 *                                   `}
 *   Blok z kolorami:               {tecs("typescript")`…`}
 *   Bloki obok siebie:             {tecs({ lang: "json", widthTrim: "50%" })`…`}
 *                                  {tecs({ lang: "json", widthTrim: "50%" })`…`}
 *   Jako komponent:                <Tec blok lang="typescript" widthTrim="50%">{tekst}</Tec>
 *
 * Szablony biorą treść dosłownie (String.raw): klamry, <…> i ukośniki (\n, \d) nie wymagają ucieczek.
 * Wyjątki — jak w każdym szablonie JS: odwrotny apostrof piszesz \` , a dosłowne ${ piszesz \${ .
 * Samo ${wyrażenie} to wstawka JavaScriptu (np. wartość policzona w kodzie strony).
 */

const JEZYKI = { bash, css, javascript, json, rust, typescript, xml };
for (const [nazwa, definicja] of Object.entries(JEZYKI)) hljs.registerLanguage(nazwa, definicja);

/** Nazwy i aliasy zarejestrowanych języków (aliasy wg definicji highlight.js 11.12.0). */
export type Jezyk =
  | keyof typeof JEZYKI
  | "ts"
  | "tsx"
  | "mts"
  | "cts"
  | "js"
  | "jsx"
  | "mjs"
  | "cjs"
  | "jsonc"
  | "json5"
  | "html"
  | "sh"
  | "zsh"
  | "rs";

/** Szerokość bloku dla `widthTrim`, np. "50%", "40rem", "80ch". */
export type Szerokosc = `${number}${"%" | "rem" | "em" | "ch" | "px"}`;

interface TecWspolne {
  children: string;
  /** język do kolorowania składni, np. "typescript" albo "ts"; bez niego — zwykły tekst */
  lang?: Jezyk;
}

export type TecProps =
  & TecWspolne
  & (
    | {
      /** blok wielolinijkowy (<pre>) zamiast kodu w linii (<code>) */
      blok: true;
      /**
       * szerokość bloku, np. "50%"; blok z widthTrim staje w rzędzie obok sąsiednich bloków z widthTrim.
       * Odstęp między blokami jest wliczony w szerokość, więc 2 × "50%" (albo "60%" + "40%") mieści się w jednym rzędzie.
       */
      widthTrim?: Szerokosc;
    }
    | { blok?: false; widthTrim?: never }
  );

export function Tec({ children, blok = false, lang, widthTrim }: TecProps) {
  const jezyk = lang === undefined ? undefined : `language-${lang}`;
  const kod = (klasa: string | undefined) =>
    lang === undefined
      ? <code class={klasa}>{children}</code>
      : <code class={cx(klasa, jezyk)} dangerouslySetInnerHTML={{ __html: hljs.highlight(children, { language: lang, ignoreIllegals: true }).value }} />;
  if (!blok) return kod("tec");
  if (widthTrim === undefined) return <pre class="tec tec-blok">{kod(undefined)}</pre>;
  return <pre class="tec tec-blok tec-przyciety" style={`--tec-szerokosc: ${widthTrim}`}>{kod(undefined)}</pre>;
}

type Szablon = (s: TemplateStringsArray, ...w: unknown[]) => VNode;

/** Kod w linii: {tec`…`} albo z kolorami {tec("ts")`…`}. */
export function tec(lang: Jezyk): Szablon;
export function tec(s: TemplateStringsArray, ...w: unknown[]): VNode;
export function tec(a: Jezyk | TemplateStringsArray, ...w: unknown[]): VNode | Szablon {
  if (typeof a === "string") return (s, ...w2) => <Tec lang={a}>{doslownie(s, w2)}</Tec>;
  return <Tec>{doslownie(a, w)}</Tec>;
}
export type OutTec = VNode | Szablon;

/** Opcje bloku dla {tecs({ … })`…`}: język i szerokość. */
export interface OpcjeTecs {
  lang?: Jezyk;
  widthTrim?: Szerokosc;
}

/**
 * Kod wielolinijkowy: {tecs`…`}, {tecs("typescript")`…`} albo {tecs({ lang: "typescript", widthTrim: "50%" })`…`}
 * — bez pierwszej/ostatniej pustej linii i bez wspólnego wcięcia.
 */
export function tecs(opcje: Jezyk | OpcjeTecs): Szablon;
export function tecs(s: TemplateStringsArray, ...w: unknown[]): VNode;
export function tecs(a: Jezyk | OpcjeTecs | TemplateStringsArray, ...w: unknown[]): VNode | Szablon {
  if (jestSzablonem(a)) return <Tec blok>{wyrownaj(doslownie(a, w))}</Tec>;
  const opcje: OpcjeTecs = typeof a === "string" ? { lang: a } : a;
  return (s, ...w2) => <Tec blok {...opcje}>{wyrownaj(doslownie(s, w2))}</Tec>;
}

/** Szablon tagowany (tecs`…`) — w odróżnieniu od nazwy języka i obiektu opcji ma `raw`. */
const jestSzablonem = (a: unknown): a is TemplateStringsArray => Array.isArray(a) && "raw" in a;

/** Treść szablonu dosłownie; \` → ` i \${ → ${ (inne ukośniki zostają, np. /\d+/). */
export function doslownie(s: TemplateStringsArray, w: readonly unknown[]): string {
  return String.raw(s, ...w).replace(/\\`/g, "`").replace(/\\\$\{/g, "${");
}

/**
 * Usuwa pustą pierwszą i ostatnią linię (te przy backtickach) oraz wcięcie wspólne
 * dla wszystkich niepustych linii — kod może być wcięty razem z otaczającym TSX.
 */
export function wyrownaj(tekst: string): string {
  const linie = tekst.split("\n");
  if (linie.length > 1 && linie[0]?.trim() === "") linie.shift();
  if (linie.length > 1 && linie.at(-1)?.trim() === "") linie.pop();
  const wciecia = linie.filter((l) => l.trim() !== "").map((l) => l.length - l.trimStart().length);
  const wspolne = wciecia.length > 0 ? Math.min(...wciecia) : 0;
  return linie.map((l) => l.slice(wspolne)).join("\n");
}
