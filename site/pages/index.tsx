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
