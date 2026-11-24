import { Title } from "@/site/features/ui/Title.widget.tsx";
export interface SekcjaOWzorachProps {
  numer: string;
  tytul: string;
}
export default function SekcjaOWzorach(paragraf: SekcjaOWzorachProps) {
  return (
    <article class="">
      <header>
        <Title prefix={paragraf.numer} level="h1" size="2.125rem">
          {paragraf.tytul}
        </Title>
      </header>
      SekcjaOWzorach
    </article>
  );
}
