<!--
  @project-metadata
  Path: CLAUDE.md
  Author: Jan Roman Cisowski
  ORCID: https://orcid.org/0009-0009-2907-3792
  Repository: https://github.com/j-Cis/dot-gener
-->

# Project Architecture

The key words MUST, MUST NOT, SHOULD, SHOULD NOT and MAY are used as in RFC 2119.

## 0. Roadmap and Priorities

### How the project grew

1. Work started on the DOT generator (`dot-gener`).
2. Markdown with LaTeX rendering proved inadequate, so Markdown was dropped.
3. A full-stack website framework was written instead (`./web/`).
4. HTML tables were inadequate, so widgets were created: a table widget, a title widget (like Markdown headings), and `Tec` (inline code, like Markdown backticks).
5. DOT turned out to be improvable, so DOTX was created.
6. While documenting DOTX, plain SVG and Canvas proved inconvenient.
7. So LOCI was started: a markup language for geometry.

### Plan (reverse order of the above)

1. Bring LOCI to a minimal satisfying functionality and outline its further development.
2. Use LOCI to write the DOTX documentation. DOTX MAY use LOCI as middleware before its output reaches the SVG or Canvas format.
3. Based on that documentation, decide what to add to DOTX and how it should work.
4. Bring DOTX to a minimal satisfying functionality and outline its further development.
5. Finish the documentation of the `dot-gener` draft.
6. Return to the feasibility of `dot-gener`, possibly in a completely different form.
7. Later: split the work into independent packages, e.g. LOCI, DOTX, the widget set, the islands, and the framework itself.

Work SHOULD follow this order. Items in section 6 (TODO) carry their own priority.

## 1. Website Framework

### Directory Rules

#### `./web/`

This directory is exclusively reserved for files responsible for implementing the full-stack framework itself. It MUST NOT contain any domain-specific code, declarations, or other
content belonging to the user-defined website.

The framework scans the contents of the website project's `site/` directory, which contains the user-defined website and its domain-specific content.

The framework MAY expose generic tools that the website uses, for example `web/island.ts` (island marker) and `web/heading-anchors.ts` (unique heading ids). Files in `./web/` MUST
NOT import specific files of the website.

##### Naming Conventions

- File names MUST be in lowercase English.
- Hyphens (`-`) are permitted as word separators.
- File names MAY begin with either a letter or a digit.

##### Documentation

- TSDoc comments are strongly recommended.
- TSDoc comments MUST be written in Polish.
- Comments SHOULD be insightful, erudite, technically precise, and concise.
- Documentation SHOULD explain intent, design rationale, architectural decisions, and non-obvious implementation details rather than merely restating the code.

##### Framework Mechanisms

- **CSS cascade layers:** `@layer shell, widget, layout, route;`
  - `shell` — `web/page-shell.css`;
  - `widget` — CSS of widgets, islands and renderers;
  - `layout` — CSS of sections;
  - `route` — the page's own `index.css`.
  - A later layer wins regardless of selector specificity. `site/static/styles.css` is outside all layers and wins over all of them.
- **CSS inclusion:** the CSS of a component is added to a page only if the component's `.tsx` file is in that page's import graph.
- **Route CSS** applies only to its own page; subpages do not inherit it.
- **Re-export files (`_ANY.ts`):** imports from them are resolved name by name, so a page gets the CSS of the components it actually imports, not of everything re-exported.
- **Islands:** island props are passed to the browser as JSON, except `children`, which the server renders to HTML. Inputs that JSON cannot carry (functions, JSX in attributes)
  MUST be converted on the server through the third argument of `island(url, Component, prepare)`.
- **Everything an island imports is sent to the browser.**
- **Routes:** a page MAY export `tytul` (its title). The 404 page, with a map of all pages, is generated automatically.
- **Sticky bars:** elements marked with `data-listwa="gora"` / `data-listwa="dol"` are measured by `web/listwy.ts`; `fill…` table rows use the space between them.
- **Tasks:** `deno task czytaj` (server), `deno task czytaj-pisz` (server with automatic page reload), `deno task ghpages` (static export to `dist/` for GitHub Pages).
- `_to_delete/` is excluded from Deno (see `deno.json`).

