// @project-metadata
// Path: tests/testy-typow.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Testy na poziomie typów — plik tylko się kompiluje (tsc), nie jest uruchamiany.
 * Każde @ts-expect-error MUSI wywołać błąd; jeśli błąd zniknie, tsc zgłosi nieużytą dyrektywę.
 */
import { type IdWezla, SchematGrafu, SilnikGrafu, type StanSchematu, typ, type WidokLiny, type WidokWezla } from "@/src/silnik-grafu.ts";
import { schematBiblioteczki } from "@/examples/schemat-biblioteczki.ts";
import { type PolaDrzewa, schematDrzewa } from "@/examples/schemat-drzewa.ts";

type Rowne<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
type Oczekuj<T extends true> = T;

type S = StanSchematu<typeof schematBiblioteczki>;
const g = new SilnikGrafu( schematBiblioteczki );

const a = g.dodajWezel( "autor", { kategorie: { epoka: [ "pozytywizm" ] }, pola: { nazwisko: "Prus" } } );
const k = g.dodajWezel( "ksiazka", { kategorie: { rodzaj: [ "epika", "powiesc" ], oprawa: [ "twarda" ] } } );
const p = g.dodajWezel( "polka", { kategorie: { pomieszczenie: [ "salon" ] } } );
const n = g.polacz( "napisal", [ a, "dziela" ], [ k, "autorzy" ] );
g.polacz( "stoi_na", [ k, "miejsce" ], [ p, "zawartosc" ], { pola: { pozycja: 1 } } );

// ── typy wynikowe ─────────────────────────────────────────────────────────
export type T1 = Oczekuj<Rowne<typeof a, IdWezla<"autor">>>;
export type T2 = Oczekuj<Rowne<WidokWezla<S, "ksiazka">["pola"], { readonly tytul: string }>>;
export type T3 = Oczekuj<
	Rowne<
		WidokWezla<S, "ksiazka">["kategorie"]["rodzaj"],
		| readonly [ kategoria: "epika", podkategoria: "powiesc" | "nowela" ]
		| readonly [ kategoria: "liryka", podkategoria: "tren" | "sonet" ]
		| readonly [ kategoria: "dramat", podkategoria: "tragedia" | "komedia" ]
	>
>;
export type T4 = Oczekuj<
	Rowne<
		WidokWezla<S, "polka">["kategorie"]["pomieszczenie"],
		readonly [ kategoria: "salon" ] | readonly [ kategoria: "gabinet", podkategoria: "regal" | "biurko" ]
	>
>;
// pola auto: typ = ReturnType funkcji
export type T5 = Oczekuj<
	Rowne<WidokWezla<S, "ksiazka">["auto"], { readonly autorzy: string[]; readonly polka: `P${number}` | undefined }>
>;
export type T6 = Oczekuj<
	Rowne<WidokLiny<S, "napisal">["auto"], { readonly epoka: "renesans" | "pozytywizm" | "mloda_polska" }>
>;
export type T7 = Oczekuj<Rowne<WidokLiny<S, "napisal">["portOd"], "dziela">>;
export type T8 = Oczekuj<Rowne<WidokWezla<S, "autor">["idTekst"], `A${number}`>>;

// widok bez argumentu = unia rozróżniana po `rodzaj`
for ( const w of g.wezly() ) {
	if ( w.rodzaj === "ksiazka" ) {
		const t: string = w.pola.tytul;
		void t;
	}
}
const od: WidokWezla<S, "autor"> = g.lina( n ).od;
void od;

// ── dodajWezel ────────────────────────────────────────────────────────────
// @ts-expect-error — podkategoria spoza kategorii
g.dodajWezel( "ksiazka", { kategorie: { rodzaj: [ "epika", "tren" ], oprawa: [ "twarda" ] } } );
// @ts-expect-error — „twarda” nie ma podkategorii
g.dodajWezel( "ksiazka", { kategorie: { rodzaj: [ "epika", "powiesc" ], oprawa: [ "twarda", "x" ] } } );
// @ts-expect-error — brak wymaganego wymiaru „oprawa”
g.dodajWezel( "ksiazka", { kategorie: { rodzaj: [ "epika", "powiesc" ] } } );
// @ts-expect-error — kategorie są wymagane, więc i argument
g.dodajWezel( "ksiazka" );
// @ts-expect-error — nieznane pole
g.dodajWezel( "polka", { kategorie: { pomieszczenie: [ "salon" ] }, pola: { isbn: "1" } } );
// @ts-expect-error — zły typ pola
g.dodajWezel( "polka", { kategorie: { pomieszczenie: [ "salon" ] }, pola: { opis: 5 } } );
// @ts-expect-error — nieznany rodzaj
g.dodajWezel( "owoc", {} );

// ── polacz ────────────────────────────────────────────────────────────────
// @ts-expect-error — port innego węzła
g.polacz( "napisal", [ a, "zawartosc" ], [ k, "autorzy" ] );
// @ts-expect-error — półka nie może być źródłem „napisal”
g.polacz( "napisal", [ p, "zawartosc" ], [ k, "autorzy" ] );
// @ts-expect-error — odwrócony kierunek
g.polacz( "napisal", [ k, "autorzy" ], [ a, "dziela" ] );
// @ts-expect-error — brak wymaganego portu
g.polacz( "napisal", [ a ], [ k, "autorzy" ] );
// @ts-expect-error — „napisal” nie ma pól
g.polacz( "napisal", [ a, "dziela" ], [ k, "autorzy" ], { pola: { pozycja: 1 } } );

