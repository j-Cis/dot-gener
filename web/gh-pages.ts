// @project-metadata
// Path: web/gh-pages.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Eksport statyczny (np. GitHub Pages): to, co pokazuje `deno task czytaj`, zapisane jako pliki w dist/.
 *
 *   deno task ghpages                      → dist/ dla strony pod adresem głównym "/"
 *   BAZA=/dot-gener/ deno task ghpages     → dist/ dla https://j-cis.github.io/dot-gener/
 *
 * Strony renderuje ten sam serwer (main.tsx), wywoływany w pamięci (app.request) — bez portu.
 * Różnice względem serwera, wymuszone przez hosting samych plików:
 *  - adresy od "/" w href i src dostają przedrostek BAZA (strona projektu leży pod /<repozytorium>/);
 *  - moduły klienta zapisujemy jako *.ts.js / *.tsx.js: GitHub Pages podaje .ts jako video/mp2t,
 *    a przeglądarka uruchamia moduł tylko z typem JavaScript. Import map kieruje na nie dawne adresy
 *    (@/…, /… i względne), więc kod modułów zostaje bajt w bajt taki, jak podaje serwer;
 *  - 404.html (GitHub Pages pokazuje go pod każdym nieistniejącym adresem) to odpowiedź serwera na /404.
 */
import { adresyStron, app } from "@/web/main.tsx";

const ROOT = new URL( "../", import.meta.url );
const DIST = new URL( "dist/", ROOT );
const STATYCZNE = new URL( "site/static/", ROOT );

/** Przedrostek adresów: "/" albo "/repozytorium/" — zawsze z ukośnikiem na obu końcach. */
const BAZA = `/${( Deno.env.get( "BAZA" ) ?? "" ).replace( /^\/+|\/+$/g, "" )}/`.replace( "//", "/" );

/** Importy w JS (jak IMPORT w transpile.ts): `… from "x"`, `import "x"`, `import("x")`. */
const IMPORT = /\bfrom\s*["']([^"']+)["']|\bimport\s*\(?\s*["']([^"']+)["']/g;
/** Moduły klienta, których żąda HTML: <script src="…ts"> i wyspy (data-island). */
const MODUL_W_HTML = /\s(?:src|data-island)="(\/[^"]+\.tsx?)"/g;

await Deno.remove( DIST, { recursive: true } ).catch( ( blad ) => {
	if ( !( blad instanceof Deno.errors.NotFound ) ) throw blad;
} );
const statyczne = await kopiuj( STATYCZNE, DIST );

// --- strony i 404 (HTML z serwera) ---
const strony = new Map<string, string>(); // plik w dist/ → HTML
for ( const adres of adresyStron ) {
	strony.set( adres === "/" ? "index.html" : `${adres.slice( 1 )}/index.html`, await tekst( adres, [ 200 ] ) );
}
strony.set( "404.html", await tekst( "/404", [ 404, 200 ] ) );

// --- moduły klienta: z HTML, a dalej po importach (jak buildClientGraph w transpile.ts) ---
const moduly = new Map<string, string>(); // ścieżka (np. /web/client.ts) → JS
const zHtml = new Set( [ ...strony.values() ].flatMap( ( html ) => [ ...html.matchAll( MODUL_W_HTML ) ].map( ( m ) => m[1] ?? "" ) ) );
const kolejka = [ ...zHtml ].filter( ( s ) => s !== "" );
for ( let sciezka = kolejka.pop(); sciezka !== undefined; sciezka = kolejka.pop() ) {
	if ( moduly.has( sciezka ) ) continue;
	const odp = await app.request( sciezka );
	if ( odp.status !== 200 || !odp.headers.get( "content-type" )?.startsWith( "text/javascript" ) ) {
		const opis = `${sciezka}: serwer nie podaje go jako modułu (HTTP ${odp.status})`;
		if ( zHtml.has( sciezka ) ) throw new Error( opis );
		console.warn( `pomijam ${opis}` ); // import znaleziony wyrażeniem w tekście — serwer też by go nie podał
		continue;
	}
	const js = await odp.text();
	moduly.set( sciezka, js );
	for ( const m of js.matchAll( IMPORT ) ) {
		const dep = lokalny( m[1] ?? m[2] ?? "", sciezka );
		if ( dep !== null && !moduly.has( dep ) ) kolejka.push( dep );
	}
}

