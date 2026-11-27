// @project-metadata
// Path: site/routes/lang/loci/sandbox/index.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener
//🆗

import { powtorz, Row, Table } from "@/site/widget/_ANY.ts";
import VectorViewport from "@/site/client/VectorViewport.island.tsx";
import { Loci } from "@/site/common/lang/loci/tags.ts";
import { lociId } from "@/site/common/lang/loci/logic/id.ts";

export default function WebPage() {
	const id = lociId();
	/** Łamane v we wszystkich postaciach: ten sam rysunek w SVG (wiersz 1) i na Canvas (wiersz 2). */
	const rysunek = (
		<Loci.body>
			<Loci.p id={id.p()} as="start" xy="-90,10" />
			<Loci.p id={id.p()} xy="-80,60" />
			<Loci.p id={id.p()} xy="-60,30" />
			<Loci.p id={id.p()} xy="-40,70" />
			<Loci.p id={id.p()} xy="-30,10" />
			{/* istniejące punkty, bez atrybutów */}
			<Loci.v id={id.v()} p="start,p1,p2,p3,p4" />
			{/* x i y osobno, domknięta, przerywana */}
			<Loci.v id={id.v()} px="10,20,40,60,70" py="10,60,30,70,10" cycle lineColor="#EF9F27" lineStyle="dashed" />
			{/* pary x,y, wypełniona bez domknięcia */}
			<Loci.v id={id.v()} pxy="-90,-80; -80,-30; -60,-60; -40,-20; -30,-80" surface lineColor="#5DCAA5" lineWidth={2} />
			{/* biegunowo, jednostka przy każdym kącie, wypełniona i domknięta */}
			<Loci.v id={id.v()} pr="60,90,60,90,60" pa="-80deg, -1.047rad, -45deg, -0.0833turn, -10deg" surface cycle lineColor="#ED93B1" />
			{/* biegunowo, jedna jednostka, domknięta, kropkowana */}
			<Loci.v id={id.v()} pr="85,95,85" pdeg="80,90,100" cycle lineStyle="dotted" />
		</Loci.body>
	);
	return (
		<main class="page">
			<Table cols={[ "max" ]} rows={powtorz( 2, "fill1" )} gapX="0.5rem" gapY="0.5rem">
				<Row row={1}>
					<VectorViewport renderer="SVG" sourceFormat="LOCI">{rysunek}</VectorViewport>
				</Row>
				<Row row={2}>
					<VectorViewport renderer="Canvas" sourceFormat="LOCI">{rysunek}</VectorViewport>
				</Row>
			</Table>
		</main>
	);
}
