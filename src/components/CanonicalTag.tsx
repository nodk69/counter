/**
 * CanonicalTag — injects <link rel="canonical"> into <head> for every page.
 *
 * Mounted once in App.tsx via GlobalMeta so it automatically updates on
 * every route change without touching individual page components.
 *
 * The canonical URL is always the root-language (English) path:
 *   https://counter.io/word-counter
 *
 * When translated pages ship (e.g. /es/word-counter), they will each render
 * their own canonical pointing to their own URL — the English canonical
 * stays as-is here.
 */
import { useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site';

interface Props {
  /** Path relative to site root, e.g. "/word-counter" or "/" */
  path: string;
}

export default function CanonicalTag({ path }: Props) {
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}${path === '/' ? '' : path}` || baseUrl;

  useEffect(() => {
    let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.rel = 'canonical';
      document.head.appendChild(el);
    }
    el.href = canonicalUrl;
  }, [canonicalUrl]);

  return null;
}
