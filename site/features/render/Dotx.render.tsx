// @project-metadata
// Path: site/features/render/Dotx.render.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type ComponentChildren, Fragment, toChildArray, type VNode } from "preact";
import Svg, { type BoxLength } from "@/site/features/ui/Svg.island.tsx";
import Canvas from "@/site/features/ui/Canvas.island.tsx";
import type { ClusterModel, DotxMode, EdgeAttrs, GraphAttrs, GraphModel, NodeAttrs, PositionedGraph, ScopeAttrs } from "@/site/scripts/lang/dotx/model.ts";
import { layoutGraph } from "@/site/scripts/lang/dotx/layout.ts";

export interface NProps extends NodeAttrs {
  id: string;
}
export interface EProps extends EdgeAttrs {
  from: string;
  to: string;
}
export interface GProps extends ScopeAttrs {
  id?: string;
  children?: ComponentChildren;
}
export interface BProps extends ScopeAttrs {
  children?: ComponentChildren;
}
export interface DotxProps extends ScopeAttrs {
  mode?: DotxMode;
  out?: "islandSvg" | "islandCanvas";
  width?: BoxLength;
  height?: BoxLength;
  background?: string;
  children?: ComponentChildren;
}

export function N(_props: NProps) {
  return null;
}
export function E(_props: EProps) {
  return null;
}
export function G(_props: GProps) {
  return null;
}
export function B(_props: BProps) {
  return null;
}

function collect(
  children: ComponentChildren,
  scope: { node: NodeAttrs; edge: EdgeAttrs; graph: GraphAttrs },
  state: {
    model: GraphModel;
    cluster?: ClusterModel;
    blockId?: string;
    seq: number;
  },
) {
  for (const child of toChildArray(children)) {
    if (!child || typeof child !== "object" || !("type" in child)) continue;
    const vnode = child as VNode<unknown>;
    const type: unknown = vnode.type;

    if (type === Fragment) {
      const { children: inner } = vnode.props as { children?: ComponentChildren };
      collect(inner, scope, state);
    } else if (type === N) {
      const { id, ...attrs } = vnode.props as unknown as NProps;
      state.model.nodes.push({
        id,
        attrs: { ...scope.node, ...attrs },
        ...(state.cluster ? { clusterId: state.cluster.id } : {}),
        ...(state.blockId ? { blockId: state.blockId } : {}),
      });
      state.cluster?.nodeIds.push(id);
    } else if (type === E) {
      const { from, to, ...attrs } = vnode.props as unknown as EProps;
      state.model.edges.push({
        from,
        to,
        attrs: { ...scope.edge, ...attrs },
      });
    } else if (type === G) {
      const { id, node, edge, graph, children: inner } = vnode.props as unknown as GProps;
      const cluster: ClusterModel = {
        id: id ?? `anon_${++state.seq}`,
        attrs: { ...scope.graph, ...graph },
        nodeIds: [],
      };
      state.model.clusters.push(cluster);
      collect(
        inner,
        {
          node: { ...scope.node, ...node },
          edge: { ...scope.edge, ...edge },
          graph: cluster.attrs,
        },
        { ...state, cluster },
      );
    } else if (type === B) {
      const { node, edge, graph, children: inner } = vnode.props as unknown as BProps;
      collect(
        inner,
        {
          node: { ...scope.node, ...node },
          edge: { ...scope.edge, ...edge },
          graph: { ...scope.graph, ...graph },
        },
        { ...state, blockId: `block_${++state.seq}` },
      );
    }
  }
}
export function Dotx({
  mode = "digraph",
  out = "islandSvg",
  node = {},
  edge = {},
  graph = {},
  width,
  height,
  background,
  children,
}: DotxProps) {
  const model: GraphModel = {
    mode,
    attrs: graph,
    nodes: [],
    edges: [],
    clusters: [],
  };

  collect(children, { node, edge, graph }, { model, seq: 0 });
  const positioned = layoutGraph(model);

  const boxProps: {
    width?: BoxLength;
    height?: BoxLength;
    background?: string;
  } = {};
  if (width !== undefined) boxProps.width = width;
  if (height !== undefined) boxProps.height = height;
  if (background !== undefined) boxProps.background = background;

  if (out === "islandCanvas") {
    return (
      <Canvas
        registryKey="dotx"
        dane={positioned}
        sceneWidth={positioned.width}
        sceneHeight={positioned.height}
        {...boxProps}
      />
    );
  }

  return (
    <Svg {...boxProps}>
      {renderDotxSvg(positioned)}
    </Svg>
  );
}

function renderDotxSvg(g: PositionedGraph) {
  return (
    <svg
      width={g.width}
      height={g.height}
      viewBox={`0 0 ${g.width} ${g.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {g.mode === "digraph" && (
        <defs>
          <marker
            id="dotx-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
          </marker>
        </defs>
      )}

      {g.clusters.map((c) => (
        <g key={c.id} class="dotx-cluster">
          <rect
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            rx={6}
            fill={c.attrs.fill ?? "rgba(0,0,0,0.03)"}
            stroke={c.attrs.stroke ?? "#999"}
            stroke-dasharray="4 3"
          />
        </g>
      ))}

      {g.edges.map((e, i) => {
        const d = e.points
          .map(([x, y], idx) => `${idx === 0 ? "M" : "L"} ${x} ${y}`)
          .join(" ");
        return (
          <path
            key={`${e.from}-${e.to}-${i}`}
            d={d}
            fill="none"
            stroke={e.attrs.stroke ?? "#333"}
            stroke-width={1.5}
            stroke-dasharray={e.attrs.dashed ? "4 3" : undefined}
            marker-end={g.mode === "digraph" ? "url(#dotx-arrow)" : undefined}
          />
        );
      })}

      {g.nodes.map((n) => (
        <g key={n.id} class="dotx-node">
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx={n.attrs.shape === "box" ? 4 : 20}
            fill={n.attrs.fill ?? "#fff"}
            stroke={n.attrs.stroke ?? "#333"}
            stroke-width={1.5}
          />
          <text
            x={n.x + n.w / 2}
            y={n.y + n.h / 2}
            text-anchor="middle"
            dominant-baseline="central"
            fill={n.attrs.color ?? "#111"}
            font-family="Arial, sans-serif"
            font-size={14}
          >
            {n.attrs.label ?? n.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
