// @project-metadata
// Path: site/scripts/lang/dotx/render-canvas.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { CanvasDrawContext } from "@/site/features/ui/Canvas.island.tsx";
import type { PositionedGraph } from "./model.ts";

export function drawDotxCanvas({ ctx, dane }: CanvasDrawContext): void {
  const g = dane as PositionedGraph | undefined;
  if (!g) return;

  // 1. Klastry
  for (const c of g.clusters) {
    ctx.save();
    ctx.fillStyle = c.attrs.fill ?? "rgba(0,0,0,0.03)";
    ctx.strokeStyle = c.attrs.stroke ?? "#999";
    ctx.setLineDash([4, 3]);
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeRect(c.x, c.y, c.w, c.h);
    ctx.restore();
  }

  // 2. Krawędzie
  for (const e of g.edges) {
    const [p0, p1] = e.points;
    if (!p0 || !p1) continue;
    ctx.save();
    ctx.strokeStyle = e.attrs.stroke ?? "#333";
    ctx.lineWidth = 1.5;
    if (e.attrs.dashed) ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.stroke();

    if (g.mode === "digraph") {
      const ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
      const len = 8;
      ctx.fillStyle = e.attrs.stroke ?? "#333";
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p1[0] - len * Math.cos(ang - 0.4), p1[1] - len * Math.sin(ang - 0.4));
      ctx.lineTo(p1[0] - len * Math.cos(ang + 0.4), p1[1] - len * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. Węzły
  ctx.font = "14px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const n of g.nodes) {
    ctx.fillStyle = n.attrs.fill ?? "#fff";
    ctx.strokeStyle = n.attrs.stroke ?? "#333";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(n.x, n.y, n.w, n.h, n.attrs.shape === "box" ? 4 : 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = n.attrs.color ?? "#111";
    ctx.fillText(n.attrs.label ?? n.id, n.x + n.w / 2, n.y + n.h / 2);
  }
}
