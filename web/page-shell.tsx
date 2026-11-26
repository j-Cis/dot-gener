// @project-metadata
// Path: web/page-shell.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { ComponentChildren } from "preact";
import { IMPORT_MAP, KATEX_CSS } from "./importmap.ts";
import { Kotwice } from "@/site/common/util/kotwice.ts";

import { PRZELADUJ, SKRYPT } from "@/web/refresh.ts";

export function PageShell(
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
        <script type="module" src="/web/client.ts" />
        {PRZELADUJ && <script dangerouslySetInnerHTML={{ __html: SKRYPT }} />}
      </head>
      {/* świeży zbiór kotwic na każde renderowanie strony: unikalne id nagłówków */}
      <body>
        <Kotwice.Provider value={new Set()}>{children}</Kotwice.Provider>
      </body>
    </html>
  );
}
