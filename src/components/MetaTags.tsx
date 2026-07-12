/**
 * MetaTags — manages all <head> meta tags for a page.
 *
 * Updates: document.title, description, og:*, twitter:* on every mount/change.
 * Works alongside CanonicalTag and HreflangTags (both mounted in GlobalMeta).
 *
 * Usage:
 *   <MetaTags
 *     title="Word Counter — Free Online Tool | counter.io"
 *     description="The most accurate free online word counter…"
 *   />
 *
 *   // Article page:
 *   <MetaTags
 *     title={post.title}
 *     description={post.excerpt}
 *     type="article"
 *     publishedTime={post.date}
 *     author={post.author}
 *   />
 */
import { useEffect } from 'react';
import { SITE_CONFIG } from '@/config/site';

export interface MetaTagsProps {
  title: string;
  description: string;
  /** Absolute URL for og:image. Defaults to SITE_CONFIG.ogImage. */
  image?: string;
  /** og:type. Defaults to "website". */
  type?: 'website' | 'article';
  /** ISO date string for article:published_time */
  publishedTime?: string;
  /** Article author name */
  author?: string;
  /** twitter:card style. Defaults to "summary_large_image". */
  twitterCard?: 'summary' | 'summary_large_image';
}

/** Find or create a <meta> element by attribute selector. */
function upsertMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    // Set the identifying attribute (property or name)
    if (selector.includes('property=')) {
      el.setAttribute('property', attr);
    } else {
      el.setAttribute('name', attr);
    }
    document.head.appendChild(el);
  }
  el.content = value;
}

export default function MetaTags({
  title,
  description,
  image,
  type = 'website',
  publishedTime,
  author,
  twitterCard = 'summary_large_image',
}: MetaTagsProps) {
  const ogImage  = image ?? SITE_CONFIG.ogImage;
  const fullTitle = title.includes('counter.io') ? title : `${title} | counter.io`;

  useEffect(() => {
    // Page title
    document.title = fullTitle;

    // Basic
    upsertMeta('meta[name="description"]',      'description',      description);

    // Open Graph
    upsertMeta('meta[property="og:title"]',       'og:title',       fullTitle);
    upsertMeta('meta[property="og:description"]', 'og:description', description);
    upsertMeta('meta[property="og:type"]',        'og:type',        type);
    upsertMeta('meta[property="og:image"]',       'og:image',       ogImage);
    upsertMeta('meta[property="og:site_name"]',   'og:site_name',   SITE_CONFIG.name);
    upsertMeta('meta[property="og:locale"]',      'og:locale',      SITE_CONFIG.locale);

    if (type === 'article' && publishedTime) {
      upsertMeta('meta[property="article:published_time"]', 'article:published_time', publishedTime);
    }
    if (type === 'article' && author) {
      upsertMeta('meta[property="article:author"]', 'article:author', author);
    }

    // Twitter / X
    upsertMeta('meta[name="twitter:card"]',        'twitter:card',        twitterCard);
    upsertMeta('meta[name="twitter:title"]',       'twitter:title',       fullTitle);
    upsertMeta('meta[name="twitter:description"]', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]',       'twitter:image',       ogImage);
    upsertMeta('meta[name="twitter:site"]',        'twitter:site',        SITE_CONFIG.twitterHandle);
  }, [fullTitle, description, ogImage, type, publishedTime, author, twitterCard]);

  return null;
}
