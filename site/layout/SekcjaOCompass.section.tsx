// @project-metadata
// Path: site/layout/SekcjaOCompass.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { Title } from "@/site/widget/Title.widgets.tsx";
import { tex } from "@/site/screen/Tex.render.tsx";
import { tec } from "@/site/screen/Tec.render.tsx";
import { Box, Col, powtorz, Row, RozmiarWiersza, Table } from "@/site/widget/Table.widget.tsx";
import ViewAsSvg from "@/site/client/ViewAsSvg.island.tsx";
import ViewAsCanvas from "@/site/client/ViewAsCanvas.island.tsx";
import * as xDot from "@/site/layout/DotxPrzyklady.sections.tsx";
//import { B, Dotx, E, G, N } from "@/site/screen/Dotx.render.tsx";

export interface SekcjaOWzorachProps {
  numer: string;
  tytul: string;
}
export default function SekcjaOCompass(paragraf: SekcjaOWzorachProps) {
  const HUE: [string, string][] = [
    ["#6a4669", "#dac3da"],
    ["#6a5846", "#d6c9bc"],
    ["#46506a", "#aeb8d2"],
    ["#6a5d46", "#0a0701"],
    ["#466a56", "#0a0701"],
    ["#101116", "#dcd9d3"],
  ];
  return (
    <>
      {pod_sekcja_1("450px", [2, 1], HUE, paragraf)}
    </>
  );
}

