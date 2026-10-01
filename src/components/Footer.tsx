import { Github, Twitter, Youtube, Linkedin, Coffee } from 'lucide-react';
import { Link } from 'wouter';

const FOOTER_LINKS = {
  Tools: [
    { label: 'Word Counter', href: '/word-counter' },
    { label: 'Character Counter', href: '/character-counter' },
    { label: 'Readability Checker', href: '/readability-checker' },
    { label: 'Keyword Density', href: '/keyword-density-checker' },
    { label: 'Reading Time', href: '/reading-time-calculator' },
    { label: 'All Tools →', href: '/tools' },
  ],
  'For Writers': [
    { label: 'For Students', href: '/word-counter-for-students' },
    { label: 'For Bloggers', href: '/word-counter-for-bloggers' },
    { label: 'For SEO Pros', href: '/word-counter-for-seo' },
    { label: 'For Academics', href: '/word-counter-for-academics' },
    { label: 'For Professionals', href: '/word-counter-for-professionals' },
    { label: 'All Audiences →', href: '/resources#audience' },
  ],
  'SEO & Converters': [
    { label: '1,000 Words → Pages', href: '/1000-words-is-how-many-pages' },
    { label: '5,000 Words → Pages', href: '/5000-words-is-how-many-pages' },
    { label: '10-Minute Speech', href: '/10-minute-speech-word-count' },
    { label: 'Twitter Char Limit', href: '/twitter-character-limit' },
    { label: 'LinkedIn Char Limit', href: '/linkedin-character-limit' },
    { label: 'Meta Description Limit', href: '/meta-description-limit' },
  ],
  'Compare & Learn': [
    { label: 'Word vs Character Counter', href: '/word-counter-vs-character-counter' },
    { label: 'Reading vs Speaking Time', href: '/reading-time-vs-speaking-time' },
    { label: 'Meta Description Generator', href: '/meta-description-generator' },
    { label: 'All Comparisons →', href: '/resources#comparisons' },
    { label: 'Blog', href: '/blog' },
    { label: 'Guides', href: '/guides' },
  ],
  Content: [
    { label: 'Resources Hub', href: '/resources' },
    { label: 'Templates', href: '/resources#templates' },
    { label: 'Checklists', href: '/resources#checklists' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20 border-t border-border/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-background/50 mb-4 font-sans">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/15 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-serif text-xl font-bold text-primary">counter</span>
            <p className="text-sm text-background/50 font-sans flex items-center gap-1">
              © {new Date().getFullYear()} counter. Made with <Coffee className="w-3.5 h-3.5 text-amber-500" strokeWidth={2} /> for writers
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { icon: <Twitter className="w-4 h-4" />, label: 'Twitter', href: '#' },
              { icon: <Github className="w-4 h-4" />, label: 'GitHub', href: '#' },
              { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', href: '#' },
              { icon: <Youtube className="w-4 h-4" />, label: 'YouTube', href: '#' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="p-2 text-background/50 hover:text-background transition-colors rounded-lg hover:bg-background/10"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
