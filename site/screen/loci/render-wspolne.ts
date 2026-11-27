// @project-metadata
// Path: site/screen/loci/render-wspolne.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { LineStyle } from "@/site/common/lang/loci/attribute/LOCIAxisProps.ts";
import type { PointSymbol } from "@/site/common/lang/loci/attribute/LOCIPointProps.ts";

/** Wspólne dla rysowania LOCI w SVG i na Canvas: wymiary w pikselach ekranu. */

/** Kreski stylów linii w px ekranu. */
export const KRESKI: Readonly<Record<LineStyle, readonly number[]>> = {
	dashed: [ 6, 4 ],
	dotted: [ 1, 3 ],
	solid: [],
};

/** Grot w px ekranu przy skali 1: [długość, szerokość]. */
export const GROT = [ 10, 7 ] as const;

/**
 * Odcinki symbolu punktu (px ekranu, środek w 0,0) dla "rays24" i "cross";
 * "circle" i "dot" rysuje się okręgiem o promieniu wielkość/2 (kropka: wypełniony, wielkość/4).
 */
export function odcinkiSymbolu( symbol: PointSymbol, wielkosc: number ): readonly (readonly [ number, number, number, number ])[] {
	const r = wielkosc / 2;
	const katy = symbol === "rays24" ? Array.from( { length: 12 }, ( _, i ) => i * 15 ) : symbol === "cross" ? [ 0, 90 ] : [];
	return katy.map( ( k ) => {
		const a = ( k * Math.PI ) / 180;
		const x = r * Math.cos( a ), y = r * Math.sin( a );
		return [ -x, -y, x, y ] as const;
	} );
}
