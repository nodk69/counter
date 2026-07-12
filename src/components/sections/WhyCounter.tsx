export default function WhyCounter() {
  return (
    <section className="py-16" id="about">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-10 text-center">Why counter?</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-8 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-primary/30 transition-colors h-[280px] flex flex-col">
            <div className="w-12 h-12 mb-6 text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Real-time Statistics</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">Watch your word count and readability score update instantly with every keystroke.</p>
          </div>
          
          <div className="bg-card border border-border p-8 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-primary/30 transition-colors h-[260px] flex flex-col md:mt-8">
            <div className="w-12 h-12 mb-6 text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Privacy First</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">Your text never leaves your browser. No databases, no trackers, no worries.</p>
          </div>
          
          <div className="bg-card border border-border p-8 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-primary/30 transition-colors h-[300px] flex flex-col md:-mt-4">
            <div className="w-12 h-12 mb-6 text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Multiple Export Formats</h3>
            <p className="text-muted-foreground leading-relaxed flex-1">Download your work as plain text or Markdown, ready to paste anywhere.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
