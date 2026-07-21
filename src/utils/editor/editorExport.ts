/**
 * Editor export utilities (delegated to the upgrade exportService).
 * Kept for backward compatibility.
 */

import { exportDocument, type ExportStats } from '@/lib/export/exportService';

/** Simple utility to compute stats from text or HTML for fallback */
function getFallbackStats(textOrHtml: string): ExportStats {
  let text = textOrHtml;
  if (typeof document !== 'undefined' && /<[a-z][\s\S]*>/i.test(textOrHtml)) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textOrHtml;
    text = tempDiv.innerText || tempDiv.textContent || '';
  }

  const charWithSpaces = text.length;
  const charNoSpaces = text.replace(/\s+/g, '').length;
  const wordMatches = text.match(/\b[a-zA-Z0-9_]+\b/g) || [];
  const words = wordMatches.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 0;
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length || 0;
  const readingTime = words > 0 ? Math.ceil(words / 200) : 0;
  const speakingTime = words > 0 ? Math.ceil(words / 130) : 0;

  return {
    words,
    characters: charWithSpaces,
    charactersNoSpaces: charNoSpaces,
    sentences,
    paragraphs,
    readingTime,
    speakingTime,
  };
}

/** Extract a filename base (removes extension) */
function getTitleFromFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
}

/** Export as plain text */
export function exportAsTxt(text: string, filename = 'document.txt') {
  exportDocument({
    format: 'txt',
    title: getTitleFromFilename(filename),
    html: text.replace(/\n/g, '<br>'),
    stats: getFallbackStats(text),
  }).catch(err => {
    console.error('Export TXT failed:', err);
  });
}

/** Export as HTML with styling */
export function exportAsHtml(html: string, filename = 'document.html') {
  exportDocument({
    format: 'html',
    title: getTitleFromFilename(filename),
    html,
    stats: getFallbackStats(html),
  }).catch(err => {
    console.error('Export HTML failed:', err);
  });
}

/** Export as Markdown */
export async function exportAsMarkdown(html: string, filename = 'document.md') {
  await exportDocument({
    format: 'markdown',
    title: getTitleFromFilename(filename),
    html,
    stats: getFallbackStats(html),
  });
}

/** Export as PDF */
export async function exportAsPdf(html: string, filename = 'document.pdf') {
  await exportDocument({
    format: 'pdf',
    title: getTitleFromFilename(filename),
    html,
    stats: getFallbackStats(html),
  });
}

