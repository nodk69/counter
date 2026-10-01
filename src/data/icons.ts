/*
 * CENTRAL LUCIDE ICON REGISTRY
 * =============================
 * Maps tool slugs and resource slugs to Lucide icon components.
 * Uses named imports to support optimal tree-shaking.
 */

import type { LucideIcon } from 'lucide-react';
import {
  // Counting tools
  Type,
  CaseSensitive,
  Pilcrow,
  AlignLeft,
  ListOrdered,
  FileText,
  Baseline,
  // Analysis tools
  BookOpenCheck,
  KeyRound,
  Sparkles,
  BarChart3,
  Activity,
  Ruler,
  AlignJustify,
  PieChart,
  Cpu,
  ScanText,
  Music,
  // Time & speech tools
  Clock,
  Mic,
  Timer,
  // Social & limit tools
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Video,
  // Converters & generators
  FileSpreadsheet,
  Wand2,
  // Resources & navigation
  Newspaper,
  BookOpen,
  Info,
  Mail,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  GitCommitHorizontal,
  Map,
  LifeBuoy,
  FileCode,
  CheckSquare,
  ClipboardList,
  Calculator,
  Compass,
  FolderKanban,
  Wrench,
} from 'lucide-react';

/**
 * Registry mapping tool slugs to Lucide icons
 */
export const TOOL_ICONS: Record<string, LucideIcon> = {
  // Counting
  'word-counter': Type,
  'character-counter': CaseSensitive,
  'sentence-counter': Pilcrow,
  'paragraph-counter': AlignLeft,
  'line-counter': ListOrdered,
  'page-counter': FileText,
  'letter-counter': Baseline,

  // Analysis
  'readability-checker': BookOpenCheck,
  'keyword-density-checker': KeyRound,
  'unique-word-counter': Sparkles,
  'word-frequency-counter': BarChart3,
  'character-frequency-counter': Activity,
  'sentence-length-analyzer': Ruler,
  'paragraph-length-analyzer': AlignJustify,
  'word-density-analyzer': PieChart,
  'complexity-analyzer': Cpu,
  'text-summarizer': ScanText,

  // Time & Syllables
  'reading-time-calculator': Clock,
  'speaking-time-calculator': Mic,
  'words-to-minutes': Timer,
  'syllable-counter': Music,

  // Social Limits
  'twitter-character-limit': Twitter,
  'instagram-character-limit': Instagram,
  'facebook-character-limit': Facebook,
  'linkedin-character-limit': Linkedin,
  'youtube-description-limit': Youtube,
  'tiktok-character-limit': Video,
  'social-media-character-limits': Compass,

  // Converters & Generators
  'words-to-pages': FileSpreadsheet,
  'meta-description-generator': Wand2,
};

/**
 * Registry mapping resource slugs to Lucide icons
 */
export const RESOURCE_ICONS: Record<string, LucideIcon> = {
  // Learn
  'blog': Newspaper,
  'guides': BookOpen,
  'faq': HelpCircle,
  'cheatsheets': ClipboardList,

  // Templates & Calculators
  'templates': FileCode,
  'checklists': CheckSquare,
  'calculators': Calculator,
  'meta-description-generator': Wand2,
  'all-resources': FolderKanban,

  // Company & Support
  'about': Info,
  'contact': Mail,
  'support': LifeBuoy,
  'changelog': GitCommitHorizontal,

  // Legal & Trust
  'privacy': ShieldCheck,
  'terms': FileCheck,
  'sitemap': Map,
};

/**
 * Category icons for mega-menus and mobile drawer
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  counting: Type,
  analysis: BarChart3,
  time: Clock,
  advanced: Cpu,
  social: Compass,
  learn: BookOpen,
  templates: FileCode,
  company: Info,
  legal: ShieldCheck,
};

/**
 * Safe getter for tool icons with fallback
 */
export function getToolIcon(slug: string): LucideIcon {
  return TOOL_ICONS[slug] || Wrench;
}

/**
 * Safe getter for resource icons with fallback
 */
export function getResourceIcon(slug: string): LucideIcon {
  return RESOURCE_ICONS[slug] || FileText;
}

/**
 * Safe getter for category icons with fallback
 */
export function getCategoryIcon(categoryKey: string): LucideIcon {
  return CATEGORY_ICONS[categoryKey] || FolderKanban;
}
