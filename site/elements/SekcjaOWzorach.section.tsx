import { Title } from "@/site/features/ui/Title.widget.tsx";
import { tex } from "@/site/features/pipe/Tex.widget.tsx";
import { tec } from "@/site/features/pipe/Tec.widget.tsx";
import { Box, powtorz, Row, Table } from "@/site/features/ui/Table.widget.tsx";
import Svg from "@/site/features/ui/Svg.island.tsx";
import Canvas from "@/site/features/ui/Canvas.island.tsx";
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
      <Title prefix="1.1" level="h2" size="1.25rem">
          <strong>PUNKT ODNIESIENIA</strong>
        </Title>
      <p>

        Aby móc o czymkolwiek mówić, należy najpierw ustalić punkt odniesienia — w przeciwnym razie łatwo zatracić się w odmętach abstrakcji, podążając naprzód i widząc własne
        plecy.

        Za punkt odniesienia przyjmuję cztery elementy składające się na półtora
  indeksu: {tec`iK`} — całkowity numer określający kondygnację,
  {tec`iL`} — numer najwyższego indeksu na danej kondygnacji,
  a także {tec`iA`} i {tec`iR`} — indeksy odpowiadające dwóm przeciwległym
  krawędziom w obrębie tej samej kondygnacji.

  Wszystkie cztery elementy są liczbami całkowitymi, przy czym wyłącznie
  {tec`iK`} może przyjmować wartości ujemne. Pozostałe są nieujemne.
      </p>
      <Table cols={["max"]} rows={powtorz(3, "auto")} gapX="0.5rem" gapY="0.5rem">
        <Row row={1}>{tex`0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,..`}</Row>
        <Row row={2}>
          <Canvas
  registryKey="test"
  dane="Test 123"
  sceneWidth={400}
  sceneHeight={240}
  height="400px"
  background="#ffffff"
/>
        </Row>
        <Row row={3}>
          <Svg>s</Svg>
        </Row>
      </Table>
    </article>
  );
}
