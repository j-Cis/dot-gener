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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYi9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHdlYi9jbGllbnQudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgeyB0eXBlIENvbXBvbmVudFR5cGUsIGgsIGh5ZHJhdGUgfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBTTE9UX0FUVFIgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5cbi8vIEh5ZHJhdGVzIGV2ZXJ5IDxkaXYgZGF0YS1pc2xhbmQ9XCIvc2l0ZS9jbGllbnQv4oCmL1guaXNsYW5kLnRzeFwiPiB3aXRoIHRoZSBkZWZhdWx0XG4vLyBleHBvcnQgb2YgdGhhdCBtb2R1bGUuXG5jb25zdCBpc2xhbmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oIFwiW2RhdGEtaXNsYW5kXVwiICk7XG5cbmF3YWl0IFByb21pc2UuYWxsKCBbIC4uLmlzbGFuZHMgXS5tYXAoIGFzeW5jICggZWwgKSA9PiB7XG5cdGNvbnN0IG1vZDogeyBkZWZhdWx0OiBDb21wb25lbnRUeXBlIH0gPSBhd2FpdCBpbXBvcnQoIGAke2VsLmRhdGFzZXQuaXNsYW5kfWAgKTtcblx0Y29uc3QgcHJvcHMgPSBKU09OLnBhcnNlKCBlbC5kYXRhc2V0LnByb3BzID8/IFwie31cIiApO1xuXHRjb25zdCBzbG90ID0gb3duU2xvdCggZWwgKTtcblx0aWYgKCBzbG90ICkge1xuXHRcdC8vIFNlcnZlci1yZW5kZXJlZCBjaGlsZHJlbiwgcGFzc2VkIGJhY2sgYXMgdGhlIHNhbWUgSFRNTDogUHJlYWN0IGRvZXMgbm90XG5cdFx0Ly8gdG91Y2ggaW5uZXJIVE1MIHdoaWxlIGh5ZHJhdGluZywgbm9yIGxhdGVyIHdoaWxlIHRoZSBzdHJpbmcgaXMgdW5jaGFuZ2VkLlxuXHRcdHByb3BzLmNoaWxkcmVuID0gaCggXCJkaXZcIiwge1xuXHRcdFx0W1NMT1RfQVRUUl06IFwiXCIsXG5cdFx0XHRzdHlsZTogXCJkaXNwbGF5OmNvbnRlbnRzXCIsXG5cdFx0XHRkYW5nZXJvdXNseVNldElubmVySFRNTDogeyBfX2h0bWw6IHNsb3QuaW5uZXJIVE1MIH0sXG5cdFx0fSApO1xuXHR9XG5cdGh5ZHJhdGUoIGgoIG1vZC5kZWZhdWx0LCBwcm9wcyApLCBlbCApO1xufSApICk7XG5cbi8qKiBUaGUgc2xvdCBvZiB0aGlzIGlzbGFuZCAobm90IG9mIGFuIGlzbGFuZCBuZXN0ZWQgaW5zaWRlIGl0KS4gKi9cbmZ1bmN0aW9uIG93blNsb3QoIGVsOiBIVE1MRWxlbWVudCApOiBIVE1MRWxlbWVudCB8IG51bGwge1xuXHRmb3IgKCBjb25zdCBzIG9mIGVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KCBgWyR7U0xPVF9BVFRSfV1gICkgKSB7XG5cdFx0aWYgKCBzLmNsb3Nlc3QoIFwiW2RhdGEtaXNsYW5kXVwiICkgPT09IGVsICkgcmV0dXJuIHM7XG5cdH1cblx0cmV0dXJuIG51bGw7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLHNCQUFzQjtBQUN0Qiw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUVqRCxTQUE2QixDQUFDLEVBQUUsT0FBTyxRQUFRLFNBQVM7QUFDeEQsU0FBUyxTQUFTLFFBQVEsa0JBQWtCO0FBRTVDLGtGQUFrRjtBQUNsRix5QkFBeUI7QUFDekIsTUFBTSxVQUFVLFNBQVMsZ0JBQWdCLENBQWU7QUFFeEQsTUFBTSxRQUFRLEdBQUcsQ0FBRTtLQUFLO0NBQVMsQ0FBQyxHQUFHLENBQUUsT0FBUTtFQUM5QyxNQUFNLE1BQWtDLE1BQU0sTUFBTSxDQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO0VBQzVFLE1BQU0sUUFBUSxLQUFLLEtBQUssQ0FBRSxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUk7RUFDOUMsTUFBTSxPQUFPLFFBQVM7RUFDdEIsSUFBSyxNQUFPO0lBQ1gsMEVBQTBFO0lBQzFFLDRFQUE0RTtJQUM1RSxNQUFNLFFBQVEsR0FBRyxFQUFHLE9BQU87TUFDMUIsQ0FBQyxVQUFVLEVBQUU7TUFDYixPQUFPO01BQ1AseUJBQXlCO1FBQUUsUUFBUSxLQUFLLFNBQVM7TUFBQztJQUNuRDtFQUNEO0VBQ0EsUUFBUyxFQUFHLElBQUksT0FBTyxFQUFFLFFBQVM7QUFDbkM7QUFFQSxpRUFBaUUsR0FDakUsU0FBUyxRQUFTLEVBQWU7RUFDaEMsS0FBTSxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBZSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFLO0lBQ3ZFLElBQUssRUFBRSxPQUFPLENBQUUscUJBQXNCLElBQUssT0FBTztFQUNuRDtFQUNBLE9BQU87QUFDUiJ9