// @project-metadata
// Path: site/scripts/registries/for-island-svg.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

export type SvgAdjuster = (svg: SVGSVGElement) => void;

/**
 * Dopasowania SVG uruchamiane w przeglądarce przez ViewAsSvg,
 * wybierane przez props: <ViewAsSvg registryKey="nazwa">.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z ViewAsSvg.
 */
export const DOPASOWANIA = {
  "schemat-sosa": dopasujSchemat,
} satisfies Record<string, SvgAdjuster>;

export type SvgRegistryKey = keyof typeof DOPASOWANIA;
/**
 * Dopasowania SVG uruchamiane w przeglądarce przez ViewAsSvg, wybierane przez
 * samą grafikę: <svg data-dopasuj="nazwa">. Grafika bez tego atrybutu
 * nie potrzebuje żadnego JS poza ViewAsSvg.
 *
 * Wszystko, co tu jest, trafia do przeglądarki razem z ViewAsSvg.
 */
// export const DOPASOWANIA: Record<string, (svg: SVGSVGElement) => void> = {
//   "schemat-sosa": dopasujSchemat,
// };

/**
 * Obwódki liczb i tła indeksów w schemacie drzewa SOSA (svg.drzewo),
 * dopasowane do faktycznych cyfr. Położenie cyfr zależy od czcionki
 * systemowej, więc współrzędnych nie da się wpisać na stałe: liczy je
 * przeglądarka, po załadowaniu czcionek.
 *
 * Oczekiwana struktura (jak w features/sosa/DrzewoSosa.widget.tsx):
 *   g.drzewo-node > circle                 kółka, w kolejności numerów
 *   g.drzewo-num-bin | g.drzewo-num-dec
 *     > g > rect                           tła indeksów
 *     > g.obwodka > rect                   obwódki liczb
 *     > text( cyfry, tspan(indeks) )       liczby
 *
 * Można wywołać ponownie: pozycje startowe tekstów są w data-x0 / data-y0.
 */

/** [x, y, szer., wys.] */
type Prostokat = [x: number, y: number, szer: number, wys: number];
type Ramka = { x0: number; y0: number; x1: number; y1: number };
type Wybor = { dx0: number; dx1: number; dy: number; z: number };

const P = 1; // padding: cyfry → obwódka
const W = 1; // grubość kropek obwódki (jak stroke-width w CSS)
const ODSTEP = 1; // obwódka → tło indeksu
const SUB_PX = 1, SUB_PY = 0.5; // margines tła wokół indeksu
const KROK = 0.25; // krok szukania przesunięć

const zakres = (od: number, doo: number) =>
  Array.from(
    { length: Math.round((doo - od) / KROK) + 1 },
    (_, k) => od + k * KROK,
  );
const PION = zakres(-8, 8);
const POZIOM = zakres(-3, 3).sort((p, q) => Math.abs(p) - Math.abs(q));

