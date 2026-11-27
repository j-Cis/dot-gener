// @project-metadata
// Path: examples/schemat-biblioteczki.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Przykładowa dziedzina: domowa biblioteczka. Silnik o niej nie wie —
 * wszystko poniżej to deklaracja użytkownika.
 */
import { SchematGrafu } from "@/src/silnik-grafu.ts";

const KOLOR_RODZAJU = { epika: "#fff4d6", liryka: "#e9f7ef", dramat: "#fde8e8" } as const;
const KOLOR_EPOKI = { renesans: "#8e44ad", pozytywizm: "#2471a3", mloda_polska: "#c0392b" } as const;

export const schematBiblioteczki = new SchematGrafu()
	// ── 3 rodzaje węzłów ──────────────────────────────────────────────────
	.wezel( "autor", {
		tag: "A",
		porty: [ "dziela" ],
		kategorie: { epoka: { renesans: [], pozytywizm: [], mloda_polska: [] } },
		pola: { imie: "", nazwisko: "" },
	} )
	.wezel( "ksiazka", {
		tag: "K",
		porty: [ "autorzy", "miejsce" ],
		kategorie: {
			// dwa wymiary = pula kategorii; w każdym kategoria z podkategorią (albo bez)
			rodzaj: { epika: [ "powiesc", "nowela" ], liryka: [ "tren", "sonet" ], dramat: [ "tragedia", "komedia" ] },
			oprawa: { twarda: [], miekka: [] },
		},
		pola: { tytul: "" },
	} )
	.wezel( "polka", {
		tag: "P",
		porty: [ "zawartosc" ],
		kategorie: { pomieszczenie: { salon: [], gabinet: [ "regal", "biurko" ] } },
		pola: { opis: "" },
	} )
	// ── 2 rodzaje lin ─────────────────────────────────────────────────────
	.lina( "napisal", { tag: "N", od: { autor: [ "dziela" ] }, do: { ksiazka: [ "autorzy" ] } } )
	.lina( "stoi_na", {
		tag: "S",
		od: { ksiazka: [ "miejsce" ] },
		do: { polka: [ "zawartosc" ] },
		pola: { pozycja: 0 },
	} )
	// ── pola automatyczne (wynikają z połączeń) ──────────────────────────
	.autoWezla( "autor", {
		liczbaKsiazek: ( a ) => a.wyjscia( "napisal" ).length,
	} )
	.autoWezla( "ksiazka", {
		autorzy: ( k ) => k.wejscia( "napisal" ).map( ( n ) => n.od.pola.nazwisko ),
		polka: ( k ) => k.wyjscia( "stoi_na" )[0]?.do.idTekst,
	} )
	.autoWezla( "polka", {
		liczbaKsiazek: ( p ) => p.wejscia( "stoi_na" ).length,
		// dwa skoki: półka ← stoi_na ← książka.auto.autorzy
		autorzy: ( p ) => [ ...new Set( p.wejscia( "stoi_na" ).flatMap( ( s ) => s.od.auto.autorzy ) ) ].sort( ( a, b ) => a.localeCompare( b, "pl" ) ),
	} )
	.autoLiny( "napisal", {
		epoka: ( n ) => n.od.kategorie.epoka[0],
	} )
	// ── szablony DOT ──────────────────────────────────────────────────────
	.szablonWezla( "autor", ( a ) => ( {
		tlo: "#eaf2fb",
		opis: [ `${a.pola.imie} ${a.pola.nazwisko}`, a.kategorie.epoka[0], `książek: ${a.auto.liczbaKsiazek}` ],
	} ) )
	.szablonWezla( "ksiazka", ( k ) => ( {
		tlo: KOLOR_RODZAJU[k.kategorie.rodzaj[0]],
		opis: [ k.pola.tytul, k.kategorie.rodzaj.join( " / " ), `oprawa ${k.kategorie.oprawa[0]}` ],
	} ) )
	.szablonWezla( "polka", ( p ) => ( {
		tlo: "#f2f3f4",
		opis: [
			p.pola.opis,
			p.kategorie.pomieszczenie.join( " / " ),
			`książek: ${p.auto.liczbaKsiazek}`,
			p.auto.autorzy.join( ", " ),
		],
	} ) )
	.szablonLiny( "napisal", ( n ) => ( {
		atrybuty: { color: KOLOR_EPOKI[n.auto.epoka], penwidth: 1.4 },
	} ) )
	.szablonLiny( "stoi_na", ( s ) => ( {
		opis: `#${s.pola.pozycja}`,
		atrybuty: { style: "dashed", color: "#7f8c8d" },
	} ) );
