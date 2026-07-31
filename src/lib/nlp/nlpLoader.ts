let nlpModule: any = null;
let writeGoodModule: any = null;
let readabilityModule: any = null;
let sentimentModule: any = null;
let loadingPromise: Promise<any> | null = null;

export function loadNlpLibs() {
  if (loadingPromise) return loadingPromise;

  loadingPromise = Promise.all([
    import('compromise'),
    import('write-good'),
    import('text-readability'),
    import('sentiment')
  ]).then(([nlp, writeGood, readability, sentiment]) => {
    nlpModule = nlp.default || nlp;
    writeGoodModule = writeGood.default || writeGood;
    readabilityModule = readability.default || readability;
    sentimentModule = sentiment.default || sentiment;
    return {
      nlp: nlpModule,
      writeGood: writeGoodModule,
      readability: readabilityModule,
      sentiment: sentimentModule,
    };
  });

  return loadingPromise;
}

export function getNlpLibs() {
  if (nlpModule && writeGoodModule && readabilityModule && sentimentModule) {
    return {
      nlp: nlpModule,
      writeGood: writeGoodModule,
      readability: readabilityModule,
      sentiment: sentimentModule,
    };
  }
  return null;
}
