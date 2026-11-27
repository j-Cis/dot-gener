// @project-metadata
// Path: tests/testy.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { assertEquals, assertMatch, assertThrows } from "@std/assert";
import { SchematGrafu, SilnikGrafu, typ } from "@/src/silnik-grafu.ts";
import { schematBiblioteczki } from "@/examples/schemat-biblioteczki.ts";
import { zbudujBiblioteczke } from "@/examples/przyklad-biblioteczka.ts";
import { opcjeDot, zbudujDrzewo } from "@/examples/przyklad-drzewo.ts";
import { KRAWEDZIE_WZORU, WEZLY_WZORU } from "@/examples/tester-wzoru-drzewa.ts";
import { roznice, WEZLY_WZORU as WEZLY_WZORU_LASU, wierszSilnika } from "@/examples/tester-wzoru-lasu.ts";
import { zbudujLas } from "@/examples/przyklad-lasu.ts";

/** assertThrows + dopasowanie komunikatu wzorcem */
function rzuca( fn: () => unknown, wzorzec: RegExp ): void {
	const blad = assertThrows( fn, Error );
	assertMatch( blad.message, wzorzec );
}

/** dot -Tsvg przez Deno.Command → [svg, stderr, kod wyjścia] */
async function renderuj( dot: string ): Promise<readonly [ svg: string, stderr: string, kod: number ]> {
	const proces = new Deno.Command( "dot", { args: [ "-Tsvg" ], stdin: "piped", stdout: "piped", stderr: "piped" } )
		.spawn();
	const pisarz = proces.stdin.getWriter();
	await pisarz.write( new TextEncoder().encode( dot ) );
	await pisarz.close();
	const { code, stdout, stderr } = await proces.output();
	const tekst = new TextDecoder();
	return [ tekst.decode( stdout ), tekst.decode( stderr ), code ];
}

const prosty = new SchematGrafu()
	.wezel( "x", { tag: "X", porty: [ "we", "wy" ] } )
	.wezel( "y", { tag: "Y" } )
	.lina( "l", { tag: "L", od: { x: [ "wy" ] }, do: { x: [ "we" ], y: [] } } )
	.autoWezla( "x", { stopien: ( w ) => w.wejscia().length + w.wyjscia().length } );

Deno.test("padding rośnie razem z rejestrem (liczbaCyfr)", () => {
	const g = new SilnikGrafu( prosty );
	const pierwszy = g.dodajWezel( "x" );
	for ( let i = 0; i < 8; i++ ) g.dodajWezel( "x" );
	assertEquals( g.wezel( pierwszy ).idTekst, "X1" );
	g.dodajWezel( "x" ); // 10.
	assertEquals( g.wezel( pierwszy ).idTekst, "X01" );
	for ( let i = 0; i < 90; i++ ) g.dodajWezel( "x" ); // 100.
	assertEquals( g.wezel( pierwszy ).idTekst, "X001" );
	// inny rodzaj ma własną szerokość
	assertEquals( g.wezel( g.dodajWezel( "y" ) ).idTekst, "Y1" );
});

Deno.test("wyrównanie wspólne: jedna szerokość w puli węzłów", () => {
	const g = new SilnikGrafu( prosty, { wyrownanie: "wspolne" } );
	for ( let i = 0; i < 12; i++ ) g.dodajWezel( "x" );
	assertEquals( g.wezel( g.dodajWezel( "y" ) ).idTekst, "Y01" );
});

Deno.test("pola auto: leniwe, z pamięcią unieważnianą przy każdej zmianie", () => {
	const g = new SilnikGrafu( prosty );
	const [ a, b ] = [ g.dodajWezel( "x" ), g.dodajWezel( "x" ) ];
	const widok = g.wezel( a );
	assertEquals( widok.auto.stopien, 0 );
	g.polacz( "l", [ a, "wy" ], [ b, "we" ] );
	assertEquals( widok.auto.stopien, 1, "ten sam widok widzi nowy stan" );
	g.polacz( "l", [ b, "wy" ], [ a, "we" ] );
	assertEquals( { ...g.wezel( a ).auto }, { stopien: 2 }, "pola auto są wyliczalne (enumerable)" );
});

