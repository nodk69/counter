/**
 * Language Switcher — globe icon dropdown in the header.
 *
 * Phase 1: English only. All other languages show "Coming soon" badges.
 * When a language becomes `available: true` in config/languages.ts,
 * this component will automatically show a working switch button.
 */
import { useState, useRef, useEffect } from 'react';
import { Globe, Check, Clock } from 'lucide-react';
import { LANGUAGES, AVAILABLE_LANGUAGES, getLanguage } from '@/config/languages';
import i18n from '@/i18n';

function useCurrentLang() {
  const [lang, setLang] = useState(i18n.language ?? 'en');
  useEffect(() => {
    const handler = (l: string) => setLang(l);
    i18n.on('languageChanged', handler);
    return () => { i18n.off('languageChanged', handler); };
  }, []);
  return lang;
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentLang = useCurrentLang();
  const current = getLanguage(currentLang.split('-')[0]);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  function switchLang(code: string) {
    const lang = getLanguage(code);
    if (!lang.available) return;
    i18n.changeLanguage(code);
    localStorage.setItem('counter-lang', code);
    document.documentElement.lang = code;
    document.documentElement.dir = lang.dir;
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={`Language: ${current.name}. Click to switch language`}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <Globe className="w-4 h-4" aria-hidden />
        <span className="hidden sm:inline text-xs font-medium uppercase tracking-wide">
          {current.code}
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto"
        >
          <p className="px-4 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Language
          </p>

          {/* Available languages */}
          {AVAILABLE_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === current.code}
              onClick={() => switchLang(lang.code)}
              className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium text-foreground">{lang.nativeName}</span>
                <span className="text-muted-foreground text-xs">{lang.name}</span>
              </span>
              {lang.code === current.code && (
                <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden />
              )}
            </button>
          ))}

          {/* Coming soon divider */}
          <div className="my-1.5 mx-4 border-t border-border" />
          <p className="px-4 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3" aria-hidden />
            Coming soon
          </p>

          {LANGUAGES.filter(l => !l.available).map(lang => (
            <div
              key={lang.code}
              aria-disabled="true"
              className="flex items-center justify-between px-4 py-2 text-sm opacity-50 cursor-not-allowed select-none"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium text-foreground">{lang.nativeName}</span>
                <span className="text-muted-foreground text-xs">{lang.name}</span>
              </span>
            </div>
          ))}

          <div className="mx-4 mt-2 mb-1 pt-2 border-t border-border">
            <a
              href="/about"
              className="text-xs text-primary hover:underline"
              onClick={() => setOpen(false)}
            >
              Help translate counter.io →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
