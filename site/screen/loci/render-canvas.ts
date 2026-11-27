// @project-metadata
// Path: site/screen/loci/render-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { CanvasDrawContext } from "@/site/screen/canvas/draw-context.ts";
import type { LociModel } from "./interpreter/model.ts";
import type { Zakres } from "./interpreter/types.ts";
import { doBrzegu } from "./interpreter/geometry.ts";
import { KIERUNKI_POLOSI, type ModelCsax } from "./interpreter/csax.ts";
import type { ModelP } from "./interpreter/p.ts";
import type { WygladLinii, WygladPolosi, WygladPunktu } from "./interpreter/body.ts";
import { GROT, KRESKI, odcinkiSymbolu } from "./render-wspolne.ts";

/**
 * Model LOCI → Canvas (para dla renderLociSvg z render-svg.tsx). Scena zaczyna się w lewym górnym
 * rogu zakresu; oś Y w górę przez scale(1, -1). Rozmiary konstrukcyjne w px ekranu: dzielone przez
 * view.s (bieżące powiększenie).
 */
export function drawLociCanvas( { ctx, view, dane }: CanvasDrawContext ): void {
	const m = dane as LociModel | undefined;
	if ( !m ) return;
	const [ minX, , , maxY ] = m.zakres;

	ctx.save();
	ctx.translate( -minX, maxY );
	ctx.scale( 1, -1 );
	for ( const cs of m.csax ) csaxCanvas( ctx, view.s, cs, m.zakres, m.polosie, m.punkt );
	for ( const p of m.p ) pCanvas( ctx, view.s, p, m.punkt );
	ctx.restore();
}

/** csax: półosie do brzegu zakresu i punkt w początku, w wyglądzie z body. */
function csaxCanvas( ctx: CanvasRenderingContext2D, s: number, cs: ModelCsax, zakres: Zakres, polosie: WygladPolosi, punkt: WygladPunktu ): void {
	ctx.save();
	ctx.translate( cs.poczatek[0], cs.poczatek[1] );
	ctx.rotate( ( cs.kat * Math.PI ) / 180 );
	polosie.forEach( ( wyglad, i ) => {
		const kier = KIERUNKI_POLOSI[i] ?? 0;
		polosCanvas( ctx, s, kier, doBrzegu( cs.poczatek, cs.kat + kier, zakres ), wyglad );
	} );
	punktCanvas( ctx, s, punkt );
	ctx.restore();
}

/** p: punkt konstrukcyjny w swoim położeniu, w wyglądzie z body. */
function pCanvas( ctx: CanvasRenderingContext2D, s: number, p: ModelP, wyglad: WygladPunktu ): void {
	ctx.save();
	ctx.translate( p.polozenie[0], p.polozenie[1] );
	punktCanvas( ctx, s, wyglad );
	ctx.restore();
}

/** Półoś z bieżącego (0,0) pod kątem `kier` (stopnie). */
function polosCanvas( ctx: CanvasRenderingContext2D, s: number, kier: number, dlugosc: number, [ kolor, grubosc, styl, grot ]: WygladLinii ): void {
	ctx.save();
	ctx.rotate( ( kier * Math.PI ) / 180 );
	ctx.strokeStyle = kolor;
	ctx.lineWidth = grubosc / s;
	ctx.setLineDash( KRESKI[styl].map( ( k ) => k / s ) );
	ctx.beginPath();
	ctx.moveTo( 0, 0 );
	ctx.lineTo( dlugosc, 0 );
	ctx.stroke();
	if ( grot > 0 ) {
		const [ gd, gs ] = GROT;
		ctx.translate( dlugosc, 0 );
		ctx.scale( grot / s, grot / s );
		ctx.fillStyle = kolor;
		ctx.beginPath();
		ctx.moveTo( 0, 0 );
		ctx.lineTo( -gd, gs / 2 );
		ctx.lineTo( -gd, -gs / 2 );
		ctx.closePath();
		ctx.fill();
	}
	ctx.restore();
}

/** Punkt konstrukcyjny w bieżącym (0,0), w px ekranu. */
function punktCanvas( ctx: CanvasRenderingContext2D, s: number, [ symbol, wielkosc, kolor ]: WygladPunktu ): void {
	ctx.save();
	ctx.scale( 1 / s, 1 / s );
	ctx.strokeStyle = kolor;
	ctx.fillStyle = kolor;
	ctx.lineWidth = 1;
	ctx.setLineDash( [] );
	if ( symbol === "circle" || symbol === "dot" ) {
		ctx.beginPath();
		ctx.arc( 0, 0, symbol === "dot" ? wielkosc / 4 : wielkosc / 2, 0, Math.PI * 2 );
		if ( symbol === "dot" ) ctx.fill();
		else ctx.stroke();
	}
	ctx.beginPath();
	for ( const [ x1, y1, x2, y2 ] of odcinkiSymbolu( symbol, wielkosc ) ) {
		ctx.moveTo( x1, y1 );
		ctx.lineTo( x2, y2 );
	}
	ctx.stroke();
	ctx.restore();
}
