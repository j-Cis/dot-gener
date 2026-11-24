import type { GraphModel, PositionedCluster, PositionedEdge, PositionedGraph, PositionedNode } from "./model.ts";

const NODE_W = 80;
const NODE_H = 40;
const GAP_X = 48;
const GAP_Y = 64;
const PAD = 32;
const CLUSTER_PAD = 18;

export function layoutGraph(model: GraphModel): PositionedGraph {
  const rank = new Map<string, number>();
  for (const n of model.nodes) rank.set(n.id, 0);

  // 1. Przypisanie warstw na podstawie krawędzi (z limitem iteracji dla cykli)
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
    // Węzły w tym samym bloku <B> wyrównujemy do najwyższej warstwy w bloku
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
    if (!changed) break;
  }

  // 2. Grupowanie węzłów po warstwach
  const layers = new Map<number, string[]>();
  for (const n of model.nodes) {
    const r = rank.get(n.id) ?? 0;
    const list = layers.get(r) ?? [];
    list.push(n.id);
    layers.set(r, list);
  }

  const nodeMap = new Map(model.nodes.map((n) => [n.id, n]));
  const positionedMap = new Map<string, PositionedNode>();
  const sortedLayers = [...layers.entries()].sort((a, b) => a[0] - b[0]);
  const maxInLayer = Math.max(1, ...sortedLayers.map(([, ids]) => ids.length));
  const contentW = maxInLayer * NODE_W + (maxInLayer - 1) * GAP_X;

  let maxY = PAD;
  for (const [layerIdx, ids] of sortedLayers) {
    const rowW = ids.length * NODE_W + (ids.length - 1) * GAP_X;
    const startX = PAD + (contentW - rowW) / 2;
    const y = PAD + layerIdx * (NODE_H + GAP_Y);
    maxY = Math.max(maxY, y + NODE_H);

    ids.forEach((id, i) => {
      const node = nodeMap.get(id);
      if (!node) return;
      positionedMap.set(id, {
        id,
        x: startX + i * (NODE_W + GAP_X),
        y,
        w: NODE_W,
        h: NODE_H,
        attrs: node.attrs,
      });
    });
  }

  // 3. Ramki klastrów <G>
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

  // 4. Punkty krawędzi (środek dolnej krawędzi → środek górnej krawędzi)
  const edges: PositionedEdge[] = [];
  for (const e of model.edges) {
    const a = positionedMap.get(e.from);
    const b = positionedMap.get(e.to);
    if (!a || !b) continue;
    edges.push({
      from: e.from,
      to: e.to,
      points: [
        [a.x + a.w / 2, a.y + a.h],
        [b.x + b.w / 2, b.y],
      ],
      attrs: e.attrs,
    });
  }

  return {
    mode: model.mode,
    width: contentW + PAD * 2,
    height: maxY + PAD,
    nodes: [...positionedMap.values()],
    edges,
    clusters,
  };
}
