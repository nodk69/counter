import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import type { PanelProps } from '../types';

export function ParagraphPanel({ stats, analysis }: PanelProps) {
  const avgWordsPerPara =
    stats.paragraphs > 0 ? Math.round(stats.words / stats.paragraphs) : 0;
  const avgSentsPerPara =
    stats.paragraphs > 0
      ? (stats.sentences / stats.paragraphs).toFixed(1)
      : '0';

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Paragraphs" value={stats.paragraphs} isGreen />
        <StatBox label="Sentences" value={stats.sentences} isGreen />
        <StatBox label="Words" value={stats.words} isGreen />
        <StatBox label="Words per Para" value={avgWordsPerPara} isGreen />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Sentences per Para" value={avgSentsPerPara} />
        <StatBox
          label="Avg Sentence Length"
          value={`${stats.avgSentenceLength} words`}
        />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Short Sentences" value={analysis.shortSentences} />
        <StatBox label="Long Sentences" value={analysis.longSentences} />
      </div>
    </>
  );
}
