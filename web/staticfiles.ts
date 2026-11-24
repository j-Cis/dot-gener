// @project-metadata
// Path: web/staticfiles.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { MiddlewareHandler } from "@hono/hono";

/**
 * Pliki statyczne z podanego katalogu (np. site/static/), wyłącznie na API Deno.
 * Ścieżka katalogu jest adresem URL (zwykle względem import.meta.url), więc nie zależy
 * od katalogu roboczego. Zapytanie spoza katalogu (np. /../deno.json) → dalej (404).
 * `cache-control: no-cache`: przeglądarka zawsze pyta o świeżą wersję — edycja na żywo.
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
