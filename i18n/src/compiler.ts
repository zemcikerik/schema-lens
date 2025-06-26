import MessageFormatImp from '@messageformat/core';
import compileModuleImp from '@messageformat/core/compile-module.js';
import { join as joinPath } from '@std/path';
import esbuild from 'esbuild';
import { denoLoaderPlugin, denoResolverPlugin } from '@luca/esbuild-deno-loader';

// https://github.com/denoland/deno/issues/24769
const MessageFormat = MessageFormatImp as unknown as typeof MessageFormatImp.default;
const compileModule = compileModuleImp as unknown as typeof compileModuleImp.default;

interface RawTranslations {
  [key: string]: string | RawTranslations;
}

type FlattenedRawTranslations = Record<string, string>;
type Translations = Record<string, (...args: unknown[]) => string>;

export const compileRawTranslations = async (locale: string, rawTranslationJson: string): Promise<string> => {
  const translations = flattenTranslations(JSON.parse(rawTranslationJson));
  const translationsJs = compileTranslationsToJs(locale, translations);
  const bundledBodyJs = await bundleAndMinifyTranslationsIntoFunctionBody(translationsJs);
  verifyAllTranslationsIncludedInFunctionBodyJs(translations, bundledBodyJs);
  return bundledBodyJs;
};

const flattenTranslations = (translations: RawTranslations): FlattenedRawTranslations => {
  const flattenedTranslations: FlattenedRawTranslations = {};

  for (const [key, value] of Object.entries(translations)) {
    if (typeof value === 'string') {
      flattenedTranslations[key] = value;
      continue;
    }

    for (const [childKey, childValue] of Object.entries(flattenTranslations(value))) {
      flattenedTranslations[`${key}.${childKey}`] = childValue;
    }
  }

  return flattenedTranslations;
};

const compileTranslationsToJs = (locale: string, translations: FlattenedRawTranslations): string => {
  const [country] = locale.split('_');
  const format = new MessageFormat(country);
  return compileModule(format, translations);
};

const bundleAndMinifyTranslationsIntoFunctionBody = async (translationsJs: string): Promise<string> => {
  const configPath = joinPath(Deno.cwd(), 'deno.json');
  const lockPath = joinPath(Deno.cwd(), 'deno.lock');

  const translationSourcePath = await Deno.makeTempFile({ prefix: 'schema-lens_i18n_', suffix: '.js' });
  await Deno.writeTextFile(translationSourcePath, translationsJs);

  try {
    const result = await esbuild.build({
      plugins: [
        denoResolverPlugin({ configPath }),
        denoLoaderPlugin({ loader: 'native', configPath, lockPath, nodeModulesDir: 'none' }),
      ],
      entryPoints: [translationSourcePath],
      platform: 'browser',
      format: 'iife',
      charset: 'utf8',
      globalName: 'translations',
      footer: {
        js: 'return translations.default;',
      },
      bundle: true,
      treeShaking: true,
      minify: true,
      write: false,
    });

    return new TextDecoder('utf-8').decode(result.outputFiles[0].contents);
  } finally {
    await Deno.remove(translationSourcePath);
  }
};

const verifyAllTranslationsIncludedInFunctionBodyJs = (translations: FlattenedRawTranslations, bodyJs: string): void => {
  const outputTranslations: Translations = new Function(bodyJs)();
  const expectedTranslationKeys = new Set(Object.keys(translations));

  const missingTranslationKeys = Object.keys(outputTranslations)
    .filter(translationKey => !expectedTranslationKeys.has(translationKey))
    .map(translationKey => translationKey.replaceAll('\\', '\\\\').replaceAll('"', '\\"'))
    .map(escapedTranslationKey => `"${escapedTranslationKey}"`)
    .join(',');

  if (missingTranslationKeys.length > 0) {
    throw new Error(`Missing translation keys in final output: ${missingTranslationKeys}.`);
  }
};
