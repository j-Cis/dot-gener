// @project-metadata
// Path: site/layout/SekcjaOLekturze.section.tsx
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

import type { ComponentChildren } from "preact";
import { Box, P, powtorz, Row, Table, Title } from "@/site/widget/_ANY.ts";
import { tec, tecs } from "@/site/screen/Tec.render.tsx";

export interface SekcjaOLekturzeProps {
	numer: string;
	tytul: string;
}

/**
 * Opis frameworka (web/) i strony (site/): jak działa i jak z niego korzystać.
 * Każdy rozdział to osobna funkcja wewnętrzna, w kolejności czytania.
 */
export default function SekcjaOLekturze( paragraf: SekcjaOLekturzeProps ) {
	return (
		<article class="sekcja-o-lekturze">
			<header>
				<Title prefix={paragraf.numer} level="h1" size="2.125rem">
					{paragraf.tytul}
				</Title>
			</header>
			<Wstep />
			<JakToDziala />
			<DwaObszary />
			<PlikiFrameworka />
			<FolderyStrony />
			<NazwyPlikow />
			<StronyIAdresy />
			<Style />
			<KtoKogoUzywa />
			<Wyspy />
			<Zaleznosci />
			<Polecenia />
			<Dodatki />
		</article>
	);
}

/** Nagłówek rozdziału: ten sam wygląd w całej sekcji. */
function Rozdzial( { children }: { children: ComponentChildren } ) {
	return (
		<Title level="h3" size="1.5rem">
			<strong>{children}</strong>
		</Title>
	);
}

function Wstep() {
	return (
		<>
			<Title level="h3" size="1.125rem">
				<strong>WSTĘP</strong>
			</Title>
			<P>
				Niestety lekka metoda działania, jaką wprowadziło <u>DENO</u>, niebawem może zniknąć, gdyż w październiku 2026 roku zostało ono przejęte przez <u>CLOUDFLARE</u>{" "}
				i już wiadomo, że nie będzie wersji <u>3.0</u>, a jedynie zapowiedziane na rok łatki — to wielki cios. Deno oferowało po wyjęciu z pudełka wsparcie dla <u>TypeScript</u>
				{" "}
				(obecna wersja to <u>7.0.2</u>, a nowością w tej wersji jest całościowe przepisanie go na język <u>Go</u>). Oferowało też wsparcie dla React i Preact, np. przy użyciu{" "}
				<u>Hono</u>, bez zbędnego, ciągłego przebudowywania wszystkiego na czysty <u>JavaScript</u>. Dodatkowo dzięki <u>JSR</u> oraz <u>esm.sh</u>{" "}
				można było całkowicie pozbyć się syfu <u>NODE</u> i studni bez dna, zakrzywiającej czasoprzestrzeń bardziej niż czarna dziura — folderu <u>node_modules</u>. Powstał fork
				{" "}
				<u>Ende</u>, ale zobaczymy, co przyniesie. Równocześnie mam też własną koncepcję, <u>https://github.com/j-Cis/tsxr</u>, mającą na celu zastąpienie <u>Deno</u>.
			</P>
			<P>
				Stan obecny: wszystko działa pod <u>Deno</u>. <u>Ende</u> jest odłożone — miało zastąpić Deno, ale jeszcze nie działa. Docelowo cały folder {tec`web/`} przejmie{" "}
				<u>tsxr</u>, którego jeszcze nie ma.
			</P>
		</>
	);
}

