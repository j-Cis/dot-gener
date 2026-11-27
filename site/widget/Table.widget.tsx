// @project-metadata
// Path: site/widget/Table.widget.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { ComponentChildren } from "preact";
import { cx } from "@/site/common/css/cx.ts";

/**
 * Siatka (CSS grid) z oknem przewijania. Najpierw deklarujesz kolumny i wiersze (ich liczbę i rozmiary),
 * potem kładziesz na siatce obszary: Box (dowolny prostokąt komórek), Row (cały wiersz), Col (cała kolumna).
 *
 *   <Table cols={["4fr", "1fr", "1fr", "4fr"]} rows={["auto", "auto", { max: "20rem" }]} gapX="0.5rem" gapY="0.5rem">
 *     <Box start={[1, 1]} headerShow="N" headerLabel="SYSTEM">…</Box>
 *     <Box start={[2, 1]} end={[3, 2]}>…</Box>          ← kolumny 2–3, wiersze 1–2 (koniec włącznie)
 *     <Row row={3} headerShow="W" headerLabel="DENO" headerDisplay={["center", -90]}>…</Row>
 *     <Col col={4}>…</Col>
 *   </Table>
 *
 * Wymiary całej tabeli:
 *   width  — domyślnie "100%"; większa (np. "150%", "1200px") → przewijanie w poziomie.
 *   height — domyślnie tyle, ile trzeba; podana (np. "30rem") → przewijanie w pionie.
 * Numery kolumn i wierszy liczymy od 1. Box/Row/Col muszą być bezpośrednimi dziećmi Table (fragmenty <>…</> są w porządku).
 * Wiele jednakowych kolumn: cols={powtorz(12, "max")}.
 */

/** Długość CSS: "12px", "1.5rem", "40%", "60ch" … */
export type Dlugosc = `${number}${"px" | "rem" | "em" | "ch" | "ex" | "%" | "vw" | "vh"}`;

/** Rozmiar „auto, ale nie mniejszy niż min i/lub nie większy niż max” (co najmniej jedna granica). */
export type Granice = { readonly min: Dlugosc; readonly max?: Dlugosc } | { readonly min?: Dlugosc; readonly max: Dlugosc };

/**
 * Rozmiar wiersza:
 *   "auto"            — według treści
 *   "20px", "30%" …   — stały (% liczy się od height tabeli; bez height działa jak "auto")
 *   { min, max }      — auto w granicach
 *   "min"             — minimalny wymagany (min-content)
 *   "fill1"           — wysokość ekranu między listwami (GuideBar u góry, FootBar u dołu);
 *                       "fill2" — dwa takie ekrany, "fill0.5" — pół
 */
export type RozmiarWiersza = "auto" | "min" | Dlugosc | Granice | Wypelnienie;

/** Wielokrotność wysokości ekranu między listwami — tylko dla wierszy. */
export type Wypelnienie = `fill${number}`;

/**
 * Rozmiar kolumny — jak wiersza, a do tego:
 *   "max"             — maksymalny dostępny: cała reszta szerokości (dzielona po równo z innymi "max")
 *   "2fr", "0.5fr" …  — jak "max", ale z wagą (np. "4fr" dostaje 4 razy więcej niż "1fr")
 * Uwaga: kolumny w % nie odliczają odstępów — 40% + 60% + gapX wystaje poza tabelę; do podziału z odstępami użyj "fr".
 */
export type RozmiarKolumny = Exclude<RozmiarWiersza, Wypelnienie> | "max" | `${number}fr`;

/** Co najmniej jeden element. */
type Niepusta<T> = readonly [ T, ...T[] ];

/**
 * `n` jednakowych rozmiarów — do cols i rows:
 *   cols={powtorz(12, "max")}                  ← 12 równych kolumn
 *   cols={["12rem", ...powtorz(3, "max")]}     ← stała + 3 równe
 *   rows={powtorz(4, "auto")}
 *   rows={powtorz(3, "fill1")}                 ← 3 wiersze, każdy na wysokość ekranu
 * Typ zachowuje rozmiar, więc rows={powtorz(2, "max")} jest błędem kompilacji jak ["max", "max"],
 * a cols={powtorz(2, "fill1")} jak ["fill1", "fill1"].
 */
