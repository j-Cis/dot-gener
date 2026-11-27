// @project-metadata
// Path: examples/schemat-lasu.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Trzecia dziedzina: las (rodowód). Na razie trzy rodzaje węzłów: NK (korzeń), YA (Ojciec), XA (Matka).
 * Ojciec działa jak węzeł lewy, Matka jak prawy — wszystkie pola są automatyczne, z położenia (z lin).
 */
import { html, type HtmlDot, SchematGrafu, typ } from "@/src/silnik-grafu.ts";

/** Kolor klasy węzła — wszystkie zapowiedziane rodzaje; w schemacie na razie tylko korzen, ojciec, matka. */
export const KOLOR = {
	korzen: "#0d0d0d", //              NK
	ojciec: "#937bc5", //              YA
	matka: "#c47b7b", //               XA
	syn: "#7bc57c", //                 YZ
	corka: "#c6b47b", //               XZ
	bocznyMeski: "#593d8f", //         YH
	bocznyZenski: "#8f3d3d", //        XH
	bocznyMeskiZstepny: "#3d8f3e", //  YT
	bocznyZenskiZstepny: "#8f7b3d", // XT
} as const;

const NIEBIESKI = "#4f85d8";
const CZERWONY = "#d84e5f";

/** [początek serii, długość serii] */
type Seria = readonly [ d: number, n: number ];

/**
 * Sufiks A — liczone od lewej (awers), R — od prawej (rewers). Prefiks y — linia ojcowska, x — matczyna.
 *
 *  korzeń: iK=0, jA=1, jR=1, yA=1:0, xA=0:0, yR=0:0, xR=1:0
 *  ojciec (lina „lewa”):  iK+1, jA=2·jA,   jR=2·jR+1, yA i yR: (d rodzica):(n rodzica+1), xA=jA:0, xR=jR:0
 *  matka  (lina „prawa”): iK+1, jA=2·jA+1, jR=2·jR,   xA i xR: (d rodzica):(n rodzica+1), yA=jA:0, yR=jR:0
 *  każdy: iA = jA − 2^iK, iR = jR − 2^iK, fA = (2·iA+1) / 2^(iK+1), fR = (2·iR+1) / 2^(iK+1)
 *
 * Zapis binarny: yA = jA bez końcowych zer, xA = jA bez końcowych jedynek,
 *                yR = jR bez końcowych jedynek, xR = jR bez końcowych zer.
 * Symetria: yR węzła = xA jego lustrzanego odbicia (ojcowie ↔ matki), xR = yA odbicia.
 */
export type PolaLasu = {
	/** kondygnacja (dawne K) */
	iK: number;
	/** pozycja w kondygnacji od lewej (dawne jA) */
	iA: number;
	/** pozycja w kondygnacji od prawej (dawne jR) */
	iR: number;
	/** indeks: korzeń 1, ojciec 2·jA, matka 2·jA+1 (dawne iA) */
	jA: number;
	/** indeks lustrzany: korzeń 1, ojciec 2·jR+1, matka 2·jR (dawne iR) */
	jR: number;
	/** środek przedziału węzła w [0, 1] od lewej; binarnie 0.<bity ścieżki>1 */
	fA: number;
	/** to samo od prawej (= 1 − fA) */
	fR: number;
	/** seria linii ojcowskiej od lewej (dawne dL : nL) */
	yA: Seria;
	/** seria linii ojcowskiej od prawej */
	yR: Seria;
	/** seria linii matczynej od lewej (dawne dP : nP) */
	xA: Seria;
	/** seria linii matczynej od prawej */
	xR: Seria;
};

/** Wyjątek korzenia: druga wartość jA, jR, fA, fR. */
export type DrugieKorzenia = Readonly<Pick<PolaLasu, "jA" | "jR" | "fA" | "fR">>;

/** Rodzic = źródło jedynej liny wchodzącej. */
function rodzic<T>( wezel: { wejscia(): readonly { readonly od: T }[] } ): T {
	const [ lina ] = wezel.wejscia();
	if ( lina === undefined ) throw new Error( "węzeł lasu bez rodzica — najpierw połącz go liną" );
	return lina.od;
}

