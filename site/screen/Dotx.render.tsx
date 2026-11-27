// @project-metadata
// Path: site/screen/Dotx.render.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type ComponentChildren, Fragment, toChildArray, type VNode } from "preact";
import VectorViewport, { type BoxLength } from "@/site/client/VectorViewport.island.tsx";
import { type AnchorDir, isAnchorDir } from "@/site/common/drafts/compass.ts";
import type { ClusterModel, DotxMode, EdgeAttrs, FlowDir, FlowMode, GraphAttrs, GraphModel, NodeAttrs, ScopeAttrs } from "@/site/common/lang/dotx/model.ts";
import { layoutGraph } from "@/site/common/lang/dotx/layout.ts";

export interface TNProps extends NodeAttrs {
	id: string;
}
export interface TEProps extends EdgeAttrs {
	id: string;
}
export interface TGProps extends GraphAttrs {
	id: string;
}
export interface NProps extends NodeAttrs {
	id: string;
	use?: string;
}
export interface EProps extends EdgeAttrs {
	/** Format: "idWęzła" lub "idWęzła:kierunek" (np. "A:KE", "A:TL"). */
	from: string;
	to: string;
	fromPort?: string;
	toPort?: string;
	use?: string;
}
export interface GProps extends ScopeAttrs {
	id?: string;
	use?: string;
	children?: ComponentChildren;
}
export interface BProps extends ScopeAttrs {
	children?: ComponentChildren;
}
export interface FProps {
	dir?: FlowDir;
	mode?: FlowMode;
	nodes?: string[];
	by?: string;
	values?: (string | number)[];
	range?: [ number, number ];
	reverse?: boolean;
}
export interface DotxProps extends ScopeAttrs {
	mode?: DotxMode;
	out?: "islandSvg" | "islandCanvas";
	width?: BoxLength;
	height?: BoxLength;
	background?: string;
	children?: ComponentChildren;
}

export function TN( _props: TNProps ) {
	return null;
}
export function TE( _props: TEProps ) {
	return null;
}
export function TG( _props: TGProps ) {
	return null;
}
export function N( _props: NProps ) {
	return null;
}
export function E( _props: EProps ) {
	return null;
}
export function G( _props: GProps ) {
	return null;
}
export function B( _props: BProps ) {
	return null;
}
export function F( _props: FProps ) {
	return null;
}

interface Templates {
	node: Map<string, NodeAttrs>;
	edge: Map<string, EdgeAttrs>;
	graph: Map<string, GraphAttrs>;
}

function parseNodeRef( ref: string ): { id: string; dir?: AnchorDir } {
	const [ id = ref, rawDir ] = ref.split( ":" );
	if ( rawDir && isAnchorDir( rawDir ) ) return { id, dir: rawDir };
	return { id };
}

