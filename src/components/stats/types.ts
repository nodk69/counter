import { useTextStats } from '@/hooks/useTextStats';
import { useContentAnalysis } from '@/hooks/useContentAnalysis';

export interface PanelProps {
  stats: ReturnType<typeof useTextStats>;
  analysis: ReturnType<typeof useContentAnalysis>;
}

export interface StatBoxProps {
  label: string;
  value: string | number;
  isGreen?: boolean;
  className?: string;
  sub?: string;
}
