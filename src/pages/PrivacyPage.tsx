import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';

const SECTIONS = [
  {
    title: 'Data We Collect',
    content: `counter does not collect, store, or transmit any text you enter into the editor. All text processing happens entirely within your browser. We do not have a database of user content because we never receive it.

The only data we may collect is anonymous usage analytics (page views, feature usage counts) through privacy-respecting analytics that do not use cookies or fingerprinting. No personal information is associated with this data.`,
  },
  {
    title: 'Local Storage',
    content: `counter uses your browser's local storage to save your text between sessions, your writing goal, and your theme preference (light/dark). This data exists only on your device and is never transmitted to our servers. You can clear it at any time by clearing your browser data.`,
  },
  {
    title: 'Cookies',
    content: `counter does not use cookies. We do not set any tracking cookies, advertising cookies, or session cookies. Your browsing on counter is entirely cookie-free.`,
  },
  {
    title: 'Third-Party Services',
    content: `counter uses Google Fonts to load typefaces. This means your browser may make a request to Google's servers to download fonts. You can disable this by using your browser's content blocking settings.

We do not use Google Analytics, Facebook Pixel, or any advertising networks.`,
  },
  {
    title: 'Your Rights',
    content: `Since we do not collect personal data, there is no data to delete, export, or correct on our end. All your data (text, preferences) exists in your browser's local storage and can be deleted by clearing your browser storage at any time.`,
  },
  {
    title: 'Security',
    content: `counter is served over HTTPS. All connections to our servers use TLS encryption. Since we don't receive your text, there is no risk of your content being exposed through a data breach on our end.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this privacy policy from time to time. Changes will be posted on this page with the updated date at the top. Continued use of counter after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: 'Contact',
    content: `If you have any questions about this privacy policy, please contact us at hello@counter.app or through our contact form.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title="Privacy Policy | counter.io"
        description="counter.io privacy policy. We don't collect your text, store personal data, or sell information. Read how we protect your privacy."
      />
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-xs font-sans text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link> › Privacy
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground font-sans text-sm">Last updated: July 1, 2026</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-3xl py-12">
          <div className="mb-8 p-5 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900">
            <p className="text-green-800 dark:text-green-300 font-sans text-sm leading-relaxed">
              <strong>TL;DR:</strong> counter never sees your text. Everything is processed locally in your browser. We don't use cookies, we don't track you, and we don't sell data — because we don't have any.
            </p>
          </div>

          <div className="space-y-10">
            {SECTIONS.map((section, i) => (
              <section key={i}>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">{section.title}</h2>
                {section.content.split('\n\n').map((para, j) => (
                  <p key={j} className="text-foreground/80 font-sans text-base leading-relaxed mb-3">{para}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