#### `./site/`

This directory contains the user-defined website. Each top-level directory has a strictly defined responsibility and MUST NOT be used for purposes assigned to another directory.

The directories listed below are the ones currently defined. A new top-level directory MAY be added when justified, if it:

- has a name of exactly 6 letters;
- is coloured by the Material Icon Theme extension in VS Code without additional settings;
- has its own responsibility, not covered by an existing directory.

##### File Naming Classes

- **Components** (widgets, renderers, islands, sections, pipes, macros — e.g. `Tec`, `Tex`) use PascalCase. These are the entry files of their directory.
- **Language element definitions** (in `./site/common/lang/`) use the language name in capitals, then the element name starting with a capital letter:
  - `<LANG><Name>Element.ts` — one element (tag) of the language, e.g. `LOCIBodyElement.ts`, `LOCIAxElement.ts`;
  - `<LANG><Name>Attributes.ts` — a group of attributes shared by several elements, e.g. `LOCIPointAttributes.ts`.
- **All other files** (parts, helpers, registries) SHOULD use lowercase letters; hyphens are permitted, e.g. `render-svg.tsx`, `pan-zoom.ts`.

##### Stylesheets

- A component MAY have a sibling stylesheet. It is added automatically only if its name is identical to the component file name, with the same suffix, differing only in the
  extension: `Table.widget.tsx` → `Table.widget.css`.
- An empty stylesheet MAY exist as a placeholder for planned styles.

##### Who May Use Whom

- `widget/**/*.(widget|widgets).tsx` MAY be used in: `routes/**/index.tsx`, `layout/**/*.(section|sections).tsx`, `client/*.island.tsx`, and in other widgets.
- `screen/*.render.tsx` MAY be used in: `routes/**/index.tsx`, `layout/**/*.(section|sections).tsx`, `client/*.island.tsx`.
- `client/*.island.tsx` MAY be used in: `routes/**/index.tsx`, `layout/**/*.(section|sections).tsx`.
- `layout/**/*.(section|sections).tsx` MAY be used in: `routes/**/index.tsx`.
- A renderer MAY use another renderer, but this is NOT recommended.
- A section SHOULD NOT use another section (discouraged, not forbidden). A section MAY consist of many internal sub-functions.
- `./site/common/` is a separate group (functions, types, definitions — the engine). It MAY be used everywhere in `./site/`.
- Framework tools from `./web/` (e.g. `web/island.ts`) MAY be used everywhere in `./site/`.

##### Re-exports

Re-exports are permitted only in:

1. `./site/widget/_ANY.ts` — re-exports all widgets;
2. `./site/screen/_ANY.ts` — re-exports renderers;
3. `./site/common/` — pure TypeScript modules MAY re-export each other freely.

The `_ANY.ts` name is intentional: its leading underscore ensures that it appears at the top of alphabetical file listings.

##### `./site/static/`

- Contains static files exclusively.
- No other types of files or application code are permitted here.

##### `./site/routes/`

- Contains route definitions, normally organized as pairs of two file types: `**/index.tsx` and `**/index.css`.
- The presence and location of an `index.tsx` file determine the corresponding route path in the router.
- The accompanying `index.css` is a local stylesheet exclusively for that particular page and the components it contains.
- Route styles MUST NOT affect other pages.

##### `./site/widget/`

- Contains all widgets except islands.
- Examples include tables, paragraphs, footers, and navigation components.
- Widgets are building blocks that nest like matryoshka dolls; a widget MAY use other widgets.
- Widgets SHOULD stay clean: their data is passed in from the place where they are used (basic fixed words are an exception).

**Naming conventions:**

- Names MUST use PascalCase and contain only letters and digits.
- File names MUST follow one of these patterns:
  - `<Name>.widget.tsx`
  - `<Name>.widgets.tsx`
