// @project-metadata
// Path: site/widget/GuideBar.widget.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { ComponentChildren } from "preact";
import { cx } from "@/site/common/css/cx.ts";

export interface GuideBarItem {
  name: string;
  local: string;
  public?: string;
}

export interface GuideBarProps {
  items: GuideBarItem[];
  class?: string;
}

/**
 * Horizontal navigation bar, sticky at the top of the viewport.
 *
 *   <GuideBar items={[
 *     { name: "Wprowadzenie", local: "/guide/intro", public: "/guide/intro" },
 *     { name: "Instalacja", local: "/guide/install", public: "/guide/install" },
 *   ]} />
 */
export function GuideBar({ items, class: className }: GuideBarProps) {
  return (
    <nav class={cx("guide-bar", className)} aria-label="Nawigacja przewodnika">
      {items.map(({ name, local, public: published }) => (
        <a href={local} data-public={published}>
          {name}
        </a>
      ))}
    </nav>
  );
}
