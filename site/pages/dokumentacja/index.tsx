// @project-metadata
// Path: site/pages/dokumentacja/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import SekcjaOProgramie from "@/site/elements/SekcjaOProgramie.section.tsx";

import { ChudaStopka, Drogowskaz } from "@/site/elements/Drogowskaz.section.tsx";
export default function Home() {
  return (
    <main class="page">
      <Drogowskaz />
      <SekcjaOProgramie numer="2.0:." tytul={`LEKTURA O "dot-gener"`} />
      <hr />
      🫟
      <ChudaStopka />
    </main>
  );
}
