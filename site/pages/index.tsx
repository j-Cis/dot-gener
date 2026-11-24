// @project-metadata
// Path: site/pages/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import SekcjaOWzorach from "@/site/elements/SekcjaOWzorach.section.tsx";
import { ChudaStopka, Drogowskaz } from "@/site/elements/Drogowskaz.section.tsx";

export default function Home() {
  return (
    <main class="page">
      <Drogowskaz />
      <SekcjaOWzorach numer="1.0:." tytul={`LEKTURA O WZORACH`} />
      <hr />
      🫟
      <ChudaStopka />
    </main>
  );
}