- The `.widget.tsx` or `.widgets.tsx` suffix is MANDATORY. Files without one of these exact suffixes MUST NOT be recognized or treated as widgets.

##### `./site/screen/`

- Contains renderers: they turn data or a language model (e.g. LOCI, DOTX) into a form presentable to the end user (HTML, SVG, Canvas).
- Rendering of a custom language belongs here, never in `./site/common/lang/`.

**Naming conventions:**

- Entry files are at the top level of `./site/screen/`. Their names MUST use PascalCase and end with `.render.tsx` or another suffix explicitly associated with rendering. Names
  SHOULD be short and descriptive.
- Parts of a renderer live in a subdirectory named after its topic, e.g. `./site/screen/loci/`. The naming rules above apply only to the top level, not to these parts; parts SHOULD
  use lowercase names.
- Other code SHOULD import a renderer through its entry file, not through its parts.

##### `./site/client/`

- Contains code requiring client-side hydration.
- This includes islands and other elements that require hydration to function correctly.
- Parts of islands live in subdirectories named after their category:
  - `./site/client/registries/` — registries of Canvas and SVG elements subject to hydration, so they can be rendered inside `VectorViewport.island.tsx`;
  - `./site/client/hooks/` — Preact hooks used by islands (e.g. `pan-zoom.ts`).
- `VectorViewport.island.tsx` has its corresponding stylesheet, `VectorViewport.island.css`. The page chooses what it shows:
  `<VectorViewport renderer="SVG" | "Canvas" sourceFormat="SVG" | "LOCI" | "DOTX" | "CANVAS" …>`.

**Island naming conventions:**

- The `.island.tsx` suffix is MANDATORY for island components.
- The framework relies on this exact suffix to identify and process islands correctly.

**Restrictions:**

- Re-exporting islands through `_ANY.ts` is NOT permitted.

##### `./site/layout/`

- Contains ready-made, content-filled sections that can subsequently be included in page-level `index.tsx` files.
- Although these sections could also be written directly inside `index.tsx`, keeping them separate provides a cleaner and more organized structure.

**File naming:**

- Section files MUST use one of the following suffixes:
  - `.section.tsx`
  - `.sections.tsx`

**Restrictions:**

- Re-exports through `_ANY.ts` are NOT permitted.

##### `./site/common/`

- Contains pure TypeScript code exclusively.
- Files with the `.tsx` extension are NOT permitted.
- Imports from `preact` (including `preact/hooks`) are NOT permitted. Both rules apply: a `.ts` file that uses Preact does not belong here either.
- Code here MUST NOT import from other directories of `./site/`.

**Directory structure:**

- `./site/common/css/` — styling-related functionality, including utilities and functions for working with CSS classes.
- `./site/common/util/` — general-purpose utilities and helper functions.
- `./site/common/lang/` — definitions of custom languages: their elements, attributes, types and logic (mathematics, geometry). A language here knows nothing about SVG, Canvas or
  HTML; rendering belongs to `./site/screen/`.
- `./site/common/drafts/` — temporary, experimental, or unfinished code.

Additional categories such as `logic/`, `math/`, and others MAY be introduced when needed.

**Directory naming principle:**

- Directory names SHOULD primarily classify the type or category of elements they contain, rather than identify a particular element or one of its constituent parts.

##### `./site/drafts/`

- Contains temporary, experimental, or unfinished website-related code.
- This directory serves as a general workspace for drafts that do not belong to the more specific `./site/common/drafts/` category.

## 2. DOT Language Generator

This is a separate project within the same repository. It is architecturally independent of the website framework and MUST remain isolated from it.

### Directory Rules *

- `./src/` — contains the source code of the DOT language generation engine itself.
- `./examples/` — contains files that use the generation engine to produce specific, concrete outputs and demonstrate its functionality.
- `./tests/` — contains tests of the generator. Its contents and responsibilities MUST remain associated with the generator, not the website framework.
- `./generated/` — contains files produced by the generator. This is the generator's output directory.

