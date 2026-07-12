export interface Language {
  code:       string;
  name:       string;  // English name
  nativeName: string;  // Name in that language
  dir:        'ltr' | 'rtl';
  hreflang:   string;
  /** true once translations are live */
  available:  boolean;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English',            nativeName: 'English',    dir: 'ltr', hreflang: 'en',    available: true  },
  { code: 'es', name: 'Spanish',            nativeName: 'Español',    dir: 'ltr', hreflang: 'es',    available: false },
  { code: 'hi', name: 'Hindi',              nativeName: 'हिन्दी',      dir: 'ltr', hreflang: 'hi',    available: false },
  { code: 'fr', name: 'French',             nativeName: 'Français',   dir: 'ltr', hreflang: 'fr',    available: false },
  { code: 'de', name: 'German',             nativeName: 'Deutsch',    dir: 'ltr', hreflang: 'de',    available: false },
  { code: 'pt', name: 'Portuguese',         nativeName: 'Português',  dir: 'ltr', hreflang: 'pt',    available: false },
  { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文',        dir: 'ltr', hreflang: 'zh',    available: false },
  { code: 'ar', name: 'Arabic',             nativeName: 'العربية',    dir: 'rtl', hreflang: 'ar',    available: false },
  { code: 'ja', name: 'Japanese',           nativeName: '日本語',      dir: 'ltr', hreflang: 'ja',    available: false },
  { code: 'ko', name: 'Korean',             nativeName: '한국어',      dir: 'ltr', hreflang: 'ko',    available: false },
  { code: 'id', name: 'Indonesian',         nativeName: 'Bahasa',     dir: 'ltr', hreflang: 'id',    available: false },
  { code: 'tr', name: 'Turkish',            nativeName: 'Türkçe',     dir: 'ltr', hreflang: 'tr',    available: false },
  { code: 'ru', name: 'Russian',            nativeName: 'Русский',    dir: 'ltr', hreflang: 'ru',    available: false },
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];
export const AVAILABLE_LANGUAGES = LANGUAGES.filter(l => l.available);
export const COMING_SOON_LANGUAGES = LANGUAGES.filter(l => !l.available);

/** Get language by code, falls back to English. */
export function getLanguage(code: string): Language {
  return LANGUAGES.find(l => l.code === code) ?? DEFAULT_LANGUAGE;
}