// pola liczone z własnych pól — wspólne dla wszystkich rodzajów
type ZPolami = { readonly auto: Readonly<Pick<PolaLasu, "iK" | "iA" | "iR" | "jA" | "jR">> };
const iA = ( w: ZPolami ) => w.auto.jA - 2 ** w.auto.iK;
const iR = ( w: ZPolami ) => w.auto.jR - 2 ** w.auto.iK;
const fA = ( w: ZPolami ) => ( 2 * w.auto.iA + 1 ) / 2 ** ( w.auto.iK + 1 );
const fR = ( w: ZPolami ) => ( 2 * w.auto.iR + 1 ) / 2 ** ( w.auto.iK + 1 );

export const schematLasu = new SchematGrafu()
	// ── 3 rodzaje węzłów (na razie) ───────────────────────────────────────
	.wezel( "korzen", { tag: "NK", porty: [ "wyL", "wyP" ] } )
	.wezel( "ojciec", { tag: "YA", porty: [ "weL", "wyL", "wyP" ] } )
	.wezel( "matka", { tag: "XA", porty: [ "weP", "wyL", "wyP" ] } )
	// ── 2 rodzaje lin: każdy węzeł może mieć ojca i matkę ────────────────
	.lina( "lewa", { tag: "LL", od: { korzen: [ "wyL" ], ojciec: [ "wyL" ], matka: [ "wyL" ] }, do: { ojciec: [ "weL" ] } } )
	.lina( "prawa", { tag: "LP", od: { korzen: [ "wyP" ], ojciec: [ "wyP" ], matka: [ "wyP" ] }, do: { matka: [ "weP" ] } } )
	// ── pola automatyczne ─────────────────────────────────────────────────
	.autoRekurencyjne( typ<PolaLasu>(), {
		korzen: {
			iK: () => 0,
			iA,
			iR,
			jA: () => 1,
			jR: () => 1,
			fA,
			fR,
			yA: () => [ 1, 0 ],
			yR: () => [ 0, 0 ],
			xA: () => [ 0, 0 ],
			xR: () => [ 1, 0 ],
		},
		ojciec: {
			iK: ( w ) => rodzic( w ).auto.iK + 1,
			iA,
			iR,
			jA: ( w ) => 2 * rodzic( w ).auto.jA,
			jR: ( w ) => 2 * rodzic( w ).auto.jR + 1,
			fA,
			fR,
			yA: ( w ) => [ rodzic( w ).auto.yA[0], rodzic( w ).auto.yA[1] + 1 ],
			yR: ( w ) => [ rodzic( w ).auto.yR[0], rodzic( w ).auto.yR[1] + 1 ],
			xA: ( w ) => [ w.auto.jA, 0 ],
			xR: ( w ) => [ w.auto.jR, 0 ],
		},
		matka: {
			iK: ( w ) => rodzic( w ).auto.iK + 1,
			iA,
			iR,
			jA: ( w ) => 2 * rodzic( w ).auto.jA + 1,
			jR: ( w ) => 2 * rodzic( w ).auto.jR,
			fA,
			fR,
			yA: ( w ) => [ w.auto.jA, 0 ],
			yR: ( w ) => [ w.auto.jR, 0 ],
			xA: ( w ) => [ rodzic( w ).auto.xA[0], rodzic( w ).auto.xA[1] + 1 ],
			xR: ( w ) => [ rodzic( w ).auto.xR[0], rodzic( w ).auto.xR[1] + 1 ],
		},
	} )
	// ── wyjątek: korzeń ma drugą wartość jA, jR, fA, fR ──────────────────
	.autoWezla( "korzen", {
		drugie: (): DrugieKorzenia => ( { jA: -1, jR: -1, fA: -0.5, fR: -0.5 } ),
	} )
	// ── szablony DOT ──────────────────────────────────────────────────────
	.szablonWezla( "korzen", ( w ) => ( { atrybuty: { shape: "plaintext", label: etykieta( w, KOLOR.korzen, undefined, w.auto.drugie ) } } ) )
	.szablonWezla( "ojciec", ( w ) => ( { atrybuty: { shape: "plaintext", label: etykieta( w, KOLOR.ojciec, "weL" ) } } ) )
	.szablonWezla( "matka", ( w ) => ( { atrybuty: { shape: "plaintext", label: etykieta( w, KOLOR.matka, "weP" ) } } ) )
	.szablonLiny( "lewa", () => ( { atrybuty: styl( NIEBIESKI ) } ) )
	.szablonLiny( "prawa", () => ( { atrybuty: styl( CZERWONY ) } ) );

function styl( color: string ) {
	return { style: "bold", penwidth: 5, arrowsize: 1, minlen: 1.5, color } as const;
}