export function powtorz<const R extends RozmiarKolumny | RozmiarWiersza>( n: number, rozmiar: R ): Niepusta<R> {
	if ( !Number.isInteger( n ) || n < 1 ) throw new RangeError( `Table: powtorz(n) wymaga liczby całkowitej ≥ 1, jest ${n}` );
	return [ rozmiar, ...Array.from( { length: n - 1 }, () => rozmiar ) ];
}

export interface TableProps {
	/** kolumny siatki: ich liczba i rozmiary */
	cols: Niepusta<RozmiarKolumny>;
	/** wiersze siatki: ich liczba i rozmiary */
	rows: Niepusta<RozmiarWiersza>;
	/** szerokość siatki; domyślnie "100%", większa → przewijanie w poziomie */
	width?: Dlugosc;
	/** wysokość okna; bez niej tabela ma wysokość treści, z nią → przewijanie w pionie */
	height?: Dlugosc;
	/** odstęp poziomy (między kolumnami) */
	gapX?: Dlugosc;
	/** odstęp pionowy (między wierszami) */
	gapY?: Dlugosc;
	/** dodatkowe klasy okna (.tabela) */
	class?: string;
	children?: ComponentChildren;
}

export function Table( { cols, rows, width = "100%", height, gapX, gapY, class: klasa, children }: TableProps ) {
	const siatka = [
		`width: ${width}`,
		// z podaną wysokością siatka wypełnia okno (wtedy wiersze w % mają od czego się liczyć)
		height !== undefined && "height: 100%",
		`grid-template-columns: ${cols.map( sciezka ).join( " " )}`,
		`grid-template-rows: ${rows.map( sciezka ).join( " " )}`,
		gapX !== undefined && `column-gap: ${gapX}`,
		gapY !== undefined && `row-gap: ${gapY}`,
	].filter( Boolean ).join( "; " );
	return (
		<div class={cx( "tabela", klasa )} style={height === undefined ? undefined : `height: ${height}`}>
			<div class="tabela-siatka" style={siatka}>{children}</div>
		</div>
	);
}

/**
 * Wysokość ekranu między listwami: --listwa-gora i --listwa-dol ustawia web/listwy.ts
 * (wysokości elementów [data-listwa]); bez listew (albo bez JS) to cała wysokość okna.
 */
const EKRAN = "(100dvh - var(--listwa-gora, 0px) - var(--listwa-dol, 0px))";

/** Rozmiar → ścieżka grid-template-*. */
function sciezka( r: RozmiarKolumny | RozmiarWiersza ): string {
	if ( typeof r === "object" ) return `minmax(${r.min ?? "auto"}, ${r.max ?? "auto"})`;
	if ( r === "min" ) return "min-content";
	if ( r.startsWith( "fill" ) ) {
		const n = Number( r.slice( 4 ) );
		if ( !( n > 0 ) ) throw new RangeError( `Table: "${r}" — po "fill" liczba > 0, np. "fill1"` );
		return n === 1 ? `calc${EKRAN}` : `calc(${EKRAN} * ${n})`;
	}
	// minmax(0, …): reszta miejsca, ale długa treść (np. kod) nie rozpycha kolumny — przewija się w komórce
	if ( r === "max" ) return "minmax(0, 1fr)";
	if ( r.endsWith( "fr" ) ) return `minmax(0, ${r})`;
	return r;
}

// ——— Box, Row, Col ———

/** Strona, po której stoi nagłówek: N (góra), S (dół), E (prawo), W (lewo). */
export type Strona = "N" | "S" | "E" | "W";
/** Położenie nagłówka wzdłuż jego krawędzi. */
export type Polozenie = "start" | "center" | "end";
/** Obrót napisu: 0 (poziomo), 90 (o 90° w prawo), -90 (o 90° w lewo). */
export type Obrot = 0 | 90 | -90;
/** "center" albo ["center", -90]; domyślnie ["start", 0]. */
export type HeaderDisplay = Polozenie | readonly [ polozenie: Polozenie, obrot: Obrot ];

