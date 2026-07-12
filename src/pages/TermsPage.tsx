import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';

const SECTIONS = [
  { title: 'Acceptance of Terms', content: 'By using counter, you agree to these Terms of Service. If you do not agree, please do not use our service. These terms apply to all visitors and users of counter.' },
  { title: 'Description of Service', content: 'counter provides a free, browser-based text analysis suite including word counting, character counting, readability analysis, and related writing tools. The service is provided "as is" without warranties of any kind.' },
  { title: 'Use of the Service', content: 'You may use counter for any lawful purpose. You agree not to use counter to process text that is illegal, harmful, or violates the rights of others. You are responsible for the content you process through our tools.' },
  { title: 'No Account Required', content: 'counter does not require account creation. All data processed through counter is handled locally in your browser. We do not store or have access to any text you enter.' },
  { title: 'Intellectual Property', content: 'The counter application, its design, code, and content (excluding user-submitted text) are owned by counter and protected by intellectual property laws. You may not copy, reproduce, or distribute our application without permission.' },
  { title: 'User Content', content: 'Since all text processing is local, you retain full ownership of any content you process through counter. We have no access to, claim over, or responsibility for the content you enter into our tools.' },
  { title: 'Disclaimer of Warranties', content: 'counter is provided "as is" without any warranties, express or implied. We do not guarantee that the service will be error-free, uninterrupted, or that the word counts and statistics are accurate for all edge cases.' },
  { title: 'Limitation of Liability', content: 'To the maximum extent permitted by law, counter shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.' },
  { title: 'Changes to Terms', content: 'We reserve the right to modify these terms at any time. Continued use of counter after changes constitutes acceptance of the modified terms.' },
  { title: 'Contact', content: 'For questions about these terms, contact us at hello@counter.app.' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title="Terms of Service | counter.io"
        description="Terms of service for counter.io. Read the terms governing your use of our free writing tools."
      />
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-xs font-sans text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link> › Terms
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
            <p className="text-muted-foreground font-sans text-sm">Last updated: July 1, 2026</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-3xl py-12 space-y-10">
          {SECTIONS.map((section, i) => (
            <section key={i}>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">{i + 1}. {section.title}</h2>
              <p className="text-foreground/80 font-sans text-base leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
