// @project-metadata
// Path: site/routes/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import SekcjaOWzorach from "@/site/layout/SekcjaOWzorach.section.tsx";
import { ChudaStopka, Drogowskaz } from "@/site/layout/Drogowskaz.section.tsx";

export default function WebPage() {
	return (
		<main class="page">
			<Drogowskaz />
			<SekcjaOWzorach numer="1.0:." tytul={`LEKTURA O WZORACH`} />
			<hr />
			🫟
			<ChudaStopka />
		</main>
	);
}
