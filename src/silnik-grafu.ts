// @project-metadata
// Path: src/silnik-grafu.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * SilnikGrafu — uniwersalny, typowany silnik grafu skierowanego.
 *
 * Silnik nie zna dziedziny: rodzaje węzłów i lin (tag, porty, kategorie, pola,
 * pola automatyczne, szablony DOT) deklaruje użytkownik w `SchematGrafu`.
 * Numery nadaje `SilnikUnikalnychKluczy` — osobno dla puli węzłów i puli lin.
 * Identyfikator tekstowy (tag + numer z paddingiem) powstaje dopiero przy odczycie,
 * bo szerokość zależy od `liczbaCyfr()`, która rośnie razem z rejestrem.
 */
import { SilnikUnikalnychKluczy } from "./silnik-unikalnych-kluczy.ts";

// ═══════════════════════════════════════════════════════════════════════════
// 1. Definicje deklarowane przez użytkownika
// ═══════════════════════════════════════════════════════════════════════════

/** kategoria → podkategorie (pusta lista = kategoria bez podkategorii) */
export type DrzewoKategorii = { readonly [kategoria: string]: readonly string[] };
/** wymiar → drzewo. Jeden wymiar = „kategoria z podkategorią”, kilka = pula kategorii. */
export type WymiaryKategorii = { readonly [wymiar: string]: DrzewoKategorii };
/** rodzaj węzła → porty dozwolone na danym końcu liny ([] = bez portu) */
export type Koncowki = { readonly [rodzajWezla: string]: readonly string[] };

export interface DefWezla {
  readonly tag: string;
  readonly porty: readonly string[];
  readonly kategorie: WymiaryKategorii;
  readonly pola: object;
}

export interface DefLiny {
  readonly tag: string;
  readonly od: Koncowki;
  readonly do: Koncowki;
  readonly pola: object;
}

/** Funkcja o jednym parametrze dowolnego typu (parametr kontrawariantny → never). */
type Funkcja<R = unknown> = (x: never) => R;
type ZestawAuto = { readonly [pole: string]: Funkcja };

/** Stan schematu na poziomie typów — rośnie z każdym wywołaniem buildera. */
export interface Stan {
  readonly wezly: { readonly [rodzaj: string]: DefWezla };
  readonly liny: { readonly [rodzaj: string]: DefLiny };
  readonly autoWezlow: { readonly [rodzaj: string]: ZestawAuto };
  readonly autoLin: { readonly [rodzaj: string]: ZestawAuto };
}

/** Typ obiektu bez kluczy (`{}` w TS znaczy „cokolwiek poza null/undefined”). */
export type Pusty = Record<never, never>;

export type StanPusty = { wezly: Pusty; liny: Pusty; autoWezlow: Pusty; autoLin: Pusty };

// ═══════════════════════════════════════════════════════════════════════════
// 2. Typy pochodne
// ═══════════════════════════════════════════════════════════════════════════

/** Spłaszcza przecięcia w podpowiedziach edytora. */
type Scal<T> = { [K in keyof T]: T[K] } & Pusty;

export type RodzajWezla<S extends Stan> = keyof S["wezly"] & string;
export type RodzajLiny<S extends Stan> = keyof S["liny"] & string;
type DefW<S extends Stan, K extends RodzajWezla<S>> = S["wezly"][K];
type DefL<S extends Stan, L extends RodzajLiny<S>> = S["liny"][L];
type PortW<S extends Stan, K extends RodzajWezla<S>> = DefW<S, K>["porty"][number];

export type IdWezla<K extends string = string> = readonly [rodzaj: K, numer: number];
export type IdLiny<L extends string = string> = readonly [rodzaj: L, numer: number];

// ── walidacja nazw na poziomie typów: zwraca nazwę albo komunikat błędu ──
type Cyfra = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type ZajeteRodzaje<S extends Stan> = RodzajWezla<S> | RodzajLiny<S>;
type ZajeteTagi<S extends Stan> =
  | S["wezly"][RodzajWezla<S>]["tag"]
  | S["liny"][RodzajLiny<S>]["tag"];

type PoprawnyRodzaj<N extends string, S extends Stan> = N extends "" ? "rodzaj nie może być pusty"
  : N extends ZajeteRodzaje<S> ? `rodzaj "${N}" jest już zajęty`
  : N;

/** Tag nie kończy się cyfrą — dzięki temu "A" + "11" i "A1" + "1" nie dadzą tego samego id. */
type PoprawnyTag<T extends string, S extends Stan> = T extends "" ? "tag nie może być pusty"
  : T extends `${string}${Cyfra}` ? `tag "${T}" nie może kończyć się cyfrą`
  : T extends ZajeteTagi<S> ? `tag "${T}" jest już zajęty`
  : T;

// ── kategorie: krotka [kategoria] albo [kategoria, podkategoria] ──
type WyborZDrzewa<D extends DrzewoKategorii> = {
  [K in keyof D & string]: D[K] extends readonly [] ? readonly [kategoria: K]
    : readonly [kategoria: K, podkategoria: D[K][number]];
}[keyof D & string];

export type WybraneKategorie<C extends WymiaryKategorii> = {
  readonly [W in keyof C]: WyborZDrzewa<C[W]>;
};

// ── końce lin: krotka [id] albo [id, port], skorelowana z rodzajem węzła ──
type KoncowkiZ<S extends Stan> = { readonly [K in RodzajWezla<S>]?: readonly PortW<S, K>[] };
type TylkoZnane<T, Znane extends PropertyKey> = { readonly [N in Exclude<keyof T, Znane>]: never };

/** porty występujące na danym końcu liny */
type PortyNaKoncu<KK extends Koncowki> = KK[keyof KK][number];
/** rodzaje węzłów, które na tym końcu przyjmują port P */
type RodzajeZPortem<S extends Stan, KK extends Koncowki, P extends string> = {
  [K in keyof KK & RodzajWezla<S>]: P extends KK[K][number] ? K : never;
}[keyof KK & RodzajWezla<S>];
type RodzajeBezPortu<S extends Stan, KK extends Koncowki> = {
  [K in keyof KK & RodzajWezla<S>]: KK[K] extends readonly [] ? K : never;
}[keyof KK & RodzajWezla<S>];

