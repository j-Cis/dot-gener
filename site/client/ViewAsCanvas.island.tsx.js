import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
// @project-metadata
// Path: site/client/ViewAsCanvas.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { RYSUNKI } from "@/site/client/registries/for-island-canvas.ts";
import { usePanZoom } from "@/site/common/util/usePanZoom.ts";
export default island(import.meta.url, function ViewAsCanvas({ registryKey, dane, sceneWidth, sceneHeight, background, width = "100%", height, minScale = 0.1, maxScale = 50 }) {
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
      console.warn(`ViewAsCanvas: nieznany registryKey="${registryKey}"`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L1ZpZXdBc0NhbnZhcy5pc2xhbmQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIEBwcm9qZWN0LW1ldGFkYXRhXG4vLyBQYXRoOiBzaXRlL2NsaWVudC9WaWV3QXNDYW52YXMuaXNsYW5kLnRzeFxuLy8gQXV0aG9yOiBKYW4gUm9tYW4gQ2lzb3dza2lcbi8vIE9SQ0lEOiBodHRwczovL29yY2lkLm9yZy8wMDA5LTAwMDktMjkwNy0zNzkyXG4vLyBSZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vai1DaXMvZG90LWdlbmVyXG5cbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSBcInByZWFjdC9ob29rc1wiO1xuaW1wb3J0IHsgaXNsYW5kIH0gZnJvbSBcIkAvd2ViL2lzbGFuZC50c1wiO1xuaW1wb3J0IHsgUllTVU5LSSB9IGZyb20gXCJAL3NpdGUvY2xpZW50L3JlZ2lzdHJpZXMvZm9yLWlzbGFuZC1jYW52YXMudHNcIjtcbmltcG9ydCB7IHVzZVBhblpvb20gfSBmcm9tIFwiQC9zaXRlL2NvbW1vbi91dGlsL3VzZVBhblpvb20udHNcIjtcbmltcG9ydCB0eXBlIHsgQm94TGVuZ3RoIH0gZnJvbSBcIi4vVmlld0FzU3ZnLmlzbGFuZC50c3hcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDYW52YXNWaWV3IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHM6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDYW52YXNEcmF3Q29udGV4dCB7XG4gIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICB2aWV3OiBDYW52YXNWaWV3O1xuICAvKiogUm96bWlhciBwxYLDs3RuYSB3IHBpa3NlbGFjaCBDU1MuICovXG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBkcHI6IG51bWJlcjtcbiAgZGFuZT86IHVua25vd247XG59XG5cbmV4cG9ydCB0eXBlIENhbnZhc0RyYXdlciA9IChjOiBDYW52YXNEcmF3Q29udGV4dCkgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBDYW52YXNQcm9wcyB7XG4gIC8qKiBOYXp3YSBmdW5rY2ppIHJ5c3VqxIVjZWogemFyZWplc3Ryb3dhbmVqIHcgcmVnaXN0cmllcy9mb3ItaXNsYW5kLWNhbnZhcy50cy4gKi9cbiAgcmVnaXN0cnlLZXk6IHN0cmluZztcbiAgLyoqIE9wY2pvbmFsbmUgZGFuZSBwcnpla2F6eXdhbmUgZG8gZnVua2NqaSByeXN1asSFY2VqIChtdXN6xIUgYnnEhyBzZXJpYWxpem93YWxuZSkuICovXG4gIGRhbmU/OiB1bmtub3duO1xuICAvKiogTG9naWN6bmUgd3ltaWFyeSBzY2VueSAodcW8eXdhbmUgcHJ6ZXogZml0KCkgZG8gd3nFm3JvZGtvd2FuaWEgaSBza2Fsb3dhbmlhKS4gKi9cbiAgc2NlbmVXaWR0aDogbnVtYmVyO1xuICBzY2VuZUhlaWdodDogbnVtYmVyO1xuICAvKiogVMWCbyBzdG/FgnUsIGRvd29sbnkga29sb3IgQ1NTLiAqL1xuICBiYWNrZ3JvdW5kPzogc3RyaW5nO1xuICAvKiogU3plcm9rb8WbxIcga29udGVuZXJhLiBEb215xZtsbmllIFwiMTAwJVwiLiAqL1xuICB3aWR0aD86IEJveExlbmd0aDtcbiAgLyoqIFd5c29rb8WbxIcga29udGVuZXJhLiBEb215xZtsbmllIFwiMTAwJVwiIHogbWluLWhlaWdodCAyMDBweC4gKi9cbiAgaGVpZ2h0PzogQm94TGVuZ3RoO1xuICAvKiogTGltaXR5IHBvd2nEmWtzemVuaWEgd3pnbMSZZGVtIHdpZG9rdSBkb3Bhc293YW5lZ28uIERvbXnFm2xuaWUgMC4xIOKApiA1MC4gKi9cbiAgbWluU2NhbGU/OiBudW1iZXI7XG4gIG1heFNjYWxlPzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpc2xhbmQoXG4gIGltcG9ydC5tZXRhLnVybCxcbiAgZnVuY3Rpb24gVmlld0FzQ2FudmFzKFxuICAgIHtcbiAgICAgIHJlZ2lzdHJ5S2V5LFxuICAgICAgZGFuZSxcbiAgICAgIHNjZW5lV2lkdGgsXG4gICAgICBzY2VuZUhlaWdodCxcbiAgICAgIGJhY2tncm91bmQsXG4gICAgICB3aWR0aCA9IFwiMTAwJVwiLFxuICAgICAgaGVpZ2h0LFxuICAgICAgbWluU2NhbGUgPSAwLjEsXG4gICAgICBtYXhTY2FsZSA9IDUwLFxuICAgIH06IENhbnZhc1Byb3BzLFxuICApIHtcbiAgICBjb25zdCBjYW52YXMgPSB1c2VSZWY8SFRNTENhbnZhc0VsZW1lbnQ+KG51bGwpO1xuICAgIGNvbnN0IHJhZiA9IHVzZVJlZjxudW1iZXIgfCBudWxsPihudWxsKTtcblxuICAgIGNvbnN0IGRyYXcgPSAoKSA9PiB7XG4gICAgICByYWYuY3VycmVudCA9IG51bGw7XG4gICAgICBjb25zdCBiID0gcHouYm94LmN1cnJlbnQsIGVsID0gY2FudmFzLmN1cnJlbnQ7XG4gICAgICBpZiAoIWIgfHwgIWVsKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGN0eCA9IGVsLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGlmICghY3R4KSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRyYXdlciA9IFJZU1VOS0lbcmVnaXN0cnlLZXldO1xuICAgICAgaWYgKCFkcmF3ZXIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBWaWV3QXNDYW52YXM6IG5pZXpuYW55IHJlZ2lzdHJ5S2V5PVwiJHtyZWdpc3RyeUtleX1cImApO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRwciA9IGdsb2JhbFRoaXMuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICAgICAgY29uc3QgdyA9IGIuY2xpZW50V2lkdGg7XG4gICAgICBjb25zdCBoID0gYi5jbGllbnRIZWlnaHQ7XG4gICAgICBjb25zdCBwdyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodyAqIGRwcikpO1xuICAgICAgY29uc3QgcGggPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGggKiBkcHIpKTtcblxuICAgICAgaWYgKGVsLndpZHRoICE9PSBwdyB8fCBlbC5oZWlnaHQgIT09IHBoKSB7XG4gICAgICAgIGVsLndpZHRoID0gcHc7XG4gICAgICAgIGVsLmhlaWdodCA9IHBoO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB2ID0gcHoudmlldy5jdXJyZW50O1xuICAgICAgY3R4LnNhdmUoKTtcbiAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oZHByLCAwLCAwLCBkcHIsIDAsIDApO1xuICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB3LCBoKTtcblxuICAgICAgY3R4LnRyYW5zbGF0ZSh2LngsIHYueSk7XG4gICAgICBjdHguc2NhbGUodi5zLCB2LnMpO1xuXG4gICAgICBkcmF3ZXIoeyBjdHgsIHZpZXc6IHYsIHdpZHRoOiB3LCBoZWlnaHQ6IGgsIGRwciwgZGFuZSB9KTtcbiAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHNjaGVkdWxlRHJhdyA9ICgpID0+IHtcbiAgICAgIGlmIChyYWYuY3VycmVudCA9PT0gbnVsbCkge1xuICAgICAgICByYWYuY3VycmVudCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcHogPSB1c2VQYW5ab29tKHsgbWluU2NhbGUsIG1heFNjYWxlLCBvbkNoYW5nZTogc2NoZWR1bGVEcmF3IH0pO1xuXG4gICAgY29uc3QgZml0ID0gKCkgPT4gcHouZml0VG8oc2NlbmVXaWR0aCwgc2NlbmVIZWlnaHQpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIGNvbnN0IGIgPSBwei5ib3guY3VycmVudDtcbiAgICAgIGlmICghYikgcmV0dXJuO1xuXG4gICAgICBmaXQoKTtcbiAgICAgIGRvY3VtZW50LmZvbnRzLnJlYWR5LnRoZW4oc2NoZWR1bGVEcmF3KTtcblxuICAgICAgY29uc3Qgcm8gPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4gc2NoZWR1bGVEcmF3KCkpO1xuICAgICAgcm8ub2JzZXJ2ZShiKTtcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgcm8uZGlzY29ubmVjdCgpO1xuICAgICAgICBpZiAocmFmLmN1cnJlbnQgIT09IG51bGwpIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZi5jdXJyZW50KTtcbiAgICAgIH07XG4gICAgfSwgW3JlZ2lzdHJ5S2V5LCBkYW5lLCBzY2VuZVdpZHRoLCBzY2VuZUhlaWdodF0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3M9XCJzdmctYm94XCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9e3B6LmJveH1cbiAgICAgICAgICBjbGFzcz17cHoubG9ja2VkID8gXCJib3gtc3ZnIGlzLWxvY2tlZFwiIDogXCJib3gtc3ZnXCJ9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQsXG4gICAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0ID8/IFwiMTAwJVwiLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiBoZWlnaHQgPyB1bmRlZmluZWQgOiBcIjIwMHB4XCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbldoZWVsPXtwei5oYW5kbGVycy5vbldoZWVsfVxuICAgICAgICAgIG9uUG9pbnRlckRvd249e3B6LmhhbmRsZXJzLm9uUG9pbnRlckRvd259XG4gICAgICAgICAgb25Qb2ludGVyTW92ZT17cHouaGFuZGxlcnMub25Qb2ludGVyTW92ZX1cbiAgICAgICAgICBvblBvaW50ZXJVcD17cHouaGFuZGxlcnMub25Qb2ludGVyRW5kfVxuICAgICAgICAgIG9uUG9pbnRlckNhbmNlbD17cHouaGFuZGxlcnMub25Qb2ludGVyRW5kfVxuICAgICAgICAgIG9uRGJsQ2xpY2s9e3B6LmxvY2tlZCA/IHVuZGVmaW5lZCA6IGZpdH1cbiAgICAgICAgPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgY2xhc3M9XCJib3gtc3ZnLWxvY2tcIlxuICAgICAgICAgICAgYXJpYS1sYWJlbD17cHoubG9ja2VkID8gXCJPZGJsb2t1aiBzdMOzxYJcIiA6IFwiWmFibG9rdWogc3TDs8WCXCJ9XG4gICAgICAgICAgICB0aXRsZT17cHoubG9ja2VkID8gXCJPZGJsb2t1aiBwcnplc3V3YW5pZSBpIHpvb21cIiA6IFwiWmFibG9rdWogKHByemV3aWphbmllIHN0cm9ueSlcIn1cbiAgICAgICAgICAgIG9uUG9pbnRlckRvd249eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgb25EYmxDbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICBvbkNsaWNrPXtwei50b2dnbGVMb2NrfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtwei5sb2NrZWQgPyBcIvCflJJcIiA6IFwi8J+Uk1wifVxuICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgPGNhbnZhcyByZWY9e2NhbnZhc30gY2xhc3M9XCJib3gtY2FudmFzXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsb0JBQW9CO0FBQ3BCLDRDQUE0QztBQUM1Qyw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUVqRCxTQUFTLFNBQVMsRUFBRSxNQUFNLFFBQVEsZUFBZTtBQUNqRCxTQUFTLE1BQU0sUUFBUSxrQkFBa0I7QUFDekMsU0FBUyxPQUFPLFFBQVEsZ0RBQWdEO0FBQ3hFLFNBQVMsVUFBVSxRQUFRLG1DQUFtQztBQXdDOUQsZUFBZSxPQUNiLFlBQVksR0FBRyxFQUNmLFNBQVMsYUFDUCxFQUNFLFdBQVcsRUFDWCxJQUFJLEVBQ0osVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsUUFBUSxNQUFNLEVBQ2QsTUFBTSxFQUNOLFdBQVcsR0FBRyxFQUNkLFdBQVcsRUFBRSxFQUNEO0VBRWQsTUFBTSxTQUFTLE9B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