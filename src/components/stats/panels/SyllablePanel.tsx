import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import { gradeLevel } from '../helpers';
import type { PanelProps } from '../types';

export function SyllablePanel({ stats }: PanelProps) {
  const avgSyllablesPerWord =
    stats.words > 0
      ? (stats.totalSyllables / stats.words).toFixed(2)
      : '0.00';

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Total Syllables" value={stats.totalSyllables} isGreen />
        <StatBox label="Words" value={stats.words} isGreen />
        <StatBox label="Avg Syllables / Word" value={avgSyllablesPerWord} />
        <StatBox label="Sentences" value={stats.sentences} />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Flesch Score" value={stats.fleschKincaid} />
        <StatBox
          label="Grade Level"
          value={stats.words > 0 ? gradeLevel(stats.fleschKincaid) : '-'}
        />
      </div>
      <Divider />
      <div className="grid grid-cols-1 gap-1">
        <StatBox label="Longest Word" value={stats.longestWord || '-'} />
        <StatBox label="Shortest Word" value={stats.shortestWord || '-'} />
      </div>
    </>
  );
}
