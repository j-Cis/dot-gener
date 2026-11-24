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
