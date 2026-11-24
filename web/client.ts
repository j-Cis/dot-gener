import { type ComponentType, h, hydrate } from "preact";
import { SLOT_ATTR } from "@/web/island.ts";

// Hydrates every <div data-island="/site/features/…/X.island.tsx"> with the default
// export of that module.
const islands = document.querySelectorAll<HTMLElement>("[data-island]");

await Promise.all([...islands].map(async (el) => {
  const mod: { default: ComponentType } = await import(`${el.dataset.island}`);
  const props = JSON.parse(el.dataset.props ?? "{}");
  const slot = ownSlot(el);
  if (slot) {
    // Server-rendered children, passed back as the same HTML: Preact does not
    // touch innerHTML while hydrating, nor later while the string is unchanged.
    props.children = h("div", {
      [SLOT_ATTR]: "",
      style: "display:contents",
      dangerouslySetInnerHTML: { __html: slot.innerHTML },
    });
  }
  hydrate(h(mod.default, props), el);
}));

/** The slot of this island (not of an island nested inside it). */
function ownSlot(el: HTMLElement): HTMLElement | null {
  for (const s of el.querySelectorAll<HTMLElement>(`[${SLOT_ATTR}]`)) {
    if (s.closest("[data-island]") === el) return s;
  }
  return null;
}