function pod_sekcja_1(w: RozmiarWiersza, k: [number, number], HUE: [string, string][], paragraf: { numer: string; tytul: string }) {
  function SVGCompass(kolor: [string, string][]) {
    function tarcza_kompasu(kolor: [string, string][]) {
      const DATA_GROT_KSZTALT: string[] = [
        "M1115.264,1647.799L1115.264,1557.08C1115.264,1541.028 1120.278,1535.858 1129.537,1523.09L1153.553,1504.016C1162.811,1491.248 1167.826,1480.113 1167.826,1464.06L1167.826,1312.177C1167.826,1307.505 1165.396,1303.207 1161.492,1300.973C1157.588,1298.738 1152.835,1298.925 1149.1,1301.459L1115.264,1320.811L1186.13,1179.079L1256.996,1320.811L1223.159,1301.459C1219.425,1298.925 1214.671,1298.738 1210.767,1300.973C1206.863,1303.207 1204.434,1307.505 1204.434,1312.177L1204.434,1464.06C1204.434,1480.113 1209.448,1491.248 1218.707,1504.016L1242.723,1523.09C1251.981,1535.858 1256.996,1541.028 1256.996,1557.08L1256.996,1647.799L1232.519,1634.917C1227.978,1631.836 1222.198,1631.609 1217.452,1634.326C1212.706,1637.043 1209.752,1642.268 1209.752,1647.948C1209.752,1647.948 1209.752,1947.333 1209.752,1947.333C1209.752,1961.043 1199.176,1972.158 1186.13,1972.158C1173.084,1972.158 1162.508,1961.043 1162.508,1947.333L1162.508,1647.948C1162.508,1642.268 1159.554,1637.043 1154.807,1634.326C1150.061,1631.609 1144.281,1631.836 1139.741,1634.917L1115.264,1647.799Z",
        "M1115.264,1647.799L1115.264,1557.08C1115.264,1541.028 1120.278,1535.858 1129.537,1523.09L1153.553,1504.016C1162.811,1491.248 1167.826,1480.113 1167.826,1464.06L1167.826,1312.177C1167.826,1307.505 1165.396,1303.207 1161.492,1300.973C1157.588,1298.738 1152.835,1298.925 1149.1,1301.459L1115.264,1320.811L1186.13,1179.079L1256.996,1320.811L1223.159,1301.459C1219.425,1298.925 1214.671,1298.738 1210.767,1300.973C1206.863,1303.207 1204.434,1307.505 1204.434,1312.177L1204.434,1464.06C1204.434,1480.113 1209.448,1491.248 1218.707,1504.016L1242.723,1523.09C1251.981,1535.858 1256.996,1541.028 1256.996,1557.08L1256.996,1647.799L1232.519,1634.917C1227.978,1631.836 1222.198,1631.609 1217.452,1634.326C1212.706,1637.043 1209.752,1642.268 1209.752,1647.948C1209.752,1647.948 1209.752,1947.285 1209.752,1947.333C1209.752,1947.333 1209.752,1947.333 1209.752,1947.333C1209.752,1961.043 1199.176,1972.158 1186.13,1972.158C1173.084,1972.158 1162.508,1961.043 1162.508,1947.333L1162.508,1647.948C1162.508,1642.268 1159.554,1637.043 1154.807,1634.326C1150.061,1631.609 1144.281,1631.836 1139.741,1634.917L1115.264,1647.799Z",
      ];

      const INDEX_GROT_KSZTALT = {
        NN: 0,
        WW: 0,
        SS: 0,
        EE: 0,
        KK: 0,
        MM: 0,
        AA: 0,
        FF: 0,

        KE: 0,
        NK: 0,
        MN: 1,
        WM: 0,
        EK: 1,
        KN: 1,
        NM: 1,
        MW: 1,
        AW: 1,
        SA: 0,
        FS: 1,
        EF: 1,
        WA: 1,
        AS: 1,
        SF: 1,
        FE: 0,
      } as const;
      type KeyGrotKsztalt = keyof typeof INDEX_GROT_KSZTALT;
      const OBROT: Record<KeyGrotKsztalt, string> = {
        NN: "matrix(0.752183,-0,0,1.341199,637.507501,-1098.479848)",
        WW: "matrix(0,-0.752183,1.341199,0,-1217.02878,2540.430792)",
        SS: "matrix(-0.752183,-0,0,-1.341199,2421.88186,4394.967073)",
        EE: "matrix(-0,0.752183,-1.341199,-0,4276.418141,756.056433)",
        KK: "matrix(0.531874,0.531874,-0.948371,0.948371,2841.049861,-924.854777)",
        MM: "matrix(0.531874,-0.531874,0.948371,0.948371,-1043.403709,336.888432)",
        AA: "matrix(-0.531874,-0.531874,0.948371,-0.948371,218.3395,4221.342002)",
        FF: "matrix(-0.531874,0.531874,-0.948371,-0.948371,4102.79307,2959.598793)",

        KE: "matrix(0.376092,0.65141,-1.161513,0.6706,3462.333385,-497.77488)",
        EK: "matrix(0.194679,0.726553,-1.295499,0.347128,3951.910775,75.552631)",
        NK: "matrix(0.726553,0.194679,-0.347128,1.295499,1378.812385,-1235.802549)",
        KN: "matrix(0.65141,0.376092,-0.6706,1.161513,2130.399648,-1176.582271)",
        MN: "matrix(0.65141,-0.376092,0.6706,1.161513,-616.323812,-284.395091)",
        NM: "matrix(0.726553,-0.194679,0.347128,1.295499,-42.996301,-773.972481)",
        WM: "matrix(0.194679,-0.726553,1.295499,0.347128,-1354.351481,1799.125908)",
        MW: "matrix(0.376092,-0.65141,1.161513,0.6706,-1295.131203,1047.538645)",
        AW: "matrix(-0.376092,-0.65141,1.161513,-0.6706,-402.944024,3794.262105)",
        WA: "matrix(-0.194679,-0.726553,1.295499,-0.347128,-892.521414,3220.934594)",
        SA: "matrix(-0.726553,-0.194679,0.347128,-1.295499,1680.576976,4532.289774)",
        AS: "matrix(-0.65141,-0.376092,0.6706,-1.161513,928.989713,4473.069496)",
        FS: "matrix(-0.65141,0.376092,-0.6706,-1.161513,3675.713173,3580.882317)",
        SF: "matrix(-0.726553,0.194679,-0.347128,-1.295499,3102.385662,4070.459707)",
        EF: "matrix(-0.194679,0.726553,-1.295499,-0.347128,4413.740842,1497.361317)",
        FE: "matrix(-0.376092,0.65141,-1.161513,-0.6706,4354.520564,2248.948581)",
      };

      const grot_path = (index: KeyGrotKsztalt) => (
        <g
          id={`grot${index}`}
          transform={OBROT[index]}
        >
          <path d={DATA_GROT_KSZTALT[INDEX_GROT_KSZTALT[index]]!} />
        </g>
      );

      return (
        <g id="kompas" transform="matrix(0.91217,0,0,0.91217,140.09085,386.284731)">
          <g style={{ fill: kolor[1]![0] }}>
            {(["WW", "SS", "EE", "NN"] as const).map(grot_path)}
          </g>

          <g style={{ fill: kolor[0]![0] }}>
            {(["MM", "AA", "FF", "KK"] as const).map(grot_path)}
          </g>

          <g style={{ fill: kolor[2]![0] }}>
            {(["NM", "MN", "MW", "WM", "WA", "AW", "AS", "SA", "SF", "FS", "EF", "FE", "EK", "KE", "NK", "KN"] as const).map(grot_path)}
          </g>
        </g>
      );
    }

    function wiatry_kompasu(kolor: [string, string][]) {
      type Kierunek =
        | "NN"
        | "WW"
        | "SS"
        | "EE"
        | "KK"
        | "MM"
        | "AA"
        | "FF"
        | "KE"
        | "NK"
        | "MN"
        | "WM"
        | "EK"
        | "KN"
        | "NM"
        | "MW"
        | "AW"
        | "SA"
        | "FS"
        | "EF"
        | "WA"
        | "AS"
        | "SF"
        | "FE";
      const nazwa_kierunku = (kierunek1: string, kierunek2?: string) => (
        <text x="3187.946px" y="1038.761px">
          {kierunek2 === undefined ? kierunek1 : (
            <>
              <tspan style={{ letterSpacing: "3.68px" }}>{kierunek1}</tspan>
              <tspan style={{ letterSpacing: "3.68px" }}>{kierunek2}</tspan>
            </>
          )}
        </text>
      );
      const OBROT: Record<Kierunek, string> = {
        NN: "matrix(1,0,0,1,-1700.462463,292.979062)",
        WW: "matrix(1,0,0,1,-2282.603933,873.18819)",
        SS: "matrix(1,0,0,1,-1700.462463,1436.354929)",
        EE: "matrix(1,0,0,1,-1127.514742,873.18819)",
        KK: "matrix(1,0,0,1,-1295.906506,467.686767)",
        MM: "matrix(1,0,0,1,-2107.834175,467.686767)",
        AA: "matrix(1,0,0,1,-2114.503446,1282.039566)",
        FF: "matrix(1,0,0,1,-1294.392834,1282.039566)",
        KE: "matrix(1,0,0,1,-1209.840854,588.353311)",
        EK: "matrix(1,0,0,1,-1147.261572,729.365319)",
        NK: "matrix(1,0,0,1,-1551.940942,317.176397)",
        KN: "matrix(1,0,0,1,-1415.100937,376.418092)",
        MN: "matrix(1,0,0,1,-1990.228894,365.362508)",
        NM: "matrix(1,0,0,1,-1850.242119,316.839739)",
        WM: "matrix(1,0,0,1,-2270.265022,723.107384)",
        MW: "matrix(1,0,0,1,-2218.002653,588.677464)",
        AW: "matrix(1,0,0,1,-2210.748261,1161.048868)",
        WA: "matrix(1,0,0,1,-2264.215057,1020.638916)",
        SA: "matrix(1,0,0,1,-1852.981817,1457.561073)",
        AS: "matrix(1,0,0,1,-1995.95919,1374.678761)",
        FS: "matrix(1,0,0,1,-1408.425725,1371.84596)",
        SF: "matrix(1,0,0,1,-1546.431351,1430.253239)",
        EF: "matrix(1,0,0,1,-1148.095911,1021.401981)",
        FE: "matrix(1,0,0,1,-1205.668851,1156.57323)",
      };

      const grot_text = (index: Kierunek) => (
        <g
          id={`nazwa${index}`}
          transform={OBROT[index]}
        >
          {nazwa_kierunku(`${index}`)}
        </g>
      );

      return (
        <g id="kierunki" style={{ fontFamily: "'Arial-BoldMT', 'Arial', sans-serif", fontWeight: 700, fontSize: "66.667px" }}>
          <g style={{ fill: kolor[1]![1] }}>
            {(["WW", "SS", "EE", "NN"] as const).map(grot_text)}
          </g>

          <g style={{ fill: kolor[0]![1] }}>
            {(["MM", "AA", "FF", "KK"] as const).map(grot_text)}
          </g>

          <g style={{ fill: kolor[2]![1] }}>
            {(["NM", "MN", "MW", "WM", "WA", "AW", "AS", "SA", "SF", "FS", "EF", "FE", "EK", "KE", "NK", "KN"] as const).map(grot_text)}
          </g>
        </g>
      );
    }
    return (
      <svg
        width="2276"
        height="2276"
        viewBox="0 0 2276 2276"
        xmlns="http://www.w3.org/2000/svg"
        style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
      >
        <g transform="matrix(1,0,0,1,-64.102396,-490.466812)">
          <g id="COMPASS" transform="matrix(1.070273,0,0,1.070273,-441.538566,-394.404872)">
            {tarcza_kompasu(kolor)}
            {wiatry_kompasu(kolor)}
          </g>
        </g>
      </svg>
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

  const AIM = {
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
  type AimKey = keyof typeof AIM;

  return (
    <section class="">
      <header>
        <Title prefix={paragraf.numer} level="h1" size="2.125rem">
          {paragraf.tytul}
        </Title>
      </header>
      <Title prefix="4.1" level="h2" size="1.25rem">
        <strong>ROZSZERZENIE RÓŻY WIATRÓW</strong>
      </Title>
      <Table cols={["7fr", "6fr"]} rows={[w]} gapX="0.5rem" gapY="0.5rem">
        <Col col={k[0]}>
          {tex`
\begin{array}{|c|c|c|}
  \hline
  ${
            ((a, c): string => {
              const lines: string[] = [];
              for (let i = 0; i < a.length; i += 3) {
                const color = c[(i / 3) % 2]![0]; // wiersz 0 -> HUE[0][0], wiersz 1 -> HUE[1][0], itd.
                const chunk = a
                  .slice(i, i + 3)
                  .reverse()
                  .map(([key, item], idx) => {
                    const expr = `\\textbf{${key}}=${item.katex}`;
                    return idx === 0 ? `\\colorbox{${color}}{$${expr}$}` : `\\colorbox{${c[2]![0]}}{$${expr}$}`; // tylko 1. kolumna
                  })
                  .join(" & ");
                lines.push(chunk);
              }
              return lines.join(" \\\\\n  \\hline\n  ");
            })(Object.entries(AIM), HUE)
          } \\
  \hline
\end{array}
      `}
        </Col>
        <Col col={k[1]}>
          <ViewAsSvg>{SVGCompass(HUE)}</ViewAsSvg>
        </Col>
      </Table>
    </section>
  );
}
