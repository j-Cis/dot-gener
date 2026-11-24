import katex from "katex";

/**
 * Wzór KaTeX renderowany na serwerze: do przeglądarki idzie gotowy HTML
 * (+ /katex/katex.min.css z layoutu), bez JS. Tylko po stronie serwera —
 * w wyspie nie zadziała (katex nie jest w import mapie przeglądarki).
 * Błąd składni nie przerywa renderowania: KaTeX pokazuje go na czerwono.
 */
export function Tex(
  { children, display = false }: { children: string; display?: boolean },
) {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
  });
  return display ? <div class="tex tex-blok" dangerouslySetInnerHTML={{ __html: html }} /> : <span class="tex" dangerouslySetInnerHTML={{ __html: html }} />;
}

/**
 * Wzór w linii jako szablon: {tex`\Psi_{10_{sosa}}`}. Treść jest brana
 * dosłownie (String.raw), więc klamry i ukośniki (\frac, \times) nie
 * wymagają ucieczek. Jedyny wyjątek: `${…}` to wstawka JavaScriptu.
 */
export const tex = (s: TemplateStringsArray, ...w: unknown[]) => <Tex>{String.raw(s, ...w)}</Tex>;

/** Wzór blokowy (wyśrodkowany, w osobnej linii): {texBlok`…`}. */
export const texBlok = (s: TemplateStringsArray, ...w: unknown[]) => <Tex display>{String.raw(s, ...w)}</Tex>;
