import type { LucideIcon } from 'lucide-react';
import {
  FileText,
  CheckSquare,
  ClipboardList,
  Calculator,
  BookOpen,
  Home,
  Wrench,
  Newspaper,
  FolderKanban,
  Info,
} from 'lucide-react';

export interface NavLink {
  href:     string;
  label:    string;
  icon?:    LucideIcon | string;
  external?: boolean;
}

/** Main desktop navigation links */
export const MAIN_NAV: NavLink[] = [
  { href: '/',        label: 'Home' },
  { href: '/tools',   label: 'Tools' },
  { href: '/blog',    label: 'Blog' },
  { href: '/guides',  label: 'Guides' },
  { href: '/resources', label: 'Resources' },
  { href: '/about',   label: 'About' },
];

/**
 * Resources dropdown items.
 * Each entry deep-links to its matching <section id="..."> in
 * ResourcesPage.tsx (templates / checklists / cheatsheets / calculators)
 * rather than all pointing at the bare /resources URL.
 */
export const RESOURCES_LINKS: NavLink[] = [
  { href: '/resources#templates',   label: 'Templates',   icon: FileText },
  { href: '/resources#checklists',  label: 'Checklists',  icon: CheckSquare },
  { href: '/resources#cheatsheets', label: 'Cheatsheets', icon: ClipboardList },
  { href: '/resources#calculators', label: 'Calculators', icon: Calculator },
  { href: '/guides',                label: 'Guides',      icon: BookOpen },
];

/** Mobile navigation links */
export const MOBILE_NAV: NavLink[] = [
  { href: '/',          label: 'Home',         icon: Home },
  { href: '/tools',     label: 'All Tools',    icon: Wrench },
  { href: '/blog',      label: 'Blog',         icon: Newspaper },
  { href: '/guides',    label: 'Guides',       icon: BookOpen },
  { href: '/resources', label: 'Resources',    icon: FolderKanban },
  { href: '/about',     label: 'About',        icon: Info },
];

/** Footer navigation grouped by section */
export const FOOTER_NAV = {
  tools: {
    label: 'Popular Tools',
    links: [
      { href: '/word-counter',           label: 'Word Counter' },
      { href: '/character-counter',      label: 'Character Counter' },
      { href: '/readability-checker',    label: 'Readability Checker' },
      { href: '/keyword-density-checker',label: 'Keyword Density' },
      { href: '/reading-time-calculator',label: 'Reading Time' },
      { href: '/meta-description-generator', label: 'Meta Description Generator' },
    ],
  },
  content: {
    label: 'Content',
    links: [
      { href: '/blog',    label: 'Blog' },
      { href: '/guides',  label: 'Guides' },
      { href: '/resources', label: 'Resources' },
      { href: '/tools',   label: 'All Tools' },
    ],
  },
  company: {
    label: 'Company',
    links: [
      { href: '/about',   label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms',   label: 'Terms of Service' },
    ],
  },
} as const;