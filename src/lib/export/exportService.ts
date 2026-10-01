
export interface ExportStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

export interface ExportParams {
  format: 'pdf' | 'docx' | 'html' | 'txt' | 'markdown';
  title?: string;
  html: string;
  stats: ExportStats;
}

/**
 * Builds a shared export HTML template used by HTML, PDF, and DOCX.
 */
export function buildHtmlTemplate(
  title: string | undefined,
  htmlContent: string,
  stats: ExportStats,
  format: 'html' | 'pdf' | 'docx'
): string {
  const displayTitle = title || 'Untitled Document';
  const titleHtml = title ? `<h1 class="document-title">${title}</h1>` : '';
  const dateStr = new Date().toLocaleString(undefined, {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  // DOCX rendering needs simple tables since Word does not support CSS grid/flex well.
  const statsHtml = format === 'docx'
    ? `<table style="width: 100%; max-width: 400px; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 6px 0; font-weight: bold; width: 60%; font-family: 'Arial', sans-serif; font-size: 11pt;">Words:</td>
          <td style="padding: 6px 0; font-family: 'Arial', sans-serif; font-size: 11pt;">${stats.words}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; font-family: 'Arial', sans-serif; font-size: 11pt;">Characters:</td>
          <td style="padding: 6px 0; font-family: 'Arial', sans-serif; font-size: 11pt;">${stats.characters}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; font-family: 'Arial', sans-serif; font-size: 11pt;">Characters (No Spaces):</td>
          <td style="padding: 6px 0; font-family: 'Arial', sans-serif; font-size: 11pt;">${stats.charactersNoSpaces}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; font-family: 'Arial', sans-serif; font-size: 11pt;">Sentences:</td>
          <td style="padding: 6px 0; font-family: 'Arial', sans-serif; font-size: 11pt;">${stats.sentences}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; font-family: 'Arial', sans-serif; font-size: 11pt;">Paragraphs:</td>
          <td style="padding: 6px 0; font-family: 'Arial', sans-serif; font-size: 11pt;">${stats.paragraphs}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; font-family: 'Arial', sans-serif; font-size: 11pt;">Reading Time:</td>
          <td style="padding: 6px 0; font-family: 'Arial', sans-serif; font-size: 11pt;">${stats.readingTime} min</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: bold; font-family: 'Arial', sans-serif; font-size: 11pt;">Speaking Time:</td>
          <td style="padding: 6px 0; font-family: 'Arial', sans-serif; font-size: 11pt;">${stats.speakingTime} min</td>
        </tr>
      </table>`
    : `<div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Words</span>
          <span class="stat-value">${stats.words}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Characters</span>
          <span class="stat-value">${stats.characters}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Characters (No Spaces)</span>
          <span class="stat-value">${stats.charactersNoSpaces}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Sentences</span>
          <span class="stat-value">${stats.sentences}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Paragraphs</span>
          <span class="stat-value">${stats.paragraphs}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Reading Time</span>
          <span class="stat-value">${stats.readingTime} min</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Speaking Time</span>
          <span class="stat-value">${stats.speakingTime} min</span>
        </div>
      </div>`;

  const fontImport = format === 'html'
    ? `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayTitle}</title>
  <style>
    ${fontImport}

    body {
      font-family: ${format === 'html' ? "'Lora', 'Georgia', serif" : "Georgia, Cambria, 'Times New Roman', serif"};
      font-size: 16px;
      line-height: 1.7;
      color: #1f2937;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 24px;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: ${format === 'html' ? "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"};
      color: #111827;
      font-weight: 700;
      margin-top: 1.6em;
      margin-bottom: 0.6em;
      line-height: 1.3;
    }

    h1.document-title {
      font-size: 2.25rem;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 0.5em;
      margin-top: 0;
      margin-bottom: 2rem;
    }

    h1 { font-size: 1.85rem; }
    h2 { font-size: 1.45rem; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.25em; }
    h3 { font-size: 1.2rem; }

    p {
      margin-top: 0;
      margin-bottom: 1.2em;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 1.2em;
      padding-left: 1.6em;
    }

    li {
      margin-bottom: 0.3em;
    }

    li p {
      margin: 0;
    }

    a {
      color: #7c3aed;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.6em 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.875rem;
    }

    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px 12px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #111827;
    }

    tr:nth-child(even) {
      background-color: #fcfcfd;
    }

    blockquote {
      border-left: 4px solid #7c3aed;
      padding-left: 1.25rem;
      margin: 1.6em 0;
      color: #4b5563;
      font-style: italic;
    }

    pre {
      background-color: #f3f4f6;
      border-radius: 6px;
      padding: 1rem;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      margin: 1.6em 0;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      background-color: #f3f4f6;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    pre code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
    }

    mark {
      background-color: #fef08a;
      padding: 0.15em 0.25em;
      border-radius: 2px;
    }

    s {
      text-decoration: line-through;
      color: #6b7280;
    }

    /* Print & PDF Page Break Optimizations */
    .page-break-before {
      page-break-before: always;
      break-before: page;
    }

    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      break-after: avoid;
    }

    p, li, blockquote, tr, pre {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Stats Section Styles */
    .stats-section {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 2px dashed #e5e7eb;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .stats-title {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 1.35rem;
      font-weight: 700;
      color: #111827;
      margin-top: 0;
      margin-bottom: 1.25rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .stat-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 0.75rem 1rem;
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #6b7280;
      display: block;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .export-timestamp {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.75rem;
      color: #9ca3af;
      text-align: right;
      margin-top: 3rem;
    }

    @media print {
      body {
        padding: 0;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="content-wrapper">
    ${titleHtml}
    <div class="editor-content">
      ${htmlContent}
    </div>
    
    <div class="page-break-before"></div>

    <section class="stats-section">
      <h2 class="stats-title">Document Statistics</h2>
      ${statsHtml}
      <div class="export-timestamp">
        Exported on ${dateStr}
      </div>
    </section>
  </div>
</body>
</html>`;
}

/**
 * Reusable export service to handle file exports with high quality and lazy-loaded libraries.
 */
export async function exportDocument({
  format,
  title,
  html,
  stats,
}: ExportParams): Promise<void> {
  const displayTitle = title || 'document';
  const fileBasename = displayTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'document';

  // 1. Lazy-load file-saver
  const fileSaverModule = await import('file-saver');
  const saveAs = fileSaverModule.saveAs || fileSaverModule.default?.saveAs || fileSaverModule.default;
  if (typeof saveAs !== 'function') {
    throw new Error('Failed to load file-saver library.');
  }

  // 2. Export according to format
  switch (format) {
    case 'txt': {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const plainText = tempDiv.innerText || tempDiv.textContent || '';

      let textFileContent = '';
      if (title) {
        textFileContent += `${title}\n${'='.repeat(title.length)}\n\n`;
      }
      textFileContent += plainText.trim() + '\n\n';
      textFileContent += `----------------------------------------\n`;
      textFileContent += `Document Statistics\n\n`;
      textFileContent += `Words: ${stats.words}\n`;
      textFileContent += `Characters: ${stats.characters}\n`;
      textFileContent += `Characters (No Spaces): ${stats.charactersNoSpaces}\n`;
      textFileContent += `Sentences: ${stats.sentences}\n`;
      textFileContent += `Paragraphs: ${stats.paragraphs}\n`;
      textFileContent += `Reading Time: ${stats.readingTime} min\n`;
      textFileContent += `Speaking Time: ${stats.speakingTime} min\n`;

      const blob = new Blob([textFileContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${fileBasename}.txt`);
      break;
    }

    case 'markdown': {
      // Lazy-load turndown
      const TurndownServiceModule = await import('turndown');
      const TurndownService = TurndownServiceModule.default || TurndownServiceModule;
      const turndown = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
      });

      const markdownBody = turndown.turndown(html);

      let markdownFileContent = '';
      if (title) {
        markdownFileContent += `# ${title}\n\n`;
      }
      markdownFileContent += markdownBody.trim() + '\n\n';
      markdownFileContent += `## Document Statistics\n\n`;
      markdownFileContent += `Words: ${stats.words}\n`;
      markdownFileContent += `Characters: ${stats.characters}\n`;
      markdownFileContent += `Characters (No Spaces): ${stats.charactersNoSpaces}\n`;
      markdownFileContent += `Sentences: ${stats.sentences}\n`;
      markdownFileContent += `Paragraphs: ${stats.paragraphs}\n`;
      markdownFileContent += `Reading Time: ${stats.readingTime} min\n`;
      markdownFileContent += `Speaking Time: ${stats.speakingTime} min\n`;

      const blob = new Blob([markdownFileContent], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, `${fileBasename}.md`);
      break;
    }

    case 'html': {
      const fullHtml = buildHtmlTemplate(title, html, stats, 'html');
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      saveAs(blob, `${fileBasename}.html`);
      break;
    }

    case 'docx': {
      // Lazy-load buffer and assign to window since html-to-docx depends on global Buffer
      if (typeof window !== 'undefined' && !(window as any).Buffer) {
        const { Buffer } = await import('buffer');
        (window as any).Buffer = Buffer;
      }

      // Lazy-load html-to-docx
      // @ts-ignore
      const htmlToDocxModule = await import('html-to-docx');
      const HTMLtoDOCX = htmlToDocxModule.default || htmlToDocxModule;
      if (typeof HTMLtoDOCX !== 'function') {
        throw new Error('Failed to load html-to-docx library.');
      }

      const fullHtml = buildHtmlTemplate(title, html, stats, 'docx');

      const options = {
        title: title || 'Document',
        orientation: 'portrait' as const,
        margins: {
          top: 1440,    // 1 inch
          right: 1440,
          bottom: 1440,
          left: 1440,
        },
        decodeUnicode: true,
      };

      const docxBuffer = await HTMLtoDOCX(fullHtml, undefined, options);
      const blob = new Blob([docxBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      saveAs(blob, `${fileBasename}.docx`);
      break;
    }

    case 'pdf': {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Extract plain text from html
      let plainText = '';
      if (typeof document !== 'undefined') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        plainText = (tempDiv.innerText || tempDiv.textContent || '').trim();
      }

      // ── Top Brand Header Accent ──────────────────────────────────
      doc.setFillColor(124, 58, 237); // Primary brand purple #7c3aed
      doc.rect(margin, y, contentWidth, 2, 'F');
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(124, 58, 237);
      doc.text('COUNTER.IO', margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(107, 114, 128); // Gray 500
      const dateStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.text(`Generated on ${dateStr}`, pageWidth - margin, y, { align: 'right' });
      y += 10;

      // ── Document Title ───────────────────────────────────────────
      const docTitle = title || 'Document Statistics Report';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(17, 24, 39); // Gray 900
      const titleLines = doc.splitTextToSize(docTitle, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 6.5 + 4;

      // Subtle separator line
      doc.setDrawColor(229, 231, 235); // Gray 200
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      // ── Section Title: Document Statistics ───────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(31, 41, 55); // Gray 800
      doc.text('DOCUMENT STATISTICS', margin, y);
      y += 6;

      // ── Stat Cards Grid (2 columns) ──────────────────────────────
      const statItems = [
        { label: 'Total Words', value: String(stats.words.toLocaleString()) },
        { label: 'Total Characters', value: String(stats.characters.toLocaleString()) },
        { label: 'Characters (No Spaces)', value: String(stats.charactersNoSpaces.toLocaleString()) },
        { label: 'Sentences', value: String(stats.sentences.toLocaleString()) },
        { label: 'Paragraphs', value: String(stats.paragraphs.toLocaleString()) },
        { label: 'Est. Reading Time', value: `${stats.readingTime} min` },
        { label: 'Est. Speaking Time', value: `${stats.speakingTime} min` },
      ];

      const cardWidth = (contentWidth - 6) / 2;
      const cardHeight = 13.5;

      statItems.forEach((item, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cardX = margin + col * (cardWidth + 6);
        const cardY = y + row * (cardHeight + 3.5);

        // Card background & border
        doc.setFillColor(249, 250, 251); // Gray 50
        doc.setDrawColor(229, 231, 235); // Gray 200
        doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

        // Label
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(107, 114, 128); // Gray 500
        doc.text(item.label.toUpperCase(), cardX + 3.5, cardY + 4.5);

        // Value
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(17, 24, 39); // Gray 900
        doc.text(item.value, cardX + 3.5, cardY + 10.5);
      });

      const numRows = Math.ceil(statItems.length / 2);
      y += numRows * (cardHeight + 3.5) + 8;

      // ── Document Content / Excerpt Section ────────────────────────
      if (plainText.length > 0) {
        if (y > pageHeight - 40) {
          doc.addPage();
          y = margin;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(31, 41, 55);
        doc.text('DOCUMENT CONTENT', margin, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(55, 65, 81); // Gray 700

        const contentLines = doc.splitTextToSize(plainText, contentWidth);
        const lineHeight = 5;

        for (let i = 0; i < contentLines.length; i++) {
          if (y > pageHeight - margin - 12) {
            doc.addPage();
            y = margin;
          }
          doc.text(contentLines[i], margin, y);
          y += lineHeight;
        }
      }

      // ── Page numbering on all pages ──────────────────────────────
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175); // Gray 400
        doc.text(`counter.io • Privacy-First Writing Tools`, margin, pageHeight - 8);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
      }

      doc.save(`${fileBasename}.pdf`);
      break;
    }

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
