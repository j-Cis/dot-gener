// @project-metadata
// Path: site/screen/Loci.render.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type ComponentChildren, toChildArray, type VNode } from "preact";
import { Loci } from "@/site/common/lang/loci/tags.ts";
import type { LOCIBodyProps } from "@/site/common/lang/loci/element/LOCIBodyElement.ts";
import { type Dziecko, type LociModel, lociModel, type ZnacznikDziecka } from "@/site/screen/loci/interpreter/model.ts";
import type { CanvasDrawContext } from "@/site/screen/canvas/draw-context.ts";
import { renderLociSvg } from "@/site/screen/loci/render-svg.tsx";
import { drawLociCanvas } from "@/site/screen/loci/render-canvas.ts";

/**
 * LOCI na wyspach: interpreter i render. Znaczniki <Loci.…> są w site/common/lang/loci/tags.ts;
 * tu lociModelZJsx czyta je i buduje model (interpreter: site/screen/loci/interpreter/),
 * a lociSvg albo lociCanvas go rysuje (render: site/screen/loci/).
 */

/** Atrybuty znacznika body w JSX: atrybuty + dzieci. */
type BodyJsx = LOCIBodyProps & { children?: ComponentChildren };

/** Znacznik JSX dziecka → nazwa znacznika w modelu. */
const DZIECI: ReadonlyMap<unknown, ZnacznikDziecka> = new Map<unknown, ZnacznikDziecka>( [
	[ Loci.p, "p" ],
	[ Loci.csax, "csax" ],
	[ Loci.csbi, "csbi" ],
	[ Loci.fn, "fn" ],
	[ Loci.var, "var" ],
] );

/** Źródło JSX (dzieci VectorViewport) → model. Oczekuje dokładnie jednego <Loci.body>. */
export function lociModelZJsx( zrodlo: ComponentChildren ): LociModel {
	const korzenie = elementy( zrodlo, "źródle" );
	const [ korzen ] = korzenie;
	if ( korzenie.length !== 1 || korzen === undefined || korzen.type !== Loci.body ) {
		throw new Error( `LOCI: źródło to jeden znacznik <Loci.body>, jest: ${korzenie.map( ( k ) => `<${nazwa( k )}>` ).join( ", " ) || "nic"}` );
	}
	const { children, ...atrybuty } = korzen.props as unknown as BodyJsx;
	const dzieci = elementy( children, "<Loci.body>" ).map( ( d ): Dziecko => {
		const znacznik = DZIECI.get( d.type );
		if ( znacznik === undefined ) throw new Error( `LOCI: nieznany znacznik <${nazwa( d )}> w <Loci.body>` );
		// atrybuty pasują do znacznika: sprawdził je kompilator przy <Loci.…> w szablonie
		return [ znacznik, d.props ] as unknown as Dziecko;
	} );
	return lociModel( atrybuty, dzieci );
}

/** Model → SVG. */
export function lociSvg( m: LociModel ) {
	return renderLociSvg( m );
}

/** Model → Canvas; `dane` to model. */
export function lociCanvas( c: CanvasDrawContext ): void {
	drawLociCanvas( c );
}

/** Elementy JSX z dzieci; pusty tekst pomija, inny tekst to błąd. */
function elementy( dzieci: ComponentChildren, gdzie: string ): VNode[] {
	return toChildArray( dzieci ).filter( ( d ): d is VNode => {
		if ( typeof d === "object" ) return true;
		if ( String( d ).trim() === "" ) return false;
		throw new Error( `LOCI: tekst „${String( d ).trim()}” w ${gdzie} — tu są tylko znaczniki` );
	} );
}

/** Nazwa znacznika do komunikatów: "Loci.body", "g", "Inny" … */
function nazwa( v: VNode ): string {
	if ( typeof v.type === "string" ) return v.type;
	const klucz = Object.entries( Loci ).find( ( [ , f ] ) => f === v.type )?.[0];
	return klucz === undefined ? ( v.type as { name?: string } ).name || "?" : `Loci.${klucz}`;
}
