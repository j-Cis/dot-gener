// @project-metadata
// Path: site/features/ui/Title.widget.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { cx } from "@/site/scripts/cx.ts";
import { Kotwice, slug, tekstZ, unikalna } from "@/site/scripts/kotwice.ts";

/** CSS length in a supported unit, e.g. "1.5rem", "24px", "2em". */
export type TitleSize = `${number}${"rem" | "em" | "px"}`;

/** Outline level, rendered as that heading element. */
export type TitleLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface TitleProps {
  children: ComponentChildren;
  /** Short point key shown before the text, e.g. "1.1" or "a1". */
  prefix?: string;
  /** Font size of the whole title; the prefix scales with it (em). */
  size?: TitleSize;
  /** Outline level. Default: "h2". */
  level?: TitleLevel;
  /** Extra classes for the point (prefix). */
  prefixClass?: string;
  /** Extra classes for the text. */
  textClass?: string;
  /**
   * Id kotwicy (link …#id). Domyślnie z prefiksu i tekstu, np. "1.0-lektura-o-dot-gener";
   * podaj własne, gdy link ma przetrwać zmianę treści nagłówka.
   */
  id?: string;
}

/**
 * Heading with an optional point key and an anchor link (#id), as in markdown:
 * on hover a „#” appears; it links to exactly this heading.
 *
 *   <Title prefix="1.1" level="h3" size="1.25rem">{name}</Title>
 *   <Title id="wzory">Wzory</Title>   → …#wzory
 */
export function Title(
  { children, prefix, size, level: Tag = "h2", prefixClass, textClass, id }: TitleProps,
) {
  const tekst = tekstZ(children);
  const kotwica = unikalna(useContext(Kotwice), id ?? slug(prefix ? `${prefix} ${tekst}` : tekst));
  return (
    <Tag id={kotwica} class="title" style={size ? { fontSize: size } : undefined}>
      {/* link do tego miejsca; widoczny po najechaniu (styles.css: .title-kotwica) */}
      <a class="title-kotwica" href={`#${kotwica}`} aria-label={`Link do sekcji: ${prefix ? `${prefix} ` : ""}${tekst}`}>#</a>
      {prefix && (
        <>
          <span class={cx("title-prefix", prefixClass)}>{prefix}</span>
          {/* space keeps "1.1 Name" readable for copy & screen readers */}
          {" "}
        </>
      )}
      <span class={cx("title-text", textClass)}>{children}</span>
    </Tag>
  );
}
