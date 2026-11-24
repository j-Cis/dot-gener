// @project-metadata
// Path: web/client.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYi9jbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQHByb2plY3QtbWV0YWRhdGFcbi8vIFBhdGg6IHdlYi9jbGllbnQudHNcbi8vIEF1dGhvcjogSmFuIFJvbWFuIENpc293c2tpXG4vLyBPUkNJRDogaHR0cHM6Ly9vcmNpZC5vcmcvMDAwOS0wMDA5LTI5MDctMzc5MlxuLy8gUmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2otQ2lzL2RvdC1nZW5lclxuXG5pbXBvcnQgeyB0eXBlIENvbXBvbmVudFR5cGUsIGgsIGh5ZHJhdGUgfSBmcm9tIFwicHJlYWN0XCI7XG5pbXBvcnQgeyBTTE9UX0FUVFIgfSBmcm9tIFwiQC93ZWIvaXNsYW5kLnRzXCI7XG5cbi8vIEh5ZHJhdGVzIGV2ZXJ5IDxkaXYgZGF0YS1pc2xhbmQ9XCIvc2l0ZS9mZWF0dXJlcy/igKYvWC5pc2xhbmQudHN4XCI+IHdpdGggdGhlIGRlZmF1bHRcbi8vIGV4cG9ydCBvZiB0aGF0IG1vZHVsZS5cbmNvbnN0IGlzbGFuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50PihcIltkYXRhLWlzbGFuZF1cIik7XG5cbmF3YWl0IFByb21pc2UuYWxsKFsuLi5pc2xhbmRzXS5tYXAoYXN5bmMgKGVsKSA9PiB7XG4gIGNvbnN0IG1vZDogeyBkZWZhdWx0OiBDb21wb25lbnRUeXBlIH0gPSBhd2FpdCBpbXBvcnQoYCR7ZWwuZGF0YXNldC5pc2xhbmR9YCk7XG4gIGNvbnN0IHByb3BzID0gSlNPTi5wYXJzZShlbC5kYXRhc2V0LnByb3BzID8/IFwie31cIik7XG4gIGNvbnN0IHNsb3QgPSBvd25TbG90KGVsKTtcbiAgaWYgKHNsb3QpIHtcbiAgICAvLyBTZXJ2ZXItcmVuZGVyZWQgY2hpbGRyZW4sIHBhc3NlZCBiYWNrIGFzIHRoZSBzYW1lIEhUTUw6IFByZWFjdCBkb2VzIG5vdFxuICAgIC8vIHRvdWNoIGlubmVySFRNTCB3aGlsZSBoeWRyYXRpbmcsIG5vciBsYXRlciB3aGlsZSB0aGUgc3RyaW5nIGlzIHVuY2hhbmdlZC5cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGgoXCJkaXZcIiwge1xuICAgICAgW1NMT1RfQVRUUl06IFwiXCIsXG4gICAgICBzdHlsZTogXCJkaXNwbGF5OmNvbnRlbnRzXCIsXG4gICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTDogeyBfX2h0bWw6IHNsb3QuaW5uZXJIVE1MIH0sXG4gICAgfSk7XG4gIH1cbiAgaHlkcmF0ZShoKG1vZC5kZWZhdWx0LCBwcm9wcyksIGVsKTtcbn0pKTtcblxuLyoqIFRoZSBzbG90IG9mIHRoaXMgaXNsYW5kIChub3Qgb2YgYW4gaXNsYW5kIG5lc3RlZCBpbnNpZGUgaXQpLiAqL1xuZnVuY3Rpb24gb3duU2xvdChlbDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICBmb3IgKGNvbnN0IHMgb2YgZWwucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oYFske1NMT1RfQVRUUn1dYCkpIHtcbiAgICBpZiAocy5jbG9zZXN0KFwiW2RhdGEtaXNsYW5kXVwiKSA9PT0gZWwpIHJldHVybiBzO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQjtBQUNwQixzQkFBc0I7QUFDdEIsNkJBQTZCO0FBQzdCLCtDQUErQztBQUMvQyxpREFBaUQ7QUFFakQsU0FBNkIsQ0FBQyxFQUFFLE9BQU8sUUFBUSxTQUFTO0FBQ3hELFNBQVMsU0FBUyxRQUFRLGtCQUFrQjtBQUU1QyxvRkFBb0Y7QUFDcEYseUJBQXlCO0FBQ3pCLE1BQU0sVUFBVSxTQUFTLGdCQUFnQixDQUFjO0FBRXZELE1BQU0sUUFBUSxHQUFHLENBQUM7S0FBSTtDQUFRLENBQUMsR0FBRyxDQUFDLE9BQU87RUFDeEMsTUFBTSxNQUFrQyxNQUFNLE1BQU0sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRTtFQUMzRSxNQUFNLFFBQVEsS0FBSyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJO0VBQzdDLE1BQU0sT0FBTyxRQUFRO0VBQ3JCLElBQUksTUFBTTtJQUNSLDBFQUEwRTtJQUMxRSw0RUFBNEU7SUFDNUUsTUFBTSxRQUFRLEdBQUcsRUFBRSxPQUFPO01BQ3hCLENBQUMsVUFBVSxFQUFFO01BQ2IsT0FBTztNQUNQLHlCQUF5QjtRQUFFLFFBQVEsS0FBSyxTQUFTO01BQUM7SUFDcEQ7RUFDRjtFQUNBLFFBQVEsRUFBRSxJQUFJLE9BQU8sRUFBRSxRQUFRO0FBQ2pDO0FBRUEsaUVBQWlFLEdBQ2pFLFNBQVMsUUFBUSxFQUFlO0VBQzlCLEtBQUssTUFBTSxLQUFLLEdBQUcsZ0JBQWdCLENBQWMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsRUFBRztJQUNsRSxJQUFJLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixJQUFJLE9BQU87RUFDaEQ7RUFDQSxPQUFPO0FBQ1QifQ==