function collect(
	children: ComponentChildren,
	scope: { node: NodeAttrs; edge: EdgeAttrs; graph: GraphAttrs },
	state: {
		model: GraphModel;
		templates: Templates;
		cluster?: ClusterModel;
		blockId?: string;
		seq: number;
	},
) {
	for ( const child of toChildArray( children ) ) {
		if ( !child || typeof child !== "object" || !( "type" in child ) ) continue;
		const vnode = child as VNode<unknown>;
		const type: unknown = vnode.type;
		const props: unknown = vnode.props;

		if ( type === Fragment ) {
			const { children: inner } = vnode.props as { children?: ComponentChildren };
			collect( inner, scope, state );
		} else if ( type === TN ) {
			const { id, ...attrs } = props as TNProps;
			state.templates.node.set( id, attrs );
		} else if ( type === TE ) {
			const { id, ...attrs } = props as TEProps;
			state.templates.edge.set( id, attrs );
		} else if ( type === TG ) {
			const { id, ...attrs } = props as TGProps;
			state.templates.graph.set( id, attrs );
		} else if ( type === N ) {
			const { id, use, ...attrs } = props as NProps;
			const tpl = use ? state.templates.node.get( use ) : undefined;
			const mergedValues = ( scope.node.values || tpl?.values || attrs.values ) ? { ...scope.node.values, ...tpl?.values, ...attrs.values } : undefined;
			state.model.nodes.push( {
				id,
				attrs: {
					...scope.node,
					...tpl,
					...attrs,
					...( mergedValues ? { values: mergedValues } : {} ),
				},
				...( state.cluster ? { clusterId: state.cluster.id } : {} ),
				...( state.blockId ? { blockId: state.blockId } : {} ),
			} );
			state.cluster?.nodeIds.push( id );
		} else if ( type === E ) {
			const { from, to, fromPort, toPort, use, ...attrs } = props as EProps;
			const tpl = use ? state.templates.edge.get( use ) : undefined;
			const f = parseNodeRef( from );
			const t = parseNodeRef( to );
			state.model.edges.push( {
				from: f.id,
				to: t.id,
				...( f.dir !== undefined ? { fromDir: f.dir } : {} ),
				...( t.dir !== undefined ? { toDir: t.dir } : {} ),
				...( fromPort !== undefined ? { fromPort } : {} ),
				...( toPort !== undefined ? { toPort } : {} ),
				attrs: { ...scope.edge, ...tpl, ...attrs },
			} );
		} else if ( type === G ) {
			const { id, use, node, edge, graph, children: inner } = vnode.props as GProps;
			const tpl = use ? state.templates.graph.get( use ) : undefined;
			const cluster: ClusterModel = {
				id: id ?? `anon_${++state.seq}`,
				attrs: { ...scope.graph, ...tpl, ...graph },
				nodeIds: [],
			};
			state.model.clusters.push( cluster );
			collect(
				inner,
				{
					node: { ...scope.node, ...node },
					edge: { ...scope.edge, ...edge },
					graph: cluster.attrs,
				},
				{ ...state, cluster },
			);
		} else if ( type === B ) {
			const { node, edge, graph, children: inner } = vnode.props as BProps;
			collect(
				inner,
				{
					node: { ...scope.node, ...node },
					edge: { ...scope.edge, ...edge },
					graph: { ...scope.graph, ...graph },
				},
				{ ...state, blockId: `block_${++state.seq}` },
			);
		} else if ( type === F ) {
			const {
				dir = "horizontal",
				mode = "line",
				nodes,
				by,
				values,
				range,
				reverse,
			} = vnode.props as FProps;
			state.model.flows.push( {
				dir,
				mode,
				...( nodes !== undefined ? { nodes } : {} ),
				...( by !== undefined ? { by } : {} ),
				...( values !== undefined ? { values } : {} ),
				...( range !== undefined ? { range } : {} ),
				...( reverse !== undefined ? { reverse } : {} ),
			} );
		}
	}
}

export function Dotx( {
	mode = "digraph",
	out = "islandSvg",
	node = {},
	edge = {},
	graph = {},
	width,
	height,
	background,
	children,
}: DotxProps ) {
	const model: GraphModel = {
		mode,
		attrs: graph,
		nodes: [],
		edges: [],
		clusters: [],
		flows: [],
	};

	collect(
		children,
		{ node, edge, graph },
		{
			model,
			templates: { node: new Map(), edge: new Map(), graph: new Map() },
			seq: 0,
		},
	);
	const positioned = layoutGraph( model );

	const boxProps: {
		width?: BoxLength;
		height?: BoxLength;
		background?: string;
	} = {};
	if ( width !== undefined ) boxProps.width = width;
	if ( height !== undefined ) boxProps.height = height;
	if ( background !== undefined ) boxProps.background = background;

	return (
		<VectorViewport
			renderer={out === "islandCanvas" ? "Canvas" : "SVG"}
			sourceFormat="DOTX"
			source={positioned}
			{...boxProps}
		/>
	);
}
