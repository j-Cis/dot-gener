// @project-metadata
// Path: site/scripts/lang/dotx/layout.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { anchorOnBox } from "@/site/scripts/compass.ts";
import type { FlowModel, GraphModel, NodeModel, PositionedCell, PositionedCluster, PositionedEdge, PositionedGraph, PositionedNode, PositionedPort } from "./model.ts";

const MIN_W = 100;
const BASE_H = 44;
const HEADER_H = 28;
const CELL_KEY_H = 14;
const CELL_VAL_H = 18;
const CELL_H = CELL_KEY_H + CELL_VAL_H;
const CELL_MIN_W = 46;
const CELL_GAP = 4;
const NODE_PAD = 8;
const GAP_X = 56;
const GAP_Y = 76;
const PAD = 48;
const CLUSTER_PAD = 24;

function resolveRows(n: NodeModel): string[][] {
  const vals = n.attrs.values;
  if (!vals) return [];
  if (n.attrs.valuesLayout && n.attrs.valuesLayout.length > 0) {
    return n.attrs.valuesLayout.filter((row) => row.length > 0);
  }
  return Object.keys(vals).map((k) => [k]);
}

function measureNode(n: NodeModel): { w: number; h: number } {
  const vals = n.attrs.values ?? {};
  const rows = resolveRows(n);
  const label = n.attrs.label ?? n.id;

  if (rows.length === 0) {
    return { w: Math.max(MIN_W, label.length * 8 + 28), h: BASE_H };
  }

  let maxRowW = 0;
  for (const row of rows) {
    const cellW = Math.max(
      CELL_MIN_W,
      ...row.map((k) => {
        const vStr = vals[k] !== undefined ? String(vals[k]) : "";
        return Math.max(k.length, vStr.length) * 7.5 + 14;
      }),
    );
    const rowW = row.length * cellW + (row.length - 1) * CELL_GAP;
    maxRowW = Math.max(maxRowW, rowW);
  }

  const w = Math.max(MIN_W, label.length * 8 + 28, maxRowW + NODE_PAD * 2);
  const h = HEADER_H + rows.length * CELL_H + (rows.length - 1) * CELL_GAP + NODE_PAD;
  return { w, h };
}

function placeCells(
  box: { x: number; y: number; w: number; h: number },
  n: NodeModel,
): PositionedCell[] {
  const vals = n.attrs.values;
  const rows = resolveRows(n);
  if (!vals || rows.length === 0) return [];

  const innerW = box.w - NODE_PAD * 2;
  const out: PositionedCell[] = [];

  rows.forEach((row, rIdx) => {
    const y = box.y + HEADER_H + rIdx * (CELL_H + CELL_GAP);
    const cellW = (innerW - (row.length - 1) * CELL_GAP) / row.length;

    row.forEach((key, cIdx) => {
      const val = vals[key];
      out.push({
        key,
        value: val !== undefined ? String(val) : "",
        x: box.x + NODE_PAD + cIdx * (cellW + CELL_GAP),
        y,
        w: cellW,
        h: CELL_H,
        keyH: CELL_KEY_H,
      });
    });
  });

  return out;
}

function placePorts(
  box: { x: number; y: number; w: number; h: number },
  n: NodeModel,
): PositionedPort[] {
  const defs = n.attrs.ports;
  if (!defs || defs.length === 0) return [];

  const isEllipse = n.attrs.shape === "ellipse" || n.attrs.shape === "circle";
  const boxShape = isEllipse ? "ellipse" : "rect";

  return defs.map((p) => {
    const anchor = anchorOnBox(box, p.pos ?? "C", p.offset ?? 0, boxShape);
    const shape = p.shape ?? "none";
    const size = p.size ?? (p.label ? 10 : 5);
    return {
      id: p.id,
      x: anchor.x,
      y: anchor.y,
      nx: anchor.nx,
      ny: anchor.ny,
      shape,
      size,
      ...(p.label !== undefined ? { label: p.label } : {}),
      ...(p.fill !== undefined ? { fill: p.fill } : {}),
      ...(p.stroke !== undefined ? { stroke: p.stroke } : {}),
      ...(p.color !== undefined ? { color: p.color } : {}),
    };
  });
}

function resolveFlowNodes(flow: FlowModel, nodes: NodeModel[]): string[] {
  if (flow.nodes && flow.nodes.length > 0) return flow.nodes;
  if (!flow.by) return [];

  const field = flow.by;

  if (flow.values && flow.values.length > 0) {
    const out: string[] = [];
    for (const target of flow.values) {
      for (const n of nodes) {
        if (n.attrs.values?.[field] === target) out.push(n.id);
      }
    }
    return out;
  }

  const matched = nodes
    .map((n) => ({ id: n.id, val: n.attrs.values?.[field] }))
    .filter((item): item is { id: string; val: number } => {
      if (typeof item.val !== "number") return false;
      if (flow.range) {
        return item.val >= flow.range[0] && item.val <= flow.range[1];
      }
      return true;
    });

  matched.sort((a, b) => (flow.reverse ? b.val - a.val : a.val - b.val));
  return matched.map((m) => m.id);
}

