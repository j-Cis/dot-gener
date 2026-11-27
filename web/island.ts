// @project-metadata
// Path: web/island.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type ComponentChildren, type ComponentType, type FunctionComponent, h } from "preact";

const ROOT = new URL( "../", import.meta.url ).href;
const IS_BROWSER = typeof document !== "undefined";

/** Marks the server-rendered children of an island (see client.ts). */
export const SLOT_ATTR = "data-island-slot";

/**
 * Marks a component as an island. In a site/client/**\/*.island.tsx file:
 *
 *   export default island(import.meta.url, function Counter(props) { … });
 *
 * Server: renders the component inside
 *   <div data-island="/site/client/…/X.island.tsx" data-props="{…}">.
 * Browser: returns the component itself; client.ts imports that path and
 * hydrates it.
 *
 * Props must be JSON-serializable, except `children`: those are rendered on
 * the server into a slot and kept as static HTML in the browser (their DOM is
 * not re-rendered by the island, so they cannot be interactive Preact code —
 * nested islands inside them still hydrate on their own).
 *
 * With `prepare` (third argument): the island takes input W, which `prepare`
 * turns into the island props P on the server, before the JSON above — for
 * inputs JSON cannot carry (functions, a VNode in an attribute). The browser
 * gets P. `prepare` runs only on the server, but its module goes to the
 * browser with the island, so it may import only browser-safe code.
 */
export function island<P extends object>(
	moduleUrl: string,
	Component: ComponentType<P>,
): ComponentType<P>;
export function island<W extends object, P extends object>(
	moduleUrl: string,
	Component: ComponentType<P>,
	prepare: ( input: W ) => P,
): ComponentType<W>;
export function island<W extends object, P extends object>(
	moduleUrl: string,
	Component: ComponentType<P>,
	prepare?: ( input: W ) => P,
): ComponentType<P> | ComponentType<W> {
	if ( IS_BROWSER ) return Component;
	if ( !moduleUrl.startsWith( ROOT ) ) {
		throw new Error( `island outside the project: ${moduleUrl}` );
	}
	const src = "/" + moduleUrl.slice( ROOT.length );
	const Wrapped: FunctionComponent<W> = ( input ) => {
		const { children, ...props } = ( prepare ? prepare( input ) : input ) as P & { children?: ComponentChildren };
		return h(
			"div",
			{
				"data-island": src,
				"data-props": JSON.stringify( props ),
				style: "display:contents",
			},
			h(
				Component,
				{
					...props,
					children: children == null ? children : h(
						"div",
						{ [SLOT_ATTR]: "", style: "display:contents" },
						children,
					),
				} as unknown as P,
			),
		);
	};
	return Wrapped;
}
