import type { ContentAnalysis } from '@/hooks/useContentAnalysis';
import type { TextStats } from '@/hooks/useTextStats';

function formatTime(minutes: number): string {
  if (minutes < 1) return `${Math.round(minutes * 60)}s`;
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function scoreColor(score: number): string {
  if (score >= 85) return '#16a34a';
  if (score >= 70) return '#2563eb';
  if (score >= 50) return '#d97706';
  return '#dc2626';
}

function statusColor(status: 'good' | 'warn' | 'bad'): string {
  return status === 'good' ? '#16a34a' : status === 'warn' ? '#d97706' : '#dc2626';
}

function statusIcon(status: 'good' | 'warn' | 'bad'): string {
  return status === 'good' ? '✓' : status === 'warn' ? '⚠' : '✗';
}

export function generateReportHTML(
  text: string,
  stats: TextStats,
  analysis: ContentAnalysis,
  mode: string
): string {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const excerpt = text.trim().slice(0, 200).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const color = scoreColor(analysis.contentScore);

  const dimensionRows = analysis.dimensions.map(d => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">
        <span style="color:${statusColor(d.status)};font-weight:600;">${statusIcon(d.status)}</span>
        &nbsp;${d.label}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
        <div style="display:inline-flex;align-items:center;gap:8px;width:100%;">
          <div style="flex:1;height:6px;background:#e5e7eb;border-radius:4px;overflow:hidden;min-width:80px;">
            <div style="height:100%;width:${d.score}%;background:${statusColor(d.status)};border-radius:4px;"></div>
          </div>
          <span style="font-family:monospace;font-size:12px;color:#6b7280;min-width:28px;">${d.score}</span>
        </div>
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:12px;color:#6b7280;">${d.tip}</td>
    </tr>
  `).join('');

  const fillerRows = analysis.weaselWords.length > 0
    ? analysis.weaselWords.map(f => `
      <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;font-size:13px;margin:3px;">
        "${f.word}" <span style="font-family:monospace;color:#d97706;">×${f.count}</span>
      </span>`).join('')
    : '<span style="color:#16a34a;">None found — excellent writing discipline!</span>';

  const passiveSampleRows = analysis.passiveSamples.length > 0
    ? analysis.passiveSamples.map(s => `
      <div style="padding:6px 12px;border-left:3px solid #fbbf24;font-style:italic;color:#6b7280;font-size:13px;margin:4px 0;">"${s.replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</div>`).join('')
    : '';

  const keywordRows = (Array.isArray(stats.wordDensity) ? stats.wordDensity : []).slice(0, 10).map((w, i) => `
    <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
      <td style="padding:6px 12px;font-family:monospace;">${w.word}</td>
      <td style="padding:6px 12px;text-align:center;">${w.count}</td>
      <td style="padding:6px 12px;">
        <div style="height:5px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${(w.count / ((Array.isArray(stats.wordDensity) && stats.wordDensity.length > 0 ? stats.wordDensity[0]?.count : 1) || 1)) * 100}%;background:#7c3aed;border-radius:4px;"></div>
        </div>
      </td>
      <td style="padding:6px 12px;text-align:right;font-size:12px;color:#6b7280;">${((w.count / stats.words) * 100).toFixed(1)}%</td>
    </tr>
  `).join('');

  const benchmarkChips = analysis.matchingBenchmarks.length > 0
    ? analysis.matchingBenchmarks.map(b => `
      <span style="padding:4px 12px;background:#ede9fe;border:1px solid #c4b5fd;border-radius:20px;font-size:12px;color:#6d28d9;margin:3px;display:inline-block;">✓ ${b}</span>`).join('')
    : '<span style="color:#6b7280;font-size:13px;">Write more to match a content type.</span>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Writing Analysis Report — counter.io</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111827; background: #fff; padding: 32px; max-width: 860px; margin: 0 auto; }
  h1 { font-size: 22px; font-weight: 700; }
  h2 { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; }
  .section { margin-bottom: 28px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f3f4f6; padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
  @media print {
    body { padding: 16px; }
    .no-print { display: none; }
    .section { page-break-inside: avoid; }
  }
</style>
</head>
<body>

<!-- Header -->
<div class="section" style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #111827;margin-bottom:28px;">
  <div>
    <div style="font-size:13px;color:#7c3aed;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">counter.io</div>
    <h1>Writing Analysis Report</h1>
    <div style="font-size:13px;color:#6b7280;margin-top:6px;">Generated ${date} · Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}</div>
  </div>
  <div style="text-align:center;">
    <svg width="90" height="90" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" stroke-width="8"/>
      <circle cx="50" cy="50" r="44" fill="none" stroke="${color}" stroke-width="8"
        stroke-dasharray="${(analysis.contentScore / 100) * 276.5} 276.5"
        stroke-linecap="round" transform="rotate(-90 50 50)"/>
      <text x="50" y="47" text-anchor="middle" font-size="22" font-weight="700" font-family="monospace" fill="${color}">${analysis.contentScore}</text>
      <text x="50" y="61" text-anchor="middle" font-size="9" fill="#6b7280">/100</text>
    </svg>
    <div style="font-size:12px;font-weight:700;color:${color};">${analysis.scoreLabel}</div>
    <div style="font-size:11px;color:#9ca3af;">Content Score</div>
  </div>
</div>

<!-- Summary Stats -->
<div class="section">
  <h2>Summary Statistics</h2>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
    ${[
      ['Words', stats.words.toLocaleString()],
      ['Characters', stats.charWithSpaces.toLocaleString()],
      ['Sentences', stats.sentences.toLocaleString()],
      ['Paragraphs', stats.paragraphs.toLocaleString()],
      ['Unique Words', stats.uniqueWords.toLocaleString()],
      ['Reading Time', formatTime(stats.readingTime)],
      ['Speaking Time', formatTime(stats.speakingTime)],
      ['Readability', stats.words > 0 ? String(stats.fleschKincaid) : '—'],
    ].map(([label, val]) => `
      <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af;margin-bottom:4px;">${label}</div>
        <div style="font-family:monospace;font-size:20px;font-weight:700;color:#111827;">${val}</div>
      </div>`).join('')}
  </div>
</div>

<!-- Content Score Breakdown -->
<div class="section">
  <h2>Content Score Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th style="width:25%;">Dimension</th>
        <th style="width:40%;">Score</th>
        <th>Feedback</th>
      </tr>
    </thead>
    <tbody>${dimensionRows}</tbody>
  </table>
</div>

<!-- Filler Words -->
<div class="section">
  <h2>Weasel Words <span style="font-size:12px;font-weight:400;color:#6b7280;">(${analysis.weaselWords.reduce((s,f)=>s+f.count,0)} found)</span></h2>
  <div style="padding:12px;">${fillerRows}</div>
</div>

<!-- Passive Voice -->
<div class="section">
  <h2>Passive Voice <span style="font-size:12px;font-weight:400;color:#6b7280;">(${analysis.passiveRate.toFixed(0)}% of sentences)</span></h2>
  <div style="padding:12px 12px 6px;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
      <div style="flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
        <div style="height:100%;width:${Math.min(100,analysis.passiveRate)}%;background:${analysis.passiveRate > 20 ? '#d97706' : '#16a34a'};border-radius:4px;"></div>
      </div>
      <span style="font-family:monospace;font-size:13px;color:#6b7280;">${analysis.passiveCount} sentences</span>
    </div>
    ${passiveSampleRows}
  </div>
</div>

<!-- Advanced Insights -->
<div class="section">
  <h2>Advanced Insights</h2>
  <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:4px 0 8px;">
    <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af;margin-bottom:4px;">Sentence Variety</div>
      <div style="font-family:monospace;font-size:20px;font-weight:700;color:#111827;">${analysis.sentenceVarietyScore.toFixed(0)}%</div>
      <div style="font-size:12px;color:#6b7280;margin-top:2px;">${analysis.sentenceVarietyLabel}</div>
    </div>
    <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af;margin-bottom:4px;">Proper Noun Density</div>
      <div style="font-family:monospace;font-size:20px;font-weight:700;color:#111827;">${analysis.properNounDensity.toFixed(1)}%</div>
      <div style="font-size:12px;color:#6b7280;margin-top:2px;">Names and organizations detected</div>
    </div>
  </div>
  <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af;margin-bottom:8px;">Repeated Phrases</div>
    ${analysis.topPhrases.length > 0 ? analysis.topPhrases.map(phrase => `<span style="padding:3px 8px;background:#f3f4f6;border-radius:6px;font-size:12px;margin:2px;display:inline-block;">${phrase.phrase} <span style="font-family:monospace;color:#9ca3af;">×${phrase.count}</span></span>`).join('') : '<span style="color:#6b7280;font-size:13px;">No repeated phrases detected.</span>'}
  </div>
</div>

<!-- Vocabulary Diversity -->
<div class="section">
  <h2>Vocabulary Diversity</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:4px 0 12px;">
    <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
      <div style="font-family:monospace;font-size:22px;font-weight:700;">${stats.uniqueWords.toLocaleString()}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:2px;">Unique Words</div>
    </div>
    <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
      <div style="font-family:monospace;font-size:22px;font-weight:700;">${stats.words.toLocaleString()}</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:2px;">Total Words</div>
    </div>
    <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
      <div style="font-family:monospace;font-size:22px;font-weight:700;color:#7c3aed;">${(analysis.ttr * 100).toFixed(0)}%</div>
      <div style="font-size:11px;color:#9ca3af;margin-top:2px;">Diversity · ${analysis.ttrLabel}</div>
    </div>
  </div>
  ${analysis.repeatedWords.length > 0 ? `
    <div style="font-size:12px;color:#6b7280;margin-bottom:6px;padding:0 4px;">Most repeated words:</div>
    <div style="padding:0 4px;">${analysis.repeatedWords.map(w=>`<span style="padding:3px 8px;background:#f3f4f6;border-radius:6px;font-size:12px;margin:2px;display:inline-block;">${w.word} <span style="font-family:monospace;color:#9ca3af;">×${w.count}</span></span>`).join('')}</div>
  ` : ''}
</div>

<!-- Top Keywords -->
${(Array.isArray(stats.wordDensity) ? stats.wordDensity : []).length > 0 ? `
<div class="section">
  <h2>Top Keywords</h2>
  <table>
    <thead>
      <tr><th>Word</th><th style="text-align:center;">Count</th><th>Frequency</th><th style="text-align:right;">Density</th></tr>
    </thead>
    <tbody>${keywordRows}</tbody>
  </table>
</div>` : ''}

<!-- Word Count Benchmarks -->
<div class="section">
  <h2>Word Count Benchmarks</h2>
  <div style="padding:8px 0;">${benchmarkChips}</div>
</div>

<!-- Text Excerpt -->
${text.trim().length > 0 ? `
<div class="section">
  <h2>Text Excerpt</h2>
  <div style="padding:12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;font-size:13px;color:#374151;line-height:1.6;font-style:italic;">
    "${excerpt}${text.trim().length > 200 ? '…' : ''}"
  </div>
</div>` : ''}

<!-- Footer -->
<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;display:flex;justify-content:space-between;">
  <span>Generated by counter.io — Free Writing Tools</span>
  <span>${date}</span>
</div>

<script>
  window.onload = function() { window.print(); }
</script>
</body>
</html>`;
}

export function exportToPdf(
  text: string,
  stats: TextStats,
  analysis: ContentAnalysis,
  mode: string
): void {
  const html = generateReportHTML(text, stats, analysis, mode);
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups for this site to download the PDF report.');
    return;
  }
  win.document.write(html);
  win.document.close();
}
