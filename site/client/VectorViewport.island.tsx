// @project-metadata
// Path: site/client/VectorViewport.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { cx } from "@/site/common/css/cx.ts";
import { DOPASOWANIA, type SvgRegistryKey } from "@/site/client/registries/for-island-svg.ts";
import { RYSUNKI } from "@/site/client/registries/for-island-canvas.ts";
import { usePanZoom } from "@/site/client/hooks/pan-zoom.ts";
import type { PositionedGraph } from "@/site/common/lang/dotx/model.ts";
import type { LociModel } from "@/site/common/lang/loci/model.ts";
import type { CanvasDrawContext, CanvasDrawer } from "@/site/screen/canvas/draw-context.ts";
import { dotxCanvas, dotxModelZJsx, dotxSvg } from "@/site/screen/Dotx.render.tsx";
import { lociCanvas, lociModelZJsx, lociSvg } from "@/site/screen/Loci.render.tsx";

/** CSS length for the box size. */
export type BoxLength = `${number}${"rem" | "em" | "px" | "%" | "vw" | "vh"}`;

/** Technologia wyświetlania. */
export type Renderer = "SVG" | "Canvas";

/** Logiczny rozmiar sceny [szerokość, wysokość] — do dopasowania widoku (fit). */
export type SceneSize = readonly [ width: number, height: number ];

interface BoxProps {
	/** Tło stołu, dowolny kolor CSS. */
	background?: string;
	/** Szerokość. Domyślnie "100%". */
	width?: BoxLength;
	/** Wysokość. Domyślnie "100%" z min-height 200px; wypełnienie wymaga rodzica z wysokością. */
	height?: BoxLength;
	/** Limity powiększenia względem widoku dopasowanego. Domyślnie 0.1 … 50. */
	minScale?: number;
	maxScale?: number;
}

/** Źródło w atrybucie `source` (typ T) albo jako dzieci (typ D, domyślnie T) — jedno z dwóch. */
type AtrybutAlboDzieci<F extends string, T, D = T> =
	| { sourceFormat: F; source: T; children?: never }
	| { sourceFormat: F; children: D; source?: never };

/** Źródło tylko w atrybucie `source`. */
type Atrybut<F extends string, T> = { sourceFormat: F; source: T; children?: never };

export type VectorViewportProps =
	& BoxProps
	& (
		| (AtrybutAlboDzieci<"SVG", ComponentChildren> & {
			renderer: Renderer;
			/** Dopasowanie z registries/for-island-svg.ts, uruchamiane w przeglądarce (tylko renderer SVG). */
			adjust?: SvgRegistryKey;
		})
		| (AtrybutAlboDzieci<"LOCI", ComponentChildren> & { renderer: Renderer })
		| (AtrybutAlboDzieci<"DOTX", PositionedGraph, ComponentChildren> & { renderer: Renderer })
		| (Atrybut<"CANVAS", CanvasDrawer> & {
			/** Rysunek Canvas nie ma postaci SVG. */
			renderer: "Canvas";
			/** Dane dla rysunku (JSON), w funkcji jako `dane`. */
			data?: unknown;
			scene: SceneSize;
		})
	);

type KluczRysunku = keyof typeof RYSUNKI;
const kluczeRysunkow = Object.keys( RYSUNKI ) as KluczRysunku[];

/** Co rysuje płótno: SVG z ukrytej treści, graf DOTX, model LOCI albo rysunek z RYSUNKI. */
type Malowanie =
	| readonly [ rodzaj: "SVG" ]
	| readonly [ rodzaj: "DOTX", graf: PositionedGraph ]
	| readonly [ rodzaj: "LOCI", model: LociModel ]
	| readonly [ rodzaj: "RYSUNEK", klucz: KluczRysunku, dane: unknown ];

