import { join as joinPath, isAbsolute as isAbsolutePath } from '@std/path';

export const LOCALE_REGEX = /^[a-z]{2}_[A-Z]{2}$/;

export const asAbsolutePath = (path: string): string => {
  return isAbsolutePath(path) ? path : joinPath(Deno.cwd(), path);
};

export const readRawTranslationMetadata = (path: string): Promise<string> => {
  return Deno.readTextFile(path);
};

export const writeRawTranslationMetadata = (path: string, rawTranslationMetadata: string): Promise<void> => {
  return Deno.writeTextFile(path, rawTranslationMetadata);
};

export const readRawTranslationContent = async (basePath: string, locale: string): Promise<string> => {
  if (!LOCALE_REGEX.test(locale)) {
    throw new Error(`Invalid locale "${locale}"!`);
  }
  return await Deno.readTextFile(joinPath(basePath, `${locale}.json`));
};

export const writeRawTranslationContent = async (basePath: string, locale: string, rawTranslations: string): Promise<void> => {
  if (!LOCALE_REGEX.test(locale)) {
    throw new Error(`Invalid locale "${locale}"!`);
  }
  return await Deno.writeTextFile(joinPath(basePath, `${locale}.json`), rawTranslations);
};
