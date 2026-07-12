import { BLOG_POSTS } from '@/data/blog';
import { TOOLS } from '@/data/tools';

const SITE_URL  = 'https://counter.io';
const SITE_NAME = 'counter.io';

type SchemaType = 'home' | 'tool' | 'article' | 'blog' | 'tools' | 'page';

interface Props {
  type: SchemaType;
  data?: {
    name?: string;
    description?: string;
    slug?: string;
    datePublished?: string;
    author?: string;
    faqItems?: Array<{ question: string; answer: string }>;
  };
}

function Script({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function SchemaMarkup({ type, data = {} }: Props) {
  if (type === 'home') {
    return (
      <>
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          description: 'Free online word counter with 20+ writing tools. Real-time stats, readability analysis, and SEO optimization — all free, all private.',
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/tools?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }} />
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Word Counter Pro',
          applicationCategory: 'WritingApplication',
          operatingSystem: 'Web Browser',
          url: SITE_URL,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description: 'Professional writing platform with real-time word count, content scoring, readability analysis, passive voice detection, filler word checker, vocabulary diversity, and PDF report export.',
          featureList: [
            'Real-time word & character count',
            'Content Score 0–100',
            'Readability checker (Flesch-Kincaid)',
            'Passive voice detector',
            'Filler word detector',
            'Vocabulary diversity analysis',
            'PDF + DOCX + JSON export',
            'Writing streak tracker',
            'Auto-save',
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '2847',
          },
        }} />
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.svg`,
        }} />
      </>
    );
  }

  if (type === 'tool' && data.name) {
    const schemas: object[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.name,
        applicationCategory: 'WritingApplication',
        operatingSystem: 'Web Browser',
        url: `${SITE_URL}/${data.slug || ''}`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: data.description || `Free online ${data.name.toLowerCase()}. Instant results, no signup required.`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
          { '@type': 'ListItem', position: 3, name: data.name, item: `${SITE_URL}/${data.slug || ''}` },
        ],
      },
    ];
    if (data.faqItems && data.faqItems.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqItems.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
    }
    return <>{schemas.map((s, i) => <Script key={i} schema={s} />)}</>;
  }

  if (type === 'tools') {
    return (
      <>
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Free Writing Tools — counter.io',
          description: 'Browse 20+ free online writing tools: word counter, readability checker, keyword density, reading time calculator, and more.',
          url: `${SITE_URL}/tools`,
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
          },
        }} />
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Writing Tools',
          description: 'Free online writing and text analysis tools.',
          url: `${SITE_URL}/tools`,
          numberOfItems: TOOLS.length,
          itemListElement: TOOLS.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.name,
            description: tool.shortDesc,
            url: `${SITE_URL}/tools/${tool.slug}`,
          })),
        }} />
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
          ],
        }} />
      </>
    );
  }

  if (type === 'blog') {
    const blogPosts = [...BLOG_POSTS]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return (
      <>
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${SITE_NAME} Writing Blog`,
          description: 'Expert writing tips, SEO content guides, and readability insights from the counter.io team.',
          url: `${SITE_URL}/blog`,
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
          },
          inLanguage: 'en',
          blogPost: blogPosts.map(post => ({
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            url: `${SITE_URL}/blog/${post.slug}`,
            datePublished: new Date(post.date).toISOString(),
            author: { '@type': 'Person', name: post.author },
            keywords: post.tags?.join(', ') || post.category,
          })),
        }} />
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          ],
        }} />
      </>
    );
  }

  if (type === 'article' && data.name) {
    return (
      <>
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.name,
          author: { '@type': 'Person', name: data.author || 'counter.io Editorial Team' },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
          },
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified:  data.datePublished || new Date().toISOString(),
          url: `${SITE_URL}/blog/${data.slug || ''}`,
          mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${data.slug || ''}` },
          description: data.description || '',
        }} />
        <Script schema={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
            { '@type': 'ListItem', position: 3, name: data.name, item: `${SITE_URL}/blog/${data.slug || ''}` },
          ],
        }} />
      </>
    );
  }

  return (
    <Script schema={{
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: data.name || SITE_NAME,
      url: `${SITE_URL}/${data.slug || ''}`,
      description: data.description || '',
    }} />
  );
}
