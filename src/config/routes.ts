/**
 * Single source of truth for all route slugs.
 * Import from here — never hardcode slug arrays in components.
 *
 * Blog and guide slugs are derived from their data files
 * so they can never drift out of sync.
 */

import { BLOG_POSTS } from '../data/blog';
import { GUIDES } from '../data/guides';

/** 20 individual tool slugs (must match src/data/tools.ts) */
export const TOOL_SLUGS = [
  'word-counter', 'character-counter', 'sentence-counter', 'paragraph-counter',
  'readability-checker', 'keyword-density-checker', 'syllable-counter',
  'reading-time-calculator', 'speaking-time-calculator', 'unique-word-counter',
  'line-counter', 'page-counter', 'letter-counter', 'word-frequency-counter',
  'character-frequency-counter', 'sentence-length-analyzer', 'paragraph-length-analyzer',
  'complexity-analyzer', 'word-density-analyzer', 'text-summarizer',
] as const;

/** Programmatic: words-to-pages pages */
export const WORDS_TO_PAGES_SLUGS = [
  '100-words-is-how-many-pages', '250-words-is-how-many-pages',
  '500-words-is-how-many-pages', '750-words-is-how-many-pages',
  '1000-words-is-how-many-pages', '1500-words-is-how-many-pages',
  '2000-words-is-how-many-pages', '2500-words-is-how-many-pages',
  '3000-words-is-how-many-pages', '4000-words-is-how-many-pages',
  '5000-words-is-how-many-pages', '7500-words-is-how-many-pages',
  '10000-words-is-how-many-pages',
] as const;

/** Programmatic: speech word count pages */
export const SPEECH_SLUGS = [
  '5-minute-speech-word-count',  '10-minute-speech-word-count',
  '15-minute-speech-word-count', '20-minute-speech-word-count',
  '30-minute-speech-word-count', '45-minute-speech-word-count',
  '60-minute-speech-word-count', '90-minute-speech-word-count',
] as const;

/** Programmatic: social media character limit pages */
export const SOCIAL_SLUGS = [
  'twitter-character-limit', 'instagram-character-limit', 'facebook-character-limit',
  'linkedin-character-limit', 'youtube-description-limit', 'tiktok-character-limit',
  'meta-description-limit', 'seo-title-tag-limit',
] as const;

/** Audience-specific landing pages */
export const LANDING_SLUGS = [
  'word-counter-for-students',  'word-counter-for-essay',    'word-counter-for-book-writing',
  'word-counter-for-seo',       'word-counter-for-bloggers', 'word-counter-for-writers',
  'word-counter-for-copywriters','word-counter-for-social-media',
  'word-counter-for-academics', 'word-counter-for-professionals',
] as const;

/** Tool comparison pages */
export const COMPARISON_SLUGS = [
  'word-counter-vs-character-counter', 'reading-time-vs-speaking-time',
  'flesch-score-vs-fk-grade',          'word-counter-vs-sentence-counter',
  'paragraph-counter-vs-line-counter',
] as const;

/** Blog post slugs — derived from src/data/blog.ts */
export const BLOG_SLUGS = BLOG_POSTS.map(p => p.slug);

/** Guide slugs — derived from src/data/guides.ts */
export const GUIDE_SLUGS = GUIDES.map(g => g.slug);

/** Static page paths for sitemap and SEO */
export const STATIC_PATHS = [
  '/', '/tools', '/blog', '/guides', '/about',
  '/resources', '/contact', '/privacy', '/terms',
  '/meta-description-generator',
] as const;
