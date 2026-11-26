// @project-metadata
// Path: site/scripts/lang/dotx/model.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { AnchorDir } from "@/site/common/drafts/compass.ts";

export type DotxMode = "graph" | "digraph";
export type PortShape = "none" | "circle" | "rect" | "diamond";
export type FlowDir = "horizontal" | "vertical";
export type FlowMode = "line";

export interface PortDef {
  /** Lokalne ID portu w obrębie węzła. */
  id: string;
  /** Pozycja na obrysie (róża wiatrów lub T/B/L/R/TL/...). */
  pos?: AnchorDir;
  /** Odsunięcie wzdłuż wektora kierunku (>0 na zewnątrz, <0 do środka). */
  offset?: number;
  /** "none" = port anonimowy (niewidoczny), pozostałe = port wizualny. */
  shape?: PortShape;
  /** Widoczna etykieta portu (dla portów wizualnych nazwanych). */
  label?: string;
  /** Rozmiar (promień / połowa boku). */
  size?: number;
  fill?: string;
  stroke?: string;
  color?: string;
}

export interface NodeAttrs {
  label?: string;
  shape?: "box" | "circle" | "ellipse";
  fill?: string;
  stroke?: string;
  color?: string;
  values?: Record<string, string | number>;
  /** Układ kafelków values w wierszach, np. [["iK", "iL"], ["iA", "iR"], ["jA", "jR"]]. */
  valuesLayout?: string[][];
  ports?: PortDef[];
}

export interface EdgeAttrs {
  label?: string;
  stroke?: string;
  dashed?: boolean;
}

export interface GraphAttrs {
  rankdir?: "TB" | "LR";
  label?: string;
  fill?: string;
  stroke?: string;
}

export interface ScopeAttrs {
  node?: NodeAttrs;
  edge?: EdgeAttrs;
  graph?: GraphAttrs;
}

export interface FlowModel {
  dir: FlowDir;
  mode: FlowMode;
  nodes?: string[];
  by?: string;
  values?: (string | number)[];
  range?: [number, number];
  reverse?: boolean;
}

export interface NodeModel {
  id: string;
  attrs: NodeAttrs;
  clusterId?: string;
  blockId?: string;
}

export interface EdgeModel {
  from: string;
  to: string;
  fromDir?: AnchorDir;
  toDir?: AnchorDir;
  fromPort?: string;
  toPort?: string;
  attrs: EdgeAttrs;
}

export interface ClusterModel {
  id: string;
  attrs: GraphAttrs;
  nodeIds: string[];
}

export interface GraphModel {
  mode: DotxMode;
  attrs: GraphAttrs;
  nodes: NodeModel[];
  edges: EdgeModel[];
  clusters: ClusterModel[];
  flows: FlowModel[];
}

export interface PositionedPort {
  id: string;
  x: number;
  y: number;
  nx: number;
  ny: number;
  shape: PortShape;
  size: number;
  label?: string;
  fill?: string;
  stroke?: string;
  color?: string;
}

export interface PositionedCell {
  key: string;
  value: string;
  x: number;
  y: number;
  w: number;
  h: number;
  keyH: number;
}

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  attrs: NodeAttrs;
  ports: PositionedPort[];
  cells: PositionedCell[];
}

export interface PositionedEdge {
  from: string;
  to: string;
  points: [number, number][];
  attrs: EdgeAttrs;
}

export interface PositionedCluster {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  attrs: GraphAttrs;
}

export interface PositionedGraph {
  mode: DotxMode;
  width: number;
  height: number;
  nodes: PositionedNode[];
  edges: PositionedEdge[];
  clusters: PositionedCluster[];
}
