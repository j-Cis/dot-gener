// @project-metadata
// Path: site/layout/SekcjaOWzorach.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { P, powtorz, Row, Table, Title } from "@/site/widget/_ANY.ts";
import { tex } from "@/site/screen/Tex.render.tsx";
import { tec } from "@/site/screen/Tec.render.tsx";
import VectorViewport from "@/site/client/VectorViewport.island.tsx";
import { RYSUNKI } from "@/site/client/registries/for-island-canvas.ts";
import * as xDot from "@/site/layout/DotxPrzyklady.sections.tsx";
//import { B, Dotx, E, G, N } from "@/site/screen/Dotx.render.tsx";

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
      <P noindent>
        Aby móc o czymkolwiek mówić, należy najpierw ustalić punkt odniesienia — w przeciwnym razie łatwo zatracić się w odmętach abstrakcji, podążając naprzód i widząc własne
        plecy.

        Za punkt odniesienia przyjmuję cztery elementy składające się na półtora indeksu: {tec`iK`} — całkowity numer określający kondygnację,
        {tec`iL`} — numer najwyższego indeksu na danej kondygnacji, a także {tec`iA`} i {tec`iR`}{" "}
        — indeksy odpowiadające dwóm przeciwległym krawędziom w obrębie tej samej kondygnacji.

        Wszystkie cztery elementy są liczbami całkowitymi, przy czym wyłącznie
        {tec`iK`} może przyjmować wartości ujemne. Pozostałe są nieujemne.
      </P>
      <Table cols={["max"]} rows={powtorz(7, "auto")} gapX="0.5rem" gapY="0.5rem">
        <Row row={1}>{tex`0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,..`}</Row>
        <Row row={2}>
          <VectorViewport
            renderer="Canvas"
            sourceFormat="CANVAS"
            source={RYSUNKI.test}
            data="Test 123"
            scene={[400, 240]}
            height="400px"
            background="#ffffff"
          />
        </Row>
        <Row row={3}>
          <VectorViewport renderer="SVG" sourceFormat="SVG">s</VectorViewport>
        </Row>
        <Row row={4}>
          <xDot.DotxPrzykladSvg punkt="X.1.a" />
        </Row>
        <Row row={5}>
          <xDot.DotxPrzykladCanvas punkt="X.1.b" />
        </Row>
        <Row row={6}>
          <xDot.DotxPrzykladSosaSvg punkt="X.2.a" />
        </Row>
        <Row row={7}>
          <xDot.DotxPrzykladSosaCanvas punkt="X.2.b" />
        </Row>
      </Table>
    </article>
  );
}
