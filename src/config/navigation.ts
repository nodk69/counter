export interface NavLink {
  href:     string;
  label:    string;
  icon?:    string;
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

/** Resources dropdown items */
export const RESOURCES_LINKS: NavLink[] = [
  { href: '/resources', label: 'Templates',   icon: '📄' },
  { href: '/resources', label: 'Checklists',  icon: '✅' },
  { href: '/resources', label: 'Cheatsheets', icon: '📋' },
  { href: '/guides',    label: 'Guides',      icon: '📖' },
  { href: '/resources', label: 'Calculators', icon: '🧮' },
];

/** Mobile navigation links */
export const MOBILE_NAV: NavLink[] = [
  { href: '/',          label: 'Home',         icon: '🏠' },
  { href: '/tools',     label: 'All Tools',    icon: '🛠️' },
  { href: '/blog',      label: 'Blog',         icon: '📝' },
  { href: '/guides',    label: 'Guides',       icon: '📖' },
  { href: '/resources', label: 'Resources',    icon: '📚' },
  { href: '/about',     label: 'About',        icon: '' },
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
