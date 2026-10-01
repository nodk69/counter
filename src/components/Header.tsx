/*
 * ANIMATION TIMING TUNING GUIDE
 * ==============================
 * To adjust the feel of the mega-menu animations, modify the CSS variables in the <style> block:
 * 
 * - Snappier / Tech feel:
 *     --mega-panel-duration: 160ms;
 *     --mega-item-stagger-item: 15ms;
 *     --mega-item-stagger-col: 25ms;
 * 
 * - Default / Balanced feel (Current):
 *     --mega-panel-duration: 220ms;
 *     --mega-panel-ease: cubic-bezier(0.16, 1, 0.3, 1);
 *     --mega-item-stagger-item: 25ms;
 *     --mega-item-stagger-col: 40ms;
 * 
 * - Luxurious / Spring feel:
 *     --mega-panel-duration: 320ms;
 *     --mega-panel-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
 *     --mega-item-stagger-item: 35ms;
 *     --mega-item-stagger-col: 60ms;
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { Sun, Moon, Menu, X, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { TOOLS, TOOL_CATEGORIES, ToolCategory } from '@/data/tools';
import LanguageSwitcher from './LanguageSwitcher';

interface CategoryGroup {
  id: ToolCategory;
  label: string;
  icon: string;
  color: string;
  bg: string;
  tools: typeof TOOLS;
}

const CATEGORY_GROUPS: CategoryGroup[] = (Object.keys(TOOL_CATEGORIES) as ToolCategory[]).map(catKey => ({
  id: catKey,
  ...TOOL_CATEGORIES[catKey],
  tools: TOOLS.filter(t => t.category === catKey),
}));

// 3-4 High-intent featured tools for the bottom quick strip
const FEATURED_TOOLS = TOOLS.filter(t => 
  ['word-counter', 'character-counter', 'readability-checker', 'speaking-time-calculator'].includes(t.slug)
);

const RESOURCES_LINKS = [
  { href: '/resources', label: '📄 Templates', desc: 'Pre-formatted writing templates' },
  { href: '/resources', label: '✅ Checklists', desc: 'Editing & proofreading checklists' },
  { href: '/resources', label: '📋 Cheatsheets', desc: 'Character limits & word targets' },
  { href: '/guides', label: '📖 Guides', desc: 'In-depth writing & SEO guides' },
  { href: '/resources', label: '🧮 Calculators', desc: 'Speaking & reading time math' },
  { href: '/meta-description-generator', label: '🔍 Meta Description Generator', desc: 'SERP length optimizer' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  // Desktop mega menu states
  const [toolsOpen, setToolsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Mobile menu states
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>('counting');
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  // Timers for hover with 120ms debounce/delay to eliminate flicker
  const toolsLeaveTimer = useRef<NodeJS.Timeout | null>(null);
  const resourcesLeaveTimer = useRef<NodeJS.Timeout | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Close all menus on route change
  useEffect(() => {
    setToolsOpen(false);
    setResourcesOpen(false);
    setMobileOpen(false);
  }, [location]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setToolsOpen(false);
        setResourcesOpen(false);
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
        setResourcesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Tools Menu hover handlers
  const handleToolsMouseEnter = useCallback(() => {
    if (toolsLeaveTimer.current) {
      clearTimeout(toolsLeaveTimer.current);
      toolsLeaveTimer.current = null;
    }
    setResourcesOpen(false);
    setToolsOpen(true);
  }, []);

  const handleToolsMouseLeave = useCallback(() => {
    if (toolsLeaveTimer.current) clearTimeout(toolsLeaveTimer.current);
    toolsLeaveTimer.current = setTimeout(() => {
      setToolsOpen(false);
    }, 120);
  }, []);

  // Resources Menu hover handlers
  const handleResourcesMouseEnter = useCallback(() => {
    if (resourcesLeaveTimer.current) {
      clearTimeout(resourcesLeaveTimer.current);
      resourcesLeaveTimer.current = null;
    }
    setToolsOpen(false);
    setResourcesOpen(true);
  }, []);

  const handleResourcesMouseLeave = useCallback(() => {
    if (resourcesLeaveTimer.current) clearTimeout(resourcesLeaveTimer.current);
    resourcesLeaveTimer.current = setTimeout(() => {
      setResourcesOpen(false);
    }, 120);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --mega-panel-duration: 220ms;
          --mega-panel-ease: cubic-bezier(0.16, 1, 0.3, 1);
          --mega-backdrop-duration: 180ms;
          --mega-item-duration: 200ms;
          --mega-item-stagger-col: 40ms;
          --mega-item-stagger-item: 25ms;
        }

        @keyframes megaPanelEnter {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes megaBackdropFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes megaItemCascade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes accordionExpand {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        .mega-panel-enter {
          animation: megaPanelEnter var(--mega-panel-duration) var(--mega-panel-ease) forwards;
        }

        .mega-backdrop-enter {
          animation: megaBackdropFade var(--mega-backdrop-duration) ease-out forwards;
        }

        .mega-item-stagger {
          animation: megaItemCascade var(--mega-item-duration) var(--mega-panel-ease) both;
        }

        .accordion-content-enter {
          animation: accordionExpand 220ms var(--mega-panel-ease) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .mega-panel-enter,
          .mega-backdrop-enter,
          .mega-item-stagger,
          .accordion-content-enter {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <header
        ref={navRef}
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl relative">
          
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-1"
          >
            <span className="font-serif text-2xl font-bold text-primary tracking-tight leading-none pt-0.5 group-hover:opacity-90 transition-opacity">
              counter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-md transition-colors hover:bg-muted/50"
            >
              Home
            </Link>

            {/* Tools Trigger */}
            <div
              className="relative"
              onMouseEnter={handleToolsMouseEnter}
              onMouseLeave={handleToolsMouseLeave}
            >
              <button
                type="button"
                onClick={() => setToolsOpen(prev => !prev)}
                aria-haspopup="true"
                aria-expanded={toolsOpen}
                aria-controls="mega-menu-tools"
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  toolsOpen
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-muted/50'
                }`}
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                    toolsOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                  }`}
                />
              </button>
            </div>

            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-md transition-colors hover:bg-muted/50"
            >
              Blog
            </Link>

            <Link
              href="/guides"
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-md transition-colors hover:bg-muted/50"
            >
              Guides
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleResourcesMouseEnter}
              onMouseLeave={handleResourcesMouseLeave}
            >
              <button
                type="button"
                onClick={() => setResourcesOpen(prev => !prev)}
                aria-haspopup="true"
                aria-expanded={resourcesOpen}
                aria-controls="resources-dropdown"
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  resourcesOpen
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-muted/50'
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
                    resourcesOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                  }`}
                />
              </button>

              {resourcesOpen && (
                <div
                  id="resources-dropdown"
                  className="mega-panel-enter absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-64 bg-background border border-border/80 rounded-xl shadow-[0_12px_28px_-12px_rgba(15,23,42,0.18)] p-2 z-50 overflow-hidden"
                >
                  <div className="space-y-1">
                    {RESOURCES_LINKS.map(r => (
                      <Link
                        key={r.label}
                        href={r.href}
                        onClick={() => setResourcesOpen(false)}
                        className="flex flex-col px-3 py-2 rounded-lg text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors group"
                      >
                        <span className="font-medium group-hover:text-primary transition-colors">{r.label}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{r.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary rounded-md transition-colors hover:bg-muted/50"
            >
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <LanguageSwitcher />

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP FULL-WIDTH MEGA MENU STRIP */}
        {/* ========================================================================= */}
        {toolsOpen && (
          <>
            {/* Subtle Dim Backdrop */}
            <div
              className="mega-backdrop-enter fixed inset-0 top-16 bg-slate-900/10 dark:bg-black/30 backdrop-blur-[1px] pointer-events-none z-40"
              aria-hidden="true"
            />

            {/* Mega Panel Container */}
            <div
              id="mega-menu-tools"
              ref={megaMenuRef}
              role="region"
              aria-label="Writing Tools Mega Menu"
              onMouseEnter={handleToolsMouseEnter}
              onMouseLeave={handleToolsMouseLeave}
              className="mega-panel-enter absolute left-0 right-0 top-full w-full bg-background border-b border-border/80 shadow-[0_20px_35px_-15px_rgba(15,23,42,0.15)] dark:shadow-[0_20px_35px_-15px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* 4 Category Columns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                  {CATEGORY_GROUPS.map((category, colIdx) => (
                    <div key={category.id} className="space-y-3">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 pb-1.5 border-b border-border/50">
                        <span className="text-base" role="img" aria-hidden="true">{category.icon}</span>
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          {category.label}
                        </h2>
                      </div>

                      {/* Tool Item List with Cascading Entrance */}
                      <ul className="space-y-1">
                        {category.tools.map((tool, itemIdx) => {
                          const staggerDelay = `${colIdx * 40 + itemIdx * 25}ms`;
                          return (
                            <li
                              key={tool.slug}
                              className="mega-item-stagger"
                              style={{ animationDelay: staggerDelay }}
                            >
                              <Link
                                href={`/${tool.slug}`}
                                onClick={() => setToolsOpen(false)}
                                className="group flex items-start gap-2.5 p-2 rounded-lg text-sm text-foreground/80 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <span className="text-base mt-0.5 group-hover:scale-110 transition-transform duration-150 flex-shrink-0">
                                  {tool.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                                    {tool.name}
                                  </div>
                                  <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug mt-0.5">
                                    {tool.shortDesc}
                                  </p>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Bottom Featured Bar + View All Link */}
                <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center flex-wrap gap-2 text-muted-foreground">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular:
                    </span>
                    {FEATURED_TOOLS.map(fTool => (
                      <Link
                        key={fTool.slug}
                        href={`/${fTool.slug}`}
                        onClick={() => setToolsOpen(false)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60 hover:bg-primary/10 hover:text-primary text-foreground/80 transition-colors font-medium"
                      >
                        <span>{fTool.icon}</span>
                        <span>{fTool.name}</span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href="/tools"
                    onClick={() => setToolsOpen(false)}
                    className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary/80 transition-colors group flex-shrink-0"
                  >
                    <span>View all {TOOLS.length} tools</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* MOBILE DRAWER WITH CATEGORY ACCORDION */}
        {/* ========================================================================= */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background pb-6 max-h-[85vh] overflow-y-auto">
            <nav className="container mx-auto px-4 pt-3 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              >
                Home
              </Link>

              {/* Tools Accordion */}
              <div className="border border-border/60 rounded-xl overflow-hidden my-2 bg-muted/20">
                <div className="p-2 border-b border-border/40 bg-muted/40 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                    🛠️ Writing Tools
                  </span>
                  <Link
                    href="/tools"
                    onClick={() => setMobileOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline px-2"
                  >
                    All {TOOLS.length} →
                  </Link>
                </div>

                <div className="divide-y divide-border/40">
                  {CATEGORY_GROUPS.map(category => {
                    const isExpanded = mobileExpandedCat === category.id;
                    return (
                      <div key={category.id} className="overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setMobileExpandedCat(isExpanded ? null : category.id)}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-foreground/90 hover:bg-muted/50 transition-colors"
                          aria-expanded={isExpanded}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                            <span className="text-[10px] text-muted-foreground font-normal">({category.tools.length})</span>
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="accordion-content-enter px-3 pb-2.5 pt-1 space-y-1 bg-background/50">
                            {category.tools.map(tool => (
                              <Link
                                key={tool.slug}
                                href={`/${tool.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
                              >
                                <span className="text-sm">{tool.icon}</span>
                                <span className="font-medium">{tool.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              >
                📝 Blog
              </Link>

              <Link
                href="/guides"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              >
                📖 Guides
              </Link>

              {/* Mobile Resources Accordion */}
              <div className="border border-border/60 rounded-xl overflow-hidden my-2 bg-muted/20">
                <button
                  type="button"
                  onClick={() => setMobileResourcesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-foreground/90 hover:bg-muted/50 transition-colors"
                  aria-expanded={mobileResourcesOpen}
                >
                  <span className="flex items-center gap-1.5">
                    <span>📚</span>
                    <span>Resources & Calculators</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      mobileResourcesOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                    }`}
                  />
                </button>

                {mobileResourcesOpen && (
                  <div className="accordion-content-enter px-3 pb-2.5 pt-1 space-y-1 bg-background/50">
                    {RESOURCES_LINKS.map(r => (
                      <Link
                        key={r.label}
                        href={r.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-2.5 py-1.5 rounded-md text-xs text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {r.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
