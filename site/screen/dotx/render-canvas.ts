// @project-metadata
// Path: site/screen/dotx/render-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { CanvasDrawContext } from "@/site/screen/canvas/draw-context.ts";
import type { PositionedGraph } from "@/site/common/lang/dotx/model.ts";

/** Graf DOTX z wyliczonym układem → Canvas (para dla renderDotxSvg z render-svg.tsx). */
export function drawDotxCanvas( { ctx, dane }: CanvasDrawContext ): void {
	const g = dane as PositionedGraph | undefined;
	if ( !g ) return;

	// 1. Klastry
	for ( const c of g.clusters ) {
		ctx.save();
		ctx.fillStyle = c.attrs.fill ?? "rgba(0,0,0,0.03)";
		ctx.strokeStyle = c.attrs.stroke ?? "#999";
		ctx.setLineDash( [ 4, 3 ] );
		ctx.fillRect( c.x, c.y, c.w, c.h );
		ctx.strokeRect( c.x, c.y, c.w, c.h );
		ctx.restore();
	}

	// 2. Krawędzie
	for ( const e of g.edges ) {
		const [ p0, p1 ] = e.points;
		if ( !p0 || !p1 ) continue;
		ctx.save();
		ctx.strokeStyle = e.attrs.stroke ?? "#333";
		ctx.lineWidth = 1.5;
		if ( e.attrs.dashed ) ctx.setLineDash( [ 4, 3 ] );
		ctx.beginPath();
		ctx.moveTo( p0[0], p0[1] );
		ctx.lineTo( p1[0], p1[1] );
		ctx.stroke();

		if ( g.mode === "digraph" ) {
			const ang = Math.atan2( p1[1] - p0[1], p1[0] - p0[0] );
			const len = 8;
			ctx.fillStyle = e.attrs.stroke ?? "#333";
			ctx.beginPath();
			ctx.moveTo( p1[0], p1[1] );
			ctx.lineTo(
				p1[0] - len * Math.cos( ang - 0.4 ),
				p1[1] - len * Math.sin( ang - 0.4 ),
			);
			ctx.lineTo(
				p1[0] - len * Math.cos( ang + 0.4 ),
				p1[1] - len * Math.sin( ang + 0.4 ),
			);
			ctx.closePath();
			ctx.fill();
		}
		ctx.restore();
	}

	// 3. Węzły + kafelki values + porty
	for ( const n of g.nodes ) {
		const hasCells = n.cells.length > 0;
		const stroke = n.attrs.stroke ?? "#333";

		ctx.fillStyle = n.attrs.fill ?? "#fff";
		ctx.strokeStyle = stroke;
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.roundRect(
			n.x,
			n.y,
			n.w,
			n.h,
			n.attrs.shape === "box" || hasCells ? 6 : 22,
		);
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = n.attrs.color ?? "#111";
		ctx.font = `${hasCells ? "700" : "400"} 13px Arial, sans-serif`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(
			n.attrs.label ?? n.id,
			n.x + n.w / 2,
			hasCells ? n.y + 15 : n.y + n.h / 2,
		);

		// Kafelki values
		for ( const c of n.cells ) {
			ctx.fillStyle = "#e5e7eb";
			ctx.fillRect( c.x, c.y, c.w, c.keyH );

			ctx.fillStyle = "#ffffff";
			ctx.fillRect( c.x, c.y + c.keyH, c.w, c.h - c.keyH );

			ctx.strokeStyle = "#9ca3af";
			ctx.lineWidth = 0.75;
			ctx.beginPath();
			ctx.moveTo( c.x, c.y + c.keyH );
			ctx.lineTo( c.x + c.w, c.y + c.keyH );
			ctx.stroke();

			ctx.strokeStyle = "#6b7280";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.roundRect( c.x, c.y, c.w, c.h, 2 );
			ctx.stroke();

			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#374151";
			ctx.font = "600 10px Arial, sans-serif";
			ctx.fillText( c.key, c.x + c.w / 2, c.y + c.keyH / 2 );

			ctx.fillStyle = "#111827";
			ctx.font = "700 12px Arial, sans-serif";
			ctx.fillText( c.value, c.x + c.w / 2, c.y + c.keyH + ( c.h - c.keyH ) / 2 );
		}

		// Porty
		for ( const p of n.ports ) {
			if ( p.shape === "none" ) continue;
			ctx.fillStyle = p.fill ?? "#fff";
			ctx.strokeStyle = p.stroke ?? stroke;
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			if ( p.shape === "diamond" ) {
				ctx.moveTo( p.x, p.y - p.size );
				ctx.lineTo( p.x + p.size, p.y );
				ctx.lineTo( p.x, p.y + p.size );
				ctx.lineTo( p.x - p.size, p.y );
				ctx.closePath();
			} else if ( p.shape === "rect" ) {
				ctx.roundRect( p.x - p.size, p.y - p.size, p.size * 2, p.size * 2, 2 );
			} else {
				ctx.arc( p.x, p.y, p.size, 0, Math.PI * 2 );
			}
			ctx.fill();
			ctx.stroke();

			if ( p.label ) {
				ctx.fillStyle = p.color ?? "#111";
				ctx.font = "700 9px Arial, sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText( p.label, p.x, p.y );
			}
		}
	}
}
