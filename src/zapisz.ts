// @project-metadata
// Path: src/zapisz.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Zapis wyników do katalogu `generated/` (obok `src/`):
 *   generated/<nazwa>.dot — zawsze,
 *   generated/<nazwa>.svg — gdy w systemie jest Graphviz (`dot`); bez niego tylko ostrzeżenie.
 * Uprawnienia: --allow-write=generated --allow-run=dot
 */

const KATALOG = new URL( "../generated/", import.meta.url );

/** [plik .dot, plik .svg albo undefined, gdy brak Graphviza] */
export type Zapisane = readonly [ dot: URL, svg: URL | undefined ];

export async function zapisz( nazwa: string, dot: string ): Promise<Zapisane> {
	// sama nazwa: bez ukośników i „..”, więc zapis nie wyjdzie poza generated/
	if ( !/^[\p{L}\p{N}_-][\p{L}\p{N}_.-]*$/u.test( nazwa ) ) {
		throw new Error( `niepoprawna nazwa pliku „${nazwa}” — dozwolone litery, cyfry, „_”, „-”, „.”` );
	}
	await Deno.mkdir( KATALOG, { recursive: true } );

	const plikDot = new URL( `${nazwa}.dot`, KATALOG );
	await Deno.writeTextFile( plikDot, dot );

	const svg = await doSvg( dot );
	if ( svg === undefined ) {
		console.log( `zapisano generated/${nazwa}.dot (bez SVG)` );
		return [ plikDot, undefined ];
	}
	const plikSvg = new URL( `${nazwa}.svg`, KATALOG );
	await Deno.writeFile( plikSvg, svg );
	console.log( `zapisano generated/${nazwa}.dot i generated/${nazwa}.svg` );
	return [ plikDot, plikSvg ];
}

/** `dot -Tsvg` przez Deno.Command; undefined, gdy Graphviza nie ma w PATH. */
async function doSvg( dot: string ): Promise<Uint8Array | undefined> {
	let proces: Deno.ChildProcess;
	try {
		proces = new Deno.Command( "dot", { args: [ "-Tsvg" ], stdin: "piped", stdout: "piped", stderr: "piped" } ).spawn();
	} catch ( blad ) {
		if ( blad instanceof Deno.errors.NotFound ) {
			console.warn( "brak programu „dot” (Graphviz) w PATH — pomijam SVG" );
			return undefined;
		}
		throw blad;
	}
	const pisarz = proces.stdin.getWriter();
	await pisarz.write( new TextEncoder().encode( dot ) );
	await pisarz.close();

	const { code, stdout, stderr } = await proces.output();
	const komunikaty = new TextDecoder().decode( stderr ).trim();
	if ( code !== 0 ) throw new Error( `dot zakończył się kodem ${code}: ${komunikaty}` );
	if ( komunikaty !== "" ) console.warn( `dot: ${komunikaty}` );
	return stdout;
}
