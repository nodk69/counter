/**
 * HreflangTags — injects <link rel="alternate" hreflang> into <head>.
 *
 * Phase 1: English only. Outputs hreflang="en" + hreflang="x-default"
 * pointing to the current canonical URL.
 *
 * When a new language becomes available, add it to AVAILABLE_LANGUAGES
 * in config/languages.ts and pass `alternates` with the translated URL.
 *
 * Usage:
 *   <HreflangTags path="/word-counter" />
 *   <HreflangTags path="/blog/how-to-write-seo-content" />
 *
 * Phase 2 usage (future):
 *   <HreflangTags
 *     path="/word-counter"
 *     alternates={{ es: '/es/word-counter', hi: '/hi/word-counter' }}
 *   />
 */
import { useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { AVAILABLE_LANGUAGES } from '@/config/languages';

interface Props {
  /** Path relative to site root, e.g. "/word-counter" or "/" */
  path: string;
  /**
   * Override alternate URLs per language code.
   * Defaults to `/{langCode}{path}` for non-English languages.
   * For English, always uses `{path}` (root, no lang prefix).
   */
  alternates?: Record<string, string>;
}

function makeHref(baseUrl: string, langCode: string, path: string, alternates?: Record<string, string>): string {
  if (alternates?.[langCode]) return `${baseUrl}${alternates[langCode]}`;
  if (langCode === 'en') return `${baseUrl}${path}`;
  return `${baseUrl}/${langCode}${path}`;
}

export default function HreflangTags({ path, alternates }: Props) {
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}${path}`;

  useEffect(() => {
    // Remove any previously injected hreflang tags managed by this component
    document.querySelectorAll('link[data-hreflang]').forEach(el => el.remove());

    const tags: HTMLLinkElement[] = [];

    // One tag per available language
    AVAILABLE_LANGUAGES.forEach(lang => {
      const el = document.createElement('link');
      el.rel = 'alternate';
      el.hreflang = lang.hreflang;
      el.href = makeHref(baseUrl, lang.code, path, alternates);
      el.setAttribute('data-hreflang', lang.code);
      document.head.appendChild(el);
      tags.push(el);
    });

    // x-default always points to the English (root) URL
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = canonicalUrl;
    xDefault.setAttribute('data-hreflang', 'x-default');
    document.head.appendChild(xDefault);
    tags.push(xDefault);

    return () => {
      tags.forEach(el => el.remove());
    };
  }, [path, baseUrl, canonicalUrl, alternates]);

  return null;
}
