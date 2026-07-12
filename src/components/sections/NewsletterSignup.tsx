import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Get Our Free Content Writing Checklist
        </h2>
        <p className="text-muted-foreground font-sans mb-6 text-sm leading-relaxed">
          We're building new writing tools every week. Join our early access list to get 
          notified about new features, tools, and exclusive tips — before anyone else.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-6 text-sm font-sans">
          {['50+ writing tips', 'SEO best practices', 'Grammar guide', 'Content templates'].map(item => (
            <span key={item} className="flex items-center gap-1.5 text-foreground/70">
              <Check className="w-3.5 h-3.5 text-primary" />
              {item}
            </span>
          ))}
        </div>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-primary font-medium font-sans py-3">
            <Check className="w-5 h-5" />
            <span>You're in! We'll keep you posted on new tools.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors font-sans whitespace-nowrap"
            >
              Get Early Access →
            </button>
          </form>
        )}

        <p className="mt-3 text-xs text-muted-foreground font-sans">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}
