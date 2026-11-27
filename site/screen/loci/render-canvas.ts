// @project-metadata
// Path: site/screen/loci/render-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { CanvasDrawContext } from "@/site/client/VectorViewport.island.tsx";
import type { LociModel } from "@/site/common/lang/loci/model.ts";
import type { Zakres } from "@/site/common/lang/loci/shared/types.ts";
import { doBrzegu } from "@/site/common/lang/loci/shared/geometry.ts";
import { KIERUNKI_POLOSI, type LOCIAxElement } from "@/site/common/lang/loci/element/frame/LOCIAxElement.ts";
import type { WygladLinii } from "@/site/common/lang/loci/attribute/LOCIAxisProps.ts";
import type { WygladPunktu } from "@/site/common/lang/loci/attribute/LOCIPointProps.ts";
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
	for ( const ax of m.ax ) axCanvas( ctx, view.s, ax, m.zakres );
	ctx.restore();
}

/** ax: półosie do brzegu zakresu i punkt w początku. */
function axCanvas( ctx: CanvasRenderingContext2D, s: number, ax: LOCIAxElement, zakres: Zakres ): void {
	ctx.save();
	ctx.translate( ax.poczatek[0], ax.poczatek[1] );
	ctx.rotate( ( ax.kat * Math.PI ) / 180 );
	ax.polosie.forEach( ( wyglad, i ) => {
		const kier = KIERUNKI_POLOSI[i] ?? 0;
		polosCanvas( ctx, s, kier, doBrzegu( ax.poczatek, ax.kat + kier, zakres ), wyglad );
	} );
	punktCanvas( ctx, s, ax.punkt );
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
