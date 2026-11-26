// @project-metadata
// Path: site/layout/DotxPrzyklady.sections.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { Title } from "@/site/widget/Title.widgets.tsx";

import { B, Dotx, E, F, G, N, TE, TN } from "@/site/screen/Dotx.render.tsx";
import type { PortDef } from "@/site/scripts/lang/dotx/model.ts";

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

const SOSA_PORTS: PortDef[] = [
  { id: "ojciec", pos: "BL", shape: "diamond", size: 6, fill: "#3b82f6", stroke: "#1d4ed8" },
  { id: "matka", pos: "BR", shape: "diamond", size: 6, fill: "#ef4444", stroke: "#b91c1c" },
  { id: "syn", pos: "TL", shape: "circle", size: 5, fill: "#2dd4bf", stroke: "#0f766e" },
  { id: "corka", pos: "TR", shape: "circle", size: 5, fill: "#f472b6", stroke: "#be185d" },
  { id: "osoba", pos: "T", shape: "none" },
];

const SOSA_LAYOUT = [
  ["iK", "iL"],
  ["iA", "iR"],
  ["jA", "jR"],
];

const SOSA_DEFAULTS = { iK: 0, iA: 0, iR: 0, iL: 0, jA: 0, jR: 0 };

const osoby = Array.from({ length: 16 }, (_, idx) => {
  const jA = idx + 1;
  const iK = Math.floor(Math.log2(jA)) + 1;
  const iL = 1 << (iK - 1);
  const start = iL;
  const iA = jA - start + 1;
  const iR = iL - iA + 1;
  const jR = start + iR - 1;
  const use = jA === 1 ? "osoba_u" : jA % 2 === 0 ? "osoba_m" : "osoba_k";

  return { id: `P${jA}`, label: `Osoba #${jA}`, use, jA, values: { iK, iA, iR, iL, jA, jR } };
});

const krawedzie = osoby.flatMap((o) => {
  const list: { from: string; to: string; fromPort: string; use: string }[] = [];
  if (o.jA * 2 <= 16) {
    list.push({ from: o.id, to: `P${o.jA * 2}`, fromPort: "ojciec", use: "ojciec_dziecko" });
  }
  if (o.jA * 2 + 1 <= 16) {
    list.push({ from: o.id, to: `P${o.jA * 2 + 1}`, fromPort: "matka", use: "matka_dziecko" });
  }
  return list;
});

const testGraphSosa = (
  <>
    <TN id="osoba_u" shape="box" fill="#f3e8ff" stroke="#7e22ce" ports={SOSA_PORTS} values={SOSA_DEFAULTS} valuesLayout={SOSA_LAYOUT} />
    <TN id="osoba_m" shape="box" fill="#dbeafe" stroke="#2563eb" ports={SOSA_PORTS} values={SOSA_DEFAULTS} valuesLayout={SOSA_LAYOUT} />
    <TN id="osoba_k" shape="box" fill="#fee2e2" stroke="#dc2626" ports={SOSA_PORTS} values={SOSA_DEFAULTS} valuesLayout={SOSA_LAYOUT} />

    <TE id="ojciec_dziecko" stroke="#2563eb" />
    <TE id="matka_dziecko" stroke="#dc2626" />

    {osoby.map((o) => <N key={o.id} id={o.id} use={o.use} label={o.label} values={o.values} />)}

    {krawedzie.map((e) => (
      <E
        key={`${e.from}-${e.to}`}
        from={e.from}
        fromPort={e.fromPort}
        to={e.to}
        toPort="osoba"
        use={e.use}
      />
    ))}

    {/* 3 przepływy porządkujące pokolenia po jR */}
    <F by="jR" range={[2, 3]} dir="horizontal" mode="line" />
    <F by="jR" range={[4, 7]} dir="horizontal" mode="line" />
    <F by="jR" range={[8, 15]} dir="horizontal" mode="line" />
  </>
);

export interface DotxPrzykladSvgProps {
  punkt: string;
}
export function DotxPrzykladSvg({ punkt }: DotxPrzykladSvgProps) {
  return (
    <>
      <header>
        <Title prefix={punkt} level="h3" size="1.125rem">
          <strong>PRZYKŁAD 1 (islandSvg)</strong>
        </Title>
      </header>
      <Dotx mode="digraph" out="islandSvg" height="360px" background="#fff">
        {testGraph}
      </Dotx>
    </>
  );
}

export interface DotxPrzykladCanvasProps {
  punkt: string;
}
export function DotxPrzykladCanvas({ punkt }: DotxPrzykladCanvasProps) {
  return (
    <>
      <header>
        <Title prefix={punkt} level="h3" size="1.125rem">
          <strong>PRZYKŁAD 2 (islandCanvas)</strong>
        </Title>
      </header>
      <Dotx mode="digraph" out="islandCanvas" height="360px" background="#101116" edge={{ stroke: "#2563eb" }} node={{ fill: "#5466c1", stroke: "#2563eb" }}>
        {testGraph2}
      </Dotx>
    </>
  );
}

export interface DotxPrzykladSosaSvgProps {
  punkt: string;
}
export function DotxPrzykladSosaSvg({ punkt }: DotxPrzykladSosaSvgProps) {
  return (
    <>
      <header>
        <Title prefix={punkt} level="h3" size="1.125rem">
          <strong>PRZYKŁAD Sosa (islandSvg)</strong>
        </Title>
      </header>
      <Dotx mode="digraph" out="islandSvg" height="520px" background="#fff">
        {testGraphSosa}
      </Dotx>
    </>
  );
}

export interface DotxPrzykladSosaCanvasProps {
  punkt: string;
}
export function DotxPrzykladSosaCanvas({ punkt }: DotxPrzykladSosaCanvasProps) {
  return (
    <>
      <header>
        <Title prefix={punkt} level="h3" size="1.125rem">
          <strong>PRZYKŁAD Sosa (islandCanvas)</strong>
        </Title>
      </header>
      <Dotx mode="digraph" out="islandCanvas" height="520px" background="#fff">
        {testGraphSosa}
      </Dotx>
    </>
  );
}
