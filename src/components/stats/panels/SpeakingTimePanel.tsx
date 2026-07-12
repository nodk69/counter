import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import type { PanelProps } from '../types';

export function SpeakingTimePanel({ stats }: PanelProps) {
  const speakingSeconds = Math.ceil((stats.words / 130) * 60);
  const speakingMins = Math.floor(speakingSeconds / 60);
  const speakingSecs = speakingSeconds % 60;
  const speakingFormatted =
    stats.words > 0
      ? speakingMins > 0
        ? `${speakingMins}m ${speakingSecs}s`
        : `${speakingSecs}s`
      : '-';

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox
          label="Speaking Time"
          value={`${stats.speakingTime} min`}
          isGreen
        />
        <StatBox label="Exact Speaking Time" value={speakingFormatted} isGreen />
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Speaking Speed" value="130 wpm" />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Paragraphs" value={stats.paragraphs} />
        <StatBox label="Reading Time" value={`${stats.readingTime} min`} />
        <StatBox
          label="Avg Sentence Length"
          value={`${stats.avgSentenceLength} words`}
        />
      </div>
    </>
  );
}
