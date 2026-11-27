// @project-metadata
// Path: site/routes/lang/loci/sandbox/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import { Box, Col, P, powtorz, Row, RozmiarWiersza, Table, TitleSection } from "@/site/widget/_ANY.ts";
import VectorViewport from "@/site/client/VectorViewport.island.tsx";
import { Loci } from "@/site/screen/Loci.render.tsx";
export default function WebPage() {
	return (
		<main class="page">
			<Table cols={[ "max" ]} rows={powtorz( 2, "fill1" )} gapX="0.5rem" gapY="0.5rem">
				<Row row={1}>
					<VectorViewport renderer="SVG" sourceFormat="LOCI">
						<Loci.body></Loci.body>
					</VectorViewport>
				</Row>
			</Table>
		</main>
	);
}
