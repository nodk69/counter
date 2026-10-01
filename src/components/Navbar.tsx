/*
 * ANIMATION TIMING TUNING GUIDE (NAVBAR)
 * =====================================
 * To adjust chevron rotation and menu timing:
 * 
 * - Chevron transition: 220ms cubic-bezier(0.16, 1, 0.3, 1)
 * - Hover leave delay: 120ms (prevents menu flicker between navbar and dropdown panel)
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronDown, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { MegaMenu, MegaMenuCategory, MegaMenuItem } from './MegaMenu';
import { MobileDrawer } from './MobileDrawer';

import { TOOLS, TOOL_CATEGORIES, ToolCategory } from '@/data/tools';
import { RESOURCES, RESOURCE_CATEGORIES, ResourceCategory } from '@/data/resources';
import { getToolIcon, getResourceIcon, getCategoryIcon } from '@/data/icons';

export const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  // Desktop mega menu states
  const [activeMenu, setActiveMenu] = useState<'tools' | 'resources' | null>(null);

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Hover delay timers (120ms) to prevent flicker
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLElement>(null);

  // Close all menus on route navigation
  useEffect(() => {
    setActiveMenu(null);
    setMobileDrawerOpen(false);
  }, [location]);

  // Close menus on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileDrawerOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setActiveMenu(null);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Hover handlers
  const handleMenuEnter = useCallback((menu: 'tools' | 'resources') => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setActiveMenu(menu);
  }, []);

  const handleMenuLeave = useCallback(() => {
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  }, []);

  const handleTriggerClick = useCallback((menu: 'tools' | 'resources') => {
    setActiveMenu(curr => (curr === menu ? null : menu));
  }, []);

  // -------------------------------------------------------------
  // Data Mapping for Tools Mega-Menu
  // -------------------------------------------------------------
  const toolsCategories: MegaMenuCategory[] = useMemo(() => {
    const catKeys = Object.keys(TOOL_CATEGORIES) as ToolCategory[];
    return catKeys.map(key => ({
      id: key,
      label: TOOL_CATEGORIES[key].label,
      icon: getCategoryIcon(key),
      items: TOOLS.filter(t => t.category === key).map(t => ({
        slug: t.slug,
        name: t.name,
        href: `/${t.slug}`,
        shortDesc: t.shortDesc,
        icon: getToolIcon(t.slug),
      })),
    }));
  }, []);

  const featuredTools: MegaMenuItem[] = useMemo(() => {
    const slugs = [
      'word-counter',
      'character-counter',
      'readability-checker',
      'speaking-time-calculator',
    ];
    return TOOLS.filter(t => slugs.includes(t.slug)).map(t => ({
      slug: t.slug,
      name: t.name,
      href: `/${t.slug}`,
      icon: getToolIcon(t.slug),
    }));
  }, []);

  // -------------------------------------------------------------
  // Data Mapping for Resources Mega-Menu
  // -------------------------------------------------------------
  const resourcesCategories: MegaMenuCategory[] = useMemo(() => {
    const catKeys = Object.keys(RESOURCE_CATEGORIES) as ResourceCategory[];
    return catKeys.map(key => ({
      id: key,
      label: RESOURCE_CATEGORIES[key].label,
      icon: getCategoryIcon(key),
      items: RESOURCES.filter(r => r.category === key).map(r => ({
        slug: r.slug,
        name: r.name,
        href: r.href,
        shortDesc: r.shortDesc,
        icon: getResourceIcon(r.slug),
      })),
    }));
  }, []);

  const featuredResources: MegaMenuItem[] = useMemo(() => {
    return RESOURCES.filter(r => r.featured).slice(0, 4).map(r => ({
      slug: r.slug,
      name: r.name,
      href: r.href,
      icon: getResourceIcon(r.slug),
    }));
  }, []);

  return (
    <header
      ref={navContainerRef}
      onBlur={(e) => {
        if (!navContainerRef.current?.contains(e.relatedTarget as Node)) {
          setActiveMenu(null);
        }
      }}
      className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl relative">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-1"
        >
          <span className="font-serif text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight leading-none pt-0.5 group-hover:opacity-90 transition-opacity">
            counter
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            Home
          </Link>

          {/* Tools Mega-Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('tools')}
            onMouseLeave={handleMenuLeave}
          >
            <button
              type="button"
              onClick={() => handleTriggerClick('tools')}
              aria-haspopup="true"
              aria-expanded={activeMenu === 'tools'}
              aria-controls="mega-menu-tools-panel"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeMenu === 'tools'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                  activeMenu === 'tools'
                    ? 'rotate-180 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400'
                }`}
                strokeWidth={2}
              />
            </button>
          </div>

          <Link
            href="/blog"
            className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            Blog
          </Link>

          <Link
            href="/guides"
            className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            Guides
          </Link>

          {/* Resources Mega-Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => handleMenuEnter('resources')}
            onMouseLeave={handleMenuLeave}
          >
            <button
              type="button"
              onClick={() => handleTriggerClick('resources')}
              aria-haspopup="true"
              aria-expanded={activeMenu === 'resources'}
              aria-controls="mega-menu-resources-panel"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                activeMenu === 'resources'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <span>Resources</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                  activeMenu === 'resources'
                    ? 'rotate-180 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-400'
                }`}
                strokeWidth={2}
              />
            </button>
          </div>

          <Link
            href="/about"
            className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
          >
            About
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5">
          <LanguageSwitcher />

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" strokeWidth={2} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={2} />
            )}
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Open mobile navigation drawer"
          >
            <Menu className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Tools Full-Width Mega-Menu */}
      <MegaMenu
        id="mega-menu-tools-panel"
        isOpen={activeMenu === 'tools'}
        onClose={() => setActiveMenu(null)}
        onMouseEnter={() => handleMenuEnter('tools')}
        onMouseLeave={handleMenuLeave}
        categories={toolsCategories}
        featuredItems={featuredTools}
        viewAllHref="/tools"
        viewAllLabel={`View all ${TOOLS.length} writing tools`}
        getIconForSlug={getToolIcon}
      />

      {/* Resources Full-Width Mega-Menu */}
      <MegaMenu
        id="mega-menu-resources-panel"
        isOpen={activeMenu === 'resources'}
        onClose={() => setActiveMenu(null)}
        onMouseEnter={() => handleMenuEnter('resources')}
        onMouseLeave={handleMenuLeave}
        categories={resourcesCategories}
        featuredItems={featuredResources}
        viewAllHref="/resources"
        viewAllLabel="Explore all resources & guides"
        getIconForSlug={getResourceIcon}
      />

      {/* Mobile Slide-in Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </header>
  );
};

export default Navbar;