function JakToDziala() {
	return (
		<>
			<Rozdzial>JAK TO DZIAŁA</Rozdzial>
			<P noindent>Droga od pliku do strony w przeglądarce, krok po kroku:</P>
			<ol>
				<li>{tec`deno task czytaj`} uruchamia serwer z pliku {tec`web/main.tsx`}. Serwer to Hono.</li>
				<li>Przy starcie serwer przegląda folder {tec`site/routes/`}. Każdy plik {tec`index.tsx`} to jedna strona.</li>
				<li>Dla każdej strony serwer od razu składa jej CSS. Bierze go z plików, które ta strona importuje (rozdział STYLE).</li>
				<li>
					Przy starcie serwer przygotowuje też kod dla przeglądarki: {tec`web/client.ts`}, każdą wyspę {tec`*.island.tsx`} z {tec`site/client/`}{" "}
					i wszystko, co one importują. TS i TSX zamienia na JS. Tylko te pliki przeglądarka może pobrać.
				</li>
				<li>Strony, sekcje i kod serwera nigdy nie wychodzą z serwera. Przeglądarka dostaje z nich tylko gotowy HTML.</li>
				<li>Gdy przychodzi zapytanie o stronę, serwer renderuje ją do HTML (Preact) wewnątrz szkieletu {tec`PageShell`} z {tec`web/page-shell.tsx`}.</li>
				<li>W nagłówku strony są: CSS strony w {tec`<style>`}, plik {tec`/styles.css`}, mapa importów i skrypt {tec`/web/client.ts`}.</li>
				<li>W przeglądarce {tec`client.ts`} szuka elementów {tec`data-island`} i ożywia (hydratuje) wyspy. Reszta strony zostaje zwykłym HTML.</li>
			</ol>
			<P noindent>
				Kolejność obsługi adresu: najpierw strona, potem kod dla przeglądarki, potem plik statyczny z {tec`site/static/`}. Gdy nic nie pasuje, serwer pokazuje stronę 404.
			</P>
		</>
	);
}

function DwaObszary() {
	return (
		<>
			<Rozdzial>DWA OBSZARY</Rozdzial>
			<Table cols={powtorz( 2, "max" )} rows={powtorz( 2, "auto" )} gapX="0.5rem" gapY="0.5rem">
				<Box start={[ 1, 1 ]} headerShow="N" headerLabel={<>FRAMEWORK {tec`web/`}</>} headerDisplay="center">
					<ul>
						<li>Silnik strony: serwer, trasy, CSS, wyspy, eksport.</li>
						<li>Nie zawiera nic, co dotyczy tej konkretnej strony.</li>
						<li>Nie importuje plików z {tec`site/`}. Sam przegląda {tec`site/`} i z tego buduje stronę.</li>
						<li>
							Udostępnia stronie ogólne narzędzia, np. {tec`web/island.ts`} (oznaczanie wysp) i {tec`web/heading-anchors.ts`} (kotwice nagłówków).
						</li>
					</ul>
				</Box>
				<Box start={[ 2, 1 ]} headerShow="N" headerLabel={<>STRONA {tec`site/`}</>} headerDisplay="center">
					<ul>
						<li>Treść i klocki tej strony.</li>
						<li>Każdy folder ma jedno ściśle określone zadanie (rozdział FOLDERY STRONY).</li>
						<li>O roli pliku decyduje folder i przyrostek nazwy, np. {tec`.widget.tsx`}.</li>
					</ul>
				</Box>
				<Row row={2} headerShow="N" headerLabel={<>KONFIGURACJA {tec`deno.json`} i {tec`ende.json`}</>} headerDisplay="center">
					<ul>
						<li>Dwa prawie identyczne pliki: {tec`deno.json`} dla Deno, {tec`ende.json`} dla Ende.</li>
						<li>
							Jedyna obecna różnica to import {tec`@transpilacja`}: w Deno wskazuje {tec`web/transpile.ts`}, w Ende — {tec`web/transpile-ende.ts`}.
						</li>
						<li>Są w nich: zależności ({tec`imports`}), polecenia ({tec`tasks`}), ustawienia TypeScript i formatowania.</li>
						<li>Folder {tec`_to_delete/`} jest wyłączony ({tec`exclude`}).</li>
					</ul>
				</Row>
			</Table>
		</>
	);
}

