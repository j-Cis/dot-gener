// @project-metadata
// Path: examples/przyklad-drzewo.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type IdWezla, SilnikGrafu, type StanSchematu } from "@/src/silnik-grafu.ts";
import { schematDrzewa } from "./schemat-drzewa.ts";
import { zapisz } from "@/src/zapisz.ts";
export type Drzewo = SilnikGrafu<StanSchematu<typeof schematDrzewa>>;
type IdWezlaDrzewa = IdWezla<"korzen" | "lewy" | "prawy">;

/**
 * Drzewo pełne o zadanej liczbie kondygnacji pod korzeniem.
 * Kolejność tworzenia daje numerację lustrzaną: L od lewej (= iA/2), P od prawej (= iR/2).
 */
export function zbudujDrzewo( glebokosc: number ): Drzewo {
	if ( !Number.isInteger( glebokosc ) || glebokosc < 0 || glebokosc > 20 ) {
		throw new RangeError( `głębokość ${glebokosc} spoza 0…20` );
	}
	const graf = new SilnikGrafu( schematDrzewa, { wyrownanie: "wspolne" } );

	const lewe = ( rodzic: IdWezlaDrzewa ) => {
		const l = graf.dodajWezel( "lewy" );
		graf.polacz( "lewa", [ rodzic, "wyL" ], [ l, "weL" ] );
		return l;
	};
	const prawe = ( rodzic: IdWezlaDrzewa ) => {
		const p = graf.dodajWezel( "prawy" );
		graf.polacz( "prawa", [ rodzic, "wyP" ], [ p, "weP" ] );
		return p;
	};

	let kondygnacja: IdWezlaDrzewa[] = [ graf.dodajWezel( "korzen" ) ];
	for ( let k = 1; k <= glebokosc; k++ ) {
		const l = kondygnacja.map( lewe ); //                         od lewej
		const p = kondygnacja.toReversed().map( prawe ).toReversed(); // od prawej
		kondygnacja = l.flatMap( ( dziecko, i ) => [ dziecko, ...p.slice( i, i + 1 ) ] );
	}
	return graf;
}

export const opcjeDot = {
	nazwa: "GRAF",
	kierunek: "TB",
	atrybutyGrafu: { nodesep: 0.6, ranksep: 1.6 },
	atrybutyWezlow: { fontname: "Franklin Gothic Heavy" },
} as const;

// ── deno task drzewo [głębokość=3] ───────────────────────────────────────
if ( import.meta.main ) {
	const glebokosc = Number( Deno.args[0] ?? 3 );
	const graf = zbudujDrzewo( glebokosc );
	const [ nWezlow, nLin ] = graf.rozmiar();
	console.log( `głębokość ${glebokosc}: węzły ${nWezlow}, liny ${nLin}` );
	for ( const w of graf.wezly().slice( 0, 4 ) ) {
		console.log( w.idTekst, { ...w.auto } );
	}
	await zapisz( `drzewo-${glebokosc}`, graf.doDot( opcjeDot ) );
}
