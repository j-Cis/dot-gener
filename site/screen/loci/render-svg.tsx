// @project-metadata
// Path: site/screen/loci/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LociModel } from "@/site/common/lang/loci/model.ts";
import type { Zakres } from "@/site/common/lang/loci/shared/types.ts";
import { doBrzegu } from "@/site/common/lang/loci/shared/geometry.ts";
import { KIERUNKI_POLOSI, type LOCIAxElement } from "@/site/common/lang/loci/element/frame/LOCIAxElement.ts";
import type { WygladLinii } from "@/site/common/lang/loci/attribute/LOCIAxisProps.ts";
import type { WygladPunktu } from "@/site/common/lang/loci/attribute/LOCIPointProps.ts";
import { GROT, KRESKI, odcinkiSymbolu } from "./render-wspolne.ts";

/**
 * Model LOCI → SVG (para dla drawLociCanvas z render-canvas.ts). Oś Y w górę: cały rysunek
 * w <g transform="scale(1,-1)">. Rozmiary konstrukcyjne w px ekranu: VectorViewport ustawia
 * na treści --vv-s (bieżące powiększenie), a tu dzieli się przez nie.
 */
export function renderLociSvg( m: LociModel ) {
	const [ minX, minY, maxX, maxY ] = m.zakres;
	const w = maxX - minX, h = maxY - minY;
	return (
		<svg
			class="loci"
			xmlns="http://www.w3.org/2000/svg"
			width={w}
			height={h}
			viewBox={`${minX} ${-maxY} ${w} ${h}`}
			style={{ overflow: "visible" }}
		>
			<g transform="scale(1,-1)">
				{m.ax.map( ( ax ) => <AxSvg key={ax.id} ax={ax} zakres={m.zakres} /> )}
			</g>
		</svg>
	);
}

/** px ekranu → długość CSS w jednostkach rysunku. */
const px = ( n: number ) => `calc(${n}px / var(--vv-s, 1))`;
/** Skala elementu rysowanego w px ekranu (do `transform`). */
const skala = ( k: number ) => `scale(calc(${k} / var(--vv-s, 1)))`;

/** ax: półosie do brzegu zakresu i punkt w początku. */
function AxSvg( { ax, zakres }: { ax: LOCIAxElement; zakres: Zakres } ) {
	const [ x, y ] = ax.poczatek;
	return (
		<g id={ax.id} class="loci-ax" transform={`translate(${x} ${y}) rotate(${ax.kat})`}>
			{ax.polosie.map( ( wyglad, i ) => {
				const kier = KIERUNKI_POLOSI[i] ?? 0;
				return <PolosSvg key={kier} kier={kier} dlugosc={doBrzegu( ax.poczatek, ax.kat + kier, zakres )} wyglad={wyglad} />;
			} )}
			<PunktSvg wyglad={ax.punkt} />
		</g>
	);
}

/** Półoś z bieżącego (0,0) pod kątem `kier` (stopnie), długości `dlugosc` (jednostki rysunku). */
function PolosSvg( { kier, dlugosc, wyglad: [ kolor, grubosc, styl, grot ] }: { kier: number; dlugosc: number; wyglad: WygladLinii } ) {
	const kreski = KRESKI[styl];
	const [ gd, gs ] = GROT;
	return (
		<g class="loci-polos" transform={`rotate(${kier})`}>
			<line
				x1={0}
				y1={0}
				x2={dlugosc}
				y2={0}
				stroke={kolor}
				style={{ strokeWidth: px( grubosc ), strokeDasharray: kreski.length ? kreski.map( px ).join( " " ) : "none" }}
			/>
			{grot > 0 && (
				<g transform={`translate(${dlugosc} 0)`}>
					<path d={`M0 0 L${-gd} ${gs / 2} L${-gd} ${-gs / 2} Z`} fill={kolor} style={{ transform: skala( grot ) }} />
				</g>
			)}
		</g>
	);
}

/** Punkt konstrukcyjny w bieżącym (0,0), w px ekranu. */
function PunktSvg( { wyglad: [ symbol, wielkosc, kolor ] }: { wyglad: WygladPunktu } ) {
	return (
		<g class="loci-punkt" style={{ transform: skala( 1 ) }} stroke={kolor} stroke-width={1} fill="none">
			{symbol === "circle" && <circle r={wielkosc / 2} />}
			{symbol === "dot" && <circle r={wielkosc / 4} fill={kolor} stroke="none" />}
			{odcinkiSymbolu( symbol, wielkosc ).map( ( [ x1, y1, x2, y2 ], i ) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} /> )}
		</g>
	);
}
