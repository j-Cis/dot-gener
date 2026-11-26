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
 * Marks a component as an island. In a site/client/**\/*.island.tsx file:
 *
 *   export default island(import.meta.url, function Counter(props) { … });
 *
 * Server: renders the component inside
 *   <div data-island="/site/client/…/X.island.tsx" data-props="{…}">.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYi9pc2xhbmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHdlYi9pc2xhbmQudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgeyB0eXBlIENvbXBvbmVudFR5cGUsIHR5cGUgRnVuY3Rpb25Db21wb25lbnQsIGggfSBmcm9tIFwicHJlYWN0XCI7XG5cbmNvbnN0IFJPT1QgPSBuZXcgVVJMKFwiLi4vXCIsIGltcG9ydC5tZXRhLnVybCkuaHJlZjtcbmNvbnN0IElTX0JST1dTRVIgPSB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG5cbi8qKiBNYXJrcyB0aGUgc2VydmVyLXJlbmRlcmVkIGNoaWxkcmVuIG9mIGFuIGlzbGFuZCAoc2VlIGNsaWVudC50cykuICovXG5leHBvcnQgY29uc3QgU0xPVF9BVFRSID0gXCJkYXRhLWlzbGFuZC1zbG90XCI7XG5cbi8qKlxuICogTWFya3MgYSBjb21wb25lbnQgYXMgYW4gaXNsYW5kLiBJbiBhIHNpdGUvY2xpZW50LyoqXFwvKi5pc2xhbmQudHN4IGZpbGU6XG4gKlxuICogICBleHBvcnQgZGVmYXVsdCBpc2xhbmQoaW1wb3J0Lm1ldGEudXJsLCBmdW5jdGlvbiBDb3VudGVyKHByb3BzKSB7IOKApiB9KTtcbiAqXG4gKiBTZXJ2ZXI6IHJlbmRlcnMgdGhlIGNvbXBvbmVudCBpbnNpZGVcbiAqICAgPGRpdiBkYXRhLWlzbGFuZD1cIi9zaXRlL2NsaWVudC/igKYvWC5pc2xhbmQudHN4XCIgZGF0YS1wcm9wcz1cInvigKZ9XCI+LlxuICogQnJvd3NlcjogcmV0dXJucyB0aGUgY29tcG9uZW50IGl0c2VsZjsgY2xpZW50LnRzIGltcG9ydHMgdGhhdCBwYXRoIGFuZFxuICogaHlkcmF0ZXMgaXQuXG4gKlxuICogUHJvcHMgbXVzdCBiZSBKU09OLXNlcmlhbGl6YWJsZSwgZXhjZXB0IGBjaGlsZHJlbmA6IHRob3NlIGFyZSByZW5kZXJlZCBvblxuICogdGhlIHNlcnZlciBpbnRvIGEgc2xvdCBhbmQga2VwdCBhcyBzdGF0aWMgSFRNTCBpbiB0aGUgYnJvd3NlciAodGhlaXIgRE9NIGlzXG4gKiBub3QgcmUtcmVuZGVyZWQgYnkgdGhlIGlzbGFuZCwgc28gdGhleSBjYW5ub3QgYmUgaW50ZXJhY3RpdmUgUHJlYWN0IGNvZGUg4oCUXG4gKiBuZXN0ZWQgaXNsYW5kcyBpbnNpZGUgdGhlbSBzdGlsbCBoeWRyYXRlIG9uIHRoZWlyIG93bikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc2xhbmQ8UCBleHRlbmRzIG9iamVjdD4oXG4gIG1vZHVsZVVybDogc3RyaW5nLFxuICBDb21wb25lbnQ6IENvbXBvbmVudFR5cGU8UD4sXG4pOiBDb21wb25lbnRUeXBlPFA+IHtcbiAgaWYgKElTX0JST1dTRVIpIHJldHVybiBDb21wb25lbnQ7XG4gIGlmICghbW9kdWxlVXJsLnN0YXJ0c1dpdGgoUk9PVCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYGlzbGFuZCBvdXRzaWRlIHRoZSBwcm9qZWN0OiAke21vZHVsZVVybH1gKTtcbiAgfVxuICBjb25zdCBzcmMgPSBcIi9cIiArIG1vZHVsZVVybC5zbGljZShST09ULmxlbmd0aCk7XG4gIGNvbnN0IFdyYXBwZWQ6IEZ1bmN0aW9uQ29tcG9uZW50PFA+ID0gKHsgY2hpbGRyZW4sIC4uLnByb3BzIH0pID0+XG4gICAgaChcbiAgICAgIFwiZGl2XCIsXG4gICAgICB7XG4gICAgICAgIFwiZGF0YS1pc2xhbmRcIjogc3JjLFxuICAgICAgICBcImRhdGEtcHJvcHNcIjogSlNPTi5zdHJpbmdpZnkocHJvcHMpLFxuICAgICAgICBzdHlsZTogXCJkaXNwbGF5OmNvbnRlbnRzXCIsXG4gICAgICB9LFxuICAgICAgaChcbiAgICAgICAgQ29tcG9uZW50LFxuICAgICAgICB7XG4gICAgICAgICAgLi4ucHJvcHMsXG4gICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuID09IG51bGwgPyBjaGlsZHJlbiA6IGgoXG4gICAgICAgICAgICBcImRpdlwiLFxuICAgICAgICAgICAgeyBbU0xPVF9BVFRSXTogXCJcIiwgc3R5bGU6IFwiZGlzcGxheTpjb250ZW50c1wiIH0sXG4gICAgICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgICApLFxuICAgICAgICB9IGFzIHVua25vd24gYXMgUCxcbiAgICAgICksXG4gICAgKTtcbiAgcmV0dXJuIFdyYXBwZWQ7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0JBQW9CO0FBQ3BCLHNCQUFzQjtBQUN0Qiw2QkFBNkI7QUFDN0IsK0NBQStDO0FBQy9DLGlEQUFpRDtBQUVqRCxTQUFxRCxDQUFDLFFBQVEsU0FBUztBQUV2RSxNQUFNLE9BQU8sSUFBSSxJQUFJLE9BQU8sWUFBWSxHQUFHLEVBQUUsSUFBSTtBQUNqRCxNQUFNLGFBQWEsT0FBTyxhQUFhO0FBRXZDLHFFQUFxRSxHQUNyRSxPQUFPLE1BQU0sWUFBWSxtQkFBbUI7QUFFNUM7Ozs7Ozs7Ozs7Ozs7O0NBY0MsR0FDRCxPQUFPLFNBQVMsT0FDZCxTQUFpQixFQUNqQixTQUEyQjtFQUUzQixJQUFJLFlBQVksT0FBTztFQUN2QixJQUFJLENBQUMsVUFBVSxVQUFVLENBQUMsT0FBTztJQUMvQixNQUFNLElBQUksTUFBTSxDQUFDLDRCQUE0QixFQUFFLFdBQVc7RUFDNUQ7RUFDQSxNQUFNLE1BQU0sTUFBTSxVQUFVLEtBQUssQ0FBQyxLQUFLLE1BQU07RUFDN0MsTUFBTSxVQUFnQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxHQUMzRCxFQUNFLE9BQ0E7TUFDRSxlQUFlO01BQ2YsY0FBYyxLQUFLLFNBQVMsQ0FBQztNQUM3QixPQUFPO0lBQ1QsR0FDQSxFQUNFLFdBQ0E7TUFDRSxHQUFHLEtBQUs7TUFDUixVQUFVLFlBQVksT0FBTyxXQUFXLEVBQ3RDLE9BQ0E7UUFBRSxDQUFDLFVBQVUsRUFBRTtRQUFJLE9BQU87TUFBbUIsR0FDN0M7SUFFSjtFQUdOLE9BQU87QUFDVCJ9