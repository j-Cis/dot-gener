import { type Context, Hono } from "@hono/hono";
import { renderToString } from "preact-render-to-string";
import type { ComponentType, VNode } from "preact";
import { plikiStatyczne } from "./staticfiles.ts";
// przełącznik: deno.json → ./transpile.ts (@deno/loader), ende.json → ./transpile-ende.ts (tsgo)
import { transpileForBrowser } from "@transpilacja";
import { Layout } from "./layout.tsx";
import { Error404PageNotFound } from "@/web/404.tsx";

export const app = new Hono();

const page = (title: string, body: VNode) => "<!DOCTYPE html>" + renderToString(<Layout title={title}>{body}</Layout>);

// --- pages (SSR): każdy site/pages/**/index.tsx to strona, a jego katalog to adres ---
//   site/pages/index.tsx                  → /
//   site/pages/dokumentacja/index.tsx     → /dokumentacja   (i /dokumentacja/)
//   site/pages/a/b/index.tsx              → /a/b
// Nowy katalog z index.tsx = nowa strona; serwer skanuje przy starcie (--watch=site/ restartuje go po zmianie).
const PAGES = new URL("../site/pages/", import.meta.url);

/** Moduł strony: domyślny eksport to komponent; opcjonalny `export const tytul = "…"` to <title>. */
interface ModulStrony {
  readonly default: ComponentType;
  readonly tytul?: string;
}

/** [adres, plik] każdego index.tsx w katalogu i podkatalogach. */
async function* znajdzStrony(katalog: URL, adres: string): AsyncGenerator<readonly [adres: string, plik: URL]> {
  for await (const wpis of Deno.readDir(katalog)) {
    if (wpis.isFile && wpis.name === "index.tsx") yield [adres === "" ? "/" : adres, new URL("index.tsx", katalog)];
    else if (wpis.isDirectory) yield* znajdzStrony(new URL(`${encodeURIComponent(wpis.name)}/`, katalog), `${adres}/${wpis.name}`);
  }
}

const strony = (await Array.fromAsync(znajdzStrony(PAGES, ""))).toSorted(([a], [b]) => a.localeCompare(b));
for (const [adres, plik] of strony) {
  const modul: ModulStrony = await import(plik.href);
  if (typeof modul.default !== "function") throw new Error(`${plik.pathname}: brak domyślnego eksportu komponentu strony`);
  const { default: Strona, tytul = "LEKTURA" } = modul;
  const obsluga = (c: Context) => c.html(page(tytul, <Strona />));
  app.get(adres, obsluga);
  if (adres !== "/") app.get(`${adres}/`, obsluga);
}

export const adresyStron = strony.map(([adres]) => adres);
console.log(`pages: ${adresyStron.join(" ")}`);

// --- 404: wszystko, czego nie obsłużyły strony, transpilacja ani pliki statyczne → mapa stron ---
app.notFound((c) => c.html(page("404 — nie ma takiej strony", <Error404PageNotFound adres={c.req.path} strony={adresyStron} />), 404));

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
