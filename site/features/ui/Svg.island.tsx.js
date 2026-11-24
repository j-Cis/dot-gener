// @project-metadata
// Path: site/features/ui/Svg.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { DOPASOWANIA } from "@/site/scripts/registries/for-island-svg.ts";
import { usePanZoom } from "@/site/scripts/usePanZoom.ts";
export default island(import.meta.url, function Svg({ children, registryKey, background, width = "100%", height, minScale = 0.1, maxScale = 50 }) {
  const content = useRef(null);
  const apply = ()=>{
    const { x, y, s } = pz.view.current;
    if (content.current) {
      content.current.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    }
  };
  const pz = usePanZoom({
    minScale,
    maxScale,
    onChange: apply
  });
  const fit = ()=>{
    const c = content.current;
    if (c) pz.fitTo(c.offsetWidth, c.offsetHeight);
  };
  useEffect(()=>{
    fit();
    if (!registryKey) return;
    document.fonts.ready.then(()=>{
      const svg = content.current?.querySelector("svg");
      if (!svg) return;
      const dopasuj = DOPASOWANIA[registryKey];
      if (dopasuj) dopasuj(svg);
      else console.warn(`Svg: nieznany registryKey="${registryKey}"`);
    });
  }, [
    registryKey
  ]);
  return /*#__PURE__*/ _jsx("div", {
    class: "svg-box",
    children: /*#__PURE__*/ _jsxs("div", {
      ref: pz.box,
      class: pz.locked ? "box-svg is-locked" : "box-svg",
      style: {
        background,
        width,
        height: height ?? "100%",
        minHeight: height ? undefined : "200px"
      },
      onWheel: pz.handlers.onWheel,
      onPointerDown: pz.handlers.onPointerDown,
      onPointerMove: pz.handlers.onPointerMove,
      onPointerUp: pz.handlers.onPointerEnd,
      onPointerCancel: pz.handlers.onPointerEnd,
      onDblClick: pz.locked ? undefined : fit,
      children: [
        /*#__PURE__*/ _jsx("button", {
          type: "button",
          class: "box-svg-lock",
          "aria-label": pz.locked ? "Odblokuj stół" : "Zablokuj stół",
          title: pz.locked ? "Odblokuj przesuwanie i zoom" : "Zablokuj (przewijanie strony)",
          onPointerDown: (e)=>e.stopPropagation(),
          onDblClick: (e)=>e.stopPropagation(),
          onClick: pz.toggleLock,
          children: pz.locked ? "🔒" : "🔓"
        }),
        /*#__PURE__*/ _jsx("div", {
          ref: content,
          class: "box-svg-content",
          children: children
        })
      ]
    })
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvZmVhdHVyZXMvdWkvU3ZnLmlzbGFuZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvZmVhdHVyZXMvdWkvU3ZnLmlzbGFuZC50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudENoaWxkcmVuIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCI7XG5pbXBvcnQgeyBpc2xhbmQgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5pbXBvcnQgeyBET1BBU09XQU5JQSwgdHlwZSBTdmdSZWdpc3RyeUtleSB9IGZyb20gXCJAL3NpdGUvc2NyaXB0cy9yZWdpc3RyaWVzL2Zvci1pc2xhbmQtc3ZnLnRzXCI7XG5pbXBvcnQgeyB1c2VQYW5ab29tIH0gZnJvbSBcIkAvc2l0ZS9zY3JpcHRzL3VzZVBhblpvb20udHNcIjtcblxuLyoqIENTUyBsZW5ndGggZm9yIHRoZSBib3ggc2l6ZS4gKi9cbmV4cG9ydCB0eXBlIEJveExlbmd0aCA9IGAke251bWJlcn0ke1wicmVtXCIgfCBcImVtXCIgfCBcInB4XCIgfCBcIiVcIiB8IFwidndcIiB8IFwidmhcIn1gO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN2Z1Byb3BzIHtcbiAgLyoqIFNWRyBtYXJrdXA7IHJlbmRlcmVkIG9uIHRoZSBzZXJ2ZXIsIGtlcHQgYXMtaXMgaW4gdGhlIGJyb3dzZXIuICovXG4gIGNoaWxkcmVuOiBDb21wb25lbnRDaGlsZHJlbjtcbiAgLyoqIE9wY2pvbmFsbnkga2x1Y3ogZG9wYXNvd2FuaWEgeiByZWplc3RydSBTVkcuICovXG4gIHJlZ2lzdHJ5S2V5PzogU3ZnUmVnaXN0cnlLZXk7XG4gIC8qKiBDYW52YXMgYmFja2dyb3VuZCwgYW55IENTUyBjb2xvci4gKi9cbiAgYmFja2dyb3VuZD86IHN0cmluZztcbiAgLyoqIEJveCB3aWR0aC4gRGVmYXVsdCBcIjEwMCVcIi4gKi9cbiAgd2lkdGg/OiBCb3hMZW5ndGg7XG4gIC8qKlxuICAgKiBCb3ggaGVpZ2h0LiBEZWZhdWx0IFwiMTAwJVwiIHdpdGggbWluLWhlaWdodCAyMDBweDsgZmlsbGluZyB0aGUgaGVpZ2h0XG4gICAqIG5lZWRzIGEgcGFyZW50IHRoYXQgaGFzIGEgaGVpZ2h0LlxuICAgKi9cbiAgaGVpZ2h0PzogQm94TGVuZ3RoO1xuICAvKiogWm9vbSBsaW1pdHMsIHJlbGF0aXZlIHRvIHRoZSBmaXR0ZWQgdmlldy4gRGVmYXVsdCAwLjEg4oCmIDUwLiAqL1xuICBtaW5TY2FsZT86IG51bWJlcjtcbiAgbWF4U2NhbGU/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlzbGFuZChcbiAgaW1wb3J0Lm1ldGEudXJsLFxuICBmdW5jdGlvbiBTdmcoXG4gICAge1xuICAgICAgY2hpbGRyZW4sXG4gICAgICByZWdpc3RyeUtleSxcbiAgICAgIGJhY2tncm91bmQsXG4gICAgICB3aWR0aCA9IFwiMTAwJVwiLFxuICAgICAgaGVpZ2h0LFxuICAgICAgbWluU2NhbGUgPSAwLjEsXG4gICAgICBtYXhTY2FsZSA9IDUwLFxuICAgIH06IFN2Z1Byb3BzLFxuICApIHtcbiAgICBjb25zdCBjb250ZW50ID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcblxuICAgIGNvbnN0IGFwcGx5ID0gKCkgPT4ge1xuICAgICAgY29uc3QgeyB4LCB5LCBzIH0gPSBwei52aWV3LmN1cnJlbnQ7XG4gICAgICBpZiAoY29udGVudC5jdXJyZW50KSB7XG4gICAgICAgIGNvbnRlbnQuY3VycmVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7eH1weCwgJHt5fXB4KSBzY2FsZSgke3N9KWA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHB6ID0gdXNlUGFuWm9vbSh7IG1pblNjYWxlLCBtYXhTY2FsZSwgb25DaGFuZ2U6IGFwcGx5IH0pO1xuXG4gICAgY29uc3QgZml0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgYyA9IGNvbnRlbnQuY3VycmVudDtcbiAgICAgIGlmIChjKSBwei5maXRUbyhjLm9mZnNldFdpZHRoLCBjLm9mZnNldEhlaWdodCk7XG4gICAgfTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBmaXQoKTtcbiAgICAgIGlmICghcmVnaXN0cnlLZXkpIHJldHVybjtcbiAgICAgIGRvY3VtZW50LmZvbnRzLnJlYWR5LnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zdCBzdmcgPSBjb250ZW50LmN1cnJlbnQ/LnF1ZXJ5U2VsZWN0b3I8U1ZHU1ZHRWxlbWVudD4oXCJzdmdcIik7XG4gICAgICAgIGlmICghc3ZnKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGRvcGFzdWogPSBET1BBU09XQU5JQVtyZWdpc3RyeUtleV07XG4gICAgICAgIGlmIChkb3Bhc3VqKSBkb3Bhc3VqKHN2Zyk7XG4gICAgICAgIGVsc2UgY29uc29sZS53YXJuKGBTdmc6IG5pZXpuYW55IHJlZ2lzdHJ5S2V5PVwiJHtyZWdpc3RyeUtleX1cImApO1xuICAgICAgfSk7XG4gICAgfSwgW3JlZ2lzdHJ5S2V5XSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzcz1cInN2Zy1ib3hcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj17cHouYm94fVxuICAgICAgICAgIGNsYXNzPXtwei5sb2NrZWQgPyBcImJveC1zdmcgaXMtbG9ja2VkXCIgOiBcImJveC1zdmdcIn1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZCxcbiAgICAgICAgICAgIHdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQgPz8gXCIxMDAlXCIsXG4gICAgICAgICAgICBtaW5IZWlnaHQ6IGhlaWdodCA/IHVuZGVmaW5lZCA6IFwiMjAwcHhcIixcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uV2hlZWw9e3B6LmhhbmRsZXJzLm9uV2hlZWx9XG4gICAgICAgICAgb25Qb2ludGVyRG93bj17cHouaGFuZGxlcnMub25Qb2ludGVyRG93bn1cbiAgICAgICAgICBvblBvaW50ZXJNb3ZlPXtwei5oYW5kbGVycy5vblBvaW50ZXJNb3ZlfVxuICAgICAgICAgIG9uUG9pbnRlclVwPXtwei5oYW5kbGVycy5vblBvaW50ZXJFbmR9XG4gICAgICAgICAgb25Qb2ludGVyQ2FuY2VsPXtwei5oYW5kbGVycy5vblBvaW50ZXJFbmR9XG4gICAgICAgICAgb25EYmxDbGljaz17cHoubG9ja2VkID8gdW5kZWZpbmVkIDogZml0fVxuICAgICAgICA+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBjbGFzcz1cImJveC1zdmctbG9ja1wiXG4gICAgICAgICAgICBhcmlhLWxhYmVsPXtwei5sb2NrZWQgPyBcIk9kYmxva3VqIHN0w7PFglwiIDogXCJaYWJsb2t1aiBzdMOzxYJcIn1cbiAgICAgICAgICAgIHRpdGxlPXtwei5sb2NrZWQgPyBcIk9kYmxva3VqIHByemVzdXdhbmllIGkgem9vbVwiIDogXCJaYWJsb2t1aiAocHJ6ZXdpamFuaWUgc3Ryb255KVwifVxuICAgICAgICAgICAgb25Qb2ludGVyRG93bj17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICBvbkRibENsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3B6LnRvZ2dsZUxvY2t9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3B6LmxvY2tlZCA/IFwi8J+UklwiIDogXCLwn5STXCJ9XG4gICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICA8ZGl2IHJlZj17Y29udGVudH0gY2xhc3M9XCJib3gtc3ZnLWNvbnRlbnRcIj57Y2hpbGRyZW59PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcbik7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLHdDQUF3QztBQUN4Qyw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDs7QUFHakQsU0FBUyxTQUFTLEVBQUUsTUFBTSxRQUFRLGVBQWU7QUFDakQsU0FBUyxNQUFNLFFBQVEsa0JBQWtCO0FBQ3pDLFNBQVMsV0FBVyxRQUE2Qiw4Q0FBOEM7QUFDL0YsU0FBUyxVQUFVLFFBQVEsK0JBQStCO0FBd0IxRCxlQUFlLE9BQ2IsWUFBWSxHQUFHLEVBQ2YsU0FBUyxJQUNQLEVBQ0UsUUFBUSxFQUNSLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxNQUFNLEVBQ2QsTUFBTSxFQUNOLFdBQVcsR0FBRyxFQUNkLFdBQVcsRUFBRSxFQUNKO0VBRVgsTUFBTSxVQUFVLE9BQXVCO0VBRXZDLE1BQU0sUUFBUTtJQUNaLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU87SUFDbkMsSUFBSSxRQUFRLE9BQU8sRUFBRTtNQUNuQixRQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzNFO0VBQ0Y7RUFFQSxNQUFNLEtBQUssV0FBVztJQUFFO0lBQVU7SUFBVSxVQUFVO0VBQU07RUFFNUQsTUFBTSxNQUFNO0lBQ1YsTUFBTSxJQUFJLFFBQVEsT0FBTztJQUN6QixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxZQUFZO0VBQy9DO0VBRUEsVUFBVTtJQUNSO0lBQ0EsSUFBSSxDQUFDLGFBQWE7SUFDbEIsU0FBUyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztNQUN4QixNQUFNLE1BQU0sUUFBUSxPQUFPLEVBQUUsY0FBNkI7TUFDMUQsSUFBSSxDQUFDLEtBQUs7TUFDVixNQUFNLFVBQVUsV0FBVyxDQUFDLFlBQVk7TUFDeEMsSUFBSSxTQUFTLFFBQVE7V0FDaEIsUUFBUSxJQUFJLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRTtFQUNGLEdBQUc7SUFBQztHQUFZO0VBRWhCLHFCQUNFLEtBQUM7SUFBSSxPQUFNO2NBQ1QsY0FBQSxNQUFDO01BQ0MsS0FBSyxHQUFHLEdBQUc7TUFDWCxPQUFPLEdBQUcsTUFBTSxHQUFHLHNCQUFzQjtNQUN6QyxPQUFPO1FBQ0w7UUFDQTtRQUNBLFFBQVEsVUFBVTtRQUNsQixXQUFXLFNBQVMsWUFBWTtNQUNsQztNQUNBLFNBQVMsR0FBRyxRQUFRLENBQUMsT0FBTztNQUM1QixlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWE7TUFDeEMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhO01BQ3hDLGFBQWEsR0FBRyxRQUFRLENBQUMsWUFBWTtNQUNyQyxpQkFBaUIsR0FBRyxRQUFRLENBQUMsWUFBWTtNQUN6QyxZQUFZLEdBQUcsTUFBTSxHQUFHLFlBQVk7O3NCQUVwQyxLQUFDO1VBQ0MsTUFBSztVQUNMLE9BQU07VUFDTixjQUFZLEdBQUcsTUFBTSxHQUFHLGtCQUFrQjtVQUMxQyxPQUFPLEdBQUcsTUFBTSxHQUFHLGdDQUFnQztVQUNuRCxlQUFlLENBQUMsSUFBTSxFQUFFLGVBQWU7VUFDdkMsWUFBWSxDQUFDLElBQU0sRUFBRSxlQUFlO1VBQ3BDLFNBQVMsR0FBRyxVQUFVO29CQUVyQixHQUFHLE1BQU0sR0FBRyxPQUFPOztzQkFHdEIsS0FBQztVQUFJLEtBQUs7VUFBUyxPQUFNO29CQUFtQjs7Ozs7QUFJcEQsR0FDQSJ9