// --- zapis ---
// import map: każdy moduł pod każdym adresem, pod którym przeglądarka może go zażądać → jego plik *.js
const przekierowania = Object.fromEntries(
	[ ...moduly.keys() ].flatMap( ( s ) => [ [ `@${s}`, doJs( s ) ], [ s, doJs( s ) ], [ `${BAZA}${s.slice( 1 )}`, doJs( s ) ] ] ),
);
for ( const [ plik, html ] of strony ) await zapisz( plik, przepisz( html ) );
for ( const [ sciezka, js ] of moduly ) await zapisz( `${decodeURIComponent( sciezka.slice( 1 ) )}.js`, js );
console.log( `eksport → dist/ (baza ${BAZA}) — strony: ${adresyStron.length}, 404.html, moduły klienta: ${moduly.size}, pliki statyczne: ${statyczne}` );

// ——— pomocnicze ———

/** Treść odpowiedzi serwera; inny status niż oczekiwany to błąd eksportu. */
async function tekst( sciezka: string, statusy: readonly number[] ): Promise<string> {
	const odp = await app.request( sciezka );
	if ( !statusy.includes( odp.status ) ) throw new Error( `${sciezka}: HTTP ${odp.status}, oczekiwano ${statusy.join( " lub " )}` );
	return await odp.text();
}

/** Ścieżka lokalnego modułu albo null (import map / https) — jak resolveLocal w transpile.ts. */
function lokalny( spec: string, odKogo: string ): string | null {
	if ( spec.startsWith( "@/" ) ) return spec.slice( 1 );
	if ( spec.startsWith( "/" ) ) return spec;
	if ( spec.startsWith( "./" ) || spec.startsWith( "../" ) ) return new URL( spec, `http://x${odKogo}` ).pathname;
	return null;
}

/** Adres pliku *.js w dist/ dla ścieżki modułu. */
function doJs( sciezka: string ): string {
	return `${BAZA}${sciezka.slice( 1 )}.js`;
}

/** HTML z serwera → HTML dla dist/: import map z BAZA i *.js, adresy od "/" z przedrostkiem BAZA. */
function przepisz( html: string ): string {
	let mapy = 0;
	const wynik = html
		.replace( /(<script type="importmap">)(.*?)(<\/script>)/s, ( _, otwarcie: string, json: string, zamkniecie: string ) => {
			mapy++;
			const mapa: { imports: Record<string, string> } = JSON.parse( json );
			mapa.imports = { ...mapa.imports, "@/": BAZA, ...przekierowania };
			return otwarcie + JSON.stringify( mapa ) + zamkniecie;
		} )
		.replace( /(\s(?:href|src)=")(\/(?!\/)[^"]*)"/g, ( _, atrybut: string, sciezka: string ) => {
			return `${atrybut}${moduly.has( sciezka ) ? doJs( sciezka ) : BAZA + sciezka.slice( 1 )}"`;
		} );
	if ( mapy !== 1 ) throw new Error( `oczekiwano jednej <script type="importmap"> na stronie, jest ${mapy}` );
	return wynik;
}

async function zapisz( plik: string, tresc: string ): Promise<void> {
	const url = new URL( plik, DIST );
	await Deno.mkdir( new URL( "./", url ), { recursive: true } );
	await Deno.writeTextFile( url, tresc );
}

/** Kopiuje katalog rekurencyjnie; zwraca liczbę plików. */
async function kopiuj( z: URL, dokad: URL ): Promise<number> {
	await Deno.mkdir( dokad, { recursive: true } );
	let ile = 0;
	for await ( const wpis of Deno.readDir( z ) ) {
		const nazwa = encodeURIComponent( wpis.name );
		if ( wpis.isDirectory ) ile += await kopiuj( new URL( `${nazwa}/`, z ), new URL( `${nazwa}/`, dokad ) );
		else if ( wpis.isFile ) {
			await Deno.copyFile( new URL( nazwa, z ), new URL( nazwa, dokad ) );
			ile++;
		}
	}
	return ile;
}