// ── odczyt i zapis ────────────────────────────────────────────────────────
// @ts-expect-error — pola w widoku są tylko do odczytu
g.wezel( a ).pola.imie = "x";
// @ts-expect-error — pola automatyczne są tylko do odczytu
g.wezel( a ).auto.liczbaKsiazek = 3;
// @ts-expect-error — do autora nie wchodzi żadna „napisal”
g.wezel( a ).wejscia( "napisal" );
// @ts-expect-error — id liny to nie id węzła
g.wezel( n );
// @ts-expect-error — ustawPola zna tylko pola wpisywane
g.ustawPola( a, { liczbaKsiazek: 3 } );

// ── schemat ───────────────────────────────────────────────────────────────
const baza = new SchematGrafu().wezel( "a", { tag: "A", porty: [ "p" ] } ).wezel( "b", { tag: "B" } );

// @ts-expect-error — tag zajęty
baza.wezel( "c", { tag: "A" } );
// @ts-expect-error — rodzaj zajęty
baza.wezel( "a", { tag: "C" } );
// @ts-expect-error — tag kończy się cyfrą
baza.wezel( "c", { tag: "C1" } );
// @ts-expect-error — nieistniejący port
baza.lina( "l", { tag: "L", od: { a: [ "q" ] }, do: { b: [] } } );
// @ts-expect-error — nieistniejący rodzaj węzła
baza.lina( "l", { tag: "L", od: { a: [ "p" ] }, do: { zz: [] } } );
// @ts-expect-error — tag liny koliduje z tagiem węzła
baza.lina( "l", { tag: "B", od: { a: [ "p" ] }, do: { b: [] } } );
// @ts-expect-error — auto dla nieznanego rodzaju
baza.autoWezla( "zz", {} );

// węzeł bez kategorii i pól → argument danych jest opcjonalny; węzeł bez portów łączy się krotką [id]
const g2 = new SilnikGrafu( baza.lina( "l", { tag: "L", od: { a: [ "p" ] }, do: { b: [] } } ) );
const b1 = g2.dodajWezel( "b" );
g2.polacz( "l", [ g2.dodajWezel( "a" ), "p" ], [ b1 ] );
export type T9 = Oczekuj<Rowne<WidokLiny<StanSchematu<typeof g2>, "l">["portDo"], undefined>>;
// @ts-expect-error — węzeł bez pól nie przyjmuje żadnych zmian
g2.ustawPola( b1, { cokolwiek: 1 } );

// ── przykład 2: drzewo — autoRekurencyjne i końce lin z unią rodzajów ─────
type SD = StanSchematu<typeof schematDrzewa>;
export type T10 = Oczekuj<Rowne<WidokWezla<SD, "lewy">["auto"], { readonly [P in keyof PolaDrzewa]: PolaDrzewa[P] }>>;
export type T11 = Oczekuj<Rowne<WidokWezla<SD, "korzen">["auto"], WidokWezla<SD, "prawy">["auto"]>>;

const gd = new SilnikGrafu( schematDrzewa );
const rodzicU: IdWezla<"korzen" | "lewy" | "prawy"> = gd.dodajWezel( "korzen" );
const lw = gd.dodajWezel( "lewy" );
gd.polacz( "lewa", [ rodzicU, "wyL" ], [ lw, "weL" ] ); // każdy z trzech rodzajów ma port wyL
// @ts-expect-error — „wyP” to port liny prawej
gd.polacz( "lewa", [ rodzicU, "wyP" ], [ lw, "weL" ] );
const celU: IdWezla<"lewy" | "prawy"> = lw;
// @ts-expect-error — „prawy” nie przyjmuje liny lewej
gd.polacz( "lewa", [ rodzicU, "wyL" ], [ celU, "weL" ] );

const ab = new SchematGrafu().wezel( "a", { tag: "A" } ).wezel( "b", { tag: "B" } );
ab.autoRekurencyjne( typ<{ x: number; y: number }>(), {
	a: { x: () => 1, y: ( w ) => w.auto.x + 1 },
	b: { x: () => 2, y: () => 0 },
} );
// @ts-expect-error — „b” nie definiuje pola y
ab.autoRekurencyjne( typ<{ x: number; y: number }>(), { a: { x: () => 1, y: () => 2 }, b: { x: () => 1 } } );
// @ts-expect-error — zły typ wyniku pola x
ab.autoRekurencyjne( typ<{ x: number }>(), { a: { x: () => "1" } } );
// @ts-expect-error — nieznany rodzaj węzła
ab.autoRekurencyjne( typ<{ x: number }>(), { zz: { x: () => 1 } } );
// @ts-expect-error — pole spoza zadeklarowanego typu
ab.autoRekurencyjne( typ<{ x: number }>(), { a: { x: ( w ) => w.auto.z } } );
// @ts-expect-error — pole rekurencyjne ma typ number, nie any
export const nieAny: string = gd.wezel( lw ).auto.K;