export function dopasujSchemat(svg: SVGSVGElement): void {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return;

  const indeks = (t: SVGTextElement): SVGTSpanElement => {
    const s = t.querySelector<SVGTSpanElement>("tspan");
    if (!s) throw new Error("dopasujSchemat: <text> bez <tspan>");
    return s;
  };

  // obrys samych cyfr (bez indeksu): poziomo i pionowo wg kształtu znaków
  const cyfry = (t: SVGTextElement) => {
    const tekst = t.firstChild?.textContent ?? "";
    const st = getComputedStyle(t);
    ctx.font = `${st.fontWeight} ${st.fontSize} ${st.fontFamily}`;
    const m = ctx.measureText(tekst);
    const p = t.getStartPositionOfChar(0);
    const koniec = t.getExtentOfChar(tekst.length - 1);
    return {
      l: p.x - m.actualBoundingBoxLeft,
      r: p.x + m.actualBoundingBoxRight,
      t: p.y - m.actualBoundingBoxAscent,
      b: p.y + m.actualBoundingBoxDescent,
      koniec: koniec.x + koniec.width,
    };
  };

  // obwódka i tło indeksu jednej liczby
  const uklad = (t: SVGTextElement): { obw: Prostokat; tlo: Prostokat } => {
    const c = cyfry(t), s = indeks(t).getBBox();
    return {
      obw: [
        c.l - P - W / 2,
        c.t - P - W / 2,
        c.r - c.l + 2 * P + W,
        c.b - c.t + 2 * P + W,
      ],
      tlo: [
        s.x - SUB_PX,
        s.y - SUB_PY,
        s.width + 2 * SUB_PX,
        s.height + 2 * SUB_PY,
      ],
    };
  };

  // ramki liczby: obwódka (+ połowa grubości kropek) i tło indeksu
  const ramki = (t: SVGTextElement): [Ramka, Ramka] => {
    const { obw: [ox, oy, ow, oh], tlo: [tx, ty, tw, th] } = uklad(t);
    return [
      {
        x0: ox - W / 2,
        y0: oy - W / 2,
        x1: ox + ow + W / 2,
        y1: oy + oh + W / 2,
      },
      { x0: tx, y0: ty, x1: tx + tw, y1: ty + th },
    ];
  };

  // zewnętrzne granice obu ramek razem
  const granice = (t: SVGTextElement): Ramka => {
    const [a, b] = ramki(t);
    return {
      x0: Math.min(a.x0, b.x0),
      x1: Math.max(a.x1, b.x1),
      y0: Math.min(a.y0, b.y0),
      y1: Math.max(a.y1, b.y1),
    };
  };

  const przesun = (t: SVGTextElement, dx: number, dy: number) => {
    t.setAttribute("x", String(Number(t.getAttribute("x")) + dx));
    t.setAttribute("y", String(Number(t.getAttribute("y")) + dy));
  };

  const ustaw = (rect: Element | undefined, [x, y, w, h]: Prostokat) => {
    if (!rect) return;
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(w));
    rect.setAttribute("height", String(h));
  };

  const grupy = [
    ...svg.querySelectorAll<SVGGElement>("g.drzewo-num-bin, g.drzewo-num-dec"),
  ];
  const kola = [
    ...svg.querySelectorAll<SVGCircleElement>("g.drzewo-node circle"),
  ];

  // 0. pozycje startowe (żeby ponowne wywołanie nie sumowało przesunięć)
  for (const g of grupy) {
    for (const t of g.querySelectorAll<SVGTextElement>("text")) {
      t.dataset.x0 ??= t.getAttribute("x") ?? "0";
      t.dataset.y0 ??= t.getAttribute("y") ?? "0";
      t.setAttribute("x", t.dataset.x0);
      t.setAttribute("y", t.dataset.y0);
    }
  }

  // 1. indeks za obwódką: odsunięcie od końca cyfr
  for (const g of grupy) {
    for (const t of g.querySelectorAll<SVGTextElement>("text")) {
      const s = indeks(t);
      s.setAttribute("dx", "0");
      const c = cyfry(t);
      s.setAttribute(
        "dx",
        String(Math.max(0, c.r + P + W + ODSTEP + SUB_PX - c.koniec)),
      );
    }
  }

  // 2. położenie pary w kółku: każdy rząd wyśrodkowany poziomo, para
  //    wyśrodkowana pionowo; gdy narożnik i tak wychodzi poza wnętrze kółka,
  //    rzędy przesuwają się poziomo (każdy osobno, jak najmniej, bez
  //    nachodzenia na siebie)
  kola.forEach((kolo, i) => {
    const cx = Number(kolo.getAttribute("cx"));
    const cy = Number(kolo.getAttribute("cy"));
    const wnetrze = Number(kolo.getAttribute("r")) -
      parseFloat(getComputedStyle(kolo).strokeWidth) / 2;
    const teksty = grupy
      .map((g) => g.querySelectorAll<SVGTextElement>("text")[i])
      .filter((t): t is SVGTextElement => t !== undefined);

    for (const t of teksty) {
      const g = granice(t);
      przesun(t, cx - (g.x0 + g.x1) / 2, 0);
    }
    const rz = teksty.map(ramki);

    // najdalszy narożnik ramek rzędu od środka kółka
    const dal = (r: Ramka[], dx: number, dy: number) =>
      Math.max(
        ...r.flatMap((b) => [b.x0 + dx, b.x1 + dx].flatMap((x) => [b.y0 + dy, b.y1 + dy].map((y) => Math.hypot(x - cx, y - cy)))),
      );
    const nachodza = (dx0: number, dx1: number) => {
      const [r0, r1] = rz;
      if (!r0 || !r1) return false;
      return r0.some((a) =>
        r1.some((b) =>
          Math.min(a.x1 + dx0, b.x1 + dx1) - Math.max(a.x0 + dx0, b.x0 + dx1) >
            0 &&
          Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > 0
        )
      );
    };
    const zasieg = (dxy: number[], dy: number) => Math.max(...rz.map((r, k) => dal(r, dxy[k] ?? 0, dy)));

    // a) tylko pionowo, rzędy wyśrodkowane
    let naj: Wybor | null = null;
    for (const dy of PION) {
      const z = zasieg([0, 0], dy);
      if (!naj || z < naj.z) naj = { dx0: 0, dx1: 0, dy, z };
    }
    // b) gdy nie mieści się: każdy rząd osobno najmniejszym przesunięciem
    if (naj && naj.z > wnetrze) {
      let lep: (Wybor & { ruch: number }) | null = null;
      for (const dy of PION) {
        const dx = rz.map((r) => POZIOM.find((d) => dal(r, d, dy) <= wnetrze));
        if (dx.some((d) => d === undefined)) continue;
        const [dx0 = 0, dx1 = 0] = dx;
        if (nachodza(dx0, dx1)) continue;
        const ruch = Math.abs(dx0) + Math.abs(dx1);
        const z = zasieg([dx0, dx1], dy);
        if (!lep || ruch < lep.ruch || (ruch === lep.ruch && z < lep.z)) {
          lep = { dx0, dx1, dy, z, ruch };
        }
      }
      if (lep) naj = lep;
    }
    if (naj) {
      const { dx0, dx1, dy } = naj;
      teksty.forEach((t, k) => przesun(t, k === 0 ? dx0 : dx1, dy));
    }
  });

  // 3. obwódki i tła indeksów na ostatecznych pozycjach
  for (const g of grupy) {
    const obwodki = g.querySelectorAll("g.obwodka rect");
    const tla = g.querySelectorAll(":scope > g:not(.obwodka) rect");
    g.querySelectorAll<SVGTextElement>("text").forEach((t, i) => {
      const { obw, tlo } = uklad(t);
      ustaw(obwodki[i], obw);
      ustaw(tla[i], tlo);
    });
  }
}
