import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import type { ServerResponse } from 'node:http';

import { SITE_CONFIG }    from './src/config/site.ts';
import { LANGUAGES }      from './src/config/languages.ts';
import {
  TOOL_SLUGS, WORDS_TO_PAGES_SLUGS, SPEECH_SLUGS, SOCIAL_SLUGS,
  LANDING_SLUGS, COMPARISON_SLUGS, BLOG_SLUGS, GUIDE_SLUGS, STATIC_PATHS,
} from './src/config/routes.ts';
import { BLOG_POSTS } from './src/data/blog.ts';

// ---------------------------------------------------------------------------
// ✅ Environment Configuration - FIXED
// ---------------------------------------------------------------------------

/**
 * Get the site URL based on environment
 * - Development: http://localhost:5173 (or custom port)
 * - Production: From VITE_SITE_URL environment variable
 */
function getSiteUrl(): string {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  
  // Check if VITE_SITE_URL is set
  const customUrl = process.env.VITE_SITE_URL;
  
  // Development fallback - allow building without VITE_SITE_URL
  if (isDev && !customUrl) {
    const devPort = process.env.PORT || '5173';
    console.log(`⚠️  VITE_SITE_URL not set, using http://localhost:${devPort} for development`);
    return `http://localhost:${devPort}`;
  }
  
  // Production requires the variable
  if (isProd && !customUrl) {
    throw new Error(
      '❌ Build-time assertion failed: VITE_SITE_URL is unset.\n' +
      '   This environment variable is required in production.\n' +
      '   Create a .env file with: VITE_SITE_URL=https://yourdomain.com'
    );
  }
  
  // Use custom URL if provided (works for both dev and prod)
  if (customUrl) {
    return customUrl;
  }
  
  // Final fallback for when NODE_ENV is not set (e.g., just running vite build)
  if (!customUrl) {
    console.warn('⚠️  NODE_ENV not set and VITE_SITE_URL not set, using http://localhost:5173');
    return 'http://localhost:5173';
  }
  
  return 'http://localhost:5173';
}

// Override SITE_CONFIG.url with environment value
const BASE_URL = getSiteUrl().replace(/\/$/, '');

// ---------------------------------------------------------------------------
// Sitemap helpers
// ---------------------------------------------------------------------------
const AVAILABLE = LANGUAGES.filter(l => l.available);

function buildAlternates(path: string): Record<string, string> {
  const alts: Record<string, string> = { 'x-default': `${BASE_URL}${path}` };
  for (const lang of AVAILABLE) {
    alts[lang.hreflang] = lang.code === 'en'
      ? `${BASE_URL}${path}`
      : `${BASE_URL}/${lang.code}${path}`;
  }
  return alts;
}

interface RouteEntry { path: string; priority: number; changefreq: string }

function getAllRoutes(): RouteEntry[] {
  const staticPriorities: Record<string, number> = {
    '/': 1.0, '/tools': 0.9, '/blog': 0.8, '/guides': 0.8,
    '/about': 0.6, '/resources': 0.7, '/contact': 0.5,
    '/privacy': 0.3, '/terms': 0.3,
    '/meta-description-generator': 0.85,
  };
  const entries: RouteEntry[] = [];

  for (const p of STATIC_PATHS) {
    entries.push({ path: p, priority: staticPriorities[p] ?? 0.6,
      changefreq: p === '/' ? 'daily' : 'weekly' });
  }
  for (const s of TOOL_SLUGS)          entries.push({ path: `/${s}`, priority: 0.85, changefreq: 'monthly' });
  for (const s of WORDS_TO_PAGES_SLUGS) entries.push({ path: `/${s}`, priority: 0.70, changefreq: 'yearly'  });
  for (const s of SPEECH_SLUGS)        entries.push({ path: `/${s}`, priority: 0.70, changefreq: 'yearly'  });
  for (const s of SOCIAL_SLUGS)        entries.push({ path: `/${s}`, priority: 0.70, changefreq: 'monthly' });
  for (const s of LANDING_SLUGS)       entries.push({ path: `/${s}`, priority: 0.75, changefreq: 'monthly' });
  for (const s of COMPARISON_SLUGS)    entries.push({ path: `/${s}`, priority: 0.65, changefreq: 'monthly' });
  for (const s of BLOG_SLUGS)          entries.push({ path: `/blog/${s}`, priority: 0.75, changefreq: 'monthly' });
  for (const s of GUIDE_SLUGS)         entries.push({ path: `/guides/${s}`, priority: 0.70, changefreq: 'monthly' });

  return entries;
}

function buildSitemapXml(): string {
  const today = new Date().toISOString().split('T')[0];
  const urlBlocks = getAllRoutes().map(({ path, priority, changefreq }) => {
    const alts = buildAlternates(path);
    const altTags = Object.entries(alts)
      .map(([hl, href]) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}"/>`)
      .join('\n');
    return `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(2)}</priority>
${altTags}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>`;
}

// ---------------------------------------------------------------------------
// RSS 2.0 feed
// ---------------------------------------------------------------------------
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildRssFeed(): string {
  const buildDate = new Date().toUTCString();

  const items = [...BLOG_POSTS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(post => {
      const url = `${BASE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(post.author)}</author>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)} — Writing Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_CONFIG.ogImage}</url>
      <title>${escapeXml(SITE_CONFIG.name)}</title>
      <link>${BASE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;
}

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
function buildRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# Block crawling of noisy query-string variants',
    'Disallow: /*?*',
    '',
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    `# RSS feed`,
    `# ${BASE_URL}/feed.xml`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Vite plugin
// ---------------------------------------------------------------------------
function sitemapPlugin(): Plugin {
  return {
    name: 'sitemap',

    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(buildSitemapXml());
      });

      server.middlewares.use('/robots.txt', (_req, res: ServerResponse) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(buildRobotsTxt());
      });

      server.middlewares.use('/feed.xml', (_req, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(buildRssFeed());
      });
    },

    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml() });
      this.emitFile({ type: 'asset', fileName: 'robots.txt',  source: buildRobotsTxt()  });
      this.emitFile({ type: 'asset', fileName: 'feed.xml',    source: buildRssFeed()    });
    },
  };
}

// ---------------------------------------------------------------------------
const rawPort = process.env.PORT ?? '5173';
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    sitemapPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});