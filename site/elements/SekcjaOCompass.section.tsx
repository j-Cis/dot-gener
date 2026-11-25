// @project-metadata
// Path: site/elements/SekcjaOWzorach.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { Title } from "@/site/features/ui/Title.widget.tsx";
import { tex } from "@/site/features/render/Tex.render.tsx";
import { tec } from "@/site/features/render/Tec.render.tsx";
import { Box, powtorz, Col,Row, Table } from "@/site/features/ui/Table.widget.tsx";
import Svg from "@/site/features/ui/Svg.island.tsx";
import Canvas from "@/site/features/ui/Canvas.island.tsx";
import * as xDot from "@/site/elements/DotxPrzyklady.sections.tsx";
//import { B, Dotx, E, G, N } from "@/site/features/render/Dotx.render.tsx";

export interface SekcjaOWzorachProps {
  numer: string;
  tytul: string;
}
export default function SekcjaOCompass(paragraf: SekcjaOWzorachProps) {
  const HUE = ['#6a5d46', '#466a56'];
  return (
    <article class="">
      <header>
        <Title prefix={paragraf.numer} level="h1" size="2.125rem">
          {paragraf.tytul}
        </Title>
      </header>
      <Title prefix="4.1" level="h2" size="1.25rem">
        <strong>ROZSZERZENIE RÓŻY WIATRÓW</strong>
      </Title>
      <Table cols={["7fr", "6fr"]} rows={powtorz(1, "auto")} gapX="0.5rem" gapY="0.5rem">
        <Col col={1} >{tex`
\begin{array}{|c|c|c|}
  \hline
  ${((a, c): string => {
    const lines: string[] = [];
    for (let i = 0; i < a.length; i += 3) {
      const color = c[(i / 3) % 2]; // wiersz 0 -> HUE[0], wiersz 1 -> HUE[1], itd.
      const chunk = a
        .slice(i, i + 3)
        .reverse()
        .map(([key, item], idx) => {
          const expr = `\\textbf{${key}}=${item.katex}`;
          return idx === 0 ? `\\colorbox{${color}}{$${expr}$}` : expr; // tylko 1. kolumna
        })
        .join(" & ");
      lines.push(chunk);
    }
    return lines.join(" \\\\\n  \\hline\n  ");
  })(Object.entries(AIM), HUE)} \\
  \hline
\end{array}
      `}</Col>
        <Col col={2} ><Svg><path d="M1115.264,1647.799L1115.264,1557.08C1115.264,1541.028 1120.278,1535.858 1129.537,1523.09L1153.553,1504.016C1162.811,1491.248 1167.826,1480.113 1167.826,1464.06L1167.826,1312.177C1167.826,1307.505 1165.396,1303.207 1161.492,1300.973C1157.588,1298.738 1152.835,1298.925 1149.1,1301.459L1115.264,1320.811L1186.13,1179.079L1256.996,1320.811L1223.159,1301.459C1219.425,1298.925 1214.671,1298.738 1210.767,1300.973C1206.863,1303.207 1204.434,1307.505 1204.434,1312.177L1204.434,1464.06C1204.434,1480.113 1209.448,1491.248 1218.707,1504.016L1242.723,1523.09C1251.981,1535.858 1256.996,1541.028 1256.996,1557.08L1256.996,1647.799L1232.519,1634.917C1227.978,1631.836 1222.198,1631.609 1217.452,1634.326C1212.706,1637.043 1209.752,1642.268 1209.752,1647.948C1209.752,1647.948 1209.752,1947.333 1209.752,1947.333C1209.752,1961.043 1199.176,1972.158 1186.13,1972.158C1173.084,1972.158 1162.508,1961.043 1162.508,1947.333L1162.508,1647.948C1162.508,1642.268 1159.554,1637.043 1154.807,1634.326C1150.061,1631.609 1144.281,1631.836 1139.741,1634.917L1115.264,1647.799Z" style="fill:rgb(35,0,0);"/></Svg></Col>
      </Table>
      
      < hr />
      {tex`
\begin{array}{|c|c|c|}
  \hline
  \colorbox{${HUE[0]}}{$\textbf{KK}=\dfrac{\pi}{4}$} & \textbf{KE}=\dfrac{\pi}{6} & \textbf{EK}=\dfrac{\pi}{12} \\
  \hline
  \colorbox{#EE82EE}{$\textbf{NN}=\dfrac{\pi}{2}$} & \textbf{NK}=\dfrac{5\pi}{12} & \textbf{KN}=\dfrac{\pi}{3} \\
  \hline
  \colorbox{#FFA500}{$\textbf{MM}=\dfrac{3\pi}{4}$} & \textbf{MN}=\dfrac{2\pi}{3} & \textbf{NM}=\dfrac{7\pi}{12} \\
  \hline
  \colorbox{#EE82EE}{$\textbf{WW}=\pi$} & \textbf{WM}=\dfrac{11\pi}{12} & \textbf{MW}=\dfrac{5\pi}{6} \\
  \hline
  \colorbox{#FFA500}{$\textbf{AA}=\dfrac{5\pi}{4}$} & \textbf{AW}=\dfrac{7\pi}{6} & \textbf{WA}=\dfrac{13\pi}{12} \\
  \hline
  \colorbox{#EE82EE}{$\textbf{SS}=\dfrac{3\pi}{2}$} & \textbf{SA}=\dfrac{17\pi}{12} & \textbf{AS}=\dfrac{4\pi}{3} \\
  \hline
  \colorbox{#FFA500}{$\textbf{FF}=\dfrac{7\pi}{4}$} & \textbf{FS}=\dfrac{5\pi}{3} & \textbf{SF}=\dfrac{19\pi}{12} \\
  \hline
  \colorbox{#EE82EE}{$\textbf{EE}=2\pi$} & \textbf{EF}=\dfrac{23\pi}{12} & \textbf{FE}=\dfrac{11\pi}{6} \\
  \hline
\end{array}      
      `}
    </article>
  );
}














type AimAngle = {
  readonly value: number;
  readonly katex: string;
};

// Funkcja pomocnicza tworząca obiekt z getterami (bez "new")
const piFrac = (num: number, den: number): AimAngle => ({
  get value() {
    return (num / den) * Math.PI;
  },
  get katex() {
    const numerator = num === 1 ? "\\pi" : `${num}\\pi`;
    return den === 1 ? numerator : `\\dfrac{${numerator}}{${den}}`;
  },
});

export const AIM = {
  // 1. ćwiartka
  EK: piFrac(1, 12),
  KE: piFrac(1, 6),
  KK: piFrac(1, 4),
  KN: piFrac(1, 3),
  NK: piFrac(5, 12),
  NN: piFrac(1, 2),

  // 2. ćwiartka
  NM: piFrac(7, 12),
  MN: piFrac(2, 3),
  MM: piFrac(3, 4),
  MW: piFrac(5, 6),
  WM: piFrac(11, 12),
  WW: piFrac(1, 1),

  // 3. ćwiartka
  WA: piFrac(13, 12),
  AW: piFrac(7, 6),
  AA: piFrac(5, 4),
  AS: piFrac(4, 3),
  SA: piFrac(17, 12),
  SS: piFrac(3, 2),

  // 4. ćwiartka
  SF: piFrac(19, 12),
  FS: piFrac(5, 3),
  FF: piFrac(7, 4),
  FE: piFrac(11, 6),
  EF: piFrac(23, 12),
  EE: piFrac(2, 1),
} as const;

// Typ reprezentujący wyłącznie te 24 dozwolone klucze ("EK" | "KE" | ...)
export type AimKey = keyof typeof AIM;
