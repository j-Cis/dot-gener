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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYi9pc2xhbmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBDb21wb25lbnRUeXBlLCB0eXBlIEZ1bmN0aW9uQ29tcG9uZW50LCBoIH0gZnJvbSBcInByZWFjdFwiO1xuXG5jb25zdCBST09UID0gbmV3IFVSTChcIi4uL1wiLCBpbXBvcnQubWV0YS51cmwpLmhyZWY7XG5jb25zdCBJU19CUk9XU0VSID0gdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiO1xuXG4vKiogTWFya3MgdGhlIHNlcnZlci1yZW5kZXJlZCBjaGlsZHJlbiBvZiBhbiBpc2xhbmQgKHNlZSBjbGllbnQudHMpLiAqL1xuZXhwb3J0IGNvbnN0IFNMT1RfQVRUUiA9IFwiZGF0YS1pc2xhbmQtc2xvdFwiO1xuXG4vKipcbiAqIE1hcmtzIGEgY29tcG9uZW50IGFzIGFuIGlzbGFuZC4gSW4gYSBzaXRlL2ZlYXR1cmVzLyoqXFwvKi5pc2xhbmQudHN4IGZpbGU6XG4gKlxuICogICBleHBvcnQgZGVmYXVsdCBpc2xhbmQoaW1wb3J0Lm1ldGEudXJsLCBmdW5jdGlvbiBDb3VudGVyKHByb3BzKSB7IOKApiB9KTtcbiAqXG4gKiBTZXJ2ZXI6IHJlbmRlcnMgdGhlIGNvbXBvbmVudCBpbnNpZGVcbiAqICAgPGRpdiBkYXRhLWlzbGFuZD1cIi9zaXRlL2ZlYXR1cmVzL+KApi9YLmlzbGFuZC50c3hcIiBkYXRhLXByb3BzPVwie+KApn1cIj4uXG4gKiBCcm93c2VyOiByZXR1cm5zIHRoZSBjb21wb25lbnQgaXRzZWxmOyBjbGllbnQudHMgaW1wb3J0cyB0aGF0IHBhdGggYW5kXG4gKiBoeWRyYXRlcyBpdC5cbiAqXG4gKiBQcm9wcyBtdXN0IGJlIEpTT04tc2VyaWFsaXphYmxlLCBleGNlcHQgYGNoaWxkcmVuYDogdGhvc2UgYXJlIHJlbmRlcmVkIG9uXG4gKiB0aGUgc2VydmVyIGludG8gYSBzbG90IGFuZCBrZXB0IGFzIHN0YXRpYyBIVE1MIGluIHRoZSBicm93c2VyICh0aGVpciBET00gaXNcbiAqIG5vdCByZS1yZW5kZXJlZCBieSB0aGUgaXNsYW5kLCBzbyB0aGV5IGNhbm5vdCBiZSBpbnRlcmFjdGl2ZSBQcmVhY3QgY29kZSDigJRcbiAqIG5lc3RlZCBpc2xhbmRzIGluc2lkZSB0aGVtIHN0aWxsIGh5ZHJhdGUgb24gdGhlaXIgb3duKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzbGFuZDxQIGV4dGVuZHMgb2JqZWN0PihcbiAgbW9kdWxlVXJsOiBzdHJpbmcsXG4gIENvbXBvbmVudDogQ29tcG9uZW50VHlwZTxQPixcbik6IENvbXBvbmVudFR5cGU8UD4ge1xuICBpZiAoSVNfQlJPV1NFUikgcmV0dXJuIENvbXBvbmVudDtcbiAgaWYgKCFtb2R1bGVVcmwuc3RhcnRzV2l0aChST09UKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgaXNsYW5kIG91dHNpZGUgdGhlIHByb2plY3Q6ICR7bW9kdWxlVXJsfWApO1xuICB9XG4gIGNvbnN0IHNyYyA9IFwiL1wiICsgbW9kdWxlVXJsLnNsaWNlKFJPT1QubGVuZ3RoKTtcbiAgY29uc3QgV3JhcHBlZDogRnVuY3Rpb25Db21wb25lbnQ8UD4gPSAoeyBjaGlsZHJlbiwgLi4ucHJvcHMgfSkgPT5cbiAgICBoKFxuICAgICAgXCJkaXZcIixcbiAgICAgIHtcbiAgICAgICAgXCJkYXRhLWlzbGFuZFwiOiBzcmMsXG4gICAgICAgIFwiZGF0YS1wcm9wc1wiOiBKU09OLnN0cmluZ2lmeShwcm9wcyksXG4gICAgICAgIHN0eWxlOiBcImRpc3BsYXk6Y29udGVudHNcIixcbiAgICAgIH0sXG4gICAgICBoKFxuICAgICAgICBDb21wb25lbnQsXG4gICAgICAgIHtcbiAgICAgICAgICAuLi5wcm9wcyxcbiAgICAgICAgICBjaGlsZHJlbjogY2hpbGRyZW4gPT0gbnVsbCA/IGNoaWxkcmVuIDogaChcbiAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICB7IFtTTE9UX0FUVFJdOiBcIlwiLCBzdHlsZTogXCJkaXNwbGF5OmNvbnRlbnRzXCIgfSxcbiAgICAgICAgICAgIGNoaWxkcmVuLFxuICAgICAgICAgICksXG4gICAgICAgIH0gYXMgdW5rbm93biBhcyBQLFxuICAgICAgKSxcbiAgICApO1xuICByZXR1cm4gV3JhcHBlZDtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxTQUFxRCxDQUFDLFFBQVEsU0FBUztBQUV2RSxNQUFNLE9BQU8sSUFBSSxJQUFJLE9BQU8sWUFBWSxHQUFHLEVBQUUsSUFBSTtBQUNqRCxNQUFNLGFBQWEsT0FBTyxhQUFhO0FBRXZDLHFFQUFxRSxHQUNyRSxPQUFPLE1BQU0sWUFBWSxtQkFBbUI7QUFFNUM7Ozs7Ozs7Ozs7Ozs7O0NBY0MsR0FDRCxPQUFPLFNBQVMsT0FDZCxTQUFpQixFQUNqQixTQUEyQjtFQUUzQixJQUFJLFlBQVksT0FBTztFQUN2QixJQUFJLENBQUMsVUFBVSxVQUFVLENBQUMsT0FBTztJQUMvQixNQUFNLElBQUksTUFBTSxDQUFDLDRCQUE0QixFQUFFLFdBQVc7RUFDNUQ7RUFDQSxNQUFNLE1BQU0sTUFBTSxVQUFVLEtBQUssQ0FBQyxLQUFLLE1BQU07RUFDN0MsTUFBTSxVQUFnQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxHQUMzRCxFQUNFLE9BQ0E7TUFDRSxlQUFlO01BQ2YsY0FBYyxLQUFLLFNBQVMsQ0FBQztNQUM3QixPQUFPO0lBQ1QsR0FDQSxFQUNFLFdBQ0E7TUFDRSxHQUFHLEtBQUs7TUFDUixVQUFVLFlBQVksT0FBTyxXQUFXLEVBQ3RDLE9BQ0E7UUFBRSxDQUFDLFVBQVUsRUFBRTtRQUFJLE9BQU87TUFBbUIsR0FDN0M7SUFFSjtFQUdOLE9BQU87QUFDVCJ9