// @project-metadata
// Path: web/transpile.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

// TYLKO DENO (przełącznik "@transpilacja": deno.json → ten plik, ende.json → web/transpile-ende.ts).
// @deno/loader 0.5.0 czyta pliki przez node:fs, node:process, node:os i node:tty (sys_traits, funkcja "wasm"),
// których Ende nie ma — dlatego Ende używa web/transpile-ende.ts (tsgo). Zmiany w grafie przenoś do obu plików.
// DO ROZWAŻENIA W PRZYSZŁOŚCI: jeden transpilator dla obu środowisk (np. deno_ast z Rust → wasm).
import { RequestedModuleType, Workspace } from "@deno/loader";
import { encodeBase64 } from "@std/encoding/base64";

const ROOT = new URL("../", import.meta.url);
const CLIENT_ISLANDS = new URL("site/client/", ROOT);
const ISLAND_FILE = /\.island\.tsx?$/;
const CLIENT_ENTRY = new URL("web/client.ts", ROOT).href;

// Static imports/re-exports (`… from "x"`), side-effect `import "x"`,
// and dynamic `import("x")` with a literal path. Run on transpiled output,
// whose syntax is normalized. Dynamic imports with computed paths are missed.
const IMPORT = /\bfrom\s*["']([^"']+)["']|\bimport\s*\(?\s*["']([^"']+)["']/g;

const workspace = new Workspace({
  platform: "browser",
  configPath: new URL("deno.json", ROOT).href,
});
const loader = await workspace.createLoader();

const entries = [CLIENT_ENTRY, ...await findIslands(CLIENT_ISLANDS)];
for (const d of await loader.addEntrypoints(entries)) console.warn(d.message);

/**
 * Everything the browser may fetch: client.ts, every *.island.tsx and the
 * local files they import, transitively (widgets, modules, lib/island.ts…).
 * Transpiled once at startup; `deno task czytaj-pisz` restarts on change.
 * Files outside this graph (pages, main.tsx, server code) are never served.
 */
const served = await buildClientGraph(entries);
console.log(`client modules: ${served.size}`);

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
  return href.startsWith(ROOT.href) && !href.includes("/node_modules/") ? href : null;
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
      console.error(`[client] ${url}:`, err);
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
 * file:///... sources are rewritten to server paths (/site/client/…) and their
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
  return `//# sourceMappingURL=data:application/json;base64,${b64}`;
}
