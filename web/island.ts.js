// @project-metadata
// Path: web/island.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
import { h } from "preact";
const ROOT = new URL("../", import.meta.url).href;
const IS_BROWSER = typeof document !== "undefined";
/** Marks the server-rendered children of an island (see client.ts). */ export const SLOT_ATTR = "data-island-slot";
/**
 * Marks a component as an island. In a site/features/**\/*.island.tsx file:
 *
 *   export default island(import.meta.url, function Counter(props) { … });
 *
 * Server: renders the component inside
 *   <div data-island="/site/features/…/X.island.tsx" data-props="{…}">.
 * Browser: returns the component itself; client.ts imports that path and
 * hydrates it.
 *
 * Props must be JSON-serializable, except `children`: those are rendered on
 * the server into a slot and kept as static HTML in the browser (their DOM is
 * not re-rendered by the island, so they cannot be interactive Preact code —
 * nested islands inside them still hydrate on their own).
 */ export function island(moduleUrl, Component) {
  if (IS_BROWSER) return Component;
  if (!moduleUrl.startsWith(ROOT)) {
    throw new Error(`island outside the project: ${moduleUrl}`);
  }
  const src = "/" + moduleUrl.slice(ROOT.length);
  const Wrapped = ({ children, ...props })=>h("div", {
      "data-island": src,
      "data-props": JSON.stringify(props),
      style: "display:contents"
    }, h(Component, {
      ...props,
      children: children == null ? children : h("div", {
        [SLOT_ATTR]: "",
        style: "display:contents"
      }, children)
    }));
  return Wrapped;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYi9pc2xhbmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHdlYi9pc2xhbmQudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgeyB0eXBlIENvbXBvbmVudFR5cGUsIHR5cGUgRnVuY3Rpb25Db21wb25lbnQsIGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmNvbnN0IFJPT1QgPSBuZXcgVVJMKFwiLi4vXCIsIGltcG9ydC5tZXRhLnVybCkuaHJlZjtcbmNvbnN0IElTX0JST1dTRVIgPSB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG5cbi8qKiBNYXJrcyB0aGUgc2VydmVyLXJlbmRlcmVkIGNoaWxkcmVuIG9mIGFuIGlzbGFuZCAoc2VlIGNsaWVudC50cykuICovXG5leHBvcnQgY29uc3QgU0xPVF9BVFRSID0gXCJkYXRhLWlzbGFuZC1zbG90XCI7XG5cbi8qKlxuICogTWFya3MgYSBjb21wb25lbnQgYXMgYW4gaXNsYW5kLiBJbiBhIHNpdGUvZmVhdHVyZXMvKipcXC8qLmlzbGFuZC50c3ggZmlsZTpcbiAqXG4gKiAgIGV4cG9ydCBkZWZhdWx0IGlzbGFuZChpbXBvcnQubWV0YS51cmwsIGZ1bmN0aW9uIENvdW50ZXIocHJvcHMpIHsg4oCmIH0pO1xuICpcbiAqIFNlcnZlcjogcmVuZGVycyB0aGUgY29tcG9uZW50IGluc2lkZVxuICogICA8ZGl2IGRhdGEtaXNsYW5kPVwiL3NpdGUvZmVhdHVyZXMv4oCmL1guaXNsYW5kLnRzeFwiIGRhdGEtcHJvcHM9XCJ74oCmfVwiPi5cbiAqIEJyb3dzZXI6IHJldHVybnMgdGhlIGNvbXBvbmVudCBpdHNlbGY7IGNsaWVudC50cyBpbXBvcnRzIHRoYXQgcGF0aCBhbmRcbiAqIGh5ZHJhdGVzIGl0LlxuICpcbiAqIFByb3BzIG11c3QgYmUgSlNPTi1zZXJpYWxpemFibGUsIGV4Y2VwdCBgY2hpbGRyZW5gOiB0aG9zZSBhcmUgcmVuZGVyZWQgb25cbiAqIHRoZSBzZXJ2ZXIgaW50byBhIHNsb3QgYW5kIGtlcHQgYXMgc3RhdGljIEhUTUwgaW4gdGhlIGJyb3dzZXIgKHRoZWlyIERPTSBpc1xuICogbm90IHJlLXJlbmRlcmVkIGJ5IHRoZSBpc2xhbmQsIHNvIHRoZXkgY2Fubm90IGJlIGludGVyYWN0aXZlIFByZWFjdCBjb2RlIOKAlFxuICogbmVzdGVkIGlzbGFuZHMgaW5zaWRlIHRoZW0gc3RpbGwgaHlkcmF0ZSBvbiB0aGVpciBvd24pLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNsYW5kPFAgZXh0ZW5kcyBvYmplY3Q+KFxuICBtb2R1bGVVcmw6IHN0cmluZyxcbiAgQ29tcG9uZW50OiBDb21wb25lbnRUeXBlPFA+LFxuKTogQ29tcG9uZW50VHlwZTxQPiB7XG4gIGlmIChJU19CUk9XU0VSKSByZXR1cm4gQ29tcG9uZW50O1xuICBpZiAoIW1vZHVsZVVybC5zdGFydHNXaXRoKFJPT1QpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBpc2xhbmQgb3V0c2lkZSB0aGUgcHJvamVjdDogJHttb2R1bGVVcmx9YCk7XG4gIH1cbiAgY29uc3Qgc3JjID0gXCIvXCIgKyBtb2R1bGVVcmwuc2xpY2UoUk9PVC5sZW5ndGgpO1xuICBjb25zdCBXcmFwcGVkOiBGdW5jdGlvbkNvbXBvbmVudDxQPiA9ICh7IGNoaWxkcmVuLCAuLi5wcm9wcyB9KSA9PlxuICAgIGgoXG4gICAgICBcImRpdlwiLFxuICAgICAge1xuICAgICAgICBcImRhdGEtaXNsYW5kXCI6IHNyYyxcbiAgICAgICAgXCJkYXRhLXByb3BzXCI6IEpTT04uc3RyaW5naWZ5KHByb3BzKSxcbiAgICAgICAgc3R5bGU6IFwiZGlzcGxheTpjb250ZW50c1wiLFxuICAgICAgfSxcbiAgICAgIGgoXG4gICAgICAgIENvbXBvbmVudCxcbiAgICAgICAge1xuICAgICAgICAgIC4uLnByb3BzLFxuICAgICAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbiA9PSBudWxsID8gY2hpbGRyZW4gOiBoKFxuICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgIHsgW1NMT1RfQVRUUl06IFwiXCIsIHN0eWxlOiBcImRpc3BsYXk6Y29udGVudHNcIiB9LFxuICAgICAgICAgICAgY2hpbGRyZW4sXG4gICAgICAgICAgKSxcbiAgICAgICAgfSBhcyB1bmtub3duIGFzIFAsXG4gICAgICApLFxuICAgICk7XG4gIHJldHVybiBXcmFwcGVkO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQixzQkFBc0I7QUFDdEIsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFFakQsU0FBcUQsQ0FBQyxRQUFRLFNBQVM7QUFFdkUsTUFBTSxPQUFPLElBQUksSUFBSSxPQUFPLFlBQVksR0FBRyxFQUFFLElBQUk7QUFDakQsTUFBTSxhQUFhLE9BQU8sYUFBYTtBQUV2QyxxRUFBcUUsR0FDckUsT0FBTyxNQUFNLFlBQVksbUJBQW1CO0FBRTVDOzs7Ozs7Ozs7Ozs7OztDQWNDLEdBQ0QsT0FBTyxTQUFTLE9BQ2QsU0FBaUIsRUFDakIsU0FBMkI7RUFFM0IsSUFBSSxZQUFZLE9BQU87RUFDdkIsSUFBSSxDQUFDLFVBQVUsVUFBVSxDQUFDLE9BQU87SUFDL0IsTUFBTSxJQUFJLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRSxXQUFXO0VBQzVEO0VBQ0EsTUFBTSxNQUFNLE1BQU0sVUFBVSxLQUFLLENBQUMsS0FBSyxNQUFNO0VBQzdDLE1BQU0sVUFBZ0MsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLE9BQU8sR0FDM0QsRUFDRSxPQUNBO01BQ0UsZUFBZTtNQUNmLGNBQWMsS0FBSyxTQUFTLENBQUM7TUFDN0IsT0FBTztJQUNULEdBQ0EsRUFDRSxXQUNBO01BQ0UsR0FBRyxLQUFLO01BQ1IsVUFBVSxZQUFZLE9BQU8sV0FBVyxFQUN0QyxPQUNBO1FBQUUsQ0FBQyxVQUFVLEVBQUU7UUFBSSxPQUFPO01BQW1CLEdBQzdDO0lBRUo7RUFHTixPQUFPO0FBQ1QifQ==