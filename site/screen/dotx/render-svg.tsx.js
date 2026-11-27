// @project-metadata
// Path: site/screen/dotx/render-svg.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
/** Graf DOTX z wyliczonym układem → SVG (para dla drawDotxCanvas z site/common/lang/dotx/render-canvas.ts). */ export function renderDotxSvg(g) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvc2NyZWVuL2RvdHgvcmVuZGVyLXN2Zy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvc2NyZWVuL2RvdHgvcmVuZGVyLXN2Zy50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IFBvc2l0aW9uZWRHcmFwaCB9IGZyb20gXCJAL3NpdGUvY29tbW9uL2xhbmcvZG90eC9tb2RlbC50c1wiO1xuXG4vKiogR3JhZiBET1RYIHogd3lsaWN6b255bSB1a8WCYWRlbSDihpIgU1ZHIChwYXJhIGRsYSBkcmF3RG90eENhbnZhcyB6IHNpdGUvY29tbW9uL2xhbmcvZG90eC9yZW5kZXItY2FudmFzLnRzKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJEb3R4U3ZnKCBnOiBQb3NpdGlvbmVkR3JhcGggKSB7XG5cdHJldHVybiAoXG5cdFx0PHN2Z1xuXHRcdFx0d2lkdGg9e2cud2lkdGh9XG5cdFx0XHRoZWlnaHQ9e2cuaGVpZ2h0fVxuXHRcdFx0dmlld0JveD17YDAgMCAke2cud2lkdGh9ICR7Zy5oZWlnaHR9YH1cblx0XHRcdHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuXHRcdD5cblx0XHRcdHtnLm1vZGUgPT09IFwiZGlncmFwaFwiICYmIChcblx0XHRcdFx0PGRlZnM+XG5cdFx0XHRcdFx0PG1hcmtlclxuXHRcdFx0XHRcdFx0aWQ9XCJkb3R4LWFycm93XCJcblx0XHRcdFx0XHRcdHZpZXdCb3g9XCIwIDAgMTAgMTBcIlxuXHRcdFx0XHRcdFx0cmVmWD1cIjlcIlxuXHRcdFx0XHRcdFx0cmVmWT1cIjVcIlxuXHRcdFx0XHRcdFx0bWFya2VyV2lkdGg9XCI2XCJcblx0XHRcdFx0XHRcdG1hcmtlckhlaWdodD1cIjZcIlxuXHRcdFx0XHRcdFx0b3JpZW50PVwiYXV0by1zdGFydC1yZXZlcnNlXCJcblx0XHRcdFx0XHQ+XG5cdFx0XHRcdFx0XHQ8cGF0aCBkPVwiTSAwIDAgTCAxMCA1IEwgMCAxMCB6XCIgZmlsbD1cIiMzMzNcIiAvPlxuXHRcdFx0XHRcdDwvbWFya2VyPlxuXHRcdFx0XHQ8L2RlZnM+XG5cdFx0XHQpfVxuXG5cdFx0XHR7Zy5jbHVzdGVycy5tYXAoICggYyApID0+IChcblx0XHRcdFx0PGcga2V5PXtjLmlkfSBjbGFzcz1cImRvdHgtY2x1c3RlclwiPlxuXHRcdFx0XHRcdDxyZWN0XG5cdFx0XHRcdFx0XHR4PXtjLnh9XG5cdFx0XHRcdFx0XHR5PXtjLnl9XG5cdFx0XHRcdFx0XHR3aWR0aD17Yy53fVxuXHRcdFx0XHRcdFx0aGVpZ2h0PXtjLmh9XG5cdFx0XHRcdFx0XHRyeD17Nn1cblx0XHRcdFx0XHRcdGZpbGw9e2MuYXR0cnMuZmlsbCA/PyBcInJnYmEoMCwwLDAsMC4wMylcIn1cblx0XHRcdFx0XHRcdHN0cm9rZT17Yy5hdHRycy5zdHJva2UgPz8gXCIjOTk5XCJ9XG5cdFx0XHRcdFx0XHRzdHJva2UtZGFzaGFycmF5PVwiNCAzXCJcblx0XHRcdFx0XHQvPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHQpICl9XG5cblx0XHRcdHtnLmVkZ2VzLm1hcCggKCBlLCBpICkgPT4ge1xuXHRcdFx0XHRjb25zdCBkID0gZS5wb2ludHNcblx0XHRcdFx0XHQubWFwKCAoIFsgeCwgeSBdLCBpZHggKSA9PiBgJHtpZHggPT09IDAgPyBcIk1cIiA6IFwiTFwifSAke3h9ICR7eX1gIClcblx0XHRcdFx0XHQuam9pbiggXCIgXCIgKTtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQ8cGF0aFxuXHRcdFx0XHRcdFx0a2V5PXtgJHtlLmZyb219LSR7ZS50b30tJHtpfWB9XG5cdFx0XHRcdFx0XHRkPXtkfVxuXHRcdFx0XHRcdFx0ZmlsbD1cIm5vbmVcIlxuXHRcdFx0XHRcdFx0c3Ryb2tlPXtlLmF0dHJzLnN0cm9rZSA/PyBcIiMzMzNcIn1cblx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aD17MS41fVxuXHRcdFx0XHRcdFx0c3Ryb2tlLWRhc2hhcnJheT17ZS5hdHRycy5kYXNoZWQgPyBcIjQgM1wiIDogdW5kZWZpbmVkfVxuXHRcdFx0XHRcdFx0bWFya2VyLWVuZD17Zy5tb2RlID09PSBcImRpZ3JhcGhcIiA/IFwidXJsKCNkb3R4LWFycm93KVwiIDogdW5kZWZpbmVkfVxuXHRcdFx0XHRcdC8+XG5cdFx0XHRcdCk7XG5cdFx0XHR9ICl9XG5cblx0XHRcdHtnLm5vZGVzLm1hcCggKCBuICkgPT4ge1xuXHRcdFx0XHRjb25zdCBoYXNDZWxscyA9IG4uY2VsbHMubGVuZ3RoID4gMDtcblx0XHRcdFx0Y29uc3Qgc3Ryb2tlID0gbi5hdHRycy5zdHJva2UgPz8gXCIjMzMzXCI7XG5cdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0PGcga2V5PXtuLmlkfSBjbGFzcz1cImRvdHgtbm9kZVwiPlxuXHRcdFx0XHRcdFx0PHJlY3Rcblx0XHRcdFx0XHRcdFx0eD17bi54fVxuXHRcdFx0XHRcdFx0XHR5PXtuLnl9XG5cdFx0XHRcdFx0XHRcdHdpZHRoPXtuLnd9XG5cdFx0XHRcdFx0XHRcdGhlaWdodD17bi5ofVxuXHRcdFx0XHRcdFx0XHRyeD17bi5hdHRycy5zaGFwZSA9PT0gXCJib3hcIiB8fCBoYXNDZWxscyA/IDYgOiAyMn1cblx0XHRcdFx0XHRcdFx0ZmlsbD17bi5hdHRycy5maWxsID8/IFwiI2ZmZlwifVxuXHRcdFx0XHRcdFx0XHRzdHJva2U9e3N0cm9rZX1cblx0XHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoPXsxLjV9XG5cdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0PHRleHRcblx0XHRcdFx0XHRcdFx0eD17bi54ICsgbi53IC8gMn1cblx0XHRcdFx0XHRcdFx0eT17aGFzQ2VsbHMgPyBuLnkgKyAxNSA6IG4ueSArIG4uaCAvIDJ9XG5cdFx0XHRcdFx0XHRcdHRleHQtYW5jaG9yPVwibWlkZGxlXCJcblx0XHRcdFx0XHRcdFx0ZG9taW5hbnQtYmFzZWxpbmU9XCJjZW50cmFsXCJcblx0XHRcdFx0XHRcdFx0ZmlsbD17bi5hdHRycy5jb2xvciA/PyBcIiMxMTFcIn1cblx0XHRcdFx0XHRcdFx0Zm9udC1mYW1pbHk9XCJBcmlhbCwgc2Fucy1zZXJpZlwiXG5cdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0PXtoYXNDZWxscyA/IFwiNzAwXCIgOiBcIjQwMFwifVxuXHRcdFx0XHRcdFx0XHRmb250LXNpemU9ezEzfVxuXHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHR7bi5hdHRycy5sYWJlbCA/PyBuLmlkfVxuXHRcdFx0XHRcdFx0PC90ZXh0PlxuXG5cdFx0XHRcdFx0XHR7bi5jZWxscy5tYXAoICggYyApID0+IChcblx0XHRcdFx0XHRcdFx0PGcga2V5PXtjLmtleX0gY2xhc3M9XCJkb3R4LWNlbGxcIj5cblx0XHRcdFx0XHRcdFx0XHQ8cmVjdCB4PXtjLnh9IHk9e2MueX0gd2lkdGg9e2Mud30gaGVpZ2h0PXtjLmtleUh9IGZpbGw9XCIjZTVlN2ViXCIgLz5cblx0XHRcdFx0XHRcdFx0XHQ8cmVjdCB4PXtjLnh9IHk9e2MueSArIGMua2V5SH0gd2lkdGg9e2Mud30gaGVpZ2h0PXtjLmggLSBjLmtleUh9IGZpbGw9XCIjZmZmZmZmXCIgLz5cblx0XHRcdFx0XHRcdFx0XHQ8bGluZVxuXHRcdFx0XHRcdFx0XHRcdFx0eDE9e2MueH1cblx0XHRcdFx0XHRcdFx0XHRcdHkxPXtjLnkgKyBjLmtleUh9XG5cdFx0XHRcdFx0XHRcdFx0XHR4Mj17Yy54ICsgYy53fVxuXHRcdFx0XHRcdFx0XHRcdFx0eTI9e2MueSArIGMua2V5SH1cblx0XHRcdFx0XHRcdFx0XHRcdHN0cm9rZT1cIiM5Y2EzYWZcIlxuXHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoPXswLjc1fVxuXHRcdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHRcdFx0PHJlY3Rcblx0XHRcdFx0XHRcdFx0XHRcdHg9e2MueH1cblx0XHRcdFx0XHRcdFx0XHRcdHk9e2MueX1cblx0XHRcdFx0XHRcdFx0XHRcdHdpZHRoPXtjLnd9XG5cdFx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ9e2MuaH1cblx0XHRcdFx0XHRcdFx0XHRcdHJ4PXsyfVxuXHRcdFx0XHRcdFx0XHRcdFx0ZmlsbD1cIm5vbmVcIlxuXHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlPVwiIzZiNzI4MFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRzdHJva2Utd2lkdGg9ezF9XG5cdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHQ8dGV4dFxuXHRcdFx0XHRcdFx0XHRcdFx0eD17Yy54ICsgYy53IC8gMn1cblx0XHRcdFx0XHRcdFx0XHRcdHk9e2MueSArIGMua2V5SCAvIDJ9XG5cdFx0XHRcdFx0XHRcdFx0XHR0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiXG5cdFx0XHRcdFx0XHRcdFx0XHRkb21pbmFudC1iYXNlbGluZT1cImNlbnRyYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0ZmlsbD1cIiMzNzQxNTFcIlxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9udC1mYW1pbHk9XCJBcmlhbCwgc2Fucy1zZXJpZlwiXG5cdFx0XHRcdFx0XHRcdFx0XHRmb250LXNpemU9ezEwfVxuXHRcdFx0XHRcdFx0XHRcdFx0Zm9udC13ZWlnaHQ9XCI2MDBcIlxuXHRcdFx0XHRcdFx0XHRcdD5cblx0XHRcdFx0XHRcdFx0XHRcdHtjLmtleX1cblx0XHRcdFx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdFx0XHRcdFx0PHRleHRcblx0XHRcdFx0XHRcdFx0XHRcdHg9e2MueCArIGMudyAvIDJ9XG5cdFx0XHRcdFx0XHRcdFx0XHR5PXtjLnkgKyBjLmtleUggKyAoIGMuaCAtIGMua2V5SCApIC8gMn1cblx0XHRcdFx0XHRcdFx0XHRcdHRleHQtYW5jaG9yPVwibWlkZGxlXCJcblx0XHRcdFx0XHRcdFx0XHRcdGRvbWluYW50LWJhc2VsaW5lPVwiY2VudHJhbFwiXG5cdFx0XHRcdFx0XHRcdFx0XHRmaWxsPVwiIzExMTgyN1wiXG5cdFx0XHRcdFx0XHRcdFx0XHRmb250LWZhbWlseT1cIkFyaWFsLCBzYW5zLXNlcmlmXCJcblx0XHRcdFx0XHRcdFx0XHRcdGZvbnQtc2l6ZT17MTJ9XG5cdFx0XHRcdFx0XHRcdFx0XHRmb250LXdlaWdodD1cIjcwMFwiXG5cdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0e2MudmFsdWV9XG5cdFx0XHRcdFx0XHRcdFx0PC90ZXh0PlxuXHRcdFx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdFx0XHQpICl9XG5cblx0XHRcdFx0XHRcdHtuLnBvcnRzLm1hcCggKCBwICkgPT4ge1xuXHRcdFx0XHRcdFx0XHRpZiAoIHAuc2hhcGUgPT09IFwibm9uZVwiICkgcmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IHBGaWxsID0gcC5maWxsID8/IFwiI2ZmZlwiO1xuXHRcdFx0XHRcdFx0XHRjb25zdCBwU3Ryb2tlID0gcC5zdHJva2UgPz8gc3Ryb2tlO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRcdDxnIGtleT17cC5pZH0gY2xhc3M9XCJkb3R4LXBvcnRcIj5cblx0XHRcdFx0XHRcdFx0XHRcdHtwLnNoYXBlID09PSBcImRpYW1vbmRcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ/IChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cG9seWdvblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cG9pbnRzPXtgJHtwLnh9LCR7cC55IC0gcC5zaXplfSAke3AueCArIHAuc2l6ZX0sJHtwLnl9ICR7cC54fSwke3AueSArIHAuc2l6ZX0gJHtwLnggLSBwLnNpemV9LCR7cC55fWB9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmaWxsPXtwRmlsbH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0cm9rZT17cFN0cm9rZX1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN0cm9rZS13aWR0aD17MS41fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHRcdFx0OiBwLnNoYXBlID09PSBcInJlY3RcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ/IChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8cmVjdFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0eD17cC54IC0gcC5zaXplfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0eT17cC55IC0gcC5zaXplfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0d2lkdGg9e3Auc2l6ZSAqIDJ9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRoZWlnaHQ9e3Auc2l6ZSAqIDJ9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyeD17Mn1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw9e3BGaWxsfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlPXtwU3Ryb2tlfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoPXsxLjV9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ6IChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ8Y2lyY2xlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjeD17cC54fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y3k9e3AueX1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHI9e3Auc2l6ZX1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw9e3BGaWxsfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlPXtwU3Ryb2tlfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3Ryb2tlLXdpZHRoPXsxLjV9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lz5cblx0XHRcdFx0XHRcdFx0XHRcdFx0KX1cblx0XHRcdFx0XHRcdFx0XHRcdHtwLmxhYmVsICYmIChcblx0XHRcdFx0XHRcdFx0XHRcdFx0PHRleHRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR4PXtwLnh9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0eT17cC55fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRleHQtYW5jaG9yPVwibWlkZGxlXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkb21pbmFudC1iYXNlbGluZT1cImNlbnRyYWxcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZpbGw9e3AuY29sb3IgPz8gXCIjMTExXCJ9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9udC1mYW1pbHk9XCJBcmlhbCwgc2Fucy1zZXJpZlwiXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9udC1zaXplPXs5fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvbnQtd2VpZ2h0PVwiNzAwXCJcblx0XHRcdFx0XHRcdFx0XHRcdFx0PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHtwLmxhYmVsfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHRcdFx0XHRcdFx0XHQpfVxuXHRcdFx0XHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH0gKX1cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdCk7XG5cdFx0XHR9ICl9XG5cdFx0PC9zdmc+XG5cdCk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLHdDQUF3QztBQUN4Qyw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDs7QUFJakQsNkdBQTZHLEdBQzdHLE9BQU8sU0FBUyxjQUFlLENBQWtCO0VBQ2hELHFCQUNDLE1BQUM7SUFDQSxPQUFPLEVBQUUsS0FBSztJQUNkLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFO0lBQ3JDLE9BQU07O01BRUwsRUFBRSxJQUFJLEtBQUssMkJBQ1gsS0FBQztrQkFDQSxjQUFBLEtB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