/**
 * Koniec liny: [id, port] albo [id] (rodzaj bez portu). Grupowanie po porcie, nie po rodzaju:
 * id typu unii, np. IdWezla<"lewy" | "prawy">, przechodzi, gdy każdy rodzaj z unii ma ten port.
 */
type Koncowka<S extends Stan, KK extends Koncowki> =
  | { [P in PortyNaKoncu<KK>]: readonly [wezel: IdWezla<RodzajeZPortem<S, KK, P>>, port: P] }[PortyNaKoncu<KK>]
  | ([RodzajeBezPortu<S, KK>] extends [never] ? never : readonly [wezel: IdWezla<RodzajeBezPortu<S, KK>>]);

type PortKonca<KK extends Koncowki> = {
  [K in keyof KK]: KK[K] extends readonly [] ? undefined : KK[K][number];
}[keyof KK];

// ── pola automatyczne: typ = ReturnType funkcji ──
type WynikiAuto<A extends ZestawAuto> = { readonly [P in keyof A]: ReturnType<A[P]> };
type AutoWezla<S extends Stan, K extends string> = K extends keyof S["autoWezlow"] ? WynikiAuto<S["autoWezlow"][K]>
  : Pusty;
type AutoLiny<S extends Stan, L extends string> = L extends keyof S["autoLin"] ? WynikiAuto<S["autoLin"][L]> : Pusty;

// ── które rodzaje lin mogą wchodzić do / wychodzić z węzła K ──
type LinyDo<S extends Stan, K extends string> = {
  [L in RodzajLiny<S>]: K extends keyof DefL<S, L>["do"] ? L : never;
}[RodzajLiny<S>];
type LinyOd<S extends Stan, K extends string> = {
  [L in RodzajLiny<S>]: K extends keyof DefL<S, L>["od"] ? L : never;
}[RodzajLiny<S>];

/** Widok węzła: pola wpisywane + automatyczne + nawigacja po linach. Dla unii K — unia rozróżniana po `rodzaj`. */
export type WidokWezla<S extends Stan, K extends RodzajWezla<S> = RodzajWezla<S>> = K extends RodzajWezla<S> ? {
    readonly rodzaj: K;
    readonly id: IdWezla<K>;
    /** tag + numer z paddingiem wg liczbaCyfr() — liczony przy każdym odczycie */
    readonly idTekst: `${DefW<S, K>["tag"]}${number}`;
    readonly kategorie: WybraneKategorie<DefW<S, K>["kategorie"]>;
    readonly pola: Readonly<DefW<S, K>["pola"]>;
    readonly auto: AutoWezla<S, K>;
    /** liny wchodzące (bez argumentów — wszystkie) */
    wejscia<L extends LinyDo<S, K> = LinyDo<S, K>>(...rodzaje: L[]): WidokLiny<S, L & RodzajLiny<S>>[];
    /** liny wychodzące (bez argumentów — wszystkie) */
    wyjscia<L extends LinyOd<S, K> = LinyOd<S, K>>(...rodzaje: L[]): WidokLiny<S, L & RodzajLiny<S>>[];
  }
  : never;

export type WidokLiny<S extends Stan, L extends RodzajLiny<S> = RodzajLiny<S>> = L extends RodzajLiny<S> ? {
    readonly rodzaj: L;
    readonly id: IdLiny<L>;
    readonly idTekst: `${DefL<S, L>["tag"]}${number}`;
    readonly od: WidokWezla<S, keyof DefL<S, L>["od"] & RodzajWezla<S>>;
    readonly portOd: PortKonca<DefL<S, L>["od"]>;
    readonly do: WidokWezla<S, keyof DefL<S, L>["do"] & RodzajWezla<S>>;
    readonly portDo: PortKonca<DefL<S, L>["do"]>;
    readonly pola: Readonly<DefL<S, L>["pola"]>;
    readonly auto: AutoLiny<S, L>;
  }
  : never;

// ── jawny typ tam, gdzie TS nie może go wywnioskować ──
declare const TYP: unique symbol;
/** Nośnik typu bez wartości w runtime: `typ<{ K: number }>()`. */
export interface Typ<T> {
  readonly [TYP]?: T;
}
export const typ = <T>(): Typ<T> => ({});

/** Funkcje dające pola W — tak zapisuje je stan, więc WynikiAuto (ReturnType) odtwarza dokładnie W. */
/** Parametr `unknown`, nie `never`: ReturnType<(x: never) => R> daje any (any nie jest przypisywalne do never). */
type FunkcjeZ<W> = { readonly [P in keyof W]: (widok: unknown) => W[P] };
/** Stan S, w którym rodzaje R mają dodatkowo pola automatyczne W. */
type ZAutoWezlow<S extends Stan, R extends string, W> = {
  wezly: S["wezly"];
  liny: S["liny"];
  autoWezlow: S["autoWezlow"] & Record<R, FunkcjeZ<W>>;
  autoLin: S["autoLin"];
};

/** Stan wyłuskany ze schematu lub silnika: `WidokWezla<StanSchematu<typeof schemat>, "ksiazka">`. */
export type StanSchematu<T> = T extends SchematGrafu<infer S> ? S
  : T extends SilnikGrafu<infer S> ? S
  : never;

// ── dane wejściowe przy tworzeniu ──
/** Partial<F>, ale dla F bez pól — obiekt bez kluczy (Partial<{}> = {} przepuszczałby wszystko). */
type ZmianyPol<F> = [keyof F] extends [never] ? { readonly [pole: string]: never } : Partial<F>;

type DaneWezla<S extends Stan, K extends RodzajWezla<S>> = Scal<
  & ([keyof DefW<S, K>["kategorie"]] extends [never] ? { readonly kategorie?: Pusty }
    : { readonly kategorie: WybraneKategorie<DefW<S, K>["kategorie"]> })
  & { readonly pola?: ZmianyPol<DefW<S, K>["pola"]> }
>;
type DaneLiny<S extends Stan, L extends RodzajLiny<S>> = { readonly pola?: ZmianyPol<DefL<S, L>["pola"]> };
/** Argument opcjonalny, gdy nic w nim nie jest wymagane. */
type Opcjonalne<D> = Pusty extends D ? [dane?: D] : [dane: D];

// ═══════════════════════════════════════════════════════════════════════════
// 3. DOT — atrybuty i szablony
// ═══════════════════════════════════════════════════════════════════════════

