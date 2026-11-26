// @project-metadata
// Path: web/client.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { h, hydrate } from "preact";
import { SLOT_ATTR } from "@/web/island.ts";
// Hydrates every <div data-island="/site/client/…/X.island.tsx"> with the default
// export of that module.
const islands = document.querySelectorAll("[data-island]");
await Promise.all([
  ...islands
].map(async (el)=>{
  const mod = await import(`${el.dataset.island}`);
  const props = JSON.parse(el.dataset.props ?? "{}");
  const slot = ownSlot(el);
  if (slot) {
    // Server-rendered children, passed back as the same HTML: Preact does not
    // touch innerHTML while hydrating, nor later while the string is unchanged.
    props.children = h("div", {
      [SLOT_ATTR]: "",
      style: "display:contents",
      dangerouslySetInnerHTML: {
        __html: slot.innerHTML
      }
    });
  }
  hydrate(h(mod.default, props), el);
}));
/** The slot of this island (not of an island nested inside it). */ function ownSlot(el) {
  for (const s of el.querySelectorAll(`[${SLOT_ATTR}]`)){
    if (s.closest("[data-island]") === el) return s;
  }
  return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYi9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHdlYi9jbGllbnQudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgeyB0eXBlIENvbXBvbmVudFR5cGUsIGgsIGh5ZHJhdGUgfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBTTE9UX0FUVFIgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5cbi8vIEh5ZHJhdGVzIGV2ZXJ5IDxkaXYgZGF0YS1pc2xhbmQ9XCIvc2l0ZS9jbGllbnQv4oCmL1guaXNsYW5kLnRzeFwiPiB3aXRoIHRoZSBkZWZhdWx0XG4vLyBleHBvcnQgb2YgdGhhdCBtb2R1bGUuXG5jb25zdCBpc2xhbmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCJbZGF0YS1pc2xhbmRdXCIpO1xuXG5hd2FpdCBQcm9taXNlLmFsbChbLi4uaXNsYW5kc10ubWFwKGFzeW5jIChlbCkgPT4ge1xuICBjb25zdCBtb2Q6IHsgZGVmYXVsdDogQ29tcG9uZW50VHlwZSB9ID0gYXdhaXQgaW1wb3J0KGAke2VsLmRhdGFzZXQuaXNsYW5kfWApO1xuICBjb25zdCBwcm9wcyA9IEpTT04ucGFyc2UoZWwuZGF0YXNldC5wcm9wcyA/PyBcInt9XCIpO1xuICBjb25zdCBzbG90ID0gb3duU2xvdChlbCk7XG4gIGlmIChzbG90KSB7XG4gICAgLy8gU2VydmVyLXJlbmRlcmVkIGNoaWxkcmVuLCBwYXNzZWQgYmFjayBhcyB0aGUgc2FtZSBIVE1MOiBQcmVhY3QgZG9lcyBub3RcbiAgICAvLyB0b3VjaCBpbm5lckhUTUwgd2hpbGUgaHlkcmF0aW5nLCBub3IgbGF0ZXIgd2hpbGUgdGhlIHN0cmluZyBpcyB1bmNoYW5nZWQuXG4gICAgcHJvcHMuY2hpbGRyZW4gPSBoKFwiZGl2XCIsIHtcbiAgICAgIFtTTE9UX0FUVFJdOiBcIlwiLFxuICAgICAgc3R5bGU6IFwiZGlzcGxheTpjb250ZW50c1wiLFxuICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBzbG90LmlubmVySFRNTCB9LFxuICAgIH0pO1xuICB9XG4gIGh5ZHJhdGUoaChtb2QuZGVmYXVsdCwgcHJvcHMpLCBlbCk7XG59KSk7XG5cbi8qKiBUaGUgc2xvdCBvZiB0aGlzIGlzbGFuZCAobm90IG9mIGFuIGlzbGFuZCBuZXN0ZWQgaW5zaWRlIGl0KS4gKi9cbmZ1bmN0aW9uIG93blNsb3QoZWw6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgZm9yIChjb25zdCBzIG9mIGVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KGBbJHtTTE9UX0FUVFJ9XWApKSB7XG4gICAgaWYgKHMuY2xvc2VzdChcIltkYXRhLWlzbGFuZF1cIikgPT09IGVsKSByZXR1cm4gcztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsc0JBQXNCO0FBQ3RCLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFDL0MsaURBQWlEO0FBRWpELFNBQTZCLENBQUMsRUFBRSxPQUFPLFFBQVEsU0FBUztBQUN4RCxTQUFTLFNBQVMsUUFBUSxrQkFBa0I7QUFFNUMsa0ZBQWtGO0FBQ2xGLHlCQUF5QjtBQUN6QixNQUFNLFVBQVUsU0FBUyxnQkFBZ0IsQ0FBYztBQUV2RCxNQUFNLFFBQVEsR0FBRyxDQUFDO0tBQUk7Q0FBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPO0VBQ3hDLE1BQU0sTUFBa0MsTUFBTSxNQUFNLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUU7RUFDM0UsTUFBTSxRQUFRLEtBQUssS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSTtFQUM3QyxNQUFNLE9BQU8sUUFBUTtFQUNyQixJQUFJLE1BQU07SUFDUiwwRUFBMEU7SUFDMUUsNEVBQTRFO0lBQzVFLE1BQU0sUUFBUSxHQUFHLEVBQUUsT0FBTztNQUN4QixDQUFDLFVBQVUsRUFBRTtNQUNiLE9BQU87TUFDUCx5QkFBeUI7UUFBRSxRQUFRLEtBQUssU0FBUztNQUFDO0lBQ3BEO0VBQ0Y7RUFDQSxRQUFRLEVBQUUsSUFBSSxPQUFPLEVBQUUsUUFBUTtBQUNqQztBQUVBLGlFQUFpRSxHQUNqRSxTQUFTLFFBQVEsRUFBZTtFQUM5QixLQUFLLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFjLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUc7SUFDbEUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsSUFBSSxPQUFPO0VBQ2hEO0VBQ0EsT0FBTztBQUNUIn0=