function PlikiFrameworka() {
	return (
		<>
			<Rozdzial>PLIKI FRAMEWORKA</Rozdzial>
			<P noindent>Każdy plik w {tec`web/`} robi jedną rzecz:</P>
			<ul>
				<li>{tec`main.tsx`} — serwer. Znajduje strony, składa ich CSS, podaje kod dla przeglądarki, pliki statyczne i stronę 404.</li>
				<li>{tec`page-shell.tsx`} — szkielet każdej strony: {tec`<html>`}, {tec`<head>`}, {tec`<body>`}.</li>
				<li>{tec`page-shell.css`} — styl bazowy każdej strony.</li>
				<li>{tec`island.ts`} — funkcja {tec`island(…)`}, która oznacza komponent jako wyspę.</li>
				<li>{tec`client.ts`} — jedyny skrypt startowy przeglądarki. Ożywia wyspy.</li>
				<li>{tec`transpile.ts`} — zamienia TS i TSX na JS dla przeglądarki. Tylko dla Deno ({tec`@deno/loader`}).</li>
				<li>{tec`transpile-ende.ts`} — to samo dla Ende, przez natywny TypeScript ({tec`tsgo`}).</li>
				<li>{tec`style.ts`} — składa CSS strony w warstwy.</li>
				<li>{tec`importmap.ts`} — mapa importów dla przeglądarki, zbudowana z adresów w {tec`deno.json`}.</li>
				<li>{tec`staticfiles.ts`} — podaje pliki z {tec`site/static/`}.</li>
				<li>{tec`refresh.ts`} — samoczynne przeładowanie strony po restarcie serwera.</li>
				<li>{tec`listwy.ts`} — mierzy przyklejone listwy (górną i dolną).</li>
				<li>{tec`heading-anchors.ts`} — unikalne kotwice {tec`#id`} nagłówków.</li>
				<li>{tec`404.tsx`} — strona 404 z mapą wszystkich stron.</li>
				<li>{tec`gh-pages.ts`} — eksport całej strony do plików statycznych w {tec`dist/`}, np. dla GitHub Pages.</li>
			</ul>
		</>
	);
}

