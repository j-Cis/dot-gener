import { Title } from "@/site/features/ui/Title.widget.tsx";
import { OutTec, tec, tecs } from "@/site/features/pipe/Tec.widget.tsx";
import { Box, powtorz, Row, Table } from "@/site/features/ui/Table.widget.tsx";

export interface SekcjaOLekturzeProps {
  numer: string;
  tytul: string;
}
export default function SekcjaOLekturze(paragraf: SekcjaOLekturzeProps) {
  /** Pliki ./web w kolejności wyświetlania — tylko klucze, które zna `plik`. */
  const PLIKI_WEB = [
    "ts:importmap",
    "ts:staticfiles",
    "ts:island",
    "ts:transpile",
    "ts:transpile-ende",
    "ts:client",
    "tsx:layout",
    "tsx:main",
  ] as const satisfies readonly (keyof Pliki)[];

  /** "ts:importmap" → "./web/importmap.ts" (typ wyniku też jest dokładny) */
  type SciezkaWeb<K extends keyof Pliki> = K extends `${infer Roz}:${infer Nazwa}` ? `./web/${Nazwa}.${Roz}` : never;
  const sciezkaWeb = <K extends keyof Pliki>(klucz: K) => {
    const [roz, nazwa] = klucz.split(":");
    return `./web/${nazwa}.${roz}` as SciezkaWeb<K>;
  };
  return (
    <article class="sekcja-o-lekturze">
      <header>
        <Title prefix={paragraf.numer} level="h1" size="2.125rem">
          {paragraf.tytul}
        </Title>
      </header>
      <Title level="h3" size="1.125rem">
        <strong>WSTĘP</strong>
      </Title>
      <p class="akapit">
        Niestety lekka metoda działania jaką wprowadziło <u>DENO</u>, nibawem może zniknąć gdyż w paźdierniku 2026 zsotało przejęte przez <u>CLOUDFALRE</u>
        i już wiadmo że nie bedzie wersi <u>3.0</u>, a jedynie będa zapownione przez rok łatki - to wielki cios. Deno oferował po wyjęciu z pudełka wsparcie dal <u>TypeSript</u>
        obecna wersja to <u>7.0.2</u> nowość w tej wersji to całościowe przepisanie go na jezyk <u>go</u>. owerował też wparcie dla React i Preact np przy użyciu <u>hono</u>
        bez zbędnego ciągłego przebudowywania wszystkiego na czysty <u>JavaScript</u>. Dodatkowo poprzez <u>jsr</u> oraz <u>esm.sh</u> można było całkowicie pozbyć się syfu{" "}
        <u>NODE</u> i studni bez dna zakrzywiającej czasoprzestrzeń bardziej niż czarna dziura - folderu <u>node_modules</u>. Powstał fork{" "}
        <u>ende</u>, ale zobaczymy co przyniesie. Równocześnie mam też koncepcje własną <u>https://github.com/j-Cis/tsxr</u> mającą na celu zastąpienie <u>deno</u>
      </p>

      <Title level="h3" size="1.5rem">
        <strong>ELEMENTY</strong>
      </Title>

      <Table cols={powtorz(12, "max")} rows={powtorz(3, "auto")} gapX="0.5rem" gapY="0.5rem">
        <Row row={1}>
          Obecnie działa pod <u>DENO</u>, natomiast pod <u>ENDO</u> cały czas coś nie spina, gdzieś na horyzoncie jako koncepcja majaczy <u>TSXR</u>{" "}
          ale narazie nie został napisany. istotą projektu są 3 lementy
        </Row>
        <Box start={[1, 2]} end={[4, 2]} headerShow="N" headerLabel="SYSTEM i KONFIGURACJA" headerDisplay="center">
          {tec`./web/**`}
          <br />
          {tec`./deno.json`}
          <br />
          {tec`./ende.json`}
          <hr />
          <ul>
            <li>importmap.ts</li>
            <li>island.ts</li>
            <li>staticfiles.ts</li>
            <li>transpile.ts</li>
            <li>transpile-ende.ts</li>
            <li>client.ts</li>
            <li>main.tsx</li>
            <li>layout.tsx</li>
          </ul>
        </Box>
        <Box start={[5, 2]} end={[12, 2]} headerShow="N" headerLabel="WSAD" headerDisplay="center">
          {tec`./site/**`}
          <hr />
          <ul>
            <li>
              {tec`./site/features/**`} - mamy tu klocki budulcowe z których najistotniejsze to<ul>
                <li>{tec`*.island.tsx`}</li>
                <li>{tec`*.widget.tsx`}</li>
              </ul>
            </li>
            <li>
              {tec`./site/pages/**`} - mamy tu nasze strony, budowane z treści i klocków:{" "}
              <ul>
                <li>{tec`index.tsx`} - to strona główna</li>
              </ul>
            </li>
            <li>{tec`./site/elements/**`} - mamy tu elementy naszych stron budowane z treści i klocków</li>
            <li>{tec`./site/scripts/**`} - mamy tu rózne rzeczy, logike itp wszystko w czystym TypeScript</li>
            <li>{tec`./site/static/**`} - mamy tu pliki statyczne w tym arkusze stylów css</li>
          </ul>
        </Box>
        <Box start={[1, 3]} end={[6, 3]} headerShow="N" headerLabel="DENO" headerDisplay="center">{plik("json:deno")}</Box>
        <Box start={[7, 3]} end={[12, 3]} headerShow="N" headerLabel="ENDE" headerDisplay="center">{plik("json:ende")}</Box>
      </Table>

      <Title level="h3" size="1.5rem">
        <strong>PLIKI TEGO SYSTEMU</strong>
      </Title>

      <Table cols={["max"]} rows={powtorz(PLIKI_WEB.length, "auto")} gapX="0.5rem" gapY="0.5rem">
        {PLIKI_WEB.map((klucz, i) => (
          <Row row={i + 1} headerShow="W" headerLabel={tec`${sciezkaWeb(klucz)}`} headerDisplay={["start", -90]}>
            {plik(klucz)}
          </Row>
        ))}
      </Table>
    </article>
  );
}

