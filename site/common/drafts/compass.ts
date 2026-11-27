// @project-metadata
// Path: site/common/drafts/compass.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

export const COMPASS_ANGLES = {
	E: 0,
	EK: Math.PI / 12,
	KE: Math.PI / 6,
	K: Math.PI / 4,
	KN: Math.PI / 3,
	NK: ( 5 * Math.PI ) / 12,
	N: Math.PI / 2,
	NM: ( 7 * Math.PI ) / 12,
	MN: ( 2 * Math.PI ) / 3,
	M: ( 3 * Math.PI ) / 4,
	MW: ( 5 * Math.PI ) / 6,
	WM: ( 11 * Math.PI ) / 12,
	W: Math.PI,
	WA: ( 13 * Math.PI ) / 12,
	AW: ( 7 * Math.PI ) / 6,
	A: ( 5 * Math.PI ) / 4,
	AS: ( 4 * Math.PI ) / 3,
	SA: ( 17 * Math.PI ) / 12,
	S: ( 3 * Math.PI ) / 2,
	SF: ( 19 * Math.PI ) / 12,
	FS: ( 5 * Math.PI ) / 3,
	F: ( 7 * Math.PI ) / 4,
	FE: ( 11 * Math.PI ) / 6,
	EF: ( 23 * Math.PI ) / 12,
} as const;

export type CompassDir = keyof typeof COMPASS_ANGLES;

export type BoxPos = "T" | "B" | "L" | "R" | "C" | "TL" | "TR" | "BL" | "BR" | "LT" | "LB" | "RT" | "RB";

export type AnchorDir = CompassDir | BoxPos;

export interface Vec2 {
	x: number;
	y: number;
}

export interface AnchorPoint {
	x: number;
	y: number;
	/** Jednostkowy wektor normalny (zewnętrzny) w układzie ekranowym (Y w dół). */
	nx: number;
	ny: number;
}

const BOX_POS_SET = new Set<string>( [
	"T",
	"B",
	"L",
	"R",
	"C",
	"TL",
	"TR",
	"BL",
	"BR",
	"LT",
	"LB",
	"RT",
	"RB",
] );

export function isCompassDir( v: string ): v is CompassDir {
	return v in COMPASS_ANGLES;
}

export function isBoxPos( v: string ): v is BoxPos {
	return BOX_POS_SET.has( v );
}

export function isAnchorDir( v: string ): v is AnchorDir {
	return isCompassDir( v ) || isBoxPos( v );
}

/** Jednostkowy wektor kierunkowy w układzie ekranowym (SVG/Canvas: Y rośnie w dół). */
export function dirVector( dir: AnchorDir ): Vec2 {
	if ( isCompassDir( dir ) ) {
		const a = COMPASS_ANGLES[dir];
		return { x: Math.cos( a ), y: -Math.sin( a ) };
	}
	switch ( dir ) {
		case "T":
		case "TL":
		case "TR":
			return { x: 0, y: -1 };
		case "B":
		case "BL":
		case "BR":
			return { x: 0, y: 1 };
		case "L":
		case "LT":
		case "LB":
			return { x: -1, y: 0 };
		case "R":
		case "RT":
		case "RB":
			return { x: 1, y: 0 };
		case "C":
			return { x: 0, y: 0 };
	}
}

/**
 * Wyznacza punkt na obrysie (prostokąt lub elipsa) dla zadanego symbolu
 * róży wiatrów / pozycji oraz opcjonalnego odsunięcia `offset` wzdłuż wektora normalnego.
 */
export function anchorOnBox(
	box: { x: number; y: number; w: number; h: number },
	dir: AnchorDir,
	offset = 0,
	shape: "rect" | "ellipse" = "rect",
): AnchorPoint {
	const cx = box.x + box.w / 2;
	const cy = box.y + box.h / 2;
	const hw = box.w / 2;
	const hh = box.h / 2;
	const margin = 0.2;

	let px = cx;
	let py = cy;
	const n = dirVector( dir );

	if ( isCompassDir( dir ) ) {
		if ( shape === "ellipse" ) {
			const denom = Math.hypot( n.x / ( hw || 1 ), n.y / ( hh || 1 ) );
			const t = denom > 0 ? 1 / denom : 0;
			px = cx + n.x * t;
			py = cy + n.y * t;
		} else {
			const tx = Math.abs( n.x ) > 1e-9 ? hw / Math.abs( n.x ) : Infinity;
			const ty = Math.abs( n.y ) > 1e-9 ? hh / Math.abs( n.y ) : Infinity;
			const t = Math.min( tx, ty );
			px = cx + n.x * t;
			py = cy + n.y * t;
		}
	} else {
		switch ( dir ) {
			case "T":
				px = cx;
				py = box.y;
				break;
			case "B":
				px = cx;
				py = box.y + box.h;
				break;
			case "L":
				px = box.x;
				py = cy;
				break;
			case "R":
				px = box.x + box.w;
				py = cy;
				break;
			case "C":
				px = cx;
				py = cy;
				break;
			case "TL":
				px = box.x + box.w * margin;
				py = box.y;
				break;
			case "TR":
				px = box.x + box.w * ( 1 - margin );
				py = box.y;
				break;
			case "BL":
				px = box.x + box.w * margin;
				py = box.y + box.h;
				break;
			case "BR":
				px = box.x + box.w * ( 1 - margin );
				py = box.y + box.h;
				break;
			case "LT":
				px = box.x;
				py = box.y + box.h * margin;
				break;
			case "LB":
				px = box.x;
				py = box.y + box.h * ( 1 - margin );
				break;
			case "RT":
				px = box.x + box.w;
				py = box.y + box.h * margin;
				break;
			case "RB":
				px = box.x + box.w;
				py = box.y + box.h * ( 1 - margin );
				break;
		}
	}

	return {
		x: px + n.x * offset,
		y: py + n.y * offset,
		nx: n.x,
		ny: n.y,
	};
}
