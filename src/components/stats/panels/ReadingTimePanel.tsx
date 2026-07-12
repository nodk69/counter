import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import { fleschLabel } from '../helpers';
import type { PanelProps } from '../types';

export function ReadingTimePanel({ stats }: PanelProps) {
  const readingSeconds = Math.ceil((stats.words / 200) * 60);
  const readingMins = Math.floor(readingSeconds / 60);
  const readingSecs = readingSeconds % 60;
  const readingFormatted =
    stats.words > 0
      ? readingMins > 0
        ? `${readingMins}m ${readingSecs}s`
        : `${readingSecs}s`
      : '-';

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Reading Time" value={`${stats.readingTime} min`} isGreen />
        <StatBox label="Exact Reading Time" value={readingFormatted} isGreen />
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Reading Speed" value="200 wpm" />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Paragraphs" value={stats.paragraphs} />
        <StatBox label="Speaking Time" value={`${stats.speakingTime} min`} />
        <StatBox
          label="Flesch Score"
          value={stats.fleschKincaid}
          sub={stats.words > 0 ? fleschLabel(stats.fleschKincaid) : undefined}
        />
      </div>
    </>
  );
}
