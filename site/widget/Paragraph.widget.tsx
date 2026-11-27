// @project-metadata
// Path: site/widget/Paragraph.widget.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { cx } from "@/site/common/css/cx.ts";
import type { ComponentChildren } from "preact";

/** CSS length in a supported unit, e.g. "1.5rem", "24px", "2em". */
export type Size = `${number}${"rem" | "em" | "px"}`;

export interface PProps {
	children: ComponentChildren;
	noindent?: boolean;
	class?: string;
	sizeText?: Size;
	sizeIndent?: Size;
}

export function P( { children, sizeText, sizeIndent, class: className, noindent = false }: PProps ) {
	return (
		<p
			class={cx( noindent ? "text-paragraph--no-indent" : "text-paragraph", className )}
			style={{
				...( sizeText && { fontSize: sizeText } ),
				...( sizeIndent && { textIndent: sizeIndent } ),
			}}
		>
			{children}
		</p>
	);
}
