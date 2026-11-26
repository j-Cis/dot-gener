// @project-metadata
// Path: web/style.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

/**
 * CSS strony złożony z plików-rodzeństwa, w warstwach kaskady (od najsłabszej):
 *
 *   shell   web/page-shell.css                      — baza każdej strony
 *   widget  X.widget(s).css  w site/widget/**        — komponenty, których strona używa
 *           X.island(s).css  w site/client/**          (ich .tsx jest w grafie importów
 *           X.render(s).css  w site/screen/**           jej index.tsx); plik-rodzeństwo .tsx
 *   layout  X.section(s).css w site/layout/**        — sekcje, których strona używa (jak wyżej)
 *   route   site/routes/…/index.css                  — tylko ta jedna strona
 *   (bez warstwy) site/static/styles.css            — zawsze wygrywa: ręczne poprawki użytkownika
 *
 * Warstwa późniejsza wygrywa z wcześniejszą niezależnie od siły selektorów, więc styl strony
 * zawsze nadpisze styl sekcji, sekcja — komponentu, a komponent — bazę.
 */

const ROOT = new URL("../", import.meta.url);
/** [warstwa, folder, rodzaj pliku]: X.<rodzaj>(s).tsx w folderze → jego X.<rodzaj>(s).css w warstwie. */
const RODZAJE = [
  ["widget", "site/widget/", "widget"],
  ["widget", "site/client/", "island"],
  ["widget", "site/screen/", "render"],
  ["layout", "site/layout/", "section"],
] as const satisfies readonly (readonly [warstwa: "widget" | "layout", folder: string, rodzaj: string])[];
const FOLDERY = RODZAJE.map(([warstwa, folder, rodzaj]) => [warstwa, new URL(folder, ROOT).href, new RegExp(`\\.${rodzaj}s?\\.tsx$`)] as const);
const SHELL = new URL("page-shell.css", import.meta.url);

/** Importy w TS/TSX (jak IMPORT w transpile.ts): `… from "x"`, `import "x"`, `import("x")`. */
const IMPORT = /\bfrom\s*["']([^"']+)["']|\bimport\s*\(?\s*["']([^"']+)["']/g;

/**
 * Zawartość <style> dla strony, której moduł to `wejscie` (index.tsx strony albo np. web/404.tsx).
 * `css` strony: plik index.css obok index.tsx (dla 404 — brak).
 */
export async function cssStrony(wejscie: URL, cssTrasy?: URL): Promise<string> {
  const moduly = [...(await graf(wejscie))].toSorted();
  /** CSS-rodzeństwo modułów strony, które należą do warstwy `w`. */
  const rodzenstwo = (w: "widget" | "layout") =>
    Promise.all(
      moduly
        .filter((url) => FOLDERY.some(([warstwa, folder, plik]) => warstwa === w && url.startsWith(folder) && plik.test(url)))
        .map((url) => czytaj(new URL(url.replace(/\.tsx$/, ".css")))),
    );
  const czesci = [
    "@layer shell, widget, layout, route;",
    warstwa("shell", [await czytaj(SHELL)]),
    warstwa("widget", await rodzenstwo("widget")),
    warstwa("layout", await rodzenstwo("layout")),
    warstwa("route", [cssTrasy ? await czytaj(cssTrasy) : null]),
  ];
  return czesci.filter((c) => c !== "").join("\n");
}

/** Pliki CSS komponentów bez rodzeństwa *.tsx — ostrzeżenie przy starcie serwera. */
export async function osieroconeCss(): Promise<string[]> {
  return (await Promise.all(RODZAJE.map(([, folder, rodzaj]) => osieroconeW(new URL(folder, ROOT), new RegExp(`\\.${rodzaj}s?\\.css$`))))).flat();
}

async function osieroconeW(katalog: URL, css: RegExp): Promise<string[]> {
  const wynik: string[] = [];
  if (!(await Deno.stat(katalog).catch(() => null))?.isDirectory) return wynik; // folderu może nie być
  for await (const wpis of Deno.readDir(katalog)) {
    const url = new URL(wpis.isDirectory ? `${encodeURIComponent(wpis.name)}/` : encodeURIComponent(wpis.name), katalog);
    if (wpis.isDirectory) wynik.push(...await osieroconeW(url, css));
    else if (css.test(wpis.name) && !(await istnieje(new URL(url.href.replace(/\.css$/, ".tsx"))))) {
      wynik.push(decodeURIComponent(url.pathname.slice(ROOT.pathname.length)));
    }
  }
  return wynik;
}

// ——— pomocnicze ———

/** Wszystkie lokalne moduły osiągalne importami z `wejscie` (URL-e file:). */
async function graf(wejscie: URL): Promise<Set<string>> {
  const odwiedzone = new Set<string>();
  const kolejka = [wejscie.href];
  for (let url = kolejka.pop(); url !== undefined; url = kolejka.pop()) {
    if (odwiedzone.has(url)) continue;
    let kod: string;
    try {
      kod = await Deno.readTextFile(new URL(url));
    } catch (blad) {
      if (blad instanceof Deno.errors.NotFound) continue; // import znaleziony wyrażeniem w tekście — pomijamy
      throw blad;
    }
    odwiedzone.add(url);
    for (const m of kod.matchAll(IMPORT)) {
      const dep = lokalny(m[1] ?? m[2] ?? "", url);
      if (dep !== null && !odwiedzone.has(dep)) kolejka.push(dep);
    }
  }
  return odwiedzone;
}

/** URL lokalnego modułu .ts/.tsx albo null (import map, https, jsr, json…). */
function lokalny(spec: string, odKogo: string): string | null {
  const url = spec.startsWith("@/") ? new URL(spec.slice(2), ROOT) : spec.startsWith("./") || spec.startsWith("../") ? new URL(spec, odKogo) : null;
  return url !== null && /\.tsx?$/.test(url.pathname) ? url.href : null;
}

/** Treść pliku albo null, gdy go nie ma (CSS jest opcjonalny). */
async function czytaj(url: URL): Promise<string | null> {
  try {
    return await Deno.readTextFile(url);
  } catch (blad) {
    if (blad instanceof Deno.errors.NotFound) return null;
    throw blad;
  }
}

async function istnieje(url: URL): Promise<boolean> {
  return (await czytaj(url)) !== null;
}

/** @layer nazwa { … } z niepustych części; "" gdy nic nie ma. */
function warstwa(nazwa: string, czesci: readonly (string | null)[]): string {
  const tresc = czesci.filter((c): c is string => c !== null && c.trim() !== "").join("\n");
  return tresc === "" ? "" : `@layer ${nazwa} {\n${tresc}\n}`;
}
