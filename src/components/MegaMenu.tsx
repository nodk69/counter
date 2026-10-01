/*
 * ANIMATION TIMING TUNING GUIDE
 * ==============================
 * To adjust the feel of the mega-menu animations, tweak the CSS variables below:
 * 
 * - Snappier / Tech feel:
 *     --mega-panel-duration: 160ms;
 *     --mega-item-duration: 160ms;
 *     --mega-item-stagger-item: 15ms;
 *     --mega-item-stagger-col: 25ms;
 * 
 * - Default / Balanced feel (Current):
 *     --mega-panel-duration: 220ms;
 *     --mega-panel-ease: cubic-bezier(0.16, 1, 0.3, 1);
 *     --mega-backdrop-duration: 180ms;
 *     --mega-item-duration: 200ms;
 *     --mega-item-stagger-item: 25ms;
 *     --mega-item-stagger-col: 40ms;
 * 
 * - Luxurious / Spring feel:
 *     --mega-panel-duration: 320ms;
 *     --mega-panel-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
 *     --mega-item-stagger-item: 35ms;
 *     --mega-item-stagger-col: 60ms;
 */

import React, { useRef } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MegaMenuItem {
  slug: string;
  name: string;
  href: string;
  shortDesc?: string;
  icon?: LucideIcon;
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  icon?: LucideIcon;
  items: MegaMenuItem[];
}

export interface MegaMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  categories: MegaMenuCategory[];
  featuredItems?: MegaMenuItem[];
  viewAllHref: string;
  viewAllLabel: string;
  getIconForSlug?: (slug: string) => LucideIcon;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  id,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  categories,
  featuredItems = [],
  viewAllHref,
  viewAllLabel,
  getIconForSlug,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

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

        .mega-panel-animate {
          animation: megaPanelEnter var(--mega-panel-duration) var(--mega-panel-ease) forwards;
        }

        .mega-backdrop-animate {
          animation: megaBackdropFade var(--mega-backdrop-duration) ease-out forwards;
        }

        .mega-item-cascade {
          animation: megaItemCascade var(--mega-item-duration) var(--mega-panel-ease) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .mega-panel-animate,
          .mega-backdrop-animate,
          .mega-item-cascade {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Backdrop Dim Layer */}
      <div
        className="mega-backdrop-animate fixed inset-0 top-16 bg-slate-900/10 dark:bg-black/35 backdrop-blur-[1px] pointer-events-none z-40"
        aria-hidden="true"
      />

      {/* Full-Width Mega Panel Strip */}
      <div
        id={id}
        ref={panelRef}
        role="region"
        aria-label={`${viewAllLabel} Dropdown Panel`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="mega-panel-animate absolute left-0 right-0 top-full w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-[0_12px_28px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
      >
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Category Columns Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(
              categories.length,
              4
            )} gap-6 xl:gap-8`}
          >
            {categories.map((category, colIdx) => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.id} className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/80">
                    {CategoryIcon && (
                      <CategoryIcon
                        className="w-3.5 h-3.5 text-slate-400 shrink-0"
                        strokeWidth={2}
                      />
                    )}
                    <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      {category.label}
                    </h2>
                  </div>

                  {/* Vertical Item List */}
                  <ul className="space-y-1">
                    {category.items.map((item, itemIdx) => {
                      const ItemIcon =
                        item.icon || (getIconForSlug ? getIconForSlug(item.slug) : null);
                      const staggerDelay = `${colIdx * 40 + itemIdx * 25}ms`;

                      return (
                        <li
                          key={item.slug}
                          className="mega-item-cascade"
                          style={{ animationDelay: staggerDelay }}
                        >
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="group flex items-start gap-2.5 p-2 rounded-md text-sm text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          >
                            {ItemIcon && (
                              <ItemIcon
                                className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 mt-0.5 transition-colors duration-150"
                                strokeWidth={2}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                                {item.name}
                              </div>
                              {item.shortDesc && (
                                <p className="text-[11px] text-slate-400 dark:text-slate-400 line-clamp-1 leading-snug mt-0.5">
                                  {item.shortDesc}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Bottom Footer Strip */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            {featuredItems.length > 0 && (
              <div className="flex items-center flex-wrap gap-2 text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" strokeWidth={2} />
                  Popular:
                </span>
                {featuredItems.map(fItem => {
                  const FIcon =
                    fItem.icon || (getIconForSlug ? getIconForSlug(fItem.slug) : null);
                  return (
                    <Link
                      key={fItem.slug}
                      href={fItem.href}
                      onClick={onClose}
                      className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-200 transition-colors font-medium"
                    >
                      {FIcon && (
                        <FIcon
                          className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0"
                          strokeWidth={2}
                        />
                      )}
                      <span>{fItem.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            <Link
              href={viewAllHref}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group flex-shrink-0 ml-auto sm:ml-0"
            >
              <span>{viewAllLabel}</span>
              <ArrowRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;