/** Nagłówek obszaru: albo bez nagłówka, albo headerShow + headerLabel (oba wymagane). */
type Naglowek =
	| { headerShow?: never; headerLabel?: never; headerDisplay?: never; headerClass?: never }
	| {
		/** po której stronie obszaru stoi nagłówek */
		headerShow: Strona;
		/** treść nagłówka (tekst albo np. <strong>…</strong>) */
		headerLabel: ComponentChildren;
		/** położenie (start/center/end) i obrót (0/90/-90) */
		headerDisplay?: HeaderDisplay;
		/** dodatkowe klasy nagłówka */
		headerClass?: string;
	};

interface Wspolne {
	/** dodatkowe klasy obszaru (.tabela-box) */
	class?: string;
	children?: ComponentChildren;
}

/** Komórka siatki: [kolumna, wiersz], liczone od 1. */
export type Komorka = readonly [ kolumna: number, wiersz: number ];
/** Jeden numer albo zakres [pierwszy, ostatni] (włącznie). */
export type Zakres = number | readonly [ pierwszy: number, ostatni: number ];

/**
 * Obszar od komórki `start` do komórki `end` (włącznie). Bez `end` — jedna komórka;
 * bez `start` — przeglądarka kładzie obszar w następnej wolnej komórce.
 */
export type BoxProps = Wspolne & Naglowek & ({ start?: never; end?: never } | { start: Komorka; end?: Komorka });
/** Cały wiersz (albo kilka: row={[2, 3]}) na pełną szerokość siatki. */
export type RowProps = Wspolne & Naglowek & { row: Zakres };
/** Cała kolumna (albo kilka: col={[1, 2]}) na pełną wysokość siatki. */
export type ColProps = Wspolne & Naglowek & { col: Zakres };

export function Box( props: BoxProps ) {
	const { start, end = start } = props;
	if ( start === undefined || end === undefined ) return obszar( props, undefined );
	return obszar( props, `grid-column: ${linie( [ start[0], end[0] ] )}; grid-row: ${linie( [ start[1], end[1] ] )}` );
}

export function Row( props: RowProps ) {
	return obszar( props, `grid-column: 1 / -1; grid-row: ${linie( props.row )}` );
}

export function Col( props: ColProps ) {
	return obszar( props, `grid-row: 1 / -1; grid-column: ${linie( props.col )}` );
}

/** Zakres numerów (włącznie, od 1, w dowolnej kolejności) → linie siatki "od / do+1". */
function linie( z: Zakres ): string {
	const [ a, b ] = typeof z === "number" ? [ z, z ] : z;
	for ( const n of [ a, b ] ) {
		if ( !Number.isInteger( n ) || n < 1 ) throw new RangeError( `Table: numer kolumny/wiersza musi być liczbą całkowitą ≥ 1, jest ${n}` );
	}
	return `${Math.min( a, b )} / ${Math.max( a, b ) + 1}`;
}

function obszar( { class: klasa, children, headerShow, headerLabel, headerDisplay = "start", headerClass }: Wspolne & Naglowek, pozycja: string | undefined ) {
	const [ polozenie, obrot ] = typeof headerDisplay === "string" ? [ headerDisplay, 0 ] : headerDisplay;
	return (
		<div class={cx( "tabela-box", headerShow && `tabela-box-${headerShow}`, klasa )} style={pozycja}>
			{headerShow && (
				<div class={cx( "tabela-naglowek", `tabela-naglowek-${polozenie}`, headerClass )}>
					<span class={cx( "tabela-naglowek-tekst", obrot === 90 && "tabela-obrot-prawo", obrot === -90 && "tabela-obrot-lewo" )}>{headerLabel}</span>
				</div>
			)}
			<div class="tabela-tresc">{children}</div>
		</div>
	);
}
