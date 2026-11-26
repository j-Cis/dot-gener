// @project-metadata
// Path: site/pages/o-dokumentacji/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import SekcjaOLekturze from "@/site/layout/SekcjaOLekturze.section.tsx";

import { ChudaStopka, Drogowskaz } from "@/site/layout/Drogowskaz.section.tsx";
export default function WebPage() {
  return (
    <main class="page">
      <Drogowskaz />
      <SekcjaOLekturze numer="3.0:." tytul={`LEKTURA O LEKTURZE`} />
      <hr />
      🫟
      <ChudaStopka />
    </main>
  );
}
