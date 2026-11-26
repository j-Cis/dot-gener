// @project-metadata
// Path: site/layout/Drogowskaz.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { GuideBar } from "@/site/widget/GuideBar.widget.tsx";
export function Drogowskaz() {
  return (
    <GuideBar
      items={[
        { name: "?", local: "/404" /*, public: "/guide/intro"*/ },
        { name: "1.0:. Wzory", local: "/" /*, public: "/guide/intro"*/ },
        { name: "2.0:. Dokumentacja", local: "/dokumentacja" /*, public: "/guide/intro"*/ },
        { name: "3.0:. O dokumentacji", local: "/o-dokumentacji" /*, public: "/guide/intro"*/ },
      ]}
    />
  );
}

import { FootBar } from "@/site/widget/FootBar.widget.tsx";

export function ChudaStopka() {
  return (
    <FootBar
      items={[
        { name: "GitHub", href: "https://github.com/j-Cis/dot-gener" },
        { name: "Facebook", href: "https://www.facebook.com/Cisowski/" },
        { name: "j-cis.github.io/dot-gener", href: "https://j-cis.github.io/dot-gener/" },
        { name: ".", href: "http://localhost:8000/" },
      ]}
    />
  );
}