/** Propsy po przygotowaniu na serwerze — to, co przechodzi przez JSON do przeglądarki. */
interface Okno extends BoxProps {
	renderer: Renderer;
	/** SVG: rysowane (renderer SVG) albo ukryte źródło obrazu (renderer Canvas). */
	children?: ComponentChildren;
	adjust?: SvgRegistryKey;
	paint?: Malowanie;
	scene?: SceneSize;
}

/** Źródło z atrybutu albo z dzieci — jedno z dwóch. */
function zrodlo( p: { source?: ComponentChildren; children?: ComponentChildren }, format: string ): ComponentChildren {
	if ( p.source !== undefined && p.children !== undefined ) {
		throw new Error( `VectorViewport (${format}): źródło albo w source, albo jako dzieci — nie oba` );
	}
	return p.source ?? p.children;
}

/** Serwer: wejście → propsy wyspy (bez funkcji i VNode w atrybutach). */
function przygotuj( p: VectorViewportProps ): Okno {
	const okno: Okno = { renderer: p.renderer };
	if ( p.background !== undefined ) okno.background = p.background;
	if ( p.width !== undefined ) okno.width = p.width;
	if ( p.height !== undefined ) okno.height = p.height;
	if ( p.minScale !== undefined ) okno.minScale = p.minScale;
	if ( p.maxScale !== undefined ) okno.maxScale = p.maxScale;

	switch ( p.sourceFormat ) {
		case "SVG": {
			// tekst w `source` = gotowe znaczniki SVG (np. plik .svg zaimportowany jako tekst)
			const svg = typeof p.source === "string" ? <div style="display:contents" dangerouslySetInnerHTML={{ __html: p.source }} /> : zrodlo( p, "SVG" );
			okno.children = svg;
			if ( p.renderer === "Canvas" ) okno.paint = [ "SVG" ];
			else if ( p.adjust !== undefined ) okno.adjust = p.adjust;
			return okno;
		}
		case "LOCI": {
			const model = lociModelZJsx( zrodlo( p, "LOCI" ) );
			if ( p.renderer === "SVG" ) okno.children = lociSvg( model );
			else {
				const [ minX, minY, maxX, maxY ] = model.zakres;
				okno.paint = [ "LOCI", model ];
				okno.scene = [ maxX - minX, maxY - minY ];
			}
			return okno;
		}
		case "DOTX": {
			if ( p.source !== undefined && p.children !== undefined ) {
				throw new Error( "VectorViewport (DOTX): źródło albo w source, albo jako dzieci — nie oba" );
			}
			// graf z gotowym układem w `source` albo znaczniki <Dotx> jako dzieci
			const graf = p.source ?? dotxModelZJsx( p.children );
			if ( p.renderer === "SVG" ) okno.children = dotxSvg( graf );
			else {
				okno.paint = [ "DOTX", graf ];
				okno.scene = [ graf.width, graf.height ];
			}
			return okno;
		}
		case "CANVAS": {
			const rysunek = p.source;
			const klucz = kluczeRysunkow.find( ( k ) => RYSUNKI[k] === rysunek );
			if ( klucz === undefined ) {
				throw new Error(
					`VectorViewport: rysunek „${rysunek.name || "(bez nazwy)"}” nie jest w registries/for-island-canvas.ts (RYSUNKI) — przeglądarka go nie dostanie`,
				);
			}
			okno.paint = [ "RYSUNEK", klucz, p.data ?? null ];
			okno.scene = p.scene;
			return okno;
		}
	}
}

const LICZBA = /^\s*[\d.]+(px)?\s*$/;

/** Rozmiar SVG: atrybuty width/height (liczby), inaczej viewBox, inaczej domyślne 300×150 przeglądarki. */
function rozmiarSvg( svg: SVGSVGElement ): SceneSize {
	const vb = ( svg.getAttribute( "viewBox" ) ?? "" ).trim().split( /[\s,]+/ ).map( Number );
	const liczba = ( a: string, zapas: number | undefined, domyslna: number ) => {
		const v = svg.getAttribute( a );
		return v !== null && LICZBA.test( v ) ? parseFloat( v ) : zapas ?? domyslna;
	};
	return [ liczba( "width", vb.length === 4 ? vb[2] : undefined, 300 ), liczba( "height", vb.length === 4 ? vb[3] : undefined, 150 ) ];
}

