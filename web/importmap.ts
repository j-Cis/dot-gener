// @project-metadata
// Path: web/importmap.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Import map dla przeglądarki — bez npm. Adresy bierzemy z deno.json („imports”),
 * więc przeglądarka i serwer używają tych samych modułów w tych samych wersjach,
 * a wersje zmienia się w jednym miejscu.
 */
import konfiguracja from "../deno.json" with { type: "json" };

/** Specyfikatory, których może używać kod w przeglądarce (client.ts, wyspy i to, co importują). */
const DLA_PRZEGLADARKI = [
	"preact",
	"preact/",
	"@preact/signals",
	"@preact/signals/",
	"@preact/signals-core",
	"@preact/signals-core/",
	"highlight.js/",
] as const;

const importy: Readonly<Record<string, string>> = konfiguracja.imports;

/** Adres https:// z deno.json; przeglądarka nie rozumie jsr:/npm:, więc to błąd konfiguracji. */
function adres( spec: string ): string {
	const url = importy[spec];
	if ( url === undefined || !url.startsWith( "https://" ) ) {
		throw new Error( `deno.json „imports”: „${spec}” musi wskazywać adres https:// (jest: ${url})` );
	}
	return url;
}

/** <script type="importmap"> content. */
export const IMPORT_MAP = {
	imports: {
		"@/": "/",
		...Object.fromEntries( DLA_PRZEGLADARKI.map( ( spec ) => [ spec, adres( spec ) ] ) ),
	},
};

/** Arkusz KaTeX z tego samego pakietu co na serwerze; czcionki ładują się względem niego. */
export const KATEX_CSS = new URL( "dist/katex.min.css", adres( "katex/" ) ).href;
