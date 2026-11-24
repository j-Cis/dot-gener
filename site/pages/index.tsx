import SekcjaOWzorach from "@/site/elements/SekcjaOWzorach.section.tsx";
import SekcjaOProgramie from "@/site/elements/SekcjaOProgramie.section.tsx";
import SekcjaOLekturze from "@/site/elements/SekcjaOLekturze.section.tsx";

export default function Home() {
  return (
    <main class="page">
      <SekcjaOProgramie numer="1.0:." tytul={`LEKTURA O "dot-gener"`} />
      <hr />
      <SekcjaOWzorach numer="2.0:." tytul={`LEKTURA O WZORACH`} />
      <hr />
      <SekcjaOLekturze numer="3.0:." tytul={`LEKTURA O LEKTURZE`} />
      <hr />
      🫟
    </main>
  );
}