function FolderyStrony() {
	return (
		<>
			<Rozdzial>FOLDERY STRONY</Rozdzial>
			<Table cols={powtorz( 2, "max" )} rows={powtorz( 4, "auto" )} gapX="0.5rem" gapY="0.5rem">
				<Box start={[ 1, 1 ]} headerShow="N" headerLabel={<>STRONY {tec`site/routes/`}</>}>
					<ul>
						<li>Pliki: {tec`index.tsx`} i opcjonalnie {tec`index.css`} obok.</li>
						<li>Każdy folder z {tec`index.tsx`} to jedna strona. Ścieżka folderu to adres strony.</li>
						<li>{tec`index.css`} działa tylko na tę jedną stronę.</li>
					</ul>
				</Box>
				<Box start={[ 2, 1 ]} headerShow="N" headerLabel={<>SEKCJE {tec`site/layout/`}</>}>
					<ul>
						<li>Pliki: {tec`<Nazwa>.section.tsx`} albo {tec`<Nazwa>.sections.tsx`}, obok opcjonalnie CSS o tej samej nazwie.</li>
						<li>Gotowe fragmenty stron, wypełnione treścią. Można je pisać w {tec`index.tsx`}, ale osobno jest czytelniej.</li>
						<li>Sekcja może składać się z wielu funkcji wewnętrznych.</li>
						<li>Bez reeksportów.</li>
					</ul>
				</Box>
				<Box start={[ 1, 2 ]} headerShow="N" headerLabel={<>WIDGETY {tec`site/widget/`}</>}>
					<ul>
						<li>Pliki: {tec`<Nazwa>.widget.tsx`} albo {tec`<Nazwa>.widgets.tsx`}, obok opcjonalnie CSS.</li>
						<li>Klocki budulcowe: tabela, akapit, tytuł, listwy. Wszystkie oprócz wysp.</li>
						<li>Zagnieżdżają się jak matrioszki: widget może używać innych widgetów.</li>
						<li>Dane dostają z miejsca użycia. Wyjątkiem są stałe, podstawowe słowa.</li>
						<li>Wszystkie są zebrane w beczce {tec`_ANY.ts`}.</li>
					</ul>
				</Box>
				<Box start={[ 2, 2 ]} headerShow="N" headerLabel={<>RENDERY {tec`site/screen/`}</>}>
					<ul>
						<li>Pliki główne leżą na górze folderu: {tec`<Nazwa>.render.tsx`}, obok opcjonalnie CSS.</li>
						<li>Zamieniają dane albo model języka (LOCI, DOTX) na HTML, SVG albo Canvas.</li>
						<li>Części renderu są w podfolderze tematu, małymi literami: {tec`loci/`}, {tec`dotx/`}.</li>
						<li>Inny kod importuje render przez plik główny, nie przez jego części.</li>
					</ul>
				</Box>
				<Box start={[ 1, 3 ]} headerShow="N" headerLabel={<>WYSPY {tec`site/client/`}</>}>
					<ul>
						<li>Pliki: {tec`<Nazwa>.island.tsx`}, obok opcjonalnie CSS.</li>
						<li>Kod, który działa w przeglądarce (hydracja).</li>
						<li>{tec`hooks/`} — hooki Preact dla wysp, np. {tec`pan-zoom.ts`}.</li>
						<li>{tec`registries/`} — rejestry elementów SVG i Canvas, które może pokazać {tec`VectorViewport`}.</li>
						<li>Bez reeksportów.</li>
					</ul>
				</Box>
				<Box start={[ 2, 3 ]} headerShow="N" headerLabel={<>SILNIK {tec`site/common/`}</>}>
					<ul>
						<li>Tylko czysty TypeScript: pliki {tec`.ts`}, bez {tec`.tsx`} i bez importów z {tec`preact`}.</li>
						<li>Nie importuje z innych folderów {tec`site/`}. Może go używać każdy plik w {tec`site/`}.</li>
						<li>
							{tec`css/`} (np. {tec`cx.ts`}), {tec`util/`}, {tec`lang/`} (definicje języków LOCI i DOTX), {tec`drafts/`} (szkice).
						</li>
						<li>Język w {tec`lang/`} nic nie wie o SVG, Canvas ani HTML. Rysowanie należy do {tec`site/screen/`}.</li>
						<li>Tu reeksporty są dozwolone.</li>
					</ul>
				</Box>
				<Box start={[ 1, 4 ]} headerShow="N" headerLabel={<>PLIKI STATYCZNE {tec`site/static/`}</>}>
					<ul>
						<li>Tylko pliki statyczne: ikona, obrazy, {tec`styles.css`}. Bez kodu.</li>
						<li>Adres pliku to jego ścieżka w tym folderze: {tec`site/static/logo.svg`} → {tec`/logo.svg`}.</li>
					</ul>
				</Box>
				<Box start={[ 2, 4 ]} headerShow="N" headerLabel={<>SZKICE {tec`site/drafts/`}</>}>
					<ul>
						<li>Szkice i eksperymenty dotyczące strony.</li>
						<li>Szkice czystego TypeScript są w {tec`site/common/drafts/`}.</li>
					</ul>
				</Box>
			</Table>
			<P>
				Nowy folder w {tec`site/`}{" "}
				można dodać, gdy ma własne zadanie, którego nie pokrywa żaden istniejący folder. Jego nazwa ma dokładnie 6 liter, a rozszerzenie Material Icon Theme w VS Code koloruje go
				bez dodatkowych ustawień.
			</P>
		</>
	);
}

function NazwyPlikow() {
	return (
		<>
			<Rozdzial>NAZWY PLIKÓW</Rozdzial>
			<ul>
				<li>
					<strong>Przyrostek decyduje o roli.</strong> Plik bez {tec`.widget.tsx`} nie jest widgetem. Plik bez {tec`.island.tsx`}{" "}
					nie jest wyspą. Framework rozpoznaje pliki tylko po tych dokładnych przyrostkach.
				</li>
				<li>
					<strong>Komponenty</strong> (widgety, rendery, wyspy, sekcje) mają nazwy PascalCase, np. {tec`Table.widget.tsx`}, {tec`Loci.render.tsx`}.
				</li>
				<li>
					<strong>Elementy języka</strong> w {tec`site/common/lang/`}: nazwa języka wielkimi literami, potem nazwa elementu od wielkiej litery, np. {tec`LOCIBodyElement.ts`}{" "}
					(jeden znacznik) i {tec`LOCIPointAttributes.ts`} (grupa atrybutów wspólna dla kilku znaczników).
				</li>
				<li>
					<strong>Pozostałe pliki</strong> (części, pomocnicze, rejestry) mają nazwy małymi literami, z łącznikiem, np. {tec`render-svg.tsx`}, {tec`pan-zoom.ts`}.
				</li>
				<li>
					<strong>Pliki w {tec`web/`}</strong> mają nazwy małymi literami, po angielsku, z łącznikiem.
				</li>
				<li>
					<strong>Beczka</strong> {tec`_ANY.ts`} ma podkreślnik na początku, żeby stała na górze listy plików.
				</li>
				<li>
					<strong>Nagłówek.</strong> Każdy plik zaczyna się nagłówkiem {tec`@project-metadata`}: ścieżka ({tec`Path`}), autor, repozytorium. Uzupełnia go skrypt{" "}
					{tec`inject-metadata.ps1`}.
				</li>
			</ul>
		</>
	);
}

