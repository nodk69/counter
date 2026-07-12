import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import type { PanelProps } from '../types';

export function LinePanel({ stats }: PanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Words" value={stats.words} isGreen />
        <StatBox label="Characters (spaces)" value={stats.charWithSpaces} isGreen />
        <StatBox label="Sentences" value={stats.sentences} isGreen />
        <StatBox label="Paragraphs" value={stats.paragraphs} isGreen />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Unique Words" value={stats.uniqueWords} />
        <StatBox label="Reading Time" value={`${stats.readingTime} min`} />
      </div>
    </>
  );
}
