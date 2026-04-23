import { InjectionToken, Signal } from '@angular/core';

export type Translation = (args?: TranslationParams) => string;
export type Translations = Record<string, Translation>;
export type TranslationParams = Record<string, unknown> | unknown[];

export interface TranslationContextProvider {
  getContext(): Signal<Record<string, unknown>>;
}

export const TRANSLATION_CONTEXT = new InjectionToken<TranslationContextProvider[]>('TRANSLATION_CONTEXT');
