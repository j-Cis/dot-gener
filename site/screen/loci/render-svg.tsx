// @project-metadata
// Path: site/screen/loci/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LociModel } from "./interpreter/model.ts";
import type { Zakres } from "./interpreter/types.ts";
import { doBrzegu } from "./interpreter/geometry.ts";
import { KIERUNKI_POLOSI, type ModelCsax } from "./interpreter/csax.ts";
import type { ModelP } from "./interpreter/p.ts";
import type { WygladLinii, WygladPolosi, WygladPunktu } from "./interpreter/body.ts";
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
				{m.csax.map( ( cs ) => <CsaxSvg key={cs.id} cs={cs} zakres={m.zakres} polosie={m.polosie} punkt={m.punkt} /> )}
				{m.p.map( ( p ) => <PSvg key={p.id} p={p} wyglad={m.punkt} /> )}
			</g>
		</svg>
	);
}

/** px ekranu → długość CSS w jednostkach rysunku. */
const px = ( n: number ) => `calc(${n}px / var(--vv-s, 1))`;
/** Skala elementu rysowanego w px ekranu (do `transform`). */
const skala = ( k: number ) => `scale(calc(${k} / var(--vv-s, 1)))`;

/** csax: półosie do brzegu zakresu i punkt w początku, w wyglądzie z body. */
function CsaxSvg( { cs, zakres, polosie, punkt }: { cs: ModelCsax; zakres: Zakres; polosie: WygladPolosi; punkt: WygladPunktu } ) {
	const [ x, y ] = cs.poczatek;
	return (
		<g id={cs.id} class="loci-csax" transform={`translate(${x} ${y}) rotate(${cs.kat})`}>
			{polosie.map( ( wyglad, i ) => {
				const kier = KIERUNKI_POLOSI[i] ?? 0;
				return <PolosSvg key={kier} kier={kier} dlugosc={doBrzegu( cs.poczatek, cs.kat + kier, zakres )} wyglad={wyglad} />;
			} )}
			<PunktSvg wyglad={punkt} />
		</g>
	);
}

/** p: punkt konstrukcyjny w swoim położeniu, w wyglądzie z body. */
function PSvg( { p, wyglad }: { p: ModelP; wyglad: WygladPunktu } ) {
	const [ x, y ] = p.polozenie;
	return (
		<g id={p.id} class="loci-p" transform={`translate(${x} ${y})`}>
			<PunktSvg wyglad={wyglad} />
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