## 3. Metadata Injection Script

### `./inject-metadata.ps1`

This is a standalone PowerShell script, separate from both the website framework and the DOT language generator.

Its purpose is to:

- Inject metadata into all designated project files.
- Perform bulk replacements of existing metadata.
- Overwrite metadata across multiple files in a single operation.

The script is responsible for mass metadata management and MUST NOT be treated as part of either project's runtime implementation.

Every file SHOULD start with the metadata header. Its most important fields are the file location (`Path`), the author and the project (`Repository`). Edit dates are intentionally
not included.

The script:

- processes files tracked by Git and new files not yet added to Git (excluding ignored files and `_to_delete/`);
- writes a file only if its content actually changes;
- keeps an XML declaration (`<?xml …?>`) as the first line and puts the header after it;
- keeps line endings and the byte order mark (BOM) of each file;
- supports `-DryRun`, which only lists the files that would change.

## 4. Runtime Environment and Dependencies

### Deno, Ende and tsxr

- **Deno** is the working runtime of the whole repository.
- **Ende**, a fork of Deno without Node.js support, is postponed; it is meant as a substitute for Deno and does not work yet. Do not work on Ende unless asked.
- **tsxr** (working name, <https://github.com/j-Cis/tsxr>) is the target environment. It does not exist yet. It will take over the whole `./web/` directory, provide a minimal
  runtime without the unneeded parts of Deno/Ende, and later be available as WebAssembly, rendering everything on the fly and allowing everything to be written in XML, TOML, JSON,
  HTML, SVG, TS, TSX (Preact), possibly Rust inserts, and WebAssembly. The goal is maximum independence.

Two nearly mirrored configuration files are maintained:

- `deno.json` — Deno configuration.
- `ende.json` — Ende configuration.

They SHOULD stay consistent in terms of project functionality and dependencies. The only current difference is the `@transpilacja` import (`web/transpile.ts` for Deno,
`web/transpile-ende.ts` for Ende). Do not remove either configuration.

### Dependency Policy

- Node.js dependencies are NOT permitted.
- npm MUST NOT be used as a package manager or dependency provider.
- The project MUST NOT depend on the Node.js ecosystem.
- All dependencies and tooling MUST be compatible with Deno and Ende.
- A `node_modules/` directory MUST NOT be introduced.

The project deliberately avoids the Node.js/npm dependency ecosystem. Dependency management MUST remain within the native capabilities of Deno and Ende.

**Architectural principle:** Maintain a runtime-independent project structure wherever possible, while preserving compatibility with both Deno and Ende.

## 5. Working Rules for Claude

- Never run `git commit`.
- Never delete files; move them to `_to_delete/`, keeping their path.
- Check the current state of a file before editing it; keep its line endings (LF or CRLF); explain every change.
- One file per element or concept (e.g. per language tag); shared parts in their own files.
- Strong typing: no loose `string` for keys; use `keyof` and template-literal types; prefer tuples over many small structures.
- Facts and analysis first, opinion after.
- Reply in Polish: short sentences, clear structure.
- `deno fmt` (line width 180) and `deno lint` MUST be clean.
- New files start with the `@project-metadata` header with a correct `Path`.
- In concept discussions, a list of ideas is discussed one item at a time; do not prepare summaries, tables or code until asked.

## 6. TODO

### Later

- `web/guide-map.ts`: builds the map of routes and static files and passes it to the website; `GuideBar` builds its menu from it and MAY override a link name, disable or hide a
  link. Details (order, subpages, default names from `tytul`, the base path on GitHub Pages) to be decided when implemented.
- Revisit the current framework check that stops the server when browser code (an island or anything it imports) imports an `_ANY.ts` file; it conflicts with the intended use of
  re-exports.

### Low priority

- Everything an island imports is sent to the browser, so `VectorViewport` also sends the DOTX layout code and the LOCI model code. It is pure TypeScript and breaks nothing; it
  only adds download size.
