/**
 * useSEO — centralized SEO hook.
 *
 * Sets document.title and manages all <head> meta tags via DOM manipulation.
 * This works for SPAs without react-helmet; tags are upserted (never duplicated).
 *
 * Usage:
 *   useSEO({ title: 'Word Counter', description: '...' });
 */
import { useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site';
import { LANGUAGES } from '@/config/languages';

export interface SEOMeta {
  /** Page title (| counter.io suffix added automatically if missing) */
  title: string;
  /** Meta description — 150–160 chars for best results */
  description: string;
  /** Absolute canonical URL (defaults to current page URL) */
  canonical?: string;
  /** Open Graph type — default 'website' */
  ogType?: 'website' | 'article';
  /** OG image URL — defaults to SITE_CONFIG.ogImage */
  ogImage?: string;
  /** Set true for paginated/private pages */
  noindex?: boolean;
  /** Article-specific metadata */
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author: string;
    tags?: string[];
  };
  /** Override hreflang alternate URLs. By default only English is set. */
  hreflangs?: Array<{ lang: string; url: string }>;
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────

function upsertMeta(attr: string, key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, extra: Record<string, string> = {}) {
  const extras = Object.entries(extra)
    .map(([k, v]) => `[${k}="${v}"]`)
    .join('');
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${extras}`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.href = href;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  noindex = false,
  article,
  hreflangs,
}: SEOMeta) {
  const pageTitle = title.includes(SITE_CONFIG.name)
    ? title
    : `${title} | ${SITE_CONFIG.name}`;

  const pageUrl = canonical ?? (typeof window !== 'undefined'
    ? `${SITE_CONFIG.url}${window.location.pathname}`
    : SITE_CONFIG.url);

  const image = ogImage ?? SITE_CONFIG.ogImage;

  useEffect(() => {
    // Title
    document.title = pageTitle;

    // Standard meta
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');
    upsertMeta('name', 'language', 'en');
    upsertMeta('name', 'theme-color', SITE_CONFIG.themeColor);

    // Open Graph
    upsertMeta('property', 'og:title',       pageTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url',         pageUrl);
    upsertMeta('property', 'og:type',        ogType);
    upsertMeta('property', 'og:image',       image);
    upsertMeta('property', 'og:site_name',   SITE_CONFIG.name);
    upsertMeta('property', 'og:locale',      SITE_CONFIG.locale);

    // Twitter Card
    upsertMeta('name', 'twitter:card',        'summary_large_image');
    upsertMeta('name', 'twitter:title',       pageTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image',       image);
    if (SITE_CONFIG.twitterHandle) {
      upsertMeta('name', 'twitter:site', SITE_CONFIG.twitterHandle);
    }

    // Article-specific
    if (article) {
      upsertMeta('property', 'article:published_time', article.publishedTime);
      if (article.modifiedTime) {
        upsertMeta('property', 'article:modified_time', article.modifiedTime);
      }
      upsertMeta('property', 'article:author', article.author);
    }

    // Canonical
    upsertLink('canonical', pageUrl);

    // Hreflang alternates
    const alts = hreflangs ?? [{ lang: 'en', url: pageUrl }];
    alts.forEach(({ lang, url }) => {
      upsertLink('alternate', url, { hreflang: lang });
    });
    // x-default points to English
    const enAlt = alts.find(a => a.lang === 'en');
    if (enAlt) {
      upsertLink('alternate', enAlt.url, { hreflang: 'x-default' });
    }

    // Remove noindex if it was previously set
    if (!noindex) {
      const robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (robotsEl && robotsEl.content.includes('noindex')) {
        robotsEl.content = 'index,follow';
      }
    }
  }, [pageTitle, description, pageUrl, ogType, image, noindex, article, hreflangs]);
}

// ─── Utility: generate hreflang list for a given path ────────────────────────

/**
 * Generate hreflang entries for all available languages.
 * @param path  e.g. '/word-counter'
 */
export function buildHreflangs(path: string) {
  return LANGUAGES
    .filter(l => l.available)
    .map(l => ({
      lang: l.hreflang,
      url:  l.code === 'en'
        ? `${SITE_CONFIG.url}${path}`
        : `${SITE_CONFIG.url}/${l.code}${path}`,
    }));
}
