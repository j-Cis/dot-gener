// @project-metadata
// Path: src/silnik-unikalnych-kluczy.ts
// Author: Jan Roman Cisowski
// ORCID: https://orcid.org/0009-0009-2907-3792
// Repository: https://github.com/j-Cis/dot-gener

export class SilnikUnikalnychKluczy<const T extends readonly string[]> {
  #pulaKluczy: Record<T[number], number>;

  constructor(klucze: T) {
    this.#pulaKluczy = Object.fromEntries(
      klucze.map((rodzaj) => [rodzaj, 0]),
    ) as Record<T[number], number>;
  }

  nadaj<K extends T[number]>(rodzaj: K): [K, number] {
    const ostatniKlucz = this.#pulaKluczy[rodzaj];

    this.#pulaKluczy[rodzaj] = ostatniKlucz + 1;

    return [rodzaj, ostatniKlucz + 1];
  }

  liczbaCyfr(): Record<T[number], number> {
    return Object.fromEntries(
      Object.entries(this.#pulaKluczy).map(([rodzaj, numer]) => [
        rodzaj,
        numer === 0 ? 0 : String(numer).length,
      ]),
    ) as Record<T[number], number>;
  }
}