function StronyIAdresy() {
	return (
		<>
			<Rozdzial>STRONY I ADRESY</Rozdzial>
			<P noindent>Adres strony wynika z miejsca pliku {tec`index.tsx`} w {tec`site/routes/`}:</P>
			<ul>
				<li>{tec`site/routes/index.tsx`} → {tec`/`}</li>
				<li>{tec`site/routes/o-dokumentacji/index.tsx`} → {tec`/o-dokumentacji`} (oraz {tec`/o-dokumentacji/`})</li>
				<li>{tec`site/routes/lang/loci/sandbox/index.tsx`} → {tec`/lang/loci/sandbox`}</li>
			</ul>
			<ul>
				<li>Folder bez {tec`index.tsx`} jest tylko członem adresu, np. {tec`site/routes/lang/`}.</li>
				<li>Nowa strona = nowy folder z {tec`index.tsx`}. Serwer szuka stron przy starcie; {tec`czytaj-pisz`} restartuje go po każdej zmianie.</li>
				<li>Domyślny eksport {tec`index.tsx`} to komponent strony. Bez niego serwer nie wystartuje.</li>
				<li>Strona może wyeksportować {tec`tytul`} — to tytuł karty przeglądarki. Domyślnie „LEKTURA”.</li>
				<li>Strona 404 powstaje sama. Pokazuje adres, którego nie ma, i mapę wszystkich stron z ich plikami.</li>
			</ul>
			<P noindent>Najmniejsza strona:</P>
			{tecs( "tsx" )`
// site/routes/przyklad/index.tsx  →  adres /przyklad
import { P, Title } from "@/site/widget/_ANY.ts";

export const tytul = "PRZYKŁAD";

export default function WebPage() {
	return (
		<main class="page">
			<Title level="h1">Przykład</Title>
			<P>Treść strony.</P>
		</main>
	);
}
`}
		</>
	);
}

function Style() {
	return (
		<>
			<Rozdzial>STYLE (CSS)</Rozdzial>
			<ul>
				<li>
					<strong>Plik-rodzeństwo.</strong> CSS komponentu ma tę samą nazwę co jego {tec`.tsx`}, z tym samym przyrostkiem; różni się tylko rozszerzeniem: {tec`Table.widget.tsx`} →
					{" "}
					{tec`Table.widget.css`}. Nie trzeba go nigdzie importować.
				</li>
				<li>
					<strong>Tylko to, czego strona używa.</strong> CSS komponentu trafia na stronę tylko wtedy, gdy jego {tec`.tsx`} jest w grafie importów jej {tec`index.tsx`}{" "}
					(także pośrednio, przez sekcje). Strona bez tabeli nie dostaje CSS tabeli. {tec`import type`} się nie liczy.
				</li>
				<li>
					<strong>Beczka po nazwach.</strong> Gdy strona importuje z {tec`_ANY.ts`} tylko {tec`P`} i{" "}
					{tec`Title`}, dostaje CSS tylko akapitu i tytułu, a nie wszystkich widgetów z beczki.
				</li>
				<li>
					<strong>Warstwy</strong>, od najsłabszej: {tec`shell`} ({tec`web/page-shell.css`}), {tec`widget`} (widgety, wyspy, rendery), {tec`layout`} (sekcje), {tec`route`}{" "}
					({tec`index.css`} strony). Późniejsza warstwa wygrywa bez względu na siłę selektora. Styl strony zawsze nadpisze styl sekcji, sekcja — komponentu, a komponent — bazę.
				</li>
				<li>
					<strong>{tec`site/static/styles.css`}</strong> jest poza warstwami, więc wygrywa ze wszystkimi. To miejsce na ręczne poprawki.
				</li>
				<li>
					<strong>{tec`index.css`}</strong> działa tylko na swoją stronę. Podstrony go nie dziedziczą.
				</li>
				<li>CSS strony trafia do {tec`<style>`} w jej HTML, a nie do osobnego pliku.</li>
				<li>Pusty plik CSS może czekać na przyszłe style.</li>
				<li>CSS bez pliku {tec`.tsx`} o tej samej nazwie nie trafi na żadną stronę. Serwer ostrzega o nim przy starcie.</li>
			</ul>
		</>
	);
}

