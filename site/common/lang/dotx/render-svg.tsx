// @project-metadata
// Path: site/common/lang/dotx/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { PositionedGraph } from "./model.ts";

/** Graf DOTX z wyliczonym układem → SVG (para dla drawDotxCanvas z render-canvas.ts). */
export function renderDotxSvg(g: PositionedGraph) {
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
