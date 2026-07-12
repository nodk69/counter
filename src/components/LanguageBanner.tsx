/**
 * Language detection banner.
 *
 * Shows once when the browser's preferred language is not English,
 * informing the user that translations are coming.
 * Dismissed state is stored in localStorage so it never shows again.
 *
 * When a language becomes available (available: true in config/languages.ts),
 * this component can be updated to offer a real "Switch" button.
 */
import { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { LANGUAGES } from '@/config/languages';

const STORAGE_KEY = 'counter-lang-banner-v1';

function detectBrowserLang(): string {
  if (typeof navigator === 'undefined') return 'en';
  return (
    navigator.languages?.[0] ??
    navigator.language ??
    'en'
  ).split('-')[0].toLowerCase();
}

export default function LanguageBanner() {
  const [show,     setShow]     = useState(false);
  const [langInfo, setLangInfo] = useState<{ nativeName: string; name: string } | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const code = detectBrowserLang();
    if (code === 'en') return;
    const found = LANGUAGES.find(l => l.code === code);
    if (found) {
      setLangInfo({ nativeName: found.nativeName, name: found.name });
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  };

  if (!show || !langInfo) return null;

  return (
    <div
      role="banner"
      aria-label="Language availability notice"
      className="bg-primary/8 border-b border-primary/20 py-2 px-4"
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm font-sans text-foreground">
          <Globe className="w-4 h-4 text-primary flex-shrink-0" aria-hidden />
          <p>
            Your browser is set to{' '}
            <strong>{langInfo.nativeName} ({langInfo.name})</strong>.{' '}
            We're working on {langInfo.name} translations —{' '}
            <a href="/about" className="text-primary underline hover:no-underline">
              learn more
            </a>.
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss language notice"
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
