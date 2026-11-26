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

/**
 * Beczka: plik `_ANY.ts` z samymi reeksportami (`export * from "./X.widget.tsx";`). Import z beczki
 * dołącza do grafu tylko pliki, które eksportują zaimportowane nazwy — CSS pozostałych nie trafia na stronę.
 */
export const BECZKA = "_ANY.ts";
const jestBeczka = (url: string) => url.endsWith(`/${BECZKA}`);

/** Statyczny import lub reeksport: [import|export, "type " (same typy), klauzula, specyfikator]. */
const IMPORT_Z = /\b(import|export)\s+(type\s+)?([^;'"()=]*?)\s*from\s*["']([^"']+)["']/g;
/** Import bez nazw: `import "x"` i `import("x")`. */
const IMPORT_GOLY = /\bimport\s*(?:\(\s*)?["']([^"']+)["']/g;
/** Nazwy eksportowane przez moduł: deklaracje i `export { a, b as c }` (bez `from`). */
const EKSPORT_DEKLARACJA = /\bexport\s+(?:declare\s+)?(?:async\s+)?(?:function\*?|class|const|let|var|enum|interface|type)\s+([A-Za-z_$][\w$]*)/g;
const EKSPORT_LISTA = /\bexport\s*\{([^}]*)\}\s*(?!\s*from)/g;

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

/** Wszystkie lokalne moduły osiągalne importami z `wejscie` (URL-e file:); beczki rozwiązane po nazwach. */
async function graf(wejscie: URL): Promise<Set<string>> {
  const odwiedzone = new Set<string>();
  const kolejka = [wejscie.href];
  for (let url = kolejka.pop(); url !== undefined; url = kolejka.pop()) {
    if (odwiedzone.has(url)) continue;
    const kod = await czytaj(new URL(url));
    if (kod === null) continue; // import znaleziony wyrażeniem w tekście — pomijamy
    odwiedzone.add(url);
    for (const dep of await zaleznosci(kod, url)) if (!odwiedzone.has(dep)) kolejka.push(dep);
  }
  return odwiedzone;
}

/** Lokalne moduły, których kod `kod` (z pliku `url`) faktycznie używa; import przez beczkę → pliki z tymi nazwami. */
async function zaleznosci(kod: string, url: string): Promise<string[]> {
  const wynik: string[] = [];
  for (const [, , tylkoTypy, klauzula = "", spec = ""] of kod.matchAll(IMPORT_Z)) {
    if (tylkoTypy) continue; // `import type` / `export type … from` nie wpływa na wygląd
    const dep = lokalny(spec, url);
    if (dep === null) continue;
    if (!jestBeczka(dep)) wynik.push(dep);
    else wynik.push(...await zBeczki(dep, nazwyKlauzuli(klauzula)));
  }
  for (const [, spec = ""] of kod.matchAll(IMPORT_GOLY)) {
    const dep = lokalny(spec, url);
    if (dep !== null) wynik.push(...(jestBeczka(dep) ? await zBeczki(dep, ["*"]) : [dep]));
  }
  return wynik;
}

/** Nazwy z klauzuli importu/reeksportu: `{ a, b as c, type d }` → [a, b]; `* as x`, `*` → ["*"]; `x` → ["default"]. */
function nazwyKlauzuli(klauzula: string): string[] {
  const nazwy: string[] = [];
  const klamra = klauzula.match(/\{([^}]*)\}/);
  if (klamra) {
    for (const czesc of (klamra[1] ?? "").split(",")) {
      const [nazwa = ""] = czesc.trim().split(/\s+as\s+/);
      if (nazwa !== "" && !nazwa.startsWith("type ")) nazwy.push(nazwa);
    }
  }
  const reszta = klauzula.replace(/\{[^}]*\}/, "").replace(/,/g, " ").trim();
  if (reszta.includes("*")) nazwy.push("*");
  else if (reszta !== "") nazwy.push("default");
  return nazwy;
}

/** Pliki z beczki, które eksportują podane nazwy ("*" → wszystkie). */
async function zBeczki(beczka: string, nazwy: readonly string[]): Promise<string[]> {
  const mapa = await mapaBeczki(beczka);
  if (nazwy.includes("*")) return [...new Set(mapa.values())];
  const wynik: string[] = [];
  for (const nazwa of nazwy) {
    const plik = mapa.get(nazwa);
    if (plik !== undefined) wynik.push(plik);
    else console.warn(`${sciezka(beczka)}: żaden plik nie eksportuje „${nazwa}”`);
  }
  return wynik;
}

/** nazwa → plik, który ją eksportuje; z reeksportów beczki (także beczek zagnieżdżonych). */
const mapyBeczek = new Map<string, Promise<Map<string, string>>>();
function mapaBeczki(beczka: string): Promise<Map<string, string>> {
  let mapa = mapyBeczek.get(beczka);
  if (mapa === undefined) mapyBeczek.set(beczka, mapa = zbudujMape(beczka));
  return mapa;
}
async function zbudujMape(beczka: string): Promise<Map<string, string>> {
  const mapa = new Map<string, string>();
  for (const [, ktore, tylkoTypy, klauzula = "", spec = ""] of (await czytaj(new URL(beczka)) ?? "").matchAll(IMPORT_Z)) {
    if (ktore !== "export" || tylkoTypy) continue;
    const plik = lokalny(spec, beczka);
    if (plik === null) continue;
    const nazwy = nazwyKlauzuli(klauzula);
    const eksporty = jestBeczka(plik) ? await mapaBeczki(plik) : new Map((await nazwyEksportu(plik)).map((n) => [n, plik] as const));
    for (const [nazwa, zrodlo] of eksporty) if (nazwy.includes("*") || nazwy.includes(nazwa)) mapa.set(nazwa, zrodlo);
  }
  return mapa;
}

/** Nazwy eksportowane przez zwykły moduł (deklaracje i `export { … }`); `export *` nie przenosi `default`. */
async function nazwyEksportu(plik: string): Promise<string[]> {
  const kod = await czytaj(new URL(plik)) ?? "";
  const nazwy = [...kod.matchAll(EKSPORT_DEKLARACJA)].map(([, n = ""]) => n);
  for (const [, lista = ""] of kod.matchAll(EKSPORT_LISTA)) {
    for (const czesc of lista.split(",")) {
      const [, jako = czesc.trim()] = czesc.trim().split(/\s+as\s+/);
      if (jako !== "" && !jako.startsWith("type ")) nazwy.push(jako.trim());
    }
  }
  return nazwy;
}

/** Ścieżka względem projektu, do komunikatów. */
const sciezka = (url: string) => decodeURIComponent(new URL(url).pathname.slice(ROOT.pathname.length));

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
