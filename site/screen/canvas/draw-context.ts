// @project-metadata
// Path: site/screen/canvas/draw-context.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Umowa między płótnem a rysunkami Canvas: co dostaje każda funkcja rysująca.
 * Leży po stronie renderów (site/screen), bo to rendery ją wypełniają; wyspa VectorViewport
 * tylko przygotowuje płótno i woła rysunek. Dzięki temu ani screen, ani common nie importują z client.
 */

/** Bieżący widok: przesunięcie (px CSS) i powiększenie. */
export interface CanvasView {
	x: number;
	y: number;
	s: number;
}

/** Wszystko, czego potrzebuje rysunek Canvas. */
export interface CanvasDrawContext {
	ctx: CanvasRenderingContext2D;
	view: CanvasView;
	/** Rozmiar płótna w pikselach CSS. */
	width: number;
	height: number;
	dpr: number;
	/** Dane rysunku (np. model LOCI, graf DOTX). */
	dane?: unknown;
}

/** Rysunek Canvas; żeby działał w przeglądarce, musi być w site/client/registries/for-island-canvas.ts (RYSUNKI). */
export type CanvasDrawer = ( c: CanvasDrawContext ) => void;
