import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { TOOLS, TOOL_CATEGORIES } from '@/data/tools';
import LanguageSwitcher from './LanguageSwitcher';

const TOOLS_BY_CATEGORY = Object.entries(TOOL_CATEGORIES).map(([id, meta]) => ({
  id,
  ...meta,
  tools: TOOLS.filter(t => t.category === id),
}));

const RESOURCES_LINKS = [
  { href: '/resources', label: '📄 Templates' },
  { href: '/resources', label: '✅ Checklists' },
  { href: '/resources', label: '📋 Cheatsheets' },
  { href: '/guides', label: '📖 Guides' },
  { href: '/resources', label: '🧮 Calculators' },
];

function Dropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && children}
    </div>
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-serif text-2xl font-bold text-primary tracking-tight leading-none pt-1">
            counter
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Home
          </Link>

          {/* Tools Dropdown */}
          <Dropdown label="Tools">
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] bg-background border border-border rounded-xl shadow-xl p-4 grid grid-cols-2 gap-x-4">
              {TOOLS_BY_CATEGORY.map(cat => (
                <div key={cat.id} className="mb-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </div>
                  <div className="space-y-0.5">
                    {cat.tools.map(tool => (
                      <Link
                        key={tool.slug}
                        href={`/${tool.slug}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted text-sm text-foreground/80 hover:text-foreground transition-colors"
                      >
                        <span className="w-5 text-center">{tool.icon}</span>
                        <span>{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="col-span-2 border-t border-border pt-3 mt-1">
                <Link
                  href="/tools"
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/5 text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                >
                  View all 20+ tools →
                </Link>
              </div>
            </div>
          </Dropdown>

          <Link href="/blog" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="/guides" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Guides
          </Link>

          {/* Resources Dropdown */}
          <Dropdown label="Resources">
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-background border border-border rounded-xl shadow-xl py-2 overflow-hidden">
              {RESOURCES_LINKS.map(r => (
                <Link
                  key={r.label}
                  href={r.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </Dropdown>

          <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background pb-4 max-h-[80vh] overflow-y-auto">
          <nav className="container mx-auto px-4 pt-3 space-y-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/tools', label: '🛠️ All Tools' },
              { href: '/blog', label: '📝 Blog' },
              { href: '/guides', label: '📖 Guides' },
              { href: '/resources', label: '📚 Resources' },
              { href: '/about', label: 'About' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-border">
              <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Popular Tools</p>
              {TOOLS.slice(0, 6).map(tool => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <span>{tool.icon}</span>
                  {tool.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
