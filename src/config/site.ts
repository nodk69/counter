/** Single source of truth for site-level constants.
 *
 * This file is consumed in two contexts:
 *   1. Node.js  — vite.config.ts (sitemap / feed generation)
 *   2. Browser  — Vite-bundled React components
 *
 * So we probe both `process.env` (Node) and `import.meta.env` (Vite browser).
 */
function resolveSiteUrl(): string {
  // Node.js context (vite.config.ts, SSG, scripts)
  if (typeof process !== 'undefined' && process.env?.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL;
  }
  // Browser / Vite-bundled context
  try {
    const env = (import.meta as Record<string, any>).env;
    if (env?.VITE_SITE_URL) return env.VITE_SITE_URL;
  } catch { /* not a Vite bundle */ }
  return 'https://counterio.vercel.app';
}

// Build-time assertion that fails the build if VITE_SITE_URL is unset in production.
if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env?.NODE_ENV === 'production' && !process.env?.VITE_SITE_URL) {
  throw new Error('Build-time assertion failed: VITE_SITE_URL is unset. This environment variable is required in production.');
}

const siteUrl = resolveSiteUrl();

export const SITE_CONFIG = {
  name:           'counter.io',
  url:            siteUrl,
  tagline:        'Write Better. Count Everything.',
  description:    'Free online word counter with 20+ writing tools. Real-time stats, readability analysis, and SEO optimization — all free, all private.',
  twitterHandle:  '@counterio',
  ogImage:        `${siteUrl}/og-default.png`,
  defaultLang:    'en',
  locale:         'en_US',
  themeColor:     '#b94040',
} as const;
