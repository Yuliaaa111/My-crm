// Intl separates thousands with a non-breaking space (U+00A0) or a narrow
// one (U+202F); comparing with plain spaces keeps expectations readable.
export const normalizeSpaces = (text: string): string =>
  text.replace(/[\u00a0\u202f]/g, " ");
