/**
 * Sitemap URL generator — multi-language-ready.
 *
 * Phase 1: English only. Generates a flat list of all canonical URLs.
 *
 * Phase 2+: When a language is marked `available: true` in
 * config/languages.ts, call `generateMultiLangUrls()` to get the full
 * hreflang URL set for every route.
 *
 * This file is used by any server-side or build-time sitemap generator.
 * In a Vite/SPA setup, import and log the output to generate sitemap.xml.
 *
 * Usage (generate sitemap):
 *   import { generateSitemapUrls } from '@/utils/sitemap';
 *   const urls = generateSitemapUrls();
 *   // Write to sitemap.xml
 */

import { SITE_CONFIG } from '@/config/site';
import { AVAILABLE_LANGUAGES } from '@/config/languages';
import {
  TOOL_SLUGS,
  WORDS_TO_PAGES_SLUGS,
  SPEECH_SLUGS,
  SOCIAL_SLUGS,
  LANDING_SLUGS,
  COMPARISON_SLUGS,
  BLOG_SLUGS,
  GUIDE_SLUGS,
  STATIC_PATHS,
} from '@/config/routes';

const BASE_URL = SITE_CONFIG.url.replace(/\/$/, '');

export interface SitemapUrl {
  /** Canonical URL */
  loc: string;
  /** ISO date string, e.g. "2026-07-10" */
  lastmod?: string;
  /** 0.0 – 1.0 */
  priority: number;
  /** "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" */
  changefreq: string;
  /** hreflang alternates: { [hreflang]: url } */
  alternates?: Record<string, string>;
}

/** All English paths in priority order */
function getAllPaths(): Array<{ path: string; priority: number; changefreq: string }> {
  const today = new Date().toISOString().split('T')[0];
  const entries: Array<{ path: string; priority: number; changefreq: string }> = [];

  // Static pages
  const staticPriorities: Record<string, number> = {
    '/': 1.0,
    '/tools': 0.9,
    '/blog': 0.8,
    '/guides': 0.8,
    '/about': 0.6,
    '/resources': 0.7,
    '/contact': 0.5,
    '/privacy': 0.3,
    '/terms': 0.3,
    '/meta-description-generator': 0.85,
  };
  for (const path of STATIC_PATHS) {
    entries.push({
      path,
      priority: staticPriorities[path] ?? 0.6,
      changefreq: path === '/' ? 'daily' : 'weekly',
    });
  }

  // Tool pages
  for (const slug of TOOL_SLUGS) {
    entries.push({ path: `/${slug}`, priority: 0.85, changefreq: 'monthly' });
  }

  // Programmatic pages
  for (const slug of WORDS_TO_PAGES_SLUGS) {
    entries.push({ path: `/${slug}`, priority: 0.7, changefreq: 'yearly' });
  }
  for (const slug of SPEECH_SLUGS) {
    entries.push({ path: `/${slug}`, priority: 0.7, changefreq: 'yearly' });
  }
  for (const slug of SOCIAL_SLUGS) {
    entries.push({ path: `/${slug}`, priority: 0.7, changefreq: 'monthly' });
  }
  for (const slug of LANDING_SLUGS) {
    entries.push({ path: `/${slug}`, priority: 0.75, changefreq: 'monthly' });
  }
  for (const slug of COMPARISON_SLUGS) {
    entries.push({ path: `/${slug}`, priority: 0.65, changefreq: 'monthly' });
  }

  // Blog posts
  for (const slug of BLOG_SLUGS) {
    entries.push({ path: `/blog/${slug}`, priority: 0.75, changefreq: 'monthly' });
  }

  // Guides
  for (const slug of GUIDE_SLUGS) {
    entries.push({ path: `/guides/${slug}`, priority: 0.7, changefreq: 'monthly' });
  }

  return entries;
}

/**
 * Generate hreflang alternates for a given path.
 *
 * Phase 1: Only English is available, so alternates contain just `en`
 * and `x-default`. When more languages become available, they will be
 * added automatically here.
 *
 * Convention:
 *   - English → BASE_URL + path  (no lang prefix, root canonical)
 *   - Other   → BASE_URL + /{langCode} + path
 */
function buildAlternates(path: string): Record<string, string> {
  const alts: Record<string, string> = {};
  for (const lang of AVAILABLE_LANGUAGES) {
    if (lang.code === 'en') {
      alts['en'] = `${BASE_URL}${path}`;
    } else {
      alts[lang.hreflang] = `${BASE_URL}/${lang.code}${path}`;
    }
  }
  alts['x-default'] = `${BASE_URL}${path}`;
  return alts;
}

/**
 * Returns all sitemap URLs for the current set of available languages.
 * Phase 1: English only — each URL has `en` + `x-default` alternates.
 */
export function generateSitemapUrls(): SitemapUrl[] {
  return getAllPaths().map(({ path, priority, changefreq }) => ({
    loc: `${BASE_URL}${path}`,
    lastmod: new Date().toISOString().split('T')[0],
    priority,
    changefreq,
    alternates: buildAlternates(path),
  }));
}

/**
 * Render a sitemap.xml string from all URLs.
 * Drop this into a build script or a Vite plugin to emit public/sitemap.xml.
 */
export function renderSitemapXml(): string {
  const urls = generateSitemapUrls();

  const urlEntries = urls.map(u => {
    const alts = Object.entries(u.alternates ?? {})
      .map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`)
      .join('\n');

    return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(2)}</priority>
${alts}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;
}

/**
 * Returns a plain array of all canonical URL strings.
 * Useful for quick audits or passing to a crawling tool.
 */
export function getAllCanonicalUrls(): string[] {
  return getAllPaths().map(({ path }) => `${BASE_URL}${path}`);
}