type Pliki = Record<
  "json:deno" | "json:ende" | "ts:importmap" | "ts:staticfiles" | "ts:island" | "ts:transpile" | "ts:transpile-ende" | "ts:client" | "tsx:layout" | "tsx:main",
  OutTec
>;
function plik(klucz: keyof Pliki): OutTec {
  const rekord: Pliki = {
    "json:deno": tecs("json")`
{
  "lock": "deno.lock",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "deno.ns"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "imports": {
    "@/": "./",
    "@std/assert": "jsr:@std/assert@^1",
    "@hono/hono": "jsr:@hono/hono@^4.13.19",
    "@deno/loader": "jsr:@deno/loader@^0.5.0",
    "@std/encoding": "jsr:@std/encoding@^1.0.10",
    "preact": "https://esm.sh/preact@11.2.0",
    "preact/": "https://esm.sh/preact@11.2.0/",
    "preact-render-to-string": "https://esm.sh/preact-render-to-string@6.8.3",
    "preact-render-to-string/": "https://esm.sh/preact-render-to-string@6.8.3/",
    "@preact/signals": "https://esm.sh/@preact/signals@2.11.4",
    "@preact/signals/": "https://esm.sh/@preact/signals@2.11.4/",
    "@preact/signals-core": "https://esm.sh/@preact/signals-core@1.14.5",
    "@preact/signals-core/": "https://esm.sh/@preact/signals-core@1.14.5/",
    "katex": "https://esm.sh/katex@0.19.1",
    "katex/": "https://esm.sh/katex@0.19.1/",
    "highlight.js/": "https://esm.sh/highlight.js@11.12.0/",
    "@transpilacja": "./web/transpile.ts"
  },
  "exclude": [
    "_to_delete/"
  ],
  "tasks": {
    "przyklad-ksiega": "deno run --allow-write=. examples/przyklad-biblioteczka.ts",
    "przyklad-drzewo": "deno run --allow-write=. examples/przyklad-drzewo.ts",
    "test": "deno test --allow-run=dot --allow-read=. --allow-write=. tests/testy.ts",
    "czytaj-pisz": "deno serve -A --watch=web/client.ts,site/,web/ web/main.tsx",
    "czytaj": "deno serve -A web/main.tsx",
    "sprawdz-program": "deno check src/ examples/ tests/",
    "sprawdz-program-tsgo": "deno check --unstable-tsgo src/ examples/ tests/",
    "sprawdz-lekture": "deno check web/ site/",
    "sprawdz-lekture-tsgo": "deno check --unstable-tsgo web/ site/",
    "check": "deno fmt --check && deno lint && deno check"
  },
  "fmt": {
    "lineWidth": 180
  }
}
            `,
    "json:ende": tecs("json")`
{
  "lock": "ende.lock",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "lib": [
      "dom",
      "dom.iterable",
      "dom.asynciterable",
      "ende.ns"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "imports": {
    "@/": "./",
    "@std/assert": "jsr:@std/assert@^1",
    "@hono/hono": "jsr:@hono/hono@^4.13.19",
    "@deno/loader": "jsr:@deno/loader@^0.5.0",
    "@std/encoding": "jsr:@std/encoding@^1.0.10",
    "preact": "https://esm.sh/preact@11.2.0",
    "preact/": "https://esm.sh/preact@11.2.0/",
    "preact-render-to-string": "https://esm.sh/preact-render-to-string@6.8.3",
    "preact-render-to-string/": "https://esm.sh/preact-render-to-string@6.8.3/",
    "@preact/signals": "https://esm.sh/@preact/signals@2.11.4",
    "@preact/signals/": "https://esm.sh/@preact/signals@2.11.4/",
    "@preact/signals-core": "https://esm.sh/@preact/signals-core@1.14.5",
    "@preact/signals-core/": "https://esm.sh/@preact/signals-core@1.14.5/",
    "katex": "https://esm.sh/katex@0.19.1",
    "katex/": "https://esm.sh/katex@0.19.1/",
    "highlight.js/": "https://esm.sh/highlight.js@11.12.0/",
    "@transpilacja": "./web/transpile-ende.ts"
  },
  "exclude": [
    "_to_delete/"
  ],
  "tasks": {
    "przyklad-ksiega": "ende run --allow-write=. examples/przyklad-biblioteczka.ts",
    "przyklad-drzewo": "ende run --allow-write=. examples/przyklad-drzewo.ts",
    "test": "ende test --allow-run=dot --allow-read=. --allow-write=. tests/testy.ts",
    "czytaj-pisz": "ende serve -A --watch=web/client.ts,site/,web/ web/main.tsx",
    "czytaj": "ende serve -A web/main.tsx",
    "sprawdz-program": "ende check src/ examples/ tests/",
    "sprawdz-program-tsgo": "ende check --unstable-tsgo src/ examples/ tests/",
    "sprawdz-lekture": "ende check web/ site/",
    "sprawdz-lekture-tsgo": "ende check --unstable-tsgo web/ site/",
    "check": "ende fmt --check && ende lint && ende check"
  },
  "fmt": {
    "lineWidth": 180
  }
}
            `,
    "ts:importmap": tecs("typescript")`
/**
 * Import map dla przeglądarki — bez npm. Adresy bierzemy z deno.json („imports”),
 * więc przeglądarka i serwer używają tych samych modułów w tych samych wersjach,
 * a wersje zmienia się w jednym miejscu.
 */
import konfiguracja from "../deno.json" with { type: "json" };

/** Specyfikatory, których może używać kod w przeglądarce (client.ts, wyspy i to, co importują). */
const DLA_PRZEGLADARKI = [
  "preact",
  "preact/",
  "@preact/signals",
  "@preact/signals/",
  "@preact/signals-core",
  "@preact/signals-core/",
  "highlight.js/",
] as const;

const importy: Readonly<Record<string, string>> = konfiguracja.imports;

/** Adres https:// z deno.json; przeglądarka nie rozumie jsr:/npm:, więc to błąd konfiguracji. */
function adres(spec: string): string {
  const url = importy[spec];
  if (url === undefined || !url.startsWith("https://")) {
    throw new Error(\`deno.json „imports”: „\${spec}” musi wskazywać adres https:// (jest: \${url})\`);
  }
  return url;
}

/** <script type="importmap"> content. */
export const IMPORT_MAP = {
  imports: {
    "@/": "/",
    ...Object.fromEntries(DLA_PRZEGLADARKI.map((spec) => [spec, adres(spec)])),
  },
};

/** Arkusz KaTeX z tego samego pakietu co na serwerze; czcionki ładują się względem niego. */
export const KATEX_CSS = new URL("dist/katex.min.css", adres("katex/")).href;
        `,
    "ts:staticfiles": tecs("typescript")`
import type { MiddlewareHandler } from "@hono/hono";

/**
 * Pliki statyczne z podanego katalogu (np. site/static/), wyłącznie na API Deno.
 * Ścieżka katalogu jest adresem URL (zwykle względem import.meta.url), więc nie zależy
 * od katalogu roboczego. Zapytanie spoza katalogu (np. /../deno.json) → dalej (404).
 * \`cache-control: no-cache\`: przeglądarka zawsze pyta o świeżą wersję — edycja na żywo.
 */
export function plikiStatyczne(katalog: URL): MiddlewareHandler {
  const baza = katalog.href.endsWith("/") ? katalog : new URL(katalog.href + "/");
  return async (c, next) => {
    const plik = new URL("." + c.req.path, baza);
    if (!plik.href.startsWith(baza.href)) return await next();
    try {
      if (!(await Deno.stat(plik)).isFile) return await next();
      const { readable } = await Deno.open(plik);
      return c.body(readable, 200, { "content-type": typTresci(plik.pathname), "cache-control": "no-cache" });
    } catch (blad) {
      if (blad instanceof Deno.errors.NotFound) return await next();
      throw blad;
    }
  };
}

const TYPY: Readonly<Record<string, string>> = {
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  html: "text/html; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  woff2: "font/woff2",
  woff: "font/woff",
  ttf: "font/ttf",
  pdf: "application/pdf",
};

function typTresci(sciezka: string): string {
  const kropka = sciezka.lastIndexOf(".");
  return (kropka >= 0 ? TYPY[sciezka.slice(kropka + 1).toLowerCase()] : undefined) ?? "application/octet-stream";
}
          `,
    "ts:island": tecs("typescript")`
import { type ComponentType, type FunctionComponent, h } from "preact";

const ROOT = new URL("../", import.meta.url).href;
const IS_BROWSER = typeof document !== "undefined";

/** Marks the server-rendered children of an island (see client.ts). */
export const SLOT_ATTR = "data-island-slot";

/**
 * Marks a component as an island. In a site/features/**\/*.island.tsx file:
 *
 *   export default island(import.meta.url, function Counter(props) { … });
 *
 * Server: renders the component inside
 *   <div data-island="/site/features/…/X.island.tsx" data-props="{…}">.
 * Browser: returns the component itself; client.ts imports that path and
 * hydrates it.
 *
 * Props must be JSON-serializable, except \`children\`: those are rendered on
 * the server into a slot and kept as static HTML in the browser (their DOM is
 * not re-rendered by the island, so they cannot be interactive Preact code —
 * nested islands inside them still hydrate on their own).
 */
export function island<P extends object>(
  moduleUrl: string,
  Component: ComponentType<P>,
): ComponentType<P> {
  if (IS_BROWSER) return Component;
  if (!moduleUrl.startsWith(ROOT)) {
    throw new Error(\`island outside the project: \${moduleUrl}\`);
  }
  const src = "/" + moduleUrl.slice(ROOT.length);
  const Wrapped: FunctionComponent<P> = ({ children, ...props }) =>
    h(
      "div",
      {
        "data-island": src,
        "data-props": JSON.stringify(props),
        style: "display:contents",
      },
      h(
        Component,
        {
          ...props,
          children: children == null ? children : h(
            "div",
            { [SLOT_ATTR]: "", style: "display:contents" },
            children,
          ),
        } as unknown as P,
      ),
    );
  return Wrapped;
}
      `,
    "ts:transpile": tecs("typescript")`
// TYLKO DENO (przełącznik "@transpilacja": deno.json → ten plik, ende.json → web/transpile-ende.ts).
// @deno/loader 0.5.0 czyta pliki przez node:fs, node:process, node:os i node:tty (sys_traits, funkcja "wasm"),
// których Ende nie ma — dlatego Ende używa web/transpile-ende.ts (tsgo). Zmiany w grafie przenoś do obu plików.
// DO ROZWAŻENIA W PRZYSZŁOŚCI: jeden transpilator dla obu środowisk (np. deno_ast z Rust → wasm).
import { RequestedModuleType, Workspace } from "@deno/loader";
import { encodeBase64 } from "@std/encoding/base64";

const ROOT = new URL("../", import.meta.url);
const FEATURES = new URL("site/features/", ROOT);
const ISLAND_FILE = /\.island\.tsx?$/;
const CLIENT_ENTRY = new URL("web/client.ts", ROOT).href;

// Static imports/re-exports (\`… from "x"\`), side-effect \`import "x"\`,
// and dynamic \`import("x")\` with a literal path. Run on transpiled output,
// whose syntax is normalized. Dynamic imports with computed paths are missed.
const IMPORT = /\bfrom\s*["']([^"']+)["']|\bimport\s*\(?\s*["']([^"']+)["']/g;

const workspace = new Workspace({
  platform: "browser",
  configPath: new URL("deno.json", ROOT).href,
});
const loader = await workspace.createLoader();

const entries = [CLIENT_ENTRY, ...await findIslands(FEATURES)];
for (const d of await loader.addEntrypoints(entries)) console.warn(d.message);

/**
 * Everything the browser may fetch: client.ts, every *.island.tsx and the
 * local files they import, transitively (widgets, modules, lib/island.ts…).
 * Transpiled once at startup; \`deno task czytaj-pisz\` restarts on change.
 * Files outside this graph (pages, main.tsx, server code) are never served.
 */
const served = await buildClientGraph(entries);
console.log(\`client modules: \${served.size}\`);

/** Transpiled JS for a request path, or null if it is not client code. */
export function transpileForBrowser(path: string): string | null {
  return served.get(new URL("." + path, ROOT).href) ?? null;
}

async function findIslands(dir: URL): Promise<string[]> {
  const out: string[] = [];
  try {
    for await (const e of Deno.readDir(dir)) {
      if (e.isDirectory) {
        out.push(...await findIslands(new URL(e.name + "/", dir)));
      } else if (ISLAND_FILE.test(e.name)) {
        out.push(new URL(e.name, dir).href);
      }
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
  else if (spec.startsWith("./") || spec.startsWith("../")) {
    url = new URL(spec, referrer);
  } else return null;
  const href = url.href;
  return href.startsWith(ROOT.href) && !href.includes("/node_modules/")
    ? href
    : null;
}

async function buildClientGraph(
  entries: string[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const queue = [...entries];
  for (let url = queue.pop(); url !== undefined; url = queue.pop()) {
    if (out.has(url)) continue;
    let code: string;
    try {
      code = await transpile(url);
    } catch (err) {
      console.error(\`[client] \${url}:\`, err);
      continue;
    }
    out.set(url, code);
    for (const m of code.matchAll(IMPORT)) {
      // dopasowana jest dokładnie jedna z dwóch grup; typ (noUncheckedIndexedAccess) tego nie wie
      const spec = m[1] ?? m[2];
      if (spec === undefined) continue;
      const dep = resolveLocal(spec, url);
      if (dep && !out.has(dep)) queue.push(dep);
    }
  }
  return out;
}

async function transpile(url: string): Promise<string> {
  const res = await loader.load(url, RequestedModuleType.Default);
  if (res.kind !== "module") throw new Error("not a local module");
  const code = new TextDecoder().decode(res.code);
  if (!res.sourceMap?.length || code.includes("//# sourceMappingURL=")) {
    return code;
  }
  return code + "\n" + await inlineSourceMap(res.sourceMap);
}

/**
 * Source map as an inline comment, so DevTools shows the original .ts/.tsx.
 * file:///... sources are rewritten to server paths (/site/features/…) and their
 * text is embedded, so the browser never has to fetch anything from file://.
 */
async function inlineSourceMap(raw: Uint8Array): Promise<string> {
  const map: { sources?: string[]; sourcesContent?: (string | null)[] } = JSON
    .parse(new TextDecoder().decode(raw));
  const sources = map.sources ?? [];
  const contents = map.sourcesContent ?? [];
  for (const [i, src] of sources.entries()) {
    if (!src.startsWith("file:")) continue;
    contents[i] ??= await Deno.readTextFile(new URL(src));
    if (src.startsWith(ROOT.href)) {
      sources[i] = "/" + src.slice(ROOT.href.length);
    }
  }
  map.sourcesContent = contents;
  const b64 = encodeBase64(new TextEncoder().encode(JSON.stringify(map)));
  return \`//# sourceMappingURL=data:application/json;base64,\${b64}\`;
}
`,
    "ts:transpile-ende": tecs("typescript")`
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

// Jak w web/transpile.ts: statyczne importy/re-eksporty, \`import "x"\` i \`import("x")\` z dosłowną ścieżką.
const IMPORT = /\bfrom\s*["']([^"']+)["']|\bimport\s*\(?\s*["']([^"']+)["']/g;

const entries = [CLIENT_ENTRY, ...await findIslands(FEATURES)];
const served = await buildClientGraph(entries);
console.log(\`client modules: \${served.size} (tsgo)\`);

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
    for (const url of fala) if (!kod.has(url)) console.error(\`[client] \${url}: brak pliku albo nie został przetranspilowany\`);
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
        throw new Error(\`nie znaleziono „\${TSGO}” — ustaw zmienną TSGO na pełną ścieżkę do tsgo (np. …\\tsgo.exe)\`);
      }
      throw err;
    }
    const komunikaty = new TextDecoder().decode(wynik.stdout) + new TextDecoder().decode(wynik.stderr);
    if (komunikaty.trim() !== "") console.warn(\`[tsgo]\n\${komunikaty.trim()}\`);
    // 0 = bez uwag, 2 = uwagi (np. błąd składni), ale pliki wyemitowane; inne = porażka
    if (wynik.code !== 0 && wynik.code !== 2) throw new Error(\`tsgo zakończył się kodem \${wynik.code}\`);

    const kod = new Map<string, string>();
    for (const [i, url] of urls.entries()) {
      const plik = \`\${wyjscie}/\${wzgledne[i]?.replace(/\.tsx?$/, ".js")}\`;
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
`,
    "ts:client": tecs("typescript")`
import { type ComponentType, h, hydrate } from "preact";
import { SLOT_ATTR } from "@/web/island.ts";

// Hydrates every <div data-island="/site/features/…/X.island.tsx"> with the default
// export of that module.
const islands = document.querySelectorAll<HTMLElement>("[data-island]");

await Promise.all([...islands].map(async (el) => {
  const mod: { default: ComponentType } = await import(\`\${el.dataset.island}\`);
  const props = JSON.parse(el.dataset.props ?? "{}");
  const slot = ownSlot(el);
  if (slot) {
    // Server-rendered children, passed back as the same HTML: Preact does not
    // touch innerHTML while hydrating, nor later while the string is unchanged.
    props.children = h("div", {
      [SLOT_ATTR]: "",
      style: "display:contents",
      dangerouslySetInnerHTML: { __html: slot.innerHTML },
    });
  }
  hydrate(h(mod.default, props), el);
}));

/** The slot of this island (not of an island nested inside it). */
function ownSlot(el: HTMLElement): HTMLElement | null {
  for (const s of el.querySelectorAll<HTMLElement>(\`[\${SLOT_ATTR}]\`)) {
    if (s.closest("[data-island]") === el) return s;
  }
  return null;
}
          `,
    "tsx:layout": tecs("typescript")`
import type { ComponentChildren } from "preact";
import { IMPORT_MAP, KATEX_CSS } from "./importmap.ts";
import { Kotwice } from "../site/scripts/kotwice.ts";

export function Layout(
  { title, children }: { title: string; children: ComponentChildren },
) {
  return (
    <html lang="pl">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href={KATEX_CSS} />
        <link rel="stylesheet" href="/styles.css" />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(IMPORT_MAP) }}
        />
        <script type="module" src="/web/client.ts" />
      </head>
      {/* świeży zbiór kotwic na każde renderowanie strony: unikalne id nagłówków */}
      <body>
        <Kotwice.Provider value={new Set()}>{children}</Kotwice.Provider>
      </body>
    </html>
  );
}
        `,
    "tsx:main": tecs("typescript")`
import { Hono } from "@hono/hono";
import { renderToString } from "preact-render-to-string";
import type { VNode } from "preact";
import { plikiStatyczne } from "@/web/staticfiles.ts";
// przełącznik: deno.json → ./transpile.ts (@deno/loader), ende.json → ./transpile-ende.ts (tsgo)
import { transpileForBrowser } from "@transpilacja";
import { Layout } from "./layout.tsx";
import Home from "../site/pages/index.tsx";

const app = new Hono();

const page = (title: string, body: VNode) =>
  "<!DOCTYPE html>" + renderToString(<Layout title={title}>{body}</Layout>);

// --- pages (SSR) ---
app.get("/", (c) => c.html(page("LEKTURA", <Home />)));

// --- client .ts/.tsx (client.ts, islands and what they import) ---
app.get("*", (c, next) => {
  const js = transpileForBrowser(c.req.path);
  if (js === null) return next();
  return c.body(js, 200, {
    "content-type": "text/javascript; charset=utf-8",
    "cache-control": "no-cache",
  });
});

// --- static files: site/static/ (względem tego pliku, nie katalogu roboczego) ---
app.get("*", plikiStatyczne(new URL("../site/static/", import.meta.url)));

export default { fetch: app.fetch } satisfies Deno.ServeDefaultExport;
`,
  };

  return rekord[klucz];
}
