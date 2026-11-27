// @project-metadata
// Path: site/routes/lang/loci/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import SekcjeOLOCI from "@/site/layout/SekcjeOLOCI.sections.tsx";
import { ChudaStopka, Drogowskaz } from "@/site/layout/Drogowskaz.section.tsx";

export default function WebPage() {
	return (
		<main class="page">
			<Drogowskaz />
			<SekcjeOLOCI numer="5.0:." tytul={`LEKTURA O LOCI`} />
			<hr />
			🫟
			<ChudaStopka />
		</main>
	);
}
