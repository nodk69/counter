import { StatBox } from '../StatBox';
import { Divider } from '../Divider';
import { SectionHeading } from '../SectionHeading';
import type { PanelProps } from '../types';

export function KeywordPanel({ stats }: PanelProps) {
  const topKeyword = stats.wordDensity[0];
  const topDensity =
    topKeyword && stats.words > 0
      ? ((topKeyword.count / stats.words) * 100).toFixed(2)
      : '0.00';

  return (
    <>
      <div className="grid grid-cols-2 gap-1">
        <StatBox label="Total Words" value={stats.words} isGreen />
        <StatBox label="Unique Keywords" value={stats.uniqueWords} isGreen />
        <StatBox
          label="Top Keyword"
          value={topKeyword ? topKeyword.word : '-'}
          isGreen={!!topKeyword}
        />
        <StatBox
          label="Top Keyword Density"
          value={topKeyword ? `${topDensity}%` : '-'}
        />
      </div>
      <Divider />
      {stats.wordDensity.length > 0 && (
        <>
          <SectionHeading>Top Keywords</SectionHeading>
          <div className="px-4 pb-2 space-y-1">
            {stats.wordDensity.slice(0, 8).map(({ word, count }) => {
              const density =
                stats.words > 0
                  ? ((count / stats.words) * 100).toFixed(2)
                  : '0.00';
              const barWidth = Math.min(
                100,
                stats.wordDensity[0]
                  ? (count / stats.wordDensity[0].count) * 100
                  : 0
              );
              return (
                <div key={word} className="flex items-center gap-2 py-0.5">
                  <span className="font-mono text-xs text-foreground w-24 truncate flex-shrink-0">
                    {word}
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-12 text-right flex-shrink-0">
                    {density}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