Deno.test("pola auto przez dwa skoki + ustawPola przelicza zależności", () => {
	const g = new SilnikGrafu( schematBiblioteczki );
	const a = g.dodajWezel( "autor", { kategorie: { epoka: [ "pozytywizm" ] }, pola: { nazwisko: "Prus" } } );
	const k = g.dodajWezel( "ksiazka", { kategorie: { rodzaj: [ "epika", "powiesc" ], oprawa: [ "twarda" ] } } );
	const p = g.dodajWezel( "polka", { kategorie: { pomieszczenie: [ "salon" ] } } );
	g.polacz( "napisal", [ a, "dziela" ], [ k, "autorzy" ] );
	g.polacz( "stoi_na", [ k, "miejsce" ], [ p, "zawartosc" ] );
	assertEquals( g.wezel( p ).auto.autorzy, [ "Prus" ] );
	g.ustawPola( a, { nazwisko: "Głowacki" } );
	assertEquals( g.wezel( p ).auto.autorzy, [ "Głowacki" ] );
	assertEquals( g.wezel( k ).auto.polka, "P1" );
});

Deno.test("wartości domyślne pól są kopiowane, nie współdzielone", () => {
	const s = new SchematGrafu().wezel( "w", { tag: "W", pola: { tagi: [] as string[] } } );
	const g = new SilnikGrafu( s );
	const [ x, y ] = [ g.dodajWezel( "w" ), g.dodajWezel( "w" ) ];
	( g.wezel( x ).pola.tagi as string[] ).push( "a" );
	assertEquals( g.wezel( y ).pola.tagi, [] );
});

Deno.test("cykl pól auto jest wykrywany (możliwy tylko z obejściem typów)", () => {
	const s = new SchematGrafu()
		.wezel( "w", { tag: "W" } )
		.lina( "l", { tag: "L", od: { w: [] }, do: { w: [] } } )
		// typy pozwalają sięgać tylko po wcześniej zdefiniowane pola auto — tu celowo je obchodzimy
		.autoWezla( "w", { a: ( w ): unknown => Reflect.get( w.wyjscia()[0]?.do.auto ?? {}, "a" ) } );
	const g = new SilnikGrafu( s );
	const [ x, y ] = [ g.dodajWezel( "w" ), g.dodajWezel( "w" ) ];
	g.polacz( "l", [ x ], [ y ] );
	g.polacz( "l", [ y ], [ x ] );
	rzuca( () => g.wezel( x ).auto.a, /Cykl pól automatycznych: W1\.a → W2\.a → W1\.a/ );
});

Deno.test("walidacja w runtime (gdy typy obejdzie JS albo rzutowanie)", () => {
	const g = new SilnikGrafu( schematBiblioteczki ) as unknown as {
		dodajWezel( r: string, d?: unknown ): readonly [ string, number ];
		polacz( r: string, od: unknown, do_: unknown, d?: unknown ): unknown;
	};
	rzuca(
		() => g.dodajWezel( "ksiazka", { kategorie: { rodzaj: [ "epika", "tren" ], oprawa: [ "twarda" ] } } ),
		/podkategoria „tren”/,
	);
	rzuca(
		() => g.dodajWezel( "ksiazka", { kategorie: { rodzaj: [ "epika", "powiesc" ] } } ),
		/brak kategorii w wymiarze „oprawa”/,
	);
	rzuca(
		() => g.dodajWezel( "polka", { kategorie: { pomieszczenie: [ "salon" ] }, pola: { isbn: 1 } } ),
		/nieznane pole „isbn”/,
	);
	const a = g.dodajWezel( "autor", { kategorie: { epoka: [ "renesans" ] } } );
	const p = g.dodajWezel( "polka", { kategorie: { pomieszczenie: [ "salon" ] } } );
	rzuca( () => g.polacz( "napisal", [ a, "zle" ], [ p, "zawartosc" ] ), /port „zle”/ );
	rzuca( () => g.polacz( "napisal", [ a, "dziela" ], [ p, "zawartosc" ] ), /węzeł „polka” nie jest dozwolony/ );
	rzuca( () => g.polacz( "napisal", [ [ "autor", 99 ], "dziela" ], [ p ] ), /Brak węzła \[autor, 99\]/ );
});

