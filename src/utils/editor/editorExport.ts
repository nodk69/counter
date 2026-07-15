/**
 * Editor export utilities.
 * Each function triggers a browser download of the editor content in the specified format.
 */

/** Download a file with the given content, MIME type, and filename */
function downloadFile(content: string | Blob, filename: string, mimeType?: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Export as plain text */
export function exportAsTxt(text: string, filename = 'document.txt') {
  downloadFile(text, filename, 'text/plain');
}

/** Export as HTML with basic styling */
export function exportAsHtml(html: string, filename = 'document.html') {
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
      line-height: 1.6;
      color: #1a1a1a;
    }
    h1 { font-size: 2rem; margin: 1.5em 0 0.5em; }
    h2 { font-size: 1.5rem; margin: 1.3em 0 0.4em; }
    h3 { font-size: 1.25rem; margin: 1.2em 0 0.3em; }
    p { margin: 0.8em 0; }
    ul, ol { margin: 0.8em 0; padding-left: 1.5em; }
    mark { background-color: #fef08a; padding: 0.1em 0.2em; border-radius: 2px; }
    a { color: #2563eb; text-decoration: underline; }
    s { text-decoration: line-through; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
  downloadFile(fullHtml, filename, 'text/html');
}

/** Export as Markdown (dynamically imports turndown) */
export async function exportAsMarkdown(html: string, filename = 'document.md') {
  const TurndownService = (await import('turndown')).default;
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });
  const markdown = turndown.turndown(html);
  downloadFile(markdown, filename, 'text/markdown');
}

/** Export as PDF (dynamically imports html2pdf.js) */
export async function exportAsPdf(html: string, filename = 'document.pdf') {
  const html2pdf = (await import('html2pdf.js')).default;

  // Create a temporary container with styling
  const container = document.createElement('div');
  container.innerHTML = html;
  container.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.6';
  container.style.color = '#1a1a1a';
  container.style.padding = '20px';
  document.body.appendChild(container);

  await html2pdf()
    .set({
      margin: [15, 15, 15, 15],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(container)
    .save();

  document.body.removeChild(container);
}
