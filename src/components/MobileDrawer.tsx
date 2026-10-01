/*
 * ANIMATION TIMING TUNING GUIDE (MOBILE DRAWER)
 * =============================================
 * To adjust mobile slide-in and accordion expansion timings:
 * 
 * - Snappier: drawer 180ms, accordion 150ms
 * - Balanced (Current): drawer 240ms, accordion 200ms with cubic-bezier(0.16, 1, 0.3, 1)
 * - Slower: drawer 320ms, accordion 280ms
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Search, X, ChevronDown, Wrench, FolderKanban } from 'lucide-react';
import { TOOLS } from '@/data/tools';
import { RESOURCES, RESOURCE_CATEGORIES, ResourceCategory } from '@/data/resources';
import { getToolIcon, getResourceIcon, getCategoryIcon } from '@/data/icons';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<'tools' | 'resources' | null>('tools');
  const [expandedSubCat, setExpandedSubCat] = useState<string | null>('counting');

  // Filtered tools and resources based on real-time search
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS;
    const q = searchQuery.toLowerCase();
    return TOOLS.filter(
      t => t.name.toLowerCase().includes(q) || t.shortDesc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return RESOURCES;
    const q = searchQuery.toLowerCase();
    return RESOURCES.filter(
      r => r.name.toLowerCase().includes(q) || r.shortDesc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Tool categories
  const toolCategories = useMemo(() => {
    const cats = [
      { id: 'counting', label: 'Counting Tools' },
      { id: 'analysis', label: 'Analysis Tools' },
      { id: 'time', label: 'Time & Speech Tools' },
      { id: 'advanced', label: 'Advanced Tools' },
    ];
    return cats.map(c => ({
      ...c,
      tools: filteredTools.filter(t => t.category === c.id),
    }));
  }, [filteredTools]);

  // Resource categories
  const resourceCategories = useMemo(() => {
    const catKeys = Object.keys(RESOURCE_CATEGORIES) as ResourceCategory[];
    return catKeys.map(k => ({
      id: k,
      label: RESOURCE_CATEGORIES[k].label,
      resources: filteredResources.filter(r => r.category === k),
    }));
  }, [filteredResources]);

  const isSearching = searchQuery.trim().length > 0;

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes mobileDrawerSlide {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes mobileFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
            max-height: 700px;
            transform: translateY(0);
          }
        }

        .drawer-slide-in {
          animation: mobileDrawerSlide 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .drawer-fade-in {
          animation: mobileFadeIn 180ms ease-out forwards;
        }

        .mobile-accordion-open {
          animation: accordionExpand 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .drawer-slide-in,
          .drawer-fade-in,
          .mobile-accordion-open {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Dimmed Overlay */}
      <div
        className="drawer-fade-in fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-In Drawer Panel */}
      <div
        className="drawer-slide-in fixed top-0 right-0 bottom-0 w-[88vw] max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 lg:hidden overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="font-serif text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight"
          >
            counter
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Real-time Search Input */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={2}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tools & resources..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Primary Links */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors text-center"
            >
              Home
            </Link>
            <Link
              href="/blog"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors text-center"
            >
              Blog
            </Link>
            <Link
              href="/guides"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors text-center"
            >
              Guides
            </Link>
            <Link
              href="/about"
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors text-center"
            >
              About
            </Link>
          </div>

          {/* Search Result Matches */}
          {isSearching && (
            <div className="space-y-4">
              {filteredTools.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tools ({filteredTools.length})
                  </h3>
                  <div className="space-y-1">
                    {filteredTools.map(tool => {
                      const Icon = getToolIcon(tool.slug);
                      return (
                        <Link
                          key={tool.slug}
                          href={`/${tool.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2.5 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">
                            {tool.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredResources.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Resources ({filteredResources.length})
                  </h3>
                  <div className="space-y-1">
                    {filteredResources.map(res => {
                      const Icon = getResourceIcon(res.slug);
                      return (
                        <Link
                          key={res.slug}
                          href={res.href}
                          onClick={onClose}
                          className="flex items-center gap-2.5 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors group"
                        >
                          <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600">
                            {res.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {filteredTools.length === 0 && filteredResources.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No tools or resources matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}

          {/* Standard Navigation Accordion (when not actively searching) */}
          {!isSearching && (
            <div className="space-y-3">
              {/* Tools Accordion Block */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection(expandedSection === 'tools' ? null : 'tools')
                  }
                  className="w-full flex items-center justify-between p-3 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  aria-expanded={expandedSection === 'tools'}
                >
                  <span className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Writing Tools</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({TOOLS.length})
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedSection === 'tools' ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {expandedSection === 'tools' && (
                  <div className="mobile-accordion-open border-t border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                    {toolCategories.map(cat => {
                      const isCatOpen = expandedSubCat === cat.id;
                      const CatIcon = getCategoryIcon(cat.id);
                      return (
                        <div key={cat.id} className="overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedSubCat(isCatOpen ? null : cat.id)}
                            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          >
                            <span className="flex items-center gap-2">
                              <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span>{cat.label}</span>
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 text-slate-400 transition-transform ${
                                isCatOpen ? 'rotate-180 text-indigo-600' : ''
                              }`}
                            />
                          </button>

                          {isCatOpen && (
                            <div className="px-3 pb-2 pt-0.5 space-y-0.5 bg-slate-50/50 dark:bg-slate-900/30">
                              {cat.tools.map(tool => {
                                const ToolIcon = getToolIcon(tool.slug);
                                return (
                                  <Link
                                    key={tool.slug}
                                    href={`/${tool.slug}`}
                                    onClick={onClose}
                                    className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
                                  >
                                    <ToolIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                                    <span>{tool.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Resources Accordion Block */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSection(expandedSection === 'resources' ? null : 'resources')
                  }
                  className="w-full flex items-center justify-between p-3 font-semibold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                  aria-expanded={expandedSection === 'resources'}
                >
                  <span className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Resources & Hub</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({RESOURCES.length})
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      expandedSection === 'resources'
                        ? 'rotate-180 text-indigo-600'
                        : 'text-slate-400'
                    }`}
                  />
                </button>

                {expandedSection === 'resources' && (
                  <div className="mobile-accordion-open border-t border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                    {resourceCategories.map(cat => {
                      const isCatOpen = expandedSubCat === `res-${cat.id}`;
                      const CatIcon = getCategoryIcon(cat.id);
                      return (
                        <div key={cat.id} className="overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedSubCat(isCatOpen ? null : `res-${cat.id}`)
                            }
                            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          >
                            <span className="flex items-center gap-2">
                              <CatIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span>{cat.label}</span>
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 text-slate-400 transition-transform ${
                                isCatOpen ? 'rotate-180 text-indigo-600' : ''
                              }`}
                            />
                          </button>

                          {isCatOpen && (
                            <div className="px-3 pb-2 pt-0.5 space-y-0.5 bg-slate-50/50 dark:bg-slate-900/30">
                              {cat.resources.map(res => {
                                const ResIcon = getResourceIcon(res.slug);
                                return (
                                  <Link
                                    key={res.slug}
                                    href={res.href}
                                    onClick={onClose}
                                    className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
                                  >
                                    <ResIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                                    <span>{res.name}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
          <Link
            href="/tools"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Explore All Tools & Features →
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
