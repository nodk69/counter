import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import type { PanelProps } from '../types';

export function CharacterPanel({ stats }: PanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Characters (with spaces)" value={stats.charWithSpaces} isGreen />
        <StatBox label="Characters (no spaces)" value={stats.charNoSpaces} isGreen />
        <StatBox label="Words" value={stats.words} isGreen />
        <StatBox label="Sentences" value={stats.sentences} isGreen />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Avg Word Length" value={`${stats.avgWordLength} chars`} />
        <StatBox label="Unique Words" value={stats.uniqueWords} />
      </div>
      <Divider />
      <div className="grid grid-cols-1 gap-1">
        <StatBox label="Longest Word" value={stats.longestWord || '-'} />
        <StatBox label="Shortest Word" value={stats.shortestWord || '-'} />
      </div>
    </>
  );
}