function KtoKogoUzywa() {
	return (
		<>
			<Rozdzial>KTO MOŻE UŻYWAĆ KOGO</Rozdzial>
			<ul>
				<li>Widgety mogą być użyte w stronach, sekcjach, wyspach i w innych widgetach.</li>
				<li>Rendery mogą być użyte w stronach, sekcjach i wyspach. Render może użyć innego renderu, ale nie jest to zalecane.</li>
				<li>Wyspy mogą być użyte w stronach i sekcjach.</li>
				<li>Sekcje mogą być użyte w stronach. Sekcja nie powinna używać innej sekcji (odradzane, nie zakazane).</li>
				<li>{tec`site/common/`} i narzędzia z {tec`web/`} (np. {tec`web/island.ts`}) mogą być użyte wszędzie w {tec`site/`}.</li>
			</ul>
			<P noindent>Reeksporty są dozwolone tylko w trzech miejscach:</P>
			<ul>
				<li>{tec`site/widget/_ANY.ts`} — wszystkie widgety;</li>
				<li>{tec`site/screen/_ANY.ts`} — rendery;</li>
				<li>{tec`site/common/`} — moduły czystego TypeScript mogą reeksportować się nawzajem.</li>
			</ul>
		</>
	);
}

function Wyspy() {
	return (
		<>
			<Rozdzial>WYSPY</Rozdzial>
			<P>
				Wyspa to komponent, który działa w przeglądarce, np. przesuwanie i powiększanie rysunku. Reszta strony to statyczny HTML z serwera. Dzięki temu przeglądarka pobiera tylko
				kod wysp.
			</P>
			<ul>
				<li>
					Plik {tec`site/client/<Nazwa>.island.tsx`}. Domyślny eksport to {tec`island( import.meta.url, Komponent )`} z {tec`web/island.ts`}.
				</li>
				<li>
					Na serwerze wyspa renderuje się w {tec`<div data-island="…" data-props="…">`}. W przeglądarce {tec`client.ts`} importuje plik wyspy i ją ożywia.
				</li>
				<li>Atrybuty wyspy przechodzą do przeglądarki jako JSON: liczby, teksty, tablice, obiekty. Funkcje i JSX w atrybutach nie przejdą.</li>
				<li>
					Takie wejście zamienia na serwerze trzeci argument: {tec`island( url, Komponent, prepare )`}. Uwaga: plik z {tec`prepare`} też trafia do przeglądarki.
				</li>
				<li>
					{tec`children`} wyspy serwer renderuje do HTML. W przeglądarce zostają statycznym HTML i wyspa ich nie przerysowuje. Wyspa zagnieżdżona w środku ożywa sama.
				</li>
				<li>
					<strong>Wszystko, co wyspa importuje, idzie do przeglądarki.</strong> Dlatego wyspa importuje pliki wprost, nie przez{" "}
					{tec`_ANY.ts`}. Inaczej serwer nie wystartuje i pokaże błąd.
				</li>
				<li>
					Przykład: {tec`VectorViewport.island.tsx`}. Strona wybiera, co pokazuje: {tec`<VectorViewport renderer="SVG" sourceFormat="LOCI">`}.
				</li>
			</ul>
			<P noindent>Najmniejsza wyspa i jej użycie:</P>
			{tecs( "tsx" )`
// site/client/Licznik.island.tsx
import { useState } from "preact/hooks";
import { island } from "@/web/island.ts";

export default island( import.meta.url, function Licznik( { start }: { start: number } ) {
	const [ n, ustaw ] = useState( start );
	return <button onClick={() => ustaw( n + 1 )}>{n}</button>;
} );

// w stronie albo sekcji
import Licznik from "@/site/client/Licznik.island.tsx";
<Licznik start={0} />
`}
		</>
	);
}

