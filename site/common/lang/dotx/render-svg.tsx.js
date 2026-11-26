// @project-metadata
// Path: site/common/lang/dotx/render-svg.tsx
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY29tbW9uL2xhbmcvZG90eC9yZW5kZXItc3ZnLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAcHJvamVjdC1tZXRhZGF0YVxuLy8gUGF0aDogc2l0ZS9jb21tb24vbGFuZy9kb3R4L3JlbmRlci1zdmcudHN4XG4vLyBBdXRob3I6IEphbiBSb21hbiBDaXNvd3NraVxuLy8gT1JDSUQ6IGh0dHBzOi8vb3JjaWQub3JnLzAwMDktMDAwOS0yOTA3LTM3OTJcbi8vIFJlcG9zaXRvcnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9qLUNpcy9kb3QtZ2VuZXJcblxuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbmVkR3JhcGggfSBmcm9tIFwiLi9tb2RlbC50c1wiO1xuXG4vKiogR3JhZiBET1RYIHogd3lsaWN6b255bSB1a8WCYWRlbSDihpIgU1ZHIChwYXJhIGRsYSBkcmF3RG90eENhbnZhcyB6IHJlbmRlci1jYW52YXMudHMpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckRvdHhTdmcoZzogUG9zaXRpb25lZEdyYXBoKSB7XG4gIHJldHVybiAoXG4gICAgPHN2Z1xuICAgICAgd2lkdGg9e2cud2lkdGh9XG4gICAgICBoZWlnaHQ9e2cuaGVpZ2h0fVxuICAgICAgdmlld0JveD17YDAgMCAke2cud2lkdGh9ICR7Zy5oZWlnaHR9YH1cbiAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgID5cbiAgICAgIHtnLm1vZGUgPT09IFwiZGlncmFwaFwiICYmIChcbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPG1hcmtlclxuICAgICAgICAgICAgaWQ9XCJkb3R4LWFycm93XCJcbiAgICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAgMTBcIlxuICAgICAgICAgICAgcmVmWD1cIjlcIlxuICAgICAgICAgICAgcmVmWT1cIjVcIlxuICAgICAgICAgICAgbWFya2VyV2lkdGg9XCI2XCJcbiAgICAgICAgICAgIG1hcmtlckhlaWdodD1cIjZcIlxuICAgICAgICAgICAgb3JpZW50PVwiYXV0by1zdGFydC1yZXZlcnNlXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTSAwIDAgTCAxMCA1IEwgMCAxMCB6XCIgZmlsbD1cIiMzMzNcIiAvPlxuICAgICAgICAgIDwvbWFya2VyPlxuICAgICAgICA8L2RlZnM+XG4gICAgICApfVxuXG4gICAgICB7Zy5jbHVzdGVycy5tYXAoKGMpID0+IChcbiAgICAgICAgPGcga2V5PXtjLmlkfSBjbGFzcz1cImRvdHgtY2x1c3RlclwiPlxuICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICB4PXtjLnh9XG4gICAgICAgICAgICB5PXtjLnl9XG4gICAgICAgICAgICB3aWR0aD17Yy53fVxuICAgICAgICAgICAgaGVpZ2h0PXtjLmh9XG4gICAgICAgICAgICByeD17Nn1cbiAgICAgICAgICAgIGZpbGw9e2MuYXR0cnMuZmlsbCA/PyBcInJnYmEoMCwwLDAsMC4wMylcIn1cbiAgICAgICAgICAgIHN0cm9rZT17Yy5hdHRycy5zdHJva2UgPz8gXCIjOTk5XCJ9XG4gICAgICAgICAgICBzdHJva2UtZGFzaGFycmF5PVwiNCAzXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICApKX1cblxuICAgICAge2cuZWRnZXMubWFwKChlLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGQgPSBlLnBvaW50c1xuICAgICAgICAgIC5tYXAoKFt4LCB5XSwgaWR4KSA9PiBgJHtpZHggPT09IDAgPyBcIk1cIiA6IFwiTFwifSAke3h9ICR7eX1gKVxuICAgICAgICAgIC5qb2luKFwiIFwiKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAga2V5PXtgJHtlLmZyb219LSR7ZS50b30tJHtpfWB9XG4gICAgICAgICAgICBkPXtkfVxuICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgc3Ryb2tlPXtlLmF0dHJzLnN0cm9rZSA/PyBcIiMzMzNcIn1cbiAgICAgICAgICAgIHN0cm9rZS13aWR0aD17MS41fVxuICAgICAgICAgICAgc3Ryb2tlLWRhc2hhcnJheT17ZS5hdHRycy5kYXNoZWQgPyBcIjQgM1wiIDogdW5kZWZpbmVkfVxuICAgICAgICAgICAgbWFya2VyLWVuZD17Zy5tb2RlID09PSBcImRpZ3JhcGhcIiA/IFwidXJsKCNkb3R4LWFycm93KVwiIDogdW5kZWZpbmVkfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICB9KX1cblxuICAgICAge2cubm9kZXMubWFwKChuKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhc0NlbGxzID0gbi5jZWxscy5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBzdHJva2UgPSBuLmF0dHJzLnN0cm9rZSA/PyBcIiMzMzNcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZyBrZXk9e24uaWR9IGNsYXNzPVwiZG90eC1ub2RlXCI+XG4gICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICB4PXtuLnh9XG4gICAgICAgICAgICAgIHk9e24ueX1cbiAgICAgICAgICAgICAgd2lkdGg9e24ud31cbiAgICAgICAgICAgICAgaGVpZ2h0PXtuLmh9XG4gICAgICAgICAgICAgIHJ4PXtuLmF0dHJzLnNoYXBlID09PSBcImJveFwiIHx8IGhhc0NlbGxzID8gNiA6IDIyfVxuICAgICAgICAgICAgICBmaWxsPXtuLmF0dHJzLmZpbGwgPz8gXCIjZmZmXCJ9XG4gICAgICAgICAgICAgIHN0cm9rZT17c3Ryb2tlfVxuICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9ezEuNX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8dGV4dFxuICAgICAgICAgICAgICB4PXtuLnggKyBuLncgLyAyfVxuICAgICAgICAgICAgICB5PXtoYXNDZWxscyA/IG4ueSArIDE1IDogbi55ICsgbi5oIC8gMn1cbiAgICAgICAgICAgICAgdGV4dC1hbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgICAgICBkb21pbmFudC1iYXNlbGluZT1cImNlbnRyYWxcIlxuICAgICAgICAgICAgICBmaWxsPXtuLmF0dHJzLmNvbG9yID8/IFwiIzExMVwifVxuICAgICAgICAgICAgICBmb250LWZhbWlseT1cIkFyaWFsLCBzYW5zLXNlcmlmXCJcbiAgICAgICAgICAgICAgZm9udC13ZWlnaHQ9e2hhc0NlbGxzID8gXCI3MDBcIiA6IFwiNDAwXCJ9XG4gICAgICAgICAgICAgIGZvbnQtc2l6ZT17MTN9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtuLmF0dHJzLmxhYmVsID8/IG4uaWR9XG4gICAgICAgICAgICA8L3RleHQ+XG5cbiAgICAgICAgICAgIHtuLmNlbGxzLm1hcCgoYykgPT4gKFxuICAgICAgICAgICAgICA8ZyBrZXk9e2Mua2V5fSBjbGFzcz1cImRvdHgtY2VsbFwiPlxuICAgICAgICAgICAgICAgIDxyZWN0IHg9e2MueH0geT17Yy55fSB3aWR0aD17Yy53fSBoZWlnaHQ9e2Mua2V5SH0gZmlsbD1cIiNlNWU3ZWJcIiAvPlxuICAgICAgICAgICAgICAgIDxyZWN0IHg9e2MueH0geT17Yy55ICsgYy5rZXlIfSB3aWR0aD17Yy53fSBoZWlnaHQ9e2MuaCAtIGMua2V5SH0gZmlsbD1cIiNmZmZmZmZcIiAvPlxuICAgICAgICAgICAgICAgIDxsaW5lXG4gICAgICAgICAgICAgICAgICB4MT17Yy54fVxuICAgICAgICAgICAgICAgICAgeTE9e2MueSArIGMua2V5SH1cbiAgICAgICAgICAgICAgICAgIHgyPXtjLnggKyBjLnd9XG4gICAgICAgICAgICAgICAgICB5Mj17Yy55ICsgYy5rZXlIfVxuICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzljYTNhZlwiXG4gICAgICAgICAgICAgICAgICBzdHJva2Utd2lkdGg9ezAuNzV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICAgICAgeD17Yy54fVxuICAgICAgICAgICAgICAgICAgeT17Yy55fVxuICAgICAgICAgICAgICAgICAgd2lkdGg9e2Mud31cbiAgICAgICAgICAgICAgICAgIGhlaWdodD17Yy5ofVxuICAgICAgICAgICAgICAgICAgcng9ezJ9XG4gICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICBzdHJva2U9XCIjNmI3MjgwXCJcbiAgICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD17MX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDx0ZXh0XG4gICAgICAgICAgICAgICAgICB4PXtjLnggKyBjLncgLyAyfVxuICAgICAgICAgICAgICAgICAgeT17Yy55ICsgYy5rZXlIIC8gMn1cbiAgICAgICAgICAgICAgICAgIHRleHQtYW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgIGRvbWluYW50LWJhc2VsaW5lPVwiY2VudHJhbFwiXG4gICAgICAgICAgICAgICAgICBmaWxsPVwiIzM3NDE1MVwiXG4gICAgICAgICAgICAgICAgICBmb250LWZhbWlseT1cIkFyaWFsLCBzYW5zLXNlcmlmXCJcbiAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZT17MTB9XG4gICAgICAgICAgICAgICAgICBmb250LXdlaWdodD1cIjYwMFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2Mua2V5fVxuICAgICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgICAgICA8dGV4dFxuICAgICAgICAgICAgICAgICAgeD17Yy54ICsgYy53IC8gMn1cbiAgICAgICAgICAgICAgICAgIHk9e2MueSArIGMua2V5SCArIChjLmggLSBjLmtleUgpIC8gMn1cbiAgICAgICAgICAgICAgICAgIHRleHQtYW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgIGRvbWluYW50LWJhc2VsaW5lPVwiY2VudHJhbFwiXG4gICAgICAgICAgICAgICAgICBmaWxsPVwiIzExMTgyN1wiXG4gICAgICAgICAgICAgICAgICBmb250LWZhbWlseT1cIkFyaWFsLCBzYW5zLXNlcmlmXCJcbiAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZT17MTJ9XG4gICAgICAgICAgICAgICAgICBmb250LXdlaWdodD1cIjcwMFwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2MudmFsdWV9XG4gICAgICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICApKX1cblxuICAgICAgICAgICAge24ucG9ydHMubWFwKChwKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChwLnNoYXBlID09PSBcIm5vbmVcIikgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgIGNvbnN0IHBGaWxsID0gcC5maWxsID8/IFwiI2ZmZlwiO1xuICAgICAgICAgICAgICBjb25zdCBwU3Ryb2tlID0gcC5zdHJva2UgPz8gc3Ryb2tlO1xuICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIDxnIGtleT17cC5pZH0gY2xhc3M9XCJkb3R4LXBvcnRcIj5cbiAgICAgICAgICAgICAgICAgIHtwLnNoYXBlID09PSBcImRpYW1vbmRcIlxuICAgICAgICAgICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgICAgICAgICA8cG9seWdvblxuICAgICAgICAgICAgICAgICAgICAgICAgcG9pbnRzPXtgJHtwLnh9LCR7cC55IC0gcC5zaXplfSAke3AueCArIHAuc2l6ZX0sJHtwLnl9ICR7cC54fSwke3AueSArIHAuc2l6ZX0gJHtwLnggLSBwLnNpemV9LCR7cC55fWB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsPXtwRmlsbH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZT17cFN0cm9rZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZS13aWR0aD17MS41fVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgOiBwLnNoYXBlID09PSBcInJlY3RcIlxuICAgICAgICAgICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgeD17cC54IC0gcC5zaXplfVxuICAgICAgICAgICAgICAgICAgICAgICAgeT17cC55IC0gcC5zaXplfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg9e3Auc2l6ZSAqIDJ9XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ9e3Auc2l6ZSAqIDJ9XG4gICAgICAgICAgICAgICAgICAgICAgICByeD17Mn1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9e3BGaWxsfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwU3Ryb2tlfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPXsxLjV9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlXG4gICAgICAgICAgICAgICAgICAgICAgICBjeD17cC54fVxuICAgICAgICAgICAgICAgICAgICAgICAgY3k9e3AueX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHI9e3Auc2l6ZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGw9e3BGaWxsfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPXtwU3Ryb2tlfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlLXdpZHRoPXsxLjV9XG4gICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIHtwLmxhYmVsICYmIChcbiAgICAgICAgICAgICAgICAgICAgPHRleHRcbiAgICAgICAgICAgICAgICAgICAgICB4PXtwLnh9XG4gICAgICAgICAgICAgICAgICAgICAgeT17cC55fVxuICAgICAgICAgICAgICAgICAgICAgIHRleHQtYW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICBkb21pbmFudC1iYXNlbGluZT1cImNlbnRyYWxcIlxuICAgICAgICAgICAgICAgICAgICAgIGZpbGw9e3AuY29sb3IgPz8gXCIjMTExXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgZm9udC1mYW1pbHk9XCJBcmlhbCwgc2Fucy1zZXJpZlwiXG4gICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplPXs5fVxuICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0PVwiNzAwXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHtwLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKTtcbiAgICAgIH0pfVxuICAgIDwvc3ZnPlxuICApO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQiw2Q0FBNkM7QUFDN0MsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7O0FBSWpELHVGQUF1RixHQUN2RixPQUFPLFNBQVMsY0FBYyxDQUFrQjtFQUM5QyxxQkFDRSxNQUFDO0lBQ0MsT0FBTyxFQUFFLEtBQUs7SUFDZCxRQUFRLEVBQUUsTUFBTTtJQUNoQixTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRTtJQUNyQyxPQUFNOztNQUVMLEVBQUUsSUFBSSxLQUFLLDJCQUNWLEtBQUM7a0JBQ0MsY0FBQSxLQUFDO1VBQ0MsSUFBRztVQUNILFNBQVE7VUFDUixNQUFLO1VBQ0wsTUFBSztVQUNMLGFBQVk7VUFDWixjQUFhO1VBQ2Is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