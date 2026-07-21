import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { SITE_CONFIG } from '../src/config/site';
import { BLOG_POSTS } from '../src/data/blog';
import { GUIDES } from '../src/data/guides';
import { TOOLS } from '../src/data/tools';
import {
  SOCIAL_MEDIA_LIMITS,
  LANDING_PAGES,
  COMPARISON_PAGES,
} from '../src/data/seoData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'dist/public');

const SITE_URL = SITE_CONFIG.url.replace(/\/$/, '');
const SITE_NAME = SITE_CONFIG.name;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface PageMeta {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  schemas?: object[];
}

function processPage(template: string, pageMeta: PageMeta): string {
  const fullTitle = pageMeta.title.includes(SITE_NAME) ? pageMeta.title : `${pageMeta.title} | ${SITE_NAME}`;
  const desc = pageMeta.description;
  const canonicalUrl = pageMeta.url;
  const ogImage = `${SITE_URL}/og-default.png`;
  const pageType = pageMeta.type || 'website';

  let html = template;

  // 1. Replace title tag
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);

  // 2. Replace basic description
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, `<meta name="description" content="${escapeHtml(desc)}" />`);

  // 3. Replace Open Graph tags
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/, `<meta property="og:description" content="${escapeHtml(desc)}" />`);
  html = html.replace(/<meta\s+property="og:type"\s+content=".*?"\s*\/?>/, `<meta property="og:type" content="${pageType}" />`);
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/, `<meta property="og:image" content="${ogImage}" />`);

  // 4. Replace Twitter tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/, `<meta name="twitter:description" content="${escapeHtml(desc)}" />`);
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/, `<meta name="twitter:image" content="${ogImage}" />`);

  // 5. Injections (Canonical link, Hreflang alternates, Article properties, JSON-LD Schema)
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
  const hreflangTags = `
    <link rel="alternate" hreflang="en" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />
  `;

  let articleMeta = '';
  if (pageType === 'article') {
    if (pageMeta.publishedTime) {
      articleMeta += `\n    <meta property="article:published_time" content="${pageMeta.publishedTime}" />`;
    }
    if (pageMeta.author) {
      articleMeta += `\n    <meta property="article:author" content="${pageMeta.author}" />`;
    }
  }

  let schemaTags = '';
  if (pageMeta.schemas) {
    for (const schema of pageMeta.schemas) {
      schemaTags += `\n    <script type="application/ld+json">${JSON.stringify(schema)}</script>`;
    }
  }

  const injections = `\n    ${canonicalTag}${hreflangTags}${articleMeta}${schemaTags}\n  </head>`;
  html = html.replace('</head>', injections);

  return html;
}

