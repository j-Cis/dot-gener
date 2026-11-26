// @project-metadata
// Path: site/client/ViewAsSvg.island.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useEffect, useRef } from "preact/hooks";
import { island } from "@/web/island.ts";
import { DOPASOWANIA } from "@/site/client/registries/for-island-svg.ts";
import { usePanZoom } from "@/site/common/util/usePanZoom.ts";
export default island(import.meta.url, function ViewAsSvg({ children, registryKey, background, width = "100%", height, minScale = 0.1, maxScale = 50 }) {
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
      else console.warn(`ViewAsSvg: nieznany registryKey="${registryKey}"`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpdGUvY2xpZW50L1ZpZXdBc1N2Zy5pc2xhbmQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIEBwcm9qZWN0LW1ldGFkYXRhXG4vLyBQYXRoOiBzaXRlL2NsaWVudC9WaWV3QXNTdmcuaXNsYW5kLnRzeFxuLy8gQXV0aG9yOiBKYW4gUm9tYW4gQ2lzb3dza2lcbi8vIE9SQ0lEOiBodHRwczovL29yY2lkLm9yZy8wMDA5LTAwMDktMjkwNy0zNzkyXG4vLyBSZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vai1DaXMvZG90LWdlbmVyXG5cbmltcG9ydCB0eXBlIHsgQ29tcG9uZW50Q2hpbGRyZW4gfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gXCJwcmVhY3QvaG9va3NcIjtcbmltcG9ydCB7IGlzbGFuZCB9IGZyb20gXCJAL3dlYi9pc2xhbmQudHNcIjtcbmltcG9ydCB7IERPUEFTT1dBTklBLCB0eXBlIFN2Z1JlZ2lzdHJ5S2V5IH0gZnJvbSBcIkAvc2l0ZS9jbGllbnQvcmVnaXN0cmllcy9mb3ItaXNsYW5kLXN2Zy50c1wiO1xuaW1wb3J0IHsgdXNlUGFuWm9vbSB9IGZyb20gXCJAL3NpdGUvY29tbW9uL3V0aWwvdXNlUGFuWm9vbS50c1wiO1xuXG4vKiogQ1NTIGxlbmd0aCBmb3IgdGhlIGJveCBzaXplLiAqL1xuZXhwb3J0IHR5cGUgQm94TGVuZ3RoID0gYCR7bnVtYmVyfSR7XCJyZW1cIiB8IFwiZW1cIiB8IFwicHhcIiB8IFwiJVwiIHwgXCJ2d1wiIHwgXCJ2aFwifWA7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3ZnUHJvcHMge1xuICAvKiogU1ZHIG1hcmt1cDsgcmVuZGVyZWQgb24gdGhlIHNlcnZlciwga2VwdCBhcy1pcyBpbiB0aGUgYnJvd3Nlci4gKi9cbiAgY2hpbGRyZW46IENvbXBvbmVudENoaWxkcmVuO1xuICAvKiogT3Bjam9uYWxueSBrbHVjeiBkb3Bhc293YW5pYSB6IHJlamVzdHJ1IFNWRy4gKi9cbiAgcmVnaXN0cnlLZXk/OiBTdmdSZWdpc3RyeUtleTtcbiAgLyoqIFZpZXdBc0NhbnZhcyBiYWNrZ3JvdW5kLCBhbnkgQ1NTIGNvbG9yLiAqL1xuICBiYWNrZ3JvdW5kPzogc3RyaW5nO1xuICAvKiogQm94IHdpZHRoLiBEZWZhdWx0IFwiMTAwJVwiLiAqL1xuICB3aWR0aD86IEJveExlbmd0aDtcbiAgLyoqXG4gICAqIEJveCBoZWlnaHQuIERlZmF1bHQgXCIxMDAlXCIgd2l0aCBtaW4taGVpZ2h0IDIwMHB4OyBmaWxsaW5nIHRoZSBoZWlnaHRcbiAgICogbmVlZHMgYSBwYXJlbnQgdGhhdCBoYXMgYSBoZWlnaHQuXG4gICAqL1xuICBoZWlnaHQ/OiBCb3hMZW5ndGg7XG4gIC8qKiBab29tIGxpbWl0cywgcmVsYXRpdmUgdG8gdGhlIGZpdHRlZCB2aWV3LiBEZWZhdWx0IDAuMSDigKYgNTAuICovXG4gIG1pblNjYWxlPzogbnVtYmVyO1xuICBtYXhTY2FsZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNsYW5kKFxuICBpbXBvcnQubWV0YS51cmwsXG4gIGZ1bmN0aW9uIFZpZXdBc1N2ZyhcbiAgICB7XG4gICAgICBjaGlsZHJlbixcbiAgICAgIHJlZ2lzdHJ5S2V5LFxuICAgICAgYmFja2dyb3VuZCxcbiAgICAgIHdpZHRoID0gXCIxMDAlXCIsXG4gICAgICBoZWlnaHQsXG4gICAgICBtaW5TY2FsZSA9IDAuMSxcbiAgICAgIG1heFNjYWxlID0gNTAsXG4gICAgfTogU3ZnUHJvcHMsXG4gICkge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xuXG4gICAgY29uc3QgYXBwbHkgPSAoKSA9PiB7XG4gICAgICBjb25zdCB7IHgsIHksIHMgfSA9IHB6LnZpZXcuY3VycmVudDtcbiAgICAgIGlmIChjb250ZW50LmN1cnJlbnQpIHtcbiAgICAgICAgY29udGVudC5jdXJyZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpIHNjYWxlKCR7c30pYDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgcHogPSB1c2VQYW5ab29tKHsgbWluU2NhbGUsIG1heFNjYWxlLCBvbkNoYW5nZTogYXBwbHkgfSk7XG5cbiAgICBjb25zdCBmaXQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjID0gY29udGVudC5jdXJyZW50O1xuICAgICAgaWYgKGMpIHB6LmZpdFRvKGMub2Zmc2V0V2lkdGgsIGMub2Zmc2V0SGVpZ2h0KTtcbiAgICB9O1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgIGZpdCgpO1xuICAgICAgaWYgKCFyZWdpc3RyeUtleSkgcmV0dXJuO1xuICAgICAgZG9jdW1lbnQuZm9udHMucmVhZHkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN2ZyA9IGNvbnRlbnQuY3VycmVudD8ucXVlcnlTZWxlY3RvcjxTVkdTVkdFbGVtZW50PihcInN2Z1wiKTtcbiAgICAgICAgaWYgKCFzdmcpIHJldHVybjtcbiAgICAgICAgY29uc3QgZG9wYXN1aiA9IERPUEFTT1dBTklBW3JlZ2lzdHJ5S2V5XTtcbiAgICAgICAgaWYgKGRvcGFzdWopIGRvcGFzdWooc3ZnKTtcbiAgICAgICAgZWxzZSBjb25zb2xlLndhcm4oYFZpZXdBc1N2Zzogbmllem5hbnkgcmVnaXN0cnlLZXk9XCIke3JlZ2lzdHJ5S2V5fVwiYCk7XG4gICAgICB9KTtcbiAgICB9LCBbcmVnaXN0cnlLZXldKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzPVwic3ZnLWJveFwiPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPXtwei5ib3h9XG4gICAgICAgICAgY2xhc3M9e3B6LmxvY2tlZCA/IFwiYm94LXN2ZyBpcy1sb2NrZWRcIiA6IFwiYm94LXN2Z1wifVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCA/PyBcIjEwMCVcIixcbiAgICAgICAgICAgIG1pbkhlaWdodDogaGVpZ2h0ID8gdW5kZWZpbmVkIDogXCIyMDBweFwiLFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25XaGVlbD17cHouaGFuZGxlcnMub25XaGVlbH1cbiAgICAgICAgICBvblBvaW50ZXJEb3duPXtwei5oYW5kbGVycy5vblBvaW50ZXJEb3dufVxuICAgICAgICAgIG9uUG9pbnRlck1vdmU9e3B6LmhhbmRsZXJzLm9uUG9pbnRlck1vdmV9XG4gICAgICAgICAgb25Qb2ludGVyVXA9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cbiAgICAgICAgICBvblBvaW50ZXJDYW5jZWw9e3B6LmhhbmRsZXJzLm9uUG9pbnRlckVuZH1cbiAgICAgICAgICBvbkRibENsaWNrPXtwei5sb2NrZWQgPyB1bmRlZmluZWQgOiBmaXR9XG4gICAgICAgID5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYm94LXN2Zy1sb2NrXCJcbiAgICAgICAgICAgIGFyaWEtbGFiZWw9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogc3TDs8WCXCIgOiBcIlphYmxva3VqIHN0w7PFglwifVxuICAgICAgICAgICAgdGl0bGU9e3B6LmxvY2tlZCA/IFwiT2RibG9rdWogcHJ6ZXN1d2FuaWUgaSB6b29tXCIgOiBcIlphYmxva3VqIChwcnpld2lqYW5pZSBzdHJvbnkpXCJ9XG4gICAgICAgICAgICBvblBvaW50ZXJEb3duPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgIG9uRGJsQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxuICAgICAgICAgICAgb25DbGljaz17cHoudG9nZ2xlTG9ja31cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cHoubG9ja2VkID8gXCLwn5SSXCIgOiBcIvCflJNcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgIDxkaXYgcmVmPXtjb250ZW50fSBjbGFzcz1cImJveC1zdmctY29udGVudFwiPntjaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIseUNBQXlDO0FBQ3pDLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEOztBQUdqRCxTQUFTLFNBQVMsRUFBRSxNQUFNLFFBQVEsZUFBZTtBQUNqRCxTQUFTLE1BQU0sUUFBUSxrQkFBa0I7QUFDekMsU0FBUyxXQUFXLFFBQTZCLDZDQUE2QztBQUM5RixTQUFTLFVBQVUsUUFBUSxtQ0FBbUM7QUF3QjlELGVBQWUsT0FDYixZQUFZLEdBQUcsRUFDZixTQUFTLFVBQ1AsRUFDRSxRQUFRLEVBQ1IsV0FBVyxFQUNYLFVBQVUsRUFDVixRQUFRLE1BQU0sRUFDZCxNQUFNLEVBQ04sV0FBVyxHQUFHLEVBQ2QsV0FBVyxFQUFFLEVBQ0o7RUFFWCxNQUFNLFVBQVUsT0FBdUI7RUFFdkMsTUFBTSxRQUFRO0lBQ1osTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTztJQUNuQyxJQUFJLFFBQVEsT0FBTyxFQUFFO01BQ25CLFFBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0U7RUFDRjtFQUVBLE1BQU0sS0FBSyxXQUFXO0lBQUU7SUFBVTtJQUFVLFVBQVU7RUFBTTtFQUU1RCxNQUFNLE1BQU07SUFDVixNQUFNLElBQUksUUFBUSxPQUFPO0lBQ3pCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLFlBQVk7RUFDL0M7RUFFQSxVQUFVO0lBQ1I7SUFDQSxJQUFJLENBQUMsYUFBYTtJQUNsQixTQUFTLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO01BQ3hCLE1BQU0sTUFBTSxRQUFRLE9BQU8sRUFBRSxjQUE2QjtNQUMxRCxJQUFJLENBQUMsS0FBSztNQUNWLE1BQU0sVUFBVSxXQUFXLENBQUMsWUFBWTtNQUN4QyxJQUFJLFNBQVMsUUFBUTtXQUNoQixRQUFRLElBQUksQ0FBQyxDQUFDLGlDQUFpQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3RFO0VBQ0YsR0FBRztJQUFDO0dBQVk7RUFFaEIscUJBQ0UsS0FBQztJQUFJLE9BQU07Y0FDVCxjQUFBLE1BQUM7TUFDQyxLQUFLLEdBQUcsR0FBRztNQUNYLE9BQU8sR0FBRyxNQUFNLEdBQUcsc0JBQXNCO01BQ3pDLE9BQU87UUFDTDtRQUNBO1FBQ0EsUUFBUSxVQUFVO1FBQ2xCLFdBQVcsU0FBUyxZQUFZO01BQ2xDO01BQ0EsU0FBUyxHQUFHLFFBQVEsQ0FBQyxPQUFPO01BQzVCLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYTtNQUN4QyxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWE7TUFDeEMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxZQUFZO01BQ3JDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxZQUFZO01BQ3pDLFlBQVksR0FBRyxNQUFNLEdBQUcsWUFBWTs7c0JBRXBDLEtBQUM7VUFDQyxNQUFLO1VBQ0wsT0FBTTtVQUNOLGNBQVksR0FBRyxNQUFNLEdBQUcsa0JBQWtCO1VBQzFDLE9BQU8sR0FBRyxNQUFNLEdBQUcsZ0NBQWdDO1VBQ25ELGVBQWUsQ0FBQyxJQUFNLEVBQUUsZUFBZTtVQUN2QyxZQUFZLENBQUMsSUFBTSxFQUFFLGVBQWU7VUFDcEMsU0FBUyxHQUFHLFVBQVU7b0JBRXJCLEdBQUcsTUFBTSxHQUFHLE9BQU87O3NCQUd0QixLQUFDO1VBQUksS0FBSztVQUFTLE9BQU07b0JBQW1COzs7OztBQUlwRCxHQUNBIn0=