Deno.test("walidacja schematu w runtime", () => {
	const s = new SchematGrafu().wezel( "a", { tag: "A" } ) as unknown as {
		wezel( r: string, d: object ): unknown;
		lina( r: string, d: object ): unknown;
	};
	rzuca( () => s.wezel( "b", { tag: "A" } ), /tag „A” jest już zajęty/ );
	rzuca( () => s.wezel( "b", { tag: "B7" } ), /nie może kończyć się cyfrą/ );
	rzuca( () => s.wezel( "a", { tag: "C" } ), /Rodzaj „a” jest już zajęty/ );
	rzuca( () => s.lina( "l", { tag: "L", od: { a: [ "p" ] }, do: { a: [] } } ), /nie ma portu „p”/ );
	rzuca( () => s.lina( "l", { tag: "L", od: {}, do: { a: [] } } ), /brak dozwolonych węzłów/ );
});

Deno.test("schemat jest niemutowalny — gałęzie buildera nie przeciekają", () => {
	const baza = new SchematGrafu().wezel( "a", { tag: "A" } );
	const g1 = new SilnikGrafu( baza.wezel( "b", { tag: "B" } ) );
	const g2 = new SilnikGrafu( baza ) as unknown as { dodajWezel( r: string ): unknown };
	assertEquals( g1.wezel( g1.dodajWezel( "b" ) ).idTekst, "B1" );
	rzuca( () => g2.dodajWezel( "b" ), /Nieznany rodzaj węzła „b”/ );
});

