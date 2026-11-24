// @project-metadata
// Path: site/pages/o-dokumentacji/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import SekcjaOLekturze from "@/site/elements/SekcjaOLekturze.section.tsx";

import { ChudaStopka, Drogowskaz } from "@/site/elements/Drogowskaz.section.tsx";
export default function Home() {
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
