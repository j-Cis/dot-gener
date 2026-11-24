import SekcjaOProgramie from "@/site/elements/SekcjaOProgramie.section.tsx";

import Drogowskaz from "@/site/elements/Drogowskaz.section.tsx";
export default function Home() {
  return (
    <main class="page">
      <Drogowskaz />
      <SekcjaOProgramie numer="2.0:." tytul={`LEKTURA O "dot-gener"`} />
      <hr />
      🫟
    </main>
  );
}
