// @project-metadata
// Path: web/main.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type Context, Hono } from "@hono/hono";
import { renderToString } from "preact-render-to-string";
import type { ComponentType, VNode } from "preact";
import { plikiStatyczne } from "@/web/staticfiles.ts";
// przełącznik: deno.json → ./transpile.ts (@deno/loader), ende.json → ./transpile-ende.ts (tsgo)
import { transpileForBrowser } from "@transpilacja";
import { PageShell } from "@/web/page-shell.tsx";
import { Error404PageNotFound } from "@/web/404.tsx";
import { PRZELADUJ, strumien } from "@/web/refresh.ts";
import { cssStrony, osieroconeCss } from "@/web/style.ts";

export const app = new Hono();
if ( PRZELADUJ ) app.get( "/__przeladuj", strumien );

const page = ( title: string, body: VNode, css: string ) => "<!DOCTYPE html>" + renderToString( <PageShell title={title} css={css}>{body}</PageShell> );

// --- pages (SSR): każdy site/routes/**/index.tsx to strona, a jego katalog to adres ---
//   site/routes/index.tsx                  → /
//   site/routes/dokumentacja/index.tsx     → /dokumentacja   (i /dokumentacja/)
//   site/routes/a/b/index.tsx              → /a/b
// Nowy katalog z index.tsx = nowa strona; serwer skanuje przy starcie (--watch=site/ restartuje go po zmianie).
const PAGES = new URL( "../site/routes/", import.meta.url );

/** Moduł strony: domyślny eksport to komponent; opcjonalny `export const tytul = "…"` to <title>. */
interface ModulStrony {
	readonly default: ComponentType;
	readonly tytul?: string;
}

/** [adres, plik] każdego index.tsx w katalogu i podkatalogach. */
async function* znajdzStrony( katalog: URL, adres: string ): AsyncGenerator<readonly [ adres: string, plik: URL ]> {
	for await ( const wpis of Deno.readDir( katalog ) ) {
		if ( wpis.isFile && wpis.name === "index.tsx" ) yield [ adres === "" ? "/" : adres, new URL( "index.tsx", katalog ) ];
		else if ( wpis.isDirectory ) yield* znajdzStrony( new URL( `${encodeURIComponent( wpis.name )}/`, katalog ), `${adres}/${wpis.name}` );
	}
}

const strony = ( await Array.fromAsync( znajdzStrony( PAGES, "" ) ) ).toSorted( ( [ a ], [ b ] ) => a.localeCompare( b ) );
for ( const [ adres, plik ] of strony ) {
	const modul: ModulStrony = await import( plik.href );
	if ( typeof modul.default !== "function" ) throw new Error( `${plik.pathname}: brak domyślnego eksportu komponentu strony` );
	const { default: Strona, tytul = "LEKTURA" } = modul;
	// CSS: baza + widgety z grafu importów tej strony + index.css obok index.tsx (web/style.ts)
	const css = await cssStrony( plik, new URL( "index.css", plik ) );
	const obsluga = ( c: Context ) => c.html( page( tytul, <Strona />, css ) );
	app.get( adres, obsluga );
	if ( adres !== "/" ) app.get( `${adres}/`, obsluga );
}

export const adresyStron = strony.map( ( [ adres ] ) => adres );
console.log( `pages: ${adresyStron.join( " " )}` );
for ( const css of await osieroconeCss() ) console.warn( `${css}: brak pliku .tsx o tej samej nazwie — ten CSS nie trafi na żadną stronę` );

// --- 404: wszystko, czego nie obsłużyły strony, transpilacja ani pliki statyczne → mapa stron ---
const css404 = await cssStrony( new URL( "./404.tsx", import.meta.url ) );
app.notFound( ( c ) => c.html( page( "404 — nie ma takiej strony", <Error404PageNotFound adres={c.req.path} strony={adresyStron} />, css404 ), 404 ) );

// --- client .ts/.tsx (client.ts, islands and what they import) ---
app.get( "*", ( c, next ) => {
	const js = transpileForBrowser( c.req.path );
	if ( js === null ) return next();
	return c.body( js, 200, {
		"content-type": "text/javascript; charset=utf-8",
		"cache-control": "no-cache",
	} );
} );

// --- static files: site/static/ (względem tego pliku, nie katalogu roboczego) ---
app.get( "*", plikiStatyczne( new URL( "../site/static/", import.meta.url ) ) );

export default { fetch: app.fetch } satisfies Deno.ServeDefaultExport;
