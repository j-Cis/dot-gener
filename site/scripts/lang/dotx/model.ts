// @project-metadata
// Path: site/scripts/lang/dotx/model.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

export type DotxMode = "graph" | "digraph";

export interface NodeAttrs {
  label?: string;
  shape?: "box" | "circle" | "ellipse";
  fill?: string;
  stroke?: string;
  color?: string;
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

export interface NodeModel {
  id: string;
  attrs: NodeAttrs;
  clusterId?: string;
  /** Wspólny identyfikator bloku <B> — wymusza ten sam poziom (rank). */
  blockId?: string;
}

export interface EdgeModel {
  from: string;
  to: string;
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
}

/** Wynik layout.ts — wyłącznie czyste obiekty/tablice (gotowe do JSON dla Canvas). */
export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  attrs: NodeAttrs;
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