/** [dziesiętnie, binarnie] */
type Zapis = readonly [ dziesietnie: string, binarnie: string ];

const bin = ( x: number ) => x.toString( 2 );
const liczba = ( x: number ): Zapis => [ `${x}`, bin( x ) ];
const seria = ( [ d, n ]: Seria ): Zapis => [ `${d} : ${n}`, `${bin( d )} : ${bin( n )}` ];
/** wartość z wyjątkiem korzenia: [pierwsza, druga] */
const dwie = ( x: number, druga: number | undefined ): Zapis => druga === undefined ? liczba( x ) : [ `[${x}, ${druga}]`, `[${bin( x )}, ${bin( druga )}]` ];

/**
 * Klasa węzła = kolorowe tło zewnętrznej części (ramka wokół białej tabeli pól).
 * Porty leżą w tej ramce: małe, jasny tekst; wejście u góry, wyjścia na dole (pod linie :n / :s).
 * Tabela: awers (A) z lewej, rewers (R) z prawej; grupy: iK iA iR | jA jR fA fR | yA yR xA xR.
 */
function etykieta(
	w: { readonly idTekst: string; readonly auto: Readonly<PolaLasu> },
	kolor: string,
	wejscie?: "weL" | "weP",
	drugie?: DrugieKorzenia,
): HtmlDot {
	const a = w.auto;
	const port = ( nazwa: string, align = "CENTER" ) => `<TD PORT="${nazwa}" ALIGN="${align}"><FONT POINT-SIZE="7" COLOR="#ffffff">${nazwa}</FONT></TD>`;
	const pusta = `<TD></TD>`;
	const szary = ( t: string ) => `<FONT POINT-SIZE="8" COLOR="#888888">${t}</FONT>`;

	/** jedna połówka wiersza: nazwa | 10 | 2 */
	const pol = ( nazwa: string, [ d, b ]: Zapis, tlo: string ) =>
		`<TD ALIGN="LEFT" BGCOLOR="${tlo}">${nazwa}</TD><TD ALIGN="RIGHT" BGCOLOR="${tlo}">${d}</TD><TD ALIGN="RIGHT" BGCOLOR="${tlo}">${b}</TD>`;
	const para = ( nA: string, zA: Zapis, nR: string, zR: Zapis, tlo: string ) => `<TR>${pol( nA, zA, tlo )}${pol( nR, zR, tlo )}</TR>`;

	const BIALE = "#ffffff";
	const SZARE = "#f2f2f2"; // tło środkowej grupy — oddziela grupy
	const pola = `<TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" CELLPADDING="3" COLOR="#cccccc" BGCOLOR="#ffffff">`
		+ `<TR><TD COLSPAN="6"><B>${w.idTekst}</B></TD></TR>`
		+ `<TR><TD></TD><TD ALIGN="RIGHT">${szary( "10" )}</TD><TD ALIGN="RIGHT">${szary( "2" )}</TD>`
		+ `<TD></TD><TD ALIGN="RIGHT">${szary( "10" )}</TD><TD ALIGN="RIGHT">${szary( "2" )}</TD></TR>`
		// grupa 1: iK, iA, iR
		+ `<TR>${pol( "iK", liczba( a.iK ), BIALE )}<TD COLSPAN="3" BORDER="0"></TD></TR>`
		+ para( "iA", liczba( a.iA ), "iR", liczba( a.iR ), BIALE )
		// grupa 2: jA, jR, fA, fR
		+ para( "jA", dwie( a.jA, drugie?.jA ), "jR", dwie( a.jR, drugie?.jR ), SZARE )
		+ para( "fA", dwie( a.fA, drugie?.fA ), "fR", dwie( a.fR, drugie?.fR ), SZARE )
		// grupa 3: yA, yR, xA, xR
		+ para( "yA", seria( a.yA ), "yR", seria( a.yR ), BIALE )
		+ para( "xA", seria( a.xA ), "xR", seria( a.xR ), BIALE )
		+ `</TABLE>`;

	return html(
		`<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="2" BGCOLOR="${kolor}">`
			+ `<TR>${pusta}${wejscie === undefined ? pusta : port( wejscie )}${pusta}</TR>`
			+ `<TR><TD COLSPAN="3" CELLPADDING="5">${pola}</TD></TR>`
			+ `<TR>${port( "wyL", "LEFT" )}${pusta}${port( "wyP", "RIGHT" )}</TR>`
			+ `</TABLE>`,
	);
}
