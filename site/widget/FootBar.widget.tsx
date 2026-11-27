// @project-metadata
// Path: site/widget/FootBar.widget.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { cx } from "@/site/common/css/cx.ts";

export interface FootBarItem {
	name: string;
	href: string;
}

export interface FootBarProps {
	items: FootBarItem[];
	class?: string;
}

/**
 * Thin footer bar, sticky at the bottom of the viewport.
 *
 *   <FootBar items={[
 *     { name: "GitHub", href: "https://github.com/j-Cis/dot-gener" },
 *     { name: "Facebook", href: "https://www.facebook.com/Cisowski/" },
 *   ]} />
 */
export function FootBar( { items, class: className }: FootBarProps ) {
	return (
		<footer class={cx( "foot-bar", className )} aria-label="Stopka" data-listwa="dol">
			{items.map( ( { name, href } ) => <a key={href} href={href}>{name}</a> )}
		</footer>
	);
}
