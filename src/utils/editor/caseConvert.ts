/**
 * Case conversion utilities for the editor.
 * Each function transforms text according to a specific casing rule.
 */

/** Convert text to UPPERCASE */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

/** Convert text to lowercase */
export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

/** Convert text to Title Case — capitalize first letter of each word */
export function toTitleCase(text: string): string {
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

/** Convert text to Sentence case — capitalize first letter after sentence-ending punctuation */
export function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
}

/** Toggle case — invert each character's case */
export function toToggleCase(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) return char.toLowerCase();
      return char.toUpperCase();
    })
    .join('');
}

export type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'toggle';

const CASE_CONVERTERS: Record<CaseType, (text: string) => string> = {
  upper: toUpperCase,
  lower: toLowerCase,
  title: toTitleCase,
  sentence: toSentenceCase,
  toggle: toToggleCase,
};

/** Convert text using a named case type */
export function convertCase(text: string, caseType: CaseType): string {
  return CASE_CONVERTERS[caseType](text);
}
