// @project-metadata
// Path: site/screen/Loci.render.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type ComponentChildren, toChildArray, type VNode } from "preact";
import { type LOCIDziecko, type LociModel, lociModel, type LOCIZnacznik } from "@/site/common/lang/loci/model.ts";
import type { LOCIBodyProps } from "@/site/common/lang/loci/element/LOCIBodyElement.ts";
import type { LOCIPProps } from "@/site/common/lang/loci/element/datum/LOCIPElement.ts";
import type { LOCIAxProps } from "@/site/common/lang/loci/element/datum/LOCIAxElement.ts";
import type { LOCIBiProps } from "@/site/common/lang/loci/element/datum/LOCIBiElement.ts";
import type { LOCIFnProps } from "@/site/common/lang/loci/element/def/LOCIFnElement.ts";
import type { LOCIVarProps } from "@/site/common/lang/loci/element/def/LOCIVarElement.ts";
import type { CanvasDrawContext } from "@/site/screen/canvas/draw-context.ts";
import { renderLociSvg } from "@/site/screen/loci/render-svg.tsx";
import { drawLociCanvas } from "@/site/screen/loci/render-canvas.ts";

/**
 * Klocki LOCI jako znaczniki JSX — do używania w szablonach jak <div>:
 *
 *   <VectorViewport renderer="SVG" sourceFormat="LOCI">
 *     <Loci.body axId="ax0">
 *       <Loci.p id="p2" xy="3,4" />
 *       <Loci.var id="t0" val="1/3" />
 *     </Loci.body>
 *   </VectorViewport>
 *
 * Znaczniki same nic nie rysują: lociModelZJsx czyta ich atrybuty i buduje model (site/common/lang/loci),
 * a rysuje go lociSvg albo lociCanvas (części w site/screen/loci/).
 */

/** Atrybuty znacznika body w JSX: atrybuty klocka + dzieci. */
type BodyJsx = LOCIBodyProps & { children?: ComponentChildren };

function body( _props: BodyJsx ): null {
	return null;
}
function p( _props: LOCIPProps ): null {
	return null;
}
function ax( _props: LOCIAxProps ): null {
	return null;
}
function bi( _props: LOCIBiProps ): null {
	return null;
}
function fn( _props: LOCIFnProps ): null {
	return null;
}
function varTag( _props: LOCIVarProps ): null {
	return null;
}

/** Znaczniki LOCI. Zwykły obiekt (nie funkcja), żeby podpowiedź po `<Loci.` pokazywała tylko znaczniki. */
export const Loci = {
	/** Klocek główny: cały rysunek; atrybuty: wygląd konstrukcji i id układu podstawowego. */
	body,
	/** Punkt konstrukcyjny: <Loci.p id="p2" in="ax0" xy="3,4" />, <Loci.p id="p3" r="5" deg="30" />, <Loci.p id="p4" fn="spiral" at="t0" />. */
	p,
	/** Układ odniesienia ax (kartezjański i biegunowy): <Loci.ax id="ax1" at="p0" thru="p1" />. */
	ax,
	/** Układ bipolarny: <Loci.bi id="bi0" at="p0,p1" />. */
	bi,
	/** Funkcja parametru: <Loci.fn id="spiral" param="t" x="…" y="…" /> albo <Loci.fn id="arc" param="k" r="5" turn="k/6" />. */
	fn,
	/** Zmienna: <Loci.var id="t0" val="1/3" />. */
	var: varTag,
} as const;

/** Znacznik JSX dziecka → nazwa znacznika w modelu. */
const DZIECI: ReadonlyMap<unknown, LOCIZnacznik> = new Map<unknown, LOCIZnacznik>( [
	[ Loci.p, "p" ],
	[ Loci.ax, "ax" ],
	[ Loci.bi, "bi" ],
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
	const dzieci = elementy( children, "<Loci.body>" ).map( ( d ): LOCIDziecko => {
		const znacznik = DZIECI.get( d.type );
		if ( znacznik === undefined ) throw new Error( `LOCI: nieznany znacznik <${nazwa( d )}> w <Loci.body>` );
		// atrybuty pasują do znacznika: sprawdził je kompilator przy <Loci.…> w szablonie
		return [ znacznik, d.props ] as unknown as LOCIDziecko;
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
