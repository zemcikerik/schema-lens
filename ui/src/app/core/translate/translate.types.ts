import { MessageFunction } from '@messageformat/core';

export type Translation = MessageFunction<'string'>;
export type Translations = Record<string, Translation>;
export type TranslationParams = Record<string, unknown> | unknown[];

export interface RawTranslations {
  [key: string]: string | RawTranslations;
}
