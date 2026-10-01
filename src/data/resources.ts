/*
 * RESOURCES DATA REGISTRY
 * =======================
 * Categorized resources, guides, legal pages, and tools for counter.io.
 */

export type ResourceCategory = 'learn' | 'templates' | 'company' | 'legal';

export interface ResourceItem {
  slug: string;
  name: string;
  href: string;
  shortDesc: string;
  category: ResourceCategory;
  featured?: boolean;
}

export interface ResourceCategoryMeta {
  label: string;
  shortLabel: string;
  description: string;
}

export const RESOURCE_CATEGORIES: Record<ResourceCategory, ResourceCategoryMeta> = {
  learn: {
    label: 'Learn & Guides',
    shortLabel: 'Learn',
    description: 'Articles, writing tutorials, and actionable SEO guides',
  },
  templates: {
    label: 'Templates & Tools',
    shortLabel: 'Templates',
    description: 'Ready-to-use writing formats, checklists, and calculators',
  },
  company: {
    label: 'Company & Support',
    shortLabel: 'Company',
    description: 'Our privacy mission, roadmap, and contact channels',
  },
  legal: {
    label: 'Legal & Trust',
    shortLabel: 'Legal',
    description: 'Terms of service, privacy practices, and compliance',
  },
};

export const RESOURCES: ResourceItem[] = [
  // Learn & Guides
  {
    slug: 'blog',
    name: 'Writing & SEO Blog',
    href: '/blog',
    shortDesc: 'Readability benchmarks, SEO tips & word count guides',
    category: 'learn',
    featured: true,
  },
  {
    slug: 'guides',
    name: 'In-Depth Guides',
    href: '/guides',
    shortDesc: 'Complete walkthroughs for essays, novels & SEO copy',
    category: 'learn',
    featured: true,
  },
  {
    slug: 'cheatsheets',
    name: 'Character Limit Sheets',
    href: '/resources',
    shortDesc: 'Quick reference for social media & SERP length targets',
    category: 'learn',
  },
  {
    slug: 'faq',
    name: 'Frequently Asked Questions',
    href: '/about',
    shortDesc: 'How our client-side counting algorithms work',
    category: 'learn',
  },

  // Templates & Tools
  {
    slug: 'templates',
    name: 'Writing Templates',
    href: '/resources',
    shortDesc: 'Structured outlines for essays, blogs & manuscripts',
    category: 'templates',
    featured: true,
  },
  {
    slug: 'checklists',
    name: 'Editing Checklists',
    href: '/resources',
    shortDesc: 'Step-by-step proofreading and readability checks',
    category: 'templates',
  },
  {
    slug: 'calculators',
    name: 'Time Calculators',
    href: '/resources',
    shortDesc: 'Speaking pace and reading time formulas',
    category: 'templates',
  },
  {
    slug: 'meta-description-generator',
    name: 'Meta Description Generator',
    href: '/meta-description-generator',
    shortDesc: 'Optimize SERP pixel width and character length',
    category: 'templates',
    featured: true,
  },

  // Company & Support
  {
    slug: 'about',
    name: 'About counter.io',
    href: '/about',
    shortDesc: 'Our privacy-first mission and client-side design',
    category: 'company',
  },
  {
    slug: 'contact',
    name: 'Contact & Feedback',
    href: '/contact',
    shortDesc: 'Reach our team for feature requests and inquiries',
    category: 'company',
  },
  {
    slug: 'support',
    name: 'Help & Documentation',
    href: '/guides',
    shortDesc: 'Troubleshooting offline mode and keyboard shortcuts',
    category: 'company',
  },
  {
    slug: 'changelog',
    name: 'Product Updates',
    href: '/blog',
    shortDesc: 'Latest features, algorithms, and tool releases',
    category: 'company',
  },

  // Legal & Trust
  {
    slug: 'privacy',
    name: 'Privacy Policy',
    href: '/privacy',
    shortDesc: 'Zero server storage guarantee and local execution',
    category: 'legal',
  },
  {
    slug: 'terms',
    name: 'Terms of Service',
    href: '/terms',
    shortDesc: 'Fair usage guidelines and open accessibility',
    category: 'legal',
  },
  {
    slug: 'sitemap',
    name: 'Complete Sitemap',
    href: '/tools',
    shortDesc: 'Index of all 20+ writing tools and content pages',
    category: 'legal',
  },
];

export function getResourcesByCategory(category: ResourceCategory): ResourceItem[] {
  return RESOURCES.filter(r => r.category === category);
}

export function getFeaturedResources(): ResourceItem[] {
  return RESOURCES.filter(r => r.featured);
}

export function getResourceBySlug(slug: string): ResourceItem | undefined {
  return RESOURCES.find(r => r.slug === slug);
}
