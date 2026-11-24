/**
 * Kod przeglądarki dla Ende — odpowiednik web/transpile.ts bez @deno/loader.
 *
 * Przełącznik: main.tsx importuje "@transpilacja";
 *   deno.json → "./web/transpile.ts"       (Deno: @deno/loader, jak dotąd)
 *   ende.json → "./web/transpile-ende.ts"  (Ende: ten plik)
 * Powód: @deno/loader (sys_traits, funkcja "wasm") czyta pliki przez node:fs, node:process,
 * node:os i node:tty, których Ende nie ma.
 *
 * TS/TSX → JS robi natywny TypeScript (tsgo) jako osobny proces: tylko usuwa typy i JSX
 * (--noCheck --noResolve), importy zostawia bez zmian, a mapę źródeł z treścią oryginału
 * wkleja do pliku (sourceRoot "/" → przeglądarka widzi /site/…, /web/…).
 * Program: zmienna środowiskowa TSGO (pełna ścieżka do tsgo / tsgo.exe) albo "tsgo" z PATH.
 *
 * Graf (wejścia, wyspy, lokalne importy) liczony jak w web/transpile.ts — zmiany tam
 * przenoś też tutaj.
 * DO ROZWAŻENIA W PRZYSZŁOŚCI: jeden transpilator dla obu środowisk (np. deno_ast z Rust → wasm),
 * wtedy przełącznik i ten plik będą zbędne.
 */

const ROOT = new URL("../", import.meta.url);
const FEATURES = new URL("site/features/", ROOT);
const ISLAND_FILE = /\.island\.tsx?$/;
const CLIENT_ENTRY = new URL("web/client.ts", ROOT).href;
const TSGO = Deno.env.get("TSGO") ?? "tsgo";

// Jak w web/transpile.ts: statyczne importy/re-eksporty, `import "x"` i `import("x")` z dosłowną ścieżką.
const IMPORT = /\bfrom\s*["']([^"']+)["']|\bimport\s*\(?\s*["']([^"']+)["']/g;

const entries = [CLIENT_ENTRY, ...await findIslands(FEATURES)];
const served = await buildClientGraph(entries);
console.log(`client modules: ${served.size} (tsgo)`);

/** Transpiled JS for a request path, or null if it is not client code. */
export function transpileForBrowser(path: string): string | null {
  return served.get(new URL("." + path, ROOT).href) ?? null;
}

async function findIslands(dir: URL): Promise<string[]> {
  const out: string[] = [];
  try {
    for await (const e of Deno.readDir(dir)) {
      if (e.isDirectory) out.push(...await findIslands(new URL(e.name + "/", dir)));
      else if (ISLAND_FILE.test(e.name)) out.push(new URL(e.name, dir).href);
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err;
  }
  return out;
}

/** Mirrors the browser: relative, "/…" and "@/…" are local; bare → import map. */
function resolveLocal(spec: string, referrer: string): string | null {
  let url: URL;
  if (spec.startsWith("@/")) url = new URL(spec.slice(2), ROOT);
  else if (spec.startsWith("/")) url = new URL("." + spec, ROOT);
  else if (spec.startsWith("./") || spec.startsWith("../")) url = new URL(spec, referrer);
  else return null;
  return url.href.startsWith(ROOT.href) ? url.href : null;
}

/** Fale: transpiluj nowe pliki jednym wywołaniem tsgo, znajdź ich lokalne importy, powtórz. */
async function buildClientGraph(entries: string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  let fala = [...new Set(entries)];
  while (fala.length > 0) {
    const istniejace = await istnieja(fala);
    const kod = istniejace.length > 0 ? await tsgo(istniejace) : new Map<string, string>();
    const nastepna = new Set<string>();
    for (const [url, js] of kod) {
      out.set(url, js);
      for (const m of js.matchAll(IMPORT)) {
        const spec = m[1] ?? m[2];
        if (spec === undefined) continue;
        const dep = resolveLocal(spec, url);
        if (dep !== null && !out.has(dep) && !kod.has(dep)) nastepna.add(dep);
      }
    }
    for (const url of fala) if (!kod.has(url)) console.error(`[client] ${url}: brak pliku albo nie został przetranspilowany`);
    fala = [...nastepna].filter((url) => !out.has(url));
  }
  return out;
}

async function istnieja(urls: string[]): Promise<string[]> {
  const wynik: string[] = [];
  for (const url of urls) {
    try {
      if ((await Deno.stat(new URL(url))).isFile) wynik.push(url);
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) throw err;
    }
  }
  return wynik;
}

/** Jedno wywołanie tsgo dla listy plików (URL) → mapa URL → JS z wklejoną mapą źródeł. */
async function tsgo(urls: string[]): Promise<Map<string, string>> {
  // ścieżki względem katalogu projektu („web/client.ts”), więc bez zamiany URL ↔ ścieżka systemu
  const wzgledne = urls.map((url) => decodeURIComponent(url.slice(ROOT.href.length)));
  const wyjscie = await Deno.makeTempDir({ prefix: "lektura-tsgo-" });
  try {
    const args = [
      ...["--noCheck", "--noResolve", "--skipLibCheck"],
      ...["--jsx", "react-jsx", "--jsxImportSource", "preact"],
      ...["--target", "es2022", "--module", "esnext", "--moduleResolution", "bundler"],
      ...["--inlineSourceMap", "--inlineSources", "--sourceRoot", "/"],
      ...["--rootDir", ".", "--outDir", wyjscie],
      ...wzgledne,
    ];
    let wynik: Deno.CommandOutput;
    try {
      wynik = await new Deno.Command(TSGO, { args, cwd: ROOT, stdout: "piped", stderr: "piped" }).output();
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        throw new Error(`nie znaleziono „${TSGO}” — ustaw zmienną TSGO na pełną ścieżkę do tsgo (np. …\\tsgo.exe)`);
      }
      throw err;
    }
    const komunikaty = new TextDecoder().decode(wynik.stdout) + new TextDecoder().decode(wynik.stderr);
    if (komunikaty.trim() !== "") console.warn(`[tsgo]\n${komunikaty.trim()}`);
    // 0 = bez uwag, 2 = uwagi (np. błąd składni), ale pliki wyemitowane; inne = porażka
    if (wynik.code !== 0 && wynik.code !== 2) throw new Error(`tsgo zakończył się kodem ${wynik.code}`);

    const kod = new Map<string, string>();
    for (const [i, url] of urls.entries()) {
      const plik = `${wyjscie}/${wzgledne[i]?.replace(/\.tsx?$/, ".js")}`;
      try {
        kod.set(url, await Deno.readTextFile(plik));
      } catch (err) {
        if (!(err instanceof Deno.errors.NotFound)) throw err;
      }
    }
    return kod;
  } finally {
    await Deno.remove(wyjscie, { recursive: true });
  }
}
