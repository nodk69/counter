import { useEffect } from 'react';
import { Link } from 'wouter';
import { Clock, Calendar, Twitter, Linkedin, Facebook, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import { getBlogBySlug, BLOG_POSTS } from '@/data/blog';

function TableOfContents({ content }: { content: string }) {
  const headers = content.match(/^## .+/gm)?.map(h => h.replace('## ', '')) ?? [];
  if (headers.length === 0) return null;
  return (
    <div className="p-5 rounded-xl border border-border bg-muted/30 mb-8">
      <h3 className="font-serif text-base font-semibold text-foreground mb-3">Table of Contents</h3>
      <ol className="space-y-1.5">
        {headers.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm font-sans">
            <span className="font-mono text-xs text-muted-foreground mt-0.5 flex-shrink-0">{i + 1}.</span>
            <span className="text-foreground/80 hover:text-primary cursor-pointer transition-colors">{h}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ContentRenderer({ content }: { content: string }) {
  const lines = content.trim().split('\n');
  const elements: React.ReactElement[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="font-serif text-2xl font-bold text-foreground mt-8 mb-4">{line.replace('## ', '')}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="font-serif text-xl font-semibold text-foreground mt-6 mb-3">{line.replace('### ', '')}</h3>);
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].replace('- ', ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-foreground/80 font-sans text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\./.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-2 my-4 list-decimal list-inside">
          {items.map((item, j) => (
            <li key={j} className="text-foreground/80 font-sans text-base">
              <span dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.startsWith('| ')) {
      // table
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full text-sm font-sans border border-border rounded-lg overflow-hidden">
            <tbody>
              {tableLines.filter(r => !r.match(/^\|[-| ]+\|$/)).map((row, j) => {
                const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1);
                return j === 0 ? (
                  <tr key={j} className="bg-muted/50 border-b border-border">
                    {cells.map((cell, k) => <th key={k} className="py-2 px-3 text-left font-semibold text-foreground">{cell.trim()}</th>)}
                  </tr>
                ) : (
                  <tr key={j} className="border-b border-border hover:bg-muted/20">
                    {cells.map((cell, k) => <td key={k} className="py-2 px-3 text-foreground/80">{cell.trim()}</td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.trim() !== '') {
      elements.push(
        <p key={i} className="text-foreground/80 font-sans text-base leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }}
        />
      );
    }
    i++;
  }

  return <div>{elements}</div>;
}

function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-foreground text-sm font-mono">$1</code>');
}

export default function BlogPostPage({ slug }: { slug: string }) {
  const post = getBlogBySlug(slug);
  const relatedPosts = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold mb-2">Post Not Found</h1>
            <Link href="/blog" className="text-primary hover:underline font-sans text-sm">← Back to blog</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MetaTags
        title={post.title}
        description={post.excerpt}
        type="article"
        publishedTime={post.date}
        author={post.author}
      />
      <SchemaMarkup
        type="article"
        data={{
          name: post.title,
          description: post.excerpt,
          slug: post.slug,
          datePublished: new Date(post.date).toISOString(),
          author: post.author,
        }}
      />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 max-w-3xl py-10">
          {/* Breadcrumb */}
          <div className="text-xs font-sans text-muted-foreground mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-primary">Blog</Link>
            <span>›</span>
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {post.category}
            </span>
            {post.tags.slice(1).map(tag => (
              <span key={tag} className="text-xs font-sans px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>

          {/* Author + date + share */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-3 text-sm font-sans">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-medium text-foreground">{post.author}</div>
                <div className="text-xs text-muted-foreground">{post.authorTitle}</div>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />{post.date}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />{post.readTime} min read
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-sans">Share:</span>
              {[
                { icon: <Twitter className="w-4 h-4" />, label: 'Twitter', href: '#' },
                { icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', href: '#' },
                { icon: <Facebook className="w-4 h-4" />, label: 'Facebook', href: '#' },
              ].map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="aspect-[16/8] rounded-xl bg-gradient-to-br from-primary/10 via-muted to-muted/40 mb-8 flex items-center justify-center">
            <span className="text-6xl opacity-20 select-none">
              {post.category === 'SEO' ? '🔍' : post.category === 'Writing' ? '✍️' : '📝'}
            </span>
          </div>

          {/* ToC */}
          <TableOfContents content={post.content} />

          {/* Content */}
          <div className="mb-12">
            <ContentRenderer content={post.content} />
          </div>

          {/* Author box */}
          <div className="mb-12 p-6 rounded-xl border border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg flex-shrink-0">
                {post.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="font-serif font-semibold text-lg text-foreground">{post.author}</div>
                <div className="text-sm text-muted-foreground font-sans">{post.authorTitle}</div>
              </div>
            </div>
          </div>

          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-sans mb-12">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Related posts */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-5">Related Posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`}>
                  <div className="group border border-border rounded-xl bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                    <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium mb-2 inline-block">{p.category}</span>
                    <h3 className="font-serif text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
                    <div className="mt-2 text-xs text-muted-foreground font-sans">{p.readTime} min read</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
