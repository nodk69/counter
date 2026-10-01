import { Activity, ShieldCheck, FileText } from 'lucide-react';

export default function WhyCounter() {
  return (
    <section className="py-16" id="about">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-10 text-center">Why counter?</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:border-primary/30 transition-colors h-full flex flex-col">
            <div className="w-12 h-12 mb-6 text-primary flex items-center justify-center rounded-lg bg-primary/10">
              <Activity className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 font-serif">Real-time Statistics</h3>
            <p className="text-muted-foreground leading-relaxed text-sm flex-1 font-sans">
              Watch your word count and readability score update instantly with every keystroke.
            </p>
          </div>
          
          <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:border-primary/30 transition-colors h-full flex flex-col">
            <div className="w-12 h-12 mb-6 text-primary flex items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 font-serif">Privacy First</h3>
            <p className="text-muted-foreground leading-relaxed text-sm flex-1 font-sans">
              Your text never leaves your browser. No databases, no trackers, no worries.
            </p>
          </div>
          
          <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:border-primary/30 transition-colors h-full flex flex-col">
            <div className="w-12 h-12 mb-6 text-primary flex items-center justify-center rounded-lg bg-primary/10">
              <FileText className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3 font-serif">Multiple Export Formats</h3>
            <p className="text-muted-foreground leading-relaxed text-sm flex-1 font-sans">
              Download your work as plain text, Markdown, Word (.doc), or PDF reports.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
