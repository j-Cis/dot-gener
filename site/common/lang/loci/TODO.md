<!--
  @project-metadata
  Path: site/common/lang/loci/TODO.md
  Author: Jan Roman Cisowski
  ORCID: https://orcid.org/0009-0009-2907-3792
  Repository: https://github.com/j-Cis/dot-gener
-->

# LOCI — plan pracy

Odhaczaj: `- [ ]` → `- [x]`.

## 1. Zrobione

- [x] `body` — klocek główny; tylko on ustala wygląd elementów konstrukcyjnych.
- [x] `p` — punkt konstrukcyjny: `xy`, biegunowo (`r` + `deg` / `rad` / `turn`); postać `fn` + `at` czeka na liczenie wyrażeń.
- [x] `csax`, `csbi` — nazwy układów (dawniej `ax`, `bi`); `csax0` to układ podstawowy z `body`.
- [x] `fn`, `var` — definicje (wyrażenia zapisane, jeszcze nie liczone).
- [x] Podział: `lang/loci` = znaczniki, atrybuty, funkcje pomocnicze; interpreter i render w `site/screen/loci/`.
- [x] `id` w postaci „znacznik + numer”, alias `as`, licznik `lociId()`; kontrola w interpreterze.
- [x] `v` — łamana przez n punktów (`element/curve/`): `p`, `px`+`py`, `pxy`, `pr`+`pa`, `pr`+`pdeg`/`prad`/`pturn`, `in`; `cycle`, `surface`; `lineWidth`, `lineColor`,
      `lineStyle`.

## 2. Teraz: oś i półoś — znacznik `ax`

Ustalone:

- Jeden znacznik `ax`; półoś to jego wariant.
- `at` — element ma swój wyróżniony punkt w tym miejscu (początek półosi; tylko istniejący punkt `p`).
- `thru` — przechodzi przez istniejące punkty.
- Punkt wpisany ręcznie: `pxy="3,4"` albo `pr` z kątem `deg` / `rad` / `turn`.
- Półoś: `at="p1" thru="p2"`, `at="p1"` + punkt ręczny albo `at="p1"` + kąt.
- Oś: `thru="p1,p2"` albo `thru="p1"` + kąt.
- Kąt: `deg` / `rad` / `turn`.
- Wygląd: jak każdy element DATUM — z `body`, tak jak półosie układu `csax0`.

Do zrobienia:

- [ ] `lang/loci/element/datum/LOCIAxElement.ts` — atrybuty i znacznik.
- [ ] `ax` w `tags.ts`, w `lociId()` (`id.ax()`) i w kontroli postaci `id`.
- [ ] Interpreter: `site/screen/loci/interpreter/ax.ts`.
- [ ] Render SVG i Canvas.
- [ ] Wpis w `ARCHITECTURE.md`.

## 3. Wartości położenia i kąty

- [ ] Omówić i przenieść do osobnego pliku.

## 4. Plan na LOCI (niewiążący — plan działania, nic ostatecznego)

Elementy:

- [ ] Krzywe.
- [ ] Krzywe: splajny itp.
- [ ] Okręgi, elipsy, elipsoidy, koniki itp.
- [ ] Sekwencje i figury równoboczne.
- [ ] Pomoce: symetralne (osie — już je mamy) i wiele innych.

Następnie grupowanie:

- [ ] Grupowanie — rozważane `g` albo `body` wewnętrzne. Każdy taki element pozwala ustalić coś tylko w swoim zasięgu, dlatego w tym zasięgu można też dostosować elementy
      konstrukcyjne.
- [ ] Układy odniesienia i punkty konstrukcyjne grupy — dwie opcje do wyboru:
  - [ ] nie będzie do nich dostępu z zewnątrz;
  - [ ] dostęp z zewnątrz przez przestrzeń nazw danej grupy / body.
- [ ] Różnica względem globalnego `body`: jak w SVG `g` — przesunięcia, obroty itp. oraz grupowe ustawienia wyglądu.

To zamyka pracę nad minimum LOCI, by móc użyć LOCI do swoich potrzeb, a potem kiedyś go rozbudować.

## 5. Decyzje przed krzywymi

1. [ ] **Znaczniki:** jeden ogólny znacznik krzywej z atrybutem rodzaju czy osobny znacznik na rodzaj (łuk, Bézier, B-spline …).
2. [ ] **Konstrukcja czy obiekt:** czy krzywa jest elementem konstrukcyjnym (bez wyglądu, wygląd z `body`), rysowanym obiektem (własny wygląd), czy jednym i drugim. Rysowane
       obiekty to nowy temat: skąd biorą wygląd.
3. [ ] **Sposób zadania:** przez punkty, przez które przechodzi (interpolacja), przez punkty kontrolne (przybliżenie), czy parametrycznie przez `fn`.
4. [ ] **Rodzaje splajnów w minimum:** Bézier (stopień 2, 3, n), B-spline, NURBS (wagi), Catmull-Rom, sześcienny naturalny.
5. [ ] **Ciągłość na złączach odcinków:** C0 / C1 / C2 albo G1 / G2 — czy i jak ją zapisywać.
6. [ ] **Otwarta czy zamknięta;** kierunek obiegu (przeciwnie do wskazówek zegara, jak kąty).
7. [ ] **Parametr krzywej:** zakres (np. 0 … 1) czy długość łuku. Potrzebny do punktu na krzywej (`p` z `at`), stycznej i normalnej.
8. [ ] **Punkty krzywej:** tylko istniejące `p` (`thru`) czy także ręczne (`pxy`).
9. [ ] **Folder w `element/`:** nowy folder na krzywe i jego nazwa.
10. [ ] **Render:** SVG rysuje wprost tylko łuki i Bézier stopnia 2 i 3; inne krzywe trzeba przybliżać. Tolerancja przybliżenia: w px ekranu czy w jednostkach rysunku.
11. [ ] **Okrąg, elipsa, stożkowe — sposoby zadania:** okrąg: środek + promień, środek + punkt, 3 punkty; elipsa: środek + półosie + kąt albo ogniska; stożkowe ogólnie: 5 punktów
        albo mimośród.
12. [ ] **Punkty charakterystyczne:** przecięcia krzywych, styczne z punktu — liczone numerycznie; potrzebna tolerancja i zasada, gdy rozwiązań jest kilka albo brak.
13. [ ] **Obszar rysunku** liczony także z krzywych.
