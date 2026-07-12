/**
 * Pure schema generator functions (no React dependency).
 * Returns plain objects that can be passed to <SchemaMarkup> or
 * serialized for future server-side rendering.
 */
import { SITE_CONFIG } from '@/config/site';

const { url: SITE_URL, name: SITE_NAME, ogImage: LOGO } = SITE_CONFIG;

// ─── Types ───────────────────────────────────────────────────────────────────

export type Schema = Record<string, unknown>;

// ─── Core schemas ────────────────────────────────────────────────────────────

export function websiteSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/tools?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema(): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    sameAs: [],
  };
}

export function softwareAppSchema(opts: {
  name: string;
  url: string;
  description: string;
  features?: string[];
  rating?: { value: number; count: number };
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    applicationCategory: 'WritingApplication',
    operatingSystem: 'Web Browser',
    url: opts.url,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: opts.description,
    ...(opts.features ? { featureList: opts.features } : {}),
    ...(opts.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: opts.rating.value,
        reviewCount: opts.rating.count,
      },
    } : {}),
  };
}

export function articleSchema(opts: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  imageUrl?: string;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    author: { '@type': 'Person', name: opts.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    url: `${SITE_URL}/blog/${opts.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${opts.slug}` },
    ...(opts.imageUrl ? { image: opts.imageUrl } : {}),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function howToSchema(opts: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