/** Bez liczbowych width/height (brak albo %) SVG na stole nie ma rozmiaru — ustala go z viewBox. */
function ustalRozmiar( svg: SVGSVGElement ): SceneSize {
	const r = rozmiarSvg( svg );
	if ( !LICZBA.test( svg.getAttribute( "width" ) ?? "" ) || !LICZBA.test( svg.getAttribute( "height" ) ?? "" ) ) {
		svg.setAttribute( "width", String( r[0] ) );
		svg.setAttribute( "height", String( r[1] ) );
	}
	return r;
}

export default island(
	import.meta.url,
	function VectorViewport(
		{ renderer, children, adjust, paint, scene, background, width = "100%", height, minScale = 0.1, maxScale = 50 }: Okno,
	) {
		const tresc = useRef<HTMLDivElement>( null );
		const plotno = useRef<HTMLCanvasElement>( null );
		const raf = useRef<number | null>( null );
		/** SVG → Canvas: obraz z ukrytej treści i jego rozmiar. */
		const obraz = useRef<HTMLImageElement | null>( null );
		const rozmiar = useRef<SceneSize | undefined>( scene );

		const maluj = ( m: Malowanie, c: CanvasDrawContext ) => {
			switch ( m[0] ) {
				case "SVG": {
					const [ w, h ] = rozmiar.current ?? [ 0, 0 ];
					if ( obraz.current ) c.ctx.drawImage( obraz.current, 0, 0, w, h );
					return;
				}
				case "DOTX":
					dotxCanvas( { ...c, dane: m[1] } );
					return;
				case "LOCI":
					lociCanvas( { ...c, dane: m[1] } );
					return;
				case "RYSUNEK": {
					const rysunek: CanvasDrawer | undefined = RYSUNKI[m[1]];
					if ( rysunek ) rysunek( { ...c, dane: m[2] } );
					else console.warn( `VectorViewport: brak rysunku „${m[1]}” w RYSUNKI` );
					return;
				}
			}
		};

		const rysuj = () => {
			raf.current = null;
			const b = pz.box.current, el = plotno.current;
			if ( !b || !el || !paint ) return;
			const ctx = el.getContext( "2d" );
			if ( !ctx ) return;

			const dpr = globalThis.devicePixelRatio || 1;
			const w = b.clientWidth, h = b.clientHeight;
			const pw = Math.max( 1, Math.round( w * dpr ) ), ph = Math.max( 1, Math.round( h * dpr ) );
			if ( el.width !== pw || el.height !== ph ) {
				el.width = pw;
				el.height = ph;
			}

			const v = pz.view.current;
			ctx.save();
			ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );
			ctx.clearRect( 0, 0, w, h );
			ctx.translate( v.x, v.y );
			ctx.scale( v.s, v.s );
			maluj( paint, { ctx, view: v, width: w, height: h, dpr } );
			ctx.restore();
		};

		const zaplanuj = () => {
			if ( raf.current === null ) raf.current = requestAnimationFrame( rysuj );
		};

		/** SVG: przesuwa i skaluje treść; Canvas: rysuje od nowa. */
		const zmiana = () => {
			if ( renderer === "Canvas" ) return zaplanuj();
			const { x, y, s } = pz.view.current;
			if ( !tresc.current ) return;
			tresc.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
			// powiększenie dla treści: elementy w px ekranu (np. konstrukcja LOCI) dzielą przez nie swój rozmiar
			tresc.current.style.setProperty( "--vv-s", String( s ) );
		};

		const pz = usePanZoom( { minScale, maxScale, onChange: zmiana } );

		const dopasuj = () => {
			if ( renderer === "Canvas" ) {
				const r = rozmiar.current;
				if ( r ) pz.fitTo( r[0], r[1] );
				return;
			}
			const c = tresc.current;
			if ( c ) pz.fitTo( c.offsetWidth, c.offsetHeight );
		};

		// SVG: dopasowanie widoku i opcjonalne dopasowanie z rejestru
		useEffect( () => {
			if ( renderer !== "SVG" ) return;
			const svg = tresc.current?.querySelector<SVGSVGElement>( "svg" );
			if ( svg ) ustalRozmiar( svg );
			dopasuj();
			if ( !adjust ) return;
			document.fonts.ready.then( () => {
				const svg = tresc.current?.querySelector<SVGSVGElement>( "svg" );
				if ( !svg ) return;
				const f = DOPASOWANIA[adjust];
				if ( f ) f( svg );
				else console.warn( `VectorViewport: nieznany adjust="${adjust}"` );
			} );
		}, [ renderer, adjust ] );

		// Canvas: obraz z SVG (gdy trzeba), dopasowanie, rysowanie przy zmianie rozmiaru
		useEffect( () => {
			if ( renderer !== "Canvas" ) return;
			const b = pz.box.current;
			if ( !b ) return;
			let adres: string | null = null;

			if ( paint?.[0] === "SVG" ) {
				const svg = tresc.current?.querySelector<SVGSVGElement>( "svg" );
				if ( svg ) {
					// Obraz SVG nie wczytuje zasobów zewnętrznych (czcionek z sieci, obrazów) — tylko czcionki systemowe.
					const kopia = svg.cloneNode( true ) as SVGSVGElement;
					const r = ustalRozmiar( kopia );
					adres = URL.createObjectURL( new Blob( [ new XMLSerializer().serializeToString( kopia ) ], { type: "image/svg+xml" } ) );
					const img = new Image();
					img.onload = () => {
						obraz.current = img;
						rozmiar.current = r;
						dopasuj();
						zaplanuj();
					};
					img.src = adres;
				} else console.warn( "VectorViewport: brak <svg> w źródle" );
			}

			dopasuj();
			document.fonts.ready.then( zaplanuj );
			const ro = new ResizeObserver( () => zaplanuj() );
			ro.observe( b );
			return () => {
				ro.disconnect();
				if ( raf.current !== null ) cancelAnimationFrame( raf.current );
				if ( adres !== null ) URL.revokeObjectURL( adres );
			};
		}, [ renderer, paint, scene ] );

		return (
			<div class="viewport">
				<div
					ref={pz.box}
					class={cx( "viewport-stol", pz.locked && "is-locked" )}
					style={{
						background,
						width,
						height: height ?? "100%",
						minHeight: height ? undefined : "200px",
					}}
					onWheel={pz.handlers.onWheel}
					onPointerDown={pz.handlers.onPointerDown}
					onPointerMove={pz.handlers.onPointerMove}
					onPointerUp={pz.handlers.onPointerEnd}
					onPointerCancel={pz.handlers.onPointerEnd}
					onDblClick={pz.locked ? undefined : dopasuj}
				>
					<button
						type="button"
						class="viewport-zamek"
						aria-label={pz.locked ? "Odblokuj stół" : "Zablokuj stół"}
						title={pz.locked ? "Odblokuj przesuwanie i zoom" : "Zablokuj (przewijanie strony)"}
						onPointerDown={( e ) => e.stopPropagation()}
						onDblClick={( e ) => e.stopPropagation()}
						onClick={pz.toggleLock}
					>
						{pz.locked ? "🔒" : "🔓"}
					</button>

					{renderer === "SVG" ? <div ref={tresc} class="viewport-tresc">{children}</div> : (
						<>
							<canvas ref={plotno} class="viewport-plotno" />
							{children !== undefined && <div ref={tresc} hidden>{children}</div>}
						</>
					)}
				</div>
			</div>
		);
	},
	przygotuj,
);
