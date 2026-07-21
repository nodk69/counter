declare module 'write-good' {
  interface WriteGoodOptions {
    weasel?: boolean;
    illusion?: boolean;
    so?: boolean;
    thereIs?: boolean;
    passive?: boolean;
    adverb?: boolean;
    tooWordy?: boolean;
    cliches?: boolean;
    eprime?: boolean;
    checks?: Record<string, { fn: (text: string) => Array<{ index: number; offset: number }>; explanation: string }>;
    whitelist?: string[];
  }
  const writeGood: (text: string, opts?: WriteGoodOptions) => Array<{ reason: string; index: number; offset: number }>;
  export default writeGood;
}

declare module 'text-readability' {
  const readability: {
    fleschReadingEase: (text: string) => number;
    fleschKincaidGrade: (text: string) => number;
    gunningFog: (text: string) => number;
    smogIndex: (text: string) => number;
    colemanLiauIndex: (text: string) => number;
    automatedReadabilityIndex: (text: string) => number;
    textStandard: (text: string, useLowerCase?: boolean) => number;
  };
  export default readability;
}

declare module 'sentiment' {
  class Sentiment {
    analyze(text: string, options?: Record<string, unknown>): {
      score: number;
      comparative: number;
      calculation: Array<Record<string, number>>;
      tokens: string[];
      words: string[];
      positive: string[];
      negative: string[];
    };
  }
  export default Sentiment;
}