function Zaleznosci() {
	return (
		<>
			<Rozdzial>ZALEŻNOŚCI</Rozdzial>
			<ul>
				<li>Bez Node.js, bez npm, bez folderu {tec`node_modules`}.</li>
				<li>
					Zależności są w {tec`deno.json`}, w polu {tec`imports`}: z {tec`jsr:`} albo z {tec`https://esm.sh/`}. Skrót {tec`@/`} to katalog projektu.
				</li>
				<li>
					Przeglądarka dostaje mapę importów z tymi samymi adresami. Serwer i przeglądarka używają więc tych samych wersji, a wersję zmienia się w jednym miejscu.
				</li>
				<li>
					Kod przeglądarki może używać tylko pakietów z listy w {tec`web/importmap.ts`} (dziś: {tec`preact`}, {tec`@preact/signals`}, {tec`highlight.js`}) i tylko z adresów{" "}
					{tec`https://`}. Przeglądarka nie rozumie {tec`jsr:`}.
				</li>
			</ul>
		</>
	);
}

function Polecenia() {
	return (
		<>
			<Rozdzial>POLECENIA</Rozdzial>
			<ul>
				<li>{tec( "bash" )`deno task czytaj`} — serwer.</li>
				<li>
					{tec( "bash" )`deno task czytaj-pisz`} — serwer do pisania: restartuje się po zmianie w {tec`site/`} lub {tec`web/`}, a otwarta strona sama się przeładowuje.
				</li>
				<li>{tec( "bash" )`deno task ghpages`} — eksport do {tec`dist/`} dla strony pod adresem głównym {tec`/`}.</li>
				<li>
					{tec( "bash" )`BAZA=/dot-gener/ deno task ghpages`} — eksport dla{" "}
					{tec`https://j-cis.github.io/dot-gener/`}. Adresy dostają przedrostek, a moduły przeglądarki są zapisane jako {tec`*.ts.js`}, bo GitHub Pages podaje pliki {tec`.ts`}{" "}
					jako wideo.
				</li>
				<li>{tec( "bash" )`deno task sprawdz-lekture`} — sprawdzenie typów w {tec`web/`} i {tec`site/`}.</li>
				<li>{tec( "bash" )`deno task check`} — formatowanie, lint i typy naraz.</li>
			</ul>
		</>
	);
}

function Dodatki() {
	return (
		<>
			<Rozdzial>DODATKI</Rozdzial>
			<ul>
				<li>
					<strong>Listwy.</strong> Element z {tec`data-listwa="gora"`} albo {tec`data-listwa="dol"`} (np. {tec`GuideBar`},{" "}
					{tec`FootBar`}) jest mierzony w przeglądarce. Jego wysokość trafia do zmiennych CSS {tec`--listwa-gora`} i {tec`--listwa-dol`}. Z nich {tec`Table`} liczy wiersze{" "}
					{tec`fill1`}, {tec`fill2`} …: wysokość ekranu między listwami.
				</li>
				<li>
					<strong>Kotwice nagłówków.</strong> {tec`Title`} dostaje {tec`id`} z prefiksu i tekstu, np. {tec`#wstęp`}. Powtórzone {tec`id`} dostaje sufiks {tec`-1`}, {tec`-2`}{" "}
					… (jak w markdown). Po najechaniu na nagłówek pojawia się link {tec`#`}. Własne {tec`id`} można podać atrybutem.
				</li>
			</ul>
		</>
	);
}