/** Etykieta HTML-like Graphviza: wypisywana jako <...>, bez cudzysłowów. */
export class HtmlDot {
  readonly tresc: string;
  constructor(tresc: string) {
    this.tresc = tresc;
  }
}
export const html = (tresc: string): HtmlDot => new HtmlDot(tresc);

export type WartoscDot = string | number | boolean | HtmlDot;
type ZnaneAtrybutyDot =
  | "label"
  | "xlabel"
  | "shape"
  | "style"
  | "color"
  | "fillcolor"
  | "fontcolor"
  | "fontname"
  | "fontsize"
  | "penwidth"
  | "tooltip"
  | "URL"
  | "arrowhead"
  | "arrowtail"
  | "arrowsize"
  | "dir"
  | "constraint"
  | "weight"
  | "minlen"
  | "width"
  | "height"
  | "margin"
  | "group"
  | "rankdir"
  | "splines"
  | "nodesep"
  | "ranksep"
  | "bgcolor";
/** Znane atrybuty podpowiadają się w edytorze, `string & Pusty` dopuszcza każdy inny; undefined = pomiń. */
export type AtrybutyDot = { readonly [A in ZnaneAtrybutyDot | (string & Pusty)]?: WartoscDot | undefined };

export interface SzablonWezla {
  /** wiersze pod identyfikatorem */
  readonly opis?: readonly string[];
  /** kolor tła tabeli (BGCOLOR) */
  readonly tlo?: string;
  /** dodatkowe atrybuty; własny `label` wyłącza tabelę z portami generowaną przez silnik */
  readonly atrybuty?: AtrybutyDot;
}

export interface SzablonLiny {
  readonly opis?: string;
  readonly atrybuty?: AtrybutyDot;
}

export interface OpcjeDot {
  readonly nazwa?: string;
  readonly kierunek?: "LR" | "TB";
  readonly atrybutyGrafu?: AtrybutyDot;
  readonly atrybutyWezlow?: AtrybutyDot;
  readonly atrybutyLin?: AtrybutyDot;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SchematGrafu — niemutowalny builder, każdy krok zwraca nowy typ
// ═══════════════════════════════════════════════════════════════════════════

interface Konfiguracja {
  readonly wezly: ReadonlyMap<string, DefWezla>;
  readonly liny: ReadonlyMap<string, DefLiny>;
  readonly autoWezlow: ReadonlyMap<string, ReadonlyMap<string, Funkcja>>;
  readonly autoLin: ReadonlyMap<string, ReadonlyMap<string, Funkcja>>;
  readonly szablonyWezlow: ReadonlyMap<string, Funkcja<SzablonWezla>>;
  readonly szablonyLin: ReadonlyMap<string, Funkcja<SzablonLiny>>;
}

const PUSTA: Konfiguracja = {
  wezly: new Map(),
  liny: new Map(),
  autoWezlow: new Map(),
  autoLin: new Map(),
  szablonyWezlow: new Map(),
  szablonyLin: new Map(),
};

/** Dostęp „friend” do #k dla SilnikGrafu — ustawiany w bloku static, niewidoczny poza modułem. */
let konfiguracjaSchematu!: <S extends Stan>(schemat: SchematGrafu<S>) => Konfiguracja;

export class SchematGrafu<S extends Stan = StanPusty> {
  #k: Konfiguracja = PUSTA;

  static {
    konfiguracjaSchematu = (schemat) => schemat.#k;
  }

  #z<N extends Stan>(zmiany: Partial<Konfiguracja>): SchematGrafu<N> {
    const nowy = new SchematGrafu<N>();
    nowy.#k = { ...this.#k, ...zmiany };
    return nowy;
  }

