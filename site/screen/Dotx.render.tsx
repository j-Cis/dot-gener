// @project-metadata
// Path: site/screen/Dotx.render.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { type ComponentChildren, Fragment, toChildArray, type VNode } from "preact";
import ViewAsSvg, { type BoxLength } from "@/site/client/ViewAsSvg.island.tsx";
import ViewAsCanvas from "@/site/client/ViewAsCanvas.island.tsx";
import { type AnchorDir, isAnchorDir } from "@/site/common/drafts/compass.ts";
import type { ClusterModel, DotxMode, EdgeAttrs, FlowDir, FlowMode, GraphAttrs, GraphModel, NodeAttrs, PositionedGraph, ScopeAttrs } from "@/site/scripts/lang/dotx/model.ts";
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
  range?: [number, number];
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

export function TN(_props: TNProps) {
  return null;
}
export function TE(_props: TEProps) {
  return null;
}
export function TG(_props: TGProps) {
  return null;
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
export function F(_props: FProps) {
  return null;
}

interface Templates {
  node: Map<string, NodeAttrs>;
  edge: Map<string, EdgeAttrs>;
  graph: Map<string, GraphAttrs>;
}

function parseNodeRef(ref: string): { id: string; dir?: AnchorDir } {
  const [id = ref, rawDir] = ref.split(":");
  if (rawDir && isAnchorDir(rawDir)) return { id, dir: rawDir };
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
  for (const child of toChildArray(children)) {
    if (!child || typeof child !== "object" || !("type" in child)) continue;
    const vnode = child as VNode<unknown>;
    const type: unknown = vnode.type;
    const props: unknown = vnode.props;

    if (type === Fragment) {
      const { children: inner } = vnode.props as { children?: ComponentChildren };
      collect(inner, scope, state);
    } else if (type === TN) {
      const { id, ...attrs } = props as TNProps;
      state.templates.node.set(id, attrs);
    } else if (type === TE) {
      const { id, ...attrs } = props as TEProps;
      state.templates.edge.set(id, attrs);
    } else if (type === TG) {
      const { id, ...attrs } = props as TGProps;
      state.templates.graph.set(id, attrs);
    } else if (type === N) {
      const { id, use, ...attrs } = props as NProps;
      const tpl = use ? state.templates.node.get(use) : undefined;
      const mergedValues = (scope.node.values || tpl?.values || attrs.values) ? { ...scope.node.values, ...tpl?.values, ...attrs.values } : undefined;
      state.model.nodes.push({
        id,
        attrs: {
          ...scope.node,
          ...tpl,
          ...attrs,
          ...(mergedValues ? { values: mergedValues } : {}),
        },
        ...(state.cluster ? { clusterId: state.cluster.id } : {}),
        ...(state.blockId ? { blockId: state.blockId } : {}),
      });
      state.cluster?.nodeIds.push(id);
    } else if (type === E) {
      const { from, to, fromPort, toPort, use, ...attrs } = props as EProps;
      const tpl = use ? state.templates.edge.get(use) : undefined;
      const f = parseNodeRef(from);
      const t = parseNodeRef(to);
      state.model.edges.push({
        from: f.id,
        to: t.id,
        ...(f.dir !== undefined ? { fromDir: f.dir } : {}),
        ...(t.dir !== undefined ? { toDir: t.dir } : {}),
        ...(fromPort !== undefined ? { fromPort } : {}),
        ...(toPort !== undefined ? { toPort } : {}),
        attrs: { ...scope.edge, ...tpl, ...attrs },
      });
    } else if (type === G) {
      const { id, use, node, edge, graph, children: inner } = vnode.props as GProps;
      const tpl = use ? state.templates.graph.get(use) : undefined;
      const cluster: ClusterModel = {
        id: id ?? `anon_${++state.seq}`,
        attrs: { ...scope.graph, ...tpl, ...graph },
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
    } else if (type === F) {
      const {
        dir = "horizontal",
        mode = "line",
        nodes,
        by,
        values,
        range,
        reverse,
      } = vnode.props as FProps;
      state.model.flows.push({
        dir,
        mode,
        ...(nodes !== undefined ? { nodes } : {}),
        ...(by !== undefined ? { by } : {}),
        ...(values !== undefined ? { values } : {}),
        ...(range !== undefined ? { range } : {}),
        ...(reverse !== undefined ? { reverse } : {}),
      });
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
      <ViewAsCanvas
        registryKey="dotx"
        dane={positioned}
        sceneWidth={positioned.width}
        sceneHeight={positioned.height}
        {...boxProps}
      />
    );
  }

  return (
    <ViewAsSvg {...boxProps}>
      {renderDotxSvg(positioned)}
    </ViewAsSvg>
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

      {g.nodes.map((n) => {
        const hasCells = n.cells.length > 0;
        const stroke = n.attrs.stroke ?? "#333";
        return (
          <g key={n.id} class="dotx-node">
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx={n.attrs.shape === "box" || hasCells ? 6 : 22}
              fill={n.attrs.fill ?? "#fff"}
              stroke={stroke}
              stroke-width={1.5}
            />
            <text
              x={n.x + n.w / 2}
              y={hasCells ? n.y + 15 : n.y + n.h / 2}
              text-anchor="middle"
              dominant-baseline="central"
              fill={n.attrs.color ?? "#111"}
              font-family="Arial, sans-serif"
              font-weight={hasCells ? "700" : "400"}
              font-size={13}
            >
              {n.attrs.label ?? n.id}
            </text>

            {n.cells.map((c) => (
              <g key={c.key} class="dotx-cell">
                <rect x={c.x} y={c.y} width={c.w} height={c.keyH} fill="#e5e7eb" />
                <rect x={c.x} y={c.y + c.keyH} width={c.w} height={c.h - c.keyH} fill="#ffffff" />
                <line
                  x1={c.x}
                  y1={c.y + c.keyH}
                  x2={c.x + c.w}
                  y2={c.y + c.keyH}
                  stroke="#9ca3af"
                  stroke-width={0.75}
                />
                <rect
                  x={c.x}
                  y={c.y}
                  width={c.w}
                  height={c.h}
                  rx={2}
                  fill="none"
                  stroke="#6b7280"
                  stroke-width={1}
                />
                <text
                  x={c.x + c.w / 2}
                  y={c.y + c.keyH / 2}
                  text-anchor="middle"
                  dominant-baseline="central"
                  fill="#374151"
                  font-family="Arial, sans-serif"
                  font-size={10}
                  font-weight="600"
                >
                  {c.key}
                </text>
                <text
                  x={c.x + c.w / 2}
                  y={c.y + c.keyH + (c.h - c.keyH) / 2}
                  text-anchor="middle"
                  dominant-baseline="central"
                  fill="#111827"
                  font-family="Arial, sans-serif"
                  font-size={12}
                  font-weight="700"
                >
                  {c.value}
                </text>
              </g>
            ))}

            {n.ports.map((p) => {
              if (p.shape === "none") return null;
              const pFill = p.fill ?? "#fff";
              const pStroke = p.stroke ?? stroke;
              return (
                <g key={p.id} class="dotx-port">
                  {p.shape === "diamond"
                    ? (
                      <polygon
                        points={`${p.x},${p.y - p.size} ${p.x + p.size},${p.y} ${p.x},${p.y + p.size} ${p.x - p.size},${p.y}`}
                        fill={pFill}
                        stroke={pStroke}
                        stroke-width={1.5}
                      />
                    )
                    : p.shape === "rect"
                    ? (
                      <rect
                        x={p.x - p.size}
                        y={p.y - p.size}
                        width={p.size * 2}
                        height={p.size * 2}
                        rx={2}
                        fill={pFill}
                        stroke={pStroke}
                        stroke-width={1.5}
                      />
                    )
                    : (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={p.size}
                        fill={pFill}
                        stroke={pStroke}
                        stroke-width={1.5}
                      />
                    )}
                  {p.label && (
                    <text
                      x={p.x}
                      y={p.y}
                      text-anchor="middle"
                      dominant-baseline="central"
                      fill={p.color ?? "#111"}
                      font-family="Arial, sans-serif"
                      font-size={9}
                      font-weight="700"
                    >
                      {p.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
