import { Hono } from "@hono/hono";
import { renderToString } from "preact-render-to-string";
import type { VNode } from "preact";
import { plikiStatyczne } from "./staticfiles.ts";
// przełącznik: deno.json → ./transpile.ts (@deno/loader), ende.json → ./transpile-ende.ts (tsgo)
import { transpileForBrowser } from "@transpilacja";
import { Layout } from "./layout.tsx";
import Home from "../site/pages/index.tsx";

const app = new Hono();

const page = (title: string, body: VNode) => "<!DOCTYPE html>" + renderToString(<Layout title={title}>{body}</Layout>);

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
