import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import { SectionHeading } from '../SectionHeading';
import type { PanelProps } from '../types';

export function UniqueWordPanel({ stats, analysis }: PanelProps) {
  const uniqueRatio =
    stats.words > 0
      ? ((stats.uniqueWords / stats.words) * 100).toFixed(1)
      : '0.0';

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Unique Words" value={stats.uniqueWords} isGreen />
        <StatBox label="Total Words" value={stats.words} isGreen />
        <StatBox label="Unique Ratio" value={`${uniqueRatio}%`} isGreen={Number(uniqueRatio) >= 40} />
        <StatBox label="Vocab Diversity" value={analysis.ttrLabel} />
      </div>
      <Divider />
      {analysis.repeatedWords.length > 0 && (
        <>
          <SectionHeading>Most Repeated Words</SectionHeading>
          <div className="px-4 pb-2 space-y-1">
            {analysis.repeatedWords.map(({ word, count }) => (
              <div key={word} className="flex items-center justify-between py-0.5">
                <span className="font-mono text-xs text-foreground">{word}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {count}x
                </span>
              </div>
            ))}
          </div>
          <Divider />
        </>
      )}
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Paragraphs" value={stats.paragraphs} />
      </div>
    </>
  );
}
