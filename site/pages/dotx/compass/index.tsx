// @project-metadata
// Path: site/pages/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import SekcjaOCompass from "@/site/elements/SekcjaOCompass.section.tsx";
import { ChudaStopka, Drogowskaz } from "@/site/elements/Drogowskaz.section.tsx";

export default function Home() {
  return (
    <main class="page">
      <Drogowskaz />
      <SekcjaOCompass numer="4.0:." tytul={`LEKTURA O KIERUNKACH`} />
      <hr />
      🫟
      <ChudaStopka />
    </main>
  );
}
