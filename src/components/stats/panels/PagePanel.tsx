import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import type { PanelProps } from '../types';

export function PagePanel({ stats }: PanelProps) {
  const pagesDouble = stats.words > 0 ? (stats.words / 250).toFixed(2) : '0.00';
  const pagesSingle = stats.words > 0 ? (stats.words / 500).toFixed(2) : '0.00';

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox
          label="Pages (double-spaced)"
          value={pagesDouble}
          isGreen={stats.words > 0}
          sub="250 words/page"
        />
        <StatBox
          label="Pages (single-spaced)"
          value={pagesSingle}
          isGreen={stats.words > 0}
          sub="500 words/page"
        />
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Characters (spaces)" value={stats.charWithSpaces} />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Paragraphs" value={stats.paragraphs} />
        <StatBox label="Reading Time" value={`${stats.readingTime} min`} />
        <StatBox label="Speaking Time" value={`${stats.speakingTime} min`} />
      </div>
    </>
  );
}
