import { useState } from 'react';
import { Link } from 'wouter';
import { Mail, MessageSquare, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title="Contact counter.io — Get in Touch"
        description="Have a question, feature request, or feedback? Get in touch with the counter.io team."
      />
      <Header />
      <main className="flex-1">
        <div className="bg-muted/30 border-b border-border py-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="text-xs font-sans text-muted-foreground mb-2">
              <Link href="/" className="hover:text-primary">Home</Link> › Contact
            </div>
            <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Get in Touch</h1>
            <p className="text-muted-foreground font-sans">Questions, feedback, or feature requests — we'd love to hear from you.</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-xl py-12">
          {submitted ? (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Message Sent!</h2>
              <p className="text-muted-foreground font-sans mb-6">Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <Link href="/" className="text-primary hover:underline font-sans text-sm">← Back to Word Counter</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground font-sans mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground font-sans mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground font-sans mb-1.5">Subject</label>
                <select
                  value={form.subject}
                  onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  {['General', 'Bug Report', 'Feature Request', 'SEO Partnership', 'Press Inquiry'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground font-sans mb-1.5">Message</label>
                <textarea
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              <button type="submit"
                className="w-full py-3 rounded-lg bg-primary text-white font-medium font-sans hover:bg-primary/90 transition-colors">
                Send Message →
              </button>
            </form>
          )}

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card">
              <Mail className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-serif font-semibold text-foreground text-sm mb-1">Email</h3>
              <p className="text-xs text-muted-foreground font-sans">hello@counter.app</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <MessageSquare className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-serif font-semibold text-foreground text-sm mb-1">Response Time</h3>
              <p className="text-xs text-muted-foreground font-sans">Usually within 24 hours</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
