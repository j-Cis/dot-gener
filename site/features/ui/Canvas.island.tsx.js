import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
// @project-metadata
// Path: site/features/ui/Canvas.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { RYSUNKI } from "@/site/scripts/registries/for-island-canvas.ts";
import { usePanZoom } from "@/site/scripts/usePanZoom.ts";
export default island(import.meta.url, function Canvas({ registryKey, dane, sceneWidth, sceneHeight, background, width = "100%", height, minScale = 0.1, maxScale = 50 }) {
  const canvas = useRef(null);
  const raf = useRef(null);
  const draw = ()=>{
    raf.current = null;
    const b = pz.box.current, el = canvas.current;
    if (!b || !el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const drawer = RYSUNKI[registryKey];
    if (!drawer) {
      console.warn(`Canvas: nieznany registryKey="${registryKey}"`);
      return;
    }
    const dpr = globalThis.devicePixelRatio || 1;
    const w = b.clientWidth;
    const h = b.clientHeight;
    const pw = Math.max(1, Math.round(w * dpr));
    const ph = Math.max(1, Math.round(h * dpr));
    if (el.width !== pw || el.height !== ph) {
      el.width = pw;
      el.height = ph;
    }
    const v = pz.view.current;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.translate(v.x, v.y);
    ctx.scale(v.s, v.s);
    drawer({
      ctx,
      view: v,
      width: w,
      height: h,
      dpr,
      dane
    });
    ctx.restore();
  };
  const scheduleDraw = ()=>{
    if (raf.current === null) {
      raf.current = requestAnimationFrame(draw);
    }
  };
  const pz = usePanZoom({
    minScale,
    maxScale,
    onChange: scheduleDraw
  });
  const fit = ()=>pz.fitTo(sceneWidth, sceneHeight);
  useEffect(()=>{
    const b = pz.box.current;
    if (!b) return;
    fit();
    document.fonts.ready.then(scheduleDraw);
    const ro = new ResizeObserver(()=>scheduleDraw());
    ro.observe(b);
    return ()=>{
      ro.disconnect();
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [
    registryKey,
    dane,
    sceneWidth,
    sceneHeight
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
        /*#__PURE__*/ _jsx("canvas", {
          ref: canvas,
          class: "box-canvas"
        })
      ]
    })
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvZmVhdHVyZXMvdWkvQ2FudmFzLmlzbGFuZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHNpdGUvZmVhdHVyZXMvdWkvQ2FudmFzLmlzbGFuZC50c3hcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCB7IGlzbGFuZCB9IGZyb20gXCJAL3dlYi9pc2xhbmQudHNcIjtcbmltcG9ydCB7IFJZU1VOS0kgfSBmcm9tIFwiQC9zaXRlL3NjcmlwdHMvcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50c1wiO1xuaW1wb3J0IHsgdXNlUGFuWm9vbSB9IGZyb20gXCJAL3NpdGUvc2NyaXB0cy91c2VQYW5ab29tLnRzXCI7XG5pbXBvcnQgdHlwZSB7IEJveExlbmd0aCB9IGZyb20gXCIuL1N2Zy5pc2xhbmQudHN4XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FudmFzVmlldyB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBzOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FudmFzRHJhd0NvbnRleHQge1xuICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgdmlldzogQ2FudmFzVmlldztcbiAgLyoqIFJvem1pYXIgcMWCw7N0bmEgdyBwaWtzZWxhY2ggQ1NTLiAqL1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgZHByOiBudW1iZXI7XG4gIGRhbmU/OiB1bmtub3duO1xufVxuXG5leHBvcnQgdHlwZSBDYW52YXNEcmF3ZXIgPSAoYzogQ2FudmFzRHJhd0NvbnRleHQpID0+IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FudmFzUHJvcHMge1xuICAvKiogTmF6d2EgZnVua2NqaSByeXN1asSFY2VqIHphcmVqZXN0cm93YW5laiB3IHJlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHMuICovXG4gIHJlZ2lzdHJ5S2V5OiBzdHJpbmc7XG4gIC8qKiBPcGNqb25hbG5lIGRhbmUgcHJ6ZWthenl3YW5lIGRvIGZ1bmtjamkgcnlzdWrEhWNlaiAobXVzesSFIGJ5xIcgc2VyaWFsaXpvd2FsbmUpLiAqL1xuICBkYW5lPzogdW5rbm93bjtcbiAgLyoqIExvZ2ljem5lIHd5bWlhcnkgc2NlbnkgKHXFvHl3YW5lIHByemV6IGZpdCgpIGRvIHd5xZtyb2Rrb3dhbmlhIGkgc2thbG93YW5pYSkuICovXG4gIHNjZW5lV2lkdGg6IG51bWJlcjtcbiAgc2NlbmVIZWlnaHQ6IG51bWJlcjtcbiAgLyoqIFTFgm8gc3RvxYJ1LCBkb3dvbG55IGtvbG9yIENTUy4gKi9cbiAgYmFja2dyb3VuZD86IHN0cmluZztcbiAgLyoqIFN6ZXJva2/Fm8SHIGtvbnRlbmVyYS4gRG9tecWbbG5pZSBcIjEwMCVcIi4gKi9cbiAgd2lkdGg/OiBCb3hMZW5ndGg7XG4gIC8qKiBXeXNva2/Fm8SHIGtvbnRlbmVyYS4gRG9tecWbbG5pZSBcIjEwMCVcIiB6IG1pbi1oZWlnaHQgMjAwcHguICovXG4gIGhlaWdodD86IEJveExlbmd0aDtcbiAgLyoqIExpbWl0eSBwb3dpxJlrc3plbmlhIHd6Z2zEmWRlbSB3aWRva3UgZG9wYXNvd2FuZWdvLiBEb215xZtsbmllIDAuMSDigKYgNTAuICovXG4gIG1pblNjYWxlPzogbnVtYmVyO1xuICBtYXhTY2FsZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNsYW5kKFxuICBpbXBvcnQubWV0YS51cmwsXG4gIGZ1bmN0aW9uIENhbnZhcyhcbiAgICB7XG4gICAgICByZWdpc3RyeUtleSxcbiAgICAgIGRhbmUsXG4gICAgICBzY2VuZVdpZHRoLFxuICAgICAgc2NlbmVIZWlnaHQsXG4gICAgICBiYWNrZ3JvdW5kLFxuICAgICAgd2lkdGggPSBcIjEwMCVcIixcbiAgICAgIGhlaWdodCxcbiAgICAgIG1pblNjYWxlID0gMC4xLFxuICAgICAgbWF4U2NhbGUgPSA1MCxcbiAgICB9OiBDYW52YXNQcm9wcyxcbiAgKSB7XG4gICAgY29uc3QgY2FudmFzID0gdXNlUmVmPEhUTUxDYW52YXNFbGVtZW50PihudWxsKTtcbiAgICBjb25zdCByYWYgPSB1c2VSZWY8bnVtYmVyIHwgbnVsbD4obnVsbCk7XG5cbiAgICBjb25zdCBkcmF3ID0gKCkgPT4ge1xuICAgICAgcmFmLmN1cnJlbnQgPSBudWxsO1xuICAgICAgY29uc3QgYiA9IHB6LmJveC5jdXJyZW50LCBlbCA9IGNhbnZhcy5jdXJyZW50O1xuICAgICAgaWYgKCFiIHx8ICFlbCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjdHggPSBlbC5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBpZiAoIWN0eCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBkcmF3ZXIgPSBSWVNVTktJW3JlZ2lzdHJ5S2V5XTtcbiAgICAgIGlmICghZHJhd2VyKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgQ2FudmFzOiBuaWV6bmFueSByZWdpc3RyeUtleT1cIiR7cmVnaXN0cnlLZXl9XCJgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkcHIgPSBnbG9iYWxUaGlzLmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAgIGNvbnN0IHcgPSBiLmNsaWVudFdpZHRoO1xuICAgICAgY29uc3QgaCA9IGIuY2xpZW50SGVpZ2h0O1xuICAgICAgY29uc3QgcHcgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKHcgKiBkcHIpKTtcbiAgICAgIGNvbnN0IHBoID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChoICogZHByKSk7XG5cbiAgICAgIGlmIChlbC53aWR0aCAhPT0gcHcgfHwgZWwuaGVpZ2h0ICE9PSBwaCkge1xuICAgICAgICBlbC53aWR0aCA9IHB3O1xuICAgICAgICBlbC5oZWlnaHQgPSBwaDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdiA9IHB6LnZpZXcuY3VycmVudDtcbiAgICAgIGN0eC5zYXZlKCk7XG4gICAgICBjdHguc2V0VHJhbnNmb3JtKGRwciwgMCwgMCwgZHByLCAwLCAwKTtcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdywgaCk7XG5cbiAgICAgIGN0eC50cmFuc2xhdGUodi54LCB2LnkpO1xuICAgICAgY3R4LnNjYWxlKHYucywgdi5zKTtcblxuICAgICAgZHJhd2VyKHsgY3R4LCB2aWV3OiB2LCB3aWR0aDogdywgaGVpZ2h0OiBoLCBkcHIsIGRhbmUgfSk7XG4gICAgICBjdHgucmVzdG9yZSgpO1xuICAgIH07XG5cbiAgICBjb25zdCBzY2hlZHVsZURyYXcgPSAoKSA9PiB7XG4gICAgICBpZiAocmFmLmN1cnJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgcmFmLmN1cnJlbnQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHB6ID0gdXNlUGFuWm9vbSh7IG1pblNjYWxlLCBtYXhTY2FsZSwgb25DaGFuZ2U6IHNjaGVkdWxlRHJhdyB9KTtcblxuICAgIGNvbnN0IGZpdCA9ICgpID0+IHB6LmZpdFRvKHNjZW5lV2lkdGgsIHNjZW5lSGVpZ2h0KTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBjb25zdCBiID0gcHouYm94LmN1cnJlbnQ7XG4gICAgICBpZiAoIWIpIHJldHVybjtcblxuICAgICAgZml0KCk7XG4gICAgICBkb2N1bWVudC5mb250cy5yZWFkeS50aGVuKHNjaGVkdWxlRHJhdyk7XG5cbiAgICAgIGNvbnN0IHJvID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHNjaGVkdWxlRHJhdygpKTtcbiAgICAgIHJvLm9ic2VydmUoYik7XG5cbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHJvLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgaWYgKHJhZi5jdXJyZW50ICE9PSBudWxsKSBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYuY3VycmVudCk7XG4gICAgICB9O1xuICAgIH0sIFtyZWdpc3RyeUtleSwgZGFuZSwgc2NlbmVXaWR0aCwgc2NlbmVIZWlnaHRdKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzPVwic3ZnLWJveFwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPXtwei5ib3h9XG4gICAgICAgICAgY2xhc3M9e3B6LmxvY2tlZCA/IFwiYm94LXN2ZyBpcy1sb2NrZWRcIiA6IFwiYm94LXN2Z1wifVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCA/PyBcIjEwMCVcIixcbiAgICAgICAgICAgIG1pbkhlaWdodDogaGVpZ2h0ID8gdW5kZWZpbmVkIDogXCIyMDBweFwiLFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25XaGVlbD17cHouaGFuZGxlcnMub25XaGVlbH1cbiAgICAgICAgICBvblBvaW50ZXJEb3duPXtwei5oYW5kbGVycy5vblBvaW50ZXJEb3dufVxuICAgICAgICAgIG9uUG9pbnRlck1vdmU9e3B6LmhhbmRsZXJzLm9uUG9pbnRlck1vdmV9XG4gICAgICAgICAgb25Qb2ludGVyVXA9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cbiAgICAgICAgICBvblBvaW50ZXJDYW5jZWw9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cbiAgICAgICAgICBvbkRibENsaWNrPXtwei5sb2NrZWQgPyB1bmRlZmluZWQgOiBmaXR9XG4gICAgICAgID5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYm94LXN2Zy1sb2NrXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogc3TDs8WCXCIgOiBcIlphYmxva3VqIHN0w7PFglwifVxuICAgICAgICAgICAgdGl0bGU9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogcHJ6ZXN1d2FuaWUgaSB6b29tXCIgOiBcIlphYmxva3VqIChwcnpld2lqYW5pZSBzdHJvbnkpXCJ9XG4gICAgICAgICAgICBvblBvaW50ZXJEb3duPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgIG9uRGJsQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgb25DbGljaz17cHoudG9nZ2xlTG9ja31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cHoubG9ja2VkID8gXCLwn5SSXCIgOiBcIvCflJNcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgIDxjYW52YXMgcmVmPXtjYW52YXN9IGNsYXNzPVwiYm94LWNhbnZhc1wiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcbik7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG9CQUFvQjtBQUNwQiwyQ0FBMkM7QUFDM0MsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFFakQsU0FBUyxTQUFTLEVBQUUsTUFBTSxRQUFRLGVBQWU7QUFDakQsU0FBUyxNQUFNLFFBQVEsa0JBQWtCO0FBQ3pDLFNBQVMsT0FBTyxRQUFRLGlEQUFpRDtBQUN6RSxTQUFTLFVBQVUsUUFBUSwrQkFBK0I7QUF3QzFELGVBQWUsT0FDYixZQUFZLEdBQUcsRUFDZixTQUFTLE9BQ1AsRUFDRSxXQUFXLEVBQ1gsSUFBSSxFQUNKLFVBQVUsRUFDVixXQUFXLEVBQ1gsVUFBVSxFQUNWLFFBQVEsTUFBTSxFQUNkLE1BQU0sRUFDTixXQUFXLEdBQUcsRUFDZCxXQUFXLEVBQUUsRUFDRDtFQUVkLE1BQU0sU0FBUyxPQUEwQjtFQUN6QyxNQUFNLE1BQU0sT0FB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