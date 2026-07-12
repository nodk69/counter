import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import { fleschLabel, gradeLevel } from '../helpers';
import type { PanelProps } from '../types';

export function ReadabilityPanel({ stats, analysis }: PanelProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox
          label="Flesch Score"
          value={stats.fleschKincaid}
          isGreen={stats.fleschKincaid >= 60}
          sub={stats.words > 0 ? fleschLabel(stats.fleschKincaid) : undefined}
        />
        <StatBox
          label="Grade Level"
          value={stats.words > 0 ? gradeLevel(stats.fleschKincaid) : '-'}
        />
        <StatBox label="Reading Time" value={`${stats.readingTime} min`} />
        <StatBox
          label="Audience Level"
          value={stats.words > 0 ? analysis.audienceLabel : '-'}
        />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox
          label="Avg Sentence Length"
          value={`${stats.avgSentenceLength} words`}
        />
        <StatBox label="Avg Word Length" value={`${stats.avgWordLength} chars`} />
        <StatBox label="Total Syllables" value={stats.totalSyllables} />
        <StatBox label="Sentences" value={stats.sentences} />
      </div>
    </>
  );
}
