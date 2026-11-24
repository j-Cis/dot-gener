// @project-metadata
// Path: site/elements/SekcjaOWzorach.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { Title } from "@/site/features/ui/Title.widget.tsx";
import { tex } from "@/site/features/render/Tex.render.tsx";
import { tec } from "@/site/features/render/Tec.render.tsx";
import { Box, powtorz, Row, Table } from "@/site/features/ui/Table.widget.tsx";
import Svg from "@/site/features/ui/Svg.island.tsx";
import Canvas from "@/site/features/ui/Canvas.island.tsx";

import { B, Dotx, E, G, N } from "@/site/features/render/Dotx.render.tsx";

const testGraph = (
  <>
    <N id="A" label="Start" shape="box" />
    <N id="B" />
    <E from="A" to="B" />

    <G id="cluster_1" node={{ fill: "#eef6ff", stroke: "#2563eb" }}>
      <N id="C" />
      <N id="D" />
      <E from="B" to="C" />
      <E from="C" to="D" />
    </G>

    <B node={{ fill: "#fef3c7" }}>
      <N id="E" />
      <N id="F" />
    </B>
    <E from="D" to="E" dashed />
    <E from="D" to="F" />
  </>
);

const testGraph2 = (
  <>
    <N id="A1" label="1" shape="circle" />
    <N id="A2" label="2" shape="circle" />
    <N id="A3" label="2" shape="circle" />
    <N id="A4" label="3" shape="circle" />
    <N id="A5" label="3" shape="circle" />
    <N id="A6" label="3" shape="circle" />
    <N id="A7" label="3" shape="circle" />
    <N id="A8" label="4" shape="circle" />
    <N id="A9" label="4" shape="circle" />
    <N id="A10" label="4" shape="circle" />
    <N id="A11" label="4" shape="circle" />
    <N id="A12" label="4" shape="circle" />
    <N id="A13" label="4" shape="circle" />
    <N id="A14" label="4" shape="circle" />
    <N id="A15" label="4" shape="circle" />
    <E from="A1" to="A2" />
    <E from="A1" to="A3" />
    <E from="A2" to="A4" />
    <E from="A2" to="A5" />
    <E from="A3" to="A6" />
    <E from="A3" to="A7" />
    <E from="A4" to="A8" />
    <E from="A4" to="A9" />
    <E from="A5" to="A10" />
    <E from="A5" to="A11" />
    <E from="A6" to="A12" />
    <E from="A6" to="A13" />
    <E from="A7" to="A14" />
    <E from="A7" to="A15" />
  </>
);

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

        Za punkt odniesienia przyjmuję cztery elementy składające się na półtora indeksu: {tec`iK`} — całkowity numer określający kondygnację,
        {tec`iL`} — numer najwyższego indeksu na danej kondygnacji, a także {tec`iA`} i {tec`iR`}{" "}
        — indeksy odpowiadające dwóm przeciwległym krawędziom w obrębie tej samej kondygnacji.

        Wszystkie cztery elementy są liczbami całkowitymi, przy czym wyłącznie
        {tec`iK`} może przyjmować wartości ujemne. Pozostałe są nieujemne.
      </p>
      <Table cols={["max"]} rows={powtorz(5, "auto")} gapX="0.5rem" gapY="0.5rem">
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
        <Row row={4}>
          <h3>SVG</h3>
          <Dotx mode="digraph" out="islandSvg" height="360px" background="#fff">
            {testGraph}
          </Dotx>
        </Row>
        <Row row={5}>
          <h3>Canvas</h3>
          <Dotx mode="digraph" out="islandCanvas" height="360px" background="#101116" edge={{ stroke: "#2563eb" }} node={{ fill: "#5466c1", stroke: "#2563eb" }}>
            {testGraph2}
          </Dotx>
        </Row>
      </Table>
    </article>
  );
}
