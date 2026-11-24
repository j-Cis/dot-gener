// @project-metadata
// Path: web/404.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * Strona 404 generowana automatycznie: adres, którego nie ma, i mapa wszystkich stron
 * (drzewo plików index.tsx z site/pages — ta sama lista, z której main.tsx buduje router).
 */

export interface Error404PageNotFoundProps {
  /** adres, którego szukano */
  adres: string;
  /** adresy wszystkich stron, np. ["/", "/dokumentacja", "/o-dokumentacji"] */
  strony: readonly string[];
}

export function Error404PageNotFound({ adres, strony }: Error404PageNotFoundProps) {
  const istnieje = new Set(strony);
  return (
    <main class="page strona-404">
      <h1>404 — nie ma takiej strony</h1>
      <p>
        Pod adresem <code>{adres}</code> nic nie ma. Dostępne strony:
      </p>
      <ul class="mapa-stron">
        <li>
          <Adres adres="/" istnieje={istnieje} />
          <Galaz prefiks="" strony={strony.filter((s) => s !== "/")} istnieje={istnieje} />
        </li>
      </ul>
    </main>
  );
}

/** Podstrony pod `prefiks` (np. "/a" → "/a/b", "/a/c/d"), pogrupowane po kolejnym członie adresu. */
function Galaz({ prefiks, strony, istnieje }: { prefiks: string; strony: readonly string[]; istnieje: ReadonlySet<string> }) {
  const nazwy = [...new Set(strony.map((s) => s.slice(prefiks.length + 1).split("/", 1)[0] ?? ""))];
  if (nazwy.length === 0) return null;
  return (
    <ul>
      {nazwy.map((nazwa) => {
        const adres = `${prefiks}/${nazwa}`;
        return (
          <li>
            <Adres adres={adres} istnieje={istnieje} />
            <Galaz prefiks={adres} strony={strony.filter((s) => s.startsWith(`${adres}/`))} istnieje={istnieje} />
          </li>
        );
      })}
    </ul>
  );
}

/** Link do strony i jej plik; folder bez index.tsx (tylko pośredni człon adresu) — sam tekst. */
function Adres({ adres, istnieje }: { adres: string; istnieje: ReadonlySet<string> }) {
  const plik = `site/pages${adres === "/" ? "" : adres}/index.tsx`;
  return istnieje.has(adres)
    ? (
      <>
        <a href={encodeURI(adres)}>{adres}</a> <span class="mapa-stron-plik">{plik}</span>
      </>
    )
    : <span class="mapa-stron-folder">{adres}</span>;
}
