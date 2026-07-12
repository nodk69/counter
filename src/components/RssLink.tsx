/**
 * RssLink — injects <link rel="alternate" type="application/rss+xml"> into
 * <head> while the component is mounted, then removes it on unmount.
 *
 * Mount this on pages that have an RSS feed (e.g. BlogPage) so the browser
 * address bar shows the RSS subscribe indicator on those pages only.
 *
 * Usage:
 *   <RssLink title="counter.io — Writing Blog" href="/feed.xml" />
 */
import { useEffect } from 'react';

interface Props {
  title: string;
  href: string;
}

export default function RssLink({ title, href }: Props) {
  useEffect(() => {
    const el = document.createElement('link');
    el.rel   = 'alternate';
    el.type  = 'application/rss+xml';
    el.title = title;
    el.href  = href;
    el.setAttribute('data-rss-link', 'true');
    document.head.appendChild(el);

    return () => { el.remove(); };
  }, [title, href]);

  return null;
}