  #sprawdzNowe(rodzaj: string, tag: string): void {
    if (rodzaj === "") throw new Error("Rodzaj nie może być pusty");
    if (this.#k.wezly.has(rodzaj) || this.#k.liny.has(rodzaj)) throw new Error(`Rodzaj „${rodzaj}” jest już zajęty`);
    if (tag === "") throw new Error(`„${rodzaj}”: tag nie może być pusty`);
    if (/\d$/.test(tag)) throw new Error(`„${rodzaj}”: tag „${tag}” nie może kończyć się cyfrą`);
    const tagi = new Set([...this.#k.wezly.values(), ...this.#k.liny.values()].map((d) => d.tag));
    if (tagi.has(tag)) throw new Error(`„${rodzaj}”: tag „${tag}” jest już zajęty`);
  }

  /** Nowy rodzaj węzła. `pola` to wartości domyślne — z nich wynika typ pól. */
  wezel<
    K extends string,
    const T extends string,
    const P extends readonly string[] = readonly [],
    const C extends WymiaryKategorii = Pusty,
    F extends object = Pusty,
  >(
    rodzaj: PoprawnyRodzaj<K, S>,
    def: {
      readonly tag: PoprawnyTag<T, S>;
      readonly porty?: P;
      readonly kategorie?: C;
      readonly pola?: F;
    },
  ): SchematGrafu<{
    wezly: S["wezly"] & Record<K, { tag: T; porty: P; kategorie: C; pola: F }>;
    liny: S["liny"];
    autoWezlow: S["autoWezlow"];
    autoLin: S["autoLin"];
  }> {
    const r: string = rodzaj;
    const tag: string = def.tag;
    this.#sprawdzNowe(r, tag);
    const porty: readonly string[] = def.porty ?? [];
    if (new Set(porty).size !== porty.length) throw new Error(`Węzeł „${r}”: powtórzony port`);
    const definicja: DefWezla = Object.freeze({
      tag,
      porty: Object.freeze([...porty]),
      kategorie: def.kategorie ?? {},
      pola: def.pola ?? {},
    });
    return this.#z({ wezly: new Map(this.#k.wezly).set(r, definicja) });
  }

  /** Nowy rodzaj liny: dozwolone rodzaje węzłów i porty na obu końcach. */
  lina<
    L extends string,
    const T extends string,
    const Od extends KoncowkiZ<S>,
    const Do extends KoncowkiZ<S>,
    F extends object = Pusty,
  >(
    rodzaj: PoprawnyRodzaj<L, S>,
    def: {
      readonly tag: PoprawnyTag<T, S>;
      readonly od: Od & TylkoZnane<Od, RodzajWezla<S>>;
      readonly do: Do & TylkoZnane<Do, RodzajWezla<S>>;
      readonly pola?: F;
    },
  ): SchematGrafu<{
    wezly: S["wezly"];
    liny: S["liny"] & Record<L, { tag: T; od: Od; do: Do; pola: F }>;
    autoWezlow: S["autoWezlow"];
    autoLin: S["autoLin"];
  }> {
    const r: string = rodzaj;
    const tag: string = def.tag;
    this.#sprawdzNowe(r, tag);
    const strony: readonly [strona: "od" | "do", koncowki: Koncowki][] = [["od", def.od], ["do", def.do]];
    for (const [strona, koncowki] of strony) {
      const wpisy = Object.entries(koncowki);
      if (wpisy.length === 0) throw new Error(`Lina „${r}”.${strona}: brak dozwolonych węzłów`);
      for (const [rodzajWezla, porty] of wpisy) {
        const dw = this.#k.wezly.get(rodzajWezla);
        if (dw === undefined) throw new Error(`Lina „${r}”.${strona}: nieznany rodzaj węzła „${rodzajWezla}”`);
        for (const port of porty) {
          if (!dw.porty.includes(port)) {
            throw new Error(`Lina „${r}”.${strona}: węzeł „${rodzajWezla}” nie ma portu „${port}”`);
          }
        }
      }
    }
    const definicja: DefLiny = Object.freeze({ tag, od: def.od, do: def.do, pola: def.pola ?? {} });
    return this.#z({ liny: new Map(this.#k.liny).set(r, definicja) });
  }

  /** Pola automatyczne węzła — liczone leniwie z widoku (sąsiedzi, liny, wcześniej zdefiniowane auto). */
  autoWezla<K extends RodzajWezla<S>, A extends { readonly [pole: string]: (wezel: WidokWezla<S, K>) => unknown }>(
    rodzaj: K,
    definicje: A,
  ): SchematGrafu<{
    wezly: S["wezly"];
    liny: S["liny"];
    autoWezlow: S["autoWezlow"] & Record<K, A>;
    autoLin: S["autoLin"];
  }> {
    if (!this.#k.wezly.has(rodzaj)) throw new Error(`Nieznany rodzaj węzła „${rodzaj}”`);
    return this.#z({ autoWezlow: dolaczAuto(this.#k.autoWezlow, rodzaj, definicje) });
  }

  /**
   * Pola automatyczne wspólne dla kilku rodzajów węzłów, mogące sięgać po te same pola
   * u siebie i u sąsiadów — np. `K = rodzic.K + 1`. Typ pól podajesz jawnie przez `typ<W>()`,
   * bo typu zależnego od samego siebie TS nie wywnioskuje. Każdy rodzaj definiuje wszystkie pola W;
   * zapętlenie (pole zależne od siebie przez cykl lin) wykrywa silnik przy odczycie.
   */
  autoRekurencyjne<W extends object, R extends RodzajWezla<S>>(
    _typ: Typ<W>,
    definicje: {
      readonly [
        // NoInfer: R wynika tylko z kluczy; wartości nie biorą udziału we wnioskowaniu,
        // więc literał [a, b] dostaje kontekstowy typ krotki z W, zamiast poszerzyć się do number[]
        K in R
      ]: NoInfer<{ readonly [P in keyof W]: (wezel: WidokWezla<ZAutoWezlow<S, R, W>, K>) => W[P] }>;
    },
  ): SchematGrafu<ZAutoWezlow<S, R, W>> {
    const wpisy = Object.entries(definicje) as [string, object][];
    const klucze = (o: object) => Object.keys(o).sort().join(", ");
    const [pierwszy] = wpisy;
    if (pierwszy === undefined) throw new Error("autoRekurencyjne: brak definicji");
    let autoWezlow = this.#k.autoWezlow;
    for (const [rodzaj, pola] of wpisy) {
      if (!this.#k.wezly.has(rodzaj)) throw new Error(`Nieznany rodzaj węzła „${rodzaj}”`);
      if (klucze(pola) !== klucze(pierwszy[1])) {
        throw new Error(
          `autoRekurencyjne: „${rodzaj}” ma pola [${klucze(pola)}], a „${pierwszy[0]}” [${klucze(pierwszy[1])}]`,
        );
      }
      autoWezlow = dolaczAuto(autoWezlow, rodzaj, pola);
    }
    return this.#z({ autoWezlow });
  }

  /** Pola automatyczne liny. */
  autoLiny<L extends RodzajLiny<S>, A extends { readonly [pole: string]: (lina: WidokLiny<S, L>) => unknown }>(
    rodzaj: L,
    definicje: A,
  ): SchematGrafu<{
    wezly: S["wezly"];
    liny: S["liny"];
    autoWezlow: S["autoWezlow"];
    autoLin: S["autoLin"] & Record<L, A>;
  }> {
    if (!this.#k.liny.has(rodzaj)) throw new Error(`Nieznany rodzaj liny „${rodzaj}”`);
    return this.#z({ autoLin: dolaczAuto(this.#k.autoLin, rodzaj, definicje) });
  }

  szablonWezla<K extends RodzajWezla<S>>(
    rodzaj: K,
    szablon: (wezel: WidokWezla<S, K>) => SzablonWezla,
  ): SchematGrafu<S> {
    if (!this.#k.wezly.has(rodzaj)) throw new Error(`Nieznany rodzaj węzła „${rodzaj}”`);
    return this.#z({ szablonyWezlow: new Map(this.#k.szablonyWezlow).set(rodzaj, szablon) });
  }

  szablonLiny<L extends RodzajLiny<S>>(rodzaj: L, szablon: (lina: WidokLiny<S, L>) => SzablonLiny): SchematGrafu<S> {
    if (!this.#k.liny.has(rodzaj)) throw new Error(`Nieznany rodzaj liny „${rodzaj}”`);
    return this.#z({ szablonyLin: new Map(this.#k.szablonyLin).set(rodzaj, szablon) });
  }
}

function dolaczAuto(
  mapa: ReadonlyMap<string, ReadonlyMap<string, Funkcja>>,
  rodzaj: string,
  definicje: object,
): ReadonlyMap<string, ReadonlyMap<string, Funkcja>> {
  const pola = new Map(mapa.get(rodzaj));
  for (const [pole, fn] of Object.entries(definicje) as [string, unknown][]) {
    if (pola.has(pole)) throw new Error(`„${rodzaj}”: pole automatyczne „${pole}” jest już zdefiniowane`);
    if (typeof fn !== "function") throw new Error(`„${rodzaj}”: pole automatyczne „${pole}” nie jest funkcją`);
    pola.set(pole, fn as Funkcja);
  }
  return new Map(mapa).set(rodzaj, pola);
}

/** Wywołanie funkcji z konfiguracji — jedyne miejsce, gdzie silnik „ufa” typom z buildera. */
const wywolaj = <R>(fn: Funkcja<R>, widok: object): R => (fn as (x: object) => R)(widok);

// ═══════════════════════════════════════════════════════════════════════════
// 5. SilnikGrafu
// ═══════════════════════════════════════════════════════════════════════════

type Rekord = Readonly<Record<string, unknown>>;
type SuroweKategorie = Readonly<Record<string, readonly string[]>>;
type SurowyKoniec = readonly [wezel: IdWezla, port?: string];

interface RekordWezla {
  readonly id: IdWezla;
  readonly kategorie: SuroweKategorie;
  pola: Rekord;
  readonly wejscia: Set<RekordLiny>;
  readonly wyjscia: Set<RekordLiny>;
}

interface RekordLiny {
  readonly id: IdLiny;
  readonly od: RekordWezla;
  readonly portOd: string | undefined;
  readonly do: RekordWezla;
  readonly portDo: string | undefined;
  pola: Rekord;
}

export interface OpcjeSilnika {
  /**
   * "rodzaj" — szerokość numeru osobno dla każdego rodzaju (wprost z liczbaCyfr()),
   * "wspolne" — jedna szerokość w puli: maksimum z liczbaCyfr().
   */
  readonly wyrownanie?: "rodzaj" | "wspolne";
}

type Pula = "wezly" | "liny";

export class SilnikGrafu<S extends Stan> {
  readonly #k: Konfiguracja;
  readonly #wyrownanie: "rodzaj" | "wspolne";
  readonly #kluczeWezlow: SilnikUnikalnychKluczy<RodzajWezla<S>[]>;
  readonly #kluczeLin: SilnikUnikalnychKluczy<RodzajLiny<S>[]>;
  /** pula węzłów: rodzaj → numer → rekord */
  readonly #wezly = new Map<string, Map<number, RekordWezla>>();
  /** pula lin: rodzaj → numer → rekord */
  readonly #liny = new Map<string, Map<number, RekordLiny>>();

  /** każda zmiana grafu podbija wersję → unieważnia pamięć pól auto i szerokości id */
  #wersja = 0;
  #szerokosc: { readonly wersja: number } & Readonly<Record<Pula, Readonly<Record<string, number>>>> | undefined;
  readonly #pamiecAuto = new WeakMap<object, { wersja: number; wartosci: Map<string, unknown> }>();
  readonly #liczone: string[] = [];

  constructor(schemat: SchematGrafu<S>, opcje: OpcjeSilnika = {}) {
    this.#k = konfiguracjaSchematu(schemat);
    this.#wyrownanie = opcje.wyrownanie ?? "rodzaj";
    const rodzajeW = [...this.#k.wezly.keys()] as RodzajWezla<S>[];
    const rodzajeL = [...this.#k.liny.keys()] as RodzajLiny<S>[];
    this.#kluczeWezlow = new SilnikUnikalnychKluczy(rodzajeW);
    this.#kluczeLin = new SilnikUnikalnychKluczy(rodzajeL);
    for (const r of rodzajeW) this.#wezly.set(r, new Map());
    for (const r of rodzajeL) this.#liny.set(r, new Map());
  }

  // ── zapis ──────────────────────────────────────────────────────────────

  dodajWezel<K extends RodzajWezla<S>>(rodzaj: K, ...dane: Opcjonalne<DaneWezla<S, K>>): IdWezla<K>;
  dodajWezel(rodzaj: string, surowe?: unknown): IdWezla {
    const dane = surowe as { readonly kategorie?: SuroweKategorie; readonly pola?: Rekord } | undefined;
    const def = this.#def("wezly", rodzaj);
    const kategorie = sprawdzKategorie(rodzaj, def.kategorie, dane?.kategorie ?? {});
    const pola = scalPola(`węzeł „${rodzaj}”`, def.pola, klonuj(def.pola) as Rekord, dane?.pola);
    const id: IdWezla = Object.freeze(this.#kluczeWezlow.nadaj(rodzaj as RodzajWezla<S>));
    this.#pula("wezly", rodzaj).set(id[1], { id, kategorie, pola, wejscia: new Set(), wyjscia: new Set() });
    this.#wersja++;
    return id;
  }

  polacz<L extends RodzajLiny<S>>(
    rodzaj: L,
    odKonca: Koncowka<S, DefL<S, NoInfer<L>>["od"]>,
    doKonca: Koncowka<S, DefL<S, NoInfer<L>>["do"]>,
    ...dane: Opcjonalne<DaneLiny<S, NoInfer<L>>>
  ): IdLiny<L>;
  polacz(rodzaj: string, odKonca: SurowyKoniec, doKonca: SurowyKoniec, dane?: { readonly pola?: Rekord }): IdLiny {
    const def = this.#def("liny", rodzaj);
    const [od, portOd] = this.#koniec(rodzaj, "od", def.od, odKonca);
    const [do_, portDo] = this.#koniec(rodzaj, "do", def.do, doKonca);
    const pola = scalPola(`lina „${rodzaj}”`, def.pola, klonuj(def.pola) as Rekord, dane?.pola);
    const id: IdLiny = Object.freeze(this.#kluczeLin.nadaj(rodzaj as RodzajLiny<S>));
    const lina: RekordLiny = { id, od, portOd, do: do_, portDo, pola };
    this.#pula("liny", rodzaj).set(id[1], lina);
    od.wyjscia.add(lina);
    do_.wejscia.add(lina);
    this.#wersja++;
    return id;
  }

  ustawPola<K extends RodzajWezla<S>>(id: IdWezla<K>, zmiany: ZmianyPol<DefW<S, K>["pola"]>): void;
  ustawPola(id: IdWezla, zmiany: Rekord): void {
    const r = this.#rekord("wezly", id);
    r.pola = scalPola(`węzeł „${id[0]}”`, this.#def("wezly", id[0]).pola, r.pola, zmiany);
    this.#wersja++;
  }

  ustawPolaLiny<L extends RodzajLiny<S>>(id: IdLiny<L>, zmiany: ZmianyPol<DefL<S, L>["pola"]>): void;
  ustawPolaLiny(id: IdLiny, zmiany: Rekord): void {
    const r = this.#rekord("liny", id);
    r.pola = scalPola(`lina „${id[0]}”`, this.#def("liny", id[0]).pola, r.pola, zmiany);
    this.#wersja++;
  }

  // ── odczyt ─────────────────────────────────────────────────────────────

  wezel<K extends RodzajWezla<S>>(id: IdWezla<K>): WidokWezla<S, K>;
  wezel(id: IdWezla): object {
    return this.#widokWezla(this.#rekord("wezly", id));
  }

  lina<L extends RodzajLiny<S>>(id: IdLiny<L>): WidokLiny<S, L>;
  lina(id: IdLiny): object {
    return this.#widokLiny(this.#rekord("liny", id));
  }

  /** Widoki węzłów podanych rodzajów (bez argumentów — wszystkich), w kolejności nadania numerów. */
  wezly<K extends RodzajWezla<S> = RodzajWezla<S>>(...rodzaje: K[]): WidokWezla<S, K>[];
  wezly(...rodzaje: string[]): object[] {
    return (rodzaje.length > 0 ? rodzaje : [...this.#wezly.keys()])
      .values()
      .flatMap((r) => this.#pula("wezly", r).values())
      .map((rek) => this.#widokWezla(rek))
      .toArray();
  }

  liny<L extends RodzajLiny<S> = RodzajLiny<S>>(...rodzaje: L[]): WidokLiny<S, L>[];
  liny(...rodzaje: string[]): object[] {
    return (rodzaje.length > 0 ? rodzaje : [...this.#liny.keys()])
      .values()
      .flatMap((r) => this.#pula("liny", r).values())
      .map((rek) => this.#widokLiny(rek))
      .toArray();
  }

  rozmiar(): readonly [wezly: number, liny: number] {
    const suma = (pula: Map<string, Map<number, unknown>>) => pula.values().reduce((n, m) => n + m.size, 0);
    return [suma(this.#wezly), suma(this.#liny)];
  }

  // ── DOT ────────────────────────────────────────────────────────────────

  doDot(opcje: OpcjeDot = {}): string {
    const kierunek = opcje.kierunek ?? "LR";
    const wyjscie: string[] = [
      `digraph ${cytuj(opcje.nazwa ?? "graf")} {`,
      `  graph ${atrybuty({ rankdir: kierunek, ...opcje.atrybutyGrafu })};`,
      `  node ${atrybuty({ fontname: "Helvetica", fontsize: 11, ...opcje.atrybutyWezlow })};`,
      `  edge ${atrybuty({ fontname: "Helvetica", fontsize: 9, ...opcje.atrybutyLin })};`,
    ];

    for (const [rodzaj, def] of this.#k.wezly) {
      const pula = this.#pula("wezly", rodzaj);
      if (pula.size === 0) continue;
      const szablon = this.#k.szablonyWezlow.get(rodzaj);
      const [wej, wyj] = this.#stronyPortow(rodzaj, def.porty);
      wyjscie.push("", `  // ── węzły: ${rodzaj} (${def.tag}) ──`);
      for (const rek of pula.values()) {
        const id = this.#idTekst("wezly", rek.id);
        const s = szablon === undefined ? {} : wywolaj(szablon, this.#widokWezla(rek));
        const a: AtrybutyDot = s.atrybuty?.["label"] !== undefined
          ? s.atrybuty
          : { shape: "plain", label: html(tabela(kierunek, id, s.opis ?? [], wej, wyj, s.tlo)), ...s.atrybuty };
        wyjscie.push(`  ${cytuj(id)} ${atrybuty(a)};`);
      }
    }

    for (const [rodzaj, def] of this.#k.liny) {
      const pula = this.#pula("liny", rodzaj);
      if (pula.size === 0) continue;
      const szablon = this.#k.szablonyLin.get(rodzaj);
      wyjscie.push("", `  // ── liny: ${rodzaj} (${def.tag}) ──`);
      for (const rek of pula.values()) {
        const s = szablon === undefined ? {} : wywolaj(szablon, this.#widokLiny(rek));
        const [kompasOd, kompasDo] = kierunek === "LR" ? (["e", "w"] as const) : (["s", "n"] as const);
        const od = koniecDot(this.#idTekst("wezly", rek.od.id), rek.portOd, kompasOd);
        const do_ = koniecDot(this.#idTekst("wezly", rek.do.id), rek.portDo, kompasDo);
        const a: AtrybutyDot = { id: this.#idTekst("liny", rek.id), label: s.opis, ...s.atrybuty };
        wyjscie.push(`  ${od} -> ${do_} ${atrybuty(a)};`);
      }
    }

    wyjscie.push("}");
    return wyjscie.join("\n") + "\n";
  }

  // ── wnętrze ────────────────────────────────────────────────────────────

  #def(pula: "wezly", rodzaj: string): DefWezla;
  #def(pula: "liny", rodzaj: string): DefLiny;
  #def(pula: Pula, rodzaj: string): DefWezla | DefLiny {
    const def = this.#k[pula].get(rodzaj);
    if (def === undefined) throw new Error(`Nieznany rodzaj ${pula === "wezly" ? "węzła" : "liny"} „${rodzaj}”`);
    return def;
  }

  #pula(pula: "wezly", rodzaj: string): Map<number, RekordWezla>;
  #pula(pula: "liny", rodzaj: string): Map<number, RekordLiny>;
  #pula(pula: Pula, rodzaj: string): Map<number, RekordWezla | RekordLiny> {
    const mapa = (pula === "wezly" ? this.#wezly : this.#liny).get(rodzaj);
    if (mapa === undefined) throw new Error(`Nieznany rodzaj ${pula === "wezly" ? "węzła" : "liny"} „${rodzaj}”`);
    return mapa;
  }

  #rekord(pula: "wezly", id: IdWezla): RekordWezla;
  #rekord(pula: "liny", id: IdLiny): RekordLiny;
  #rekord(pula: Pula, [rodzaj, numer]: IdWezla): RekordWezla | RekordLiny {
    const rek = pula === "wezly" ? this.#pula(pula, rodzaj).get(numer) : this.#pula(pula, rodzaj).get(numer);
    if (rek === undefined) throw new Error(`Brak ${pula === "wezly" ? "węzła" : "liny"} [${rodzaj}, ${numer}]`);
    return rek;
  }

  #koniec(
    rodzajLiny: string,
    strona: "od" | "do",
    dozwolone: Koncowki,
    [id, port]: SurowyKoniec,
  ): readonly [wezel: RekordWezla, port: string | undefined] {
    const wezel = this.#rekord("wezly", id);
    const porty = Object.hasOwn(dozwolone, id[0]) ? dozwolone[id[0]] : undefined;
    const blad = (co: string) => new Error(`Lina „${rodzajLiny}”.${strona}: ${co}`);
    if (porty === undefined) throw blad(`węzeł „${id[0]}” nie jest dozwolony`);
    if (porty.length === 0 && port !== undefined) throw blad(`węzeł „${id[0]}” łączy się bez portu`);
    if (porty.length > 0 && (port === undefined || !porty.includes(port))) {
      throw blad(`port „${port}” spoza [${porty.join(", ")}]`);
    }
    return [wezel, port];
  }

  /** Szerokości numerów z liczbaCyfr() — przeliczane raz na wersję grafu. */
  #idTekst(pula: Pula, [rodzaj, numer]: IdWezla): string {
    if (this.#szerokosc?.wersja !== this.#wersja) {
      this.#szerokosc = {
        wersja: this.#wersja,
        wezly: this.#kluczeWezlow.liczbaCyfr(),
        liny: this.#kluczeLin.liczbaCyfr(),
      };
    }
    const cyfry = this.#szerokosc[pula];
    const szerokosc = this.#wyrownanie === "wspolne" ? Math.max(0, ...Object.values(cyfry)) : (cyfry[rodzaj] ?? 0);
    const tag = pula === "wezly" ? this.#def(pula, rodzaj).tag : this.#def(pula, rodzaj).tag;
    return `${tag}${String(numer).padStart(szerokosc, "0")}`;
  }

  /** Widoki są „żywe”: gettery czytają bieżący stan (strzałki domykają `this` silnika). */
  #widokWezla(rek: RekordWezla): object {
    const idTekst = () => this.#idTekst("wezly", rek.id);
    const widok: object = {
      rodzaj: rek.id[0],
      id: rek.id,
      kategorie: rek.kategorie,
      get idTekst() {
        return idTekst();
      },
      get pola() {
        return rek.pola;
      },
      auto: this.#auto(rek, "wezly", this.#k.autoWezlow.get(rek.id[0]), () => widok),
      wejscia: (...rodzaje: string[]) => this.#widokiLin(rek.wejscia, rodzaje),
      wyjscia: (...rodzaje: string[]) => this.#widokiLin(rek.wyjscia, rodzaje),
    };
    return widok;
  }

  #widokLiny(rek: RekordLiny): object {
    const idTekst = () => this.#idTekst("liny", rek.id);
    const wezel = (r: RekordWezla) => this.#widokWezla(r);
    const widok: object = {
      rodzaj: rek.id[0],
      id: rek.id,
      portOd: rek.portOd,
      portDo: rek.portDo,
      get idTekst() {
        return idTekst();
      },
      get od() {
        return wezel(rek.od);
      },
      get do() {
        return wezel(rek.do);
      },
      get pola() {
        return rek.pola;
      },
      auto: this.#auto(rek, "liny", this.#k.autoLin.get(rek.id[0]), () => widok),
    };
    return widok;
  }

  #widokiLin(liny: ReadonlySet<RekordLiny>, rodzaje: readonly string[]): object[] {
    return liny
      .values()
      .filter((l) => rodzaje.length === 0 || rodzaje.includes(l.id[0]))
      .map((l) => this.#widokLiny(l))
      .toArray();
  }

  /** Obiekt `auto`: każde pole to getter liczący leniwie, z pamięcią per wersja i wykrywaniem cykli. */
  #auto(
    rek: RekordWezla | RekordLiny,
    pula: Pula,
    definicje: ReadonlyMap<string, Funkcja> | undefined,
    widok: () => object,
  ): object {
    const auto = {};
    for (const [pole, fn] of definicje ?? []) {
      Object.defineProperty(auto, pole, {
        enumerable: true,
        get: () => this.#policz(rek, pula, pole, fn, widok),
      });
    }
    return Object.freeze(auto);
  }

  #policz(rek: RekordWezla | RekordLiny, pula: Pula, pole: string, fn: Funkcja, widok: () => object): unknown {
    let pamiec = this.#pamiecAuto.get(rek);
    if (pamiec?.wersja !== this.#wersja) {
      pamiec = { wersja: this.#wersja, wartosci: new Map() };
      this.#pamiecAuto.set(rek, pamiec);
    }
    if (pamiec.wartosci.has(pole)) return pamiec.wartosci.get(pole);

    const klucz = `${this.#idTekst(pula, rek.id)}.${pole}`;
    if (this.#liczone.includes(klucz)) {
      throw new Error(`Cykl pól automatycznych: ${[...this.#liczone, klucz].join(" → ")}`);
    }
    this.#liczone.push(klucz);
    try {
      const wartosc = wywolaj(fn, widok());
      pamiec.wartosci.set(pole, wartosc);
      return wartosc;
    } finally {
      this.#liczone.pop();
    }
  }

  /**
   * Port, który bywa tylko celem lin → strona wejść; pozostałe → strona wyjść.
   * (Set.prototype.difference — ES2025)
   */
  #stronyPortow(rodzaj: string, porty: readonly string[]): readonly [wej: string[], wyj: string[]] {
    const cele = new Set<string>();
    const zrodla = new Set<string>();
    for (const l of this.#k.liny.values()) {
      for (const p of l.do[rodzaj] ?? []) cele.add(p);
      for (const p of l.od[rodzaj] ?? []) zrodla.add(p);
    }
    const tylkoWejscia = cele.difference(zrodla);
    return [porty.filter((p) => tylkoWejscia.has(p)), porty.filter((p) => !tylkoWejscia.has(p))];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. Pomocnicze (walidacja, serializacja DOT)
// ═══════════════════════════════════════════════════════════════════════════

function sprawdzKategorie(rodzaj: string, wymiary: WymiaryKategorii, wybor: SuroweKategorie): SuroweKategorie {
  const blad = (co: string) => new Error(`Węzeł „${rodzaj}”: ${co}`);
  for (const w of Object.keys(wybor)) {
    if (!Object.hasOwn(wymiary, w)) throw blad(`nieznany wymiar kategorii „${w}”`);
  }
  const wynik: Record<string, readonly string[]> = {};
  for (const [wymiar, drzewo] of Object.entries(wymiary)) {
    const para = Object.hasOwn(wybor, wymiar) ? wybor[wymiar] : undefined;
    if (para === undefined) throw blad(`brak kategorii w wymiarze „${wymiar}”`);
    const [kategoria, podkategoria, ...reszta] = para;
    const podkategorie = kategoria !== undefined && Object.hasOwn(drzewo, kategoria) ? drzewo[kategoria] : undefined;
    if (podkategorie === undefined) throw blad(`„${wymiar}”: nieznana kategoria „${kategoria}”`);
    if (reszta.length > 0) throw blad(`„${wymiar}”: za długa krotka kategorii`);
    if (podkategorie.length === 0 && podkategoria !== undefined) {
      throw blad(`„${wymiar}/${kategoria}” nie ma podkategorii`);
    }
    if (podkategorie.length > 0 && (podkategoria === undefined || !podkategorie.includes(podkategoria))) {
      throw blad(`„${wymiar}/${kategoria}”: podkategoria „${podkategoria}” spoza [${podkategorie.join(", ")}]`);
    }
    wynik[wymiar] = Object.freeze([...para]);
  }
  return Object.freeze(wynik);
}

/**
 * Głęboka kopia wartości domyślnych: tablice i zwykłe obiekty kopiowane rekurencyjnie,
 * reszta (prymitywy, Date, Map…) przekazywana jak jest. Czysty ECMAScript — bez structuredClone,
 * który jest API hosta (HTML), a nie częścią języka.
 */
function klonuj(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(klonuj);
  if (v !== null && typeof v === "object") {
    const proto: unknown = Object.getPrototypeOf(v);
    if (proto === Object.prototype || proto === null) {
      return Object.fromEntries(Object.entries(v).map(([k, w]) => [k, klonuj(w)]));
    }
  }
  return v;
}

function scalPola(opis: string, dozwolone: object, baza: Rekord, zmiany: Rekord = {}): Rekord {
  for (const pole of Object.keys(zmiany)) {
    if (!Object.hasOwn(dozwolone, pole)) throw new Error(`${opis}: nieznane pole „${pole}”`);
  }
  return Object.freeze({ ...baza, ...zmiany });
}

const cytuj = (s: string): string => `"${s.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", "\\n")}"`;

const idDot = (s: string): string => (/^[A-Za-z_][A-Za-z_0-9]*$/.test(s) ? s : cytuj(s));

const wartoscDot = (v: WartoscDot): string => v instanceof HtmlDot ? `<${v.tresc}>` : typeof v === "string" ? cytuj(v) : String(v);

function atrybuty(a: AtrybutyDot): string {
  const pary = Object.entries(a)
    .filter((e): e is [string, WartoscDot] => e[1] !== undefined)
    .map(([k, v]) => `${idDot(k)}=${wartoscDot(v)}`);
  return pary.length > 0 ? `[${pary.join(", ")}]` : "";
}

/** "id" albo "id":"port":kompas — kompas trzyma linę przy boku komórki portu */
const koniecDot = (id: string, port: string | undefined, kompas: "n" | "e" | "s" | "w"): string => port === undefined ? cytuj(id) : `${cytuj(id)}:${cytuj(port)}:${kompas}`;

const esc = (s: string): string => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/** [treść HTML, port?] — jedna komórka tabeli */
type Komorka = readonly [tresc: string, port?: string];

/**
 * Tabela HTML-like z portami.
 *  LR: kolumny [wejścia | id + opis | wyjścia]; ostatnia komórka kolumny dostaje ROWSPAN reszty.
 *  TB: wiersze [wejścia] / id / opis… / [wyjścia]; ostatnia komórka wiersza dostaje COLSPAN reszty.
 */
function tabela(
  kierunek: "LR" | "TB",
  id: string,
  opis: readonly string[],
  wej: readonly string[],
  wyj: readonly string[],
  tlo: string | undefined,
): string {
  const port = (p: string): Komorka => [`<FONT POINT-SIZE="9">${esc(p)}</FONT>`, p];
  const srodek: Komorka[] = [[`<B>${esc(id)}</B>`], ...opis.map((o): Komorka => [esc(o)])];
  const span = kierunek === "LR" ? "ROWSPAN" : "COLSPAN";
  const td = ([tresc, p]: Komorka, rozpietosc: number) => `<TD${p === undefined ? "" : ` PORT="${esc(p)}"`}${rozpietosc > 1 ? ` ${span}="${rozpietosc}"` : ""}>${tresc}</TD>`;

  let wiersze: string[];
  if (kierunek === "LR") {
    const kolumny = [wej.map(port), srodek, wyj.map(port)].filter((k) => k.length > 0);
    const n = Math.max(...kolumny.map((k) => k.length));
    wiersze = Array.from({ length: n }, (_, r) =>
      kolumny.flatMap((k) => {
        const c = k[r];
        return c === undefined ? [] : [td(c, r === k.length - 1 ? n - r : 1)];
      }).join(""));
  } else {
    const m = Math.max(1, wej.length, wyj.length);
    const wiersz = (k: readonly Komorka[]) => k.map((c, i) => td(c, i === k.length - 1 ? m - i : 1)).join("");
    wiersze = [wej.map(port), ...srodek.map((c) => [c]), wyj.map(port)].filter((k) => k.length > 0).map(wiersz);
  }
  const bg = tlo === undefined ? "" : ` BGCOLOR="${esc(tlo)}"`;
  return `<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4"${bg}>${wiersze.map((w) => `<TR>${w}</TR>`).join("")}</TABLE>`;
}
