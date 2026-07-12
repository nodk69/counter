import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import type { PanelProps } from '../types';

export function WordCountingPanel({ stats }: PanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Words" value={stats.words} isGreen />
        <StatBox label="Characters (spaces)" value={stats.charWithSpaces} isGreen />
        <StatBox label="Characters (no spaces)" value={stats.charNoSpaces} isGreen />
        <StatBox label="Sentences" value={stats.sentences} isGreen />
        <StatBox label="Paragraphs" value={stats.paragraphs} isGreen />
        <StatBox label="Unique Words" value={stats.uniqueWords} isGreen />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Reading Time" value={`${stats.readingTime} min`} />
        <StatBox label="Speaking Time" value={`${stats.speakingTime} min`} />
      </div>
      <Divider />
      <div className="grid grid-cols-1 gap-1">
        <StatBox label="Longest Word" value={stats.longestWord || '-'} />
        <StatBox label="Shortest Word" value={stats.shortestWord || '-'} />
      </div>
    </>
  );
}
