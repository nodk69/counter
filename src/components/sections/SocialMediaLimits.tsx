import { Link } from 'wouter';
import { Smartphone } from 'lucide-react';
import { SOCIAL_MEDIA_LIMITS } from '@/data/seoData';

const ICON_MAP: Record<string, string> = {
  'twitter-character-limit': '𝕏',
  'meta-description-limit': '🔍',
  'seo-title-tag-limit': '🏷️',
  'instagram-character-limit': '📷',
  'linkedin-character-limit': 'in',
  'youtube-description-limit': '▶',
  'tiktok-character-limit': '♪',
  'facebook-character-limit': 'f',
};

const COLOR_MAP: Record<string, string> = {
  'twitter-character-limit': 'bg-black text-white',
  'meta-description-limit': 'bg-blue-600 text-white',
  'seo-title-tag-limit': 'bg-orange-500 text-white',
  'instagram-character-limit': 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
  'linkedin-character-limit': 'bg-[#0077b5] text-white',
  'youtube-description-limit': 'bg-red-600 text-white',
  'tiktok-character-limit': 'bg-black text-white',
  'facebook-character-limit': 'bg-[#1877f2] text-white',
};

const DISPLAY_LIMITS = [
  'twitter-character-limit',
  'meta-description-limit',
  'seo-title-tag-limit',
  'instagram-character-limit',
  'linkedin-character-limit',
  'youtube-description-limit',
  'tiktok-character-limit',
  'facebook-character-limit',
];

export default function SocialMediaLimits() {
  const limits = DISPLAY_LIMITS.map(slug => SOCIAL_MEDIA_LIMITS.find(l => l.slug === slug)).filter(Boolean);

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground">Social Media Character Limits</h2>
            <p className="text-sm text-muted-foreground font-sans">Quick reference for every major platform</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Platform</th>
                <th className="text-right py-2 px-4 text-muted-foreground font-medium">Limit</th>
                <th className="text-left py-2 pl-4 text-muted-foreground font-medium hidden md:table-cell">Best Practice</th>
                <th className="py-2 pl-4 hidden sm:table-cell"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {limits.map((limit) => (
                <tr key={limit!.slug} className="hover:bg-muted/30 transition-colors group">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${COLOR_MAP[limit!.slug]}`}>
                        {ICON_MAP[limit!.slug]}
                      </div>
                      <span className="font-medium text-foreground">{limit!.platform}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono font-semibold text-primary">
                      {limit!.limit.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground ml-1 text-xs">chars</span>
                  </td>
                  <td className="py-3 pl-4 text-muted-foreground hidden md:table-cell">
                    {'optimalLimit' in limit! && limit!.optimalLimit
                      ? `Best: ${limit!.optimalLimit.toLocaleString()} chars`
                      : 'foldLimit' in limit! && limit!.foldLimit
                      ? `Preview: ${(limit as any).foldLimit} chars`
                      : 'Standard limit'}
                  </td>
                  <td className="py-3 pl-4 hidden sm:table-cell text-right">
                    <Link
                      href={`/${limit!.slug}`}
                      className="text-xs text-primary opacity-0 group-hover:opacity-100 hover:underline transition-opacity"
                    >
                      Learn more →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-sans">
            Use our{' '}
            <Link href="/character-counter" className="text-primary hover:underline">
              Character Counter
            </Link>{' '}
            to check your text against these limits in real time.
          </p>
          <Link
            href="/twitter-character-limit"
            className="text-sm text-primary font-medium hover:underline font-sans"
          >
            View all limit guides →
          </Link>
        </div>
      </div>
    </section>
  );
}