async function run() {
  console.log('Starting pure static HTML pre-rendering injection (Serverless-compatible)...');

  // Read sitemap to get all routes dynamically
  const sitemapPath = path.join(OUT_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error(`Sitemap not found at ${sitemapPath}. Build must run first.`);
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  const locs = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
  const paths = locs.map(loc => {
    const urlString = loc.replace('<loc>', '').replace('</loc>', '').trim();
    return new URL(urlString).pathname;
  });

  // Read the built index.html as our blank template
  const templatePath = path.join(OUT_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Index template not found at ${templatePath}. Build must run first.`);
  }

  const cleanTemplate = fs.readFileSync(templatePath, 'utf8');

  console.log(`Found ${paths.length} routes in sitemap to pre-render.`);

  for (const routePath of paths) {
    const canonicalUrl = `${SITE_URL}${routePath}`;
    let pageMeta: PageMeta | null = null;

    // A. Match specific statically mapped paths
    if (routePath === '/') {
      pageMeta = {
        title: 'Free Word Counter Online — Count Words, Characters & More',
        description: SITE_CONFIG.description,
        url: canonicalUrl,
        schemas: [
          {
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
          },
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Word Counter Pro',
            applicationCategory: 'WritingApplication',
            operatingSystem: 'Web Browser',
            url: SITE_URL,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: 'Professional writing platform with real-time word count, content scoring, readability analysis, and PDF report export.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/favicon.svg`,
          }
        ]
      };
    } else if (routePath === '/tools') {
      pageMeta = {
        title: 'All Writing & Text Analysis Tools',
        description: 'Explore our collection of 20+ free writing, counting, readability, and content analysis tools designed for bloggers, students, and SEO writers.',
        url: canonicalUrl,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: canonicalUrl },
            ]
          }
        ]
      };
    } else if (routePath === '/blog') {
      pageMeta = {
        title: 'Writing & SEO Blog — Tips, Guides & Industry Insights',
        description: 'Read the latest articles on writing productivity, content marketing, SEO length guidelines, readability, and word count rules for college and business.',
        url: canonicalUrl,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalUrl },
            ]
          }
        ]
      };
    } else if (routePath === '/guides') {
      pageMeta = {
        title: 'Step-by-Step Writing Guides & Tutorials',
        description: 'Master content formatting, readability optimization, keyword placement, and export workflows with our free writing guides.',
        url: canonicalUrl,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Guides', item: canonicalUrl },
            ]
          }
        ]
      };
    } else if (routePath === '/about') {
      pageMeta = {
        title: 'About counter.io — Privacy-First Writing Workbench',
        description: 'Learn about the mission behind counter.io: a free, open, offline-first writing workspace that keeps your text 100% private in your browser.',
        url: canonicalUrl,
      };
    } else if (routePath === '/contact') {
      pageMeta = {
        title: 'Contact Us — counter.io Support',
        description: 'Get in touch with the counter.io team for feature requests, bug reports, partnerships, or support.',
        url: canonicalUrl,
      };
    } else if (routePath === '/privacy') {
      pageMeta = {
        title: 'Privacy Policy — Your Text Is 100% Private',
        description: 'Read our privacy policy. counter.io operates entirely client-side; we never store, transmit, or read any text you write in the editor.',
        url: canonicalUrl,
      };
    } else if (routePath === '/terms') {
      pageMeta = {
        title: 'Terms of Service',
        description: 'Review the terms of service for counter.io. Free to use for personal, educational, and commercial writing tasks.',
        url: canonicalUrl,
      };
    } else if (routePath === '/resources') {
      pageMeta = {
        title: 'Writing Resources, Templates & Calculators',
        description: 'Access free download sheets, writing templates, checklists, and calculators to improve your content creation speed.',
        url: canonicalUrl,
      };
    } else if (routePath === '/meta-description-generator') {
      pageMeta = {
        title: 'Free AI Meta Description Generator',
        description: 'Generate search-optimized meta descriptions in seconds with our free AI tool. Hit the 160-character limit perfectly.',
        url: canonicalUrl,
      };
    }

    // B. Match dynamic blog posts
    if (!pageMeta && routePath.startsWith('/blog/')) {
      const slug = routePath.replace('/blog/', '');
      const post = BLOG_POSTS.find(p => p.slug === slug);
      if (post) {
        pageMeta = {
          title: post.title,
          description: post.excerpt,
          url: canonicalUrl,
          type: 'article',
          publishedTime: new Date(post.date).toISOString(),
          author: post.author,
          schemas: [
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              author: { '@type': 'Person', name: post.author },
              publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
                logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` }
              },
              datePublished: new Date(post.date).toISOString(),
              dateModified: new Date(post.date).toISOString(),
              url: canonicalUrl,
              mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
              description: post.excerpt,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
                { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
              ]
            }
          ]
        };
      }
    }

    // C. Match dynamic guides
    if (!pageMeta && routePath.startsWith('/guides/')) {
      const slug = routePath.replace('/guides/', '');
      const guide = GUIDES.find(g => g.slug === slug);
      if (guide) {
        pageMeta = {
          title: guide.title,
          description: guide.excerpt,
          url: canonicalUrl,
          type: 'article',
          schemas: [
            {
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: guide.title,
              description: guide.excerpt,
              step: guide.steps.map((s, idx) => ({
                '@type': 'HowToStep',
                position: idx + 1,
                name: s.title,
                itemListElement: [{ '@type': 'HowToDirection', position: 1, text: s.content }]
              }))
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
                { '@type': 'ListItem', position: 3, name: guide.title, item: canonicalUrl },
              ]
            }
          ]
        };
      }
    }

    // D. Match tools
    if (!pageMeta) {
      const slug = routePath.substring(1);
      const tool = TOOLS.find(t => t.slug === slug);
      if (tool) {
        const schemas: object[] = [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.name,
            applicationCategory: 'WritingApplication',
            operatingSystem: 'Web Browser',
            url: canonicalUrl,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description: tool.description,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
              { '@type': 'ListItem', position: 3, name: tool.name, item: canonicalUrl },
            ]
          }
        ];
        if (tool.faqs && tool.faqs.length > 0) {
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer }
            }))
          });
        }

        pageMeta = {
          title: tool.name.includes('Counter') || tool.name.includes('Checker') || tool.name.includes('Calculator') || tool.name.includes('Analyzer')
            ? `${tool.name}`
            : `${tool.name} Character & Word Counter`,
          description: tool.description,
          url: canonicalUrl,
          schemas
        };
      }
    }

    // E. Match social limits
    if (!pageMeta) {
      const slug = routePath.substring(1);
      const limit = SOCIAL_MEDIA_LIMITS.find(l => l.slug === slug);
      if (limit) {
        pageMeta = {
          title: `${limit.platform} Character & Word Count Limit`,
          description: `Check the character limit guidelines for ${limit.platform}. Learn optimal post sizes and formatting tips for ${limit.platform} content in 2026.`,
          url: canonicalUrl
        };
      }
    }

    // F. Match landing pages
    if (!pageMeta) {
      const slug = routePath.substring(1);
      const landing = LANDING_PAGES[slug];
      if (landing) {
        pageMeta = {
          title: landing.title,
          description: `Use counter.io's writing workbench customized for ${landing.audience}. Real-time statistics, readability checks, and goals.`,
          url: canonicalUrl
        };
      }
    }

    // G. Match comparisons
    if (!pageMeta) {
      const slug = routePath.substring(1);
      const comparison = COMPARISON_PAGES[slug];
      if (comparison) {
        pageMeta = {
          title: `${comparison.title} — Key Differences & Tool Guide`,
          description: comparison.intro,
          url: canonicalUrl
        };
      }
    }

    // H. Match Words to Pages conversions
    if (!pageMeta) {
      const match = routePath.match(/^\/(\d+)-words-is-how-many-pages$/);
      if (match) {
        const words = match[1];
        pageMeta = {
          title: `${words} Words is How Many Pages? (Single & Double Spaced)`,
          description: `How many pages is ${words} words? Find the exact page conversion for ${words} words for both single and double spaced formats.`,
          url: canonicalUrl
        };
      }
    }

    // I. Match Speech word counts
    if (!pageMeta) {
      const match = routePath.match(/^\/(\d+)-minute-speech-word-count$/);
      if (match) {
        const minutes = match[1];
        pageMeta = {
          title: `${minutes} Minute Speech Word Count (Speaking Time Guide)`,
          description: `How many words is a ${minutes} minute speech? Calculate the word count for a ${minutes}-minute talk at average, slow, and fast speaking rates.`,
          url: canonicalUrl
        };
      }
    }

    // If we matched the page metadata, perform injection and save
    if (pageMeta) {
      const outputHtml = processPage(cleanTemplate, pageMeta);
      
      const relativePath = routePath === '/' ? 'index.html' : path.join(routePath.substring(1), 'index.html');
      const targetFilePath = path.join(OUT_DIR, relativePath);

      fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
      fs.writeFileSync(targetFilePath, outputHtml, 'utf8');
      console.log(`✓ Pre-rendered: ${routePath} -> ${targetFilePath}`);
    } else {
      console.warn(`⚠️ Warning: Route match not found for ${routePath}`);
    }
  }

  console.log('Pure static HTML pre-rendering injection complete!');
  process.exit(0);
}

run().catch(err => {
  console.error('Fatal error during pre-rendering:', err);
  process.exit(1);
});
