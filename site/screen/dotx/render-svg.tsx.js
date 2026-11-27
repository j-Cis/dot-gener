// @project-metadata
// Path: site/screen/dotx/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
/** Graf DOTX z wyliczonym układem → SVG (para dla drawDotxCanvas z render-canvas.ts). */ export function renderDotxSvg(g) {
  return /*#__PURE__*/ _jsxs("svg", {
    width: g.width,
    height: g.height,
    viewBox: `0 0 ${g.width} ${g.height}`,
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      g.mode === "digraph" && /*#__PURE__*/ _jsx("defs", {
        children: /*#__PURE__*/ _jsx("marker", {
          id: "dotx-arrow",
          viewBox: "0 0 10 10",
          refX: "9",
          refY: "5",
          markerWidth: "6",
          markerHeight: "6",
          orient: "auto-start-reverse",
          children: /*#__PURE__*/ _jsx("path", {
            d: "M 0 0 L 10 5 L 0 10 z",
            fill: "#333"
          })
        })
      }),
      g.clusters.map((c)=>/*#__PURE__*/ _jsx("g", {
          class: "dotx-cluster",
          children: /*#__PURE__*/ _jsx("rect", {
            x: c.x,
            y: c.y,
            width: c.w,
            height: c.h,
            rx: 6,
            fill: c.attrs.fill ?? "rgba(0,0,0,0.03)",
            stroke: c.attrs.stroke ?? "#999",
            "stroke-dasharray": "4 3"
          })
        }, c.id)),
      g.edges.map((e, i)=>{
        const d = e.points.map(([x, y], idx)=>`${idx === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
        return /*#__PURE__*/ _jsx("path", {
          d: d,
          fill: "none",
          stroke: e.attrs.stroke ?? "#333",
          "stroke-width": 1.5,
          "stroke-dasharray": e.attrs.dashed ? "4 3" : undefined,
          "marker-end": g.mode === "digraph" ? "url(#dotx-arrow)" : undefined
        }, `${e.from}-${e.to}-${i}`);
      }),
      g.nodes.map((n)=>{
        const hasCells = n.cells.length > 0;
        const stroke = n.attrs.stroke ?? "#333";
        return /*#__PURE__*/ _jsxs("g", {
          class: "dotx-node",
          children: [
            /*#__PURE__*/ _jsx("rect", {
              x: n.x,
              y: n.y,
              width: n.w,
              height: n.h,
              rx: n.attrs.shape === "box" || hasCells ? 6 : 22,
              fill: n.attrs.fill ?? "#fff",
              stroke: stroke,
              "stroke-width": 1.5
            }),
            /*#__PURE__*/ _jsx("text", {
              x: n.x + n.w / 2,
              y: hasCells ? n.y + 15 : n.y + n.h / 2,
              "text-anchor": "middle",
              "dominant-baseline": "central",
              fill: n.attrs.color ?? "#111",
              "font-family": "Arial, sans-serif",
              "font-weight": hasCells ? "700" : "400",
              "font-size": 13,
              children: n.attrs.label ?? n.id
            }),
            n.cells.map((c)=>/*#__PURE__*/ _jsxs("g", {
                class: "dotx-cell",
                children: [
                  /*#__PURE__*/ _jsx("rect", {
                    x: c.x,
                    y: c.y,
                    width: c.w,
                    height: c.keyH,
                    fill: "#e5e7eb"
                  }),
                  /*#__PURE__*/ _jsx("rect", {
                    x: c.x,
                    y: c.y + c.keyH,
                    width: c.w,
                    height: c.h - c.keyH,
                    fill: "#ffffff"
                  }),
                  /*#__PURE__*/ _jsx("line", {
                    x1: c.x,
                    y1: c.y + c.keyH,
                    x2: c.x + c.w,
                    y2: c.y + c.keyH,
                    stroke: "#9ca3af",
                    "stroke-width": 0.75
                  }),
                  /*#__PURE__*/ _jsx("rect", {
                    x: c.x,
                    y: c.y,
                    width: c.w,
                    height: c.h,
                    rx: 2,
                    fill: "none",
                    stroke: "#6b7280",
                    "stroke-width": 1
                  }),
                  /*#__PURE__*/ _jsx("text", {
                    x: c.x + c.w / 2,
                    y: c.y + c.keyH / 2,
                    "text-anchor": "middle",
                    "dominant-baseline": "central",
                    fill: "#374151",
                    "font-family": "Arial, sans-serif",
                    "font-size": 10,
                    "font-weight": "600",
                    children: c.key
                  }),
                  /*#__PURE__*/ _jsx("text", {
                    x: c.x + c.w / 2,
                    y: c.y + c.keyH + (c.h - c.keyH) / 2,
                    "text-anchor": "middle",
                    "dominant-baseline": "central",
                    fill: "#111827",
                    "font-family": "Arial, sans-serif",
                    "font-size": 12,
                    "font-weight": "700",
                    children: c.value
                  })
                ]
              }, c.key)),
            n.ports.map((p)=>{
              if (p.shape === "none") return null;
              const pFill = p.fill ?? "#fff";
              const pStroke = p.stroke ?? stroke;
              return /*#__PURE__*/ _jsxs("g", {
                class: "dotx-port",
                children: [
                  p.shape === "diamond" ? /*#__PURE__*/ _jsx("polygon", {
                    points: `${p.x},${p.y - p.size} ${p.x + p.size},${p.y} ${p.x},${p.y + p.size} ${p.x - p.size},${p.y}`,
                    fill: pFill,
                    stroke: pStroke,
                    "stroke-width": 1.5
                  }) : p.shape === "rect" ? /*#__PURE__*/ _jsx("rect", {
                    x: p.x - p.size,
                    y: p.y - p.size,
                    width: p.size * 2,
                    height: p.size * 2,
                    rx: 2,
                    fill: pFill,
                    stroke: pStroke,
                    "stroke-width": 1.5
                  }) : /*#__PURE__*/ _jsx("circle", {
                    cx: p.x,
                    cy: p.y,
                    r: p.size,
                    fill: pFill,
                    stroke: pStroke,
                    "stroke-width": 1.5
                  }),
                  p.label && /*#__PURE__*/ _jsx("text", {
                    x: p.x,
                    y: p.y,
                    "text-anchor": "middle",
                    "dominant-baseline": "central",
                    fill: p.color ?? "#111",
                    "font-family": "Arial, sans-serif",
                    "font-size": 9,
                    "font-weight": "700",
                    children: p.label
                  })
                ]
              }, p.id);
            })
          ]
        }, n.id);
      })
    ]
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2RvdHgvcmVuZGVyLXN2Zy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2RvdHgvcmVuZGVyLXN2Zy50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uZWRHcmFwaCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvZG90eC9tb2RlbC50c1wiO1xuXG4vKiogR3JhZiBET1RYIHogd3lsaWN6b255bSB1a8WCYWRlbSDihpIgU1ZHIChwYXJhIGRsYSBkcmF3RG90eENhbnZhcyB6IHJlbmRlci1jYW52YXMudHMpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckRvdHhTdmcoIGc6IFBvc2l0aW9uZWRHcmFwaCApIHtcblx0cmV0dXJuIChcblx0XHQ8c3ZnXG5cdFx0XHR3aWR0aD17Zy53aWR0aH1cblx0XHRcdGhlaWdodD17Zy5oZWlnaHR9XG5cdFx0XHR2aWV3Qm94PXtgMCAwICR7Zy53aWR0aH0gJHtnLmhlaWdodH1gfVxuXHRcdFx0eG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG5cdFx0PlxuXHRcdFx0e2cubW9kZSA9PT0gXCJkaWdyYXBoXCIgJiYgKFxuXHRcdFx0XHQ8ZGVmcz5cblx0XHRcdFx0XHQ8bWFya2VyXG5cdFx0XHRcdFx0XHRpZD1cImRvdHgtYXJyb3dcIlxuXHRcdFx0XHRcdFx0dmlld0JveD1cIjAgMCAxMCAxMFwiXG5cdFx0XHRcdFx0XHRyZWZYPVwiOVwiXG5cdFx0XHRcdFx0XHRyZWZZPVwiNVwiXG5cdFx0XHRcdFx0XHRtYXJrZXJXaWR0aD1cIjZcIlxuXHRcdFx0XHRcdFx0bWFya2VySGVpZ2h0PVwiNlwiXG5cdFx0XHRcdFx0XHRvcmllbnQ9XCJhdXRvLXN0YXJ0LXJldmVyc2VcIlxuXHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdDxwYXRoIGQ9XCJNIDAgMCBMIDEwIDUgTCAwIDEwIHpcIiBmaWxsPVwiIzMzM1wiIC8+XG5cdFx0XHRcdFx0PC9tYXJrZXI+XG5cdFx0XHRcdDwvZGVmcz5cblx0XHRcdCl9XG5cblx0XHRcdHtnLmNsdXN0ZXJzLm1hcCggKCBjICkgPT4gKFxuXHRcdFx0XHQ8ZyBrZXk9e2MuaWR9IGNsYXNzPVwiZG90eC1jbHVzdGVyXCI+XG5cdFx0XHRcdFx0PHJlY3Rcblx0XHRcdFx0XHRcdHg9e2MueH1cblx0XHRcdFx0XHRcdHk9e2MueX1cblx0XHRcdFx0XHRcdHdpZHRoPXtjLnd9XG5cdFx0XHRcdFx0XHRoZWlnaHQ9e2MuaH1cblx0XHRcdFx0XHRcdHJ4PXs2fVxuXHRcdFx0XHRcdFx0ZmlsbD17Yy5hdHRycy5maWxsID8/IFwicmdiYSgwLDAsMCwwLjAzKVwifVxuXHRcdFx0XHRcdFx0c3Ryb2tlPXtjLmF0dHJzLnN0cm9rZSA/PyBcIiM5OTlcIn1cblx0XHRcdFx0XHRcdHN0cm9rZS1kYXNoYXJyYXk9XCI0IDNcIlxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdDwvZz5cblx0XHRcdCkgKX1cblxuXHRcdFx0e2cuZWRnZXMubWFwKCAoIGUsIGkgKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGQgPSBlLnBvaW50c1xuXHRcdFx0XHRcdC5tYXAoICggWyB4LCB5IF0sIGlkeCApID0+IGAke2lkeCA9PT0gMCA/IFwiTVwiIDogXCJMXCJ9ICR7eH0gJHt5fWAgKVxuXHRcdFx0XHRcdC5qb2luKCBcIiBcIiApO1xuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdDxwYXRoXG5cdFx0XHRcdFx0XHRrZXk9e2Ake2UuZnJvbX0tJHtlLnRvfS0ke2l9YH1cblx0XHRcdFx0XHRcdGQ9e2R9XG5cdFx0XHRcdFx0XHRmaWxsPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRzdHJva2U9e2UuYXR0cnMuc3Ryb2tlID8/IFwiIzMzM1wifVxuXHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoPXsxLjV9XG5cdFx0XHRcdFx0XHRzdHJva2UtZGFzaGFycmF5PXtlLmF0dHJzLmRhc2hlZCA/IFwiNCAzXCIgOiB1bmRlZmluZWR9XG5cdFx0XHRcdFx0XHRtYXJrZXItZW5kPXtnLm1vZGUgPT09IFwiZGlncmFwaFwiID8gXCJ1cmwoI2RvdHgtYXJyb3cpXCIgOiB1bmRlZmluZWR9XG5cdFx0XHRcdFx0Lz5cblx0XHRcdFx0KTtcblx0XHRcdH0gKX1cblxuXHRcdFx0e2cubm9kZXMubWFwKCAoIG4gKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGhhc0NlbGxzID0gbi5jZWxscy5sZW5ndGggPiAwO1xuXHRcdFx0XHRjb25zdCBzdHJva2UgPSBuLmF0dHJzLnN0cm9rZSA/PyBcIiMzMzNcIjtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8ZyBrZXk9e24uaWR9IGNsYXNzPVwiZG90eC1ub2RlXCI+XG5cdFx0XHRcdFx0XHQ8cmVjdFxuXHRcdFx0XHRcdFx0XHR4PXtuLnh9XG5cdFx0XHRcdFx0XHRcdHk9e24ueX1cblx0XHRcdFx0XHRcdFx0d2lkdGg9e24ud31cblx0XHRcdFx0XHRcdFx0aGVpZ2h0PXtuLmh9XG5cdFx0XHRcdFx0XHRcdHJ4PXtuLmF0dHJzLnNoYXBlID09PSBcImJveFwiIHx8IGhhc0NlbGxzID8gNiA6IDIyfVxuXHRcdFx0XHRcdFx0XHRmaWxsPXtuLmF0dHJzLmZpbGwgPz8gXCIjZmZmXCJ9XG5cdFx0XHRcdFx0XHRcdHN0cm9rZT17c3Ryb2tlfVxuXHRcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg9ezEuNX1cblx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQ8dGV4dFxuXHRcdFx0XHRcdFx0XHR4PXtuLnggKyBuLncgLyAyfVxuXHRcdFx0XHRcdFx0XHR5PXtoYXNDZWxscyA/IG4ueSArIDE1IDogbi55ICsgbi5oIC8gMn1cblx0XHRcdFx0XHRcdFx0dGV4dC1hbmNob3I9XCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0XHRkb21pbmFudC1iYXNlbGluZT1cImNlbnRyYWxcIlxuXHRcdFx0XHRcdFx0XHRmaWxsPXtuLmF0dHJzLmNvbG9yID8/IFwiIzExMVwifVxuXHRcdFx0XHRcdFx0XHRmb250LWZhbWlseT1cIkFyaWFsLCBzYW5zLXNlcmlmXCJcblx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ9e2hhc0NlbGxzID8gXCI3MDBcIiA6IFwiNDAwXCJ9XG5cdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZT17MTN9XG5cdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdHtuLmF0dHJzLmxhYmVsID8/IG4uaWR9XG5cdFx0XHRcdFx0XHQ8L3RleHQ+XG5cblx0XHRcdFx0XHRcdHtuLmNlbGxzLm1hcCggKCBjICkgPT4gKFxuXHRcdFx0XHRcdFx0XHQ8ZyBrZXk9e2Mua2V5fSBjbGFzcz1cImRvdHgtY2VsbFwiPlxuXHRcdFx0XHRcdFx0XHRcdDxyZWN0IHg9e2MueH0geT17Yy55fSB3aWR0aD17Yy53fSBoZWlnaHQ9e2Mua2V5SH0gZmlsbD1cIiNlNWU3ZWJcIiAvPlxuXHRcdFx0XHRcdFx0XHRcdDxyZWN0IHg9e2MueH0geT17Yy55ICsgYy5rZXlIfSB3aWR0aD17Yy53fSBoZWlnaHQ9e2MuaCAtIGMua2V5SH0gZmlsbD1cIiNmZmZmZmZcIiAvPlxuXHRcdFx0XHRcdFx0XHRcdDxsaW5lXG5cdFx0XHRcdFx0XHRcdFx0XHR4MT17Yy54fVxuXHRcdFx0XHRcdFx0XHRcdFx0eTE9e2MueSArIGMua2V5SH1cblx0XHRcdFx0XHRcdFx0XHRcdHgyPXtjLnggKyBjLnd9XG5cdFx0XHRcdFx0XHRcdFx0XHR5Mj17Yy55ICsgYy5rZXlIfVxuXHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlPVwiIzljYTNhZlwiXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg9ezAuNzV9XG5cdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHQ8cmVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0eD17Yy54fVxuXHRcdFx0XHRcdFx0XHRcdFx0eT17Yy55fVxuXHRcdFx0XHRcdFx0XHRcdFx0d2lkdGg9e2Mud31cblx0XHRcdFx0XHRcdFx0XHRcdGhlaWdodD17Yy5ofVxuXHRcdFx0XHRcdFx0XHRcdFx0cng9ezJ9XG5cdFx0XHRcdFx0XHRcdFx0XHRmaWxsPVwibm9uZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHJva2U9XCIjNmI3MjgwXCJcblx0XHRcdFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aD17MX1cblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHRcdDx0ZXh0XG5cdFx0XHRcdFx0XHRcdFx0XHR4PXtjLnggKyBjLncgLyAyfVxuXHRcdFx0XHRcdFx0XHRcdFx0eT17Yy55ICsgYy5rZXlIIC8gMn1cblx0XHRcdFx0XHRcdFx0XHRcdHRleHQtYW5jaG9yPVwibWlkZGxlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGRvbWluYW50LWJhc2VsaW5lPVwiY2VudHJhbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWxsPVwiIzM3NDE1MVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRmb250LWZhbWlseT1cIkFyaWFsLCBzYW5zLXNlcmlmXCJcblx0XHRcdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZT17MTB9XG5cdFx0XHRcdFx0XHRcdFx0XHRmb250LXdlaWdodD1cIjYwMFwiXG5cdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0e2Mua2V5fVxuXHRcdFx0XHRcdFx0XHRcdDwvdGV4dD5cblx0XHRcdFx0XHRcdFx0XHQ8dGV4dFxuXHRcdFx0XHRcdFx0XHRcdFx0eD17Yy54ICsgYy53IC8gMn1cblx0XHRcdFx0XHRcdFx0XHRcdHk9e2MueSArIGMua2V5SCArICggYy5oIC0gYy5rZXlIICkgLyAyfVxuXHRcdFx0XHRcdFx0XHRcdFx0dGV4dC1hbmNob3I9XCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZG9taW5hbnQtYmFzZWxpbmU9XCJjZW50cmFsXCJcblx0XHRcdFx0XHRcdFx0XHRcdGZpbGw9XCIjMTExODI3XCJcblx0XHRcdFx0XHRcdFx0XHRcdGZvbnQtZmFtaWx5PVwiQXJpYWwsIHNhbnMtc2VyaWZcIlxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9udC1zaXplPXsxMn1cblx0XHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0PVwiNzAwXCJcblx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHR7Yy52YWx1ZX1cblx0XHRcdFx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHRcdCkgKX1cblxuXHRcdFx0XHRcdFx0e24ucG9ydHMubWFwKCAoIHAgKSA9PiB7XG5cdFx0XHRcdFx0XHRcdGlmICggcC5zaGFwZSA9PT0gXCJub25lXCIgKSByZXR1cm4gbnVsbDtcblx0XHRcdFx0XHRcdFx0Y29uc3QgcEZpbGwgPSBwLmZpbGwgPz8gXCIjZmZmXCI7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHBTdHJva2UgPSBwLnN0cm9rZSA/PyBzdHJva2U7XG5cdFx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdFx0PGcga2V5PXtwLmlkfSBjbGFzcz1cImRvdHgtcG9ydFwiPlxuXHRcdFx0XHRcdFx0XHRcdFx0e3Auc2hhcGUgPT09IFwiZGlhbW9uZFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdD8gKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxwb2x5Z29uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwb2ludHM9e2Ake3AueH0sJHtwLnkgLSBwLnNpemV9ICR7cC54ICsgcC5zaXplfSwke3AueX0gJHtwLnh9LCR7cC55ICsgcC5zaXplfSAke3AueCAtIHAuc2l6ZX0sJHtwLnl9YH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw9e3BGaWxsfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlPXtwU3Ryb2tlfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoPXsxLjV9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IHAuc2hhcGUgPT09IFwicmVjdFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdD8gKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxyZWN0XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR4PXtwLnggLSBwLnNpemV9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR5PXtwLnkgLSBwLnNpemV9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR3aWR0aD17cC5zaXplICogMn1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhlaWdodD17cC5zaXplICogMn1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJ4PXsyfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbD17cEZpbGx9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdHJva2U9e3BTdHJva2V9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg9ezEuNX1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdDogKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdDxjaXJjbGVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGN4PXtwLnh9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjeT17cC55fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cj17cC5zaXplfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbD17cEZpbGx9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdHJva2U9e3BTdHJva2V9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg9ezEuNX1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpfVxuXHRcdFx0XHRcdFx0XHRcdFx0e3AubGFiZWwgJiYgKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8dGV4dFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHg9e3AueH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR5PXtwLnl9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGV4dC1hbmNob3I9XCJtaWRkbGVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRvbWluYW50LWJhc2VsaW5lPVwiY2VudHJhbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmlsbD17cC5jb2xvciA/PyBcIiMxMTFcIn1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb250LWZhbWlseT1cIkFyaWFsLCBzYW5zLXNlcmlmXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb250LXNpemU9ezl9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ9XCI3MDBcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0e3AubGFiZWx9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdDwvdGV4dD5cblx0XHRcdFx0XHRcdFx0XHRcdCl9XG5cdFx0XHRcdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fSApfVxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0KTtcblx0XHRcdH0gKX1cblx0XHQ8L3N2Zz5cblx0KTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEOztBQUlqRCx1RkFBdUYsR0FDdkYsT0FBTyxTQUFTLGNBQWUsQ0FBa0I7RUFDaEQscUJBQ0MsTUFBQztJQUNBLE9BQU8sRUFBRSxLQUFLO0lBQ2QsUUFBUSxFQUFFLE1BQU07SUFDaEIsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUU7SUFDckMsT0FBTTs7TUFFTCxFQUFFLElBQUksS0FBSywyQkFDWCxLQUFDO2tCQUNBLGNBQUEsS0FBQztVQUNBLElBQUc7VUFDSCxTQUFR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