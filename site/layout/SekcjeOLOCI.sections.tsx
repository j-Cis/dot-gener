// @project-metadata
// Path: site/layout/SekcjaOCompass.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { Box, powtorz, Row, Table, TitleSection, P } from "@/site/widget/_ANY.ts";
import { tec } from "@/site/screen/Tec.render.tsx";
import { tex } from "@/site/screen/Tex.render.tsx";
//import { B, Dotx, E, G, N } from "@/site/screen/Dotx.render.tsx";

export interface SekcjaOLOCIProps {
  numer: string;
  tytul: string;
}
export default function SekcjaOLOCI(_paragraf: SekcjaOLOCIProps) {
  const HUE = {
    kolor1: "#181e38"
  } as const;
  return (
    <>
      {sekcja_o_svg2("A:.", "SVG2")}
      <TitleSection prefix="B:." title="LOCI - koncepcja" titleLevel="h2" titleSize="2.125rem" collapsible>
        <Table cols={powtorz(12, "max")} rows={powtorz(14, "auto")} gapX="0.5rem" gapY="0.5rem">
          <Row row={1} headerShow="S" headerLabel="UKŁAD WSPÓŁRZĘDNYCH" headerDisplay="center" />
          <Box start={[1, 2]} end={[6, 2]} headerShow="W" headerLabel="SVG2" headerDisplay={["center", -90]}><P noindent>
            🔹 {tex`\colorbox{${HUE.kolor1}}{Punkt $(0,0)$:}`}{" "} Znajduje się w lewym górnym rogu obszaru rysowania.<br />
            🔹 {tex`\colorbox{${HUE.kolor1}}{Oś $X$:}`}{" "} Pozioma – wartości rosną od lewej do prawej.<br />
            🔹 {tex`\colorbox{${HUE.kolor1}}{Oś $Y$:}`}{" "} Pionowa – wartości rosną od góry do dołu.<br />
            🔹 <strong>Atrybut</strong> {tec("xml")`viewBox="min-x min-y width height"`}: Definiuje wewnętrzny układ współrzędnych i skalowanie grafiki względem rozmiaru elementu {tec`<svg>`}.<br />
            🔹 <strong>Transformacje</strong> ({tec`transform`}): Pozwalają przesuwać ({tec`translate`}), skalować ({tec`scale`}), obracać ({tec`rotate`}) lub pochylać ({tec`skew`}) lokalny układ współrzędnych wybranych elementów.<br />
            🔹 W SVG kąty mierzy się w stopniach ({tec`deg`}), gdzie {tex`\colorbox{${HUE.kolor1}}{$0^{\circ }$}`} wskazuje w prawo (dodatnia oś  {tex`\colorbox{${HUE.kolor1}}{$X$}`}), a dodatnie wartości rosną zgodnie z ruchem wskazówek zegara.
          </P></Box>
          <Box start={[7, 2]} end={[12, 2]} headerShow="W" headerLabel="LOCI" headerDisplay={["center", -90]}><P noindent>
  🔹 {tex`\colorbox{${HUE.kolor1}}{Punkt $(0,0)$:}`}{" "} Punkt utwierdzenia (root) – środek rysunku; od niego wywodzą się wszystkie inne układy.<br />
  🔹 {tex`\colorbox{${HUE.kolor1}}{Oś $X$:}`}{" "} Pozioma – wartości rosną od lewej do prawej.<br />
  🔹 {tex`\colorbox{${HUE.kolor1}}{Oś $Y$:}`}{" "} Pionowa – wartości rosną od dołu do góry.<br />
  🔹 <strong>Dwa opisy naraz</strong>: każdy układ jest jednocześnie kartezjański {tex`(x, y)`} i biegunowy {tex`(r, t)`}.<br />
  🔹 <strong>Kąty</strong>: {tex`\colorbox{${HUE.kolor1}}{$0^{\circ}$}`} wskazuje w prawo (dodatnia oś {tex`\colorbox{${HUE.kolor1}}{$X$}`}); dodatnie rosną przeciwnie do ruchu wskazówek zegara, ujemne zgodnie z nim; kąty są normalizowane: {tex`-90^{\circ} \equiv 270^{\circ}`}.<br />
  🔹 <strong>Zapis kąta</strong>: {tec`deg`}, {tec`rad`}, {tec`turn`}, {tex`\tfrac{n}{d}\pi`}, {tex`\tfrac{n}{d}\cdot 360`}, {tex`\tfrac{n}{d}\cdot 2520`} – 2520 jest podzielne przez 1…10 (48 dzielników, 360 ma 24).<br />
  🔹 <strong>Róża wiatrów</strong>: 24 kierunki co {tex`\tfrac{\pi}{12}`}, nazwane dwuliterowo – {tec`EE`} = 0, {tec`NN`} = {tex`\tfrac{\pi}{2}`}, {tec`WW`} = {tex`\pi`}, {tec`SS`} = {tex`\tfrac{3\pi}{2}`}.
</P></Box>
<Row row={3} headerShow="W" headerLabel="DATUM" headerDisplay={["center", -90]}><P noindent>
  Elementy pomocnicze, nierysowane; każdy ma klucz i może być podany względem układu globalnego lub dowolnego lokalnego.<br />
  🔹 <strong>0D – punkt bazowy</strong> (Datum Point): kotwica, środek obrotu, punkt przyciągania, punkt kontrolny krzywej (np. Béziera).<br />
  🔹 <strong>1D – oś bazowa</strong> (Datum Axis): punkt początkowy + kierunek (wektor lub kąt {tex`t`}); nieskończona, ale zachowuje zwrot – w przeciwieństwie do {tec`<line>`}, który ma początek, koniec i obrys.<br />
  🔹 <strong>2D – lokalny układ odniesienia</strong> (Datum CSYS): punkt zakotwiczenia + dwie osie; może być zagnieżdżony w innym lokalnym.<br />
  🔹 <strong>Do rozważenia</strong>: układ krzywoliniowy (położenie jako długość łuku wzdłuż krzywej – tekst na ścieżce, punkt na elipsie) oraz arkusz/obszar (prostokąt widoku z orientacją góra/dół/lewo/prawo).
</P></Row>
         
        </Table>
      </TitleSection>
    </>
  );
}