Deno.test("DOT: porty z kompasem, id lin, poprawny dla Graphviza", async () => {
	const g = new SilnikGrafu( prosty );
	const [ a, b, c ] = [ g.dodajWezel( "x" ), g.dodajWezel( "x" ), g.dodajWezel( "y" ) ];
	g.polacz( "l", [ a, "wy" ], [ b, "we" ] );
	g.polacz( "l", [ b, "wy" ], [ c ] );
	const lr = g.doDot( { nazwa: 'z "cudzysłowem"' } );
	assertMatch( lr, /^digraph "z \\"cudzysłowem\\"" \{/ );
	assertMatch( lr, /"X1":"wy":e -> "X2":"we":w \[id="L1"\];/ );
	assertMatch( lr, /"X2":"wy":e -> "Y1" \[id="L2"\];/ );
	const tb = g.doDot( { kierunek: "TB" } );
	assertMatch( tb, /"X1":"wy":s -> "X2":"we":n/ );
	for ( const dot of [ lr, tb ] ) {
		const [ svg, stderr, kod ] = await renderuj( dot );
		assertEquals( [ kod, stderr ], [ 0, "" ] );
		assertMatch( svg, /<svg/ );
	}
});

Deno.test("DOT: przykład biblioteczki renderuje się bez ostrzeżeń", async () => {
	const graf = zbudujBiblioteczke();
	assertEquals( graf.rozmiar(), [ 22, 28 ] );
	const [ , stderr, kod ] = await renderuj( graf.doDot( { nazwa: "biblioteczka" } ) );
	assertEquals( [ kod, stderr ], [ 0, "" ] );
});

// ═══ przykład 2: drzewo ════════════════════════════════════════════════════

Deno.test("drzewo: pola automatyczne zgodne ze wzorem (15 węzłów)", () => {
	const graf = zbudujDrzewo( 3 );
	assertEquals( graf.rozmiar(), [ 15, 14 ] );
	for ( const [ wzor, rodzaj, numer, pola ] of WEZLY_WZORU ) {
		assertEquals( { ...graf.wezel( [ rodzaj, numer ] ).auto }, pola, wzor );
	}
});

Deno.test("drzewo: liny i porty zgodne ze wzorem (14 krawędzi)", () => {
	const graf = zbudujDrzewo( 3 );
	const naId = new Map( WEZLY_WZORU.map( ( [ wzor, rodzaj, numer ] ) => [ wzor, graf.wezel( [ rodzaj, numer ] ).idTekst ] ) );
	const oczekiwane = KRAWEDZIE_WZORU.map( ( [ od, po, do_, pd ] ) => `${naId.get( od )}:${po} -> ${naId.get( do_ )}:${pd}` );
	const faktyczne = graf.liny().map( ( l ) => `${l.od.idTekst}:${l.portOd} -> ${l.do.idTekst}:${l.portDo}` );
	assertEquals( faktyczne.toSorted(), oczekiwane.toSorted() );
});

Deno.test("drzewo: padding wspólny rośnie z rejestrem (głębokość 4 → 2 cyfry)", () => {
	const graf = zbudujDrzewo( 4 );
	assertEquals( graf.wezly( "korzen" ).map( ( w ) => w.idTekst ), [ "K01" ] );
	assertEquals(
		graf.wezly( "lewy" ).map( ( w ) => w.idTekst ),
		Array.from( { length: 15 }, ( _, i ) => `L${String( i + 1 ).padStart( 2, "0" )}` ),
	);
	assertEquals( graf.wezly( "prawy" ).at( -1 )?.idTekst, "P15" );
});

Deno.test("drzewo: dL, dP, nL, nP, iA+iR zgodne z zapisem binarnym iA (do głębokości 8)", () => {
	const graf = zbudujDrzewo( 8 );
	for ( const { auto: a, idTekst } of graf.wezly() ) {
		const bity = a.iA.toString( 2 );
		const koncoweZera = bity.length - bity.replace( /0+$/, "" ).length;
		const koncoweJedynki = bity.length - bity.replace( /1+$/, "" ).length;
		assertEquals( a.dL, parseInt( bity.replace( /0+$/, "" ), 2 ), idTekst );
		assertEquals( a.dP, parseInt( bity.replace( /1+$/, "" ) || "0", 2 ), idTekst );
		assertEquals( a.nL, koncoweZera, idTekst );
		assertEquals( a.nP, Math.min( koncoweJedynki, a.K ), idTekst );
		assertEquals( a.iA + a.iR, 3 * 2 ** a.K - 1, idTekst );
	}
});

Deno.test("drzewo: DOT renderuje się bez ostrzeżeń", async () => {
	const dot = zbudujDrzewo( 3 ).doDot( opcjeDot );
	assertMatch( dot, /"K1":"wyL":s -> "L1":"weL":n \[id="LL1"/ );
	const [ , stderr, kod ] = await renderuj( dot );
	assertEquals( [ kod, stderr ], [ 0, "" ] );
});

Deno.test("autoRekurencyjne: węzeł bez rodzica i niespójne zestawy pól", () => {
	const graf = zbudujDrzewo( 0 );
	const sierota = graf.dodajWezel( "lewy" );
	rzuca( () => graf.wezel( sierota ).auto.K, /bez rodzica/ );

	const s = new SchematGrafu().wezel( "a", { tag: "A" } ).wezel( "b", { tag: "B" } ) as unknown as {
		autoRekurencyjne( t: unknown, d: object ): unknown;
	};
	rzuca(
		() => s.autoRekurencyjne( typ(), { a: { x: () => 1, y: () => 2 }, b: { x: () => 1 } } ),
		/„b” ma pola \[x\], a „a” \[x, y\]/,
	);
});

// ═══ przykład 3: las ═══════════════════════════════════════════════════════

Deno.test("las: pola automatyczne zgodne ze wzorem (tester-wzoru-lasu.ts)", async ( t ) => {
	const graf = zbudujLas( 3 );
	assertEquals( graf.rozmiar()[0], WEZLY_WZORU_LASU.length, "wzór obejmuje wszystkie węzły grafu" );
	for ( const wiersz of WEZLY_WZORU_LASU ) {
		// osobny krok na węzeł: raport pokazuje każdy niezgodny węzeł, nie tylko pierwszy
		await t.step( wiersz[0], () => assertEquals( roznice( wiersz, wierszSilnika( graf, wiersz ) ), [] ) );
	}
});
