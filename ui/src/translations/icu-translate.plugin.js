import path from 'node:path';
import { readFile } from 'node:fs/promises';
import compileModule from '@messageformat/core/compile-module'
import MessageFormat from '@messageformat/core';

export const icuTranslatePlugin = {
  name: 'icu-translate',
  setup(build) {
    build.onResolve({ filter: /[a-z]{2}_[A-Z]{2}.json$/ }, args => ({
      path: path.resolve(args.resolveDir, args.path),
      namespace: 'icu-translate',
    }));

    build.onLoad({ filter: /.*/, namespace: 'icu-translate' }, async args => {
      const fileName = args.path.substring(args.path.length - 'XX_XX.json'.length);
      const [country] = fileName.split('_');
      const format = new MessageFormat(country);

      const contents = await readFile(args.path, 'utf8');
      const reducedTranslations = reduceTranslationKeys(JSON.parse(contents));
      const translations = compileModule(format, reducedTranslations);

      return { contents: translations, loader: 'js' };
    });
  }
};

const reduceTranslationKeys = translations => {
  const reducedTranslations = {};

  Object.entries(translations).forEach(([key, value]) => {
    if (typeof value === 'string') {
      reducedTranslations[key] = value;
      return;
    }

    Object.entries(reduceTranslationKeys(value)).forEach(([childKey, value]) => {
      reducedTranslations[`${key}.${childKey}`] = value;
    });
  });

  return reducedTranslations;
};

export default icuTranslatePlugin;