function sekcja_o_svg2(titleprefix: string, title: string) {
  return (
    <TitleSection prefix={titleprefix} title={title} titleLevel="h2" titleSize="2.125rem" collapsible collapsed>
      <Table cols={powtorz(3, "auto")} rows={powtorz(14, "auto")} gapX="0.5rem" gapY="1.5rem">
        <Row row={1}>Według specyfikacji SVG 2 (W3C) - składa się z 63 elementów rozumianych jako tagi.</Row>
        <Box start={[1, 2]}>
          <strong>Grupa</strong>
        </Box>{" "}
        <Box start={[2, 2]}>
          <strong>Elementy</strong>
        </Box>{" "}
        <Box start={[3, 2]}>
          <strong>Do czego</strong>
        </Box>
        <Box start={[1, 3]}>
          <strong>Kształty</strong> (geometria)
        </Box>
        <Box start={[2, 3]}>{tec`rect`}, {tec`circle`}, {tec`ellipse`}, {tec`line`}, {tec`polyline`}, {tec`polygon`}, {tec`path`}</Box>
        <Box start={[3, 3]}>figury; {tec`path`} umie narysować każdą z pozostałych</Box>
        <Box start={[1, 4]}>
          <strong>Tekst</strong>
        </Box>
        <Box start={[2, 4]}>{tec`text`}, {tec`tspan`}, {tec`textPath`}</Box>
        <Box start={[3, 4]}>napisy, fragmenty z innym stylem, tekst po krzywej</Box>
        <Box start={[1, 5]}>
          <strong>Grafika osadzona</strong>
        </Box>
        <Box start={[2, 5]}>{tec`image`}, {tec`foreignObject`}, {tec`use`}</Box>
        <Box start={[3, 5]}>obraz rastrowy, HTML w SVG, ponowne użycie elementu</Box>
        <Box start={[1, 6]}>
          <strong>Struktura / kontenery</strong>
        </Box>
        <Box start={[2, 6]}>{tec`svg`}, {tec`g`}, {tec`a`}, {tec`switch`}</Box>
        <Box start={[3, 6]}>grupowanie, zagnieżdżanie, link, wybór wariantu</Box>
        <Box start={[1, 7]}>
          <strong>Definicje</strong> (nierysowane same z siebie, działają przez odwołanie {tec`id`})
        </Box>
        <Box start={[2, 7]}>{tec`defs`}, {tec`symbol`}, {tec`clipPath`}, {tec`mask`}, {tec`marker`}, {tec`pattern`}</Box>
        <Box start={[3, 7]}>szablony, przycinanie, maski, groty linii, wzory</Box>
        <Box start={[1, 8]}>
          <strong>Farby</strong> (paint servers)
        </Box>
        <Box start={[2, 8]}>{tec`linearGradient`}, {tec`radialGradient`}, {tec`pattern`}, {tec`stop`}</Box>
        <Box start={[3, 8]}>gradienty i wzory jako {tec`fill`} lub {tec`stroke`}</Box>
        <Box start={[1, 9]}>
          <strong>Filtry</strong>
        </Box>
        <Box start={[2, 9]}>{tec`filter`} oraz 25 prymitywów {tec`fe*`} (lista niżej)</Box>
        <Box start={[3, 9]}>rozmycie, cień, oświetlenie, mieszanie</Box>
        <Row row={10}>
          <strong>Prymitywy filtrów:</strong>
          <ul>
            <li>
              <strong>źródła i łączenie:</strong> {tec`feImage`}, {tec`feFlood`}, {tec`feTurbulence`}, {tec`feTile`}, {tec`feMerge`} z {tec`feMergeNode`}, {tec`feBlend`},{" "}
              {tec`feComposite`};
            </li>
            <li>
              <strong>kolor:</strong> {tec`feColorMatrix`}, {tec`feComponentTransfer`} z {tec`feFuncR`}, {tec`feFuncG`}, {tec`feFuncB`}, {tec`feFuncA`};
            </li>
            <li>
              <strong>kształt:</strong> {tec`feGaussianBlur`}, {tec`feOffset`}, {tec`feDropShadow`}, {tec`feMorphology`}, {tec`feConvolveMatrix`}, {tec`feDisplacementMap`};
            </li>
            <li>
              <strong>oświetlenie:</strong> {tec`feDiffuseLighting`}, {tec`feSpecularLighting`} ze źródłami {tec`feDistantLight`}, {tec`fePointLight`}, {tec`feSpotLight`}.
            </li>
          </ul>
        </Row>
        <Box start={[1, 11]}>
          <strong>Animacja</strong> (SMIL)
        </Box>
        <Box start={[2, 11]}>{tec`animate`}, {tec`animateMotion`}, {tec`animateTransform`}, {tec`set`}, {tec`mpath`}, {tec`discard`}</Box>
        <Box start={[3, 11]}>animacja deklaratywna, bez JS</Box>
        <Box start={[1, 12]}>
          <strong>Opisowe</strong>
        </Box>
        <Box start={[2, 12]}>{tec`title`}, {tec`desc`}, {tec`metadata`}</Box>
        <Box start={[3, 12]}>dostępność, podpowiedzi, metadane</Box>
        <Box start={[1, 13]}>
          <strong>Pozostałe</strong>
        </Box>
        <Box start={[2, 13]}>{tec`style`}, {tec`script`}, {tec`view`}</Box>
        <Box start={[3, 13]}>CSS, JS, nazwane widoki</Box>
        <Row row={14}>
          <strong>Usunięte z SVG 1.1:</strong> fonty SVG ({tec`font`}, {tec`glyph`}, {tec`missing-glyph`}, {tec`hkern`}, {tec`vkern`}, {tec`font-face`} z pochodnymi),{" "}
          {tec`altGlyph`} z pochodnymi, {tec`tref`}, {tec`cursor`}, {tec`color-profile`}, {tec`animateColor`}. Projekty SVG 2 miały też {tec`mesh`} i{" "}
          {tec`hatch`}, ale w finalnej specyfikacji ich nie ma.
        </Row>
      </Table>
    </TitleSection>
  );
}
