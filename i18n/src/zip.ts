import { strToU8, zip } from 'fflate';

export const zipRawTranslations = (translationRecords: Record<string, string>): Promise<Uint8Array> => {
  const zipStructure = Object.fromEntries(
    Object.entries(translationRecords)
      .map(([locale, rawTranslationJson]) => [`${locale}.json`, strToU8(rawTranslationJson)])
  );

  return new Promise((resolve, reject) => {
    zip(zipStructure, { level: 6 }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
};
