export default function Testimonials() {
  const testimonials = [
    {
      quote: "I use counter every time I write a blog post. The readability score alone has made me a better writer. It feels like writing on real paper.",
      author: "Elena M.",
      role: "Content Strategist"
    },
    {
      quote: "As a translator, word counts are everything. This tool is the cleanest one I've found. No ads, no popups, just the exact numbers I need.",
      author: "Tomás R.",
      role: "Freelance Translator"
    },
    {
      quote: "Finally a word counter that doesn't try to upsell me. Does exactly what it says, beautifully. I leave the tab open all day.",
      author: "Yuki T.",
      role: "Novelist"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-16 text-center">What writers say</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="text-primary text-4xl font-serif mb-4 opacity-50">"</div>
              <p className="text-lg font-lora text-foreground leading-relaxed italic mb-8 flex-1">
                {item.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{item.author}</div>
                  <div className="text-sm text-muted-foreground">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
