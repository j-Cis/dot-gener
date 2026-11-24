import { h, hydrate } from "preact";
import { SLOT_ATTR } from "@/web/island.ts";
// Hydrates every <div data-island="/site/features/…/X.island.tsx"> with the default
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYi9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBDb21wb25lbnRUeXBlLCBoLCBoeWRyYXRlIH0gZnJvbSBcInByZWFjdFwiO1xuaW1wb3J0IHsgU0xPVF9BVFRSIH0gZnJvbSBcIkAvd2ViL2lzbGFuZC50c1wiO1xuXG4vLyBIeWRyYXRlcyBldmVyeSA8ZGl2IGRhdGEtaXNsYW5kPVwiL3NpdGUvZmVhdHVyZXMv4oCmL1guaXNsYW5kLnRzeFwiPiB3aXRoIHRoZSBkZWZhdWx0XG4vLyBleHBvcnQgb2YgdGhhdCBtb2R1bGUuXG5jb25zdCBpc2xhbmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oXCJbZGF0YS1pc2xhbmRdXCIpO1xuXG5hd2FpdCBQcm9taXNlLmFsbChbLi4uaXNsYW5kc10ubWFwKGFzeW5jIChlbCkgPT4ge1xuICBjb25zdCBtb2Q6IHsgZGVmYXVsdDogQ29tcG9uZW50VHlwZSB9ID0gYXdhaXQgaW1wb3J0KGAke2VsLmRhdGFzZXQuaXNsYW5kfWApO1xuICBjb25zdCBwcm9wcyA9IEpTT04ucGFyc2UoZWwuZGF0YXNldC5wcm9wcyA/PyBcInt9XCIpO1xuICBjb25zdCBzbG90ID0gb3duU2xvdChlbCk7XG4gIGlmIChzbG90KSB7XG4gICAgLy8gU2VydmVyLXJlbmRlcmVkIGNoaWxkcmVuLCBwYXNzZWQgYmFjayBhcyB0aGUgc2FtZSBIVE1MOiBQcmVhY3QgZG9lcyBub3RcbiAgICAvLyB0b3VjaCBpbm5lckhUTUwgd2hpbGUgaHlkcmF0aW5nLCBub3IgbGF0ZXIgd2hpbGUgdGhlIHN0cmluZyBpcyB1bmNoYW5nZWQuXG4gICAgcHJvcHMuY2hpbGRyZW4gPSBoKFwiZGl2XCIsIHtcbiAgICAgIFtTTE9UX0FUVFJdOiBcIlwiLFxuICAgICAgc3R5bGU6IFwiZGlzcGxheTpjb250ZW50c1wiLFxuICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw6IHsgX19odG1sOiBzbG90LmlubmVySFRNTCB9LFxuICAgIH0pO1xuICB9XG4gIGh5ZHJhdGUoaChtb2QuZGVmYXVsdCwgcHJvcHMpLCBlbCk7XG59KSk7XG5cbi8qKiBUaGUgc2xvdCBvZiB0aGlzIGlzbGFuZCAobm90IG9mIGFuIGlzbGFuZCBuZXN0ZWQgaW5zaWRlIGl0KS4gKi9cbmZ1bmN0aW9uIG93blNsb3QoZWw6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQgfCBudWxsIHtcbiAgZm9yIChjb25zdCBzIG9mIGVsLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTEVsZW1lbnQ+KGBbJHtTTE9UX0FUVFJ9XWApKSB7XG4gICAgaWYgKHMuY2xvc2VzdChcIltkYXRhLWlzbGFuZF1cIikgPT09IGVsKSByZXR1cm4gcztcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUE2QixDQUFDLEVBQUUsT0FBTyxRQUFRLFNBQVM7QUFDeEQsU0FBUyxTQUFTLFFBQVEsa0JBQWtCO0FBRTVDLG9GQUFvRjtBQUNwRix5QkFBeUI7QUFDekIsTUFBTSxVQUFVLFNBQVMsZ0JBQWdCLENBQWM7QUFFdkQsTUFBTSxRQUFRLEdBQUcsQ0FBQztLQUFJO0NBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTztFQUN4QyxNQUFNLE1BQWtDLE1BQU0sTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO0VBQzNFLE1BQU0sUUFBUSxLQUFLLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUk7RUFDN0MsTUFBTSxPQUFPLFFBQVE7RUFDckIsSUFBSSxNQUFNO0lBQ1IsMEVBQTBFO0lBQzFFLDRFQUE0RTtJQUM1RSxNQUFNLFFBQVEsR0FBRyxFQUFFLE9BQU87TUFDeEIsQ0FBQyxVQUFVLEVBQUU7TUFDYixPQUFPO01BQ1AseUJBQXlCO1FBQUUsUUFBUSxLQUFLLFNBQVM7TUFBQztJQUNwRDtFQUNGO0VBQ0EsUUFBUSxFQUFFLElBQUksT0FBTyxFQUFFLFFBQVE7QUFDakM7QUFFQSxpRUFBaUUsR0FDakUsU0FBUyxRQUFRLEVBQWU7RUFDOUIsS0FBSyxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBYyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFHO0lBQ2xFLElBQUksRUFBRSxPQUFPLENBQUMscUJBQXFCLElBQUksT0FBTztFQUNoRDtFQUNBLE9BQU87QUFDVCJ9