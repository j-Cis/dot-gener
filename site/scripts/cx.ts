/** Joins class names, skipping empty / undefined ones. */
export const cx = (...names: (string | false | null | undefined)[]): string => names.filter(Boolean).join(" ");
