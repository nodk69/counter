export default function BlogSection() {
  const articles = [
    {
      title: "How to Improve Your Readability Score",
      author: "Sarah Chen",
      time: "5 min read",
      date: "Oct 12",
      excerpt: "Writing that is easy to read reaches a wider audience. Learn the simple tweaks that can drop your reading level without dumbing down your ideas."
    },
    {
      title: "10 Writing Tips for SEO Success",
      author: "Marcus Webb",
      time: "7 min read",
      date: "Oct 08",
      excerpt: "Word density isn't the only metric that matters. Discover how to naturally integrate keywords while maintaining a human voice."
    },
    {
      title: "Character Limits Across Social Platforms",
      author: "Priya Nair",
      time: "4 min read",
      date: "Sep 29",
      excerpt: "From Twitter's strict boundaries to LinkedIn's generous limits, here's everything you need to know about fitting your message into the box."
    }
  ];

  return (
    <section className="py-20" id="blog">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">From the blog</h2>
          <a href="#" className="text-primary hover:text-primary-hover font-medium text-sm transition-colors">View all →</a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <a key={idx} href="#" className="block group">
              <div className="h-full bg-card border border-border p-6 rounded-lg transition-colors hover:border-primary/40 flex flex-col">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-mono uppercase tracking-wider">
                  <span>{article.time}</span>
                  <span>·</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {article.excerpt}
                </p>
                <div className="text-sm font-medium text-foreground pt-4 border-t border-border/50 mt-auto">
                  By {article.author}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
