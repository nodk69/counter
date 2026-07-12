export default function PerfectFor() {
  const useCases = [
    {
      title: "Content Writers",
      desc: "Hit exact word limits for blog posts and articles."
    },
    {
      title: "Students & Academics",
      desc: "Perfect for essays requiring strict character constraints."
    },
    {
      title: "SEO Specialists",
      desc: "Analyze word density and optimize meta descriptions."
    },
    {
      title: "Copywriters",
      desc: "Craft precise social media posts and ad copy."
    },
    {
      title: "Translators",
      desc: "Track billing metrics with accurate word and character counts."
    }
  ];

  return (
    <section className="py-16 bg-muted/20 border-y border-border">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-12 text-center">Perfect for...</h2>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {useCases.map((item, idx) => (
            <div key={idx} className="bg-card border border-border px-6 py-4 rounded-full text-center hover:border-primary/50 transition-colors group cursor-default">
              <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-xs text-muted-foreground hidden md:block max-w-[200px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
