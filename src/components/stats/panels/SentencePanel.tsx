import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import type { PanelProps } from '../types';

export function SentencePanel({ stats }: PanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Sentences" value={stats.sentences} isGreen />
        <StatBox label="Words" value={stats.words} isGreen />
        <StatBox label="Paragraphs" value={stats.paragraphs} isGreen />
        <StatBox label="Unique Words" value={stats.uniqueWords} isGreen />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox
          label="Avg Sentence Length"
          value={`${stats.avgSentenceLength} words`}
        />
        <StatBox label="Avg Word Length" value={`${stats.avgWordLength} chars`} />
      </div>
      <Divider />
      <div className="grid grid-cols-1 gap-1">
        <StatBox label="Longest Word" value={stats.longestWord || '-'} />
        <StatBox label="Shortest Word" value={stats.shortestWord || '-'} />
      </div>
    </>
  );
}
