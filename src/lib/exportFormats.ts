import type { TextStats } from '@/hooks/useTextStats';
import type { ContentAnalysis } from '@/hooks/useContentAnalysis';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── DOCX (Word-compatible HTML) ─────────────────────────────────────────────

export function exportDocx(text: string, filename = 'document') {
  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => `<p>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>`)
    .join('\n');

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 72pt; color: #111; }
    p    { margin: 0 0 12pt; }
  </style>
</head>
<body>
${paragraphs}
</body>
</html>`;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  downloadBlob(blob, `${filename}.doc`);
}

// ─── JSON ─────────────────────────────────────────────────────────────────────

export function exportJson(
  text: string,
  stats: TextStats,
  analysis: ContentAnalysis,
  mode: string,
  filename = 'analysis'
) {
  const data = {
    metadata: {
      exportedAt: new Date().toISOString(),
      tool:       'counter.io',
      writingMode: mode,
    },
    content: {
      text,
      wordCount:       stats.words,
      characterCount:  stats.charWithSpaces,
      charNoSpaces:    stats.charNoSpaces,
      sentenceCount:   stats.sentences,
      paragraphCount:  stats.paragraphs,
      uniqueWords:     stats.uniqueWords,
      longestWord:     stats.longestWord,
    },
    readability: {
      fleschKincaid:      stats.fleschKincaid,
      avgWordLength:      stats.avgWordLength,
      avgSentenceLength:  stats.avgSentenceLength,
      totalSyllables:     stats.totalSyllables,
      readingTimeMinutes: Math.round(stats.readingTime * 10) / 10,
      speakingTimeMinutes: Math.round(stats.speakingTime * 10) / 10,
    },
    contentScore: {
      score:       analysis.contentScore,
      label:       analysis.scoreLabel,
      dimensions:  analysis.dimensions.map(d => ({
        label:  d.label,
        score:  d.score,
        weight: d.weight,
        status: d.status,
        tip:    d.tip,
      })),
    },
    writingQuality: {
      passiveVoiceRate:   Math.round(analysis.passiveRate * 10) / 10,
      passiveVoiceCount:  analysis.passiveCount,
      passiveSamples:     analysis.passiveSamples,
      weaselWords:        analysis.weaselWords,
      vocabularyDiversity: {
        ttr:           Math.round(analysis.ttr * 1000) / 1000,
        label:         analysis.ttrLabel,
        repeatedWords: analysis.repeatedWords,
      },
    },
    advancedInsights: {
      sentenceVarietyScore: analysis.sentenceVarietyScore,
      sentenceVarietyLabel: analysis.sentenceVarietyLabel,
      topPhrases: analysis.topPhrases,
      properNounDensity: analysis.properNounDensity,
      questionCount: analysis.questionCount,
      exclamationCount: analysis.exclamationCount,
      firstPersonRatio: analysis.firstPersonRatio,
      secondPersonRatio: analysis.secondPersonRatio,
    },
    keywords:   (Array.isArray(stats.wordDensity) ? stats.wordDensity : []).slice(0, 20),
    benchmarks: analysis.matchingBenchmarks,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
}