export function layoutGraph(model: GraphModel): PositionedGraph {
  const rank = new Map<string, number>();
  for (const n of model.nodes) rank.set(n.id, 0);

  const resolvedFlows = model.flows.map((f) => ({
    flow: f,
    ids: resolveFlowNodes(f, model.nodes),
  }));

  for (let i = 0; i < model.nodes.length; i++) {
    let changed = false;

    for (const e of model.edges) {
      const rFrom = rank.get(e.from) ?? 0;
      const rTo = rank.get(e.to) ?? 0;
      if (rTo <= rFrom) {
        rank.set(e.to, rFrom + 1);
        changed = true;
      }
    }

    const blockRank = new Map<string, number>();
    for (const n of model.nodes) {
      if (!n.blockId) continue;
      const r = rank.get(n.id) ?? 0;
      blockRank.set(n.blockId, Math.max(blockRank.get(n.blockId) ?? 0, r));
    }
    for (const n of model.nodes) {
      if (!n.blockId) continue;
      const target = blockRank.get(n.blockId) ?? 0;
      if ((rank.get(n.id) ?? 0) !== target) {
        rank.set(n.id, target);
        changed = true;
      }
    }

    for (const { flow, ids } of resolvedFlows) {
      if (ids.length < 2) continue;

      if (flow.dir === "horizontal") {
        const target = Math.max(...ids.map((id) => rank.get(id) ?? 0));
        for (const id of ids) {
          if ((rank.get(id) ?? 0) !== target) {
            rank.set(id, target);
            changed = true;
          }
        }
      } else if (flow.dir === "vertical") {
        for (let k = 0; k < ids.length - 1; k++) {
          const u = ids[k];
          const v = ids[k + 1];
          if (!u || !v) continue;
          const rU = rank.get(u) ?? 0;
          const rV = rank.get(v) ?? 0;
          if (rV <= rU) {
            rank.set(v, rU + 1);
            changed = true;
          }
        }
      }
    }

    if (!changed) break;
  }

  const layers = new Map<number, NodeModel[]>();
  for (const n of model.nodes) {
    const r = rank.get(n.id) ?? 0;
    const list = layers.get(r) ?? [];
    list.push(n);
    layers.set(r, list);
  }

  // Kolejność węzłów w warstwach według poziomych <F>
  const orderIndex = new Map<string, number>();
  let orderSeq = 0;
  for (const { flow, ids } of resolvedFlows) {
    if (flow.dir !== "horizontal") continue;
    for (const id of ids) {
      orderIndex.set(id, orderSeq++);
    }
  }
  for (const list of layers.values()) {
    list.sort((a, b) => {
      const ia = orderIndex.get(a.id);
      const ib = orderIndex.get(b.id);
      if (ia !== undefined && ib !== undefined) return ia - ib;
      if (ia !== undefined) return -1;
      if (ib !== undefined) return 1;
      return 0;
    });
  }

  const sizes = new Map(model.nodes.map((n) => [n.id, measureNode(n)]));
  const sortedLayers = [...layers.entries()].sort((a, b) => a[0] - b[0]);

  const layerWidth = (list: NodeModel[]) =>
    list.reduce((sum, n) => sum + (sizes.get(n.id)?.w ?? MIN_W), 0) +
    Math.max(0, list.length - 1) * GAP_X;

  const contentW = Math.max(
    MIN_W,
    ...sortedLayers.map(([, list]) => layerWidth(list)),
  );

  const positionedMap = new Map<string, PositionedNode>();
  let curY = PAD;

  for (const [, list] of sortedLayers) {
    const rowW = layerWidth(list);
    const rowH = Math.max(
      BASE_H,
      ...list.map((n) => sizes.get(n.id)?.h ?? BASE_H),
    );
    let curX = PAD + (contentW - rowW) / 2;

    for (const n of list) {
      const { w, h } = sizes.get(n.id) ?? { w: MIN_W, h: BASE_H };
      const y = curY + (rowH - h) / 2;
      const box = { x: curX, y, w, h };
      positionedMap.set(n.id, {
        id: n.id,
        x: curX,
        y,
        w,
        h,
        attrs: n.attrs,
        ports: placePorts(box, n),
        cells: placeCells(box, n),
      });
      curX += w + GAP_X;
    }
    curY += rowH + GAP_Y;
  }

  const clusters: PositionedCluster[] = [];
  for (const c of model.clusters) {
    const members = c.nodeIds
      .map((id) => positionedMap.get(id))
      .filter((n): n is PositionedNode => n !== undefined);
    if (members.length === 0) continue;

    const minX = Math.min(...members.map((m) => m.x)) - CLUSTER_PAD;
    const minY = Math.min(...members.map((m) => m.y)) - CLUSTER_PAD;
    const maxX = Math.max(...members.map((m) => m.x + m.w)) + CLUSTER_PAD;
    const maxY = Math.max(...members.map((m) => m.y + m.h)) + CLUSTER_PAD;
    clusters.push({
      id: c.id,
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
      attrs: c.attrs,
    });
  }

  const resolvePoint = (
    node: PositionedNode,
    portId: string | undefined,
    dir: GraphModel["edges"][number]["fromDir"],
    fallback: "B" | "T",
  ): [number, number] => {
    if (portId) {
      const p = node.ports.find((pt) => pt.id === portId);
      if (p) return [p.x, p.y];
    }
    const shape = (node.attrs.shape === "ellipse" || node.attrs.shape === "circle") ? "ellipse" : "rect";
    const pt = anchorOnBox(node, dir ?? fallback, 0, shape);
    return [pt.x, pt.y];
  };

  const edges: PositionedEdge[] = [];
  for (const e of model.edges) {
    const a = positionedMap.get(e.from);
    const b = positionedMap.get(e.to);
    if (!a || !b) continue;

    edges.push({
      from: e.from,
      to: e.to,
      points: [
        resolvePoint(a, e.fromPort, e.fromDir, "B"),
        resolvePoint(b, e.toPort, e.toDir, "T"),
      ],
      attrs: e.attrs,
    });
  }

  return {
    mode: model.mode,
    width: contentW + PAD * 2,
    height: Math.max(PAD * 2, curY - GAP_Y + PAD),
    nodes: [...positionedMap.values()],
    edges,
    clusters,
  };
}
